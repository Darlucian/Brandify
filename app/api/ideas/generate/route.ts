import { NextResponse } from "next/server";
import { z } from "zod";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";

const ideaSchema = z.object({
  type: z.enum(["video", "text", "carousel", "livestream"]),
  hook: z.string().trim().min(8).max(180),
  concept: z.string().trim().min(20).max(1000),
  platform_fit: z.array(z.string().trim().min(1).max(30)).min(1).max(4),
  format_guidance: z.string().trim().min(10).max(500),
  visual_guidance: z.string().trim().min(10).max(500),
  why_this_works: z.string().trim().min(10).max(500),
  tools_needed: z.array(z.string().trim().min(1).max(80)).min(1).max(3),
  effort: z.string().trim().min(5).max(100),
  first_step: z.string().trim().min(5).max(240),
});

const generatedIdeasSchema = z.object({
  ideas: z.array(ideaSchema).length(3),
});

const requestSchema = z.object({
  prompt: z.string().trim().max(500).optional(),
  platform: z
    .enum(["all", "instagram", "tiktok", "youtube", "linkedin", "x"])
    .optional(),
});

const geminiPayloadSchema = z.object({
  candidates: z
    .array(
      z.object({
        finishReason: z.string().optional(),
        content: z
          .object({
            parts: z
              .array(z.object({ text: z.string().optional() }))
              .optional(),
          })
          .optional(),
      })
    )
    .optional(),
});

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL;

  if (!apiKey || !model) {
    return NextResponse.json(
      { error: "AI generation is not configured on the server." },
      { status: 503 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const parsedBody = requestSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }

  const { prompt, platform } = parsedBody.data;

  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        "niche, creator_type, follower_range, goals, struggles, onboarding_completed"
      )
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Complete onboarding before generating ideas." },
        { status: 400 }
      );
    }

    if (!profile.onboarding_completed || !profile.niche) {
      return NextResponse.json(
        { error: "Complete onboarding before generating ideas." },
        { status: 400 }
      );
    }

    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!redisUrl || !redisToken) {
      return NextResponse.json(
        { error: "Generation is temporarily unavailable." },
        { status: 503 }
      );
    }

    const limiter = new Ratelimit({
      redis: new Redis({ url: redisUrl, token: redisToken }),
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      prefix: "link-pro:ideas",
    });

    const { success, reset } = await limiter.limit(user.id);

    if (!success) {
      const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));

      return NextResponse.json(
        {
          error:
            "You’ve reached the idea generation limit. Please try again later.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter) },
        }
      );
    }

    const creatorContext = {
      niche: profile.niche,
      creatorType: profile.creator_type,
      audienceSize: profile.follower_range,
      goals: profile.goals,
      struggles: profile.struggles,
    };

    const userRequest = prompt?.trim()
      ? `User request: ${prompt.trim()}`
      : "User request: Create a fresh batch of ideas based on my profile.";

    const platformFocus =
      platform && platform !== "all"
        ? `Preferred platform: ${platform}.`
        : "Preferred platform: all major content platforms.";

    const normalizedModel = model.toLowerCase();
    const thinkingConfig = normalizedModel.startsWith("gemini-2.5")
      ? { thinkingBudget: 0 }
      : normalizedModel.startsWith("gemini-3")
        ? { thinkingLevel: "MINIMAL" as const }
        : undefined;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
Generate exactly 3 distinct, practical content ideas for this creator.
Use the creator context and user request to personalize them.
Balance the ideas across suitable formats and platforms.
Do not promise virality.

For tools_needed, return 1 to 3 short strings describing tool types.
Include no more than two well-known examples per type. Mention a free
option when one exists. Never invent tools. Do not include URLs or prices.

Keep effort brief, such as "About 20 minutes, phone only".
Make first_step one concrete action the creator can do in five minutes.

Creator context:
${JSON.stringify(creatorContext)}

${userRequest}

${platformFocus}

Return only valid JSON in this structure:
{
  "ideas": [
    {
      "type": "video",
      "hook": "short hook text",
      "concept": "what the creator should make",
      "platform_fit": ["instagram"],
      "format_guidance": "practical instructions",
      "visual_guidance": "visual direction",
      "why_this_works": "why it matches the audience",
      "tools_needed": ["Editing app (CapCut, DaVinci Resolve; free option: CapCut)"],
      "effort": "About 20 minutes, phone only",
      "first_step": "Write three opening lines in your notes app"
    }
  ]
}
`,
                },
              ],
            },
          ],
       generationConfig: {
  temperature: 0.7,
  maxOutputTokens: 8192,
},
        }),
      }
    );

    if (!geminiResponse.ok) {
      const raw = await geminiResponse.text();
      console.error("Gemini upstream failed:", {
        status: geminiResponse.status,
        raw,
      });

      return NextResponse.json(
        { error: "Idea generation failed. Please try again." },
        { status: 502 }
      );
    }

    const providerPayload: unknown = await geminiResponse.json();
    const parsedProviderPayload = geminiPayloadSchema.safeParse(providerPayload);

    if (!parsedProviderPayload.success) {
      console.error(
        "Gemini returned an unexpected response payload",
        parsedProviderPayload.error.issues
      );

      return NextResponse.json(
        { error: "The AI returned an invalid response. Please try again." },
        { status: 502 }
      );
    }

    const candidate = parsedProviderPayload.data.candidates?.[0];

    if (candidate?.finishReason && candidate.finishReason !== "STOP") {
      console.warn("Gemini generation finished early", {
        finishReason: candidate.finishReason,
      });
    }

    const text = candidate?.content?.parts?.find(
      (part) => typeof part.text === "string"
    )?.text;

    if (!text) {
      return NextResponse.json(
        { error: "The AI returned an empty response. Please try again." },
        { status: 502 }
      );
    }

    let parsedOutput: unknown;

    try {
      const normalizedText = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();

      parsedOutput = JSON.parse(normalizedText);
    } catch {
      return NextResponse.json(
        { error: "The AI response was not valid JSON. Please try again." },
        { status: 502 }
      );
    }

    const validation = generatedIdeasSchema.safeParse(parsedOutput);

    if (!validation.success) {
      console.error(
        "AI idea response failed validation",
        validation.error.issues
      );

      return NextResponse.json(
        { error: "The AI returned incomplete ideas. Please try again." },
        { status: 502 }
      );
    }

    const rows = validation.data.ideas.map((idea) => ({
      user_id: user.id,
      ...idea,
      status: "suggested",
      source: "manual",
    }));

    const { data: savedIdeas, error: insertError } = await supabase
      .from("ideas")
      .insert(rows)
      .select();

    if (insertError) {
      console.error("Could not persist generated ideas", insertError.message);

      return NextResponse.json(
        { error: "Ideas were generated but could not be saved." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ideas: savedIdeas }, { status: 201 });
  } catch (error) {
    console.error("Idea generation error", error);

    return NextResponse.json(
      { error: "Something went wrong while generating ideas." },
      { status: 500 }
    );
  }
}
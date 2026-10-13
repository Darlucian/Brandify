"use server";

import { supabaseAdmin } from "@/app/lib/supabase-admin";

export type GeneratedIdea = {
  type: "video" | "text" | "carousel" | "livestream";
  hook: string;
  concept: string;
  platform_fit: string[];
  format_guidance: string;
  visual_guidance: string;
  why_this_works: string;
};

export async function createIdeasForUser(
  userId: string,
  ideas: GeneratedIdea[]
) {
  if (!userId) {
    throw new Error("User id is required");
  }

  const rows = ideas.map((idea) => ({
    user_id: userId,
    type: idea.type,
    hook: idea.hook,
    concept: idea.concept,
    platform_fit: idea.platform_fit,
    format_guidance: idea.format_guidance,
    visual_guidance: idea.visual_guidance,
    why_this_works: idea.why_this_works,
    status: "suggested",
    source: "manual",
    created_at: new Date().toISOString(),
  }));

  const { data, error } = await supabaseAdmin
    .from("ideas")
    .insert(rows)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
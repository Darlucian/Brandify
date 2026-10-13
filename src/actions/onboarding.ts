"use server";

import { z } from "zod";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";

const onboardingSchema = z.object({
  niche: z.string().trim().min(1).max(100),
  followerRange: z.enum([
    "under_500",
    "500_1000",
    "1000_5000",
    "5000_10000",
    "over_10000",
  ]),
  creatorType: z.enum(["new", "growing", "established", "brand", "goals", "struggles"]),
  goals: z.array(z.string().trim().min(1).max(50)).max(10),
  struggles: z.array(z.string().trim().min(1).max(50)).max(10),
});

export type OnboardingPayload = z.infer<typeof onboardingSchema>;

export async function saveOnboardingProfile(input: OnboardingPayload) {
  const payload = onboardingSchema.parse(input);
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be signed in to save onboarding.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        niche: payload.niche,
        follower_range: payload.followerRange,
        creator_type: payload.creatorType,
        goals: payload.goals,
        struggles: payload.struggles,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (error) {
    throw new Error(`Unable to save your profile: ${error.message}`);
  }

  return data;
}
"use server";

import { supabaseAdmin } from "@/app/lib/supabase-admin";

export type OnboardingPayload = {
  niche: string;
  followerRange: string;
  creatorType: string;
  goals: string[];
  struggles: string[];
};

export async function saveOnboardingProfile(
  userId: string,
  payload: OnboardingPayload
) {
  if (!userId) {
    throw new Error("User id is required");
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .upsert(
      {
        id: userId,
        niche: payload.niche,
        follower_range: payload.followerRange,
        creator_type: payload.creatorType,
        goals: payload.goals,
        struggles: payload.struggles,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "id",
      }
    )
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
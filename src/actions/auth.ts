import { supabaseAdmin } from "@/app/lib/supabase-admin";
import type { Profile } from "@/app/types/supabase";
import type { User } from "@supabase/supabase-js";

export async function upsertProfileFromSupabaseUser(
  user: User
): Promise<Profile | null> {
  if (!user.id) {
    return null;
  }

  const metadata = user.user_metadata ?? {};

  const fullName =
    typeof metadata.full_name === "string" && metadata.full_name.trim()
      ? metadata.full_name
      : [metadata.first_name, metadata.last_name].filter(Boolean).join(" ") ||
        user.email?.split("@")[0] ||
        null;

  const username =
    typeof metadata.username === "string" && metadata.username.trim()
      ? metadata.username
      : null;

  const avatarUrl =
    typeof metadata.avatar_url === "string" && metadata.avatar_url.trim()
      ? metadata.avatar_url
      : null;

  const bio =
    typeof metadata.bio === "string" && metadata.bio.trim()
      ? metadata.bio
      : null;

  const profession =
    typeof metadata.profession === "string" && metadata.profession.trim()
      ? metadata.profession
      : null;

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .upsert(
      {
        id: user.id,
        full_name: fullName,
        username,
        avatar_url: avatarUrl,
        bio,
        profession,
      },
      {
        onConflict: "id",
      }
    )
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to sync authenticated user: ${error.message}`);
  }

  return data;
}

export async function onSignUpUser(user?: User): Promise<Profile | null> {
  if (!user) {
    return null;
  }

  return upsertProfileFromSupabaseUser(user);
}

export async function onSignInUser(user?: User): Promise<Profile | null> {
  if (!user) {
    return null;
  }

  return upsertProfileFromSupabaseUser(user);
}
"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { saveOnboardingProfile, type OnboardingPayload, } from "@/src/actions/onboarding";
export function useOnboardingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (values: OnboardingPayload) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const {
        data: {user},
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("You must be signed in to continue.");
        
      }
      await saveOnboardingProfile(user.id, values);
      return true;
  } catch (submitError) {
    setError(
      submitError instanceof Error
      ? submitError.message
      : "Something went wrong."
    );
    return false;
  } finally {
    setIsSubmitting(false);
  }
}
return {
  submit,
  isSubmitting,
  error,
};
}

 
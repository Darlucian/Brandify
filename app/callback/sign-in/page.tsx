"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function SignInCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const completeSignIn = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
          router.replace("/dashboard");
          return;
        }
      }

      router.replace("/login");
    };

    completeSignIn();
  }, [router]);

  return <p>Completing sign in...</p>;
}
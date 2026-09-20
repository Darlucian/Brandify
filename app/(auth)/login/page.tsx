"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/seperator";

export default function LoginPage() {
  const router = useRouter();
 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/onboarding");
  };

  const handleGoogleSignIn = async () => {
    setError("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/callback/sign-in`,
      },
    });

    if (error) {
      setError(error.message);
    }
  };
  const handleXSignIn = async () => {
  setError("");

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "x",
    options: {
      redirectTo: `${window.location.origin}/callback/sign-in`,
    },
  });

  
  if (error) {
    setError(error.message);
  }
};

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          {/* <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-500">
            Welcome back
          </p> */}
          <h1 className="mt-2 text-4xl font-bold text-gray-900 ">Brandify..</h1>
          <h5 className="mt-2 text-base font-semibold">Login</h5>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:bg-white"
            />
          </div>

          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
    <div className="my-10 w-full relative p-3">
        <div className=" p-3 absolute text-themeTextGray text-xs top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          OR CONTINUE WITH
        </div>
        <Separator orientation="horizontal" className="bg-themeGray" />
      </div>

     <div className="w-full">
           <div className="mt-4 w-32 m-auto">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
          Google
          </Button>
        </div>
        <div className="mt-4">
   <Button
    type="button"
    variant="outline"
    className="w-full"
    onClick={handleXSignIn}
     >
   X
  </Button>
  </div>
     </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-orange-600 hover:text-orange-500">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}

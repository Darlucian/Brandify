import { redirect } from "next/navigation";

export default async function SignInCallbackPage() {
  redirect("/dashboard");
}
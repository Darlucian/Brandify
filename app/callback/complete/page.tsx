import { redirect } from "next/navigation";

export default async function CompleteCallbackPage() {
  redirect("/dashboard");
}
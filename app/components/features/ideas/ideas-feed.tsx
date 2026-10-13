import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { IdeaCard } from "@/app/components/features/ideas/idea-card";
import { CircleHelpIcon } from "lucide-react";

// We need some kind of scroll behavior of the idea card as the name suggests.
// Unless the idea card does something different we can make do if possible

export async function IdeasFeed() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return (
      <p className="text-[#6B5F5A] flex text-sm gap-2"><CircleHelpIcon aria-hidden="true" size={15}/>Nothing to see here</p>
 
    ) 
  }

  const { data: ideas, error } = await supabase
    .from("ideas")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "suggested")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  if (!ideas || ideas.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <p className="text-lg font-medium text-slate-700">No ideas yet</p>
        <p className="mt-2 text-sm text-slate-500">
          Generate your first content ideas to get started.
        </p>
      </div>
    );
  }

  return (
   <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
      {ideas.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </div>
  );
}
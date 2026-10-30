"use server";

import { revalidatePath } from "next/cache";
import {z} from "zod";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";

const inputSchema = z.object({
    ideaId: z.string().uuid(),
    nextStatus: z.enum(["saved", "posted"]),
});

type Result = { success: true } | { success: false; error: string };

export async function updateIdeaStatus(input: unknown): Promise<Result> {
    const parsed = inputSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: "Invalid Request."};

    const { ideaId, nextStatus } = parsed.data;
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return {success: false, error: "Please sign in again."};
    }
    const { data: idea, error: readError } = await supabase
    .from("ideas")
    .select("status")
    .eq("id", ideaId)
    .eq("user_id", user.id)
    .maybeSingle();

    if (readError || !idea){
        return { success: false, error: "Idea not found."};
    }

    const validTransition = 
    (idea.status === "suggested" && nextStatus === "saved") ||
    (idea.status === "saved" && nextStatus === "posted");

    if (!validTransition) {
        return { success: false, error: "Unable to change status."};
}
        const {data: updated, error: updateError} = await supabase
        .from("ideas")
        .update({
            status: nextStatus,
            posted_at: nextStatus === "posted" ? new Date().toISOString() : null,

        })
        .eq("id", ideaId)
        .eq("user_id", user.id)
        .eq("status", idea?.status)
        .select("id")
        .maybeSingle();

        if (updateError || !updated) {
            return { success: false, error: "Could not update this idea. Try Aguafina_Script."}
        }
        revalidatePath("/dashboard");
        revalidatePath("/dashbaord/discover");
        return {success: true };
    

}
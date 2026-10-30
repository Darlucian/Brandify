"use client";

import { useState } from "react";
import { BookmarkPlus, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/app/components/ui/button";
import { updateIdeaStatus } from "@/src/actions/idea-status";

export function IdeaStatusActions({
  ideaId,
  status,
}: {
  ideaId: string;
  status: string;
}) {
  const [pending, setPending] = useState(false);
  const nextStatus =
    status === "suggested" ? "saved" : status === "saved" ? "posted" : null;

  if (!nextStatus) return null;

  const isPosting = nextStatus === "posted";

  async function handleUpdate() {
    setPending(true);
    try {
      const result = await updateIdeaStatus({ ideaId, nextStatus });
      if (!result.success) throw new Error(result.error);

      toast.success(isPosting ? "Idea marked as posted" : "Idea saved");
    } catch (error) {
      toast.error("Could not update idea", {
        description: error instanceof Error ? error.message : "Try again.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      variant={isPosting ? "default" : "outline"}
      disabled={pending}
      onClick={handleUpdate}
      className={isPosting ? "bg-[#1B4B43] hover:bg-[#153D36]" : ""}
    >
      {isPosting ? (
        <Send aria-hidden="true" />
      ) : (
        <BookmarkPlus aria-hidden="true" />
      )}
      {pending ? "Updating..." : isPosting ? "Mark as posted" : "Save"}
    </Button>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ChevronDown, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { motion, useReducedMotion } from "framer-motion";

const platformOptions = [
  { value: "all", label: "All platforms" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "x", label: "X" },
];

const promptSuggestions = [
  {
    label: "I’m out of ideas",
    prompt: "I’m not sure what to post. Give me fresh ideas that fit my niche and goals.",
  },
  {
    label: "Make it story-led",
    prompt: "Help me turn a recent experience into a relatable story-led post with a clear point.",
  },
  {
    label: "Keep it professional",
    prompt: "Suggest a useful, professional post that demonstrates my expertise without sounding salesy.",
  },
  {
    label: "Share behind the scenes",
    prompt: "Give me an authentic behind-the-scenes post idea that helps my audience connect with me.",
  },
];
 

export function GenerateIdeasButton() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState("all");

  const selectedPlatform =
    platformOptions.find((option) => option.value === platform)?.label ??
    "All platforms";

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch("/api/ideas/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          platform,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;

        throw new Error(payload?.error ?? "Could not generate ideas. Please try again.");
      }

      toast.success("Ideas are ready", {
        description: "Your new ideas have been added to the idea feed.",
      });

      router.refresh();
    } catch (error) {
      toast.error("Could not generate ideas", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.section
      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.25,
        ease: "easeOut",
      }}
      className="rounded-xl border border-[#B4B0AE]/50 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#E0431F]/10 text-[#E0431F]">
          <Sparkles aria-hidden="true" className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="font-medium text-[#241C1C]">
            What would you like to create?
          </h2>
          <p className="mt-1 text-sm leading-5 text-[#6B5F5A]">
            Add a little context, or choose a starting point.
          </p>
        </div>
      </div>

      <label htmlFor="idea-prompt" className="sr-only">
        Describe the content you want ideas for
      </label>
      <textarea
        id="idea-prompt"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        maxLength={500}
        placeholder="A topic, moment, audience question, or goal..."
        className="mt-4 min-h-24 w-full resize-y rounded-lg border border-[#B4B0AE]/50 bg-[#FBF8F4] px-3 py-3 text-sm leading-6 text-[#241C1C] outline-none transition placeholder:text-[#6B5F5A]/75 focus:border-[#1B4B43] focus:bg-white focus:ring-2 focus:ring-[#1B4B43]/10"
      />

      <div className="mt-3">
        <p className="mb-2 text-xs font-medium text-[#6B5F5A]">
          Try a direction
        </p>
        <div className="flex flex-wrap gap-2">
          {promptSuggestions.map((suggestion) => (
            <button
              key={suggestion.label}
              type="button"
              onClick={() => setPrompt(suggestion.prompt)}
              disabled={isGenerating}
              className="rounded-full border border-[#B4B0AE]/50 bg-white px-3 py-1.5 text-xs font-medium text-[#6B5F5A] transition hover:border-[#1B4B43]/50 hover:bg-[#1B4B43]/[0.04] hover:text-[#1B4B43] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4B43] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-[#B4B0AE]/30 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between border-[#B4B0AE]/50 bg-white text-[#241C1C] sm:w-auto sm:min-w-40"
              disabled={isGenerating}
            >
              <span className="truncate">{selectedPlatform}</span>
              <ChevronDown aria-hidden="true" className="ml-2 size-4 text-[#6B5F5A]" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Choose a platform</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={platform}
              onValueChange={setPlatform}
            >
              {platformOptions.map((option) => (
                <DropdownMenuRadioItem
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full gap-2 bg-[#1B4B43] text-white hover:bg-[#153D36] sm:w-auto"
        >
          <span>{isGenerating ? "Generating..." : "Generate ideas"}</span>
          {!isGenerating ? (
            <ArrowUpRight aria-hidden="true" className="size-4" />
          ) : null}
        </Button>
      </div>
    </motion.section>
  );
}
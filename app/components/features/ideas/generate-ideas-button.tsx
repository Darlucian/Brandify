"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
// every ai can write a post, what if one can detect if you have no idea on what to post
// then asks for your kind of person/personality and tailors post inline with who you are so it looks personalized
// and then if you know what to post but notnow to put it, it asks for a background story of what's going on and 
// stuff surrounding it and creates a post with a touch of storyline and drives the point
// also users can choose between post being professional, storylike, brandlike, etc

export function GenerateIdeasButton() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState("all");

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

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
        const payload = await response.json();
        throw new Error(payload.error || "Failed to generate ideas");
      }

      window.location.reload();
    } catch (generateError) {
      setError(
        generateError instanceof Error
          ? generateError.message
          : "Failed to generate ideas"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {/* <label className="mb-2 block text-sm font-medium text-slate-700">
          What kind of content do you want?
        </label> */}

        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="I want ideas for a short TikTok series about beauty routines for busy mothers..."
          className="min-h-110px w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
        />

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-220px">
            <label className="mb-1 block text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
              Platform
            </label>

            <select
              value={platform}
              onChange={(event) => setPlatform(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
            >
              <option value="all">All platforms</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
              <option value="linkedin">LinkedIn</option>
              <option value="x">X</option>
            </select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto"
          >
            {isGenerating ? "Generating..." : "Generate ideas"}
          </Button>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
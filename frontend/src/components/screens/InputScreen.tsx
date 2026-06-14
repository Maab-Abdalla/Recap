"use client";

import { useState } from "react";
import { NavBar } from "@/components/ui/NavBar";
import { Button } from "@/components/ui/Button";
import { SAMPLE_TRANSCRIPT } from "@/lib/sampleTranscript";

interface InputScreenProps {
  error: string | null;
  onProcess: (transcript: string) => void;
}

export function InputScreen({ error, onProcess }: InputScreenProps) {
  const [text, setText] = useState("");

  return (
    <div className="px-7 py-8 sm:px-10 sm:py-10">
      <NavBar screen="input" />

      <div className="stagger">
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-galaxy leading-tight">
          Turn your meeting into tasks
        </h1>
        <p className="mt-2 text-sm text-universe max-w-md">
          Paste a transcript and Recap pulls out the action items, owners, and
          deadlines for you.
        </p>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <label className="mt-7 block text-[10px] font-semibold uppercase tracking-[0.14em] text-universe">
          Meeting transcript
        </label>
        <textarea
          className="mt-2 w-full h-60 resize-y rounded-2xl border border-venus/60 bg-meteor/40 px-4 py-3.5 text-sm text-galaxy leading-relaxed placeholder:text-universe/50 focus:outline-none focus:border-planetary focus:bg-white focus:ring-2 focus:ring-planetary/20 transition-all scroll-panel"
          placeholder="Paste your meeting notes or transcript here…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            disabled={!text.trim()}
            onClick={() => onProcess(text)}
          >
            Process meeting
          </Button>

          <Button variant="secondary" onClick={() => setText(SAMPLE_TRANSCRIPT)}>
            Load demo transcript
          </Button>
        </div>
      </div>
    </div>
  );
}

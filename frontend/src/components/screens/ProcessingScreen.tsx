"use client";

import { useEffect, useState } from "react";
import { NavBar } from "@/components/ui/NavBar";
import { cn } from "@/lib/utils";

const STEPS = [
  "Reading the transcript",
  "Extracting action items & owners",
  "Writing the meeting summary",
  "Preparing your review",
];

export function ProcessingScreen() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-7 py-8 sm:px-10 sm:py-10">
      <NavBar screen="processing" />

      <div className="animate-fade-up">
        <h1 className="font-serif text-2xl sm:text-3xl font-medium text-galaxy">
          Reading the room…
        </h1>
        <p className="mt-2 text-sm text-universe">
          This usually takes a few seconds.
        </p>

        <div className="mt-7 rounded-2xl border border-venus/50 bg-meteor/30 p-2">
          {STEPS.map((step, i) => {
            const isDone = i < activeStep;
            const isActive = i === activeStep;
            return (
              <div
                key={step}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 transition-colors"
                style={{ backgroundColor: isActive ? "rgba(208,227,255,0.45)" : "transparent" }}
              >
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                  {isDone ? (
                    <svg viewBox="0 0 20 20" className="h-5 w-5 text-universe">
                      <circle cx="10" cy="10" r="9" className="fill-universe/15" />
                      <path
                        d="M6 10.5l2.5 2.5L14 7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : isActive ? (
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-planetary/50" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-galaxy" />
                    </span>
                  ) : (
                    <span className="h-2.5 w-2.5 rounded-full bg-venus/60" />
                  )}
                </span>
                <span
                  className={cn("text-sm transition-colors", {
                    "text-galaxy font-medium": isActive,
                    "text-universe": isDone,
                    "text-universe/50": !isDone && !isActive,
                  })}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

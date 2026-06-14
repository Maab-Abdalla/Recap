"use client";

import { useState } from "react";
import { useProcessMeeting } from "@/hooks/useProcessMeeting";
import { InputScreen } from "@/components/screens/InputScreen";
import { ProcessingScreen } from "@/components/screens/ProcessingScreen";
import { ReviewScreen } from "@/components/screens/ReviewScreen";
import { SuccessScreen } from "@/components/screens/SuccessScreen";

export default function HomePage() {
  const {
    screen,
    transcript,
    extraction,
    confirmResult,
    error,
    isLoading,
    process,
    confirm,
    reset,
  } = useProcessMeeting();

  // Keep the final item list for the success screen
  const [confirmedItems, setConfirmedItems] = useState(
    extraction?.actionItems ?? []
  );

  async function handleConfirm(
    items: import("@/types").ActionItem[],
    emails: string[],
    notionDbId: string
  ) {
    setConfirmedItems(items);
    await confirm(items, emails, notionDbId);
  }

  return (
    <main className="min-h-screen flex flex-col px-4 sm:px-6">
      <div className="flex-1 w-full max-w-3xl mx-auto py-8 sm:py-12">
        <div
          key={screen}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-card border border-venus/40 min-h-[540px] animate-scale-in"
        >
          {screen === "input" && (
            <InputScreen error={error} onProcess={process} />
          )}
          {screen === "processing" && <ProcessingScreen />}
          {screen === "review" && extraction && (
            <ReviewScreen
              transcript={transcript}
              extraction={extraction}
              isLoading={isLoading}
              error={error}
              onConfirm={handleConfirm}
              onBack={reset}
            />
          )}
          {screen === "success" && confirmResult && (
            <SuccessScreen
              result={confirmResult}
              actionItems={confirmedItems}
              onReset={reset}
            />
          )}
        </div>
      </div>
    </main>
  );
}

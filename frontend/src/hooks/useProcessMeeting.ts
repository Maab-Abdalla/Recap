"use client";

import { useState, useCallback } from "react";
import { processTranscript, confirmAndSend } from "@/lib/api";
import { saveSession } from "@/lib/db";
import { getSessionKey } from "@/lib/sessionKey";
import { generateId } from "@/lib/utils";
import type {
  Screen,
  MeetingExtraction,
  ActionItem,
  ConfirmResponse,
} from "@/types";

export function useProcessMeeting() {
  const [screen, setScreen] = useState<Screen>("input");
  const [transcript, setTranscript] = useState("");
  const [extraction, setExtraction] = useState<MeetingExtraction | null>(null);
  const [confirmResult, setConfirmResult] = useState<ConfirmResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const process = useCallback(async (raw: string) => {
    if (!raw.trim()) return;
    setTranscript(raw);
    setError(null);
    setScreen("processing");
    setIsLoading(true);

    try {
      const res = await processTranscript({ transcript: raw });
      const items: ActionItem[] = res.extraction.actionItems.map((a) => ({
        ...a,
        id: generateId(),
      }));
      setExtraction({ ...res.extraction, actionItems: items });
      setScreen("review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setScreen("input");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirm = useCallback(
    async (
      actionItems: ActionItem[],
      attendeeEmails: string[],
      notionDatabaseId: string
    ) => {
      if (!extraction) return;
      setError(null);
      setIsLoading(true);

      try {
        const res = await confirmAndSend({
          actionItems,
          attendeeEmails,
          notionDatabaseId,
          summary: extraction.summary,
          decisions: extraction.decisions,
          rawTranscript: transcript,
        });
        setConfirmResult(res);

        // Persist session to Supabase (non-blocking)
        saveSession(getSessionKey(), transcript, extraction, res).catch(
          () => {}
        );

        setScreen("success");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    [extraction, transcript]
  );

  const reset = useCallback(() => {
    setScreen("input");
    setTranscript("");
    setExtraction(null);
    setConfirmResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    screen,
    transcript,
    extraction,
    confirmResult,
    error,
    isLoading,
    process,
    confirm,
    reset,
  };
}

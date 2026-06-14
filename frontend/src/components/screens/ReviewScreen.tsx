"use client";

import { useState } from "react";
import { NavBar } from "@/components/ui/NavBar";
import { Button } from "@/components/ui/Button";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { parseEmailList, generateId } from "@/lib/utils";
import { useSettings } from "@/hooks/useSettings";
import {
  DEMO_NOTION_DATABASE_ID,
  DEMO_NOTION_BOARD_URL,
} from "@/lib/sampleTranscript";
import type { ActionItem, MeetingExtraction, Priority } from "@/types";

interface ReviewScreenProps {
  transcript: string;
  extraction: MeetingExtraction;
  isLoading: boolean;
  error: string | null;
  onConfirm: (
    items: ActionItem[],
    emails: string[],
    notionDatabaseId: string
  ) => void;
  onBack: () => void;
}

export function ReviewScreen({
  transcript,
  extraction,
  isLoading,
  error,
  onConfirm,
  onBack,
}: ReviewScreenProps) {
  const { settings } = useSettings();
  const [items, setItems] = useState<ActionItem[]>(extraction.actionItems);
  const [emails, setEmails] = useState(settings.defaultEmails || "");
  const [notionDbId, setNotionDbId] = useState(
    settings.notionDatabaseId || DEMO_NOTION_DATABASE_ID
  );

  function removeItem(id: string) {
    setItems((prev) => prev.filter((a) => a.id !== id));
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        id: generateId(),
        task: "New action item",
        owner: "Unassigned",
        deadline: "TBD",
        priority: "Low" as Priority,
      },
    ]);
  }

  function updateItem(id: string, field: keyof ActionItem, value: string) {
    setItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  }

  function handleConfirm() {
    onConfirm(items, parseEmailList(emails), notionDbId);
  }

  const labelCls =
    "block text-[10px] font-semibold uppercase tracking-[0.14em] text-universe";
  const inputCls =
    "w-full rounded-xl border border-venus/60 bg-meteor/40 px-3.5 py-2.5 text-sm text-galaxy placeholder:text-universe/50 focus:outline-none focus:border-planetary focus:bg-white focus:ring-2 focus:ring-planetary/20 transition-all";

  return (
    <div className="px-7 py-8 sm:px-10 sm:py-10">
      <NavBar screen="review" />

      <div className="animate-fade-up">
        <h1 className="font-serif text-2xl sm:text-3xl font-medium text-galaxy">
          Review before sending
        </h1>
        <p className="mt-2 text-sm text-universe">
          Edit anything that needs a tweak, then send tasks to Notion and email
          the summary.
        </p>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Transcript + Summary */}
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className={labelCls}>Original transcript</p>
            <div className="mt-2 h-44 overflow-y-auto rounded-2xl border border-venus/50 bg-meteor/30 p-3.5 scroll-panel">
              <p className="text-xs text-universe leading-relaxed whitespace-pre-wrap">
                {transcript}
              </p>
            </div>
          </div>
          <div>
            <p className={labelCls}>Meeting summary</p>
            <div className="mt-2 h-44 overflow-y-auto rounded-2xl border border-venus/50 bg-sky/20 p-3.5 scroll-panel">
              <p className="text-sm text-galaxy leading-relaxed mb-3">
                {extraction.summary}
              </p>
              <p className={labelCls}>Decisions</p>
              <ul className="mt-1 space-y-1">
                {extraction.decisions.map((d, i) => (
                  <li
                    key={i}
                    className="text-xs text-universe before:content-['—'] before:mr-1.5 before:text-venus"
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Action items */}
        <div className="mt-7 flex items-center justify-between">
          <p className={labelCls}>
            Action items
            <span className="ml-2 text-universe/60 normal-case tracking-normal font-normal">
              {items.length}
            </span>
          </p>
          <Button variant="secondary" size="sm" onClick={addItem}>
            + Add item
          </Button>
        </div>

        <div className="mt-2 rounded-2xl border border-venus/50 bg-white overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 px-4 py-2.5 bg-meteor/40 border-b border-venus/40">
            {["Task", "Owner", "Deadline", ""].map((h, i) => (
              <span
                key={i}
                className="text-[10px] font-semibold uppercase tracking-[0.12em] text-universe"
              >
                {h}
              </span>
            ))}
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 items-center px-4 py-2.5 border-b border-venus/30 last:border-0 hover:bg-sky/10 transition-colors"
            >
              <input
                className="text-sm text-galaxy bg-transparent border-0 focus:outline-none focus:ring-0 w-full"
                value={item.task}
                onChange={(e) => updateItem(item.id, "task", e.target.value)}
              />
              <input
                className="text-xs text-universe bg-transparent border-0 focus:outline-none w-full"
                value={item.owner}
                onChange={(e) => updateItem(item.id, "owner", e.target.value)}
              />
              <input
                className="text-xs text-universe bg-transparent border-0 focus:outline-none w-full"
                value={item.deadline}
                onChange={(e) => updateItem(item.id, "deadline", e.target.value)}
              />
              <div className="flex items-center gap-2.5">
                <PriorityBadge priority={item.priority} />
                <button
                  className="text-venus hover:text-red-400 text-lg leading-none transition-colors"
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove item"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Destinations */}
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className={labelCls}>Attendee emails</p>
            <input
              className={`mt-2 ${inputCls}`}
              placeholder="alice@co.com, bob@co.com"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
            />
          </div>
          <div>
            <p className={labelCls}>Notion database ID</p>
            <input
              className={`mt-2 ${inputCls}`}
              placeholder="Paste your Notion database ID"
              value={notionDbId}
              onChange={(e) => setNotionDbId(e.target.value)}
            />
            {notionDbId === DEMO_NOTION_DATABASE_ID && (
              <a
                href={DEMO_NOTION_BOARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-block text-xs text-planetary hover:text-galaxy transition-colors"
              >
                Using the demo board — view it in Notion ↗
              </a>
            )}
          </div>
        </div>

        {/* Back left, Confirm right */}
        <div className="mt-8 flex items-center justify-between">
          <Button variant="secondary" onClick={onBack}>
            ← Back
          </Button>
          <Button
            variant="primary"
            disabled={isLoading || items.length === 0}
            onClick={handleConfirm}
          >
            {isLoading ? "Sending…" : "Confirm & send"}
          </Button>
        </div>
      </div>
    </div>
  );
}

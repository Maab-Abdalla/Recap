"use client";

import { NavBar } from "@/components/ui/NavBar";
import { Button } from "@/components/ui/Button";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import type { ActionItem, ConfirmResponse } from "@/types";

interface SuccessScreenProps {
  result: ConfirmResponse;
  actionItems: ActionItem[];
  onReset: () => void;
}

function CheckCircle({ large = false }: { large?: boolean }) {
  const size = large ? "h-9 w-9" : "h-5 w-5";
  return (
    <svg viewBox="0 0 36 36" className={size} aria-hidden>
      <circle
        cx="18"
        cy="18"
        r="16.5"
        className="fill-sky/40 stroke-universe/40"
        strokeWidth="1.5"
      />
      <path
        d="M11 18.5l4.5 4.5L25 13"
        fill="none"
        stroke="#334EAC"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="24"
        className="animate-draw-check"
      />
    </svg>
  );
}

export function SuccessScreen({
  result,
  actionItems,
  onReset,
}: SuccessScreenProps) {
  const labelCls =
    "block text-[10px] font-semibold uppercase tracking-[0.14em] text-universe";

  return (
    <div className="px-7 py-8 sm:px-10 sm:py-10">
      <NavBar screen="success" />

      <div className="stagger">
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-galaxy">
          All done.
        </h1>
        <p className="mt-2 text-sm text-universe">
          Your tasks are live in Notion and the summary is on its way.
        </p>

        {/* Result cards */}
        <div className="mt-6 rounded-2xl border border-venus/50 bg-sky/15 divide-y divide-venus/30">
          <div className="flex items-center gap-3.5 px-5 py-4">
            <CheckCircle large />
            <div className="flex-1">
              <p className="text-sm font-medium text-galaxy">
                {result.taskCount} task{result.taskCount !== 1 ? "s" : ""} created
                in Notion
              </p>
              <p className="text-xs text-universe/70">Recap Database</p>
            </div>
            {result.notionUrl && (
              <a
                href={result.notionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-planetary hover:text-galaxy transition-colors"
              >
                Open board ↗
              </a>
            )}
          </div>

          <div className="flex items-center gap-3.5 px-5 py-4">
            <CheckCircle large />
            <div>
              <p className="text-sm font-medium text-galaxy">Summary email sent</p>
              <p className="text-xs text-universe/70">
                {result.emailsSent} recipient
                {result.emailsSent !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Task recap */}
        <p className={`mt-7 ${labelCls}`}>Tasks created</p>
        <div className="mt-2 rounded-2xl border border-venus/50 bg-white divide-y divide-venus/30">
          {actionItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-5 py-3">
              <CheckCircle />
              <span className="text-sm text-galaxy flex-1">{item.task}</span>
              <span className="text-xs text-universe">{item.owner}</span>
              <PriorityBadge priority={item.priority} />
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Button variant="primary" onClick={onReset}>
            ↺ Process another meeting
          </Button>
        </div>
      </div>
    </div>
  );
}

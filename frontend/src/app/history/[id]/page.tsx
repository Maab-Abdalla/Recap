"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSession } from "@/lib/db";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import Link from "next/link";
import type { ActionItem } from "@/types";

interface SessionDetail {
  transcript: string;
  summary: string;
  decisions: string[];
  action_items: ActionItem[];
  notion_url: string | null;
  created_at: string;
}

export default function SessionPage() {
  const params = useParams();
  const id = params?.id as string;
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getSession(id)
      .then((s) => setSession(s as SessionDetail))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-universe/70">Loading...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-universe mb-3">Session not found.</p>
          <Link href="/history" className="text-sm text-galaxy underline underline-offset-2">
            ← Back to history
          </Link>
        </div>
      </main>
    );
  }

  const date = new Date(session.created_at).toLocaleDateString("en-MY", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto py-8 px-6">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/history"
            className="text-sm text-universe/70 hover:text-galaxy transition-colors"
          >
            ← History
          </Link>
          <span className="text-gray-200">/</span>
          <span className="text-sm text-universe">{date}</span>
        </div>

        <div className="bg-white border border-venus/50 rounded-2xl p-5 mb-4">
          <p className="text-xs uppercase tracking-wide text-universe/70 mb-2">Summary</p>
          <p className="text-sm text-galaxy leading-relaxed">{session.summary}</p>

          {session.decisions.length > 0 && (
            <div className="mt-4">
              <p className="text-xs uppercase tracking-wide text-universe/70 mb-2">Decisions</p>
              <ul className="space-y-1">
                {session.decisions.map((d, i) => (
                  <li key={i} className="text-sm text-universe before:content-['•'] before:mr-2 before:text-gray-300">
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-white border border-venus/50 rounded-2xl overflow-hidden mb-4">
          <div className="px-5 py-3 border-b border-gray-50">
            <p className="text-xs uppercase tracking-wide text-universe/70">Action items</p>
          </div>
          {session.action_items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-3 border-b border-gray-50 last:border-0"
            >
              <span className="flex-1 text-sm text-galaxy">{item.task}</span>
              <span className="text-xs text-universe/70 w-24 text-right">{item.owner}</span>
              <span className="text-xs text-universe/70 w-28 text-right">{item.deadline}</span>
              <PriorityBadge priority={item.priority} />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {session.notion_url && (
            <a
              href={session.notion_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm border border-venus rounded-lg px-3 py-1.5 text-universe hover:bg-meteor/40 transition-colors"
            >
              Open in Notion ↗
            </a>
          )}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm bg-gray-900 text-white rounded-lg px-3 py-1.5 hover:bg-gray-700 transition-colors"
          >
            Process new meeting
          </Link>
        </div>
      </div>
    </main>
  );
}

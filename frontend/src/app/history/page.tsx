"use client";

import { useEffect, useState } from "react";
import { getSessions, type SessionRow } from "@/lib/db";
import { getSessionKey } from "@/lib/sessionKey";
import Link from "next/link";
import { Wordmark } from "@/components/ui/NavBar";

export default function HistoryPage() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSessions(getSessionKey())
      .then(setSessions)
      .finally(() => setLoading(false));
  }, []);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-MY", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto py-10 px-6">
        <Link href="/" aria-label="Recap home" className="inline-flex mb-8">
          <Wordmark className="text-2xl" />
        </Link>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-2xl font-medium text-galaxy">Past meetings</h1>
            <p className="text-sm text-universe mt-0.5">
              Sessions from this browser
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm border border-venus rounded-xl px-3.5 py-2 text-galaxy hover:bg-sky/30 transition-colors"
          >
            ← New meeting
          </Link>
        </div>

        {loading && (
          <div className="text-sm text-universe py-12 text-center">
            Loading...
          </div>
        )}

        {!loading && sessions.length === 0 && (
          <div className="text-sm text-universe py-12 text-center border border-dashed border-venus rounded-2xl">
            No meetings processed yet.{" "}
            <Link href="/" className="text-planetary underline underline-offset-2">
              Process your first one →
            </Link>
          </div>
        )}

        {!loading && sessions.length > 0 && (
          <div className="space-y-3">
            {sessions.map((s) => {
              const items = Array.isArray(s.action_items) ? s.action_items : [];
              return (
                <Link
                  key={s.id}
                  href={`/history/${s.id}`}
                  className="block bg-white border border-venus/50 rounded-2xl px-5 py-4 hover:border-universe hover:shadow-card transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-galaxy leading-snug line-clamp-2">
                        {s.summary || "No summary"}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-universe">
                          {items.length} task{items.length !== 1 ? "s" : ""}
                        </span>
                        {s.notion_url && (
                          <span className="text-xs text-universe">
                            · Notion synced
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-universe whitespace-nowrap flex-shrink-0">
                      {formatDate(s.created_at)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

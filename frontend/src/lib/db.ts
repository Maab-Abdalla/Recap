/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "./supabase";
import type { ActionItem, ConfirmResponse, MeetingExtraction } from "@/types";

export interface UserSettings {
  notionDatabaseId: string;
  defaultEmails: string;
}

export interface SessionRow {
  id: string;
  summary: string;
  action_items: ActionItem[];
  task_count: number | null;
  notion_url: string | null;
  created_at: string;
}

const db = supabase as any;

// ── Settings ──────────────────────────────────────────────────────────────────

export async function getSettings(sessionKey: string): Promise<UserSettings> {
  const { data } = await db
    .from("settings")
    .select("notion_database_id, default_emails")
    .eq("session_key", sessionKey)
    .maybeSingle();

  return {
    notionDatabaseId: data?.notion_database_id ?? "",
    defaultEmails: data?.default_emails ?? "",
  };
}

export async function saveSettings(
  sessionKey: string,
  settings: UserSettings
): Promise<void> {
  await db.from("settings").upsert(
    {
      session_key: sessionKey,
      notion_database_id: settings.notionDatabaseId,
      default_emails: settings.defaultEmails,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "session_key" }
  );
}

// ── Sessions ──────────────────────────────────────────────────────────────────

export async function saveSession(
  sessionKey: string,
  transcript: string,
  extraction: MeetingExtraction,
  result: ConfirmResponse
): Promise<string | null> {
  const { data, error } = await db
    .from("sessions")
    .insert({
      session_key: sessionKey,
      transcript,
      summary: extraction.summary,
      decisions: extraction.decisions,
      action_items: extraction.actionItems,
      notion_url: result.notionUrl || null,
      task_count: result.taskCount,
      emails_sent: result.emailsSent,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to save session:", error);
    return null;
  }
  return data?.id ?? null;
}

export async function getSessions(sessionKey: string): Promise<SessionRow[]> {
  const { data, error } = await db
    .from("sessions")
    .select("id, summary, action_items, task_count, notion_url, created_at")
    .eq("session_key", sessionKey)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Failed to fetch sessions:", error);
    return [];
  }
  return data ?? [];
}

export async function getSession(id: string): Promise<{
  transcript: string;
  summary: string;
  decisions: string[];
  action_items: ActionItem[];
  notion_url: string | null;
  created_at: string;
} | null> {
  const { data, error } = await db
    .from("sessions")
    .select("transcript, summary, decisions, action_items, notion_url, created_at")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

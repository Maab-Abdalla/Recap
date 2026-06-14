"use client";

import { useState, useEffect } from "react";
import { getSettings, saveSettings, type UserSettings } from "@/lib/db";
import { getSessionKey } from "@/lib/sessionKey";

const DEFAULT: UserSettings = {
  notionDatabaseId: "",
  defaultEmails: "",
};

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const key = getSessionKey();
    getSettings(key)
      .then((s) => setSettings(s))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  async function save(next: Partial<UserSettings>) {
    const merged = { ...settings, ...next };
    setSettings(merged);
    try {
      await saveSettings(getSessionKey(), merged);
    } catch {
      // fail silently — settings are still in local state for this session
    }
  }

  return { settings, save, loaded };
}

"use client";

const COOKIE_NAME = "recap_session_key";
const COOKIE_DAYS = 365;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function generateKey(): string {
  return (
    Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
  );
}

/**
 * Returns a stable anonymous session key for this browser.
 * Created once, stored in a cookie, survives page refreshes.
 */
export function getSessionKey(): string {
  let key = getCookie(COOKIE_NAME);
  if (!key) {
    key = generateKey();
    setCookie(COOKIE_NAME, key, COOKIE_DAYS);
  }
  return key;
}

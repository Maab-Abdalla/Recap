import type {
  ProcessRequest,
  ProcessResponse,
  ConfirmRequest,
  ConfirmResponse,
} from "@/types";

// The browser calls our OWN Next.js API routes (same-origin → no CORS).
// Those routes proxy to n8n server-to-server. See src/app/api/recap/*.
async function post<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(
      "Could not reach the app server. Is the frontend running?"
    );
  }

  if (!res.ok) {
    // Our proxy routes return { error } as JSON.
    const data = await res.json().catch(() => null);
    const msg =
      (data && typeof data.error === "string" && data.error) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return res.json() as Promise<T>;
}

/**
 * Step 1 — Send transcript to n8n (via our proxy), get back extracted JSON.
 */
export async function processTranscript(
  payload: ProcessRequest
): Promise<ProcessResponse> {
  return post<ProcessResponse>("/api/recap/process", payload);
}

/**
 * Step 2 — After user reviews/edits, confirm to create Notion tasks + send email.
 */
export async function confirmAndSend(
  payload: ConfirmRequest
): Promise<ConfirmResponse> {
  return post<ConfirmResponse>("/api/recap/confirm", payload);
}

import { NextRequest, NextResponse } from "next/server";

// Server-side proxy: the browser calls THIS route (same-origin, no CORS),
// and the Next.js server forwards to n8n server-to-server (no CORS either).
// This sidesteps n8n's per-node webhook CORS entirely — works the same
// locally and on Railway.

// Prefer a server-only var; fall back to the public one used by the build.
const WEBHOOK_BASE =
  process.env.N8N_WEBHOOK_URL ||
  process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
  "http://localhost:5678/webhook/recap";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const target = `${WEBHOOK_BASE}/process`;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const res = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    if (!res.ok) {
      return NextResponse.json(
        {
          error:
            res.status === 404
              ? "Workflow not found (404). The Recap workflow is not active in n8n."
              : `n8n returned ${res.status}: ${text.slice(0, 500)}`,
        },
        { status: res.status }
      );
    }

    // Pass n8n's JSON straight through.
    return new NextResponse(text, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return NextResponse.json(
      {
        error: `Could not reach n8n at ${target}. Check that n8n is running and the workflow is active.`,
      },
      { status: 502 }
    );
  }
}

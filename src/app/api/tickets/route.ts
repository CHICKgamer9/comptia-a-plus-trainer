import { generateTicket } from "@/lib/ai-tickets";
import { aiConfigured } from "@/lib/ai-config";
import { generateRequestSchema } from "@/lib/ticket-schema";

export const maxDuration = 60;

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 8;
const hits = new Map<string, number[]>();

function clientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

function rateLimited(key: string) {
  const now = Date.now();
  const next = (hits.get(key) ?? []).filter((stamp) => now - stamp < WINDOW_MS);
  if (next.length >= MAX_HITS) {
    hits.set(key, next);
    return true;
  }
  next.push(now);
  hits.set(key, next);
  return false;
}

export async function GET() {
  return Response.json({ configured: aiConfigured() });
}

export async function POST(request: Request) {
  if (rateLimited(clientKey(request))) {
    return Response.json(
      { error: "Too many tickets. Wait a few minutes, then try again." },
      { status: 429 },
    );
  }

  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const parsed = generateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid filters." }, { status: 400 });
  }

  const result = await generateTicket(parsed.data);
  return Response.json({
    ticket: result.ticket,
    source: result.source,
    warning: result.warning,
    configured: aiConfigured(),
  });
}

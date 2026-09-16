import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const cache = new Map<string, { body: Uint8Array; type: string }>();

function hashKey(text: string, lang: string, role: string) {
  return createHash("sha256").update(`${role}:${lang}:${text}`).digest("hex");
}

async function elevenLabs(text: string, lang: string, role: string) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return null;
  const voice =
    role === "target"
      ? process.env.ELEVENLABS_VOICE_TARGET ?? process.env.ELEVENLABS_VOICE_ID ?? "JBFqnCBsd6RMkjVDRZzb"
      : process.env.ELEVENLABS_VOICE_NARRATOR ?? process.env.ELEVENLABS_VOICE_ID ?? "JBFqnCBsd6RMkjVDRZzb";
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
    method: "POST",
    headers: {
      "xi-api-key": key,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_flash_v2_5",
      voice_settings: { stability: 0.55, similarity_boost: 0.7, style: 0.15 },
    }),
  });
  if (!res.ok) return null;
  return { body: new Uint8Array(await res.arrayBuffer()), type: "audio/mpeg" };
}

async function openAiTts(text: string, lang: string, role: string) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const voice = role === "target" ? "verse" : "ash";
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      voice,
      input: text,
      response_format: "mp3",
    }),
  });
  if (!res.ok) return null;
  return { body: new Uint8Array(await res.arrayBuffer()), type: "audio/mpeg" };
}

export async function POST(request: Request) {
  let payload: { text?: string; lang?: string; role?: string };
  try {
    payload = (await request.json()) as { text?: string; lang?: string; role?: string };
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const text = (payload.text ?? "").replace(/\s+/g, " ").trim();
  if (!text) return NextResponse.json({ error: "empty" }, { status: 400 });
  const lang = payload.lang ?? "en-US";
  const role = payload.role === "target" ? "target" : "narrator";
  if (role === "narrator" && !lang.toLowerCase().startsWith("en")) {
    return NextResponse.json({ error: "narrator must be English" }, { status: 400 });
  }

  const key = hashKey(text, lang, role);
  const hit = cache.get(key);
  if (hit) {
    return new NextResponse(Buffer.from(hit.body), {
      headers: { "Content-Type": hit.type, "Cache-Control": "public, max-age=86400", "X-TTS-Cache": "hit" },
    });
  }

  const audio =
    (await elevenLabs(text, lang, role).catch(() => null)) ??
    (await openAiTts(text, lang, role).catch(() => null));
  if (!audio) {
    return NextResponse.json({ error: "no neural provider" }, { status: 501 });
  }
  cache.set(key, audio);
  return new NextResponse(Buffer.from(audio.body), {
    headers: { "Content-Type": audio.type, "Cache-Control": "public, max-age=86400", "X-TTS-Cache": "miss" },
  });
}

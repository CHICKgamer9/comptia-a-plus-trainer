import { describe, expect, it } from "vitest";
import { narratorLang, pickWebVoice, speakContainsChrome } from "@/lib/tts/script";

describe("TTS voice and chrome rules", () => {
  it("narrator never stays on a non-English lang", () => {
    expect(narratorLang("fr-FR")).toBe("en-US");
    expect(narratorLang("id-ID")).toBe("en-US");
    expect(narratorLang("is-IS")).toBe("en-US");
    expect(narratorLang("en-AU")).toBe("en-AU");
    expect(narratorLang("en-GB")).toBe("en-GB");
  });

  it("never returns voices[0] of a junk list when a better English voice exists", () => {
    const voices = [
      { lang: "de-DE", name: "JunkZero" },
      { lang: "en-AU", name: "Karen Premium" },
      { lang: "en-US", name: "Samantha" },
    ];
    const pick = pickWebVoice(voices, "en", "narrator");
    expect(pick?.name).not.toBe("JunkZero");
    expect(pick?.lang.toLowerCase().startsWith("en")).toBe(true);
    expect(pick?.name).toMatch(/Premium|Karen/i);
  });

  it("prefers en-AU then en-GB then en-US among neural voices", () => {
    const voices = [
      { lang: "en-US", name: "Neural US" },
      { lang: "en-GB", name: "Neural GB" },
      { lang: "en-AU", name: "Neural AU" },
    ];
    expect(pickWebVoice(voices, "en", "narrator")?.lang).toBe("en-AU");
  });

  it("does not treat CONCEPT chrome as speakable", () => {
    expect(speakContainsChrome("CONCEPT")).toBe(true);
    expect(speakContainsChrome("A rising palm rest is a swollen pack.")).toBe(false);
  });
});

describe("cancelAll contract", () => {
  it("exports cancelAll for beat changes", async () => {
    const mod = await import("@/lib/tts/speak");
    expect(typeof mod.cancelAll).toBe("function");
    expect(typeof mod.speak).toBe("function");
    expect(typeof mod.speakTarget).toBe("function");
  });
});

import { describe, expect, it } from "vitest";
import { techStartLesson } from "@/content/learn/gold/tech-start";
import { mobileDevicesLesson } from "@/content/learn/gold/mobile-devices";
import { frU01L01 } from "@/content/lingo/gold/fr-u01-l01";
import { idU01L01 } from "@/content/lingo/gold/id-u01-l01";
import { isU01L01 } from "@/content/lingo/gold/is-u01-l01";
import { badTechStartLesson } from "@/content/fixtures/bad-tech-start";
import { lintGoldSuite, lintLearnLesson, lintLingoNode, autoReadWouldSpeakChrome } from "@/lib/lesson-lint";
import { speakTextOf } from "@/lib/tts/script";
import { TECH_START_CARD_ID } from "@/content/learn/gold/tech-start";

describe("lessonLint", () => {
  it("fails the old Start Here fixture", () => {
    const issues = lintLearnLesson(badTechStartLesson, "fixture/bad-tech-start");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.some((issue) => /meta body|missing speak|empty diagram|missing authored/i.test(issue.message))).toBe(true);
  });

  it("passes the three gold lessons", () => {
    const result = lintGoldSuite({
      techStart: techStartLesson,
      mobileDevices: mobileDevicesLesson,
      frU01L01,
      badTechStart: badTechStartLesson,
    });
    expect(result.badFailed).toBe(true);
    expect(result.issues).toEqual([]);
    expect(result.goldOk).toBe(true);
  });

  it("Start Here awards the pack card and never USB-C PD", () => {
    const decide = techStartLesson.beats?.find((beat) => beat.type === "decide");
    expect(decide?.cardId).toBe(TECH_START_CARD_ID);
    expect(decide?.cardId).not.toBe("c-usbc-pd");
    const spoken = techStartLesson.beats?.map((beat) => speakTextOf(beat.speak)).join(" ") ?? "";
    expect(spoken).not.toMatch(/USB-C PD/i);
    expect(spoken).not.toMatch(/CONCEPT|FIELD TIP|4 MIN/i);
  });

  it("Mobile Devices teaches soldered CPU before the first decide", () => {
    const beats = mobileDevicesLesson.beats ?? [];
    const decideAt = beats.findIndex((beat) => beat.type === "decide");
    const taught = beats.slice(0, decideAt).some((beat) =>
      (beat.termsIntroduced ?? []).some((term) => /soldered/i.test(term)),
    );
    expect(taught).toBe(true);
    expect(decideAt).toBeGreaterThan(3);
  });

  it("French U1 L1 introduces Bonjour first and matches only taught words", () => {
    expect(lintLingoNode(frU01L01)).toEqual([]);
    expect(frU01L01.steps[0]?.type).toBe("introduce");
    expect(frU01L01.steps[0]?.native).toBe("Bonjour");
    expect(frU01L01.steps[0]?.kind).not.toMatch(/vocab|listen-pick|match/);
    const match = frU01L01.steps.find((step) => step.type === "match");
    expect(match?.pairs?.every((pair) => ["Bonjour", "Bonsoir", "Salut", "Au revoir"].includes(pair.left))).toBe(true);
  });

  it("mirrors ID and IS L1 after French", () => {
    expect(lintLingoNode(idU01L01)).toEqual([]);
    expect(lintLingoNode(isU01L01)).toEqual([]);
    expect(idU01L01.steps[0]?.type).toBe("introduce");
    expect(isU01L01.steps[0]?.type).toBe("introduce");
  });

  it("Auto-read must not speak title or chrome", () => {
    expect(autoReadWouldSpeakChrome("CONCEPT")).toBe(true);
    expect(autoReadWouldSpeakChrome("FIELD TIP / options")).toBe(true);
    for (const beat of techStartLesson.beats ?? []) {
      expect(autoReadWouldSpeakChrome(speakTextOf(beat.speak))).toBe(false);
    }
  });
});

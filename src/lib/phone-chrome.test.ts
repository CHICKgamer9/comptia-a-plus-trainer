import { describe, expect, it } from "vitest";
import {
  hidePhoneHeader,
  hidePhoneTabs,
  isBrainFeed,
  isBrainImmersive,
  isLabTicket,
  isLessonBeat,
  isLingoItem,
} from "./phone-chrome";

describe("phone chrome routes", () => {
  it("treats a learn beat as immersive and a hub as chrome", () => {
    expect(isLessonBeat("/learn/tech/tech-start")).toBe(true);
    expect(hidePhoneTabs("/learn/tech/tech-start")).toBe(true);
    expect(hidePhoneHeader("/learn/tech/tech-start")).toBe(true);
    expect(hidePhoneTabs("/learn/tech")).toBe(false);
    expect(hidePhoneTabs("/learn")).toBe(false);
    expect(hidePhoneTabs("/")).toBe(false);
  });

  it("hides tabs on lingo items, brain cards, and lab tickets", () => {
    expect(isLingoItem("/lingo/fr/fr-u01-l01")).toBe(true);
    expect(hidePhoneTabs("/lingo/fr")).toBe(false);
    expect(isBrainImmersive("/brain/feed")).toBe(true);
    expect(isBrainFeed("/brain/feed")).toBe(true);
    expect(isBrainImmersive("/brain/play/abc")).toBe(true);
    expect(hidePhoneTabs("/brain")).toBe(false);
    expect(isLabTicket("/lab/t/seed")).toBe(true);
    expect(hidePhoneTabs("/lab")).toBe(false);
  });

  it("keeps practice quizzes on the tab bar", () => {
    expect(hidePhoneTabs("/practice/hardware-quiz")).toBe(false);
    expect(hidePhoneTabs("/practice/mock/core1")).toBe(false);
    expect(hidePhoneTabs("/binder")).toBe(false);
    expect(hidePhoneTabs("/progress")).toBe(false);
  });
});

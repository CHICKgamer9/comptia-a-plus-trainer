import { describe, expect, it } from "vitest";
import { emptyProgress, recordQuizAnswerIn } from "@/lib/progress";

describe("path card award contract", () => {
  it("awards the pack card on a correct Start Here decide", () => {
    const next = recordQuizAnswerIn(emptyProgress(), "path-tech-start-check", true, {
      domainId: "tech-start",
      subject: "tech",
      conceptId: "tech-start-check",
      cardId: "c-li-ion",
      awardCard: true,
    });
    expect(next.bench?.owned.some((row) => row.cardId === "c-li-ion")).toBe(true);
    expect(next.bench?.owned.some((row) => row.cardId === "c-usbc-pd")).toBe(false);
  });

  it("drops nothing when the decide is skipped", () => {
    const next = recordQuizAnswerIn(emptyProgress(), "path-tech-start-check", false, {
      domainId: "tech-start",
      subject: "tech",
      conceptId: "tech-start-check",
      cardId: "c-li-ion",
      skipped: true,
      awardCard: true,
    });
    expect(next.bench?.owned ?? []).toEqual([]);
  });

  it("drops nothing on a try beat", () => {
    const next = recordQuizAnswerIn(emptyProgress(), "path-tech-start-try", true, {
      domainId: "tech-start",
      subject: "tech",
      conceptId: "tech-start-try",
      awardCard: false,
    });
    expect(next.bench?.owned ?? []).toEqual([]);
  });
});

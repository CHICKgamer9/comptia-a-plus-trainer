import { describe, expect, it } from "vitest";
import {
  dropFromBrain,
  dropFromPath,
  emptyBench,
  RELATED_DROP_RATE,
  relatedCardsForBrain,
  RECENT_DROP_WINDOW,
  wantsRelatedDrop,
} from "@/lib/binder";
import { emptyProgress, recordBrainAnswerIn } from "@/lib/progress";
import type { BrainAnswerInput } from "@/lib/progress";

function brainInput(partial: Partial<BrainAnswerInput> & Pick<BrainAnswerInput, "id" | "correct">): BrainAnswerInput {
  return {
    ymd: "2026-09-17",
    playlistIds: [],
    minutes: 1,
    minutesTarget: 120,
    cat: "trivia",
    ...partial,
  };
}

describe("drop rates and related chance", () => {
  it("keeps the related-card chance small", () => {
    expect(RELATED_DROP_RATE).toBeGreaterThanOrEqual(0.08);
    expect(RELATED_DROP_RATE).toBeLessThanOrEqual(0.15);
  });

  it("marks about 12% of seeds as related", () => {
    let hits = 0;
    const samples = 2000;
    for (let i = 0; i < samples; i += 1) {
      if (wantsRelatedDrop(`brain:trivia:b-trivia-${String(i).padStart(5, "0")}`)) hits += 1;
    }
    const rate = hits / samples;
    expect(rate).toBeGreaterThan(0.08);
    expect(rate).toBeLessThan(0.16);
  });
});

describe("brain card drops", () => {
  it("does not reprint the same card across consecutive feed items", () => {
    let bench = emptyBench();
    const ids: string[] = [];
    for (let i = 0; i < RECENT_DROP_WINDOW; i += 1) {
      const itemId = `b-trivia-${String(i).padStart(5, "0")}`;
      const drop = dropFromBrain(bench, { correct: true, cat: "trivia", itemId });
      expect(drop.awarded).toHaveLength(1);
      ids.push(drop.awarded[0].card.id);
      bench = drop.bench;
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("still diversifies when the caller forgets cat (old feed seed)", () => {
    let bench = emptyBench();
    const ids: string[] = [];
    for (let i = 0; i < 6; i += 1) {
      const drop = dropFromBrain(bench, { correct: true, itemId: `b-riddle-${String(i).padStart(5, "0")}` });
      if (drop.awarded[0]) ids.push(drop.awarded[0].card.id);
      bench = drop.bench;
    }
    expect(ids.length).toBe(6);
    expect(new Set(ids).size).toBeGreaterThan(1);
  });

  it("awards a related card from the category pool when the seed hits", () => {
    let itemId = "";
    for (let i = 0; i < 400; i += 1) {
      const id = `b-maths-${String(i).padStart(5, "0")}`;
      if (wantsRelatedDrop(`brain:maths:${id}`)) {
        itemId = id;
        break;
      }
    }
    expect(itemId).not.toBe("");
    const related = relatedCardsForBrain("maths");
    expect(related.length).toBeGreaterThan(0);
    const drop = dropFromBrain(emptyBench(), { correct: true, cat: "maths", itemId });
    expect(drop.awarded).toHaveLength(1);
    expect(related.some((card) => card.id === drop.awarded[0].card.id)).toBe(true);
  });

  it("prints nothing on skip or wrong", () => {
    const skip = dropFromBrain(emptyBench(), {
      correct: false,
      skipped: true,
      cat: "trivia",
      itemId: "b-trivia-00001",
    });
    const wrong = dropFromBrain(emptyBench(), {
      correct: false,
      cat: "trivia",
      itemId: "b-trivia-00002",
    });
    expect(skip.awarded).toEqual([]);
    expect(wrong.awarded).toEqual([]);
  });

  it("awards a brain item at most once through progress", () => {
    const first = recordBrainAnswerIn(
      emptyProgress(),
      brainInput({ id: "b-trivia-00010", correct: true, cat: "trivia" }),
    );
    const second = recordBrainAnswerIn(
      first,
      brainInput({ id: "b-trivia-00010", correct: true, cat: "trivia" }),
    );
    const firstPrints = first.bench?.owned.reduce((sum, row) => sum + (row.prints ?? row.copies), 0) ?? 0;
    const secondPrints = second.bench?.owned.reduce((sum, row) => sum + (row.prints ?? row.copies), 0) ?? 0;
    expect(firstPrints).toBe(1);
    expect(secondPrints).toBe(1);
  });

  it("does not award after a wrong first attempt on the same item", () => {
    const missed = recordBrainAnswerIn(
      emptyProgress(),
      brainInput({ id: "b-trivia-00011", correct: false, cat: "trivia" }),
    );
    expect(missed.bench?.owned ?? []).toEqual([]);
    const retry = recordBrainAnswerIn(
      missed,
      brainInput({ id: "b-trivia-00011", correct: true, cat: "trivia" }),
    );
    expect(retry.bench?.owned ?? []).toEqual([]);
  });
});

describe("path related drops still honor the ceremony contract", () => {
  it("still awards at most one path card on a correct decide", () => {
    const drop = dropFromPath(emptyBench(), {
      correct: true,
      domainId: "hardware",
      subject: "tech",
      conceptId: "psu-rail",
    });
    expect(drop.awarded.length).toBeLessThanOrEqual(1);
    expect(drop.awarded.length).toBe(1);
  });

  it("does not let related chance override a named pack card", () => {
    const drop = dropFromPath(emptyBench(), {
      correct: true,
      domainId: "tech-start",
      subject: "tech",
      conceptId: "tech-start-check",
      cardId: "c-li-ion",
    });
    expect(drop.awarded.map((row) => row.card.id)).toEqual(["c-li-ion"]);
  });
});

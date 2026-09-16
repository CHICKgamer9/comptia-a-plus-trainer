import type { Lesson } from "@/content/types";

/** Old Start Here sludge. The linter must fail this fixture. */
export const badTechStartLesson: Lesson = {
  id: "bad-tech-start-essentials",
  domainId: "bad-tech-start",
  title: "A 4-minute tech bite",
  minutes: 4,
  intro: "A 4-minute tech bite. See it once. Finish it so XP, streak, and Binder can move.",
  sections: [
    {
      heading: "See it once",
      paragraphs: [
        "CONCEPT / WHY / FIELD TIP. A pocket picture for this path. USB-C PD is your first award.",
        "See it once. This bite is four minutes on purpose so XP and streak can move.",
      ],
      callout: {
        type: "tip",
        text: "Finish it so XP, streak, and Binder can move.",
      },
      figure: {
        kind: "diagram",
        diagram: "prism",
        alt: "Unlabelled triangle",
        caption: "A pocket picture for this path.",
        labels: [],
      },
    },
  ],
  keyTakeaways: ["Come back tomorrow for the next path in this hub."],
};

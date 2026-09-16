import catalog from "./catalog-lessons.json";
import type { Lesson } from "../types";

export const generatedLessons = catalog.lessons as Lesson[];

import catalog from "./catalog-quizzes.json";
import type { Quiz } from "../types";

export const generatedQuizzes = catalog.quizzes as Quiz[];

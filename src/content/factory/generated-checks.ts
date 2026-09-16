import catalog from "./catalog-checks.json";
import type { PathCheck } from "../types";

export const generatedChecks = catalog.checks as Record<string, PathCheck[]>;

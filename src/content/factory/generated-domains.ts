import catalog from "./catalog-domains.json";
import type { Domain } from "../types";

export const generatedDomains = catalog.domains as Domain[];
export const generatedSeedCounts = catalog.seedCounts as Record<string, number>;
export const catalogPathTotals = catalog.totals as Record<string, number>;
export const catalogGeneratedAt = catalog.generatedAt;

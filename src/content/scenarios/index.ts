import type { Scenario } from "../types";
import { hardwareNetworkScenarios } from "./hardware-network";
import { osSecurityScenarios } from "./os-security";

export const scenarios: Scenario[] = [
  ...hardwareNetworkScenarios,
  ...osSecurityScenarios,
];

export function getScenario(id: string) {
  return scenarios.find((scenario) => scenario.id === id);
}

export function getRandomScenarioId(excludeId?: string) {
  const pool = excludeId
    ? scenarios.filter((scenario) => scenario.id !== excludeId)
    : scenarios;
  return pool[Math.floor(Math.random() * pool.length)]?.id;
}

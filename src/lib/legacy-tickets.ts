import type { DomainId, ExamId, ScenarioTheme } from "@/content/types";

/** Metadata so scores from the retired static catalog still count in readiness. */
export const LEGACY_TICKET_META: Record<
  string,
  { exam: ExamId; theme: ScenarioTheme; domainIds: DomainId[] }
> = {
  "no-post": {
    exam: "220-1101",
    theme: "hardware",
    domainIds: ["hw-net-troubleshooting", "hardware"],
  },
  "no-display-ram": {
    exam: "220-1101",
    theme: "hardware",
    domainIds: ["hardware", "hw-net-troubleshooting"],
  },
  "overheating-laptop": {
    exam: "220-1101",
    theme: "hardware",
    domainIds: ["mobile-devices", "hw-net-troubleshooting"],
  },
  "phone-wont-charge": {
    exam: "220-1101",
    theme: "mobile",
    domainIds: ["mobile-devices"],
  },
  "intermittent-wifi": {
    exam: "220-1101",
    theme: "network",
    domainIds: ["networking", "hw-net-troubleshooting"],
  },
  "dns-failure": {
    exam: "220-1101",
    theme: "network",
    domainIds: ["networking", "hw-net-troubleshooting"],
  },
  "apipa-no-network": {
    exam: "220-1101",
    theme: "network",
    domainIds: ["networking", "hw-net-troubleshooting"],
  },
  "printer-offline": {
    exam: "220-1101",
    theme: "printer",
    domainIds: ["hardware", "hw-net-troubleshooting"],
  },
  "bsod-driver": {
    exam: "220-1102",
    theme: "os",
    domainIds: ["software-troubleshooting", "operating-systems"],
  },
  "boot-failure": {
    exam: "220-1102",
    theme: "os",
    domainIds: ["software-troubleshooting", "operating-systems"],
  },
  "slow-pc": {
    exam: "220-1102",
    theme: "os",
    domainIds: ["software-troubleshooting", "operating-systems"],
  },
  "cant-join-domain": {
    exam: "220-1102",
    theme: "os",
    domainIds: ["operating-systems", "networking"],
  },
  "phishing-email": {
    exam: "220-1102",
    theme: "security",
    domainIds: ["security", "operational-procedures"],
  },
  "malware-popup": {
    exam: "220-1102",
    theme: "security",
    domainIds: ["security", "software-troubleshooting"],
  },
  "vpn-wont-connect": {
    exam: "220-1102",
    theme: "network",
    domainIds: ["operating-systems", "networking"],
  },
  "mapped-drive": {
    exam: "220-1102",
    theme: "os",
    domainIds: ["operating-systems", "security"],
  },
};

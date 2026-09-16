import type { AplusDomainId, ExamId } from "./types";
import { examCore, examForTrack } from "@/lib/exam";
import type { ExamTrack } from "@/content/types";

export interface ExamObjective {
  id: string;
  exam: ExamId;
  domainId: AplusDomainId;
  code: string;
  title: string;
}

export interface DomainWeight {
  domainId: AplusDomainId;
  exam: ExamId;
  number: number;
  title: string;
  percent: number;
}

/** Official CompTIA A+ V15 (220-1201 / 220-1202) domain weights. */
export const V15_WEIGHTS: DomainWeight[] = [
  { domainId: "mobile-devices", exam: "220-1201", number: 1, title: "Mobile Devices", percent: 13 },
  { domainId: "networking", exam: "220-1201", number: 2, title: "Networking", percent: 23 },
  { domainId: "hardware", exam: "220-1201", number: 3, title: "Hardware", percent: 25 },
  { domainId: "virtualization-cloud", exam: "220-1201", number: 4, title: "Virtualization and Cloud Computing", percent: 11 },
  { domainId: "hw-net-troubleshooting", exam: "220-1201", number: 5, title: "Hardware and Network Troubleshooting", percent: 28 },
  { domainId: "operating-systems", exam: "220-1202", number: 1, title: "Operating Systems", percent: 28 },
  { domainId: "security", exam: "220-1202", number: 2, title: "Security", percent: 28 },
  { domainId: "software-troubleshooting", exam: "220-1202", number: 3, title: "Software Troubleshooting", percent: 23 },
  { domainId: "operational-procedures", exam: "220-1202", number: 4, title: "Operational Procedures", percent: 21 },
];

/** Archive V14 (220-1101 / 220-1102) domain weights. Same domain slugs. */
export const V14_WEIGHTS: DomainWeight[] = [
  { domainId: "mobile-devices", exam: "220-1101", number: 1, title: "Mobile Devices", percent: 15 },
  { domainId: "networking", exam: "220-1101", number: 2, title: "Networking", percent: 20 },
  { domainId: "hardware", exam: "220-1101", number: 3, title: "Hardware", percent: 25 },
  { domainId: "virtualization-cloud", exam: "220-1101", number: 4, title: "Virtualization and Cloud Computing", percent: 11 },
  { domainId: "hw-net-troubleshooting", exam: "220-1101", number: 5, title: "Hardware and Network Troubleshooting", percent: 29 },
  { domainId: "operating-systems", exam: "220-1102", number: 1, title: "Operating Systems", percent: 31 },
  { domainId: "security", exam: "220-1102", number: 2, title: "Security", percent: 25 },
  { domainId: "software-troubleshooting", exam: "220-1102", number: 3, title: "Software Troubleshooting", percent: 22 },
  { domainId: "operational-procedures", exam: "220-1102", number: 4, title: "Operational Procedures", percent: 22 },
];

const OBJECTIVE_DEFS: { domainId: AplusDomainId; exam: ExamId; code: string; title: string }[] = [
  { domainId: "mobile-devices", exam: "220-1201", code: "1.1", title: "Monitor mobile hardware and use replacement techniques" },
  { domainId: "mobile-devices", exam: "220-1201", code: "1.2", title: "Accessories and connectivity options" },
  { domainId: "mobile-devices", exam: "220-1201", code: "1.3", title: "Mobile network connectivity and application support" },
  { domainId: "networking", exam: "220-1201", code: "2.1", title: "TCP/UDP ports, protocols, and purposes" },
  { domainId: "networking", exam: "220-1201", code: "2.2", title: "Wireless networking technologies" },
  { domainId: "networking", exam: "220-1201", code: "2.3", title: "Services provided by networked hosts" },
  { domainId: "networking", exam: "220-1201", code: "2.4", title: "Network configuration concepts" },
  { domainId: "networking", exam: "220-1201", code: "2.5", title: "Networking hardware devices" },
  { domainId: "networking", exam: "220-1201", code: "2.6", title: "SOHO wired and wireless networks" },
  { domainId: "networking", exam: "220-1201", code: "2.7", title: "Internet connection and network types" },
  { domainId: "networking", exam: "220-1201", code: "2.8", title: "Networking tools" },
  { domainId: "hardware", exam: "220-1201", code: "3.1", title: "Display components and attributes" },
  { domainId: "hardware", exam: "220-1201", code: "3.2", title: "Cable types, connectors, and purposes" },
  { domainId: "hardware", exam: "220-1201", code: "3.3", title: "RAM characteristics" },
  { domainId: "hardware", exam: "220-1201", code: "3.4", title: "Storage devices" },
  { domainId: "hardware", exam: "220-1201", code: "3.5", title: "Motherboards, CPUs, and add-on cards" },
  { domainId: "hardware", exam: "220-1201", code: "3.6", title: "Power supplies" },
  { domainId: "hardware", exam: "220-1201", code: "3.7", title: "Multifunction devices and printers" },
  { domainId: "hardware", exam: "220-1201", code: "3.8", title: "Printer maintenance" },
  { domainId: "virtualization-cloud", exam: "220-1201", code: "4.1", title: "Virtualization concepts" },
  { domainId: "virtualization-cloud", exam: "220-1201", code: "4.2", title: "Cloud computing concepts" },
  { domainId: "hw-net-troubleshooting", exam: "220-1201", code: "5.1", title: "Troubleshoot motherboards, RAM, CPUs, and power" },
  { domainId: "hw-net-troubleshooting", exam: "220-1201", code: "5.2", title: "Troubleshoot drive and RAID issues" },
  { domainId: "hw-net-troubleshooting", exam: "220-1201", code: "5.3", title: "Troubleshoot video, projector, and display issues" },
  { domainId: "hw-net-troubleshooting", exam: "220-1201", code: "5.4", title: "Troubleshoot mobile device issues" },
  { domainId: "hw-net-troubleshooting", exam: "220-1201", code: "5.5", title: "Troubleshoot network issues" },
  { domainId: "hw-net-troubleshooting", exam: "220-1201", code: "5.6", title: "Troubleshoot printer issues" },
  { domainId: "operating-systems", exam: "220-1202", code: "1.1", title: "Common OS types and purposes" },
  { domainId: "operating-systems", exam: "220-1202", code: "1.2", title: "OS installations and upgrades" },
  { domainId: "operating-systems", exam: "220-1202", code: "1.3", title: "Windows editions and features" },
  { domainId: "operating-systems", exam: "220-1202", code: "1.4", title: "Windows features and tools" },
  { domainId: "operating-systems", exam: "220-1202", code: "1.5", title: "Microsoft command-line tools" },
  { domainId: "operating-systems", exam: "220-1202", code: "1.6", title: "Windows settings" },
  { domainId: "operating-systems", exam: "220-1202", code: "1.7", title: "Windows networking on a client" },
  { domainId: "operating-systems", exam: "220-1202", code: "1.8", title: "macOS features and tools" },
  { domainId: "operating-systems", exam: "220-1202", code: "1.9", title: "Linux client features and tools" },
  { domainId: "operating-systems", exam: "220-1202", code: "1.10", title: "Install applications according to requirements" },
  { domainId: "security", exam: "220-1202", code: "2.1", title: "Physical security measures" },
  { domainId: "security", exam: "220-1202", code: "2.2", title: "Logical security concepts" },
  { domainId: "security", exam: "220-1202", code: "2.3", title: "Wireless security protocols and authentication" },
  { domainId: "security", exam: "220-1202", code: "2.4", title: "Malware detection, removal, and prevention" },
  { domainId: "security", exam: "220-1202", code: "2.5", title: "Social engineering and related attacks" },
  { domainId: "security", exam: "220-1202", code: "2.6", title: "SOHO workstation security" },
  { domainId: "security", exam: "220-1202", code: "2.7", title: "Browser and data security" },
  { domainId: "software-troubleshooting", exam: "220-1202", code: "3.1", title: "Troubleshoot Windows OS problems" },
  { domainId: "software-troubleshooting", exam: "220-1202", code: "3.2", title: "Troubleshoot personal computer security issues" },
  { domainId: "software-troubleshooting", exam: "220-1202", code: "3.3", title: "Troubleshoot mobile OS and application issues" },
  { domainId: "software-troubleshooting", exam: "220-1202", code: "3.4", title: "Troubleshoot mobile OS security issues" },
  { domainId: "operational-procedures", exam: "220-1202", code: "4.1", title: "Best practices and documentation" },
  { domainId: "operational-procedures", exam: "220-1202", code: "4.2", title: "Change management and ticketing" },
  { domainId: "operational-procedures", exam: "220-1202", code: "4.3", title: "Backup, recovery, and safety" },
  { domainId: "operational-procedures", exam: "220-1202", code: "4.4", title: "Environmental impacts and privacy" },
  { domainId: "operational-procedures", exam: "220-1202", code: "4.5", title: "Communication and professionalism" },
  { domainId: "operational-procedures", exam: "220-1202", code: "4.6", title: "Scripting and remote access basics" },
];

function withId(def: (typeof OBJECTIVE_DEFS)[number], exam: ExamId): ExamObjective {
  return {
    id: `${exam}-${def.code}`,
    exam,
    domainId: def.domainId,
    code: def.code,
    title: def.title,
  };
}

export const EXAM_OBJECTIVES: ExamObjective[] = OBJECTIVE_DEFS.flatMap((def) => {
  const archive = examForTrack(examCore(def.exam), "v14");
  return [withId(def, def.exam), withId({ ...def, exam: archive }, archive)];
});

export function weightsForTrack(track: ExamTrack): DomainWeight[] {
  return track === "v14" ? V14_WEIGHTS : V15_WEIGHTS;
}

export function objectivesForExam(exam: ExamId): ExamObjective[] {
  return EXAM_OBJECTIVES.filter((item) => item.exam === exam);
}

export function objectivesForDomain(exam: ExamId, domainId: string): ExamObjective[] {
  return EXAM_OBJECTIVES.filter((item) => item.exam === exam && item.domainId === domainId);
}

export function weightForDomain(exam: ExamId, domainId: string): number {
  const row = [...V15_WEIGHTS, ...V14_WEIGHTS].find(
    (item) => item.exam === exam && item.domainId === domainId,
  );
  return row?.percent ?? 0;
}

export const READY_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;
export const QUIZ_PASS_RATIO = 0.8;

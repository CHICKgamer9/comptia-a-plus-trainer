import type { Domain } from "./types";

export const domains: Domain[] = [
  {
    id: "mobile-devices",
    exam: "220-1101",
    number: 1,
    title: "Mobile Devices",
    weight: "15%",
    summary:
      "Laptops, phones, and tablets: hardware parts, docks, wireless radios, and how they connect to everything else.",
    lessonId: "mobile-devices-essentials",
    quizId: "mobile-devices-quiz",
  },
  {
    id: "networking",
    exam: "220-1101",
    number: 2,
    title: "Networking",
    weight: "20%",
    summary:
      "How packets move: ports, IP addressing, SOHO gear, Wi-Fi standards, and the tools that prove a path is up.",
    lessonId: "networking-essentials",
    quizId: "networking-quiz",
  },
  {
    id: "hardware",
    exam: "220-1101",
    number: 3,
    title: "Hardware",
    weight: "25%",
    summary:
      "Cables, RAM, storage, RAID, motherboards, CPUs, and power — the parts you actually swap on a bench.",
    lessonId: "hardware-essentials",
    quizId: "hardware-quiz",
  },
  {
    id: "virtualization-cloud",
    exam: "220-1101",
    number: 4,
    title: "Virtualization & Cloud",
    weight: "11%",
    summary:
      "Hypervisors, virtual machines, and the IaaS / PaaS / SaaS models you will see on tickets and the exam.",
    lessonId: "virtualization-cloud-essentials",
    quizId: "virtualization-cloud-quiz",
  },
  {
    id: "hw-net-troubleshooting",
    exam: "220-1101",
    number: 5,
    title: "Hardware & Network Troubleshooting",
    weight: "29%",
    summary:
      "A method you can reuse: identify, theorize, test, fix, verify, document — plus the common failure patterns.",
    lessonId: "hw-net-troubleshooting-essentials",
    quizId: "hw-net-troubleshooting-quiz",
  },
  {
    id: "operating-systems",
    exam: "220-1102",
    number: 1,
    title: "Operating Systems",
    weight: "31%",
    summary:
      "Windows 10/11 in depth, plus enough macOS and Linux to install, navigate, and support a mixed shop.",
    lessonId: "operating-systems-essentials",
    quizId: "operating-systems-quiz",
  },
  {
    id: "security",
    exam: "220-1102",
    number: 2,
    title: "Security",
    weight: "25%",
    summary:
      "Malware, social engineering, wireless hardening, account controls, and the physical side of a locked-down desk.",
    lessonId: "security-essentials",
    quizId: "security-quiz",
  },
  {
    id: "software-troubleshooting",
    exam: "220-1102",
    number: 3,
    title: "Software Troubleshooting",
    weight: "22%",
    summary:
      "BSODs, failed boots, broken apps, and mobile OS problems — diagnose with logs and known-good tools.",
    lessonId: "software-troubleshooting-essentials",
    quizId: "software-troubleshooting-quiz",
  },
  {
    id: "operational-procedures",
    exam: "220-1102",
    number: 4,
    title: "Operational Procedures",
    weight: "22%",
    summary:
      "Safety, change control, backups, documentation, and how a professional ticket should actually get closed.",
    lessonId: "operational-procedures-essentials",
    quizId: "operational-procedures-quiz",
  },
];

import type { PathCheck } from "./types";

export interface PbqTask {
  id: string;
  title: string;
  minutes: number;
  objective: string;
  check: PathCheck;
}

/** Original study-aid PBQs. Not official CompTIA items. */
export const PBQ_TASKS: PbqTask[] = [
  {
    id: "pbq-ports",
    title: "Match ports",
    minutes: 3,
    objective: "2.1",
    check: {
      id: "pbq-ports-check",
      type: "match",
      prompt: "Match each well-known port to the service a helpdesk ticket would name.",
      pairs: [
        { left: "22", right: "SSH" },
        { left: "53", right: "DNS" },
        { left: "67 / 68", right: "DHCP" },
        { left: "443", right: "HTTPS" },
      ],
      extraRights: ["Telnet", "SMTP"],
      why: "22 SSH, 53 DNS, 67/68 DHCP, 443 HTTPS. 23 is Telnet (do not use). 25 is SMTP.",
    },
  },
  {
    id: "pbq-order",
    title: "Order troubleshooting steps",
    minutes: 3,
    objective: "5.1",
    check: {
      id: "pbq-order-check",
      type: "order",
      prompt: "Put the field troubleshooting loop in the order you actually work a ticket.",
      items: [
        { id: "id", label: "Identify the problem" },
        { id: "theory", label: "Establish a theory of probable cause" },
        { id: "test", label: "Test the theory to determine the cause" },
        { id: "plan", label: "Plan and implement the fix" },
        { id: "verify", label: "Verify full function and prevent repeats" },
        { id: "doc", label: "Document findings and the outcome" },
      ],
      correctOrder: ["id", "theory", "test", "plan", "verify", "doc"],
      why: "Identify → theory → test → plan/fix → verify → document. Skipping identify is how you replace a board for a loose cord.",
    },
  },
  {
    id: "pbq-parts",
    title: "Pick parts for a ticket",
    minutes: 3,
    objective: "1.1",
    check: {
      id: "pbq-parts-check",
      type: "choice",
      prompt:
        "Ticket: a thin laptop is slow; the user wants “a faster CPU.” The service manual shows a BGA chip. What do you order or say?",
      choices: [
        {
          id: "a",
          label: "Do not order a CPU — most thin-and-lights are soldered; offer a different machine or live with it",
          correct: true,
          why: "FRUs here are RAM (if socketed), storage, battery, display, Wi-Fi card — not a socket swap.",
        },
        {
          id: "b",
          label: "Any LGA desktop CPU will drop in if you buy an adapter",
          correct: false,
          why: "Laptop CPUs are generation- and board-specific, and often not socketed.",
        },
        {
          id: "c",
          label: "Flash BIOS to unlock hidden cores as a paid upgrade",
          correct: false,
          why: "That is not how SKUs work, and it is a good way to brick a board.",
        },
        {
          id: "d",
          label: "Replace the motherboard and the user-supplied gaming GPU together",
          correct: false,
          why: "Scope the ticket. They asked for CPU speed on a soldered ultrabook — be honest.",
        },
      ],
    },
  },
  {
    id: "pbq-fru",
    title: "SODIMM / FRU placement",
    minutes: 3,
    objective: "3.3",
    check: {
      id: "pbq-fru-check",
      type: "match",
      prompt: "Match each part to where it actually goes on a typical repair bench.",
      pairs: [
        { left: "SODIMM", right: "Laptop / SFF memory slot (angled latch)" },
        { left: "DIMM", right: "Desktop long slot with two end latches" },
        { left: "M.2 NVMe", right: "Short board slot, often under a heatsink screw" },
        { left: "2.5-inch SATA SSD", right: "Drive bay or caddy with SATA data + power" },
      ],
      extraRights: ["CPU socket (LGA/AM)", "24-pin ATX on the board edge"],
      why: "SODIMM is the small outline stick. DIMM is desktop. M.2 is the gum-stick slot. 2.5-inch SATA still needs both cables.",
    },
  },
];

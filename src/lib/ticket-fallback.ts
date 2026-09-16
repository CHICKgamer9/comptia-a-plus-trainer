import type { Scenario } from "@/content/types";
import { normalizeTicket } from "./ticket-schema";

const RAW = {
  title: "Practice stub: PC will not power on after a storm",
  ticketId: "TCK-STUB1",
  requester: "Front desk · Maya",
  location: "Lobby",
  priority: "High" as const,
  exam: "220-1101" as const,
  theme: "hardware" as const,
  domainIds: ["hw-net-troubleshooting", "hardware"] as const,
  difficulty: "easy" as const,
  minutes: 8,
  summary: "Offline practice ticket used when AI generation is unavailable.",
  ticket:
    "The lobby PC has no fans and no lights after last night’s thunderstorm. A lamp on the same outlet works. The user already mashed the power button. Guests are checking in on paper.",
  steps: [
    {
      id: "g",
      phase: "gather" as const,
      title: "Gather information",
      prompt: "What is the best first pass before you open the case?",
      findings:
        "The PSU rocker is on. A known-good cord and another outlet change nothing. Still no LEDs.",
      choices: [
        {
          id: "a",
          label:
            "Confirm outlet, cord, PSU switch, and whether any LEDs or fans respond — stay outside the case first",
          correct: true,
          feedback:
            "Correct. Identify the problem on the cheap external path before you condemn a motherboard.",
        },
        {
          id: "b",
          label: "Reimage Windows from USB immediately",
          correct: false,
          feedback: "There is no POST. The OS is not in the room yet.",
        },
        {
          id: "c",
          label: "Replace the motherboard because storms always kill boards first",
          correct: false,
          feedback: "Possible later. Surges often kill the PSU first — test that theory.",
        },
        {
          id: "d",
          label: "Ask the user to run sfc /scannow",
          correct: false,
          feedback: "They cannot run a command on a dark box.",
        },
      ],
    },
    {
      id: "t",
      phase: "tools" as const,
      title: "Choose tests",
      prompt: "External power is ruled out. How do you test the next theory?",
      findings:
        "A PSU tester shows no good rails. A known-good PSU with the same connectors brings POST back.",
      choices: [
        {
          id: "a",
          label: "Use a PSU tester and/or a known-good PSU with the correct 24-pin and CPU power",
          correct: true,
          feedback: "Correct. Known-good power is the cleanest experiment.",
        },
        {
          id: "b",
          label: "Paperclip-test the old PSU and call it good if the fan twitches",
          correct: false,
          feedback: "A paperclip only proves a fan can idle. Weak test on a modern unit.",
        },
        {
          id: "c",
          label: "Toner-probe the Ethernet drop",
          correct: false,
          feedback: "The PC has no power. LAN cabling is a different ticket.",
        },
        {
          id: "d",
          label: "Flash the BIOS from USB on a dead board",
          correct: false,
          feedback: "You cannot flash firmware without standby power.",
        },
      ],
    },
    {
      id: "c",
      phase: "cause" as const,
      title: "Name the root cause",
      prompt: "What actually failed?",
      choices: [
        {
          id: "a",
          label: "Failed PSU after a surge — no rails, so no POST",
          correct: true,
          feedback: "Correct. The known-good PSU brought the board back.",
        },
        {
          id: "b",
          label: "Corrupt Windows user profile",
          correct: false,
          feedback: "Profiles do not suppress PSU rails.",
        },
        {
          id: "c",
          label: "Bad display cable",
          correct: false,
          feedback: "A dark monitor still usually has fans and lights.",
        },
        {
          id: "d",
          label: "DNS outage",
          correct: false,
          feedback: "DNS needs a running OS.",
        },
      ],
    },
    {
      id: "f",
      phase: "fix" as const,
      title: "Apply the fix",
      prompt: "How do you close this professionally?",
      choices: [
        {
          id: "a",
          label:
            "Install a correctly rated PSU, confirm POST and the user’s app, document the surge, suggest a UPS",
          correct: true,
          feedback: "Correct. Verify full function, then add a preventative note.",
        },
        {
          id: "b",
          label: "Throw the old PSU in the break-room trash and leave",
          correct: false,
          feedback: "PSUs are e-waste, and you still need to verify the check-in app.",
        },
        {
          id: "c",
          label: "Reinstall Windows before you test POST",
          correct: false,
          feedback: "You already proved the board POSTs with good power.",
        },
        {
          id: "d",
          label: "Disable the power button in BIOS so they stop pressing it",
          correct: false,
          feedback: "Creative, not helpful.",
        },
      ],
    },
  ],
  debrief:
    "This is the offline practice stub. Dead-box tickets split into power vs POST vs boot vs OS. When AI is configured, the lab generates a fresh ticket each time instead of this scene.",
};

export function fallbackTicket(): Scenario {
  const ticket = normalizeTicket({ ...RAW, domainIds: [...RAW.domainIds] }, "fallback");
  if (!ticket) throw new Error("Fallback ticket failed to normalize");
  return ticket;
}

import type { Scenario } from "../types";

export const hardwareNetworkScenarios: Scenario[] = [
  {
    id: "no-post",
    title: "Front desk PC is dead — no lights, no fans",
    ticketId: "TCK-10482",
    requester: "Maya Chen · Reception",
    location: "Lobby · DESK-FR01",
    priority: "High",
    exam: "220-1101",
    theme: "hardware",
    domainIds: ["hw-net-troubleshooting", "hardware"],
    difficulty: "easy",
    minutes: 8,
    summary: "A storm overnight, then a PC that does nothing when the power button is pressed.",
    ticket:
      "The lobby PC will not turn on. No fans, no lights, no beep. Maya already mashed the power button. She says it “just died” after last night’s thunderstorm. Guests are checking in on paper. A lamp on the same outlet works.",
    steps: [
      {
        id: "no-post-g",
        phase: "gather",
        title: "Gather information",
        prompt:
          "You are on site. What is the best first pass before you open the case?",
        findings:
          "The PSU rocker on the back is ON. The cord is seated. Swapping to a known-good cord and another wall outlet changes nothing. Still no LEDs.",
        choices: [
          {
            id: "a",
            label: "Confirm outlet, cord, PSU switch, and whether any LEDs/fans respond — stay outside the case first",
            correct: true,
            feedback:
              "Correct. Identify the problem and eliminate the cheap external path. A working lamp only proves that outlet can power a lamp, not that the PC’s cord/PSU path is good — you still check those, then move inward.",
          },
          {
            id: "b",
            label: "Reimage the drive from a USB key immediately",
            correct: false,
            feedback:
              "There is no POST and no power. The OS is not in the room yet. Imaging a dark box wastes time.",
          },
          {
            id: "c",
            label: "Replace the motherboard because storms always kill boards first",
            correct: false,
            feedback:
              "Possible later, but you have not tested the PSU path. Surges often kill power supplies first. Do not skip the theory/test loop.",
          },
          {
            id: "d",
            label: "Ask Maya to run sfc /scannow",
            correct: false,
            feedback:
              "She cannot run a command on a machine that will not power on.",
          },
        ],
      },
      {
        id: "no-post-t",
        phase: "tools",
        title: "Choose tests",
        prompt: "External power is ruled out. How do you test the next theory?",
        findings:
          "A PSU tester shows no good rails. A known-good 550 W PSU with the same connectors spins fans and the board’s debug LED starts walking through POST.",
        choices: [
          {
            id: "a",
            label: "Paperclip-test the old PSU and call it good if the fan twitches",
            correct: false,
            feedback:
              "A paperclip only proves a fan can idle. It is a weak test on a modern PSU and you already have better options.",
          },
          {
            id: "b",
            label: "Use a PSU tester and/or a known-good PSU with the correct 24-pin and CPU power",
            correct: true,
            feedback:
              "Correct. Known-good power is the cleanest experiment. A tester is extra confirmation.",
          },
          {
            id: "c",
            label: "Toner-probe the Ethernet drop",
            correct: false,
            feedback:
              "The PC has no power. Cabling the LAN is a different ticket.",
          },
          {
            id: "d",
            label: "Flash the BIOS from a USB on a dead board",
            correct: false,
            feedback:
              "You cannot flash firmware without standby power and a working programmer path.",
          },
        ],
      },
      {
        id: "no-post-c",
        phase: "cause",
        title: "Name the root cause",
        prompt: "What actually failed?",
        choices: [
          {
            id: "a",
            label: "Failed PSU after a surge — no rails, so no POST",
            correct: true,
            feedback:
              "Correct. The known-good PSU brought the board back. The old unit is the fault.",
          },
          {
            id: "b",
            label: "Corrupt Windows user profile",
            correct: false,
            feedback:
              "Profiles do not suppress PSU rails.",
          },
          {
            id: "c",
            label: "Bad display cable",
            correct: false,
            feedback:
              "A dark monitor still usually has fans and lights. You had neither.",
          },
          {
            id: "d",
            label: "DNS outage",
            correct: false,
            feedback:
              "DNS needs a running OS.",
          },
        ],
      },
      {
        id: "no-post-f",
        phase: "fix",
        title: "Apply the fix",
        prompt: "How do you close this professionally?",
        choices: [
          {
            id: "a",
            label:
              "Install a correctly rated PSU, confirm POST and Windows boot, then document the surge and suggest a UPS for the lobby",
            correct: true,
            feedback:
              "Correct. Verify full function, then add a preventative note. A lobby PC on a $20 strip is how this ticket repeats.",
          },
          {
            id: "b",
            label: "Leave the known-good PSU in and throw the old one in the break-room trash",
            correct: false,
            feedback:
              "You can reuse the test PSU if it is the replacement — but PSUs are e-waste, not lunch-room trash, and you still need to verify the guest-check-in apps.",
          },
          {
            id: "c",
            label: "Reinstall Windows “just in case” before you test POST",
            correct: false,
            feedback:
              "You already proved the board POSTs with good power. Do not create a second incident.",
          },
          {
            id: "d",
            label: "Disable the power button in BIOS so Maya stops pressing it",
            correct: false,
            feedback:
              "Creative, not helpful.",
          },
        ],
      },
    ],
    debrief:
      "Dead-box tickets split into power vs. POST vs. boot vs. OS. A storm plus zero LEDs is the power path until proven otherwise. Test with a known-good PSU, replace with the right wattage and connectors, verify the user’s actual job (check-in app), and write down the surge so facilities can talk UPS.",
  },
  {
    id: "no-display-ram",
    title: "No display after a memory upgrade",
    ticketId: "TCK-11017",
    requester: "Sam Ortiz · Accounting",
    location: "Bldg B · ACC-04",
    priority: "High",
    exam: "220-1101",
    theme: "hardware",
    domainIds: ["hardware", "hw-net-troubleshooting"],
    difficulty: "medium",
    minutes: 9,
    summary: "User installed extra RAM last night. Fans spin. Screen stays black.",
    ticket:
      "Sam added a second 16 GB DDR4 stick he bought online. This morning: fans spin, keyboard LEDs light, no beep speaker is installed, monitor stays black on HDMI. He already reseated the HDMI cable. The PC POSTed yesterday on one stick.",
    steps: [
      {
        id: "ram-g",
        phase: "gather",
        title: "Gather information",
        prompt: "What history matters most?",
        findings:
          "Board is a consumer ATX with two channel-color slots. The new stick is a different brand and rated speed than the original. Sam put both sticks in the two slots closest to the CPU because they “looked empty first.”",
        choices: [
          {
            id: "a",
            label: "The last change was RAM — confirm slot layout, stick compatibility, and whether it POSTed before the upgrade",
            correct: true,
            feedback:
              "Correct. Identify recent changes. POST-then-black after RAM is a seating, pairing, or compatibility story.",
          },
          {
            id: "b",
            label: "Ask whether his mailbox quota is full",
            correct: false,
            feedback:
              "Unrelated to a black POST.",
          },
          {
            id: "c",
            label: "Start by updating the video driver in Windows",
            correct: false,
            feedback:
              "You cannot reach Windows if you never leave POST.",
          },
          {
            id: "d",
            label: "Tell him HDMI is deprecated so he must buy DisplayPort",
            correct: false,
            feedback:
              "HDMI worked yesterday. Do not invent a cable standard problem.",
          },
        ],
      },
      {
        id: "ram-t",
        phase: "tools",
        title: "Choose tests",
        prompt: "How do you test the RAM theory with the fewest variables?",
        findings:
          "Original stick in the vendor-preferred slot (A2) POSTs and shows video. New stick alone also POSTs. Both sticks in the two slots next to the CPU: black screen. Both sticks in A2/B2 (the manual’s dual-channel pair): POST succeeds.",
        choices: [
          {
            id: "a",
            label: "Minimal boot: one known-good stick in the manual’s preferred slot, then try the new stick, then the correct dual-channel pair",
            correct: true,
            feedback:
              "Correct. One change at a time. You proved both sticks live and the slot pair was the failure.",
          },
          {
            id: "b",
            label: "MemTest all night before you try to get a picture",
            correct: false,
            feedback:
              "MemTest is great after you can POST. You needed picture first.",
          },
          {
            id: "c",
            label: "Replace the monitor",
            correct: false,
            feedback:
              "The same monitor worked yesterday and you have not isolated RAM yet.",
          },
          {
            id: "d",
            label: "Clear disk partitions",
            correct: false,
            feedback:
              "Destructive and irrelevant to POST.",
          },
        ],
      },
      {
        id: "ram-c",
        phase: "cause",
        title: "Name the root cause",
        prompt: "Why was the screen black?",
        choices: [
          {
            id: "a",
            label: "Sticks were in the wrong slots for this board’s dual-channel layout, so the memory training/POST failed",
            correct: true,
            feedback:
              "Correct. Many boards will not train if both DIMMs sit on the same channel in the “first two holes.” The manual’s A2/B2 pair is the usual answer.",
          },
          {
            id: "b",
            label: "HDMI cannot carry a Windows desktop after a RAM change",
            correct: false,
            feedback:
              "HDMI does not care how much RAM you have.",
          },
          {
            id: "c",
            label: "The new stick was dead",
            correct: false,
            feedback:
              "It POSTed alone. Not dead.",
          },
          {
            id: "d",
            label: "Secure Boot blocks extra RAM",
            correct: false,
            feedback:
              "Secure Boot is about OS loaders, not DIMM population.",
          },
        ],
      },
      {
        id: "ram-f",
        phase: "fix",
        title: "Apply the fix",
        prompt: "What do you leave behind?",
        choices: [
          {
            id: "a",
            label:
              "Populate A2/B2, confirm POST and 32 GB in Windows, optionally set XMP/EXPO only if both kits tolerate it, document the slot map",
            correct: true,
            feedback:
              "Correct. Verify in the OS, be conservative with mixed-kit XMP, and write the slot map on the ticket so Sam does not “fix” it again.",
          },
          {
            id: "b",
            label: "Leave the sticks in the wrong slots and enable XMP to force training",
            correct: false,
            feedback:
              "You already saw those slots fail. Do not add speed profiles on a broken population.",
          },
          {
            id: "c",
            label: "Tape over the extra slots so users cannot upgrade",
            correct: false,
            feedback:
              "Education beats tape.",
          },
          {
            id: "d",
            label: "Install ECC registered DIMMs because they are “more compatible”",
            correct: false,
            feedback:
              "ECC REG will not boot a typical consumer board.",
          },
        ],
      },
    ],
    debrief:
      "After a hardware change, the last change is the first theory. Minimal configuration (one stick, correct slot) is faster than replacing monitors or OS installs. Dual-channel color codes are not decoration — they are the map.",
  },
  {
    id: "overheating-laptop",
    title: "Engineering laptop throttles and shuts down",
    ticketId: "TCK-11840",
    requester: "Priya Nair · CAD",
    location: "Remote · LT-E22",
    priority: "Medium",
    exam: "220-1101",
    theme: "hardware",
    domainIds: ["mobile-devices", "hw-net-troubleshooting"],
    difficulty: "medium",
    minutes: 8,
    summary: "Under load the laptop becomes a space heater, then dies.",
    ticket:
      "Priya’s laptop shuts down after 15 minutes of a CAD render. It is burning hot near the vent. It used to finish overnight jobs. She works with it on a couch cushion. Dust is visible in the intake. Battery health in Windows looks normal.",
    steps: [
      {
        id: "hot-g",
        phase: "gather",
        title: "Gather information",
        prompt: "Which details actually change your theory?",
        findings:
          "Event Viewer shows Kernel-Power 41 at the shutdown times. No BSOD dump. On a hard desk with a cooling pad, it lasts longer but still hits 95°C on the CPU sensor.",
        choices: [
          {
            id: "a",
            label: "Shutdowns under render, high skin temp, stuffed intake, and Kernel-Power 41 — this is thermal, not a random OS crash",
            correct: true,
            feedback:
              "Correct. Power-loss events without a bugcheck plus heat is throttling/thermal trip.",
          },
          {
            id: "b",
            label: "She needs a larger mailbox",
            correct: false,
            feedback:
              "Unrelated.",
          },
          {
            id: "c",
            label: "CAD is incompatible with laptops as a rule",
            correct: false,
            feedback:
              "It worked before. Something changed: dust, paste, airflow.",
          },
          {
            id: "d",
            label: "Disable the battery so it cannot overheat",
            correct: false,
            feedback:
              "The CPU/GPU and heatsink path are the heat source. Removing the battery does not clean fans.",
          },
        ],
      },
      {
        id: "hot-t",
        phase: "tools",
        title: "Choose tests",
        prompt: "What do you actually do on the bench?",
        findings:
          "Canned air (short bursts) drops idle temps 12°C. After a proper clean and new paste per the service guide, a 30-minute stress test holds 82°C and does not power off.",
        choices: [
          {
            id: "a",
            label: "Stress test with temps visible, clean the heatsink path, reseat with fresh paste if the vendor process allows",
            correct: true,
            feedback:
              "Correct. Prove heat, then service the path, then prove the render stays up.",
          },
          {
            id: "b",
            label: "Reinstall Windows to lower temperatures",
            correct: false,
            feedback:
              "The OS is not clogging the fin stack.",
          },
          {
            id: "c",
            label: "Disable the fan in the BIOS to make it quieter",
            correct: false,
            feedback:
              "That is how you cook a CPU on purpose.",
          },
          {
            id: "d",
            label: "Wrap the chassis in a blanket for “even heat”",
            correct: false,
            feedback:
              "Please do not.",
          },
        ],
      },
      {
        id: "hot-c",
        phase: "cause",
        title: "Name the root cause",
        prompt: "What was killing the job?",
        choices: [
          {
            id: "a",
            label: "Blocked airflow plus a dried thermal interface — CPU hit thermal protection",
            correct: true,
            feedback:
              "Correct. Cushions starve intakes. Dust and old paste finish the job.",
          },
          {
            id: "b",
            label: "A failed CMOS battery",
            correct: false,
            feedback:
              "That resets clocks, not 95°C sensors.",
          },
          {
            id: "c",
            label: "Wrong default gateway",
            correct: false,
            feedback:
              "Network path is unrelated to shutdown-on-heat.",
          },
          {
            id: "d",
            label: "RAID 0 rebuild",
            correct: false,
            feedback:
              "There is no array in this laptop story.",
          },
        ],
      },
      {
        id: "hot-f",
        phase: "fix",
        title: "Apply the fix",
        prompt: "How do you prevent the next ticket?",
        choices: [
          {
            id: "a",
            label:
              "Return it cleaned and paste-serviced, confirm a full render, and tell Priya to use a hard surface — schedule periodic dust-outs if she renders daily",
            correct: true,
            feedback:
              "Correct. Verify the actual workload, then educate. Documentation should mention the couch cushion so the next tech is not confused.",
          },
          {
            id: "b",
            label: "Undervolt in an unofficial tool and close the ticket without testing",
            correct: false,
            feedback:
              "Unsupported undervolts are a new incident. You already have a hardware fix.",
          },
          {
            id: "c",
            label: "Disable thermal shutdown in the firmware",
            correct: false,
            feedback:
              "That is how you get a melted socket.",
          },
          {
            id: "d",
            label: "Issue a desktop and confiscate the laptop without explanation",
            correct: false,
            feedback:
              "Maybe later if CAD outgrows the chassis — not the first close.",
          },
        ],
      },
    ],
    debrief:
      "Laptops fail from pillows and dust more often than from “Windows being hot.” Read Kernel-Power 41 as a clue, measure temps, clean the real path, and verify with the user’s actual render — not a 30-second idle.",
  },
  {
    id: "phone-wont-charge",
    title: "Warehouse phone will not charge",
    ticketId: "TCK-12005",
    requester: "Luis Romero · Warehouse",
    location: "Dock 3",
    priority: "Medium",
    exam: "220-1101",
    theme: "mobile",
    domainIds: ["mobile-devices"],
    difficulty: "easy",
    minutes: 7,
    summary: "Android handset only charges at an angle — or not at all.",
    ticket:
      "The shared Android scanner-phone dies by lunch. Luis says the cable “has to be held just right.” They already tried a car charger. The phone still powers on. The port looks fuzzy. Wireless charging is not used on this model.",
    steps: [
      {
        id: "ph-g",
        phase: "gather",
        title: "Gather information",
        prompt: "What do you confirm before you order a board?",
        findings:
          "A known-good USB-C cable and brick still fail unless the plug is wedged. A flashlight shows lint packed on the CC pins. The phone charges at 0 W on a meter when inserted normally.",
        choices: [
          {
            id: "a",
            label: "Try known-good cable/brick, inspect the port, and see whether the phone still boots on its remaining charge",
            correct: true,
            feedback:
              "Correct. Split “won’t charge” from “won’t turn on.” Angle-sensitive charge is almost always the port or the cable.",
          },
          {
            id: "b",
            label: "Factory reset immediately",
            correct: false,
            feedback:
              "Software does not pack lint into a receptacle.",
          },
          {
            id: "c",
            label: "Replace the motherboard first — ports are never field issues",
            correct: false,
            feedback:
              "Ports and cables fail constantly in warehouses.",
          },
          {
            id: "d",
            label: "Enable Airplane mode to increase charge speed",
            correct: false,
            feedback:
              "Airplane mode can reduce drain. It will not fix a physical open circuit.",
          },
        ],
      },
      {
        id: "ph-t",
        phase: "tools",
        title: "Choose tests",
        prompt: "How do you work the port safely?",
        findings:
          "Non-metal pick and isopropyl around the mouth (powered off) remove a felt slab of lint. The known-good PD charger now reports 18 W. A charge cycle holds.",
        choices: [
          {
            id: "a",
            label: "Power off, remove debris with a non-conductive pick / ESD-safe method, then retest with a known-good PD charger",
            correct: true,
            feedback:
              "Correct. No knives, no compressed-air blasts that drive lint deeper, no powered probing with a paperclip.",
          },
          {
            id: "b",
            label: "Blow the port with a shop air compressor",
            correct: false,
            feedback:
              "High PSI drives debris into the contacts and can damage the receptacle.",
          },
          {
            id: "c",
            label: "Jam a metal sim-ejector in while it is plugged into mains",
            correct: false,
            feedback:
              "That is how you short VBUS to ground — and maybe yourself.",
          },
          {
            id: "d",
            label: "Wrap the cable in tape to make it thicker",
            correct: false,
            feedback:
              "You would wreck the port strain relief.",
          },
        ],
      },
      {
        id: "ph-c",
        phase: "cause",
        title: "Name the root cause",
        prompt: "Why would it not charge?",
        choices: [
          {
            id: "a",
            label: "Debris in the USB-C port prevented a solid PD/CC connection",
            correct: true,
            feedback:
              "Correct. USB-C needs those small pins. Lint is enough to fail negotiation.",
          },
          {
            id: "b",
            label: "The cellular APN was blank",
            correct: false,
            feedback:
              "APN is data, not watts.",
          },
          {
            id: "c",
            label: "The battery was swollen and open-circuit",
            correct: false,
            feedback:
              "The phone still ran, and cleaning the port restored charge. Not the pack.",
          },
          {
            id: "d",
            label: "Android needs NTFS on internal storage to charge",
            correct: false,
            feedback:
              "Not a thing.",
          },
        ],
      },
      {
        id: "ph-f",
        phase: "fix",
        title: "Apply the fix",
        prompt: "How do you make this last a week in a dusty dock?",
        choices: [
          {
            id: "a",
            label:
              "Return a clean port + known-good cable, add a spare cable to the dock kit, and note “no metal picks / no compressor” for the next tech",
            correct: true,
            feedback:
              "Correct. Warehouses kill cables. Stock spares and write the safe clean method on the asset.",
          },
          {
            id: "b",
            label: "Disable charging in software so they use a new phone every day",
            correct: false,
            feedback:
              "Expensive satire.",
          },
          {
            id: "c",
            label: "Super-glue the cable into the port",
            correct: false,
            feedback:
              "Please do not.",
          },
          {
            id: "d",
            label: "Convert the phone to Lightning with an adapter permanently",
            correct: false,
            feedback:
              "Wrong ecosystem and it does not fix lint.",
          },
        ],
      },
    ],
    debrief:
      "Mobile charge tickets are physical until proven otherwise: cable, brick, debris, then battery, then board. USB-C PD can fail negotiation with a mouth full of pocket lint. Known-good parts beat swapping motherboards on a hunch.",
  },
  {
    id: "intermittent-wifi",
    title: "Intermittent Wi-Fi in the east conference room",
    ticketId: "TCK-13011",
    requester: "Facilities · Conf-East",
    location: "East conference room",
    priority: "High",
    exam: "220-1101",
    theme: "network",
    domainIds: ["networking", "hw-net-troubleshooting"],
    difficulty: "medium",
    minutes: 10,
    summary: "Every laptop drops in one room. The rest of the floor is fine.",
    ticket:
      "Hybrid meetings in Conf-East keep dying. Users roam in with corporate laptops that work at their desks. The SSID appears, then latency spikes and Zoom drops. A new analog wireless camera was mounted last week for “overflow seating.” The AP in the hall serves this room.",
    steps: [
      {
        id: "wifi-g",
        phase: "gather",
        title: "Gather information",
        prompt: "What scope question saves you a day of reimaging laptops?",
        findings:
          "Three different models fail only in this room. Phones too. 5 GHz is worse than 2.4 GHz today. A Wi-Fi analyzer in the room shows the AP on channel 36 overlapping a screaming non-Wi-Fi emitter in the same band.",
        choices: [
          {
            id: "a",
            label: "Is it one laptop or every client, and only this room? That splits client OS from RF/AP",
            correct: true,
            feedback:
              "Correct. Multi-client, single-location is the RF or that AP — not a Windows image.",
          },
          {
            id: "b",
            label: "Reinstall Office on the director’s laptop first",
            correct: false,
            feedback:
              "Scope first. One VIP does not define the incident.",
          },
          {
            id: "c",
            label: "Assume DHCP is down company-wide",
            correct: false,
            feedback:
              "Desks still work. DHCP would be broader.",
          },
          {
            id: "d",
            label: "Disable Ethernet on all laptops so they “focus on Wi-Fi”",
            correct: false,
            feedback:
              "Not a diagnostic.",
          },
        ],
      },
      {
        id: "wifi-t",
        phase: "tools",
        title: "Choose tests",
        prompt: "Which toolkit actually speaks this language?",
        findings:
          "Analyzer: duty cycle on 5 GHz jumps when the new camera is powered. Unplug camera: SNR recovers, Zoom holds. AP logs show clients roaming and retrying, not DHCP NAK storms.",
        choices: [
          {
            id: "a",
            label: "Wi-Fi analyzer / spectrum view, AP logs, and a controlled power-off of the new camera",
            correct: true,
            feedback:
              "Correct. You correlated a new interferer with retries. That is testing a theory.",
          },
          {
            id: "b",
            label: "Toner probe the camera’s HDMI",
            correct: false,
            feedback:
              "Wrong layer.",
          },
          {
            id: "c",
            label: "chkdsk on every laptop",
            correct: false,
            feedback:
              "Disks are not RF.",
          },
          {
            id: "d",
            label: "Replace the core switch supervisor",
            correct: false,
            feedback:
              "Far too wide, and desks still work.",
          },
        ],
      },
      {
        id: "wifi-c",
        phase: "cause",
        title: "Name the root cause",
        prompt: "What is breaking the meeting?",
        choices: [
          {
            id: "a",
            label: "The new analog wireless camera is saturating 5 GHz in that room (interference), not a bad SSID password",
            correct: true,
            feedback:
              "Correct. Legacy cameras and poorly shielded links are famous 2.4/5 GHz pests.",
          },
          {
            id: "b",
            label: "WPA3 on the laptops only",
            correct: false,
            feedback:
              "Auth would fail everywhere, not just Conf-East.",
          },
          {
            id: "c",
            label: "APIPA on the whole VLAN",
            correct: false,
            feedback:
              "Users associated and started Zoom — they had leases.",
          },
          {
            id: "d",
            label: "A failed CMOS on the AP",
            correct: false,
            feedback:
              "Possible in other tickets. Here the camera power-off test is the smoking gun.",
          },
        ],
      },
      {
        id: "wifi-f",
        phase: "fix",
        title: "Apply the fix",
        prompt: "What is the adult solution?",
        choices: [
          {
            id: "a",
            label:
              "Move the camera to wired or a non-overlapping band, or replace it; confirm a full meeting; document the interferer for facilities",
            correct: true,
            feedback:
              "Correct. Remove the interferer or give it a wired backhaul. Verify with the real workload (Zoom), then write it down so the camera does not return next remodel.",
          },
          {
            id: "b",
            label: "Hide the SSID so interference cannot find it",
            correct: false,
            feedback:
              "Hidden SSIDs do not dodge RF energy.",
          },
          {
            id: "c",
            label: "Force every laptop to 2.4 GHz only and close",
            correct: false,
            feedback:
              "A workaround that tanks capacity. Fix the camera.",
          },
          {
            id: "d",
            label: "Issue mobile hotspots to the whole company",
            correct: false,
            feedback:
              "Not a conference-room design.",
          },
        ],
      },
    ],
    debrief:
      "Scope first: one room, many clients = RF or AP. Analyzers and a simple unplug test beat reimaging. Analog wireless cameras, poorly shielded HDMI senders, and microwaves still show up on real floors — and on A+.",
  },
  {
    id: "dns-failure",
    title: "“The internet is down” but Slack still pings",
    ticketId: "TCK-13220",
    requester: "Jordan Hale · Sales",
    location: "Remote · LT-S14",
    priority: "Medium",
    exam: "220-1101",
    theme: "network",
    domainIds: ["networking", "hw-net-troubleshooting"],
    difficulty: "easy",
    minutes: 8,
    summary: "Browser names fail. Raw IPs work. Classic DNS.",
    ticket:
      "Jordan says the internet died after “the home router blinked.” Slack (already open) still sends. Chrome cannot reach any site by name. A coworker on the same SSID is fine. Jordan recently set a “faster DNS” in the NIC properties after a YouTube video.",
    steps: [
      {
        id: "dns-g",
        phase: "gather",
        title: "Gather information",
        prompt: "Which two tests split this ticket in thirty seconds?",
        findings:
          "ipconfig /all shows a DHCP address and gateway, but DNS is statically set to 1.2.3.4 (not a resolver). ping 8.8.8.8 works. ping www.example.com fails. nslookup times out.",
        choices: [
          {
            id: "a",
            label: "Ping a public IP, then ping/resolve a name — and read ipconfig /all for DNS servers",
            correct: true,
            feedback:
              "Correct. IP works, names fail, DNS field is garbage. You are done theorizing.",
          },
          {
            id: "b",
            label: "Replace the dock",
            correct: false,
            feedback:
              "The coworker is fine on the same SSID. The NIC config is the delta.",
          },
          {
            id: "c",
            label: "Reinstall Chrome as step one",
            correct: false,
            feedback:
              "nslookup fails too. Not a browser.",
          },
          {
            id: "d",
            label: "Flash the home router firmware immediately",
            correct: false,
            feedback:
              "Possible later if DHCP were broken for everyone. It is not.",
          },
        ],
      },
      {
        id: "dns-t",
        phase: "tools",
        title: "Choose tests",
        prompt: "How do you prove the static DNS is the villain?",
        findings:
          "Setting the NIC back to “Obtain DNS automatically” and ipconfig /flushdns makes nslookup answer via the ISP resolver. Sites load.",
        choices: [
          {
            id: "a",
            label: "Set DNS to automatic (or a known-good resolver), flush the cache, retry nslookup and a browser name",
            correct: true,
            feedback:
              "Correct. One setting, two verifies.",
          },
          {
            id: "b",
            label: "bootrec /rebuildbcd",
            correct: false,
            feedback:
              "Boot config is not DNS.",
          },
          {
            id: "c",
            label: "Disable IPv4 to force IPv6 only",
            correct: false,
            feedback:
              "You would likely add a second outage.",
          },
          {
            id: "d",
            label: "Delete the Wi-Fi driver and hope",
            correct: false,
            feedback:
              "You already have a layer-7 name problem, not a missing NIC.",
          },
        ],
      },
      {
        id: "dns-c",
        phase: "cause",
        title: "Name the root cause",
        prompt: "What broke name resolution?",
        choices: [
          {
            id: "a",
            label: "A static DNS server that is not a real resolver, plus a stale cache",
            correct: true,
            feedback:
              "Correct. 1.2.3.4 is not “faster Google.” It is a leftover from a video.",
          },
          {
            id: "b",
            label: "Failed default gateway",
            correct: false,
            feedback:
              "Ping to 8.8.8.8 would have failed.",
          },
          {
            id: "c",
            label: "APIPA",
            correct: false,
            feedback:
              "They had a real DHCP address.",
          },
          {
            id: "d",
            label: "Bad HDMI handshake",
            correct: false,
            feedback:
              "Video cables do not resolve FQDNs.",
          },
        ],
      },
      {
        id: "dns-f",
        phase: "fix",
        title: "Apply the fix",
        prompt: "How do you leave Jordan better than you found him?",
        choices: [
          {
            id: "a",
            label:
              "DHCP DNS (or a documented resolver), flush cache, confirm browsing, warn about random “faster DNS” videos, document the NIC change",
            correct: true,
            feedback:
              "Correct. Educate without shaming. Write the before/after DNS servers on the ticket.",
          },
          {
            id: "b",
            label: "Hardcode 8.8.8.8 on every laptop in sales without asking IT",
            correct: false,
            feedback:
              "That breaks split-horizon/internal names later. Not your freelance architecture.",
          },
          {
            id: "c",
            label: "Disable the Windows DNS Client service",
            correct: false,
            feedback:
              "That makes every name lookup worse.",
          },
          {
            id: "d",
            label: "Tell him to only use IP addresses forever",
            correct: false,
            feedback:
              "Humans will not memorize CDNs.",
          },
        ],
      },
    ],
    debrief:
      "“Internet down” is three tests: lease, ping IP, resolve name. This one failed only the third. User-set DNS is a frequent self-inflicted wound. Flush the cache after you fix the server list or you will gaslight yourself.",
  },
  {
    id: "apipa-no-network",
    title: "New drop lights up — PC has no network",
    ticketId: "TCK-13550",
    requester: "Noah Kim · Facilities",
    location: "Annex · ANN-02",
    priority: "High",
    exam: "220-1101",
    theme: "network",
    domainIds: ["networking", "hw-net-troubleshooting"],
    difficulty: "medium",
    minutes: 9,
    summary: "Link light on, 169.254 address, brand-new wall jack.",
    ticket:
      "Noah punched down a new drop to the annex desk. The NIC shows a link. Windows says “No Internet” and the address is 169.254.41.12. The patch panel port was labeled VLAN 40 (voice) because the sticker was leftover from a phone. User needs data VLAN 20.",
    steps: [
      {
        id: "ap-g",
        phase: "gather",
        title: "Gather information",
        prompt: "What does APIPA plus a link light already tell you?",
        findings:
          "ipconfig /renew fails. A laptop on a known data jack in the same room gets 10.20.x.x immediately. The switch port for the new drop is in VLAN 40. DHCP for phones is a different scope the PC ignores.",
        choices: [
          {
            id: "a",
            label: "Layer 1 is up; DHCP on a usable data scope is not — check VLAN/port and the DHCP path",
            correct: true,
            feedback:
              "Correct. Do not replace the NIC first. Link + APIPA is services/VLAN.",
          },
          {
            id: "b",
            label: "The default gateway in Beijing is down",
            correct: false,
            feedback:
              "They never got a lease. Gateway is later.",
          },
          {
            id: "c",
            label: "Windows needs a static 169.254.0.1",
            correct: false,
            feedback:
              "That is not how you “fix” APIPA.",
          },
          {
            id: "d",
            label: "Replace the user’s SSD",
            correct: false,
            feedback:
              "Storage is not DHCP.",
          },
        ],
      },
      {
        id: "ap-t",
        phase: "tools",
        title: "Choose tests",
        prompt: "How do you confirm the VLAN theory?",
        findings:
          "Moving the switch port to VLAN 20 and bouncing it yields a 10.20.x.x lease and a pingable gateway. The punch-down pair test was already clean.",
        choices: [
          {
            id: "a",
            label: "Compare a known-good data jack, read the switch VLAN, renew DHCP after a port correction",
            correct: true,
            feedback:
              "Correct. You used a control client and the switch config — not guesswork.",
          },
          {
            id: "b",
            label: "Run a toner on the fiber backbone first",
            correct: false,
            feedback:
              "The drop already has a link. Toner is for finding a lost pair.",
          },
          {
            id: "c",
            label: "Rebuild BCD",
            correct: false,
            feedback:
              "Wrong domain.",
          },
          {
            id: "d",
            label: "Enable WEP on the NIC",
            correct: false,
            feedback:
              "This is a wired drop.",
          },
        ],
      },
      {
        id: "ap-c",
        phase: "cause",
        title: "Name the root cause",
        prompt: "Why APIPA?",
        choices: [
          {
            id: "a",
            label: "The switch port was left in the voice VLAN, so the PC never reached the data DHCP server",
            correct: true,
            feedback:
              "Correct. Leftover labels lie. Phones and PCs do not share a scope here.",
          },
          {
            id: "b",
            label: "The patch cable was Cat3 so DHCP cannot fit",
            correct: false,
            feedback:
              "You had a link and a later successful lease on the same cable.",
          },
          {
            id: "c",
            label: "APIPA means the default gateway must be 169.254.1.1",
            correct: false,
            feedback:
              "APIPA has no useful gateway. That is the point.",
          },
          {
            id: "d",
            label: "BitLocker blocked DHCP",
            correct: false,
            feedback:
              "BitLocker does not assign VLANs.",
          },
        ],
      },
      {
        id: "ap-f",
        phase: "fix",
        title: "Apply the fix",
        prompt: "What else should you do besides flipping the VLAN?",
        choices: [
          {
            id: "a",
            label:
              "Set the port to VLAN 20, confirm a lease and user apps, relabel the panel/jack, document so the next phone install does not steal it back",
            correct: true,
            feedback:
              "Correct. Verify functionality and fix the lie on the sticker. Labels are part of the repair.",
          },
          {
            id: "b",
            label: "Give the PC a static APIPA-looking address and leave",
            correct: false,
            feedback:
              "They still would not route.",
          },
          {
            id: "c",
            label: "Disable DHCP on the whole switch",
            correct: false,
            feedback:
              "That creates an outage.",
          },
          {
            id: "d",
            label: "Install a desktop switch and NAT under the desk",
            correct: false,
            feedback:
              "A rogue NAT is how you get two tickets next week.",
          },
        ],
      },
    ],
    debrief:
      "New drops fail from labels, VLANs, and punch-downs — not from Windows. APIPA is your cue to ask “which broadcast domain is this port in?” Relabeling is not optional; it is how you stop the next tech from “fixing” it back to voice.",
  },
  {
    id: "printer-offline",
    title: "Accounting printer is offline — payroll is today",
    ticketId: "TCK-14102",
    requester: "Elena Voss · Payroll",
    location: "Bldg B · PRT-ACC1",
    priority: "Critical",
    exam: "220-1101",
    theme: "printer",
    domainIds: ["hardware", "hw-net-troubleshooting"],
    difficulty: "medium",
    minutes: 9,
    summary: "Queue says Use Printer Offline. Panel test page is fine.",
    ticket:
      "Elena cannot print pay stubs. The printer shows ready on the glass panel. Windows on her PC shows the queue paused / Use Printer Offline. Other accounting PCs can print. A night janitor unplugged the printer to vacuum and plugged it back into a different jack. It got a new DHCP IP.",
    steps: [
      {
        id: "pr-g",
        phase: "gather",
        title: "Gather information",
        prompt: "What isolate do you run first?",
        findings:
          "Panel test page is clean. Another PC prints. Elena’s queue is offline and pointed at 10.20.30.50. The printer’s screen now says 10.20.30.88. Ping to .50 fails. Ping to .88 works.",
        choices: [
          {
            id: "a",
            label: "Print a panel test page, try another PC, then compare the queue’s IP to the printer’s actual IP",
            correct: true,
            feedback:
              "Correct. Hardware is fine. One PC + stale IP is the story.",
          },
          {
            id: "b",
            label: "Replace the fuser because payroll is important",
            correct: false,
            feedback:
              "A clean test page says the engine is healthy. Do not throw parts at status.",
          },
          {
            id: "c",
            label: "Reinstall Windows on Elena’s PC",
            correct: false,
            feedback:
              "Nuclear and unrelated.",
          },
          {
            id: "d",
            label: "Disable the print spooler on the print server for everyone",
            correct: false,
            feedback:
              "Others can print. Do not widen the outage.",
          },
        ],
      },
      {
        id: "pr-t",
        phase: "tools",
        title: "Choose tests",
        prompt: "Which tools confirm the path?",
        findings:
          "A TCP ping to 9100 on .88 succeeds. Clearing Offline and pointing the port at .88 (or the reserved name) prints the stub. DHCP reservation is missing on the new jack’s scope.",
        choices: [
          {
            id: "a",
            label: "Ping the configured vs. actual IP, check the printer port in Devices and Printers / Print Management, print a test page from Windows",
            correct: true,
            feedback:
              "Correct. You proved TCP to the device and fixed the port.",
          },
          {
            id: "b",
            label: "MemTest the printer",
            correct: false,
            feedback:
              "Not a thing you do at 8:55 on payroll morning.",
          },
          {
            id: "c",
            label: "nslookup the fuser",
            correct: false,
            feedback:
              "Fusers do not have FQDNs.",
          },
          {
            id: "d",
            label: "bootrec /fixmbr on the printer",
            correct: false,
            feedback:
              "Please do not invent a boot sector on a laser.",
          },
        ],
      },
      {
        id: "pr-c",
        phase: "cause",
        title: "Name the root cause",
        prompt: "Why was Elena offline?",
        choices: [
          {
            id: "a",
            label: "The printer’s DHCP address changed after the move; her queue still targeted the old IP and was marked offline",
            correct: true,
            feedback:
              "Correct. Classic. Reservations and DNS names exist to prevent this.",
          },
          {
            id: "b",
            label: "Low toner always sets Use Printer Offline",
            correct: false,
            feedback:
              "Low toner usually still prints. The panel was ready.",
          },
          {
            id: "c",
            label: "PCL vs. PostScript mismatch",
            correct: false,
            feedback:
              "That produces garbage pages, not a stale IP.",
          },
          {
            id: "d",
            label: "The janitor enabled WEP on the printer",
            correct: false,
            feedback:
              "Creative, not supported by the facts.",
          },
        ],
      },
      {
        id: "pr-f",
        phase: "fix",
        title: "Apply the fix",
        prompt: "How do you keep payroll off this ride next month?",
        choices: [
          {
            id: "a",
            label:
              "Point Elena at the reserved IP or DNS name, uncheck Offline, print stubs, add a DHCP reservation / update the label, tell facilities which jack is “printer only”",
            correct: true,
            feedback:
              "Correct. Fix the user, then the infrastructure, then the label. Verify the actual pay stubs, not only a Windows test page.",
          },
          {
            id: "b",
            label: "Set every PC to a raw 9100 port on a guessed IP",
            correct: false,
            feedback:
              "You would create twenty unique snowflakes.",
          },
          {
            id: "c",
            label: "Leave it and tell Elena to use Write → PDF forever",
            correct: false,
            feedback:
              "Payroll still needs paper in this shop.",
          },
          {
            id: "d",
            label: "Disable DHCP company-wide so addresses never move",
            correct: false,
            feedback:
              "That is not a printer fix; that is a career-limiting event.",
          },
        ],
      },
    ],
    debrief:
      "Panel test page = engine. Other PCs print = server/device path. One PC offline = queue, driver, or IP. DHCP moves after a vacuum day are a rite of passage. Reservations and names are the preventative control.",
  },
];

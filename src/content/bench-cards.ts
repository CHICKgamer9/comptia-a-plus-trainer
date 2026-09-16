import type {
  BenchCard,
  BenchSlot,
  CardRarity,
  CardType,
  FusionRecipe,
} from "./types";

function card(row: BenchCard): BenchCard {
  return row;
}

export const BENCH_SLOTS: { id: BenchSlot; label: string }[] = [
  { id: "chassis", label: "Chassis" },
  { id: "psu", label: "PSU" },
  { id: "cpu", label: "CPU" },
  { id: "ram-a", label: "RAM A" },
  { id: "ram-b", label: "RAM B" },
  { id: "storage-m2", label: "M.2" },
  { id: "storage-sata", label: "SATA" },
  { id: "wifi", label: "Wi-Fi" },
  { id: "display", label: "Display" },
  { id: "tool-wall", label: "Tool wall" },
];

export const CARD_TYPE_TABS: { id: CardType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "component", label: "Components" },
  { id: "symptom", label: "Symptoms" },
  { id: "tool", label: "Tools" },
  { id: "procedure", label: "Procedures" },
  { id: "gotcha", label: "Gotchas" },
  { id: "crest", label: "Crests" },
  { id: "glue", label: "Glue" },
];

export const benchCards: BenchCard[] = [
  card({
    id: "c-so-dimm",
    type: "component",
    rarity: "common",
    title: "SO-DIMM",
    subtitle: "Laptop memory stick — different notch, different length.",
    subtitles: [
      "SO-DIMM is the laptop outline. Desktop DIMM will not clip in.",
      "DDR4 SO-DIMM is 260-pin; DDR5 SO-DIMM is 262-pin. Generations do not mix.",
      "Service manual first. Some boards mix soldered LPDDR with one SODIMM and lose dual channel if you mismatch.",
    ],
    body: "SO-DIMM (small outline) is the laptop memory form factor. A desktop DIMM is a different length and notch. Matching “DDR4” on the label is not an adapter. Read the FRU: soldered LPDDR has no slot at all. If one SODIMM sits beside onboard memory, mixed sizes can drop you to single channel.",
    subject: "tech",
    domain: "mobile-devices",
    pathId: "mobile-devices",
    artHint: "Teal line-art SO-DIMM with notch and pin-count labelled; dashed desktop DIMM beside it for scale.",
    slot: "ram-a",
    tags: ["mobile", "ram", "hardware", "core1", "sodimm"],
    sheetId: "connectors",
  }),
  card({
    id: "c-dimm",
    type: "component",
    rarity: "common",
    title: "DIMM vs SO-DIMM",
    subtitle: "Desktop stick. Will not seat in a laptop, even with hope.",
    subtitles: [
      "DIMM is the desktop outline. Different notch, different length.",
      "Unbuffered consumer DIMM is not registered ECC. The board QVL is the list.",
      "Mixing sizes can disable dual channel. Matched pairs in the correct colour slots.",
    ],
    body: "A DIMM is the long desktop module. It does not become a SO-DIMM because you press harder. ECC registered sticks are another conversation again — most consumer boards will not POST with them. Channel maps are painted on the board silk; use them.",
    subject: "tech",
    domain: "hardware",
    pathId: "hardware",
    artHint: "Side-by-side DIMM and SO-DIMM with length ticks and notch arrows, both labelled.",
    slot: "ram-b",
    tags: ["ram", "hardware", "core1", "dimm"],
    sheetId: "connectors",
  }),
  card({
    id: "c-2280-nvme",
    type: "component",
    rarity: "uncommon",
    title: "2280 NVMe",
    subtitle: "Length 80 mm. Speed is the slot, not the sticker.",
    subtitles: [
      "2280 is millimetres of module length, not a PCIe generation.",
      "M-key NVMe needs a PCIe M.2 slot. A SATA-only M.2 will ignore it.",
      "Check keying, lane count, and the standoff hole before you order the ‘fast’ stick.",
    ],
    body: "M.2 2280 means 22 mm wide, 80 mm long. NVMe talks PCIe. A 2280 SATA card is a different protocol wearing a similar stick. Board diagrams mark which slot is CPU lanes vs chipset, and which is SATA-only. The retail box speed is a wish until the slot agrees.",
    subject: "tech",
    domain: "hardware",
    pathId: "hardware",
    artHint: "M.2 2280 module with 22×80 mm ticks, M-key notch labelled, PCIe lanes noted.",
    slot: "storage-m2",
    tags: ["storage", "nvme", "hardware", "core1", "m2"],
    sheetId: "connectors",
  }),
  card({
    id: "c-sata-ssd",
    type: "component",
    rarity: "common",
    title: "SATA SSD",
    subtitle: "AHCI over SATA. Not NVMe, even in an M.2 shape.",
    subtitles: [
      "2.5-inch or M.2 SATA still speaks AHCI. Different from NVMe.",
      "A SATA data cable plus a SATA power cable. L-shaped 7-pin is data.",
      "RAID/SATA mode in firmware can hide a perfectly good disk from the installer.",
    ],
    body: "SATA SSDs are fast enough for most office boxes and still slower than a decent NVMe. The trap is the M.2 SATA card in an NVMe-only slot — nothing useful happens. Also: a SATA SSD is not a backup just because it is solid-state.",
    subject: "tech",
    domain: "hardware",
    pathId: "hardware",
    artHint: "2.5-inch SSD with SATA data (7-pin) and power (15-pin) labelled separately.",
    slot: "storage-sata",
    tags: ["storage", "sata", "hardware", "core1"],
    sheetId: "raid",
  }),
  card({
    id: "c-usbc-pd",
    type: "component",
    rarity: "uncommon",
    title: "USB-C PD",
    subtitle: "Power Delivery is a handshake, not a shape.",
    subtitles: [
      "A USB-C hole does not promise 100 W, video, or data.",
      "PD profiles are negotiated. A 100 W brick will not force 100 W into a 45 W laptop.",
      "E-marker cables, Alt Mode, and charge-only ports are three different tickets.",
    ],
    body: "USB Type-C is a connector. Power Delivery is a protocol. DisplayPort Alt Mode is another protocol. Thunderbolt is PCIe in the same shape. Charge-only ports exist. A cable can be 3 A when the laptop wanted 5 A — that looks like a dying battery.",
    subject: "tech",
    domain: "mobile-devices",
    pathId: "mobile-devices",
    artHint: "USB-C plug with PD wattage, Alt Mode, and charge-only as three labelled paths, not colour-only.",
    slot: "psu",
    tags: ["mobile", "usb", "power", "core1", "pd"],
    sheetId: "connectors",
  }),
  card({
    id: "c-li-ion",
    type: "component",
    rarity: "common",
    title: "Li-ion pack",
    subtitle: "Chemistry with a swelling failure mode. Do not puncture.",
    subtitles: [
      "State of charge is not health. Swelling is a safety ticket.",
      "Do not crush, puncture, or ‘calibrate it flat’. Isolate and recycle.",
      "Windows percentages do not un-swell a cell. Look at the chassis lift.",
    ],
    body: "Lithium-ion packs swell when they fail. They lift trackpads and crack glass. Shipping mode and charge limits are firmware conversations; a 1 mm palm-rest lift is a replacement conversation. Recycle at a proper drop-off. Do not toss it in household rubbish.",
    subject: "tech",
    domain: "mobile-devices",
    pathId: "mobile-devices",
    artHint: "Laptop side view with swollen pack lifting the palm rest; ‘do not puncture’ labelled.",
    slot: "chassis",
    tags: ["mobile", "battery", "safety", "core1"],
  }),
  card({
    id: "c-wifi-bt",
    type: "component",
    rarity: "common",
    title: "Wi-Fi / Bluetooth combo",
    subtitle: "One M.2 card, two radios, antenna leads in the lid.",
    subtitles: [
      "Combo cards need MAIN and AUX antenna leads seated.",
      "After a screen swap, range collapse is usually a pinched lead, not TCP/IP.",
      "Bluetooth and Wi-Fi share the card. One missing lead can make both sad in different ways.",
    ],
    body: "Most laptops use a Key-E combo card. The antennas live in the lid. Leave a lead off after a panel job and Ethernet will still look fine while the shed disappears. Hiding the SSID is not a security plan and will not reseat a connector.",
    subject: "tech",
    domain: "mobile-devices",
    pathId: "mobile-devices",
    artHint: "Lid outline with MAIN/AUX leads to a combo card; labels, not colour-only.",
    slot: "wifi",
    tags: ["mobile", "wifi", "bluetooth", "antenna", "core1"],
  }),
  card({
    id: "c-hinge",
    type: "component",
    rarity: "uncommon",
    title: "Hinge path",
    subtitle: "Antennas and display cable ride the hinge. It is a wear part.",
    subtitles: [
      "Lid cables fatigue. Flicker at certain angles is a cable, not Windows.",
      "Antenna leads pinch in the hinge during a careless panel swap.",
      "A broken hinge that keeps strain on the cable is a mechanical ticket first.",
    ],
    body: "The hinge is how the lid radios and the eDP cable reach the board. A range cliff after a screen swap is often a lead left off or pinched. Video flicker that follows the lid angle is the cable, not a GPU driver ritual.",
    subject: "tech",
    domain: "mobile-devices",
    pathId: "mobile-devices",
    artHint: "Laptop hinge cross-section with antenna and eDP cable labelled.",
    slot: "display",
    tags: ["mobile", "hinge", "antenna", "display", "core1"],
  }),
  card({
    id: "c-dc-jack",
    type: "component",
    rarity: "uncommon",
    title: "DC jack",
    subtitle: "Barrel or USB-C power inlet. Wiggle-power is a jack, not a CMOS.",
    subtitles: [
      "If charge dies when the barrel wiggles, suspect the jack or harness.",
      "Measure voltage at the jack before you condemn the board.",
      "USB-C charge-only vs PD-capable is a different inlet conversation.",
    ],
    body: "A DC jack can be a board-soldered barrel or a harness. Intermittent charge that follows a wiggle is mechanical. A good brick on a bad jack still looks like a dead pack. Meter the inlet before you order a motherboard because it felt dramatic.",
    subject: "tech",
    domain: "mobile-devices",
    pathId: "mobile-devices",
    artHint: "Barrel jack on a harness with a multimeter probe labelled at the inlet.",
    slot: "psu",
    tags: ["mobile", "power", "dc-jack", "core1"],
  }),
  card({
    id: "c-80plus-psu",
    type: "component",
    rarity: "common",
    title: "80 Plus PSU",
    subtitle: "Efficiency tier. Still read the 12 V rail.",
    subtitles: [
      "80 Plus is efficiency at a load, not a 12 V promise.",
      "GPUs drink 12 V. Combined wattage can starve that rail.",
      "Modular cables are brand-specific. Do not mix looms.",
    ],
    body: "80 Plus Bronze/Gold/Platinum is about waste heat, not whether a 500 W label can feed a GPU spike. Read the 12 V amperage and the CPU/GPU 8-pin count. Peak vs continuous matters. A bargain unit brown-outs as random reboots, not a polite toast.",
    subject: "tech",
    domain: "hardware",
    pathId: "hardware",
    artHint: "PSU label sketch with 12 V amperage circled and 80 Plus tier labelled beside it.",
    slot: "psu",
    tags: ["psu", "hardware", "core1", "power"],
  }),
  card({
    id: "s-charges-no-on",
    type: "symptom",
    rarity: "uncommon",
    title: "Charges but will not turn on",
    subtitle: "Power LED or meter rises; no POST, no fans, no logo.",
    subtitles: [
      "Charging current is not a POST. Split power vs firmware vs display.",
      "Try a known-good brick, drain residual, then minimal boot.",
      "A USB-C PD fail can trickle-charge and still refuse to start.",
    ],
    body: "The pack takes current and the LED may look hopeful. Nothing else happens. That is not ‘Windows is slow’. Prove the brick and inlet, then board power rails, then display-on-POST. A swollen pack can also hold the board in protect.",
    subject: "tech",
    domain: "mobile-devices",
    pathId: "mobile-devices",
    artHint: "Laptop with charge LED on, screen off, question mark at POST — labels, not red-vs-green only.",
    slot: "chassis",
    tags: ["mobile", "power", "symptom", "core1"],
  }),
  card({
    id: "s-wont-charge",
    type: "symptom",
    rarity: "common",
    title: "Will not charge",
    subtitle: "Runs on pack, ignores the brick — or takes no current at all.",
    subtitles: [
      "Split brick, cable, jack, PD negotiate, and pack.",
      "A charge-only USB-C cable on a PD laptop is a slow or zero charge.",
      "Meter the barrel. Do not start with a motherboard because the icon is orange.",
    ],
    body: "‘Not charging’ is five tickets wearing one icon. Brick dead, cable without e-marker, charge-only port, dirty barrel, swollen pack, or a PD profile the laptop refused. External path first. Then the jack. Then the pack.",
    subject: "tech",
    domain: "mobile-devices",
    pathId: "mobile-devices",
    artHint: "Brick, cable, jack, pack as a labelled chain; break point marked with a tick, not a colour key.",
    slot: "psu",
    tags: ["mobile", "power", "charge", "symptom", "core1"],
  }),
  card({
    id: "s-wifi-drops",
    type: "symptom",
    rarity: "uncommon",
    title: "Associates, then drops",
    subtitle: "Gets an SSID, then falls off. Not the same as ‘no Wi-Fi’.",
    subtitles: [
      "Association is not a stable path. Watch RSSI, band, and DHCP.",
      "After a lid swap, suspect antenna leads before you reinstall Windows.",
      "5/6 GHz dies on walls. A new Wi-Fi generation is not longer radio.",
    ],
    body: "The client finds the SSID, maybe even gets a lease, then vanishes. That can be RF (leads, walls, DFS), roaming sticky, or a driver. Ethernet fine + range cliff after a panel job is antennas. Hiding the SSID will not seat a connector.",
    subject: "tech",
    domain: "mobile-devices",
    pathId: "mobile-devices",
    artHint: "Laptop lid antennas dashed vs solid; AP in the next room labelled 5 GHz vs 2.4 GHz.",
    slot: "wifi",
    tags: ["mobile", "wifi", "symptom", "core1", "network"],
  }),
  card({
    id: "s-swollen",
    type: "symptom",
    rarity: "rare",
    title: "Swollen battery",
    subtitle: "Palm rest lift, trackpad click gone, glass belly. Safety first.",
    subtitles: [
      "Swelling is chemistry failure. Isolate. Do not puncture.",
      "A 1 mm lift is enough. Software calibration does not shrink cells.",
      "Power down, disconnect pack, recycle at a proper drop-off.",
    ],
    body: "Look at the chassis, not only the Windows percentage. Swelling cracks panels and is a fire risk. Do not keep using it until the next maintenance window. Do not flatten it in a vice. This card is ugly on purpose.",
    subject: "tech",
    domain: "mobile-devices",
    pathId: "mobile-devices",
    artHint: "Exaggerated palm-rest lift with ‘isolate / do not puncture’ in plain text.",
    slot: "chassis",
    tags: ["mobile", "battery", "safety", "symptom", "core1"],
  }),
  card({
    id: "s-no-post-ram",
    type: "symptom",
    rarity: "uncommon",
    title: "No POST after RAM reseat",
    subtitle: "Fans maybe; no logo. The last touch was memory.",
    subtitles: [
      "One stick, known-good slot, correct generation. Then the other stick.",
      "SO-DIMM vs DIMM, DDR4 vs DDR5 — wrong notch is not ‘seated’.",
      "Clear CMOS only after you have a theory. It is a blunt instrument.",
    ],
    body: "You touched RAM and now the box is mute. Minimal boot: one matched stick in the silk-screened slot A. Wrong generation will not POST no matter how firmly you press. On laptops, a stick that is not fully clicked looks seated from across the room.",
    subject: "tech",
    domain: "hardware",
    pathId: "hardware",
    artHint: "Board with RAM slots A/B labelled; one stick seated with click tabs called out.",
    slot: "ram-a",
    tags: ["ram", "post", "hardware", "symptom", "core1"],
  }),
  card({
    id: "t-multimeter",
    type: "tool",
    rarity: "uncommon",
    title: "Multimeter",
    subtitle: "Voltage at the jack beats guessing the board is dead.",
    subtitles: [
      "Measure DC at the inlet before you condemn a PSU or pack.",
      "Continuity on a fuse is a yes/no. Voltage on a rail needs a load sometimes.",
      "Know DC vs AC. A barrel that looks live can still be 0 V under load.",
    ],
    body: "A meter turns ‘it feels dead’ into a number. Check the brick at the barrel, then the jack on the load side if you can do it safely. You do not open a PSU to replace a capacitor. You replace the unit. You cannot RMA a person.",
    subject: "tech",
    domain: "hw-net-troubleshooting",
    pathId: "hw-net-troubleshooting",
    artHint: "Probe on a DC jack with a labelled voltage reading; AC/DC switch called out.",
    slot: "tool-wall",
    tags: ["tool", "power", "core1", "meter"],
  }),
  card({
    id: "t-loopback",
    type: "tool",
    rarity: "uncommon",
    title: "Loopback",
    subtitle: "Prove the NIC or serial path without blaming the WAN.",
    subtitles: [
      "A hardware loopback plugs the port to itself. Software loopback is 127.0.0.1.",
      "Ping 127.0.0.1 tests the stack, not the cable.",
      "A failed physical loopback is the NIC or port, not DNS.",
    ],
    body: "Loopback splits ‘the internet is down’ from ‘this port is down’. 127.0.0.1 is the stack. A hardware plug is the PHY. Neither one fixes a full DHCP pool. Use the right loop for the layer you are actually testing.",
    subject: "tech",
    domain: "networking",
    pathId: "networking",
    artHint: "RJ45 loopback plug next to a 127.0.0.1 label — two different loops named.",
    slot: "tool-wall",
    tags: ["tool", "network", "core1", "loopback"],
    sheetId: "ports",
  }),
  card({
    id: "t-toner",
    type: "tool",
    rarity: "common",
    title: "Toner probe",
    subtitle: "Find the other end of a cable in the tangle.",
    subtitles: [
      "Tone the pair. Do not guess patch-panel rows by dust colour.",
      "A toner is not a certifier. It finds the run; it does not prove gigabit.",
      "Label both ends when you find them. Future you is a user too.",
    ],
    body: "A toner puts a warble on a pair so the probe can sing at the patch panel. It does not replace a wiremap or a certification. It stops you from unplugging the wrong finance switch ‘because it looked like the same blue’.",
    subject: "tech",
    domain: "networking",
    pathId: "networking",
    artHint: "Patch panel with a probe; toner on the far jack, both ends labelled.",
    slot: "tool-wall",
    tags: ["tool", "network", "cabling", "core1"],
  }),
  card({
    id: "t-pxe",
    type: "tool",
    rarity: "rare",
    title: "PXE boot",
    subtitle: "Network boot. Needs DHCP, a boot server, and the NIC in the firmware list.",
    subtitles: [
      "PXE is not magic imaging. The NIC must be allowed to boot.",
      "Wrong VLAN = no DHCP = no PXE, which looks like a dead disk.",
      "Change control belongs on a mass image. Rollback is an image, not a hope.",
    ],
    body: "Preboot Execution Environment asks the network for a boot file. If DHCP never answers, you get a timeout that people file as ‘SSD failed’. Check firmware boot order, VLAN, and the actual WDS/MDT/whatever server. Then document the change.",
    subject: "tech",
    domain: "operating-systems",
    pathId: "operating-systems",
    artHint: "Firmware boot menu with PXE/NIC labelled; DHCP arrow to a boot server.",
    slot: "tool-wall",
    tags: ["tool", "pxe", "os", "core2", "imaging"],
  }),
  card({
    id: "t-safe-mode",
    type: "tool",
    rarity: "common",
    title: "Safe Mode",
    subtitle: "Minimal drivers. For rolling back the thing you just installed.",
    subtitles: [
      "Safe Mode is a boot option, not an antivirus.",
      "Named .sys in a BSOD after a GPU driver: WinRE or Safe Mode, then roll back.",
      "One-user crashes are often the profile, not a Safe Mode reimage.",
    ],
    body: "Safe Mode loads a small driver set so you can undo a display driver, a filter, or a startup pile. It is not the fix for APIPA. It is not a backup. If the box never POSTs, Safe Mode is not in the room yet.",
    subject: "tech",
    domain: "software-troubleshooting",
    pathId: "software-troubleshooting",
    artHint: "WinRE / Safe Mode menu sketch with ‘roll back driver’ labelled.",
    slot: "tool-wall",
    tags: ["tool", "os", "core2", "safemode"],
  }),
  card({
    id: "p-esd",
    type: "procedure",
    rarity: "common",
    title: "ESD strap",
    subtitle: "You cannot RMA a person. Ground yourself before the RAM.",
    subtitles: [
      "Strap to ground, not to the chassis paint and a hope.",
      "Bags and mats matter for inventory, not only for the one stick in your hand.",
      "Humidity and carpet are part of the ticket, not superstition.",
    ],
    body: "Electrostatic discharge punches holes in silicon you cannot see. A wrist strap to a known ground is the boring move that keeps the next RAM stick alive. Do not rest SO-DIMMs on the fabric chair. The exam and the shop agree on this more than they agree on anything else.",
    subject: "tech",
    domain: "operational-procedures",
    pathId: "operational-procedures",
    artHint: "Wrist strap to a grounded point, bag labelled; no colour-only warning.",
    slot: "tool-wall",
    tags: ["procedure", "esd", "safety", "core2"],
  }),
  card({
    id: "p-thermal-paste",
    type: "procedure",
    rarity: "uncommon",
    title: "Thermal paste",
    subtitle: "A thin job. Frosting the IHS is an insulator.",
    subtitles: [
      "Pea or line in the centre. Spring pressure spreads it.",
      "Dried laptop heat-pipe paste is a real slowdown.",
      "More paste is not cooler. Mount even. Confirm the fan header spins.",
    ],
    body: "Paste fills microscopic gaps. A rice-grain or pea is the usual. A thick frosting traps heat. Dried factory paste on a laptop heat pipe is a ticket. After a repaste, check the pump/fan actually spins — a quiet machine can be a dead machine.",
    subject: "tech",
    domain: "hardware",
    pathId: "hardware",
    artHint: "IHS with a pea-size dot labelled; a ‘too much’ blob shown dashed beside it.",
    slot: "cpu",
    tags: ["procedure", "thermal", "hardware", "core1"],
  }),
  card({
    id: "p-connector-pull",
    type: "procedure",
    rarity: "uncommon",
    title: "Pull, do not pry",
    subtitle: "Battery, display, and antenna connectors have a direction.",
    subtitles: [
      "Latch first, then pull the connector — not the wires.",
      "Antenna U.FL/IPEX leads are easy to tear. Support the socket.",
      "A spudger under a ZIF latch is a tool. A screwdriver as a chisel is a new board.",
    ],
    body: "Laptop internals are latches and ZIF, not Lego. Pulling the cable instead of the connector rips a pad. Prying a display cable with a flathead is how you buy a board. The service manual photo is the map. If you need force, you are in the wrong slot.",
    subject: "tech",
    domain: "mobile-devices",
    pathId: "mobile-devices",
    artHint: "ZIF latch open vs closed, labelled; a no-pry mark on the cable, not colour-only.",
    slot: "display",
    tags: ["procedure", "mobile", "connectors", "core1"],
  }),
  card({
    id: "p-change-ticket",
    type: "procedure",
    rarity: "rare",
    title: "Change ticket",
    subtitle: "Reason, scope, risk, rollback, schedule, approval. Not a vibe.",
    subtitles: [
      "Rollback is a snapshot, backup, or image — not ‘we will figure it out’.",
      "Do not patch finance at 10:00 Monday unannounced.",
      "Mass PXE imaging is a change. So is a BIOS flash.",
    ],
    body: "Change management is how you do not become the outage. A request that is only a vendor SKU is not a request. Document what you will undo if the theory is wrong. The exam wording is dry because the incident report is drier.",
    subject: "tech",
    domain: "operational-procedures",
    pathId: "operational-procedures",
    artHint: "Clipboard with reason / risk / rollback as three labelled rows.",
    slot: "tool-wall",
    tags: ["procedure", "change", "core2", "docs"],
  }),
  card({
    id: "g-binary-subnet",
    type: "glue",
    rarity: "uncommon",
    title: "Binary ↔ subnet",
    subtitle: "Powers of two. A mask is a cut, not a vibe.",
    subtitles: [
      "A /24 is 8 host bits. Count from the right if you must.",
      "Two sites both using 192.168.1.0/24 will make a VPN cry.",
      "APIPA 169.254/16 is not a clever private plan. It is DHCP gone missing.",
    ],
    body: "Subnetting is binary grouping. Maths number sense and networking share the same cut. If you cannot say how many host addresses a mask leaves, you are guessing the VLAN. RFC1918 private ranges are not ‘the internet’.",
    subject: "maths",
    domain: "networking",
    artHint: "Number line of prefixes /24 /25 /26 with host counts labelled.",
    slot: "wifi",
    tags: ["glue", "maths", "network", "subnet", "core1"],
    sheetId: "ports",
  }),
  card({
    id: "g-sleep-pbq",
    type: "glue",
    rarity: "rare",
    title: "Sleep vs PBQ fail",
    subtitle: "A nap is not a performance-based question. Neither is a frozen timer.",
    subtitles: [
      "Exam PBQs want a method. Sleeping the laptop is not a step.",
      "Closing the lid can sleep a lab box and drop a VPN mid-change.",
      "Power plans are a Core 2 tool. Know sleep vs hibernate vs shutdown.",
    ],
    body: "Sleep keeps RAM hot and the session ‘almost off’. Hibernate writes RAM to disk. Shutdown is off. A PBQ fails when you wander. A ticket fails when a lid-close sleeps the imaging box. Name the power state before you blame the image.",
    subject: "tech",
    domain: "operating-systems",
    pathId: "operating-systems",
    artHint: "Three power states labelled Sleep / Hibernate / Shutdown — not a colour key.",
    slot: "cpu",
    tags: ["glue", "os", "power", "core2", "exam"],
  }),
  card({
    id: "g-prob-raid",
    type: "glue",
    rarity: "rare",
    title: "Probability ↔ RAID",
    subtitle: "RAID 0 doubles risk. RAID is still not a backup.",
    subtitles: [
      "Independent disk failure odds multiply on a stripe with no parity.",
      "RAID 1/5/10 keep you online after a disk dies. Ransomware laughs.",
      "A 3-2-1 backup is a different probability story: copies, media, places.",
    ],
    body: "If each disk has a chance of dying this year, RAID 0 makes the array die when any disk dies. That is probability, not a vendor slogan. RAID 5 needs a rebuild window you should not romanticise. Backups are how you survive the other failures.",
    subject: "maths",
    domain: "hardware",
    pathId: "hardware",
    artHint: "Four disks with RAID 0 vs RAID 1 failure paths labelled in words, not red/green only.",
    slot: "storage-sata",
    tags: ["glue", "maths", "raid", "hardware", "core1"],
    sheetId: "raid",
  }),
  card({
    id: "k-usbc-charge-only",
    type: "gotcha",
    rarity: "uncommon",
    title: "Gotcha: charge-only USB-C",
    subtitle: "It charged, so it must do video. It does not.",
    subtitles: [
      "A port can take power and refuse DisplayPort Alt Mode.",
      "The dock is not broken if the port was never a video port.",
      "Tap this later: same bite. USB-C is several capabilities in one shape.",
    ],
    body: "You assumed USB-C is one thing. Charge-only ports exist. Cables exist that do power and not data. This gotcha stays ugly on purpose. Replay: name the capability you actually need (PD, data, Alt Mode, Thunderbolt) before you order a dock.",
    subject: "tech",
    domain: "mobile-devices",
    pathId: "mobile-devices",
    artHint: "USB-C port with a slash through a display icon, charge bolt still present — labelled.",
    tags: ["gotcha", "usb", "mobile", "core1"],
    sheetId: "connectors",
  }),
  card({
    id: "k-apipa-is-dns",
    type: "gotcha",
    rarity: "uncommon",
    title: "Gotcha: 169.254 is not DNS",
    subtitle: "APIPA means DHCP never answered. Reinstalling Chrome will not help.",
    subtitles: [
      "169.254.0.0/16 is link-local consolation, not a Google resolver.",
      "Ping 8.8.8.8 and nslookup fail for different reasons. Split them.",
      "Fix the lease path: cable, VLAN, pool, helper. Then names.",
    ],
    body: "You treated a 169.254 address as ‘the internet is a bit sick’. It is DHCP failure. The host can talk to other APIPA neighbours on the same L2, not to the default gateway. This card is the bite you replay from the Binder.",
    subject: "tech",
    domain: "networking",
    pathId: "networking",
    artHint: "ipconfig line 169.254.x.x with ‘DHCP failed’ labelled; 8.8.8.8 crossed as not this.",
    tags: ["gotcha", "dhcp", "apipa", "network", "core1"],
    sheetId: "ports",
  }),
  card({
    id: "k-raid-is-backup",
    type: "gotcha",
    rarity: "uncommon",
    title: "Gotcha: RAID is not a backup",
    subtitle: "Uptime after a disk dies. Not ransomware, fire, or ‘wrong folder’.",
    subtitles: [
      "Mirrors keep you online. They do not keep yesterday.",
      "Test a restore or you have a ritual.",
      "3-2-1 still applies on a pretty RAID 10.",
    ],
    body: "You skipped backups because the array looked expensive. RAID laughs at a disk failure and cries at a deleted share. Replay: name what the array survives, then name what only a backup survives.",
    subject: "tech",
    domain: "hardware",
    pathId: "hardware",
    artHint: "RAID array vs offsite backup as two labelled boxes with different failure lists.",
    tags: ["gotcha", "raid", "backup", "hardware", "core1"],
    sheetId: "raid",
  }),
  card({
    id: "k-more-paste",
    type: "gotcha",
    rarity: "common",
    title: "Gotcha: more paste is cooler",
    subtitle: "Frosting the IHS insulates. A pea is a pea.",
    subtitles: [
      "Paste fills gaps. A blob is a blanket.",
      "Spread happens under the cooler springs, not with a butter knife by default.",
      "Confirm the fan/pump header after you close it.",
    ],
    body: "You put on more paste because heat felt like a shortage of goo. It is not. Replay the thermal path: contact, even pressure, spinning fan. Then check temperatures under a known load, not a vibe.",
    subject: "tech",
    domain: "hardware",
    pathId: "hardware",
    artHint: "Pea vs blob on an IHS, both labelled; ‘insulator’ on the blob.",
    tags: ["gotcha", "thermal", "hardware", "core1"],
  }),
  card({
    id: "r-mobile-devices",
    type: "crest",
    rarity: "crest",
    title: "Crest: Mobile devices",
    subtitle: "Domain gate actually earned — lesson done and quiz at the bar.",
    body: "You did not buy this. The Mobile Devices domain lesson is done and the quiz recency bar cleared. Crests are receipts, not stickers.",
    subject: "tech",
    domain: "mobile-devices",
    pathId: "mobile-devices",
    artHint: "Small crest with a laptop outline and the word Mobile, line-art teal.",
    slot: "chassis",
    tags: ["crest", "mobile", "core1"],
  }),
  card({
    id: "r-networking",
    type: "crest",
    rarity: "crest",
    title: "Crest: Networking",
    subtitle: "Domain gate actually earned.",
    body: "Networking lesson complete and quiz at the bar. Ports, APIPA, and DNS splits are not a poster anymore.",
    subject: "tech",
    domain: "networking",
    pathId: "networking",
    artHint: "Crest with a simple SOHO sketch, labelled.",
    slot: "wifi",
    tags: ["crest", "network", "core1"],
  }),
  card({
    id: "r-hardware",
    type: "crest",
    rarity: "crest",
    title: "Crest: Hardware",
    subtitle: "Domain gate actually earned.",
    body: "Hardware lesson complete and quiz at the bar. RAM, storage, PSU rails — receipts, not loot.",
    subject: "tech",
    domain: "hardware",
    pathId: "hardware",
    artHint: "Crest with a PSU and DIMM line-art.",
    slot: "cpu",
    tags: ["crest", "hardware", "core1"],
  }),
  card({
    id: "r-operating-systems",
    type: "crest",
    rarity: "crest",
    title: "Crest: Operating systems",
    subtitle: "Domain gate actually earned.",
    body: "OS lesson complete and quiz at the bar. SKU, GPT, and the tools you open without thinking.",
    subject: "tech",
    domain: "operating-systems",
    pathId: "operating-systems",
    artHint: "Crest with a window outline.",
    slot: "display",
    tags: ["crest", "os", "core2"],
  }),
  card({
    id: "r-security",
    type: "crest",
    rarity: "crest",
    title: "Crest: Security",
    subtitle: "Domain gate actually earned.",
    body: "Security lesson complete and quiz at the bar. Isolate first is now a habit, not a slogan.",
    subject: "tech",
    domain: "security",
    pathId: "security",
    artHint: "Crest with a lock outline, labelled Security.",
    slot: "chassis",
    tags: ["crest", "security", "core2"],
  }),
  card({
    id: "l-cinebench-die",
    type: "component",
    rarity: "glue",
    title: "Dies after Cinebench",
    subtitle: "Thermal + storage path fused. The stick was never the whole story.",
    subtitles: [
      "A fast NVMe under a heatsink still throttles if the laptop duct is packed.",
      "SATA vs NVMe vs a choked heat pipe can look like ‘the new SSD is bad’.",
      "Full close: check paste, duct, and whether the slot is even PCIe.",
    ],
    body: "You fused the NVMe length story with the SATA/heatsink story. A Cinebench cliff can be paste, a packed fan, or a drive in a SATA-only slot pretending to be gen4. The legendary close is the thermal path plus the protocol path, written down.",
    subject: "tech",
    domain: "hardware",
    pathId: "hardware",
    artHint: "Laptop duct, M.2 heatsink, and a load graph labelled throttle — not colour-only.",
    slot: "storage-m2",
    tags: ["legendary", "nvme", "thermal", "hardware", "core1"],
  }),
  card({
    id: "l-power-path",
    type: "procedure",
    rarity: "glue",
    title: "Power path",
    subtitle: "Won’t-charge + DC jack + meter. External path first.",
    subtitles: [
      "Brick voltage, then jack, then pack. In that order.",
      "A wiggle-charge is mechanical until proven otherwise.",
      "PD negotiation failure can mimic a dead pack.",
    ],
    body: "Fusing the symptom, the inlet, and the meter. You do not start with a motherboard. You prove the brick at the barrel, the jack on the load side, then the pack. That is a rare close because people skip the number.",
    subject: "tech",
    domain: "mobile-devices",
    pathId: "mobile-devices",
    artHint: "Brick → jack → pack chain with a meter at the first two arrows.",
    slot: "psu",
    tags: ["legendary", "power", "mobile", "core1"],
  }),
  card({
    id: "l-antenna-lid",
    type: "procedure",
    rarity: "glue",
    title: "Lid antennas seated",
    subtitle: "Hinge + combo card. Range came back when the leads clicked.",
    body: "After a panel job the shed disappeared. Ethernet was fine. MAIN/AUX were off or pinched in the hinge. This close is a photo of seated leads, not a TCP/IP reinstall.",
    subject: "tech",
    domain: "mobile-devices",
    pathId: "mobile-devices",
    artHint: "MAIN and AUX leads clicked onto a combo card, hinge path labelled.",
    slot: "wifi",
    tags: ["legendary", "antenna", "mobile", "wifi", "core1"],
  }),
  card({
    id: "l-swollen-pack",
    type: "procedure",
    rarity: "glue",
    title: "Pack isolated",
    subtitle: "Swelling + Li-ion. Power down, isolate, recycle. No vice.",
    body: "Safety close. The palm rest was lifting. You powered down, isolated the pack, and did not puncture it. Calibration was never the move.",
    subject: "tech",
    domain: "mobile-devices",
    pathId: "mobile-devices",
    artHint: "Pack in a bag, chassis open, ‘recycle’ labelled.",
    slot: "chassis",
    tags: ["legendary", "battery", "safety", "mobile", "core1"],
  }),
  card({
    id: "l-pxe-ghost",
    type: "procedure",
    rarity: "glue",
    title: "Image with a rollback",
    subtitle: "PXE + change ticket. The mass wipe had an undo.",
    body: "You did not ghost fifty boxes on a Friday hope. Firmware PXE, correct VLAN, and a change record with a rollback image. That is a legendary close because the outage did not happen.",
    subject: "tech",
    domain: "operational-procedures",
    pathId: "operational-procedures",
    artHint: "PXE arrow plus a clipboard rollback line, both labelled.",
    slot: "tool-wall",
    tags: ["legendary", "pxe", "change", "core2"],
  }),
  card({
    id: "c-wwan",
    type: "component",
    rarity: "uncommon",
    title: "WWAN card",
    subtitle: "Cellular M.2. Different key and antennas than Wi-Fi.",
    body: "A 2230 WWAN card is not an NVMe stick. It wants its own keying and usually its own antenna set. Sliding it into a storage slot is a hope, not a FRU.",
    subject: "tech",
    domain: "mobile-devices",
    pathId: "mobile-devices",
    artHint: "2230 WWAN vs 2280 NVMe outlines with keys labelled.",
    slot: "wifi",
    tags: ["mobile", "wwan", "cellular", "core1"],
  }),
  card({
    id: "c-digitizer",
    type: "component",
    rarity: "uncommon",
    title: "Digitizer vs LCD",
    subtitle: "Touch layer and picture layer. Replace the one that failed.",
    body: "A cracked glass with a perfect picture can still be a digitizer. A black picture with working touch is the panel. Order the FRU that matches the failure, not the whole lid because it felt safer.",
    subject: "tech",
    domain: "mobile-devices",
    pathId: "mobile-devices",
    artHint: "Exploded lid: glass / digitizer / LCD labelled in order.",
    slot: "display",
    tags: ["mobile", "display", "digitizer", "core1"],
  }),
  card({
    id: "g-privacy-feed",
    type: "glue",
    rarity: "common",
    title: "Feed vs fact",
    subtitle: "A ranking is not a source. Digital citizenship glued to a claim test.",
    body: "The feed is an engagement machine. A claim still needs a source you can name. This glue sits between Digital and Logic so a viral post does not become a ticket ‘because it felt true’.",
    subject: "digital",
    artHint: "Phone feed beside a claim/evidence split, labelled.",
    tags: ["glue", "digital", "logic", "privacy"],
    sheetId: "ports",
  }),
  card({
    id: "g-fraction-raid",
    type: "glue",
    rarity: "glue",
    title: "Fractions of a disk",
    subtitle: "RAID 5 parity is a slice you pay for. Capacity maths is not a poster.",
    body: "Usable space on RAID 5 is not ‘all the disks minus a vibe’. You pay a disk of parity. Maths fractions and hardware share the same honesty: name the denominator.",
    subject: "maths",
    domain: "hardware",
    artHint: "Three disks with one slice labelled parity.",
    slot: "storage-sata",
    tags: ["glue", "maths", "raid", "fractions"],
    sheetId: "raid",
  }),
];

export const fusionRecipes: FusionRecipe[] = [
  {
    id: "fuse-cinebench",
    title: "Throttle after load",
    inputIds: ["c-2280-nvme", "c-sata-ssd"],
    outputId: "l-cinebench-die",
    blurb: "NVMe length plus SATA/heatsink — why a ‘fast stick’ still dies after Cinebench.",
  },
  {
    id: "fuse-power",
    title: "Prove the inlet",
    inputIds: ["s-wont-charge", "c-dc-jack", "t-multimeter"],
    outputId: "l-power-path",
    blurb: "Won’t charge, DC jack, meter. External path first.",
  },
  {
    id: "fuse-antenna",
    title: "Seat the lid leads",
    inputIds: ["c-hinge", "c-wifi-bt"],
    outputId: "l-antenna-lid",
    blurb: "Hinge path plus combo card. Range cliff after a panel job.",
  },
  {
    id: "fuse-swollen",
    title: "Isolate the pack",
    inputIds: ["s-swollen", "c-li-ion"],
    outputId: "l-swollen-pack",
    blurb: "Swelling is chemistry. Isolate, do not puncture.",
  },
  {
    id: "fuse-pxe",
    title: "Image with an undo",
    inputIds: ["t-pxe", "p-change-ticket"],
    outputId: "l-pxe-ghost",
    blurb: "PXE plus a change ticket so the mass wipe has a rollback.",
  },
  {
    id: "fuse-raid-maths",
    title: "Risk is a number",
    inputIds: ["g-prob-raid", "k-raid-is-backup"],
    outputId: "g-fraction-raid",
    blurb: "Probability glued to the backup gotcha — usable space and surviving failures.",
  },
];

const byId = new Map(benchCards.map((item) => [item.id, item]));

export function getBenchCard(id: string) {
  return byId.get(id);
}

export function cardsByType(type: CardType | "all") {
  if (type === "all") return benchCards;
  return benchCards.filter((card) => card.type === type);
}

export function cardsForSheet(sheetId: string) {
  return benchCards.filter((card) => card.sheetId === sheetId);
}

export function subtitleFor(card: BenchCard, level: 1 | 2 | 3) {
  return card.subtitles?.[level - 1] ?? card.subtitle;
}

export function rarityWeight(rarity: CardRarity) {
  if (rarity === "common") return 4;
  if (rarity === "uncommon") return 2;
  if (rarity === "rare") return 1;
  return 0;
}

/** Crest / glue frames. Legacy "legendary" reads as crest. */
export function displayRarity(rarity: CardRarity): "common" | "uncommon" | "rare" | "crest" | "glue" {
  if (rarity === "legendary") return "crest";
  return rarity;
}

export function cardPrintCode(card: BenchCard) {
  if (card.printCode) return card.printCode;
  const raw = card.title.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  return (raw.slice(0, 8) || "TICKET").padEnd(Math.min(6, raw.length), "X");
}

export function cardSetNumber(card: BenchCard) {
  const index = benchCards.findIndex((row) => row.id === card.id);
  return index >= 0 ? index + 1 : 0;
}

export function cardSetSize() {
  return benchCards.length;
}

export function cardHook(card: BenchCard) {
  return card.subtitle;
}

export function cardExamTells(card: BenchCard): [string, string] {
  if (card.examTells) return card.examTells;
  const first = card.subtitles?.[0] ?? card.subtitle;
  const second = card.subtitles?.[1] ?? card.subtitles?.[2] ?? card.body.split(". ").slice(0, 1)[0] ?? card.subtitle;
  return [first, second];
}

export function cardSeenIn(card: BenchCard): { lesson?: string; ticket?: string; fusion?: string } {
  if (card.seenIn) return card.seenIn;
  const recipe = fusionRecipes.find((row) => row.outputId === card.id || row.inputIds.includes(card.id));
  return {
    lesson: card.pathId ? card.pathId.replace(/-/g, " ") : undefined,
    ticket: card.sheetId ? card.sheetId.replace(/-/g, " ") : card.domain?.replace(/-/g, " "),
    fusion: recipe?.title,
  };
}

export function fusionOutputIds() {
  return new Set(fusionRecipes.map((row) => row.outputId));
}

export function isFusionOnly(card: BenchCard) {
  return card.rarity === "glue" || fusionOutputIds().has(card.id);
}

export function isCrestCard(card: BenchCard) {
  return card.type === "crest" || displayRarity(card.rarity) === "crest";
}

export function collectibleForDomain(domainId: string) {
  return benchCards.filter(
    (card) =>
      card.domain === domainId &&
      !isCrestCard(card) &&
      !isFusionOnly(card),
  );
}

export function isSlottable(card: BenchCard) {
  return Boolean(card.slot);
}

export const CREST_BY_DOMAIN: Record<string, string> = {
  "mobile-devices": "r-mobile-devices",
  networking: "r-networking",
  hardware: "r-hardware",
  "operating-systems": "r-operating-systems",
  security: "r-security",
};

export function assertBenchCatalog() {
  if (benchCards.length < 40) {
    throw new Error(`Bench catalog ${benchCards.length} under 40`);
  }
  if (fusionRecipes.length < 5) {
    throw new Error(`Fusion recipes ${fusionRecipes.length} under 5`);
  }
  const ids = new Set<string>();
  for (const item of benchCards) {
    if (ids.has(item.id)) throw new Error(`Duplicate bench card ${item.id}`);
    ids.add(item.id);
    if (!item.body || item.body.length < 40) {
      throw new Error(`Card ${item.id} missing back-face body`);
    }
  }
  for (const recipe of fusionRecipes) {
    for (const input of recipe.inputIds) {
      if (!byId.has(input)) throw new Error(`Fusion ${recipe.id} missing input ${input}`);
    }
    if (!byId.has(recipe.outputId)) {
      throw new Error(`Fusion ${recipe.id} missing output ${recipe.outputId}`);
    }
  }
}

assertBenchCatalog();

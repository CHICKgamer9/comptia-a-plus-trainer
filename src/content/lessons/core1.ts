import type { Lesson } from "../types";

export const core1Lessons: Lesson[] = [
  {
    id: "mobile-devices-essentials",
    domainId: "mobile-devices",
    title: "Laptops, phones, and the radios they carry",
    minutes: 18,
    intro:
      "Mobile devices fail in predictable ways: a hinge, a battery, a dock pin, or a radio that will not associate. Learn the parts you can replace, the ports you will see on a ticket, and why “it charges but will not turn on” is a different problem from “it will not charge at all.”",
    sections: [
      {
        heading: "Think in replaceable parts",
        paragraphs: [
          "A laptop is a desktop that traded serviceability for size. When a ticket says “replace the keyboard,” you are usually replacing a top cover assembly, a ribbon cable, or a standalone key deck — not one plastic key. Before you order parts, confirm the exact model (service tag, SNID, or regulatory label under the battery bay), because a one-digit SKU difference can mean a different display cable or screw map.",
          "Common field-replaceable units (FRUs) include SODIMM RAM, M.2 or 2.5-inch storage, Wi-Fi cards, batteries, displays, webcams, and sometimes keyboards. CPUs and GPUs on modern thin-and-light machines are often soldered. If the user needs a faster processor, the honest answer is often a different laptop, not a socket swap.",
        ],
        bullets: [
          "Always disconnect power and the internal battery (or use the manufacturer’s battery disconnect pad) before you unplug a display or keyboard ribbon.",
          "Document screw lengths. A long screw into a battery or board is a short-to-ground waiting to happen.",
          "After a display replacement, test the webcam, Wi-Fi antennas (often taped to the lid), and webcam privacy shutter.",
        ],
        callout: {
          type: "exam",
          text: "A+ loves “which part do you replace first?” questions. Start with the cheapest, least invasive FRU that matches the symptom — not a motherboard.",
        },
      },
      {
        heading: "Docks, port replicators, and the cable people trip over",
        paragraphs: [
          "A docking station gives a laptop a full desk: extra USB, Ethernet, video, and often power over one cable. A port replicator is the lighter cousin — extra ports, usually no extra video GPU magic. USB-C / Thunderbolt docks can carry video, data, and 60–100 W of power on one connector. If the laptop only charges from that USB-C port and will not output video, the port may be USB-C charge-only, not DisplayPort Alt Mode or Thunderbolt.",
        ],
        bullets: [
          "If a dock works on one laptop and not another, compare USB-C capabilities (charge only vs. DP Alt Mode vs. Thunderbolt 3/4).",
          "A flaky dock is often a damaged USB-C receptacle on the laptop, not the dock itself. Wiggle test, then try a known-good cable.",
          "Legacy docks (proprietary barrel + pin) are model-specific. Do not force a connector.",
        ],
      },
      {
        heading: "Phones and tablets: batteries, accessories, and sync",
        paragraphs: [
          "Smartphones and tablets use lithium-ion packs that swell when they fail. A swollen battery can lift a screen or trackpad. Do not puncture it. Power the device down, isolate it, and follow battery disposal rules.",
          "Connection types you will see: USB-C (most Android and newer iPads), Lightning (older iPhones), and proprietary magnetic charge cables. A phone that charges only at a certain angle usually has debris or a damaged port — not a “software battery calibration” issue. Wireless charging (Qi) needs a healthy coil and a case that is not too thick with metal plates.",
        ],
        table: {
          headers: ["Accessory", "What it is really doing", "Typical failure"],
          rows: [
            ["Headset (3.5 mm / USB-C / BT)", "Audio I/O + mic", "Wrong mode, BT pair cache, dirty jack"],
            ["Touch pen", "Digitizer channel on the panel", "Dead tip, unpaired Bluetooth, palm rejection"],
            ["Hotspot / tethering", "Phone becomes a router", "Carrier block, low signal, data saver"],
            ["NFC / payment", "Short-range token exchange", "Case interference, disabled in OS"],
          ],
        },
      },
      {
        heading: "The radios: Wi-Fi, Bluetooth, cellular, GPS, NFC",
        paragraphs: [
          "A modern laptop or phone is a nest of radios. Airplane mode kills them all at once — useful when you need a clean test. Bluetooth and Wi-Fi often share a combo card and sometimes an antenna path; a lid antenna that was pinched during a screen swap can make Wi-Fi weak while Ethernet still looks fine.",
          "GPS needs a sky view. Indoor “location wrong” tickets are often location services, not a dead GPS chip. Cellular issues belong to SIM/eSIM, APN, or carrier provisioning as often as hardware.",
        ],
        callout: {
          type: "tip",
          text: "When Wi-Fi is weak after a screen replacement, reseat the antenna leads on the mini-PCIe/M.2 card (usually labeled MAIN / AUX). They pop off easily.",
        },
      },
      {
        heading: "Mobile device security a tech actually touches",
        paragraphs: [
          "You will be asked to enroll devices in MDM, wipe a lost phone, or set a screen lock. Know the difference between a passcode, biometric unlock, and a remote wipe. Find My / Google Find can locate, lock, or erase. A supervised MDM profile can push Wi-Fi, VPN, and camera restrictions — and a user cannot always remove it.",
        ],
        bullets: [
          "Before a trade-in or reimage, remove MDM, iCloud/Google activation lock, and work profiles.",
          "A device that “won’t activate” after reset is often still tied to the previous owner’s Apple ID or Google account.",
        ],
      },
    ],
    keyTakeaways: [
      "Identify the exact model before ordering laptop parts; FRUs are not generic.",
      "USB-C is not one thing: charging, data, DisplayPort Alt Mode, and Thunderbolt are separate capabilities.",
      "Swollen batteries are a safety issue — isolate and replace, do not crush or puncture.",
      "Weak Wi-Fi after a lid repair usually means pinched antenna leads, not a “bad OS.”",
      "Clear activation lock and MDM before you call a phone “ready for the next user.”",
    ],
  },
  {
    id: "networking-essentials",
    domainId: "networking",
    title: "How a packet actually gets there",
    minutes: 22,
    intro:
      "Networking on A+ is not a CCNA. It is the practical layer: which port, which cable, which SOHO box, and which command proves the path. If you can read an ipconfig, explain DHCP vs. APIPA, and pick the right port number under pressure, you are already ahead of most first-attempt testers.",
    sections: [
      {
        heading: "A mental model, not a memorized OSI poster",
        paragraphs: [
          "You do not need to recite all seven OSI layers on every ticket, but you do need to know where a problem lives. Cabling and NICs are physical. MAC addresses and switches are data link. IP addresses, routers, and ICMP are network. TCP/UDP ports are transport. “The website fails but ping works” is usually DNS or HTTP — above IP.",
          "IPv4 addresses are 32 bits, usually written as four octets. A subnet mask (or CIDR /24) says which part is the network. The default gateway is the router that leaves this LAN. If the gateway is wrong, local printers may work and the internet will not.",
        ],
        callout: {
          type: "exam",
          text: "An address in 169.254.0.0/16 is APIPA. The host failed DHCP. Do not start by reinstalling the browser.",
        },
      },
      {
        heading: "Ports you must know cold",
        paragraphs: [
          "A port is just a numbered door on a host. TCP is the reliable, connection-oriented door. UDP is the “send it and hope” door used by DNS queries, DHCP, and a lot of real-time traffic. Memorize the well-known set below; A+ will ask them in isolation and inside scenarios.",
        ],
        table: {
          headers: ["Port", "Service", "Notes"],
          rows: [
            ["20 / 21", "FTP", "21 control, 20 data (active). Prefer SFTP/FTPS in real shops."],
            ["22", "SSH / SFTP", "Encrypted remote shell and file copy."],
            ["23", "Telnet", "Cleartext. Know it exists; do not use it."],
            ["25", "SMTP", "Server-to-server mail. Clients often use 587."],
            ["53", "DNS", "UDP for queries, TCP for large transfers/zone work."],
            ["67 / 68", "DHCP", "Server 67, client 68."],
            ["80 / 443", "HTTP / HTTPS", "Web. 443 is TLS."],
            ["110 / 143", "POP3 / IMAP", "Mail retrieval. Secure: 995 / 993."],
            ["137–139 / 445", "NetBIOS / SMB", "Windows file sharing. 445 is modern SMB."],
            ["161 / 162", "SNMP", "Device monitoring."],
            ["389 / 636", "LDAP / LDAPS", "Directory. 636 is TLS."],
            ["3389", "RDP", "Windows remote desktop."],
          ],
        },
      },
      {
        heading: "SOHO gear and the path through a house or office",
        paragraphs: [
          "A typical small office has a modem or ONT, a router (often combo), a switch, and an access point. Many consumer “routers” are all three in one box. When a ticket says “the internet is down,” ask: are LAN lights on? Can you ping the gateway? Can you ping 8.8.8.8? Can you resolve names? Those three answers split WAN, LAN, and DNS in under a minute.",
          "Switches forward by MAC address. Routers forward by IP. A VLAN is a logical switch partition — useful when voice, guests, and PCs should not share a broadcast domain. You will not design campus networks on A+, but you should recognize “wrong VLAN” as a reason a PC has a link light and no useful IP.",
        ],
        bullets: [
          "Straight-through Ethernet is the default for PC-to-switch. Modern NICs auto-MDIX, so crossover cables are mostly history.",
          "PoE (802.3af/at/bt) powers phones, cameras, and APs over the same drop. A dead AP with a good cable may be a dead PoE injector or switch budget.",
          "NAT lets many private hosts share one public IP. CGNAT on a carrier can break inbound port-forwards — that is not your LAN firewall being “haunted.”",
        ],
      },
      {
        heading: "IPv4, IPv6, and the addresses that mean something",
        paragraphs: [
          "Private IPv4 ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. Loopback is 127.0.0.1. APIPA is 169.254.0.0/16. If two hosts have the same static IP, you get intermittent “who owns this MAC” chaos — one works, then the other, then neither.",
          "IPv6 uses 128-bit addresses. fe80::/10 is link-local (always there if IPv6 is on). 2000::/3 is global unicast. ::1 is loopback. A+ expects you to recognize these, not to subnet v6 by hand.",
        ],
      },
      {
        heading: "Wi-Fi standards without the marketing fog",
        paragraphs: [
          "2.4 GHz travels farther and punches through walls; it is crowded (Bluetooth, microwaves, analog cameras). 5 GHz is faster and cleaner, shorter range. 6 GHz (Wi-Fi 6E) is newer and needs compatible clients.",
        ],
        table: {
          headers: ["Standard", "Band", "Exam shorthand"],
          rows: [
            ["802.11a", "5 GHz", "54 Mbps, short range, old"],
            ["802.11b", "2.4 GHz", "11 Mbps, interference-prone"],
            ["802.11g", "2.4 GHz", "54 Mbps"],
            ["802.11n (Wi-Fi 4)", "2.4 / 5 GHz", "MIMO, up to hundreds of Mbps"],
            ["802.11ac (Wi-Fi 5)", "5 GHz", "Wider channels, denser MIMO"],
            ["802.11ax (Wi-Fi 6/6E)", "2.4 / 5 / 6 GHz", "OFDMA, better multi-client"],
          ],
        },
        callout: {
          type: "watch",
          text: "WEP is broken. WPA is legacy. WPA2-PSK (AES) is the common home baseline. WPA3 is the current target. Enterprise (WPA2/3-Enterprise) uses 802.1X and a RADIUS server — not a shared password.",
        },
      },
      {
        heading: "Tools that settle arguments",
        paragraphs: [
          "A toner and probe find the other end of a drop. A cable tester checks pairs and splits. A loopback plug tests a NIC. A Wi-Fi analyzer shows channel overlap. A crimper and punch-down tool are how you make the cable in the first place (T568A vs T568B — pick one standard and stay consistent on both ends).",
          "On the host: ipconfig /all, ping, tracert, nslookup, netstat, and pathping. ping 127.0.0.1 tests the stack. ping the gateway tests L2/L3 on the LAN. ping a public IP tests WAN. nslookup tests DNS. Learn that order; it is a career, not just an exam trick.",
        ],
      },
    ],
    keyTakeaways: [
      "APIPA (169.254.x.x) means DHCP failed — fix the lease path, not the browser.",
      "Memorize the common TCP/UDP ports; they show up as standalone items and inside tickets.",
      "Ping IP vs. ping name splits “no internet” into routing vs. DNS.",
      "2.4 GHz = range and interference; 5 GHz = speed and shorter reach.",
      "WPA2-AES or WPA3. Never WEP. Enterprise Wi-Fi uses 802.1X, not a PSK.",
    ],
  },
  {
    id: "hardware-essentials",
    domainId: "hardware",
    title: "The parts on the bench",
    minutes: 24,
    intro:
      "Hardware is the heaviest Core 1 domain because it is a pile of standards that still show up in production: DDR generations, RAID levels, SATA vs. NVMe, 24-pin vs. 8-pin power, and the connector someone wants you to “just find in the closet.” This lesson is the closet, labeled.",
    sections: [
      {
        heading: "Cables and connectors you will be asked to name",
        paragraphs: [
          "Video: HDMI (audio + video, common on TVs and many PCs), DisplayPort (audio + video, common on business monitors, daisy-chain capable), DVI (digital, some analog via DVI-A/I), VGA (analog only, 15-pin, blue). Adapters cannot invent a signal the GPU port does not speak — a DisplayPort-to-HDMI passive dongle works when the GPU can output HDMI TMDS; an active adapter is needed in other cases.",
          "USB: Type-A (classic rectangle), Type-B (printers), Mini/Micro (legacy phones), Type-C (reversible). USB 2.0 is 480 Mbps. USB 3.x SuperSpeed starts at 5 Gbps and is usually blue or teal on Type-A. Thunderbolt 3/4 uses USB-C and can carry PCIe. A USB-C cable that only charges may lack SuperSpeed or Alt Mode wires — cables matter as much as ports.",
        ],
        table: {
          headers: ["Storage / power", "Looks like", "Use"],
          rows: [
            ["SATA data", "L-shaped 7-pin", "HDD / SATA SSD"],
            ["SATA power", "15-pin", "From PSU to drive"],
            ["M.2", "Stick on motherboard", "SATA or NVMe (keying differs)"],
            ["PCIe power", "6/8-pin or 12VHPWR", "Discrete GPU"],
            ["24-pin ATX + 8-pin CPU", "Mainboard power", "PSU to motherboard"],
            ["Molex / Berg", "Legacy 4-pin", "Old fans, some LED strips"],
          ],
        },
      },
      {
        heading: "RAM: generation, speed, and channels",
        paragraphs: [
          "Desktop DIMMs and laptop SODIMMs are not interchangeable. DDR3, DDR4, and DDR5 are not interchangeable — different notches, voltages, and controllers. Mixing sizes usually works but can drop you out of dual-channel or run at the slowest stick’s timing. ECC RAM is for servers and workstations with ECC-capable CPUs; it will not boot in a random consumer board.",
          "When a PC fails to POST after a memory upgrade, reseat, try one stick in the manufacturer’s preferred slot (often A2, not the first slot), and confirm the kit is on the QVL if you are chasing an intermittent boot.",
        ],
        callout: {
          type: "tip",
          text: "Dual-channel needs matched pairs in the correct color-coded slots. One stick works. Two sticks in the wrong slots can run single-channel and look “fine” but slower.",
        },
      },
      {
        heading: "Storage and RAID, in the language of tickets",
        paragraphs: [
          "HDD: cheap capacity, moving parts, slow random I/O, vulnerable to drops. SATA SSD: fast, no platters. NVMe SSD: sits on PCIe, much higher throughput and IOPS. A drive that is SATA-keyed M.2 in an NVMe-only slot will not show up — that is a keying/protocol mismatch, not a “dead SSD.”",
          "RAID is about speed, capacity, and how many disks you can lose. It is not a backup. If the array is the only copy, ransomware or a spilled coffee still wins.",
        ],
        table: {
          headers: ["Level", "Min disks", "What you gain", "What you lose"],
          rows: [
            ["RAID 0", "2", "Speed (stripe)", "Any disk dies, array dies"],
            ["RAID 1", "2", "Mirror, can lose 1", "Half the raw capacity"],
            ["RAID 5", "3", "Stripe + parity, can lose 1", "One disk of capacity; rebuild risk"],
            ["RAID 6", "4", "Dual parity, can lose 2", "Two disks of capacity"],
            ["RAID 10", "4", "Stripe of mirrors, fast + redundant", "Half the capacity"],
          ],
        },
      },
      {
        heading: "Motherboards, CPUs, and the BIOS/UEFI you flash once a year",
        paragraphs: [
          "Form factors: ATX, micro-ATX, mini-ITX. Chipset + socket must match the CPU generation. A new CPU often needs a BIOS update on the previous board — read the QVL before you promise an upgrade path.",
          "UEFI replaced legacy BIOS on modern boards. You will use it to set boot order, enable virtualization (Intel VT-x / AMD-V), turn on XMP/EXPO memory profiles, and manage Secure Boot. CMOS battery failure looks like “time resets every boot” and lost BIOS settings — not a dead CPU.",
        ],
        bullets: [
          "TPM 2.0 and Secure Boot matter for Windows 11. A “this PC can’t run Windows 11” ticket is often a firmware switch, not a new motherboard.",
          "Thermal paste is not optional after a CPU reseat. A dry cooler will throttle or thermal-trip.",
        ],
      },
      {
        heading: "Power: wattage, rails, and the smell of a dead PSU",
        paragraphs: [
          "Size a PSU for GPU + CPU + drives with headroom (often 20–30%). Modular cables reduce clutter but are not interchangeable across brands — a “it fits” cable from another PSU can cook a board.",
          "Symptoms of a dying PSU: random reboots under load, no POST, burning smell, bulging caps, or a PC that runs only with one drive attached. A PSU tester or a known-good unit is faster than guessing motherboards. Never defeat the paperclip test as your only “proof” on a modern multi-rail unit under load — it only shows the PSU can idle.",
        ],
      },
      {
        heading: "Printers, because they still exist",
        paragraphs: [
          "Laser: toner, drum, fuser. Inkjet: liquid ink, heads that clog. Impact (dot matrix): multipart forms. Thermal: receipts, no ink, heat-sensitive paper. A laser that prints faded pages on one side may be a failing fuser or low toner; vertical lines often mean a scratched drum. Network printers need an IP, the right driver (PCL vs. PS), and a queue that is not paused or set to “offline.”",
        ],
        callout: {
          type: "exam",
          text: "If every print job is stuck and the printer is “Use Printer Offline,” toggle that before you rebuild Windows.",
        },
      },
    ],
    keyTakeaways: [
      "Name the connector before you order the cable — USB-C capabilities and video adapters are not universal.",
      "DDR generations and DIMM vs. SODIMM do not mix. ECC needs an ECC platform.",
      "RAID 0 is speed only. RAID 1/5/6/10 buy fault tolerance. RAID is not a backup.",
      "CMOS battery = clock and BIOS settings. TPM/Secure Boot = Windows 11 readiness.",
      "A “dead PC” after a storm is often PSU or surge path, not the OS.",
    ],
  },
  {
    id: "virtualization-cloud-essentials",
    domainId: "virtualization-cloud",
    title: "VMs, hypervisors, and what “the cloud” actually sold you",
    minutes: 14,
    intro:
      "This domain is short and high-yield. If you can explain a hypervisor, why a VM needs virtual NICs and enough host RAM, and the difference between IaaS, PaaS, and SaaS, you can clear most of the questions in a few minutes.",
    sections: [
      {
        heading: "Hypervisors and why the host still matters",
        paragraphs: [
          "A hypervisor carves one physical machine into virtual machines. Type 1 (bare metal) sits on the hardware — ESXi, Hyper-V Server, Xen. Type 2 sits on a host OS — VMware Workstation, VirtualBox, Parallels. The exam still asks this distinction.",
          "Each VM gets virtual CPU, RAM, disk (a file, often VMDK/VHDX), and a virtual NIC. Those resources come from the host. If you oversubscribe RAM hard, the host swaps and every guest crawls. Enable hardware virtualization in UEFI or the hypervisor will refuse to start or will be painfully slow.",
        ],
        bullets: [
          "Snapshots are not backups. They are a short-term undo. Long-lived snapshot chains slow disks and are a restore risk.",
          "A VM can be bridged (looks like another LAN host), NAT (shares the host’s IP), or host-only (lab isolation).",
          "Containers (Docker) share a kernel; VMs virtualize a whole machine. A+ wants the VM story more than Kubernetes.",
        ],
      },
      {
        heading: "Client-side virtualization you will actually click",
        paragraphs: [
          "On a technician laptop you might run a sandbox OS, an old browser, or a customer’s environment. You still need: VT-x/AMD-V on, enough disk for the virtual disk file, and a plan for guest additions / integration tools so the mouse and video are usable.",
          "Purpose of a VM on A+: sandboxing malware (carefully), running a second OS, testing patches, and supporting a legacy app. Purpose that is not magic: a VM cannot make a dual-core host feel like a 32-core server.",
        ],
      },
      {
        heading: "Cloud characteristics, in plain language",
        paragraphs: [
          "Cloud is someone else’s computer with a credit card API. CompTIA’s usual list: on-demand / self-service, broad network access, resource pooling, rapid elasticity, and measured service (you pay for what you use). Rapid elasticity is why a web app can add web nodes on Black Friday and drop them on Saturday.",
        ],
        table: {
          headers: ["Model", "You manage", "Vendor manages", "Example shape"],
          rows: [
            ["IaaS", "OS, apps, data", "Hardware, hypervisor, facility", "A VM you patch yourself"],
            ["PaaS", "App and data", "Runtime, OS, hardware", "A managed app host"],
            ["SaaS", "Your data / users", "The whole app", "Email, office suite, CRM"],
          ],
        },
        callout: {
          type: "exam",
          text: "If the question says you still install and patch the OS, it is IaaS. If you only open a browser and work, it is SaaS.",
        },
      },
      {
        heading: "Shared responsibility and connectivity",
        paragraphs: [
          "Public cloud is multi-tenant. Private cloud is single-org (on-prem or dedicated). Hybrid is both. A VPN or direct interconnect is how a branch reaches private IPs in a VPC. If SaaS is down, your local firewall and the vendor status page are both suspects — check both before you reimage a laptop.",
        ],
      },
    ],
    keyTakeaways: [
      "Type 1 hypervisor = on the metal. Type 2 = on an OS.",
      "VMs consume real host CPU, RAM, and disk. Enable VT-x/AMD-V.",
      "IaaS = you patch the OS. PaaS = you deploy code. SaaS = you use the app.",
      "Snapshots are convenience, not a backup policy.",
      "Cloud still needs a working network path and a correct identity (account, MFA, conditional access).",
    ],
  },
  {
    id: "hw-net-troubleshooting-essentials",
    domainId: "hw-net-troubleshooting",
    title: "A method you can reuse on every ticket",
    minutes: 18,
    intro:
      "Core 1’s largest slice is troubleshooting. The exam rewards a consistent method more than heroics. You will also be asked classic hardware and network failure patterns: no POST, no display, intermittent wireless, and “the printer was fine yesterday.”",
    sections: [
      {
        heading: "The six-step loop (say it until it is boring)",
        paragraphs: [
          "CompTIA’s troubleshooting methodology is the spine of this domain. Use it in the lab scenarios too.",
        ],
        bullets: [
          "1. Identify the problem — symptoms, scope, recent changes, backups before you poke.",
          "2. Establish a theory — start with the obvious and the recent (cable, last update, last move).",
          "3. Test the theory — one change at a time. If it is wrong, make a new theory.",
          "4. Plan of action — including vendor docs and change windows if you are in production.",
          "5. Verify full functionality — and implement preventative bits (cable management, firmware, monitoring).",
          "6. Document — what you saw, what you did, what you told the user.",
        ],
        callout: {
          type: "watch",
          text: "Do not skip backups or a restore point on a “quick registry tweak.” Identify includes “can I undo this?”",
        },
      },
      {
        heading: "Power, POST, and “nothing happens”",
        paragraphs: [
          "Split “dead” into: no lights/no fans (power path), fans spin / no POST beep or codes (motherboard, CPU, RAM, GPU), POST then no OS (boot order, disk). A POST card or motherboard codes beat guessing. No beep on a modern board is normal if the speaker header is empty — look at diagnostic LEDs.",
          "After a RAM or GPU swap, a black screen is often an unseated stick or a GPU that needs its own PCIe power. Minimal boot: one stick, onboard video if available, known-good PSU.",
        ],
      },
      {
        heading: "Display, storage, and overheating",
        paragraphs: [
          "No image: confirm the display input, backlight vs. no signal (flashlight test on a laptop lid), and whether an external monitor works. External works + lid does not = cable, inverter/LED driver, or panel. Neither works = GPU/board or output settings.",
          "Clicking HDD + SMART errors = replace and restore; do not run more experiments on a dying platter. NVMe that vanished after a move may be a loose M.2 screw. Overheating laptops: dust, dried paste, missing heatsink pad after a repair, or a stuffed air intake on a pillow.",
        ],
      },
      {
        heading: "Network symptoms with a decision tree",
        paragraphs: [
          "Link light off: cable, port, NIC, or disabled adapter. Link light on, APIPA: DHCP. Wrong VLAN or static typo: “limited connectivity” with a weird gateway. Ping IP works, names fail: DNS. Some sites work: MTU, proxy, or IPv6 weirdness. Intermittent Wi-Fi: channel overlap, low RSSI, roaming, or a failing AP — not “Windows is bad at Wi-Fi” as your first theory.",
        ],
        table: {
          headers: ["Symptom", "First tests", "Likely layer"],
          rows: [
            ["No link light", "Known-good cable, another port", "Physical"],
            ["169.254.x.x", "ipconfig /renew, DHCP server, VLAN", "LAN services"],
            ["Ping 8.8.8.8 fails", "Gateway, WAN, firewall", "Routing / WAN"],
            ["Ping IP works, FQDN fails", "nslookup, NIC DNS servers", "DNS"],
            ["One SSID missing", "Band, hidden SSID, AP radio", "Wireless"],
          ],
        },
      },
      {
        heading: "Printers and “it prints garbage”",
        paragraphs: [
          "Print a device test page from the printer’s panel. If that is clean, the device is fine and the queue/driver/app is not. If the test page is dirty, it is consumables, path, or fuser. Stale jobs lock queues. Wrong driver (PCL vs. PostScript vs. universal) produces garbage or 1-page-per-letter. SMB print paths break when the print server share or permissions change.",
        ],
      },
    ],
    keyTakeaways: [
      "Always: identify → theory → test → plan → verify → document.",
      "Split dead boxes into power vs. POST vs. boot vs. OS.",
      "External monitor tests isolate laptop lids from GPUs.",
      "APIPA, ping IP, and nslookup are the three fastest network forks.",
      "A printer panel test page tells you whether to blame hardware or the queue.",
    ],
  },
];

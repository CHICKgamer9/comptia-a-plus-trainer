import type { Quiz } from "../types";

export const core1Quizzes: Quiz[] = [
  {
    id: "mobile-devices-quiz",
    domainId: "mobile-devices",
    title: "Mobile devices",
    questions: [
      {
        id: "md-q1",
        prompt:
          "A laptop charges and works on a USB-C dock at the office but shows no displays when the same dock is used with a different model. What should you check first?",
        choices: [
          "Whether the second laptop’s USB-C port supports DisplayPort Alt Mode or Thunderbolt",
          "Whether Windows needs a clean install",
          "Whether the dock’s Ethernet port has a link light",
          "Whether the CMOS battery is dead",
        ],
        correctIndex: 0,
        explanation:
          "USB-C ports are not equal. Some are charge-only. Video over a dock needs DP Alt Mode or Thunderbolt. A dock that works on one model can fail on another for that reason alone.",
      },
      {
        id: "md-q2",
        prompt:
          "After a laptop screen replacement, Wi-Fi range is suddenly terrible while Ethernet is fine. What is the most likely cause?",
        choices: [
          "The SSD was installed in the wrong slot",
          "Antenna leads on the wireless card were left unseated or pinched in the lid",
          "The battery calibration is off",
          "The user needs a new default gateway",
        ],
        correctIndex: 1,
        explanation:
          "Wi-Fi antennas usually route through the lid. It is easy to leave MAIN/AUX leads off the combo card or pinch them during a panel swap.",
      },
      {
        id: "md-q3",
        prompt:
          "A phone charges only when the cable is held at a sharp angle. What is the most likely hardware issue?",
        choices: [
          "A failed cellular modem",
          "Debris or a damaged charge port",
          "An incorrect APN",
          "A disabled Bluetooth radio",
        ],
        correctIndex: 1,
        explanation:
          "Angle-sensitive charging is a classic dirty or damaged port (or a failing cable). Radios and APNs do not cause that physical symptom.",
      },
      {
        id: "md-q4",
        prompt:
          "Which laptop memory form factor is the usual field replacement?",
        choices: ["DIMM", "SODIMM", "SIMM", "RIMM"],
        correctIndex: 1,
        explanation:
          "Laptops use SODIMM (or soldered LPDDR). Full-size DIMMs are desktops. SIMM/RIMM are obsolete.",
      },
      {
        id: "md-q5",
        prompt:
          "A user is trading in a company iPhone. After a factory reset it still asks for the previous Apple ID. What was missed?",
        choices: [
          "Removing the nano-SIM with power on",
          "Clearing Activation Lock / iCloud lock and any MDM supervision",
          "Turning off Bluetooth before the wipe",
          "Updating iOS after the wipe only",
        ],
        correctIndex: 1,
        explanation:
          "Activation Lock and MDM stay bound to the identity until they are released. A reset without that step bricks the device for the next user.",
      },
      {
        id: "md-q6",
        prompt:
          "A laptop trackpad is lifting the palm rest and the chassis is slightly warped. What should you do first?",
        choices: [
          "Tighten the trackpad screws harder",
          "Treat it as a swollen battery: power down, do not crush the pack, and replace it safely",
          "Run a disk defragmenter",
          "Reinstall the pointing-device driver",
        ],
        correctIndex: 1,
        explanation:
          "A rising palm rest is a common swollen Li-ion symptom. It is a safety issue, not a driver issue.",
      },
      {
        id: "md-q7",
        prompt:
          "Which connection is most likely to carry video, data, and 60–100 W of power to a laptop on a single cable?",
        choices: [
          "USB-A 2.0",
          "USB-C with the right capabilities (often Thunderbolt / PD)",
          "VGA",
          "RJ11",
        ],
        correctIndex: 1,
        explanation:
          "USB-C Power Delivery plus DP Alt Mode or Thunderbolt is how modern single-cable docks work. USB-A 2.0 and VGA cannot do that bundle.",
      },
      {
        id: "md-q8",
        prompt:
          "A user cannot tap-to-pay with their phone at a terminal. Wi-Fi and cellular are fine. Which radio should you verify?",
        choices: ["NFC", "GPS", "Infrared", "FM tuner"],
        correctIndex: 0,
        explanation:
          "Contactless payment uses NFC. GPS is location; IR is legacy line-of-sight.",
      },
      {
        id: "md-q9",
        prompt:
          "You need to replace a laptop keyboard. What should you do before disconnecting the ribbon cable?",
        choices: [
          "Enable Airplane mode only",
          "Disconnect external power and the internal battery (or the vendor battery disconnect)",
          "Format the EFI partition",
          "Set the BIOS to Legacy",
        ],
        correctIndex: 1,
        explanation:
          "Ribbon cables and boards get killed by residual power. Follow the service manual: unplug AC and isolate the battery.",
      },
      {
        id: "md-q10",
        prompt:
          "A tablet tethers as a hotspot but laptops never get an IP. The phone has signal and data. What is a likely cause?",
        choices: [
          "The tablet’s digitizer is miscalibrated",
          "Carrier hotspot is blocked, data saver is on, or the phone is out of hotspot quota",
          "The laptops need new CMOS batteries",
          "RAID 0 is degraded",
        ],
        correctIndex: 1,
        explanation:
          "Tethering is often a carrier/plan or OS data-saver issue. The phone can still browse while hotspot DHCP is denied.",
      },
    ],
  },
  {
    id: "networking-quiz",
    domainId: "networking",
    title: "Networking",
    questions: [
      {
        id: "net-q1",
        prompt: "A PC has IPv4 address 169.254.22.10. What failed?",
        choices: [
          "The default gateway ARP cache",
          "DHCP (the host gave itself APIPA)",
          "DNSSEC on the NIC",
          "The HTTPS certificate store",
        ],
        correctIndex: 1,
        explanation:
          "169.254.0.0/16 is Automatic Private IP Addressing. Windows does this when DHCP does not answer.",
      },
      {
        id: "net-q2",
        prompt: "Which port does HTTPS use by default?",
        choices: ["80", "22", "443", "25"],
        correctIndex: 2,
        explanation: "HTTP is 80. HTTPS (HTTP over TLS) is 443. SSH is 22. SMTP is 25.",
      },
      {
        id: "net-q3",
        prompt:
          "Ping to 8.8.8.8 works. Browsing by name fails. Which tool confirms the next theory?",
        choices: [
          "nslookup or ipconfig /all (DNS servers)",
          "A toner probe",
          "chkdsk",
          "A POST card",
        ],
        correctIndex: 0,
        explanation:
          "An IP ping proves routing/WAN. Name failure is DNS (or a proxy). nslookup and the NIC’s DNS list are the right next look.",
      },
      {
        id: "net-q4",
        prompt: "Which wireless standard introduced Wi-Fi 6?",
        choices: ["802.11n", "802.11ac", "802.11ax", "802.11g"],
        correctIndex: 2,
        explanation:
          "802.11ax is Wi-Fi 6 / 6E. 802.11n is Wi-Fi 4. 802.11ac is Wi-Fi 5.",
      },
      {
        id: "net-q5",
        prompt: "Which pair is correct for DHCP?",
        choices: [
          "TCP 67 client, TCP 68 server",
          "UDP 67 server, UDP 68 client",
          "TCP 53 only",
          "UDP 443 only",
        ],
        correctIndex: 1,
        explanation:
          "DHCP uses UDP. The server listens on 67; the client uses 68.",
      },
      {
        id: "net-q6",
        prompt:
          "A SOHO user wants the strongest common consumer Wi-Fi security. What do you set?",
        choices: [
          "WEP-128",
          "WPA-TKIP",
          "WPA2-PSK with AES (or WPA3-SAE if all clients allow it)",
          "Open with a hidden SSID",
        ],
        correctIndex: 2,
        explanation:
          "WEP and WPA-TKIP are obsolete. Hiding an SSID is not encryption. WPA2-AES or WPA3 is the right baseline.",
      },
      {
        id: "net-q7",
        prompt: "Which IPv4 ranges are RFC1918 private space?",
        choices: [
          "8.8.8.0/24, 1.1.1.0/24, 9.9.9.0/24",
          "10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16",
          "169.254.0.0/16 only",
          "224.0.0.0/4 only",
        ],
        correctIndex: 1,
        explanation:
          "Those three blocks are private. 169.254/16 is APIPA. 224/4 is multicast.",
      },
      {
        id: "net-q8",
        prompt: "A PoE access point has a good drop but will not power on. What is a likely cause?",
        choices: [
          "The switch port or injector is not providing PoE (or the budget is exhausted)",
          "The AP needs RAID 5",
          "DNS TTL is too low",
          "The user forgot the BitLocker PIN",
        ],
        correctIndex: 0,
        explanation:
          "APs often live on PoE. A healthy Ethernet pair still fails if the switch port is not PoE or the power budget is spent.",
      },
      {
        id: "net-q9",
        prompt: "RDP uses which default port?",
        choices: ["22", "445", "3389", "143"],
        correctIndex: 2,
        explanation: "RDP is TCP 3389. 22 is SSH, 445 is SMB, 143 is IMAP.",
      },
      {
        id: "net-q10",
        prompt:
          "Both ends of a new drop must use the same pairing. Which statement is true?",
        choices: [
          "T568A on one end and T568B on the other is the modern standard for all gigabit links",
          "Use T568A or T568B consistently on both ends unless you intentionally want a crossover",
          "Pair order does not matter above 100 Mbps",
          "You must use T568C for Cat6a",
        ],
        correctIndex: 1,
        explanation:
          "Straight-through cables use the same standard on both ends. Mixing A and B creates a crossover. Auto-MDIX often hides that, but the exam wants the standard.",
      },
    ],
  },
  {
    id: "hardware-quiz",
    domainId: "hardware",
    title: "Hardware",
    questions: [
      {
        id: "hw-q1",
        prompt: "Which RAID level stripes with no fault tolerance?",
        choices: ["RAID 0", "RAID 1", "RAID 5", "RAID 10"],
        correctIndex: 0,
        explanation:
          "RAID 0 is striping only. Any disk loss kills the array. It is speed, not safety.",
      },
      {
        id: "hw-q2",
        prompt: "A user needs a volume that can lose one disk and keep running with at least three disks. Which RAID?",
        choices: ["RAID 0", "RAID 5", "JBOD", "RAID 1 with a single disk"],
        correctIndex: 1,
        explanation:
          "RAID 5 needs a minimum of three disks and can survive one disk failure using parity.",
      },
      {
        id: "hw-q3",
        prompt: "DDR4 SODIMM will not seat in a desktop board. Why?",
        choices: [
          "SODIMM and DIMM are different form factors; generations also cannot mix",
          "You need to enable RAID first",
          "The stick must be formatted as NTFS",
          "UEFI cannot see RAM until Windows is installed",
        ],
        correctIndex: 0,
        explanation:
          "Laptop SODIMMs do not fit desktop DIMM slots, and DDR3/4/5 are keyed differently.",
      },
      {
        id: "hw-q4",
        prompt:
          "A PC POST-loops after a GPU upgrade. The new card has an extra 8-pin socket. What is the likely miss?",
        choices: [
          "The card needs supplemental PCIe power from the PSU",
          "The monitor is still on VGA",
          "The page file is too small",
          "IPv6 must be disabled",
        ],
        correctIndex: 0,
        explanation:
          "Many discrete GPUs need 6/8-pin (or 12VHPWR) power. Slot power alone is not enough.",
      },
      {
        id: "hw-q5",
        prompt: "The clock resets and BIOS settings vanish after every unplug. What is the usual part?",
        choices: [
          "CMOS/RTC battery",
          "NVMe heatsink",
          "TPM only",
          "The 8-pin CPU power (always)",
        ],
        correctIndex: 0,
        explanation:
          "The coin cell keeps CMOS settings and the clock when the PSU is off. A dead cell is this exact symptom.",
      },
      {
        id: "hw-q6",
        prompt: "Which connector is analog-only video?",
        choices: ["HDMI", "DisplayPort", "VGA", "DVI-D"],
        correctIndex: 2,
        explanation:
          "VGA is analog. HDMI and DisplayPort are digital. DVI-D is digital-only.",
      },
      {
        id: "hw-q7",
        prompt:
          "An M.2 SSD is physically installed but never appears. The board silk-screen says “NVMe.” The drive label says “SATA.” What happened?",
        choices: [
          "The drive is a SATA-protocol M.2 in an NVMe-only slot (or the opposite)",
          "SATA M.2 drives must be formatted in the BIOS before they enumerate",
          "You must enable PXE first",
          "The drive needs PoE",
        ],
        correctIndex: 0,
        explanation:
          "M.2 is a shape. The protocol can be SATA or NVMe (B/M keying). Mismatched slots simply do not enumerate the drive.",
      },
      {
        id: "hw-q8",
        prompt: "Windows 11 setup refuses a PC that “looks fine.” Which firmware features should you verify?",
        choices: [
          "TPM 2.0 and Secure Boot (plus a supported CPU)",
          "AHCI vs. RAID only",
          "Legacy ROM for the NIC",
          "WEP on the onboard Wi-Fi",
        ],
        correctIndex: 0,
        explanation:
          "Windows 11’s hard requirements include TPM 2.0, UEFI Secure Boot, and a supported processor family.",
      },
      {
        id: "hw-q9",
        prompt:
          "A laser printer’s panel test page looks perfect, but Windows jobs print garbage. Where is the problem?",
        choices: [
          "Fuser assembly",
          "Drum",
          "Driver, queue, or application (not the print engine)",
          "Pickup roller",
        ],
        correctIndex: 2,
        explanation:
          "A clean device test page means the engine is healthy. Garbage from Windows points at drivers (PCL vs. PS), a bad queue, or the app.",
      },
      {
        id: "hw-q10",
        prompt: "Which statement about RAID is true?",
        choices: [
          "RAID 10 is a backup because it can lose a disk",
          "RAID is availability/performance — you still need backups for delete, fire, and ransomware",
          "RAID 6 can lose every disk in the array",
          "RAID 1 requires four disks minimum",
        ],
        correctIndex: 1,
        explanation:
          "RAID is not a backup. RAID 1 needs two disks. RAID 6 survives two disk failures, not all of them.",
      },
    ],
  },
  {
    id: "virtualization-cloud-quiz",
    domainId: "virtualization-cloud",
    title: "Virtualization & cloud",
    questions: [
      {
        id: "vc-q1",
        prompt: "VMware ESXi running on the hardware with no host Windows install is which type?",
        choices: [
          "Type 1 (bare-metal) hypervisor",
          "Type 2 hypervisor",
          "SaaS",
          "A container runtime only",
        ],
        correctIndex: 0,
        explanation:
          "Type 1 sits on the metal. Type 2 sits on a general-purpose OS (Workstation, VirtualBox).",
      },
      {
        id: "vc-q2",
        prompt:
          "A new VM will not start and the product mentions virtualization being disabled. Where do you turn it on?",
        choices: [
          "UEFI/BIOS: Intel VT-x or AMD-V (and sometimes IOMMU)",
          "Disk Management",
          "The printer queue",
          "WPA3 settings",
        ],
        correctIndex: 0,
        explanation:
          "Hardware-assisted virtualization is a firmware switch. Hypervisors require it for 64-bit guests and decent performance.",
      },
      {
        id: "vc-q3",
        prompt:
          "You patch the guest OS, install the apps, and manage the firewall inside a cloud VM. Which model is that?",
        choices: ["SaaS", "PaaS", "IaaS", "DaaS only"],
        correctIndex: 2,
        explanation:
          "IaaS gives you the machine. You own the OS and above. SaaS is just the app. PaaS is a managed runtime.",
      },
      {
        id: "vc-q4",
        prompt: "Gmail or Microsoft 365 web mail is best classified as:",
        choices: ["IaaS", "PaaS", "SaaS", "Type 1 hypervisor"],
        correctIndex: 2,
        explanation:
          "You use the application. The vendor runs the stack. That is SaaS.",
      },
      {
        id: "vc-q5",
        prompt: "Why are long-lived VM snapshots a bad backup plan?",
        choices: [
          "They are a short-term undo, they slow disks, and they sit on the same storage as the VM",
          "Snapshots encrypt the host BIOS",
          "Snapshots disable DHCP forever",
          "CompTIA forbids all snapshots",
        ],
        correctIndex: 0,
        explanation:
          "Snapshots are convenience checkpoints on the same array. They are not offsite backups and they degrade performance if left for months.",
      },
      {
        id: "vc-q6",
        prompt: "A VM must look like just another PC on the office LAN. Which vNIC mode?",
        choices: [
          "Host-only",
          "NAT",
          "Bridged",
          "Internal printer redirection",
        ],
        correctIndex: 2,
        explanation:
          "Bridged attaches the VM to the real LAN segment. NAT hides it behind the host. Host-only isolates to the host.",
      },
      {
        id: "vc-q7",
        prompt: "Rapid elasticity in cloud computing means:",
        choices: [
          "The building is on springs",
          "You can scale resources out and back quickly, often automatically",
          "RAM never costs money",
          "You must use RAID 0",
        ],
        correctIndex: 1,
        explanation:
          "Elasticity is the on-demand scale-out / scale-in characteristic CompTIA lists for cloud.",
      },
      {
        id: "vc-q8",
        prompt:
          "The host has 8 GB RAM. You assign 6 GB to a guest and keep many Chrome tabs on the host. What happens?",
        choices: [
          "The hypervisor invents RAM",
          "The host may swap and both host and guest become slow — VMs use real resources",
          "The guest automatically moves to IaaS",
          "ECC corrects the shortage",
        ],
        correctIndex: 1,
        explanation:
          "Virtual RAM is still host RAM (plus swap if you overcommit). Oversubscription has a performance cost.",
      },
      {
        id: "vc-q9",
        prompt: "A company keeps some servers in a public cloud and some in its own datacenter, connected by VPN. This is:",
        choices: ["Public only", "Private only", "Hybrid", "SaaS"],
        correctIndex: 2,
        explanation:
          "Hybrid combines on-prem (or private) with public cloud. The VPN is a typical glue.",
      },
      {
        id: "vc-q10",
        prompt:
          "Which statement best describes a container compared with a VM?",
        choices: [
          "Containers virtualize a full hardware BIOS for each app",
          "Containers share the host kernel and are lighter; VMs virtualize a whole machine",
          "Containers cannot run on Linux",
          "Containers replace DNS",
        ],
        correctIndex: 1,
        explanation:
          "VMs emulate machines. Containers share a kernel and package the app userland. A+ still focuses more on VMs, but this comparison appears.",
      },
    ],
  },
  {
    id: "hw-net-troubleshooting-quiz",
    domainId: "hw-net-troubleshooting",
    title: "Hardware & network troubleshooting",
    questions: [
      {
        id: "tn-q1",
        prompt: "What is the correct first step in CompTIA’s troubleshooting methodology?",
        choices: [
          "Document findings",
          "Identify the problem",
          "Establish a plan of action",
          "Verify full system functionality",
        ],
        correctIndex: 1,
        explanation:
          "Identify first (symptoms, scope, recent changes, backups). Theory comes next, then test, plan, verify, document.",
      },
      {
        id: "tn-q2",
        prompt:
          "A desktop has no fans, no LEDs, and no POST. The outlet powers a lamp. What is a reasonable next test?",
        choices: [
          "Reinstall Office",
          "Known-good power cord, PSU switch, then a PSU tester or known-good PSU",
          "nslookup on another PC",
          "Replace the CMOS battery first every time",
        ],
        correctIndex: 1,
        explanation:
          "Zero life is a power-path problem. Confirm cord, switch, and PSU before you condemn the motherboard.",
      },
      {
        id: "tn-q3",
        prompt:
          "A laptop shows a black lid. An external monitor works. Where is the fault most likely?",
        choices: [
          "The lid cable, inverter/LED driver, or panel — not the GPU as a whole",
          "The SSD file system",
          "DNS",
          "The CMOS battery only",
        ],
        correctIndex: 0,
        explanation:
          "External video proves the GPU/output path can work. The lid assembly is the usual isolate.",
      },
      {
        id: "tn-q4",
        prompt:
          "A user has a link light but a 169.254.x.x address. What is the best next action?",
        choices: [
          "Replace the monitor",
          "Investigate DHCP (renew, VLAN, DHCP server, helper)",
          "Enable RAID 0",
          "Flash the GPU BIOS",
        ],
        correctIndex: 1,
        explanation:
          "Link + APIPA means layer 1 is up and DHCP is not delivering a lease.",
      },
      {
        id: "tn-q5",
        prompt:
          "You tested a theory and it was wrong. What does the methodology say to do?",
        choices: [
          "Document and close the ticket anyway",
          "Escalate without a note",
          "Establish a new theory and test that",
          "Skip to verify full functionality",
        ],
        correctIndex: 2,
        explanation:
          "If the theory fails, you loop: new theory, test again. You do not jump to “fixed.”",
      },
      {
        id: "tn-q6",
        prompt:
          "Intermittent Wi-Fi happens only in one conference room. Laptops are fine in other rooms. What is the better theory?",
        choices: [
          "Every laptop needs a Windows reinstall",
          "Local RF: channel overlap, a failing AP, or interference in that room",
          "The default gateway subnet mask is globally wrong",
          "All users have APIPA",
        ],
        correctIndex: 1,
        explanation:
          "A single location with multiple clients points at the RF environment or that AP, not an OS image.",
      },
      {
        id: "tn-q7",
        prompt:
          "A printer’s built-in test page is streaked. Windows is not involved yet. What should you suspect?",
        choices: [
          "A Windows PCL vs. PS driver mismatch",
          "Consumables or the print path (drum, toner, fuser, rollers)",
          "A paused spooler on a remote PC",
          "Group Policy preferences",
        ],
        correctIndex: 1,
        explanation:
          "Panel test pages never touch Windows. Dirty hardware pages are drums, toner, fusers, or the path.",
      },
      {
        id: "tn-q8",
        prompt:
          "A PC reboots under GPU load and sometimes smells of hot electronics. What is a strong hardware theory?",
        choices: [
          "Failing or under-spec PSU",
          "A stale ARP entry",
          "Wrong IMAP port",
          "A missing default domain policy",
        ],
        correctIndex: 0,
        explanation:
          "Load-related reboots plus heat smell are classic PSU (or power delivery) distress.",
      },
      {
        id: "tn-q9",
        prompt:
          "Ping to the default gateway fails. ipconfig shows a valid DHCP address on the correct subnet. What is a fair next check?",
        choices: [
          "Whether the gateway is up, the VLAN is right, or a host firewall is blocking ICMP",
          "Re-seat the CPU immediately",
          "Format the EFI partition",
          "Disable TPM",
        ],
        correctIndex: 0,
        explanation:
          "A good lease means DHCP worked. Gateway ping failure is then L2 path, wrong VLAN despite the lease, a down router, or ICMP filtered.",
      },
      {
        id: "tn-q10",
        prompt: "Why document after you verify the fix?",
        choices: [
          "So the next tech (and future you) can search the same symptom and see what actually worked",
          "CompTIA forbids knowledge bases",
          "Documentation replaces backups",
          "It resets the CMOS",
        ],
        correctIndex: 0,
        explanation:
          "The last step exists so the organization learns. Tickets and KB articles are the product of that step.",
      },
    ],
  },
];

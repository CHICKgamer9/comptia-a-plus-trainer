import type { Cheatsheet } from "./types";

export const cheatsheets: Cheatsheet[] = [
  {
    id: "ports",
    title: "Common ports",
    summary: "The well-known TCP/UDP doors A+ expects you to recite and recognize in tickets.",
    tables: [
      {
        title: "Must-know ports",
        headers: ["Port", "Protocol", "Service"],
        rows: [
          ["20 / 21", "TCP", "FTP data / control"],
          ["22", "TCP", "SSH, SFTP"],
          ["23", "TCP", "Telnet (cleartext — avoid)"],
          ["25", "TCP", "SMTP (server mail)"],
          ["53", "UDP/TCP", "DNS"],
          ["67 / 68", "UDP", "DHCP server / client"],
          ["80", "TCP", "HTTP"],
          ["110", "TCP", "POP3"],
          ["137–139", "UDP/TCP", "NetBIOS"],
          ["143", "TCP", "IMAP"],
          ["161 / 162", "UDP", "SNMP query / trap"],
          ["389", "TCP", "LDAP"],
          ["443", "TCP", "HTTPS"],
          ["445", "TCP", "SMB"],
          ["587", "TCP", "SMTP submission"],
          ["636", "TCP", "LDAPS"],
          ["993", "TCP", "IMAPS"],
          ["995", "TCP", "POP3S"],
          ["3389", "TCP", "RDP"],
        ],
      },
    ],
    notes: [
      "If ping to an IP works but the app fails, ask which port the app needs and whether a firewall is in the way.",
      "Secure variants (993, 995, 636, 443) are the ones you should recommend in the real world.",
    ],
  },
  {
    id: "connectors",
    title: "Cables & connectors",
    summary: "Name the plug before you order it. USB-C is several capabilities wearing one shape.",
    tables: [
      {
        title: "Video",
        headers: ["Connector", "Signal", "Notes"],
        rows: [
          ["HDMI", "Digital A/V", "TVs, many PCs, ARC/eARC on some"],
          ["DisplayPort", "Digital A/V", "Business monitors, daisy-chain"],
          ["DVI-D", "Digital video", "No audio"],
          ["VGA", "Analog video", "15-pin, no audio, analog only"],
        ],
      },
      {
        title: "Data & power",
        headers: ["Connector", "Use", "Watch-outs"],
        rows: [
          ["USB-A", "Classic host port", "Blue/teal usually SuperSpeed"],
          ["USB-C", "Host/device/video/power", "Not every port does DP Alt Mode or Thunderbolt"],
          ["Thunderbolt 3/4", "USB-C shape + PCIe", "Docks, eGPU, fast storage"],
          ["SATA data / power", "HDD, SATA SSD", "L-shaped 7-pin + 15-pin power"],
          ["M.2", "SSD stick", "SATA vs NVMe keying"],
          ["RJ45", "Ethernet", "T568A or B on both ends"],
          ["RJ11", "Analog phone / DSL", "Narrower than RJ45"],
          ["Lightning", "Older Apple mobile", "Not USB-C"],
        ],
      },
    ],
    notes: [
      "A USB-C cable can be charge-only. If a dock has no video, test the cable and the port capabilities.",
      "Do not mix modular PSU cables across brands.",
    ],
  },
  {
    id: "raid",
    title: "RAID levels",
    summary: "Speed, capacity, and how many disks you can lose. Still not a backup.",
    tables: [
      {
        title: "Common levels",
        headers: ["Level", "Min disks", "Fault tolerance", "Capacity idea"],
        rows: [
          ["0 stripe", "2", "None — any disk kills the array", "Sum of disks"],
          ["1 mirror", "2", "1 disk", "Half"],
          ["5 stripe+parity", "3", "1 disk", "N − 1"],
          ["6 dual parity", "4", "2 disks", "N − 2"],
          ["10 stripe of mirrors", "4", "1 per mirror pair (varies)", "Half"],
        ],
      },
    ],
    notes: [
      "Rebuilds on large RAID 5 arrays are risky — a second disk can die during rebuild. That is why RAID 6/10 show up in shops.",
      "Ransomware, fire, and “delete the wrong folder” all ignore RAID. You still need backups.",
    ],
  },
  {
    id: "windows-tools",
    title: "Windows tools & commands",
    summary: "What to open when the ticket is already on fire.",
    tables: [
      {
        title: "GUI",
        headers: ["Tool", "Reach for it when"],
        rows: [
          ["Task Manager", "CPU/RAM/disk, Startup apps, hung processes"],
          ["Event Viewer", "Why it died at 02:14"],
          ["Device Manager", "Yellow bangs, roll back driver"],
          ["Disk Management", "Letters, Offline disks, partitions"],
          ["Computer Management", "Shares, local users, several consoles"],
          ["WinRE", "No boot: Uninstall Updates, Restore, Safe Mode"],
        ],
      },
      {
        title: "CLI",
        headers: ["Command", "Job"],
        rows: [
          ["ipconfig /all", "Lease, gateway, DNS, MAC"],
          ["ipconfig /release & /renew", "Recycle DHCP"],
          ["ipconfig /flushdns", "Stale names"],
          ["ping / tracert", "Reachability and path"],
          ["nslookup", "Name resolution"],
          ["netstat -ano", "Ports to PIDs"],
          ["sfc /scannow", "System file repair"],
          ["DISM ... /RestoreHealth", "Component store, then rerun SFC"],
          ["chkdsk /f /r", "File system / bad sectors"],
          ["gpupdate /force", "Pull policy now"],
          ["gpresult /r", "What policy actually applied"],
          ["bootrec /rebuildbcd", "Missing boot entries (WinRE)"],
        ],
      },
    ],
    notes: [
      "Safe Mode works → suspect extra drivers/startup. Safe Mode fails → disk, RAM, or core OS.",
      "Print spooler haunt: stop service, clear System32\\spool\\PRINTERS, start service.",
    ],
  },
  {
    id: "wireless",
    title: "Wi-Fi standards & security",
    summary: "Bands, generation names, and the only encryption you should still configure.",
    tables: [
      {
        title: "Standards",
        headers: ["Name", "IEEE", "Band"],
        rows: [
          ["legacy", "802.11a", "5 GHz"],
          ["legacy", "802.11b/g", "2.4 GHz"],
          ["Wi-Fi 4", "802.11n", "2.4 / 5 GHz"],
          ["Wi-Fi 5", "802.11ac", "5 GHz"],
          ["Wi-Fi 6 / 6E", "802.11ax", "2.4 / 5 / 6 GHz"],
        ],
      },
      {
        title: "Security",
        headers: ["Mode", "Verdict"],
        rows: [
          ["Open / WEP", "Do not use"],
          ["WPA-TKIP", "Legacy — avoid"],
          ["WPA2-PSK AES", "Home/SOHO baseline"],
          ["WPA3-SAE", "Current consumer target"],
          ["WPA2/3-Enterprise (802.1X)", "Work: RADIUS, not a shared password"],
          ["WPS", "Disable — PIN is weak"],
        ],
      },
    ],
    notes: [
      "2.4 GHz: range and interference (Bluetooth, microwaves, analog cameras). 5 GHz: faster, shorter.",
      "Hidden SSID and MAC filters are not a security program.",
    ],
  },
  {
    id: "methodology",
    title: "Troubleshooting methodology",
    summary: "Say it until it is boring. Then use it on every lab ticket.",
    tables: [
      {
        title: "The six steps",
        headers: ["Step", "In practice"],
        rows: [
          ["1. Identify", "Symptoms, scope, recent changes, backups"],
          ["2. Theory", "Obvious and recent first"],
          ["3. Test", "One change. If wrong, new theory"],
          ["4. Plan", "Fix + change window + vendor docs"],
          ["5. Verify", "User’s real job, plus preventative bits"],
          ["6. Document", "Cause, steps, next-tech notes"],
        ],
      },
      {
        title: "Fast network forks",
        headers: ["Result", "Think"],
        rows: [
          ["No link light", "Cable, port, NIC, disabled adapter"],
          ["169.254.x.x", "DHCP / VLAN"],
          ["Ping IP works, name fails", "DNS"],
          ["Ping gateway fails", "LAN/VLAN/gateway/firewall"],
          ["One room, many clients", "RF or that AP"],
        ],
      },
    ],
    notes: [
      "Printer panel test page clean → blame queue/driver/IP. Dirty → consumables/path.",
      "External monitor works, lid does not → cable/panel. Neither works → GPU/output/settings.",
    ],
  },
  {
    id: "filesystems",
    title: "File systems & boot",
    summary: "What to format a stick as, and why setup cannot create a partition.",
    tables: [
      {
        title: "File systems",
        headers: ["FS", "Home turf"],
        rows: [
          ["NTFS", "Windows system volumes, permissions, BitLocker"],
          ["ReFS", "Some Windows Server data volumes"],
          ["exFAT", "USB sticks that Windows and macOS both write"],
          ["FAT32", "Legacy, 4 GB file cap"],
          ["APFS", "Modern macOS"],
          ["ext4", "Common Linux"],
        ],
      },
      {
        title: "Firmware + disk",
        headers: ["Firmware", "Disk style"],
        rows: [
          ["UEFI", "GPT (and Secure Boot / TPM for Win11)"],
          ["Legacy BIOS", "MBR"],
        ],
      },
    ],
    notes: [
      "Windows 11: TPM 2.0, Secure Boot, supported CPU — often a firmware switch, not a new PC.",
      "BitLocker = volume. EFS = per-file. FileVault = Apple volume encryption. Recovery keys must live somewhere that is not only the lost disk.",
    ],
  },
  {
    id: "safety",
    title: "Safety, ESD, backups",
    summary: "The operational-procedures sheet you actually want on a phone.",
    tables: [
      {
        title: "Safety",
        headers: ["Rule", "Why"],
        rows: [
          ["Do not open a PSU", "Stored high voltage — replace the unit"],
          ["ESD strap on grounded work", "Boards and RAM are fragile; not for live chassis as your only plan"],
          ["Swollen Li-ion", "Power down, don’t crush/puncture, hazardous disposal"],
          ["Surge strip ≠ UPS", "UPS is runtime + conditioning"],
        ],
      },
      {
        title: "Backups",
        headers: ["Idea", "Meaning"],
        rows: [
          ["3-2-1", "3 copies, 2 media, 1 offsite/offline"],
          ["Full", "Everything"],
          ["Incremental", "Since last backup of any type"],
          ["Differential", "Since last full"],
          ["RAID / snapshot", "Not a backup"],
        ],
      },
    ],
    notes: [
      "Change requests need reason, risk, rollback, schedule, approval.",
      "Test restores or you have a ritual.",
    ],
  },
  {
    id: "percent-tricks",
    subject: "maths",
    title: "Percent tricks",
    summary: "GST, multipliers, and the moves that keep a till honest.",
    tables: [
      {
        title: "Multipliers",
        headers: ["Change", "Multiply by"],
        rows: [
          ["+10% / GST exclusive → inclusive", "1.10"],
          ["Inclusive → pre-GST (10%)", "÷ 1.1 or × 10/11"],
          ["GST amount inside inclusive", "÷ 11"],
          ["20% off", "0.80"],
          ["Increase 20%", "1.20"],
          ["Find original after 20% off", "÷ 0.80"],
        ],
      },
    ],
    notes: [
      "Stacked discounts multiply. They do not add.",
      "Percent change divides by the original, not the new value.",
    ],
  },
  {
    id: "si-units",
    subject: "science",
    title: "SI & forces",
    summary: "The units and Newton lines you actually use in a check.",
    tables: [
      {
        title: "Keep these straight",
        headers: ["Quantity", "Unit"],
        rows: [
          ["Mass", "kg"],
          ["Weight / force", "N"],
          ["Energy / work", "J"],
          ["Power", "W (J/s)"],
          ["g (Earth)", "~9.8 m/s²"],
        ],
      },
    ],
    notes: [
      "Net force zero means constant velocity, including rest.",
      "Energy changes form; waste heat still counts.",
    ],
  },
  {
    id: "dates-that-earn-their-keep",
    subject: "history",
    title: "Dates that earn their keep",
    summary: "Scaffolding only. The path still wants causes and sources.",
    tables: [
      {
        title: "Australia, roughly",
        headers: ["When", "What it is not / is"],
        rows: [
          ["Deep time", "Not a prologue — the main occupancy story"],
          ["1770", "Cook chart/claim — not the colony"],
          ["1788", "First Fleet on Eora land"],
          ["1901", "Federation"],
          ["1915 / 1916–18", "Gallipoli myth / larger AIF deaths in France"],
          ["1942", "Singapore, Darwin, alliance shift"],
          ["1967", "Not “got the vote” as a one-liner — check the question"],
          ["1992", "Mabo: terra nullius dumped in common law"],
        ],
      },
    ],
    notes: [
      "A date without a cause-braid is trivia.",
      "Ask who wrote the source and who is missing.",
    ],
  },
];

export function getCheatsheet(id: string) {
  return cheatsheets.find((sheet) => sheet.id === id);
}

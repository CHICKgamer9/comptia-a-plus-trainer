import type { Lesson } from "../types";
import { diagramFigure } from "../figures";

export const core2Lessons: Lesson[] = [
  {
    id: "operating-systems-essentials",
    domainId: "operating-systems",
    title: "Windows first, plus enough macOS and Linux to help",
    minutes: 22,
    intro:
      "Core 2 expects you to install, configure, and navigate Windows 10 and 11 like a tech who lives in them — then prove you will not freeze if the user hands you a Mac or a Linux lab PC. This is about tools, install choices, and where settings actually live.",
    figure: diagramFigure(
      "window",
      "Stylised window with title bar and three control dots, standing in for the OS desktop you actually click.",
      "Settings live in named tools (WinRE, Settings, Control Panel leftovers) — not “somewhere in the GUI.”",
    ),
    sections: [
      {
        heading: "Installs, upgrades, and the questions that change the outcome",
        paragraphs: [
          "Before you wipe a disk: backup, BitLocker recovery key, local and Microsoft account, and whether the PC must stay on a domain. Clean install vs. in-place upgrade vs. repair install (setup from ISO over the same edition) are different tools. An in-place upgrade keeps apps and files when the path is supported; a clean install is the honest fix for years of leftover junk.",
          "Windows 11 needs TPM 2.0, Secure Boot, a supported CPU, and more RAM/storage than Windows 10. If a PC “can’t upgrade,” check firmware switches before you promise new hardware. Partition style: UEFI firmware expects GPT. Legacy BIOS expects MBR. A mismatch is a common “setup couldn’t create a partition” failure.",
        ],
        bullets: [
          "Unattended / answer files and Autopilot exist for fleets. Imaging (MDT, vendor tools, clone after sysprep) still shows up on A+.",
          "Know when to use a recovery drive, installation media, and WinRE (Troubleshoot → Advanced options).",
          "Edition matters: Home vs. Pro vs. Enterprise. BitLocker, RDP host, and domain join are Pro+ features.",
        ],
        callout: {
          type: "exam",
          text: "Domain join and BitLocker are not on Windows Home. If the ticket requires either, the SKU is wrong — not the user’s password.",
        },
      },
      {
        heading: "The Windows tools you should open without thinking",
        paragraphs: [
          "Task Manager for CPU/RAM/disk/GPU and startup apps. Event Viewer for why something died at 2:14 a.m. Device Manager for yellow bangs and driver rollbacks. Disk Management for letters, partitions, and a disk stuck Offline/Read-only. Services.msc for things that should start automatically. Computer Management wraps several of these.",
        ],
        table: {
          headers: ["Tool / command", "When you reach for it"],
          rows: [
            ["sfc /scannow", "System file corruption, after malware or a bad update"],
            ["DISM /Online /Cleanup-Image /RestoreHealth", "When SFC cannot fix the component store"],
            ["chkdsk /f /r", "File system and bad-sector checks (needs a reboot for C:)"],
            ["diskpart", "Offline disks, hidden partitions, stubborn clean (dangerous)"],
            ["msconfig", "Selective startup, boot options (Win 10/11 still has it)"],
            ["resmon / perfmon", "Who is eating the disk when Task Manager is vague"],
            ["gpupdate /force + gpresult /r", "“My mapped drive vanished after I left the office”"],
          ],
        },
      },
      {
        heading: "Networking and identity on a Windows box",
        paragraphs: [
          "ipconfig /all shows DHCP vs. static, DNS servers, and the MAC. ipconfig /release and /renew recycle a lease. ipconfig /flushdns clears a poisoned or stale cache. netstat -ano maps ports to PIDs. Get-NetIPConfiguration in PowerShell is the modern equivalent.",
          "Workgroup vs. domain vs. Microsoft/Entra ID: a workgroup is peer-to-peer. A domain is on-prem Active Directory with Group Policy. Entra-joined (Azure AD) is cloud identity. Hybrid is both. “Cannot join the domain” is DNS (must find the DC), credentials, time skew, or a Home edition — not a missing NIC driver if they already have an IP.",
        ],
      },
      {
        heading: "macOS awareness",
        paragraphs: [
          "Finder is Explorer. Spotlight is search. System Settings (Ventura+) is the control panel. Time Machine is the built-in backup story. Activity Monitor is Task Manager. Disk Utility repairs volumes. Terminal is bash/zsh. FileVault is BitLocker-class disk encryption. Gatekeeper and notarization gate what can run.",
          "Apple menu → Force Quit for a wedged app. Recovery (Command-R or the newer key combos per chip) is WinRE’s cousin. Do not treat an iMac as a generic PC: fusion drives, T2/Apple silicon, and “find my” locks change wipe procedures.",
        ],
      },
      {
        heading: "Linux awareness",
        paragraphs: [
          "You will not be asked to administer Kubernetes. You will be asked to find a file, read a log, and install a package. Know: ls, cd, pwd, cp, mv, rm, chmod, chown, su/sudo, apt/yum/dnf, ifconfig/ip, ps, grep, and that /var/log is where stories are written. Ext4, XFS, and Btrfs show up as file systems; NTFS is the Windows default; APFS is Apple; exFAT is the USB stick that both sides can write.",
        ],
        callout: {
          type: "tip",
          text: "chmod 755 vs. 644 is still an exam favorite. Execute bit on a script that “won’t run” is a real ticket, not trivia.",
        },
      },
    ],
    keyTakeaways: [
      "Match firmware mode to disk style: UEFI + GPT, legacy + MBR.",
      "Windows Home cannot domain-join or host full BitLocker the way Pro can.",
      "SFC, DISM, Event Viewer, and Device Manager are daily tools — not obscure extras.",
      "Domain join failures are usually DNS, time, SKU, or credentials.",
      "macOS and Linux questions test navigation and backup/encryption names, not deep admin.",
    ],
  },
  {
    id: "security-essentials",
    domainId: "security",
    title: "Threats, locks, and the human who clicked",
    minutes: 20,
    intro:
      "A+ security is not CISSP. It is the helpdesk layer: malware families, phishing, wireless hardening, account lockout, physical locks, and what you actually change on a SOHO router after a breach scare.",
    figure: diagramFigure(
      "lock",
      "Padlock outline: the physical and account lock a helpdesk ticket actually touches.",
      "Locks are layers: something you know, have, are — plus the cable on the door. One lock is a hope.",
    ),
    sections: [
      {
        heading: "Malware and social engineering, as they appear on tickets",
        paragraphs: [
          "Virus: infects files. Worm: spreads itself. Trojan: pretends to be useful. Ransomware: encrypts and extorts. Spyware/PUPs: ride along with “free” installers. Rootkits: hide. Keyloggers: steal input. Cryptominers: steal CPU. The first move on a suspected infection is isolate (pull the cable, disable Wi-Fi) so it stops spreading, then investigate — not “run five scanners at once on a still-connected PC.”",
          "Social engineering skips malware entirely: phishing (email), vishing (phone), smishing (SMS), tailgating, dumpster diving, impersonation. A convincing “IT needs your password” call is a ticket you close by not giving the password — then reporting it.",
        ],
        callout: {
          type: "watch",
          text: "Do not pay ransomware as policy advice. Isolate, preserve evidence if required, restore from known-good backups, and rotate credentials.",
        },
      },
      {
        heading: "Authentication and access",
        paragraphs: [
          "Something you know (password/PIN), have (token, phone, smart card), are (biometric). MFA uses two different factors — a password plus a code from the same brain is not two factors. Least privilege: users are not local admins “because the app asked once.” UAC exists so that elevation is a decision, not a lifestyle.",
        ],
        bullets: [
          "Lockout policies stop password sprays; they also generate “I can’t log in” tickets after typos.",
          "Folder permissions: NTFS security vs. share permissions. The effective right is the more restrictive of the two. Deny wins.",
          "EFS encrypts files for a user profile. BitLocker encrypts the volume. They are not the same button.",
        ],
      },
      {
        heading: "Wireless and SOHO hardening",
        paragraphs: [
          "Change default admin passwords on routers. Disable WPS. Use WPA2-AES or WPA3. Prefer a separate guest SSID. Hide SSID is not security (it is obscurity). MAC filters are bypassable. Firmware updates close WAN-facing bugs.",
          "At work, 802.1X (Enterprise) beats a shared PSK that is written on a whiteboard. Disable unused physical ports or use port security where the shop has it. A rogue AP is a physical and wireless problem — find it with a survey, do not just “turn Wi-Fi off on the user’s laptop.”",
        ],
      },
      {
        heading: "Physical and workstation security",
        paragraphs: [
          "Cable locks, USB port blockers, privacy screens, badge doors, and a locked server closet are in-scope. Screen lock + short timeout + Ctrl-Alt-Del or Windows-L when you walk away. Disable AutoRun/AutoPlay. Encrypt lost-laptop risk with BitLocker and a stored recovery key in AD or the vendor account — a key that exists only on the lost disk is not a recovery plan.",
        ],
        table: {
          headers: ["Control", "Stops"],
          rows: [
            ["Screen lock + timeout", "Walk-up access"],
            ["BitLocker", "Disk theft / lost laptop data"],
            ["Disabling unused USB / Storage Sense policies", "Easy data walk-out"],
            ["Secure Boot + TPM", "Some bootkit / unsigned boot path tricks"],
            ["MDM + remote wipe", "Lost phones that still hold mail"],
          ],
        },
      },
      {
        heading: "A practical malware response order",
        paragraphs: [
          "Identify and isolate. Disable System Restore only when you know you will rebuild or when restore points are infected (exam still mentions this). Update anti-malware from a clean state, scan in Safe Mode if needed, remove, schedule scans, enable messages to the user, and educate. If the box is a domain of persistence, wipe and restore. Document what spread and which shares were open.",
        ],
      },
    ],
    keyTakeaways: [
      "Isolate first on malware. Then remove or rebuild. Then educate.",
      "MFA is two different factor types. Users should not be local admins by default.",
      "WPA2-AES / WPA3, no WPS, new admin password — the SOHO checklist.",
      "NTFS + share permissions: most restrictive wins; Deny wins.",
      "BitLocker is volume encryption. A recovery key you cannot find is not a key.",
    ],
  },
  {
    id: "software-troubleshooting-essentials",
    domainId: "software-troubleshooting",
    title: "When the OS is the incident",
    minutes: 18,
    intro:
      "Software troubleshooting is Core 2’s version of the hardware lab: BSOD after a driver, a profile that will not load, an app that crashes only for one user, and a phone stuck in a boot loop. Logs beat folklore.",
    sections: [
      {
        heading: "Windows will not boot (cleanly)",
        paragraphs: [
          "WinRE is your shop: Startup Repair, System Restore, Uninstall Updates, Startup Settings (Safe Mode), Command Prompt, and Reset this PC. bootrec /fixmbr, /fixboot, and /rebuildbcd still appear when the BCD is toast. A failed cumulative update often uninstalls from WinRE faster than a rebuild.",
          "Safe Mode loads minimal drivers. If it works, a third-party driver, service, or startup app is the suspect — last week’s GPU driver is a classic. If Safe Mode also bluescreens, think disk, memory, or a core system file.",
        ],
        callout: {
          type: "exam",
          text: "A BSOD that names a .sys file is pointing at a driver. Roll back or boot to Last Known Good / Safe Mode before you reinstall Windows.",
        },
      },
      {
        heading: "Slow, crashy, and “it happens only to my account”",
        paragraphs: [
          "One-user issues live in the profile, per-user startup, or per-user appdata. All-users issues live in the machine: drivers, services, disk, malware. A slow PC after login is often startup programs, a failing HDD, or a full disk — check Task Manager Startup and free space before you buy RAM.",
          "Corrupted profiles: sometimes a new profile + copy of data is faster than hours inside the old NTUSER.DAT. Application crashes: Event Viewer (Application log), repair/reinstall, run as standard user (if it “needs admin,” fix the folder permissions or the app).",
        ],
        bullets: [
          "0x8007xxxx Windows Update errors: DISM, date/time, and the Windows Update Troubleshooter; sometimes rename SoftwareDistribution.",
          "Service failed to start: Dependencies + account (Local System vs. a domain service account with an expired password).",
          "Print spooler stuck: stop the service, clear %SystemRoot%\\System32\\spool\\PRINTERS, start it again.",
        ],
      },
      {
        heading: "Mobile OS problems",
        paragraphs: [
          "iOS/iPadOS and Android: force restart, storage full (updates fail quietly), failed OS update, app cache, and a network that is captive or IPv6-unhappy. Soft reset vs. factory reset — back up first. A phone that will not charge is often debris or a cable; a phone that charges and will not boot is OS or board. After a bad update, official recovery mode (DFU / manufacturer recovery) is the documented path, not a random APK from a forum.",
        ],
      },
      {
        heading: "Security-flavored software symptoms",
        paragraphs: [
          "Browser homepage hijacks, unexpected toolbars, certificate warnings on every site (look at the date, then malware/proxy), and “your PC is infected” pop-ups that are just full-screen web pages. Check proxy settings, installed programs, and extension lists. If every HTTPS site fails with a date error, fix the clock before you reimage.",
        ],
        table: {
          headers: ["Symptom", "First fork"],
          rows: [
            ["BSOD after driver install", "Safe Mode → roll back driver"],
            ["Black screen after login", "Win + Ctrl + Shift + B, then Safe Mode / new profile"],
            ["App works for others on the PC", "Profile / AppData / permissions"],
            ["No internet in the browser, ping works", "Proxy, DNS, filter extension"],
            ["Phone update fails at 99%", "Storage, power, official recovery"],
          ],
        },
      },
    ],
    keyTakeaways: [
      "WinRE and Safe Mode are the front door to most boot failures.",
      "A named .sys on a BSOD is a driver lead — roll back first.",
      "One user vs. all users splits profile problems from machine problems.",
      "Clear the print spooler folder when the queue is haunted.",
      "Wrong system clock produces “security” certificate errors that are not malware.",
    ],
  },
  {
    id: "operational-procedures-essentials",
    domainId: "operational-procedures",
    title: "How professionals close tickets",
    minutes: 16,
    intro:
      "Operational procedures is the “adult in the room” domain: safety, ESD, change control, documentation, backups, licensing, and communication. It is also easy points if you treat it like a real job instead of fluff.",
    sections: [
      {
        heading: "Safety and ESD — you cannot RMA a person",
        paragraphs: [
          "Unplug before you open a PSU. You do not service the inside of a power supply; you replace the unit. High voltage lives in CRT/legacy and in laser fusers. Use a wrist strap clipped to ground (or an ESD mat) when you handle boards and RAM. Do not wear the strap while you work on a live chassis.",
          "Lifting with your legs, cable trip hazards, compressed air (not a blower full of moisture), and battery disposal (Li-ion is hazardous waste, not “trash”) are all in-scope. Know where the fire extinguisher is and that a Class C (electrical) situation is not a water adventure.",
        ],
        callout: {
          type: "watch",
          text: "A swollen laptop battery is a safety ticket first. Power down, do not flex the chassis flat, and store the pack in a proper container.",
        },
      },
      {
        heading: "Change management and documentation",
        paragraphs: [
          "A change request has: reason, scope, risk, rollback, schedule, and approval. You do not patch the finance file server at 10:00 on a Monday because you felt motivated. Rollback is a plan, not a hope — snapshot, backup, or a known-good image.",
          "Ticketing: one issue per ticket when you can, asset tag, reproduction steps, what you tried, and the resolution in language the next tech can search. Knowledge base articles are how you stop answering the same printer question forever. Acceptable Use and privacy policies tell you whether you may look in a mailbox — “I’m IT” is not a warrant.",
        ],
      },
      {
        heading: "Backups, recovery, and the 3-2-1 idea",
        paragraphs: [
          "3 copies, 2 media types, 1 offsite (or offline/immutable). Full, incremental, and differential still appear on the exam: incremental is since the last backup of any type (faster daily, slower restore). Differential is since the last full (bigger dailies, simpler restore). Test restores or you have a ritual, not a backup.",
          "Backup vs. snapshot vs. RAID: RAID keeps you online after a disk failure. Snapshots undo a change. Backups survive ransomware, fire, and “I deleted the wrong folder.” You want the last one even if you have the first two.",
        ],
      },
      {
        heading: "Professionalism on the phone and at the desk",
        paragraphs: [
          "Avoid jargon unless the user wants it. Do not shame them for the phishing click. Set expectations (“I will call you by 3 if the part slips”). Ask before you move personal items. Do not browse their photos. Chain of custody matters if the device is evidence. Licensing: you may not ship a golden image full of someone else’s OEM key and call it a standard.",
        ],
        bullets: [
          "Remote support: get consent, announce when you take input, and end the session visibly.",
          "Scripted malware “support” callers are social engineering. Hang up and open a ticket with your real number.",
          "Asset tags and inventory beat “I think that laptop is Dave’s.”",
        ],
      },
      {
        heading: "Environmental and power protection",
        paragraphs: [
          "A surge protector is not a UPS. A UPS gives a few minutes to shut down and conditions power. Batteries age out. Server closets need airflow, not a blocked intake and a space heater. MSDS/SDS sheets tell you how to handle toner and batteries. Know your shop’s spill and incident path.",
        ],
      },
    ],
    keyTakeaways: [
      "Do not open a PSU. Use ESD protection on components. Treat batteries as hazardous.",
      "Every production change needs approval, a window, and a rollback.",
      "Backups are proven by restores. RAID and snapshots are not backups.",
      "Write tickets so the next tech can finish them without calling you.",
      "A UPS is runtime + conditioning. A power strip is not.",
    ],
  },
];

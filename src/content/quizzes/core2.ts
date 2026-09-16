import type { Quiz } from "../types";

export const core2Quizzes: Quiz[] = [
  {
    id: "operating-systems-quiz",
    domainId: "operating-systems",
    title: "Operating systems",
    questions: [
      {
        id: "os-q1",
        prompt: "A user on Windows 11 Home cannot join the office Active Directory domain. Why?",
        choices: [
          "Home edition cannot domain-join; they need Pro or higher",
          "Home cannot use Ethernet",
          "Home forbids DHCP",
          "Home requires RAID 5",
        ],
        correctIndex: 0,
        explanation:
          "Domain join is a Pro/Enterprise/Education feature. Home is workgroup (or Microsoft account) only.",
      },
      {
        id: "os-q2",
        prompt:
          "Setup cannot create a partition on a new disk. The firmware is UEFI. Which disk style should you use?",
        choices: ["MBR", "GPT", "FAT12", "swap"],
        correctIndex: 1,
        explanation:
          "UEFI installs expect GPT. Legacy BIOS + MBR is the older pairing. A mismatch is a common setup failure.",
      },
      {
        id: "os-q3",
        prompt: "Which pair is the usual Windows 11 firmware requirement besides a supported CPU?",
        choices: [
          "TPM 2.0 and Secure Boot",
          "WEP and Telnet",
          "RAID 0 and PXE only",
          "BIOS-only and MBR-only",
        ],
        correctIndex: 0,
        explanation:
          "Windows 11 wants UEFI Secure Boot and TPM 2.0 (plus RAM/storage/CPU lists).",
      },
      {
        id: "os-q4",
        prompt: "sfc /scannow fails to repair files. What is the usual next inbox tool?",
        choices: [
          "DISM /Online /Cleanup-Image /RestoreHealth, then SFC again",
          "diskpart clean on C: immediately",
          "Disable the NIC",
          "Format the recovery partition only",
        ],
        correctIndex: 0,
        explanation:
          "DISM repairs the component store that SFC uses. Then you rerun SFC. Wiping C: is not the next step.",
      },
      {
        id: "os-q5",
        prompt: "A mapped drive works on-site and vanishes on VPN for one user. Which command helps prove GPO applied?",
        choices: [
          "gpresult /r (and gpupdate /force after you fix the cause)",
          "chkdsk /r",
          "msinfo32 only",
          "dxdiag",
        ],
        correctIndex: 0,
        explanation:
          "Drive maps are often Group Policy preferences. gpresult shows what applied; VPN/DC reachability and item-level targeting are common causes.",
      },
      {
        id: "os-q6",
        prompt: "Which macOS feature is the closest analog to BitLocker?",
        choices: ["Time Machine", "FileVault", "Spotlight", "Mission Control"],
        correctIndex: 1,
        explanation:
          "FileVault is full-volume encryption. Time Machine is backup. Spotlight is search.",
      },
      {
        id: "os-q7",
        prompt: "On Linux, a script is readable but will not run. What is a common miss?",
        choices: [
          "The execute bit is missing (chmod +x) or the shebang is wrong",
          "The file must be NTFS",
          "You must enable TPM in ext4",
          "Linux cannot run scripts",
        ],
        correctIndex: 0,
        explanation:
          "Unix permissions need +x on the file (and a valid interpreter). This is a standard A+ Linux item.",
      },
      {
        id: "os-q8",
        prompt: "Which Windows tool shows a yellow bang on a device and lets you roll back a driver?",
        choices: ["Device Manager", "Disk Cleanup", "Character Map", "Snipping Tool"],
        correctIndex: 0,
        explanation:
          "Device Manager is the driver and hardware-status console, including Roll Back Driver.",
      },
      {
        id: "os-q9",
        prompt: "ipconfig /flushdns is for:",
        choices: [
          "Clearing the local DNS resolver cache",
          "Wiping the ARP table of the core switch",
          "Resetting TPM",
          "Rebuilding the BCD",
        ],
        correctIndex: 0,
        explanation:
          "The client cache can hold a stale or poisoned name. Flush it after DNS changes or weird name results.",
      },
      {
        id: "os-q10",
        prompt: "Which file system is the usual choice for a USB stick used on both Windows and macOS?",
        choices: ["NTFS only", "APFS only", "exFAT", "ReFS"],
        correctIndex: 2,
        explanation:
          "exFAT is the common cross-platform removable format. NTFS write on Mac is limited; APFS is not friendly on Windows.",
      },
    ],
  },
  {
    id: "security-quiz",
    domainId: "security",
    title: "Security",
    questions: [
      {
        id: "sec-q1",
        prompt: "A workstation shows a ransom note and encrypted file extensions. What is the first action?",
        choices: [
          "Pay the ransom immediately from petty cash",
          "Isolate the PC from the network to stop spread, then follow incident process",
          "Email the file samples to everyone",
          "Disable the UPS",
        ],
        correctIndex: 1,
        explanation:
          "Containment first. Paying is not a technical fix and may be against policy. Then restore from known-good backups and rotate credentials.",
      },
      {
        id: "sec-q2",
        prompt: "Which is true multi-factor authentication?",
        choices: [
          "Password plus a PIN the user also invented (both knowledge)",
          "Password plus a phone authenticator app or hardware token (knowledge + possession)",
          "Two different passwords",
          "Username plus password",
        ],
        correctIndex: 1,
        explanation:
          "Factors must be different types: know / have / are. Two passwords are still one factor type.",
      },
      {
        id: "sec-q3",
        prompt: "A helpdesk caller asks for a user’s password to “complete a mailbox migration.” What should the user do?",
        choices: [
          "Give the password if the caller ID looks internal",
          "Refuse, hang up, and contact IT on a known-good number — this is vishing",
          "Change the password to Password123 so it is easy to share",
          "Post the password in the team chat",
        ],
        correctIndex: 1,
        explanation:
          "Real IT does not need the user’s password. This is classic voice phishing. Use a published callback number.",
      },
      {
        id: "sec-q4",
        prompt: "Which wireless setup is appropriate for a typical home router?",
        choices: [
          "WEP + WPS on",
          "WPA2-PSK AES or WPA3, default admin password changed, WPS off",
          "Open network with MAC filter only",
          "TKIP-only WPA",
        ],
        correctIndex: 1,
        explanation:
          "Change defaults, disable WPS, use modern AES/WPA3. MAC filters and hidden SSIDs are not real security.",
      },
      {
        id: "sec-q5",
        prompt:
          "Share permission is Change. NTFS permission is Read. What can the user do over the network?",
        choices: [
          "Full control",
          "Read only (most restrictive combination applies)",
          "Change, because share permissions win",
          "Nothing, because Deny is implied",
        ],
        correctIndex: 1,
        explanation:
          "Effective access is the more restrictive of share vs. NTFS. Read + Change = Read. Explicit Deny would still trump.",
      },
      {
        id: "sec-q6",
        prompt: "BitLocker is primarily:",
        choices: [
          "Per-file encryption for one document",
          "Full-volume encryption protecting a lost or stolen disk",
          "A Wi-Fi protocol",
          "A Linux package manager",
        ],
        correctIndex: 1,
        explanation:
          "BitLocker encrypts the volume. EFS is the older per-file user encryption feature.",
      },
      {
        id: "sec-q7",
        prompt: "Users should not be local administrators on their PCs because:",
        choices: [
          "Least privilege limits malware and accidental system change",
          "Administrators cannot use Wi-Fi",
          "UAC cannot run for admins",
          "Microsoft forbids admin accounts on Pro",
        ],
        correctIndex: 0,
        explanation:
          "Standard users plus UAC elevation when needed is the model. Broad local admin turns every browser exploit into a system exploit.",
      },
      {
        id: "sec-q8",
        prompt: "A tailgater follows an employee through a badge door. What control failed?",
        choices: [
          "Physical / procedural (no piggybacking, no door holding)",
          "WPA3",
          "RAID 6",
          "DHCP snooping on the laptop",
        ],
        correctIndex: 0,
        explanation:
          "Tailgating is a physical social-engineering problem. Policy and awareness (and turnstiles/mantraps where used) address it.",
      },
      {
        id: "sec-q9",
        prompt: "Which protocol should you avoid for remote CLI on a production router?",
        choices: ["SSH", "Telnet", "HTTPS for the GUI", "SFTP"],
        correctIndex: 1,
        explanation:
          "Telnet is cleartext. SSH (and HTTPS for web GUIs) is the encrypted replacement.",
      },
      {
        id: "sec-q10",
        prompt:
          "You are removing malware from a PC. Why might you temporarily disable System Restore?",
        choices: [
          "Infected restore points can bring the malware back",
          "Restore points replace anti-malware",
          "It increases RAID speed",
          "It unlocks TPM automatically",
        ],
        correctIndex: 0,
        explanation:
          "The exam still expects this: wipe or disable poisoned restore points so “undo” does not undelete the infection. Then rebuild protection.",
      },
    ],
  },
  {
    id: "software-troubleshooting-quiz",
    domainId: "software-troubleshooting",
    title: "Software troubleshooting",
    questions: [
      {
        id: "sw-q1",
        prompt:
          "A BSOD after a GPU driver update names nvlddmkm.sys. Safe Mode works. What should you do?",
        choices: [
          "Roll back or uninstall the GPU driver, then install a known-good version",
          "Replace the PSU immediately",
          "Disable the NIC permanently",
          "Initialize the disk as MBR",
        ],
        correctIndex: 0,
        explanation:
          "A named .sys plus a working Safe Mode is a driver regression. Roll back first; hardware is a later theory.",
      },
      {
        id: "sw-q2",
        prompt: "Windows fails to boot after a cumulative update. Which WinRE option is the least destructive first try?",
        choices: [
          "Uninstall Updates or Startup Repair / System Restore",
          "diskpart clean all",
          "Reset this PC without asking",
          "Re-flash the GPU",
        ],
        correctIndex: 0,
        explanation:
          "WinRE can uninstall the last quality/feature update or run Startup Repair. Cleaning the disk is a last resort.",
      },
      {
        id: "sw-q3",
        prompt:
          "Outlook crashes only for one user on a shared PC. Other accounts are fine. Where do you look first?",
        choices: [
          "That user’s profile / AppData / add-ins",
          "The system board",
          "The core switch",
          "The CMOS battery",
        ],
        correctIndex: 0,
        explanation:
          "One-user failures are profile or per-user configuration. Machine-wide issues hit everyone.",
      },
      {
        id: "sw-q4",
        prompt: "Every HTTPS site complains the certificate is not yet valid. What is the simple check?",
        choices: [
          "The system clock/date (and CMOS battery if it will not stick)",
          "Reinstall Chrome from a random blog",
          "Disable TLS 1.2 forever",
          "Delete the EFI partition",
        ],
        correctIndex: 0,
        explanation:
          "A wrong clock makes valid certs look not-yet-valid or expired. Fix time before you chase malware or CA stores.",
      },
      {
        id: "sw-q5",
        prompt: "The print queue is stuck for every job. The printer is healthy. What is a standard Windows fix?",
        choices: [
          "Stop the Print Spooler, clear System32\\spool\\PRINTERS, start the spooler",
          "Replace the fuser",
          "Change the default gateway",
          "Enable WEP",
        ],
        correctIndex: 0,
        explanation:
          "A haunted spooler is a software queue problem. Clearing the spool directory is the classic repair.",
      },
      {
        id: "sw-q6",
        prompt: "A PC is slow only after login. Task Manager shows many startup entries. What is a fair first cleanup?",
        choices: [
          "Disable unneeded startup apps and check disk free space",
          "Replace the motherboard",
          "Set a static APIPA address",
          "Turn off Secure Boot to go faster",
        ],
        correctIndex: 0,
        explanation:
          "Login slowness is often startup pile-up or a nearly full disk — not a new motherboard.",
      },
      {
        id: "sw-q7",
        prompt: "An iPhone update fails near the end. Storage shows 1 GB free. What should you do?",
        choices: [
          "Free space (and keep it on power), then retry; use official recovery if it is already stuck",
          "Install a random IPSW from a forum on a café PC",
          "Disable Find My and throw the phone",
          "Convert the phone to NTFS",
        ],
        correctIndex: 0,
        explanation:
          "OS updates need headroom. Official recovery/DFU is the documented salvage path, not random files.",
      },
      {
        id: "sw-q8",
        prompt: "Which tool is the first place to see why an application died at 02:14?",
        choices: [
          "Event Viewer (Application log)",
          "Disk Defragmenter",
          "Character Map",
          "The BIOS splash screen",
        ],
        correctIndex: 0,
        explanation:
          "The Application log records crash buckets and .NET/service errors with timestamps.",
      },
      {
        id: "sw-q9",
        prompt: "Safe Mode also bluescreens. What does that suggest compared with a Safe Mode success?",
        choices: [
          "A deeper problem: disk, memory, or core system files — not just a third-party driver",
          "The user must enable Airplane mode",
          "DHCP is down",
          "The monitor cable is VGA",
        ],
        correctIndex: 0,
        explanation:
          "Safe Mode success implicates extra drivers/startup. Safe Mode failure implicates storage, RAM, or the OS core.",
      },
      {
        id: "sw-q10",
        prompt:
          "A browser opens to a strange search portal and extra toolbars after a “free PDF converter.” What is this?",
        choices: [
          "Likely PUP/adware — remove the programs and extensions, reset the browser, then scan",
          "A successful RAID rebuild",
          "Normal Group Policy",
          "A CMOS failure",
        ],
        correctIndex: 0,
        explanation:
          "Free converters are a common PUP vector. Treat it as unwanted software: Programs and Features, extensions, browser reset, then a real scan.",
      },
    ],
  },
  {
    id: "operational-procedures-quiz",
    domainId: "operational-procedures",
    title: "Operational procedures",
    questions: [
      {
        id: "op-q1",
        prompt: "A PSU smells burnt. What is the safe action?",
        choices: [
          "Open the PSU and replace the capacitor you think is bad",
          "Replace the entire PSU; do not service the interior",
          "Bypass the PSU with a paperclip long-term",
          "Pour water on it to cool the rails",
        ],
        correctIndex: 1,
        explanation:
          "PSUs are not field-repairable. Lethal voltage can remain. Swap the unit.",
      },
      {
        id: "op-q2",
        prompt: "When should you wear an ESD wrist strap?",
        choices: [
          "While the PC is plugged in and powered, clipped to the live chassis screw",
          "While handling boards/RAM, clipped to ground, with the system unplugged as the vendor directs",
          "Never; ESD is a myth",
          "Only when flashing BIOS",
        ],
        correctIndex: 1,
        explanation:
          "Straps ground you to the same potential as the gear. Do not wear one as your only plan on an energized system.",
      },
      {
        id: "op-q3",
        prompt: "What belongs in a change request before you patch a production file server?",
        choices: [
          "Reason, risk, rollback, schedule, and approval",
          "Only the technician’s first name",
          "A screenshot of the wallpaper",
          "The user’s favorite color",
        ],
        correctIndex: 0,
        explanation:
          "Change control exists so production is not a hobby lab. Rollback is mandatory, not optional.",
      },
      {
        id: "op-q4",
        prompt: "Which backup type copies only changes since the last backup of any kind?",
        choices: ["Full", "Differential", "Incremental", "RAID 1"],
        correctIndex: 2,
        explanation:
          "Incremental = since last incremental or full. Differential = since last full. RAID is not a backup type.",
      },
      {
        id: "op-q5",
        prompt: "Why is a tested restore part of a backup strategy?",
        choices: [
          "Untested backups fail silently — media, permissions, or encryption keys may be wrong",
          "Restores disable antivirus",
          "CompTIA requires daily paper printouts",
          "Restores replace change management",
        ],
        correctIndex: 0,
        explanation:
          "A backup you have never restored is a theory. Test restores prove the data and the process.",
      },
      {
        id: "op-q6",
        prompt: "A surge strip vs. a UPS — which statement is true?",
        choices: [
          "They are identical",
          "A UPS provides battery runtime (and usually better conditioning); a surge strip does not",
          "A surge strip can run a server for 20 minutes",
          "A UPS removes the need for grounding",
        ],
        correctIndex: 1,
        explanation:
          "UPS = ride-through and orderly shutdown. Surge protection alone is not runtime.",
      },
      {
        id: "op-q7",
        prompt: "A remote-support session should always include:",
        choices: [
          "User consent and a clear end to the session",
          "Silent access overnight",
          "A request for the user’s password in email",
          "Disabled logging",
        ],
        correctIndex: 0,
        explanation:
          "Consent, professionalism, and a visible disconnect. Password collection in email is a separate incident.",
      },
      {
        id: "op-q8",
        prompt: "How should a swollen Li-ion laptop battery be handled?",
        choices: [
          "Flex the case flat and keep using it",
          "Puncture it to vent gas",
          "Power down, do not crush, isolate, and dispose through a proper hazardous channel",
          "Put it in household trash in a plastic bag",
        ],
        correctIndex: 2,
        explanation:
          "Swollen packs are a fire/chemical hazard. No puncture, no trash can, no “just one more day.”",
      },
      {
        id: "op-q9",
        prompt: "A good ticket resolution note should:",
        choices: [
          "Say “fixed” only",
          "Include the cause, the steps that worked, and anything the next tech should know",
          "Blame the user in slang",
          "List the technician’s lunch order",
        ],
        correctIndex: 1,
        explanation:
          "Searchable, factual close notes are how a service desk scales. “Fixed” teaches no one.",
      },
      {
        id: "op-q10",
        prompt: "The 3-2-1 backup idea is:",
        choices: [
          "3 copies, 2 different media, 1 offsite/offline",
          "3 RAIDs, 2 PSUs, 1 switch",
          "3 passwords, 2 usernames, 1 biometric",
          "3 VLANs, 2 SSIDs, 1 guest",
        ],
        correctIndex: 0,
        explanation:
          "Multiple copies, multiple media, and something that survives the building (or the ransomware wave).",
      },
    ],
  },
];

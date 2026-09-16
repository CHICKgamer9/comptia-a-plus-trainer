import type { Scenario } from "../types";

export const osSecurityScenarios: Scenario[] = [
  {
    id: "bsod-driver",
    title: "BSOD after yesterday’s GPU driver",
    ticketId: "TCK-15090",
    requester: "Chris Adeyemi · Design",
    location: "Studio · WS-D03",
    priority: "High",
    exam: "220-1102",
    theme: "os",
    domainIds: ["software-troubleshooting", "operating-systems"],
    difficulty: "medium",
    minutes: 9,
    summary: "GeForce installer last night. nvlddmkm.sys this morning.",
    ticket:
      "Chris installed a “studio driver” from a vendor site at 11 p.m. This morning the workstation bluescreens on login. The dump mentions nvlddmkm.sys. Safe Mode (minimal) reaches the desktop. The card still fans up. He needs Premiere this afternoon.",
    steps: [
      {
        id: "bs-g",
        phase: "gather",
        title: "Gather information",
        prompt: "Which facts already pick a theory?",
        findings:
          "Reliability Monitor shows the driver install at 23:08. Event Viewer has BugCheck with the NVIDIA sys file. Safe Mode works. A second monitor on HDMI also dies in normal boot — not a single-cable issue.",
        choices: [
          {
            id: "a",
            label: "Last change was a GPU driver, the dump names the vendor .sys, and Safe Mode works — treat it as a driver regression",
            correct: true,
            feedback:
              "Correct. That trio is the exam’s favorite software-vs-hardware split.",
          },
          {
            id: "b",
            label: "Replace the PSU first because GPUs always kill power",
            correct: false,
            feedback:
              "Possible in other tickets. Safe Mode success argues software.",
          },
          {
            id: "c",
            label: "Reimage before you read the dump",
            correct: false,
            feedback:
              "You can get Premiere back in 20 minutes with a rollback. Do not skip identify.",
          },
          {
            id: "d",
            label: "Disable the NIC so the BSOD cannot phone home",
            correct: false,
            feedback:
              "Unrelated.",
          },
        ],
      },
      {
        id: "bs-t",
        phase: "tools",
        title: "Choose tests",
        prompt: "Where do you actually click?",
        findings:
          "Device Manager → Display adapters → Roll Back Driver succeeds. Normal boot holds through a 10-minute timeline scrub. DDU is unnecessary this time.",
        choices: [
          {
            id: "a",
            label: "WinRE / Safe Mode → Device Manager roll back (or vendor clean uninstall), then boot normally and open Premiere",
            correct: true,
            feedback:
              "Correct. Test the theory with the inbox rollback first.",
          },
          {
            id: "b",
            label: "diskpart clean the Premiere project drive",
            correct: false,
            feedback:
              "That is how you become the incident.",
          },
          {
            id: "c",
            label: "MemTest for eight hours before any rollback",
            correct: false,
            feedback:
              "RAM tests are a later theory if rollback fails.",
          },
          {
            id: "d",
            label: "Enable Hyper-V to “sandbox the GPU”",
            correct: false,
            feedback:
              "That will not unbreak a kernel driver.",
          },
        ],
      },
      {
        id: "bs-c",
        phase: "cause",
        title: "Name the root cause",
        prompt: "What crashed the box?",
        choices: [
          {
            id: "a",
            label: "A faulty GPU driver build interacting with the card — not a dead GPU",
            correct: true,
            feedback:
              "Correct. Hardware that works in Safe Mode and after rollback is exonerated.",
          },
          {
            id: "b",
            label: "Corrupt Outlook OST",
            correct: false,
            feedback:
              "OST files do not load nvlddmkm.sys.",
          },
          {
            id: "c",
            label: "DNS",
            correct: false,
            feedback:
              "Not a bugcheck source here.",
          },
          {
            id: "d",
            label: "The CMOS battery",
            correct: false,
            feedback:
              "Would not name a GPU sys file.",
          },
        ],
      },
      {
        id: "bs-f",
        phase: "fix",
        title: "Apply the fix",
        prompt: "How do you close without a repeat tonight?",
        choices: [
          {
            id: "a",
            label:
              "Leave the last known-good driver, verify Premiere, pause Windows optional driver updates if they pushed it, document the bad version",
            correct: true,
            feedback:
              "Correct. Preventative: stop the same package from sneaking back via optional updates. Write the version numbers.",
          },
          {
            id: "b",
            label: "Install last night’s driver again “to confirm” on a production box",
            correct: false,
            feedback:
              "You already confirmed. Do not burn the afternoon.",
          },
          {
            id: "c",
            label: "Give Chris local admin and a link to random driver packs",
            correct: false,
            feedback:
              "That is how you get this ticket weekly.",
          },
          {
            id: "d",
            label: "Disable Secure Boot so “drivers load easier”",
            correct: false,
            feedback:
              "Wrong control, new security hole.",
          },
        ],
      },
    ],
    debrief:
      "Named .sys + last change + Safe Mode = roll back the driver. Verify the user’s real app. Then keep Windows from “helping” with the same optional package. Reimaging is a last resort, not a personality.",
  },
  {
    id: "boot-failure",
    title: "Windows update, then “Recovery” loop",
    ticketId: "TCK-15221",
    requester: "Amina Shah · HR",
    location: "Bldg A · HR-07",
    priority: "High",
    exam: "220-1102",
    theme: "os",
    domainIds: ["software-troubleshooting", "operating-systems"],
    difficulty: "medium",
    minutes: 10,
    summary: "Last night’s cumulative update never finished. WinRE every boot.",
    ticket:
      "Amina shut the lid during a “do not turn off” update (she had to catch a bus). This morning: Automatic Repair, then a Recovery screen. BitLocker is on; she has the recovery key in her password manager. Files matter. She does not want Reset this PC yet.",
    steps: [
      {
        id: "bf-g",
        phase: "gather",
        title: "Gather information",
        prompt: "What must you collect before you click anything destructive?",
        findings:
          "WinRE opens after the key. Startup Repair already ran once and failed. The disk is visible in diskpart. A recent restore point exists from before the update. She confirms a OneDrive sync from yesterday afternoon.",
        choices: [
          {
            id: "a",
            label: "Confirm BitLocker key, last successful boot, whether files are backed up, and which WinRE options already failed",
            correct: true,
            feedback:
              "Correct. Identify includes backup posture and what was already tried.",
          },
          {
            id: "b",
            label: "diskpart clean all immediately to “start honest”",
            correct: false,
            feedback:
              "She asked not to reset, and you have less invasive options.",
          },
          {
            id: "c",
            label: "Guess the BitLocker PIN until it works",
            correct: false,
            feedback:
              "You already have a recovery key path. Do not lock the TPM further.",
          },
          {
            id: "d",
            label: "Replace the SSD because updates never fail software",
            correct: false,
            feedback:
              "Interrupted updates are a common software ticket.",
          },
        ],
      },
      {
        id: "bf-t",
        phase: "tools",
        title: "Choose tests",
        prompt: "Least destructive WinRE path?",
        findings:
          "Uninstall Updates (quality) completes. The PC boots to Windows. A second reboot is clean. Windows Update is paused until you can finish the patch on power.",
        choices: [
          {
            id: "a",
            label: "Uninstall Updates and/or System Restore; only then Startup Repair or bootrec; Reset last",
            correct: true,
            feedback:
              "Correct. The methodology wants the smallest hammer that matches the last change (the CU).",
          },
          {
            id: "b",
            label: "Reset this PC → Remove everything as step one",
            correct: false,
            feedback:
              "Valid later. Not first when Restore/Uninstall exists.",
          },
          {
            id: "c",
            label: "flash the BIOS from WinRE",
            correct: false,
            feedback:
              "Unrelated risk.",
          },
          {
            id: "d",
            label: "Format the EFI partition in diskpart to be helpful",
            correct: false,
            feedback:
              "That is how you turn a repair into a rebuild.",
          },
        ],
      },
      {
        id: "bf-c",
        phase: "cause",
        title: "Name the root cause",
        prompt: "Why Recovery?",
        choices: [
          {
            id: "a",
            label: "An interrupted cumulative update left Windows unable to complete boot — not a dead disk",
            correct: true,
            feedback:
              "Correct. Lid-close during “do not turn off” is the smoking gun. The disk was still visible.",
          },
          {
            id: "b",
            label: "A failed DIMM",
            correct: false,
            feedback:
              "Possible in other dumps. Uninstall Updates would not have cured a DIMM.",
          },
          {
            id: "c",
            label: "Wrong VLAN",
            correct: false,
            feedback:
              "She never reached a logon network yet.",
          },
          {
            id: "d",
            label: "Corrupt print spooler",
            correct: false,
            feedback:
              "Spoolers do not trap you in WinRE.",
          },
        ],
      },
      {
        id: "bf-f",
        phase: "fix",
        title: "Apply the fix",
        prompt: "How do you finish like a professional?",
        choices: [
          {
            id: "a",
            label:
              "Confirm her desktop and HR apps, keep the PC on AC, retry Windows Update, remind her lids still sleep mid-patch, document the uninstall",
            correct: true,
            feedback:
              "Correct. Verify full function, then complete the patch under controlled power. Educate without a lecture.",
          },
          {
            id: "b",
            label: "Leave Update paused forever so this “cannot happen”",
            correct: false,
            feedback:
              "You traded one incident for a year of missing security fixes.",
          },
          {
            id: "c",
            label: "Turn off BitLocker so WinRE is easier next time",
            correct: false,
            feedback:
              "Do not weaken disk encryption for convenience.",
          },
          {
            id: "d",
            label: "Delete the recovery partition as cleanup",
            correct: false,
            feedback:
              "That is how the next failure has no WinRE.",
          },
        ],
      },
    ],
    debrief:
      "WinRE order of operations: key, backups, uninstall/restore, repair tools, then reset. Interrupted updates look like “dead Windows” and often are not. Never diskpart clean because you are in a hurry.",
  },
  {
    id: "slow-pc",
    title: "PC “got old” after a semester of browsers",
    ticketId: "TCK-15503",
    requester: "Tyler Brooks · Intern",
    location: "Hot desk · HD-12",
    priority: "Low",
    exam: "220-1102",
    theme: "os",
    domainIds: ["software-troubleshooting", "operating-systems"],
    difficulty: "easy",
    minutes: 8,
    summary: "Five-minute logons, disk at 99%, 4 GB free.",
    ticket:
      "Tyler says the hot-desk PC is unusable. Logon takes minutes. Teams hangs. He installed three “free video converters” last month. Task Manager shows Disk 99% and Startup with 14 items. C: has 4 GB free on a 256 GB drive. No odd BSODs.",
    steps: [
      {
        id: "sl-g",
        phase: "gather",
        title: "Gather information",
        prompt: "What do you measure before you buy RAM?",
        findings:
          "Startup impact is High on several unknown publishers. Storage Sense shows a 40 GB Users\\Downloads pile and a full Recycle Bin. Resource Monitor points at Windows Search and a converter updater, not a dying SMART disk.",
        choices: [
          {
            id: "a",
            label: "Task Manager Startup + disk free space + SMART/Resource Monitor — split software pile-up from a dying disk",
            correct: true,
            feedback:
              "Correct. A full disk and a parade of startup apps explain this better than “needs 64 GB of RAM.”",
          },
          {
            id: "b",
            label: "Order a motherboard because slowness is always northbridge",
            correct: false,
            feedback:
              "Not at 4 GB free.",
          },
          {
            id: "c",
            label: "Disable the Ethernet adapter to speed up logon",
            correct: false,
            feedback:
              "That only adds a new ticket.",
          },
          {
            id: "d",
            label: "Assume ransomware because converters exist",
            correct: false,
            feedback:
              "Look, but the symptoms here are space and startup — not a ransom note.",
          },
        ],
      },
      {
        id: "sl-t",
        phase: "tools",
        title: "Choose tests",
        prompt: "Which cleanup is actually diagnostic?",
        findings:
          "After emptying junk, uninstalling the converters, and disabling unused startup items, logon is 25 seconds and Disk idle is normal. A quick malware scan is clean.",
        choices: [
          {
            id: "a",
            label: "Uninstall PUPs, clear space, disable junk startup, then time a logon and run a scan",
            correct: true,
            feedback:
              "Correct. You tested the theory and verified the user’s Teams path.",
          },
          {
            id: "b",
            label: "Format C: before you look at Startup",
            correct: false,
            feedback:
              "Hot-desk images should be a last resort after you know what is on the box.",
          },
          {
            id: "c",
            label: "chkdsk /r during Tyler’s stand-up meeting with no warning",
            correct: false,
            feedback:
              "chkdsk has a place. Not as step one on a full-but-healthy SSD, and not without a window.",
          },
          {
            id: "d",
            label: "Enable every visual effect for “smoothness”",
            correct: false,
            feedback:
              "That uses more GPU/CPU, not less disk.",
          },
        ],
      },
      {
        id: "sl-c",
        phase: "cause",
        title: "Name the root cause",
        prompt: "What made it feel ancient?",
        choices: [
          {
            id: "a",
            label: "Nearly full SSD plus PUP/startup pile-up — Windows and Teams were fighting for disk I/O",
            correct: true,
            feedback:
              "Correct. SSDs fall off a cliff when they are packed. Startup amplifiers make logon worse.",
          },
          {
            id: "b",
            label: "Failed RAID 6",
            correct: false,
            feedback:
              "There is no array.",
          },
          {
            id: "c",
            label: "Wrong subnet mask on a working NIC",
            correct: false,
            feedback:
              "He could still open tickets. This was local performance.",
          },
          {
            id: "d",
            label: "A missing CMOS battery",
            correct: false,
            feedback:
              "Would reset the clock, not fill Downloads.",
          },
        ],
      },
      {
        id: "sl-f",
        phase: "fix",
        title: "Apply the fix",
        prompt: "How do you keep the next intern from restuffing it?",
        choices: [
          {
            id: "a",
            label:
              "Leave headroom on C:, standard user (not admin), Storage Sense on, document the removed PUPs, mention the converter sites in the KB",
            correct: true,
            feedback:
              "Correct. Least privilege would have blocked some of those installs. Education + a KB beats another silent reimage.",
          },
          {
            id: "b",
            label: "Give Tyler local admin so he can “keep it tidy himself”",
            correct: false,
            feedback:
              "That is how the converters return tomorrow.",
          },
          {
            id: "c",
            label: "Disable Windows Update to save disk",
            correct: false,
            feedback:
              "Security debt is not disk management.",
          },
          {
            id: "d",
            label: "Move the page file to a USB stick",
            correct: false,
            feedback:
              "A career-limiting performance idea.",
          },
        ],
      },
    ],
    debrief:
      "Slow-PC tickets want numbers: free space, startup list, disk latency, SMART. Full SSDs plus PUPs are more common than bad motherboards. Verify with a timed logon and the user’s real apps.",
  },
  {
    id: "cant-join-domain",
    title: "New hire cannot join the domain",
    ticketId: "TCK-16044",
    requester: "Helpdesk queue · Onboarding",
    location: "HQ · LT-NEW08",
    priority: "High",
    exam: "220-1102",
    theme: "os",
    domainIds: ["operating-systems", "networking"],
    difficulty: "medium",
    minutes: 9,
    summary: "Windows 11 Home, wrong DNS, clock skew — pick the blockers.",
    ticket:
      "IT unboxed a retail laptop for a new hire. System Properties has no “Join a domain” that works. Error when they try from Settings: “Can’t connect to the domain.” ipconfig shows 10.10.40.22 with DNS 8.8.8.8 (they copied a home screenshot). The clock is 18 minutes slow. The DC is dc01.corp.internal.",
    steps: [
      {
        id: "dj-g",
        phase: "gather",
        title: "Gather information",
        prompt: "Which three facts are already on the ticket?",
        findings:
          "winver shows Windows 11 Home. nslookup corp.internal fails (public DNS). w32tm /query /status is off by ~18 minutes. Ethernet link is fine.",
        choices: [
          {
            id: "a",
            label: "SKU (Home vs Pro), DNS that can find the DC, and time — plus a working LAN lease",
            correct: true,
            feedback:
              "Correct. Domain join fails for exactly these boring reasons.",
          },
          {
            id: "b",
            label: "Whether Premiere is installed",
            correct: false,
            feedback:
              "Not an onboarding blocker.",
          },
          {
            id: "c",
            label: "RAID level of the laptop",
            correct: false,
            feedback:
              "There isn’t one.",
          },
          {
            id: "d",
            label: "The user’s favorite browser",
            correct: false,
            feedback:
              "Focus.",
          },
        ],
      },
      {
        id: "dj-t",
        phase: "tools",
        title: "Choose tests",
        prompt: "How do you prove each blocker?",
        findings:
          "After a Pro upgrade (or a Pro image), DNS set to the internal resolvers, and time synced, nltest /dsgetdc:corp.internal succeeds and join works.",
        choices: [
          {
            id: "a",
            label: "winver, nslookup/nltest against the AD DNS name, and w32tm / resync — then retry join",
            correct: true,
            feedback:
              "Correct. Each tool maps to a blocker.",
          },
          {
            id: "b",
            label: "Replace the NIC because join is a hardware feature",
            correct: false,
            feedback:
              "You already have an IP.",
          },
          {
            id: "c",
            label: "Disable TPM so join can proceed",
            correct: false,
            feedback:
              "Opposite of helpful on Windows 11.",
          },
          {
            id: "d",
            label: "Format the disk as MBR to “see the domain better”",
            correct: false,
            feedback:
              "Nonsense.",
          },
        ],
      },
      {
        id: "dj-c",
        phase: "cause",
        title: "Name the root cause",
        prompt: "Why did join fail?",
        choices: [
          {
            id: "a",
            label: "Home edition cannot domain-join, public DNS cannot find the DC, and Kerberos hates the clock skew",
            correct: true,
            feedback:
              "Correct. Any one of those can fail a join. You had all three.",
          },
          {
            id: "b",
            label: "The password was too long",
            correct: false,
            feedback:
              "You never got that far.",
          },
          {
            id: "c",
            label: "RDP was disabled",
            correct: false,
            feedback:
              "RDP is not required to join.",
          },
          {
            id: "d",
            label: "The laptop needed RAID 1",
            correct: false,
            feedback:
              "No.",
          },
        ],
      },
      {
        id: "dj-f",
        phase: "fix",
        title: "Apply the fix",
        prompt: "What is the onboarding-quality close?",
        choices: [
          {
            id: "a",
            label:
              "Image or upgrade to Pro, use corp DNS (or DHCP option 006), sync time, join, gpupdate, confirm a mapped drive / email, document so retail Home SKUs stop hitting the bench",
            correct: true,
            feedback:
              "Correct. Verify Group Policy actually applied — join is not the same as “usable.” Fix procurement so Home does not arrive again.",
          },
          {
            id: "b",
            label: "Leave it on a workgroup and share the Finance folder to Everyone",
            correct: false,
            feedback:
              "Please do not “solve” AD with Everyone.",
          },
          {
            id: "c",
            label: "Hardcode 8.8.8.8 so the internet is “faster” after join",
            correct: false,
            feedback:
              "You would break DC locator again at the next reboot.",
          },
          {
            id: "d",
            label: "Disable the Windows Time service",
            correct: false,
            feedback:
              "Kerberos will haunt you.",
          },
        ],
      },
    ],
    debrief:
      "Domain join is DNS, time, credentials, and edition. winver is a real tool. Public DNS will not find corp.internal. Kerberos tolerates about five minutes of skew, not eighteen. Always gpupdate and open a GPO-delivered resource before you call it done.",
  },
  {
    id: "phishing-email",
    title: "“IT needs your password” in the inbox",
    ticketId: "TCK-17001",
    requester: "Helen Cho · Finance",
    location: "Bldg A · FIN-15",
    priority: "High",
    exam: "220-1102",
    theme: "security",
    domainIds: ["security", "operational-procedures"],
    difficulty: "easy",
    minutes: 8,
    summary: "A lookalike payroll link. She has not clicked Submit — yet.",
    ticket:
      "Helen forwarded an email: “Payroll system upgrade — confirm your password.” The From display name is IT Support. The real address is it-support@payroll-secure-mail.net. The link goes to a lookalike site. She has not entered anything. Two coworkers got the same mail.",
    steps: [
      {
        id: "phish-g",
        phase: "gather",
        title: "Gather information",
        prompt: "What do you establish first?",
        findings:
          "Headers show an external SPF fail. She did not submit the form. She did hover and almost typed. No other malware symptoms on the PC. Distribution was a purchased finance list, not a mailbox breach — so far.",
        choices: [
          {
            id: "a",
            label: "Did anyone enter credentials or click attachments, who else received it, and is this a known-good IT channel?",
            correct: true,
            feedback:
              "Correct. Scope the blast and whether secrets leaked. Real IT does not mail password forms.",
          },
          {
            id: "b",
            label: "Tell her to finish the form so you can “see the error”",
            correct: false,
            feedback:
              "Never complete a phishing form as a test on a real account.",
          },
          {
            id: "c",
            label: "Ignore it because she is in Finance and should know better",
            correct: false,
            feedback:
              "Professionalism: no shaming, and two others are already in the blast radius.",
          },
          {
            id: "d",
            label: "Wipe her PC immediately",
            correct: false,
            feedback:
              "She has not even submitted. Contain the campaign first.",
          },
        ],
      },
      {
        id: "phish-t",
        phase: "tools",
        title: "Choose tests",
        prompt: "What do you actually do in the tenant?",
        findings:
          "Safe Links shows the URL is new. A message trace finds 14 copies. No successful sign-ins from odd countries on Helen’s account. You block the sender and URL at the mail filter.",
        choices: [
          {
            id: "a",
            label: "Trace the message, block sender/URL, check sign-in logs, and do not visit the phish from a domain-joined session",
            correct: true,
            feedback:
              "Correct. Hunt + contain. Use a sandbox if you must detonate a URL.",
          },
          {
            id: "b",
            label: "Open the link on the CFO’s desktop to “check SSL”",
            correct: false,
            feedback:
              "Do not browse malware on a privileged workstation.",
          },
          {
            id: "c",
            label: "Email the password form to all staff as a warning with the live link intact",
            correct: false,
            feedback:
              "That is how you phish them a second time.",
          },
          {
            id: "d",
            label: "Disable the entire mail gateway",
            correct: false,
            feedback:
              "Containment should be proportional.",
          },
        ],
      },
      {
        id: "phish-c",
        phase: "cause",
        title: "Name the root cause",
        prompt: "What kind of incident is this?",
        choices: [
          {
            id: "a",
            label: "External phishing / social engineering — lookalike domain, password harvest, not a server outage",
            correct: true,
            feedback:
              "Correct. The payload is deception. No malware required.",
          },
          {
            id: "b",
            label: "A failed RAID on the mail server",
            correct: false,
            feedback:
              "The mail delivered. The content is the problem.",
          },
          {
            id: "c",
            label: "Helen’s CMOS battery",
            correct: false,
            feedback:
              "No.",
          },
          {
            id: "d",
            label: "WEP on the Wi-Fi",
            correct: false,
            feedback:
              "Unrelated.",
          },
        ],
      },
      {
        id: "phish-f",
        phase: "fix",
        title: "Apply the fix",
        prompt: "How do you close this like a security-aware desk?",
        choices: [
          {
            id: "a",
            label:
              "Thank Helen, block and purge the campaign, watch sign-ins, send a screenshot-based warning, and file a KB on “IT will never ask for your password”",
            correct: true,
            feedback:
              "Correct. Reward the report. Educate the rest. Keep an eye on credentials even though she says she did not submit.",
          },
          {
            id: "b",
            label: "Write her up for almost getting phished",
            correct: false,
            feedback:
              "That trains people to hide the next one.",
          },
          {
            id: "c",
            label: "Do nothing because nobody clicked",
            correct: false,
            feedback:
              "Fourteen mailboxes still have a live lure.",
          },
          {
            id: "d",
            label: "Reset every password in the company without notice",
            correct: false,
            feedback:
              "Mass resets have a place in a confirmed breach, not as a first reflex here.",
          },
        ],
      },
    ],
    debrief:
      "Phishing tickets are scope, contain, and culture. Hover the address, not the display name. Real IT never needs the user’s password. Thank reporters. Block at the gateway. Check sign-in logs anyway — people misremember clicks.",
  },
  {
    id: "malware-popup",
    title: "Fullscreen “call this number or lose Windows”",
    ticketId: "TCK-17240",
    requester: "Owen Blake · Warehouse office",
    location: "Dock office · PC-WH02",
    priority: "High",
    exam: "220-1102",
    theme: "security",
    domainIds: ["security", "software-troubleshooting"],
    difficulty: "medium",
    minutes: 10,
    summary: "Scareware in the browser plus a leftover PUP. Isolate first.",
    ticket:
      "Owen’s PC is locked on a fullscreen page: “Virus detected — call +1-555-0144.” The taskbar is gone. He already called the number; the person asked for AnyDesk. He hung up when they demanded a gift card. The PC is still on the warehouse VLAN with a mapped drive to shipping docs.",
    steps: [
      {
        id: "mw-g",
        phase: "gather",
        title: "Gather information",
        prompt: "First move?",
        findings:
          "You pull the Ethernet. Wi-Fi is off. He did not install AnyDesk. No ransom extensions on the shipping share (yet). The “lock” is Chrome kiosk-like; Ctrl+Shift+Esc still opens Task Manager.",
        choices: [
          {
            id: "a",
            label: "Isolate from the network immediately, then ask what he ran and whether AnyDesk/credentials were given",
            correct: true,
            feedback:
              "Correct. Containment before forensics. The share next door is why you pull the cable first.",
          },
          {
            id: "b",
            label: "Call the number back to negotiate",
            correct: false,
            feedback:
              "That is the scam. Never re-engage.",
          },
          {
            id: "c",
            label: "Keep it online so Windows Update can fight the page",
            correct: false,
            feedback:
              "If anything else is on that box, you are still sharing a VLAN.",
          },
          {
            id: "d",
            label: "Pay a gift card “just in case”",
            correct: false,
            feedback:
              "Never.",
          },
        ],
      },
      {
        id: "mw-t",
        phase: "tools",
        title: "Choose tests",
        prompt: "How do you regain a desktop safely?",
        findings:
          "Task Manager kills Chrome. The page does not return at next launch after you reset the browser and remove a “PC Cleaner Pro” PUP. Defender offline scan is clean. Share ACLs unchanged. You still rotate his password because he started the call.",
        choices: [
          {
            id: "a",
            label: "Task Manager / Safe Mode, reset browser, remove PUPs, offline scan, check shares — then decide wipe vs. clean",
            correct: true,
            feedback:
              "Correct. Scareware is often a page + PUP, but you still scan and consider a rebuild if trust is gone.",
          },
          {
            id: "b",
            label: "Install the AnyDesk build the caller emailed “to finish removal”",
            correct: false,
            feedback:
              "That is the second stage of the scam.",
          },
          {
            id: "c",
            label: "Disable the firewall so the page can update",
            correct: false,
            feedback:
              "No.",
          },
          {
            id: "d",
            label: "Format the shipping file server as a precaution",
            correct: false,
            feedback:
              "You have no evidence the share was encrypted. Do not create a warehouse outage.",
          },
        ],
      },
      {
        id: "mw-c",
        phase: "cause",
        title: "Name the root cause",
        prompt: "What happened here?",
        choices: [
          {
            id: "a",
            label: "Browser scareware / tech-support scam, likely delivered via a PUP or malicious ad — social engineering, not a real Windows license court",
            correct: true,
            feedback:
              "Correct. The gift-card ask is the tell. The fullscreen page is theater.",
          },
          {
            id: "b",
            label: "Microsoft really revoked Windows until he pays",
            correct: false,
            feedback:
              "Microsoft does not collect gift cards on a 555 number.",
          },
          {
            id: "c",
            label: "A failed print fuser",
            correct: false,
            feedback:
              "Different ticket.",
          },
          {
            id: "d",
            label: "APIPA",
            correct: false,
            feedback:
              "He was on a mapped drive. Not APIPA.",
          },
        ],
      },
      {
        id: "mw-f",
        phase: "fix",
        title: "Apply the fix",
        prompt: "What does a complete close include?",
        choices: [
          {
            id: "a",
            label:
              "Clean or rebuild, rotate passwords, confirm the share is untouched, educate about gift-card IT, document indicators, and thank him for hanging up",
            correct: true,
            feedback:
              "Correct. Technical clean + identity hygiene + education. Reward the hang-up so the next person does it sooner.",
          },
          {
            id: "b",
            label: "Leave Chrome fullscreen so he “remembers the lesson”",
            correct: false,
            feedback:
              "Cruel and unprofessional.",
          },
          {
            id: "c",
            label: "Give the warehouse the scammer’s number as a joke",
            correct: false,
            feedback:
              "Do not redistribute the lure.",
          },
          {
            id: "d",
            label: "Disable Defender so pop-ups “have less to fight”",
            correct: false,
            feedback:
              "The opposite of a close.",
          },
        ],
      },
    ],
    debrief:
      "Scareware is social engineering wearing a browser. Isolate first because the next desk has the shipping share. Kill the browser, remove PUPs, scan, and rotate credentials if a human conversation started. Never install the caller’s remote tool. Never pay.",
  },
  {
    id: "vpn-wont-connect",
    title: "VPN connects, then no file server",
    ticketId: "TCK-17610",
    requester: "Rita Alvarez · Counsel",
    location: "Remote home office",
    priority: "Medium",
    exam: "220-1102",
    theme: "network",
    domainIds: ["operating-systems", "networking"],
    difficulty: "hard",
    minutes: 10,
    summary: "Tunnel is up. Drive maps fail. Split-brain DNS and a stale route.",
    ticket:
      "Rita’s always-on VPN shows Connected. Outlook works (it is Microsoft 365). \\\\files01\\Legal says “network path was not found.” At the office it works. She recently installed a “gamer VPN” trial. ipconfig shows two adapters with 10.0.0.0/8 routes fighting. The corp VPN should win files01.corp.internal.",
    steps: [
      {
        id: "vpn-g",
        phase: "gather",
        title: "Gather information",
        prompt: "What do you separate immediately?",
        findings:
          "The corporate client is Connected. A consumer VPN adapter is also Connected. nslookup files01.corp.internal from her PC returns a public CDN address. From a clean PC on corp VPN it returns 10.10.8.20.",
        choices: [
          {
            id: "a",
            label: "SaaS vs. internal name resolution vs. extra VPN adapters — Outlook working does not mean the tunnel owns DNS",
            correct: true,
            feedback:
              "Correct. Cloud mail is a terrible health check for on-prem SMB.",
          },
          {
            id: "b",
            label: "Replace her home router because all VPNs need new NAT hardware",
            correct: false,
            feedback:
              "Possible later. You already see two tunnels and bad DNS.",
          },
          {
            id: "c",
            label: "Reimage before ipconfig",
            correct: false,
            feedback:
              "Collect first.",
          },
          {
            id: "d",
            label: "Enable SMBv1 to “see” the server",
            correct: false,
            feedback:
              "Do not solve DNS with a 20-year-old protocol.",
          },
        ],
      },
      {
        id: "vpn-t",
        phase: "tools",
        title: "Choose tests",
        prompt: "Which commands settle the argument?",
        findings:
          "route print shows 0.0.0.0 and 10.0.0.0/8 via the gamer VPN. After you disconnect and uninstall it, nslookup hits the corp DNS suffix and \\\\files01\\Legal opens. gpupdate brings the map back.",
        choices: [
          {
            id: "a",
            label: "ipconfig /all, nslookup the internal FQDN, route print, then remove the extra VPN and retest the share",
            correct: true,
            feedback:
              "Correct. DNS + routes are the two usual split-tunnel killers.",
          },
          {
            id: "b",
            label: "chkdsk on files01 from her laptop",
            correct: false,
            feedback:
              "You cannot even find the path yet — and you should not chkdsk a server from a hunch.",
          },
          {
            id: "c",
            label: "Turn off her home Wi-Fi encryption",
            correct: false,
            feedback:
              "Unrelated and unsafe.",
          },
          {
            id: "d",
            label: "Delete her Outlook profile",
            correct: false,
            feedback:
              "Mail was the one thing working.",
          },
        ],
      },
      {
        id: "vpn-c",
        phase: "cause",
        title: "Name the root cause",
        prompt: "Why no Legal share?",
        choices: [
          {
            id: "a",
            label: "A consumer VPN stole routes and DNS, so files01 resolved (and routed) incorrectly",
            correct: true,
            feedback:
              "Correct. Two VPNs is how you get a connected icon and a dead drive letter.",
          },
          {
            id: "b",
            label: "The file server’s RAID 5 failed at the exact moment she left the building",
            correct: false,
            feedback:
              "Office users still work. Her resolution is the delta.",
          },
          {
            id: "c",
            label: "BitLocker on C: blocks SMB",
            correct: false,
            feedback:
              "It does not.",
          },
          {
            id: "d",
            label: "She needs IPv6 disabled globally",
            correct: false,
            feedback:
              "Not the first theory when a second VPN adapter is sitting there.",
          },
        ],
      },
      {
        id: "vpn-f",
        phase: "fix",
        title: "Apply the fix",
        prompt: "How do you prevent Counsel from installing another “faster internet” client?",
        choices: [
          {
            id: "a",
            label:
              "Remove the trial VPN, confirm the map and a file open, gpupdate, and publish a “one corporate VPN only” note — consider AppLocker/MDM if this keeps happening",
            correct: true,
            feedback:
              "Correct. Verify the actual share. Then policy, not hope.",
          },
          {
            id: "b",
            label: "Add the gamer VPN to the standard image so everyone matches",
            correct: false,
            feedback:
              "Absolutely not.",
          },
          {
            id: "c",
            label: "Put files01 on the public internet without MFA",
            correct: false,
            feedback:
              "That is a new incident.",
          },
          {
            id: "d",
            label: "Tell her to only work in the office",
            correct: false,
            feedback:
              "Counsel will not love that close note.",
          },
        ],
      },
    ],
    debrief:
      "Connected ≠ working. Test the internal name, the route, and the share. Consumer VPNs and “faster DNS” apps break split-horizon and split-tunnel designs. Outlook on M365 will happily lie to you about the health of on-prem resources.",
  },
  {
    id: "mapped-drive",
    title: "Mapped drive says Access Denied after a move",
    ticketId: "TCK-17880",
    requester: "Devon Price · Marketing",
    location: "Bldg C · MKT-21",
    priority: "Medium",
    exam: "220-1102",
    theme: "os",
    domainIds: ["operating-systems", "security"],
    difficulty: "medium",
    minutes: 9,
    summary: "Share vs. NTFS after a folder move. Everyone else works.",
    ticket:
      "Devon’s S: drive (\\\\files01\\Marketing) opened yesterday. Today: Access Denied. He was added to a project and an admin “moved” his working folder from a user share into the Marketing share. Other marketers open S:. He can ping files01. He is not a local admin (good).",
    steps: [
      {
        id: "map-g",
        phase: "gather",
        title: "Gather information",
        prompt: "What isolate matters?",
        findings:
          "Same PC, same map, new folder. Effective Access for Devon on the new folder is Read on the share and Deny on a leftover NTFS ACE from the old location. Other users have Modify.",
        choices: [
          {
            id: "a",
            label: "One user vs. the rest of the group, same share, after a move — look at NTFS ACLs / Effective Access, not the NIC",
            correct: true,
            feedback:
              "Correct. Moves can carry ACLs. Copies often inherit. This is a permissions ticket.",
          },
          {
            id: "b",
            label: "Replace his Ethernet dock",
            correct: false,
            feedback:
              "He can ping the server. Others on the same map work.",
          },
          {
            id: "c",
            label: "Reinstall Office",
            correct: false,
            feedback:
              "Explorer is the app failing, and it is an ACE, not Word.",
          },
          {
            id: "d",
            label: "Disable his account to reset permissions",
            correct: false,
            feedback:
              "That adds a lockout to an access problem.",
          },
        ],
      },
      {
        id: "map-t",
        phase: "tools",
        title: "Choose tests",
        prompt: "Which Windows tools tell the truth?",
        findings:
          "icacls and the Effective Access tab show an explicit Deny inherited from the old parent. Removing that Deny (with change control) and granting the Marketing Modify group lets him write. Share permission was already Change.",
        choices: [
          {
            id: "a",
            label: "Effective Access / icacls on the folder, compare share vs. NTFS, fix the ACE, then reopen S:",
            correct: true,
            feedback:
              "Correct. The exam line: most restrictive wins; Deny wins.",
          },
          {
            id: "b",
            label: "gpresult only, then leave",
            correct: false,
            feedback:
              "Useful if the map were missing. He has a map and a Deny.",
          },
          {
            id: "c",
            label: "Format files01",
            correct: false,
            feedback:
              "Career-limiting.",
          },
          {
            id: "d",
            label: "Turn off the firewall on the file server",
            correct: false,
            feedback:
              "Access Denied is NTFS, not a blocked ping.",
          },
        ],
      },
      {
        id: "map-c",
        phase: "cause",
        title: "Name the root cause",
        prompt: "Why Devon only?",
        choices: [
          {
            id: "a",
            label: "A move carried an explicit NTFS Deny; share permissions were never the blocker",
            correct: true,
            feedback:
              "Correct. The rest of Marketing never had that ACE.",
          },
          {
            id: "b",
            label: "The share permission was Read and NTFS was Full — so he should have Full",
            correct: false,
            feedback:
              "That math is backwards, and the facts were Deny + Change.",
          },
          {
            id: "c",
            label: "SMB signing was off",
            correct: false,
            feedback:
              "That would not single him out after a folder move.",
          },
          {
            id: "d",
            label: "His password expired mid-map",
            correct: false,
            feedback:
              "You would see a credential prompt, not a surgical Deny on one folder.",
          },
        ],
      },
      {
        id: "map-f",
        phase: "fix",
        title: "Apply the fix",
        prompt: "How do you leave the share healthier?",
        choices: [
          {
            id: "a",
            label:
              "Remove the stray Deny, grant the group (not a one-off user ACE if you can help it), have Devon create a test file, document that moves need ACL review",
            correct: true,
            feedback:
              "Correct. Prefer group grants. Verify with a write. Teach the admin who moved the folder.",
          },
          {
            id: "b",
            label: "Add Everyone: Full Control to stop tickets",
            correct: false,
            feedback:
              "That is how Finance’s forecast lands on TikTok.",
          },
          {
            id: "c",
            label: "Give Devon Domain Admin so he can always write",
            correct: false,
            feedback:
              "Least privilege exists for this moment.",
          },
          {
            id: "d",
            label: "Disable NTFS and use share permissions only",
            correct: false,
            feedback:
              "You cannot “disable NTFS” on a Windows volume as a strategy.",
          },
        ],
      },
    ],
    debrief:
      "One user, one folder, after a move = ACLs. Effective Access is faster than folklore. Share vs. NTFS: most restrictive applies, Deny wins. Fix with groups, verify a write, and remind people that Explorer “Move” is not morally equivalent to “Copy and inherit.”",
  },
];

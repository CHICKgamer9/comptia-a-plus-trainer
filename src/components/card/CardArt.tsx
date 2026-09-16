"use client";

import type { ReactNode } from "react";
import type { BenchCard } from "@/content/types";
import { cn } from "@/lib/cn";

function Frame({
  children,
  className,
  draw,
}: {
  children: ReactNode;
  className?: string;
  draw?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 160 140"
      className={cn("h-full w-full text-current", draw && "card-art-draw", className)}
      aria-hidden
    >
      {children}
    </svg>
  );
}

function ink(className = "stroke-current") {
  return { fill: "none" as const, strokeWidth: 1.7, className };
}

const ART: Record<string, (draw?: boolean) => ReactNode> = {
  "c-so-dimm": (draw) => (
    <Frame draw={draw}>
      <rect x="18" y="48" width="88" height="28" rx="3" {...ink()} />
      <path d="M18 58h8M98 58h8" {...ink()} />
      <path d="M28 48v8M42 76v-8" {...ink()} />
      <rect x="112" y="40" width="32" height="52" rx="2" strokeDasharray="3 3" {...ink("stroke-current opacity-50")} />
      <text x="62" y="66" textAnchor="middle" className="fill-current text-[9px]">
        SO-DIMM
      </text>
      <text x="128" y="68" textAnchor="middle" className="fill-current text-[7px] opacity-70">
        DIMM
      </text>
    </Frame>
  ),
  "c-dimm": (draw) => (
    <Frame draw={draw}>
      <rect x="22" y="36" width="28" height="72" rx="2" {...ink()} />
      <rect x="78" y="50" width="60" height="28" rx="2" {...ink()} />
      <path d="M50 72h28" {...ink()} />
      <text x="36" y="76" textAnchor="middle" className="fill-current text-[8px]">
        DIMM
      </text>
      <text x="108" y="68" textAnchor="middle" className="fill-current text-[8px]">
        SO
      </text>
    </Frame>
  ),
  "c-2280-nvme": (draw) => (
    <Frame draw={draw}>
      <rect x="16" y="58" width="128" height="22" rx="3" {...ink()} />
      <path d="M28 58v-10M144 58v-10" {...ink()} />
      <path d="M28 44h116" {...ink()} />
      <text x="80" y="50" textAnchor="middle" className="fill-current text-[8px]">
        22 × 80
      </text>
      <path d="M36 80l8 8 8-16" {...ink()} />
      <text x="80" y="74" textAnchor="middle" className="fill-current text-[8px]">
        M-key NVMe
      </text>
    </Frame>
  ),
  "c-sata-ssd": (draw) => (
    <Frame draw={draw}>
      <rect x="28" y="36" width="104" height="64" rx="6" {...ink()} />
      <rect x="36" y="86" width="36" height="10" rx="1" {...ink()} />
      <rect x="80" y="86" width="44" height="10" rx="1" {...ink()} />
      <text x="54" y="108" textAnchor="middle" className="fill-current text-[7px]">
        data
      </text>
      <text x="102" y="108" textAnchor="middle" className="fill-current text-[7px]">
        power
      </text>
      <text x="80" y="70" textAnchor="middle" className="fill-current text-[10px]">
        SATA SSD
      </text>
    </Frame>
  ),
  "c-usbc-pd": (draw) => (
    <Frame draw={draw}>
      <ellipse cx="80" cy="48" rx="22" ry="10" {...ink()} />
      <path d="M58 48v16c0 10 44 10 44 0V48" {...ink()} />
      <path d="M80 72v12" {...ink()} />
      <path d="M48 104h22M70 96v16M90 96l18 16M90 112l18-16" {...ink()} />
      <text x="38" y="92" className="fill-current text-[7px]">
        PD
      </text>
      <text x="112" y="92" className="fill-current text-[7px]">
        Alt
      </text>
    </Frame>
  ),
  "c-li-ion": (draw) => (
    <Frame draw={draw}>
      <path d="M24 86c20-28 40-8 56-28 16 22 36 4 56 24" {...ink()} />
      <rect x="36" y="70" width="88" height="28" rx="6" {...ink()} />
      <path d="M44 70c8-18 28-18 36 0" {...ink()} />
      <text x="80" y="88" textAnchor="middle" className="fill-current text-[8px]">
        do not puncture
      </text>
    </Frame>
  ),
  "c-wifi-bt": (draw) => (
    <Frame draw={draw}>
      <rect x="36" y="28" width="88" height="52" rx="4" {...ink()} />
      <path d="M48 80v24M112 80v24" {...ink()} />
      <rect x="64" y="92" width="32" height="16" rx="2" {...ink()} />
      <text x="48" y="76" className="fill-current text-[7px]">
        MAIN
      </text>
      <text x="100" y="76" className="fill-current text-[7px]">
        AUX
      </text>
    </Frame>
  ),
  "c-hinge": (draw) => (
    <Frame draw={draw}>
      <path d="M28 40h104v20H28z" {...ink()} />
      <path d="M70 60c0 16 20 16 20 0" {...ink()} />
      <path d="M48 80h64v28H48z" {...ink()} />
      <path d="M78 60v20M86 60v20" {...ink()} />
      <text x="80" y="98" textAnchor="middle" className="fill-current text-[8px]">
        eDP + RF
      </text>
    </Frame>
  ),
  "c-dc-jack": (draw) => (
    <Frame draw={draw}>
      <circle cx="52" cy="70" r="16" {...ink()} />
      <circle cx="52" cy="70" r="6" {...ink()} />
      <path d="M68 70h36" {...ink()} />
      <path d="M104 58v24M112 62v16" {...ink()} />
      <text x="80" y="112" textAnchor="middle" className="fill-current text-[8px]">
        meter here
      </text>
    </Frame>
  ),
  "c-80plus-psu": (draw) => (
    <Frame draw={draw}>
      <rect x="28" y="36" width="104" height="72" rx="6" {...ink()} />
      <text x="80" y="58" textAnchor="middle" className="fill-current text-[10px]">
        12 V
      </text>
      <path d="M44 72h72" {...ink()} />
      <text x="80" y="90" textAnchor="middle" className="fill-current text-[8px]">
        80 PLUS · read the rail
      </text>
    </Frame>
  ),
  "s-charges-no-on": (draw) => (
    <Frame draw={draw}>
      <rect x="40" y="28" width="80" height="52" rx="6" {...ink()} />
      <circle cx="52" cy="88" r="5" className="fill-current opacity-80" />
      <text x="80" y="58" textAnchor="middle" className="fill-current text-[16px]">
        ?
      </text>
      <text x="80" y="112" textAnchor="middle" className="fill-current text-[8px]">
        LED on · no POST
      </text>
    </Frame>
  ),
  "s-wont-charge": (draw) => (
    <Frame draw={draw}>
      <rect x="16" y="56" width="28" height="20" rx="3" {...ink()} />
      <path d="M44 66h20" {...ink()} />
      <rect x="64" y="52" width="22" height="28" rx="3" {...ink()} />
      <path d="M86 66h16" {...ink()} />
      <rect x="102" y="48" width="40" height="36" rx="4" {...ink()} />
      <path d="M58 66l4 8 6-14" {...ink()} />
      <text x="80" y="108" textAnchor="middle" className="fill-current text-[8px]">
        brick · cable · jack · pack
      </text>
    </Frame>
  ),
  "s-wifi-drops": (draw) => (
    <Frame draw={draw}>
      <path d="M40 88c16-24 64-24 80 0" {...ink()} />
      <path d="M56 88c10-14 38-14 48 0" strokeDasharray="4 3" {...ink()} />
      <circle cx="80" cy="96" r="4" className="fill-current" />
      <text x="44" y="48" className="fill-current text-[8px]">
        2.4
      </text>
      <text x="108" y="48" className="fill-current text-[8px]">
        5 GHz
      </text>
    </Frame>
  ),
  "s-swollen": (draw) => (
    <Frame draw={draw}>
      <path d="M24 92h112" {...ink()} />
      <path d="M32 92c16-40 80-40 96 0" {...ink()} />
      <text x="80" y="72" textAnchor="middle" className="fill-current text-[8px]">
        isolate
      </text>
    </Frame>
  ),
  "s-no-post-ram": (draw) => (
    <Frame draw={draw}>
      <rect x="28" y="40" width="104" height="64" rx="4" {...ink()} />
      <rect x="40" y="52" width="16" height="40" rx="2" className="fill-current opacity-30" stroke="currentColor" />
      <rect x="64" y="52" width="16" height="40" rx="2" {...ink()} />
      <text x="48" y="118" textAnchor="middle" className="fill-current text-[8px]">
        A
      </text>
      <text x="72" y="118" textAnchor="middle" className="fill-current text-[8px]">
        B
      </text>
    </Frame>
  ),
  "t-multimeter": (draw) => (
    <Frame draw={draw}>
      <rect x="48" y="24" width="64" height="48" rx="6" {...ink()} />
      <text x="80" y="52" textAnchor="middle" className="fill-current text-[10px]">
        19.6 V
      </text>
      <path d="M60 72v36M100 72v36" {...ink()} />
      <circle cx="60" cy="112" r="4" {...ink()} />
      <circle cx="100" cy="112" r="4" {...ink()} />
    </Frame>
  ),
  "t-loopback": (draw) => (
    <Frame draw={draw}>
      <rect x="28" y="48" width="40" height="28" rx="4" {...ink()} />
      <path d="M68 62c20-24 44-8 44 12 0 16-16 24-28 16" {...ink()} />
      <text x="48" y="66" textAnchor="middle" className="fill-current text-[8px]">
        RJ45
      </text>
      <text x="108" y="104" textAnchor="middle" className="fill-current text-[8px]">
        127.0.0.1
      </text>
    </Frame>
  ),
  "t-toner": (draw) => (
    <Frame draw={draw}>
      <rect x="24" y="36" width="112" height="20" rx="2" {...ink()} />
      {[36, 52, 68, 84, 100, 116].map((x) => (
        <rect key={x} x={x} y="40" width="10" height="12" rx="1" {...ink()} />
      ))}
      <path d="M80 56v20M68 88h24" {...ink()} />
      <text x="80" y="112" textAnchor="middle" className="fill-current text-[8px]">
        tone the pair
      </text>
    </Frame>
  ),
  "t-pxe": (draw) => (
    <Frame draw={draw}>
      <rect x="24" y="32" width="52" height="72" rx="4" {...ink()} />
      <text x="50" y="56" textAnchor="middle" className="fill-current text-[8px]">
        PXE
      </text>
      <path d="M76 68h20" {...ink()} />
      <rect x="96" y="48" width="40" height="40" rx="4" {...ink()} />
      <text x="116" y="72" textAnchor="middle" className="fill-current text-[8px]">
        DHCP
      </text>
    </Frame>
  ),
  "t-safe-mode": (draw) => (
    <Frame draw={draw}>
      <rect x="36" y="28" width="88" height="80" rx="6" {...ink()} />
      <path d="M48 48h64M48 64h48M48 80h36" {...ink()} />
      <text x="80" y="120" textAnchor="middle" className="fill-current text-[8px]">
        roll back
      </text>
    </Frame>
  ),
  "p-esd": (draw) => (
    <Frame draw={draw}>
      <circle cx="80" cy="48" r="16" {...ink()} />
      <path d="M80 64v20M64 84h32" {...ink()} />
      <path d="M48 104h64" {...ink()} />
      <path d="M80 84l-12 20M80 84l12 20" {...ink()} />
      <text x="80" y="128" textAnchor="middle" className="fill-current text-[8px]">
        ground
      </text>
    </Frame>
  ),
  "p-thermal-paste": (draw) => (
    <Frame draw={draw}>
      <rect x="36" y="36" width="52" height="52" rx="4" {...ink()} />
      <circle cx="62" cy="62" r="5" className="fill-current" />
      <rect x="100" y="40" width="36" height="44" rx="4" strokeDasharray="3 3" {...ink()} />
      <circle cx="118" cy="62" r="12" className="fill-current opacity-25" />
      <text x="62" y="108" textAnchor="middle" className="fill-current text-[7px]">
        pea
      </text>
      <text x="118" y="108" textAnchor="middle" className="fill-current text-[7px]">
        blob
      </text>
    </Frame>
  ),
  "p-connector-pull": (draw) => (
    <Frame draw={draw}>
      <rect x="40" y="48" width="80" height="16" rx="2" {...ink()} />
      <path d="M48 48v-10h16v10" {...ink()} />
      <path d="M80 64v24" {...ink()} />
      <path d="M72 88h16" {...ink()} />
      <text x="80" y="116" textAnchor="middle" className="fill-current text-[8px]">
        latch, then pull
      </text>
    </Frame>
  ),
  "p-change-ticket": (draw) => (
    <Frame draw={draw}>
      <rect x="40" y="24" width="80" height="96" rx="4" {...ink()} />
      <path d="M52 48h56M52 68h56M52 88h40" {...ink()} />
      <text x="80" y="40" textAnchor="middle" className="fill-current text-[8px]">
        risk · rollback
      </text>
    </Frame>
  ),
  "g-binary-subnet": (draw) => (
    <Frame draw={draw}>
      <path d="M20 80h120" {...ink()} />
      {[20, 60, 100, 140].map((x) => (
        <path key={x} d={`M${x} 72v16`} {...ink()} />
      ))}
      <text x="40" y="64" className="fill-current text-[8px]">
        /24
      </text>
      <text x="80" y="64" className="fill-current text-[8px]">
        /25
      </text>
      <text x="120" y="64" className="fill-current text-[8px]">
        /26
      </text>
    </Frame>
  ),
  "g-sleep-pbq": (draw) => (
    <Frame draw={draw}>
      {[
        [20, "Sleep"],
        [60, "Hib"],
        [100, "Off"],
      ].map(([x, label]) => (
        <g key={String(label)}>
          <rect x={Number(x)} y="40" width="36" height="52" rx="4" {...ink()} />
          <text x={Number(x) + 18} y="70" textAnchor="middle" className="fill-current text-[8px]">
            {label}
          </text>
        </g>
      ))}
    </Frame>
  ),
  "g-prob-raid": (draw) => (
    <Frame draw={draw}>
      {[28, 56, 84, 112].map((x) => (
        <rect key={x} x={x} y="40" width="20" height="48" rx="2" {...ink()} />
      ))}
      <path d="M38 96l70 0" {...ink()} />
      <text x="80" y="120" textAnchor="middle" className="fill-current text-[8px]">
        RAID 0 multiplies risk
      </text>
    </Frame>
  ),
  "k-usbc-charge-only": (draw) => (
    <Frame draw={draw}>
      <ellipse cx="64" cy="56" rx="18" ry="8" {...ink()} />
      <path d="M46 56v14c0 8 36 8 36 0V56" {...ink()} />
      <path d="M100 40l28 28M128 40L100 68" {...ink()} />
      <text x="80" y="108" textAnchor="middle" className="fill-current text-[8px]">
        charge ≠ video
      </text>
    </Frame>
  ),
  "k-apipa-is-dns": (draw) => (
    <Frame draw={draw}>
      <text x="80" y="52" textAnchor="middle" className="fill-current text-[11px]">
        169.254.x.x
      </text>
      <path d="M40 72h80" {...ink()} />
      <text x="80" y="92" textAnchor="middle" className="fill-current text-[8px]">
        DHCP failed
      </text>
      <path d="M48 108h64M52 104l-8 8 8 8" {...ink()} />
    </Frame>
  ),
  "k-raid-is-backup": (draw) => (
    <Frame draw={draw}>
      <rect x="20" y="36" width="52" height="64" rx="4" {...ink()} />
      <rect x="88" y="36" width="52" height="64" rx="4" {...ink()} />
      <text x="46" y="72" textAnchor="middle" className="fill-current text-[8px]">
        RAID
      </text>
      <text x="114" y="72" textAnchor="middle" className="fill-current text-[8px]">
        3-2-1
      </text>
    </Frame>
  ),
  "k-more-paste": (draw) => (
    <Frame draw={draw}>
      <rect x="24" y="40" width="48" height="48" rx="4" {...ink()} />
      <circle cx="48" cy="64" r="4" className="fill-current" />
      <rect x="88" y="40" width="48" height="48" rx="4" {...ink()} />
      <ellipse cx="112" cy="64" rx="14" ry="12" className="fill-current opacity-30" />
      <text x="80" y="112" textAnchor="middle" className="fill-current text-[8px]">
        insulator
      </text>
    </Frame>
  ),
  "r-mobile-devices": (draw) => (
    <Frame draw={draw}>
      <path d="M80 20l18 12v20c0 22-18 36-18 36s-18-14-18-36V32z" {...ink()} />
      <rect x="58" y="72" width="44" height="28" rx="4" {...ink()} />
      <text x="80" y="120" textAnchor="middle" className="fill-current text-[8px]">
        MOBILE
      </text>
    </Frame>
  ),
  "r-networking": (draw) => (
    <Frame draw={draw}>
      <rect x="60" y="28" width="40" height="24" rx="4" {...ink()} />
      <path d="M80 52v16M48 84h64" {...ink()} />
      <circle cx="48" cy="84" r="8" {...ink()} />
      <circle cx="80" cy="84" r="8" {...ink()} />
      <circle cx="112" cy="84" r="8" {...ink()} />
    </Frame>
  ),
  "r-hardware": (draw) => (
    <Frame draw={draw}>
      <rect x="28" y="44" width="40" height="48" rx="4" {...ink()} />
      <rect x="88" y="36" width="16" height="64" rx="2" {...ink()} />
      <text x="48" y="72" textAnchor="middle" className="fill-current text-[8px]">
        PSU
      </text>
    </Frame>
  ),
  "r-operating-systems": (draw) => (
    <Frame draw={draw}>
      <rect x="36" y="32" width="88" height="72" rx="6" {...ink()} />
      <path d="M36 48h88" {...ink()} />
      <rect x="48" y="60" width="28" height="20" rx="2" {...ink()} />
    </Frame>
  ),
  "r-security": (draw) => (
    <Frame draw={draw}>
      <rect x="56" y="56" width="48" height="40" rx="4" {...ink()} />
      <path d="M64 56V44a16 16 0 0 1 32 0v12" {...ink()} />
    </Frame>
  ),
  "l-cinebench-die": (draw) => (
    <Frame draw={draw}>
      <path d="M24 100l24-40 20 16 28-36 20 20 20-12" {...ink()} />
      <rect x="100" y="36" width="36" height="16" rx="2" {...ink()} />
      <text x="80" y="120" textAnchor="middle" className="fill-current text-[8px]">
        throttle
      </text>
    </Frame>
  ),
  "l-power-path": (draw) => (
    <Frame draw={draw}>
      <rect x="16" y="56" width="28" height="20" rx="3" {...ink()} />
      <path d="M44 66h16l8-12 8 24 8-12h16" {...ink()} />
      <rect x="116" y="52" width="28" height="28" rx="4" {...ink()} />
    </Frame>
  ),
  "l-antenna-lid": (draw) => (
    <Frame draw={draw}>
      <path d="M40 36h80v36H40z" {...ink()} />
      <path d="M52 72v20M108 72v20" {...ink()} />
      <circle cx="52" cy="96" r="5" className="fill-current" />
      <circle cx="108" cy="96" r="5" className="fill-current" />
    </Frame>
  ),
  "l-swollen-pack": (draw) => (
    <Frame draw={draw}>
      <rect x="44" y="36" width="72" height="56" rx="8" {...ink()} />
      <path d="M56 92v16h48v-16" {...ink()} />
      <text x="80" y="68" textAnchor="middle" className="fill-current text-[8px]">
        recycle
      </text>
    </Frame>
  ),
  "l-pxe-ghost": (draw) => (
    <Frame draw={draw}>
      <path d="M32 72h40" {...ink()} />
      <rect x="72" y="40" width="56" height="64" rx="4" {...ink()} />
      <path d="M84 64h32M84 80h24" {...ink()} />
      <text x="100" y="56" textAnchor="middle" className="fill-current text-[8px]">
        undo
      </text>
    </Frame>
  ),
  "c-wwan": (draw) => (
    <Frame draw={draw}>
      <rect x="28" y="52" width="40" height="28" rx="3" {...ink()} />
      <rect x="84" y="48" width="56" height="36" rx="3" {...ink()} />
      <text x="48" y="70" textAnchor="middle" className="fill-current text-[8px]">
        2230
      </text>
      <text x="112" y="70" textAnchor="middle" className="fill-current text-[8px]">
        2280
      </text>
    </Frame>
  ),
  "c-digitizer": (draw) => (
    <Frame draw={draw}>
      <rect x="40" y="28" width="80" height="16" rx="2" {...ink()} />
      <rect x="40" y="50" width="80" height="16" rx="2" {...ink()} />
      <rect x="40" y="72" width="80" height="24" rx="2" {...ink()} />
      <text x="80" y="40" textAnchor="middle" className="fill-current text-[7px]">
        glass
      </text>
      <text x="80" y="62" textAnchor="middle" className="fill-current text-[7px]">
        digitizer
      </text>
      <text x="80" y="88" textAnchor="middle" className="fill-current text-[7px]">
        LCD
      </text>
    </Frame>
  ),
  "g-privacy-feed": (draw) => (
    <Frame draw={draw}>
      <rect x="24" y="28" width="48" height="84" rx="8" {...ink()} />
      <path d="M32 44h32M32 56h24M32 68h28" {...ink()} />
      <rect x="88" y="40" width="48" height="56" rx="4" {...ink()} />
      <text x="112" y="72" textAnchor="middle" className="fill-current text-[8px]">
        source
      </text>
    </Frame>
  ),
  "g-fraction-raid": (draw) => (
    <Frame draw={draw}>
      {[28, 68, 108].map((x, i) => (
        <g key={x}>
          <rect x={x} y="36" width="28" height="64" rx="3" {...ink()} />
          {i === 2 ? <rect x={x} y="68" width="28" height="32" className="fill-current opacity-25" /> : null}
        </g>
      ))}
      <text x="122" y="120" textAnchor="middle" className="fill-current text-[7px]">
        parity
      </text>
    </Frame>
  ),
};

function FallbackArt({ card, draw }: { card: BenchCard; draw?: boolean }) {
  const mark = card.title.slice(0, 2).toUpperCase();
  const n = card.id.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const a = 20 + (n % 40);
  const b = 30 + ((n * 3) % 50);
  return (
    <Frame draw={draw}>
      <circle cx={60 + (n % 40)} cy={50 + (n % 30)} r={18 + (n % 10)} {...ink()} />
      <path d={`M${a} 110 Q80 ${b} ${160 - a} 110`} {...ink()} />
      <rect x="48" y="40" width="64" height="40" rx="8" {...ink()} />
      <text x="80" y="66" textAnchor="middle" className="fill-current text-[16px] font-semibold">
        {mark}
      </text>
    </Frame>
  );
}

export function CardArt({
  card,
  className,
  draw,
}: {
  card: BenchCard;
  className?: string;
  draw?: boolean;
}) {
  const render = ART[card.id];
  return (
    <div className={cn("aspect-[8/7] w-full text-current", className)}>
      {render ? render(draw) : <FallbackArt card={card} draw={draw} />}
    </div>
  );
}

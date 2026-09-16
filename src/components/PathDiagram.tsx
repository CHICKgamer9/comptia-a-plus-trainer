import type { DiagramId } from "@/content/types";

export function PathDiagram({ id, alt }: { id: DiagramId; alt?: string }) {
  const common = {
    width: 280,
    height: 140,
    viewBox: "0 0 280 140",
    fill: "none",
    className: "mx-auto h-32 w-full max-w-xs",
    ...(alt
      ? { role: "img" as const, "aria-label": alt }
      : { "aria-hidden": true as const }),
  };

  if (id === "laptop") {
    return (
      <svg {...common}>
        <rect x="48" y="22" width="184" height="78" rx="10" stroke="currentColor" className="text-accent" strokeWidth="2" />
        <rect x="62" y="34" width="156" height="54" rx="4" className="fill-accent/15" />
        <path d="M36 108h208l12 14H24l12-14Z" stroke="currentColor" className="text-accent" strokeWidth="2" />
        <circle cx="140" cy="96" r="3" className="fill-accent" />
      </svg>
    );
  }

  if (id === "layers") {
    return (
      <svg {...common}>
        {["Physical", "Network", "Transport", "App"].map((label, index) => (
          <g key={label}>
            <rect
              x={36 + index * 8}
              y={98 - index * 22}
              width={208 - index * 16}
              height="20"
              rx="6"
              className={index % 2 ? "fill-accent/25" : "fill-accent/10"}
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <text x="140" y={112 - index * 22} textAnchor="middle" className="fill-foreground text-[11px]">
              {label}
            </text>
          </g>
        ))}
      </svg>
    );
  }

  if (id === "connectors") {
    return (
      <svg {...common}>
        <rect x="30" y="38" width="70" height="44" rx="8" stroke="currentColor" className="text-accent" strokeWidth="2" />
        <path d="M100 50h28v20H100" stroke="currentColor" className="text-accent" strokeWidth="2" />
        <rect x="128" y="44" width="52" height="32" rx="4" className="fill-accent/20" stroke="currentColor" strokeWidth="1.5" />
        <rect x="198" y="30" width="52" height="60" rx="6" stroke="currentColor" className="text-ok" strokeWidth="2" />
        <path d="M211 42h26M211 54h26M211 66h18" stroke="currentColor" className="text-ok" strokeWidth="2" />
      </svg>
    );
  }

  if (id === "cloud") {
    return (
      <svg {...common}>
        <ellipse cx="140" cy="58" rx="70" ry="28" className="fill-accent/15" stroke="currentColor" strokeWidth="2" />
        <ellipse cx="100" cy="70" rx="36" ry="18" className="fill-accent/10" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="180" cy="70" rx="36" ry="18" className="fill-accent/10" stroke="currentColor" strokeWidth="1.5" />
        <rect x="86" y="96" width="36" height="22" rx="4" className="fill-surface-2" stroke="currentColor" strokeWidth="1.4" />
        <rect x="164" y="96" width="36" height="22" rx="4" className="fill-surface-2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M104 96V84M182 96V84" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }

  if (id === "loop") {
    const labels = ["ID", "Theory", "Test", "Plan", "Verify", "Doc"];
    return (
      <svg {...common}>
        {labels.map((label, index) => {
          const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
          const x = 140 + Math.cos(angle) * 48;
          const y = 70 + Math.sin(angle) * 40;
          return (
            <g key={label}>
              <circle cx={x} cy={y} r="16" className="fill-accent/15" stroke="currentColor" strokeWidth="1.5" />
              <text x={x} y={y + 4} textAnchor="middle" className="fill-foreground text-[9px] font-medium">
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  if (id === "window") {
    return (
      <svg {...common}>
        <rect x="58" y="24" width="164" height="96" rx="10" stroke="currentColor" className="text-accent" strokeWidth="2" />
        <rect x="58" y="24" width="164" height="22" rx="10" className="fill-accent/20" />
        <circle cx="74" cy="35" r="4" className="fill-danger/80" />
        <circle cx="88" cy="35" r="4" className="fill-warn/80" />
        <circle cx="102" cy="35" r="4" className="fill-ok/80" />
        <path d="M78 64h124M78 80h88M78 96h64" stroke="currentColor" className="text-muted" strokeWidth="2" />
      </svg>
    );
  }

  if (id === "lock") {
    return (
      <svg {...common}>
        <rect x="98" y="62" width="84" height="56" rx="10" className="fill-accent/15" stroke="currentColor" strokeWidth="2" />
        <path d="M118 62V46a22 22 0 0 1 44 0v16" stroke="currentColor" className="text-accent" strokeWidth="2" />
        <circle cx="140" cy="88" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M140 95v10" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  if (id === "boot") {
    return (
      <svg {...common}>
        <path d="M40 100 L140 28 L240 100" stroke="currentColor" className="text-accent" strokeWidth="2" />
        {["POST", "Bootmgr", "Kernel"].map((label, index) => (
          <g key={label}>
            <circle cx={70 + index * 70} cy={100 - index * 18} r="14" className="fill-accent/20" stroke="currentColor" />
            <text x={70 + index * 70} y={104 - index * 18} textAnchor="middle" className="fill-foreground text-[9px]">
              {label}
            </text>
          </g>
        ))}
      </svg>
    );
  }

  if (id === "balance") {
    return (
      <svg {...common}>
        <path d="M140 28v78" stroke="currentColor" className="text-accent" strokeWidth="2" />
        <path d="M88 54h104" stroke="currentColor" className="text-accent" strokeWidth="2" />
        <path d="M88 54 64 92h48L88 54Z" className="fill-accent/15" stroke="currentColor" strokeWidth="1.6" />
        <path d="M192 54 168 92h48L192 54Z" className="fill-accent/15" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="140" cy="54" r="5" className="fill-accent" />
        <rect x="118" y="106" width="44" height="10" rx="3" className="fill-accent/20" stroke="currentColor" />
      </svg>
    );
  }

  if (id === "atom") {
    return (
      <svg {...common}>
        <ellipse cx="140" cy="70" rx="70" ry="28" stroke="currentColor" className="text-accent" strokeWidth="1.6" />
        <ellipse cx="140" cy="70" rx="28" ry="62" stroke="currentColor" className="text-accent" strokeWidth="1.6" transform="rotate(60 140 70)" />
        <ellipse cx="140" cy="70" rx="28" ry="62" stroke="currentColor" className="text-accent" strokeWidth="1.6" transform="rotate(-60 140 70)" />
        <circle cx="140" cy="70" r="10" className="fill-accent" />
        <circle cx="208" cy="70" r="5" className="fill-ok" />
      </svg>
    );
  }

  if (id === "leaf") {
    return (
      <svg {...common}>
        <path
          d="M70 96c30-62 110-62 140 0-30 28-80 36-140 0Z"
          className="fill-accent/15"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M86 88c36-8 72-8 108 0" stroke="currentColor" className="text-ok" strokeWidth="1.6" />
        <path d="M140 96V48" stroke="currentColor" className="text-accent" strokeWidth="1.6" />
      </svg>
    );
  }

  if (id === "scroll") {
    return (
      <svg {...common}>
        <rect x="78" y="24" width="124" height="92" rx="10" stroke="currentColor" className="text-accent" strokeWidth="2" />
        <path d="M78 40h124" stroke="currentColor" strokeWidth="2" />
        <path d="M96 58h88M96 74h88M96 90h56" stroke="currentColor" className="text-muted" strokeWidth="2" />
        <circle cx="96" cy="32" r="3" className="fill-warn" />
      </svg>
    );
  }

  if (id === "prism") {
    return (
      <svg {...common}>
        <path d="M70 100 L140 28 L210 100Z" className="fill-accent/10" stroke="currentColor" strokeWidth="2" />
        <path d="M140 28 L140 100" stroke="currentColor" className="text-accent" strokeWidth="1.5" />
        <path d="M88 82h104" stroke="currentColor" className="text-ok" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="72" y="18" width="136" height="108" rx="8" stroke="currentColor" className="text-accent" strokeWidth="2" />
      <path d="M72 40h136" stroke="currentColor" strokeWidth="2" />
      <path d="M92 58h96M92 74h96M92 90h64" stroke="currentColor" className="text-muted" strokeWidth="2" />
    </svg>
  );
}

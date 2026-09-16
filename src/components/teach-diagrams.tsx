import type { ReactNode } from "react";
import type { DiagramId, TeachDiagramId } from "@/content/types";
import { PathDiagram } from "./PathDiagram";

const svg = {
  viewBox: "0 0 400 188",
  className: "mx-auto h-auto w-full max-w-lg",
  fill: "none",
  role: "img" as const,
};

function Svg({ alt, children }: { alt: string; children: ReactNode }) {
  return (
    <svg {...svg} aria-label={alt}>
      <title>{alt}</title>
      {children}
    </svg>
  );
}

export function TeachDiagram({ id, alt }: { id: TeachDiagramId; alt: string }) {
  if (id === "rear-io") {
    return (
      <Svg alt={alt}>
        <rect x="24" y="36" width="352" height="88" rx="10" stroke="currentColor" className="text-accent" strokeWidth="2" />
        <text x="200" y="28" textAnchor="middle" className="fill-muted text-[11px]">
          Rear I/O — labels, not colours, name the port
        </text>
        {[
          [40, "HDMI"],
          [96, "DP"],
          [148, "USB-A"],
          [208, "USB-C"],
          [268, "RJ45"],
          [328, "DC"],
        ].map(([x, label]) => (
          <g key={String(label)}>
            <rect x={Number(x)} y="56" width="48" height="28" rx="4" className="fill-surface-2" stroke="currentColor" strokeWidth="1.4" />
            <text x={Number(x) + 24} y="74" textAnchor="middle" className="fill-foreground text-[10px] font-medium">
              {label}
            </text>
            <text x={Number(x) + 24} y="108" textAnchor="middle" className="fill-muted text-[9px]">
              {label === "DC" ? "power" : label === "RJ45" ? "data" : label === "USB-C" ? "both?" : "signal"}
            </text>
          </g>
        ))}
        <text x="200" y="168" textAnchor="middle" className="fill-foreground text-[11px]">
          USB-C may be charge-only — the label on the board wins
        </text>
      </Svg>
    );
  }

  if (id === "usb-c-roles") {
    return (
      <Svg alt={alt}>
        <text x="200" y="24" textAnchor="middle" className="fill-muted text-[11px]">
          Same USB-C hole, three jobs (read the spec sheet)
        </text>
        {[
          [28, "Charge only", "Power brick. No video."],
          [144, "DP Alt Mode", "Video + data + maybe PD"],
          [260, "Thunderbolt", "PCIe tunnel + the rest"],
        ].map(([x, title, body]) => (
          <g key={String(title)}>
            <rect
              x={Number(x)}
              y="40"
              width="108"
              height="100"
              rx="10"
              className="fill-accent/10"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <text x={Number(x) + 54} y="68" textAnchor="middle" className="fill-foreground text-[11px] font-semibold">
              {title}
            </text>
            <text x={Number(x) + 54} y="98" textAnchor="middle" className="fill-muted text-[10px]">
              {String(body).slice(0, 18)}
            </text>
            <text x={Number(x) + 54} y="114" textAnchor="middle" className="fill-muted text-[10px]">
              {String(body).slice(18)}
            </text>
          </g>
        ))}
        <text x="200" y="168" textAnchor="middle" className="fill-foreground text-[11px]">
          A dock that works on laptop A can fail on B — compare the port, not the brand
        </text>
      </Svg>
    );
  }

  if (id === "soho-topo") {
    return (
      <Svg alt={alt}>
        <text x="200" y="22" textAnchor="middle" className="fill-muted text-[11px]">
          SOHO path — boxes and names, left = street
        </text>
        {[
          [20, "ONT / modem"],
          [112, "Router"],
          [198, "Switch"],
          [284, "AP / PC"],
        ].map(([x, label], index) => (
          <g key={String(label)}>
            <rect x={Number(x)} y="48" width="84" height="44" rx="8" stroke="currentColor" className="text-accent" strokeWidth="1.6" />
            <text x={Number(x) + 42} y="74" textAnchor="middle" className="fill-foreground text-[10px] font-medium">
              {label}
            </text>
            {index < 3 ? <path d={`M${Number(x) + 84} 70h28`} stroke="currentColor" strokeWidth="1.6" /> : null}
          </g>
        ))}
        <text x="62" y="118" textAnchor="middle" className="fill-muted text-[10px]">
          WAN
        </text>
        <text x="154" y="118" textAnchor="middle" className="fill-muted text-[10px]">
          NAT / DHCP
        </text>
        <text x="240" y="118" textAnchor="middle" className="fill-muted text-[10px]">
          MAC / LAN
        </text>
        <text x="326" y="118" textAnchor="middle" className="fill-muted text-[10px]">
          Wi-Fi / host
        </text>
        <text x="200" y="152" textAnchor="middle" className="fill-foreground text-[11px]">
          Ping gateway · ping 8.8.8.8 · nslookup — that order splits WAN / LAN / DNS
        </text>
        <text x="200" y="172" textAnchor="middle" className="fill-muted text-[10px]">
          Combo “router” boxes hide three of these in one plastic
        </text>
      </Svg>
    );
  }

  if (id === "osi-where") {
    return (
      <Svg alt={alt}>
        <text x="200" y="22" textAnchor="middle" className="fill-muted text-[11px]">
          Where the ticket lives (not a poster recitation)
        </text>
        {[
          ["App / DNS / HTTP", "Website fails, ping IP works"],
          ["Transport — TCP/UDP port", "Right IP, wrong door"],
          ["Network — IP / router", "LAN ok, no gateway"],
          ["Link / Physical — cable, NIC", "No link light, APIPA"],
        ].map(([title, body], index) => (
          <g key={title}>
            <rect
              x={36 + index * 6}
              y={40 + index * 32}
              width={328 - index * 12}
              height="28"
              rx="6"
              className={index % 2 ? "fill-accent/20" : "fill-accent/10"}
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <text x="200" y={52 + index * 32} textAnchor="middle" className="fill-foreground text-[11px] font-medium">
              {title}
            </text>
            <text x="200" y={64 + index * 32} textAnchor="middle" className="fill-muted text-[9px]">
              {body}
            </text>
          </g>
        ))}
      </Svg>
    );
  }

  if (id === "swollen-pack") {
    return (
      <Svg alt={alt}>
        <text x="200" y="20" textAnchor="middle" className="fill-muted text-[11px]">
          One story: the pack swells and lifts the palm rest
        </text>
        <rect x="48" y="36" width="300" height="88" rx="14" stroke="currentColor" className="text-accent" strokeWidth="2" />
        <text x="198" y="58" textAnchor="middle" className="fill-foreground text-[11px] font-semibold">
          palm rest
        </text>
        <rect x="120" y="68" width="88" height="36" rx="6" className="fill-accent/15" stroke="currentColor" />
        <text x="164" y="90" textAnchor="middle" className="fill-foreground text-[10px]">
          trackpad
        </text>
        <path d="M86 124c20-28 60-28 80 0" stroke="currentColor" className="text-warn" strokeWidth="2" />
        <rect x="86" y="128" width="120" height="28" rx="6" className="fill-warn/15" stroke="currentColor" />
        <text x="146" y="146" textAnchor="middle" className="fill-foreground text-[10px] font-semibold">
          lithium-ion pack
        </text>
        <text x="280" y="146" textAnchor="middle" className="fill-warn text-[11px]">
          bulge
        </text>
        <path d="M230 132l28 8" stroke="currentColor" className="text-warn" strokeWidth="1.4" />
        <text x="200" y="176" textAnchor="middle" className="fill-foreground text-[11px]">
          Do not crush the palm rest
        </text>
      </Svg>
    );
  }

  if (id === "soldered-cpu") {
    return (
      <Svg alt={alt}>
        <text x="200" y="20" textAnchor="middle" className="fill-muted text-[11px]">
          Thin board — soldered chip versus parts that unplug
        </text>
        <rect x="40" y="36" width="320" height="112" rx="10" stroke="currentColor" className="text-accent" strokeWidth="2" />
        <rect x="56" y="52" width="88" height="52" rx="6" className="fill-warn/15" stroke="currentColor" />
        <text x="100" y="74" textAnchor="middle" className="fill-foreground text-[10px] font-semibold">
          soldered CPU
        </text>
        <text x="100" y="90" textAnchor="middle" className="fill-muted text-[9px]">
          stays on the board
        </text>
        <rect x="156" y="56" width="72" height="44" rx="4" stroke="currentColor" />
        <text x="192" y="82" textAnchor="middle" className="fill-foreground text-[10px]">
          so-dimm
        </text>
        <rect x="236" y="56" width="56" height="44" rx="4" stroke="currentColor" />
        <text x="264" y="82" textAnchor="middle" className="fill-foreground text-[10px]">
          M.2
        </text>
        <rect x="300" y="56" width="44" height="44" rx="4" stroke="currentColor" />
        <text x="322" y="82" textAnchor="middle" className="fill-foreground text-[10px]">
          pack
        </text>
        <text x="200" y="168" textAnchor="middle" className="fill-foreground text-[11px]">
          A faster soldered chip means a different laptop
        </text>
      </Svg>
    );
  }

  if (id === "heat-flow") {
    return (
      <Svg alt={alt}>
        <text x="200" y="20" textAnchor="middle" className="fill-muted text-[11px]">
          Same tea. Two paths. Labels name the flow.
        </text>
        <ellipse cx="150" cy="90" rx="70" ry="36" className="fill-accent/10" stroke="currentColor" />
        <text x="150" y="86" textAnchor="middle" className="fill-foreground text-[11px] font-semibold">
          hot tea
        </text>
        <path d="M150 54v-12" stroke="currentColor" className="text-warn" strokeWidth="2" />
        <rect x="138" y="28" width="24" height="18" rx="3" stroke="currentColor" />
        <text x="220" y="40" className="fill-foreground text-[10px]">
          metal spoon
        </text>
        <text x="220" y="54" className="fill-warn text-[10px]">
          heat flow
        </text>
        <rect x="250" y="70" width="70" height="44" rx="8" stroke="currentColor" />
        <text x="285" y="96" textAnchor="middle" className="fill-foreground text-[10px]">
          mug handle
        </text>
        <text x="200" y="168" textAnchor="middle" className="fill-foreground text-[11px]">
          Skin reads the fast path, not a hotter object
        </text>
      </Svg>
    );
  }

  if (id === "door-hello") {
    return (
      <Svg alt={alt}>
        <rect x="130" y="28" width="140" height="140" rx="8" stroke="currentColor" strokeWidth="2" />
        <circle cx="248" cy="100" r="5" className="fill-foreground" />
        <text x="200" y="100" textAnchor="middle" className="fill-foreground text-[16px] font-semibold">
          hello
        </text>
        <text x="200" y="180" textAnchor="middle" className="fill-muted text-[11px]">
          A door opens. Say the word.
        </text>
      </Svg>
    );
  }

  if (id === "fru-laptop") {
    return (
      <Svg alt={alt}>
        <rect x="70" y="28" width="260" height="88" rx="12" stroke="currentColor" className="text-accent" strokeWidth="2" />
        <rect x="86" y="40" width="228" height="52" rx="4" className="fill-accent/10" />
        <text x="200" y="70" textAnchor="middle" className="fill-foreground text-[11px]">
          Lid / panel / antennas
        </text>
        <rect x="90" y="128" width="70" height="28" rx="4" stroke="currentColor" strokeWidth="1.4" />
        <text x="125" y="146" textAnchor="middle" className="fill-foreground text-[10px]">
          SODIMM
        </text>
        <rect x="168" y="128" width="70" height="28" rx="4" stroke="currentColor" strokeWidth="1.4" />
        <text x="203" y="146" textAnchor="middle" className="fill-foreground text-[10px]">
          M.2
        </text>
        <rect x="246" y="128" width="70" height="28" rx="4" stroke="currentColor" strokeWidth="1.4" />
        <text x="281" y="146" textAnchor="middle" className="fill-foreground text-[10px]">
          Battery
        </text>
        <text x="200" y="178" textAnchor="middle" className="fill-muted text-[11px]">
          CPU often soldered — model/SKU before you order a keyboard
        </text>
      </Svg>
    );
  }

  if (id === "packet-path") {
    return (
      <Svg alt={alt}>
        <text x="200" y="24" textAnchor="middle" className="fill-muted text-[11px]">
          One request, many packets — routes can split
        </text>
        {["You", "R1", "R2", "Host"].map((label, index) => (
          <g key={label}>
            <circle cx={70 + index * 88} cy="80" r="22" className="fill-accent/15" stroke="currentColor" strokeWidth="1.6" />
            <text x={70 + index * 88} y="84" textAnchor="middle" className="fill-foreground text-[11px] font-medium">
              {label}
            </text>
            {index < 3 ? (
              <path d={`M${92 + index * 88} 80h44`} stroke="currentColor" strokeWidth="1.6" strokeDasharray={index === 1 ? "5 4" : undefined} />
            ) : null}
          </g>
        ))}
        <text x="200" y="128" textAnchor="middle" className="fill-foreground text-[11px]">
          Solid = one path · dashed = alternate if R1 is busy
        </text>
        <text x="200" y="152" textAnchor="middle" className="fill-muted text-[11px]">
          Ping an IP tests this path. Ping a name also needs DNS (not drawn).
        </text>
        <text x="200" y="172" textAnchor="middle" className="fill-muted text-[10px]">
          TCP puts packets back in order; UDP often does not
        </text>
      </Svg>
    );
  }

  if (id === "number-line") {
    return (
      <Svg alt={alt}>
        <text x="200" y="28" textAnchor="middle" className="fill-muted text-[11px]">
          Number line — ticks are the evidence, not the slogan
        </text>
        <path d="M40 96h320" stroke="currentColor" className="text-accent" strokeWidth="2" />
        {[0, 1, 2, 3, 4].map((n) => {
          const x = 48 + n * 76;
          return (
            <g key={n}>
              <path d={`M${x} 88v16`} stroke="currentColor" strokeWidth="1.6" />
              <text x={x} y="124" textAnchor="middle" className="fill-foreground text-[12px]">
                {n}
              </text>
            </g>
          );
        })}
        <path d="M86 72v12" stroke="currentColor" className="text-ok" strokeWidth="2" />
        <text x="86" y="64" textAnchor="middle" className="fill-ok text-[11px]">
          1/2
        </text>
        <path d="M124 76v8" stroke="currentColor" className="text-warn" strokeWidth="2" />
        <text x="148" y="64" textAnchor="middle" className="fill-warn text-[11px]">
          0.5 is the same tick as 1/2
        </text>
        <text x="200" y="160" textAnchor="middle" className="fill-foreground text-[11px]">
          1/2 + 1/3 is not “2/5” — different denominators are different tick sizes
        </text>
      </Svg>
    );
  }

  if (id === "room-scale") {
    return (
      <Svg alt={alt}>
        <text x="200" y="22" textAnchor="middle" className="fill-muted text-[11px]">
          Scale 1 cm : 20 cm (write the ratio on the page)
        </text>
        <rect x="48" y="36" width="220" height="120" rx="4" stroke="currentColor" className="text-accent" strokeWidth="2" />
        <text x="158" y="56" textAnchor="middle" className="fill-muted text-[10px]">
          4.40 m → 22 cm on paper
        </text>
        <rect x="64" y="72" width="70" height="44" rx="3" className="fill-accent/15" stroke="currentColor" />
        <text x="99" y="98" textAnchor="middle" className="fill-foreground text-[10px]">
          desk
        </text>
        <path d="M48 156h40" stroke="currentColor" strokeWidth="1.6" />
        <text x="68" y="176" textAnchor="middle" className="fill-foreground text-[10px]">
          1 cm
        </text>
        <text x="300" y="90" className="fill-foreground text-[11px]">
          Door swing
        </text>
        <path d="M268 36q40 40 0 80" stroke="currentColor" className="text-warn" strokeWidth="1.4" strokeDasharray="4 3" />
        <text x="286" y="130" className="fill-muted text-[10px]">
          dashed = swing
        </text>
      </Svg>
    );
  }

  if (id === "food-web") {
    return (
      <Svg alt={alt}>
        <text x="200" y="22" textAnchor="middle" className="fill-muted text-[11px]">
          Arrows mean “is eaten by” — start from the sun
        </text>
        <text x="200" y="48" textAnchor="middle" className="fill-warn text-[11px]">
          Sun
        </text>
        <path d="M200 54v14" stroke="currentColor" strokeWidth="1.4" />
        {["Paperbark", "Grasses"].map((label, index) => (
          <g key={label}>
            <rect x={80 + index * 140} y="70" width="100" height="28" rx="6" className="fill-ok/15" stroke="currentColor" />
            <text x={130 + index * 140} y="88" textAnchor="middle" className="fill-foreground text-[11px]">
              {label}
            </text>
          </g>
        ))}
        <path d="M130 98v16" stroke="currentColor" strokeWidth="1.4" />
        <path d="M270 98v16" stroke="currentColor" strokeWidth="1.4" />
        <rect x="80" y="116" width="100" height="28" rx="6" className="fill-accent/15" stroke="currentColor" />
        <text x="130" y="134" textAnchor="middle" className="fill-foreground text-[11px]">
          Possum
        </text>
        <rect x="220" y="116" width="100" height="28" rx="6" className="fill-accent/15" stroke="currentColor" />
        <text x="270" y="134" textAnchor="middle" className="fill-foreground text-[11px]">
          Insect
        </text>
        <path d="M180 130h40" stroke="currentColor" strokeWidth="1.4" />
        <rect x="150" y="152" width="100" height="26" rx="6" stroke="currentColor" />
        <text x="200" y="170" textAnchor="middle" className="fill-foreground text-[11px]">
          Magpie
        </text>
      </Svg>
    );
  }

  if (id === "wifi-rooms") {
    return (
      <Svg alt={alt}>
        <text x="200" y="22" textAnchor="middle" className="fill-muted text-[11px]">
          Walk the rooms — write bars or dBm, not “it feels slow”
        </text>
        {[
          [28, 40, "Router", "full"],
          [118, 40, "Hall", "ok"],
          [208, 40, "Desk", "ok"],
          [298, 40, "Far room", "weak"],
        ].map(([x, y, label, signal]) => (
          <g key={String(label)}>
            <rect x={Number(x)} y={Number(y)} width="76" height="88" rx="8" stroke="currentColor" strokeWidth="1.5" />
            <text x={Number(x) + 38} y={Number(y) + 28} textAnchor="middle" className="fill-foreground text-[11px]">
              {label}
            </text>
            <text x={Number(x) + 38} y={Number(y) + 52} textAnchor="middle" className="fill-muted text-[10px]">
              {signal === "full" ? "||||" : signal === "ok" ? "|||" : "|"}
            </text>
            <text x={Number(x) + 38} y={Number(y) + 72} textAnchor="middle" className="fill-muted text-[9px]">
              {signal === "full" ? "near AP" : signal === "weak" ? "brick?" : "desk"}
            </text>
          </g>
        ))}
        <text x="200" y="156" textAnchor="middle" className="fill-foreground text-[11px]">
          Bars are a glyph (|||| vs |) — not a colour-only heat map
        </text>
        <text x="200" y="176" textAnchor="middle" className="fill-muted text-[10px]">
          One change: move AP, channel, or a wired backhaul — tied to a weak room
        </text>
      </Svg>
    );
  }

  if (id === "timer-wire") {
    return (
      <Svg alt={alt}>
        <rect x="70" y="24" width="260" height="140" rx="12" stroke="currentColor" className="text-accent" strokeWidth="2" />
        <text x="200" y="48" textAnchor="middle" className="fill-muted text-[11px]">
          Wireframe — states, not CSS
        </text>
        <text x="200" y="84" textAnchor="middle" className="fill-foreground text-[22px] font-semibold">
          12:00
        </text>
        <rect x="96" y="104" width="88" height="28" rx="8" stroke="currentColor" strokeWidth="1.4" />
        <text x="140" y="122" textAnchor="middle" className="fill-foreground text-[11px]">
          Start
        </text>
        <rect x="216" y="104" width="88" height="28" rx="8" stroke="currentColor" strokeDasharray="4 3" strokeWidth="1.4" />
        <text x="260" y="122" textAnchor="middle" className="fill-muted text-[11px]">
          Pause
        </text>
        <text x="200" y="154" textAnchor="middle" className="fill-muted text-[10px]">
          idle → running → paused → done · dashed = not active
        </text>
      </Svg>
    );
  }

  if (id === "privacy-stack") {
    return (
      <Svg alt={alt}>
        <text x="200" y="22" textAnchor="middle" className="fill-muted text-[11px]">
          One account, three surfaces to inventory
        </text>
        {[
          ["1 Profile", "Who can see a post?"],
          ["2 Sessions / apps", "Old phones still logged in?"],
          ["3 2FA / recovery", "SMS, app, or keys?"],
        ].map(([title, body], index) => (
          <g key={title}>
            <rect x="48" y={36 + index * 44} width="304" height="38" rx="8" className="fill-accent/10" stroke="currentColor" />
            <text x="64" y={58 + index * 44} className="fill-foreground text-[12px] font-medium">
              {title}
            </text>
            <text x="200" y={58 + index * 44} className="fill-muted text-[11px]">
              {body}
            </text>
          </g>
        ))}
      </Svg>
    );
  }

  if (id === "four-bar") {
    return (
      <Svg alt={alt}>
        <text x="200" y="24" textAnchor="middle" className="fill-muted text-[11px]">
          Counts: 1 e &amp; a — clap vs rest
        </text>
        {["1", "e", "&", "a", "2", "e", "&", "a", "3", "e", "&", "a", "4", "e", "&", "a"].map((label, index) => {
          const x = 28 + index * 23;
          const hit = index % 4 === 0 || index === 4 || index === 10;
          return (
            <g key={`${label}-${index}`}>
              <rect
                x={x}
                y="48"
                width="20"
                height="64"
                rx="3"
                className={hit ? "fill-accent/25" : "fill-transparent"}
                stroke="currentColor"
                strokeDasharray={hit ? undefined : "3 2"}
                strokeWidth="1.3"
              />
              <text x={x + 10} y="132" textAnchor="middle" className="fill-foreground text-[10px]">
                {label}
              </text>
            </g>
          );
        })}
        <text x="200" y="160" textAnchor="middle" className="fill-foreground text-[11px]">
          Filled = clap · dashed empty = rest (not a colour-only groove)
        </text>
        <text x="200" y="178" textAnchor="middle" className="fill-muted text-[10px]">
          Example backbeat on 2 and a syncopation on 3 &amp;
        </text>
      </Svg>
    );
  }

  if (id === "claim-test") {
    return (
      <Svg alt={alt}>
        <text x="200" y="22" textAnchor="middle" className="fill-muted text-[11px]">
          Fact-check card — wording, then a test, then a verdict
        </text>
        {[
          [24, "1 Quote", "Exact words + where"],
          [144, "2 Test", "What would falsify it?"],
          [264, "3 Two sources", "Then a leftover doubt"],
        ].map(([x, title, body]) => (
          <g key={String(title)}>
            <rect x={Number(x)} y="40" width="112" height="88" rx="10" stroke="currentColor" strokeWidth="1.5" />
            <text x={Number(x) + 56} y="72" textAnchor="middle" className="fill-foreground text-[12px] font-semibold">
              {title}
            </text>
            <text x={Number(x) + 56} y="100" textAnchor="middle" className="fill-muted text-[10px]">
              {body}
            </text>
          </g>
        ))}
        <text x="200" y="156" textAnchor="middle" className="fill-foreground text-[11px]">
          If nothing could prove it false, you are holding a slogan
        </text>
      </Svg>
    );
  }

  if (id === "cash-flow") {
    return (
      <Svg alt={alt}>
        <text x="200" y="24" textAnchor="middle" className="fill-muted text-[11px]">
          Cash in vs cash out — the difference must match the table
        </text>
        <rect x="40" y="44" width="140" height="88" rx="10" className="fill-ok/10" stroke="currentColor" />
        <text x="110" y="72" textAnchor="middle" className="fill-foreground text-[12px] font-semibold">
          In
        </text>
        <text x="110" y="96" textAnchor="middle" className="fill-muted text-[11px]">
          pay / shift
        </text>
        <text x="110" y="114" textAnchor="middle" className="fill-foreground text-[11px]">
          +
        </text>
        <rect x="220" y="44" width="140" height="88" rx="10" stroke="currentColor" strokeDasharray="5 3" />
        <text x="290" y="72" textAnchor="middle" className="fill-foreground text-[12px] font-semibold">
          Out
        </text>
        <text x="290" y="96" textAnchor="middle" className="fill-muted text-[11px]">
          food · bus · data
        </text>
        <text x="290" y="114" textAnchor="middle" className="fill-foreground text-[11px]">
          −
        </text>
        <text x="200" y="156" textAnchor="middle" className="fill-foreground text-[11px]">
          Solid box = money in · dashed box = money out (GST already in AU receipts)
        </text>
        <text x="200" y="176" textAnchor="middle" className="fill-muted text-[10px]">
          Negative leftover is a finding, not a rounding gift
        </text>
      </Svg>
    );
  }

  if (id === "suburb-map") {
    return (
      <Svg alt={alt}>
        <text x="200" y="22" textAnchor="middle" className="fill-muted text-[11px]">
          Sketch map — north, a scale guess, a legend
        </text>
        <rect x="40" y="36" width="240" height="120" rx="6" stroke="currentColor" strokeWidth="1.6" />
        <path d="M52 48h16v20h-8z" className="fill-foreground" />
        <text x="80" y="62" className="fill-foreground text-[10px]">
          N
        </text>
        <circle cx="90" cy="100" r="7" stroke="currentColor" />
        <text x="104" y="104" className="fill-foreground text-[10px]">
          shop
        </text>
        <rect x="160" y="80" width="18" height="14" stroke="currentColor" />
        <text x="184" y="92" className="fill-foreground text-[10px]">
          park
        </text>
        <text x="70" y="140" className="fill-muted text-[10px]">
          ~8 min walk
        </text>
        <text x="300" y="70" className="fill-foreground text-[11px]">
          Legend
        </text>
        <text x="300" y="90" className="fill-muted text-[10px]">
          ○ shop
        </text>
        <text x="300" y="108" className="fill-muted text-[10px]">
          □ park
        </text>
        <text x="300" y="140" className="fill-warn text-[10px]">
          gap: far block
        </text>
      </Svg>
    );
  }

  return <PathDiagram id={id as DiagramId} alt={alt} />;
}

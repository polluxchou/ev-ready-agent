import type { CSSProperties, ReactNode } from 'react';

export type IconName =
  | 'parking'
  | 'plug'
  | 'doc'
  | 'wrench'
  | 'globe'
  | 'bolt'
  | 'shield'
  | 'arrow'
  | 'check'
  | 'map'
  | 'pin'
  | 'car'
  | 'clock'
  | 'play'
  | 'chevron'
  | 'refresh'
  | 'sparkle'
  | 'sun'
  | 'moon';

const stroke = {
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
};

const paths: Record<IconName, ReactNode> = {
  parking: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" {...stroke} />
      <path d="M9 17V8h3.5a2.5 2.5 0 0 1 0 5H9" {...stroke} />
    </>
  ),
  plug: (
    <>
      <path d="M9 7V3M15 7V3" {...stroke} />
      <rect x="6" y="7" width="12" height="8" rx="2" {...stroke} />
      <path d="M12 15v3a3 3 0 0 0 3 3" {...stroke} />
    </>
  ),
  doc: (
    <>
      <path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" {...stroke} />
      <path d="M15 3v4h4M8 12h7M8 16h7M8 8h3" {...stroke} />
    </>
  ),
  wrench: (
    <>
      <path d="M14 7a3.5 3.5 0 1 0 3 3l4 4-3 3-4-4a3.5 3.5 0 0 1-3-3 3.5 3.5 0 0 1 3-3Z" {...stroke} />
      <path d="M10 13l-6 6" {...stroke} />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" {...stroke} />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" {...stroke} />
    </>
  ),
  bolt: <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" {...stroke} />,
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z" {...stroke} />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" {...stroke} />,
  check: <path d="M5 12l4 4 10-10" {...stroke} />,
  map: (
    <>
      <path d="m4 6 5-2 6 2 5-2v14l-5 2-6-2-5 2V6Z" {...stroke} />
      <path d="M9 4v16M15 6v16" {...stroke} />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12Z" {...stroke} />
      <circle cx="12" cy="9" r="2.5" {...stroke} />
    </>
  ),
  car: (
    <>
      <path d="M5 16v-3l2-5h10l2 5v3M5 16h14M5 16v3M19 16v3" {...stroke} />
      <circle cx="8" cy="16" r="1.5" {...stroke} />
      <circle cx="16" cy="16" r="1.5" {...stroke} />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" {...stroke} />
      <path d="M12 7v5l3 2" {...stroke} />
    </>
  ),
  play: <path d="M7 5v14l12-7L7 5Z" {...stroke} />,
  chevron: <path d="m9 6 6 6-6 6" {...stroke} />,
  refresh: (
    <>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 4v4h-4M21 12a9 9 0 0 1-15 6.7L3 16M3 20v-4h4" {...stroke} />
    </>
  ),
  sparkle: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2" {...stroke} />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" {...stroke} />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" {...stroke} />
    </>
  ),
  moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" {...stroke} />,
};

export const Icon = ({ name, size = 18 }: { name: IconName; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    {paths[name]}
  </svg>
);

export const ScoreRing = ({
  value,
  label = 'Order Confidence',
  max = 100,
  size = 168,
}: {
  value: number;
  label?: string;
  max?: number;
  size?: number;
}) => {
  const r = (size - 18) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / max);
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.19 240)" />
            <stop offset="100%" stopColor="oklch(0.78 0.17 155)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} className="ring-track" strokeWidth="9" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="ring-fill"
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
        />
      </svg>
      <div className="ring-num">
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
};

export type AgentId = 'parking' | 'charging' | 'service' | 'warranty';
export type AgentColor = 'blue' | 'green' | 'amber' | 'violet';

export type AgentDef = {
  code: string;
  name: string;
  color: AgentColor;
  short: string;
};

export const AGENTS: Record<AgentId, AgentDef> = {
  parking: { code: 'PD', name: 'Parking & Delivery', color: 'blue', short: 'Parking Agent' },
  charging: { code: 'CC', name: 'Charging & Compliance', color: 'green', short: 'Charging Agent' },
  service: { code: 'SN', name: 'Service Network', color: 'amber', short: 'Service Agent' },
  warranty: { code: 'WC', name: 'Warranty & Cases', color: 'violet', short: 'Warranty Agent' },
};

export const AgentTile = ({
  id,
  lg = false,
  pulse = false,
  style,
}: {
  id: AgentId;
  lg?: boolean;
  pulse?: boolean;
  style?: CSSProperties;
}) => {
  const a = AGENTS[id];
  return (
    <div className={`agent-tile ${a.color} ${lg ? 'lg' : ''}`} style={style}>
      {a.code}
      {pulse && <span className="pulse" />}
    </div>
  );
};

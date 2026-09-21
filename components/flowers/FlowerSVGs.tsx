import React from 'react';

export type FlowerType =
  | 'rose'
  | 'peony'
  | 'tulip'
  | 'orchid'
  | 'lily'
  | 'babysbreath'
  | 'ranunculus'
  | 'wildflower'
  | 'leaf'
  | 'stem';

interface FlowerSVGProps {
  size?: number;
  color?: string;
  className?: string;
}

const DEFAULT = {
  rose: '#C98291',
  peony: '#E8B8C0',
  tulip: '#D4A574',
  orchid: '#C9A96E',
  lily: '#EFE4D2',
  babysbreath: '#F7F1E8',
  ranunculus: '#E8B8C0',
  wildflower: '#C9A96E',
  leaf: '#87977D',
  stem: '#33483D',
};

export function Rose({ size = 120, color, className = '' }: FlowerSVGProps) {
  const c = color || DEFAULT.rose;
  const dark = '#8C5A6B';
  const light = '#E8B8C0';
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="rose-grad" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor={light} />
          <stop offset="50%" stopColor={c} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
      </defs>
      <g transform="translate(60 56)">
        {/* Outer petals */}
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <path
            key={angle}
            d="M0 -45 C-22 -42 -28 -20 -14 -8 C-8 -14 -4 -14 0 -14 C4 -14 8 -14 14 -8 C28 -20 22 -42 0 -45 Z"
            fill="url(#rose-grad)"
            opacity="0.85"
            transform={`rotate(${angle})`}
          />
        ))}
        {/* Inner petals */}
        {[30, 90, 150, 210, 270, 330].map((angle) => (
          <path
            key={angle}
            d="M0 -28 C-14 -26 -18 -12 -9 -4 C-5 -8 -2 -8 0 -8 C2 -8 5 -8 9 -4 C18 -12 14 -26 0 -28 Z"
            fill={c}
            opacity="0.9"
            transform={`rotate(${angle})`}
          />
        ))}
        {/* Center */}
        <circle r="8" fill={dark} opacity="0.7" />
        <circle r="5" fill={c} />
        <circle r="3" fill={dark} opacity="0.5" />
      </g>
    </svg>
  );
}

export function Peony({ size = 120, color, className = '' }: FlowerSVGProps) {
  const c = color || DEFAULT.peony;
  const light = '#F5D5DC';
  const dark = '#C98291';
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="peony-grad" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor={light} />
          <stop offset="60%" stopColor={c} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
      </defs>
      <g transform="translate(60 60)">
        {/* Outer ruffled petals */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * 360;
          return (
            <path
              key={`o-${i}`}
              d="M0 -48 C-18 -48 -30 -35 -28 -18 C-24 -28 -12 -32 0 -32 C12 -32 24 -28 28 -18 C30 -35 18 -48 0 -48 Z"
              fill="url(#peony-grad)"
              opacity="0.8"
              transform={`rotate(${a})`}
            />
          );
        })}
        {/* Middle layer */}
        {Array.from({ length: 7 }).map((_, i) => {
          const a = (i / 7) * 360 + 22;
          return (
            <path
              key={`m-${i}`}
              d="M0 -35 C-14 -35 -22 -25 -20 -12 C-16 -20 -8 -22 0 -22 C8 -22 16 -20 20 -12 C22 -25 14 -35 0 -35 Z"
              fill={c}
              opacity="0.88"
              transform={`rotate(${a})`}
            />
          );
        })}
        {/* Inner layer */}
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * 360;
          return (
            <path
              key={`i-${i}`}
              d="M0 -22 C-10 -22 -16 -14 -14 -5 C-10 -10 -5 -11 0 -11 C5 -11 10 -10 14 -5 C16 -14 10 -22 0 -22 Z"
              fill={light}
              opacity="0.9"
              transform={`rotate(${a})`}
            />
          );
        })}
        <circle r="7" fill={dark} opacity="0.4" />
        <circle r="4" fill="#F5D5DC" />
      </g>
    </svg>
  );
}

export function Tulip({ size = 120, color, className = '' }: FlowerSVGProps) {
  const c = color || DEFAULT.tulip;
  const dark = '#A67844';
  const light = '#E8C89A';
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="tulip-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="60%" stopColor={c} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
      </defs>
      <g transform="translate(60 55)">
        {/* Stem */}
        <path d="M0 15 Q-2 35 0 58" stroke={DEFAULT.stem} strokeWidth="2.5" fill="none" opacity="0.7" />
        {/* Leaf */}
        <path d="M0 35 Q-18 40 -20 55 Q-10 52 0 48" fill={DEFAULT.leaf} opacity="0.7" />
        {/* Outer petals */}
        <path d="M-22 -30 C-30 -10 -25 15 -18 18 C-12 12 -8 -5 -8 -20 C-12 -28 -18 -30 -22 -30 Z" fill={dark} opacity="0.85" />
        <path d="M22 -30 C30 -10 25 15 18 18 C12 12 8 -5 8 -20 C12 -28 18 -30 22 -30 Z" fill={dark} opacity="0.85" />
        {/* Center petal */}
        <path d="M0 -38 C-15 -35 -18 -15 -12 10 C-6 6 -3 -10 0 -16 C3 -10 6 6 12 10 C18 -15 15 -35 0 -38 Z" fill="url(#tulip-grad)" />
        {/* Side petals front */}
        <path d="M-16 -28 C-24 -14 -20 10 -10 14 C-6 8 -4 -8 -4 -22 C-8 -28 -12 -30 -16 -28 Z" fill={c} opacity="0.92" />
        <path d="M16 -28 C24 -14 20 10 10 14 C6 8 4 -8 4 -22 C8 -28 12 -30 16 -28 Z" fill={c} opacity="0.92" />
      </g>
    </svg>
  );
}

export function Orchid({ size = 120, color, className = '' }: FlowerSVGProps) {
  const c = color || DEFAULT.orchid;
  const dark = '#8A7035';
  const light = '#E0CB9E';
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="orchid-grad" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={light} />
          <stop offset="70%" stopColor={c} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
      </defs>
      <g transform="translate(60 58)">
        {/* Top petal */}
        <path d="M0 -40 C-14 -38 -20 -25 -16 -12 C-8 -18 -4 -18 0 -18 C4 -18 8 -18 16 -12 C20 -25 14 -38 0 -40 Z" fill="url(#orchid-grad)" />
        {/* Side petals */}
        <path d="M-30 -10 C-44 -8 -48 12 -34 22 C-28 12 -22 0 -18 -6 C-22 -12 -26 -12 -30 -10 Z" fill={c} opacity="0.9" />
        <path d="M30 -10 C44 -8 48 12 34 22 C28 12 22 0 18 -6 C22 -12 26 -12 30 -10 Z" fill={c} opacity="0.9" />
        {/* Bottom petals */}
        <path d="M-14 -5 C-22 5 -20 22 -10 26 C-6 18 -4 8 -2 -2 C-6 -4 -10 -5 -14 -5 Z" fill={dark} opacity="0.85" />
        <path d="M14 -5 C22 5 20 22 10 26 C6 18 4 8 2 -2 C6 -4 10 -5 14 -5 Z" fill={dark} opacity="0.85" />
        {/* Lip */}
        <path d="M0 -10 C-10 -8 -12 6 -8 18 C-4 14 -2 8 0 4 C2 8 4 14 8 18 C12 6 10 -8 0 -10 Z" fill={light} />
        <circle r="4" fill={dark} opacity="0.6" />
      </g>
    </svg>
  );
}

export function Lily({ size = 120, color, className = '' }: FlowerSVGProps) {
  const c = color || DEFAULT.lily;
  const dark = '#C9A96E';
  const accent = '#C98291';
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} style={{ overflow: 'visible' }}>
      <g transform="translate(60 60)">
        {/* Stem */}
        <path d="M0 20 Q2 40 0 55" stroke={DEFAULT.stem} strokeWidth="2" fill="none" opacity="0.6" />
        {/* Petals - 6 elongated */}
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path
              d="M0 -8 C-10 -28 -10 -48 0 -52 C10 -48 10 -28 0 -8 Z"
              fill={c}
              opacity="0.88"
              stroke={dark}
              strokeWidth="0.5"
            />
            <path
              d="M0 -12 C-5 -30 -5 -44 0 -46 C5 -44 5 -30 0 -12 Z"
              fill={dark}
              opacity="0.3"
            />
          </g>
        ))}
        {/* Stamens */}
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * 360;
          return (
            <g key={`s-${i}`} transform={`rotate(${a})`}>
              <line x1="0" y1="-6" x2="0" y2="-18" stroke={accent} strokeWidth="1.5" />
              <circle cx="0" cy="-20" r="2.5" fill={accent} opacity="0.8" />
            </g>
          );
        })}
        <circle r="5" fill={dark} opacity="0.6" />
      </g>
    </svg>
  );
}

export function BabyBreath({ size = 120, color, className = '' }: FlowerSVGProps) {
  const c = color || DEFAULT.babysbreath;
  const dark = '#D8CFC0';
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} style={{ overflow: 'visible' }}>
      <g transform="translate(60 60)">
        {/* Stem cluster */}
        <path d="M0 50 L0 20 M0 20 L-15 10 M0 20 L15 12 M0 20 L-8 5 M0 20 L10 0 M0 20 L-20 0 M0 20 L20 -5"
          stroke={DEFAULT.leaf} strokeWidth="0.8" fill="none" opacity="0.5" />
        {/* Tiny flowers scattered */}
        {[
          { x: 0, y: 15, r: 3 }, { x: -15, y: 8, r: 2.5 }, { x: 15, y: 10, r: 2.8 },
          { x: -8, y: 3, r: 2.2 }, { x: 10, y: -2, r: 2.5 }, { x: -20, y: -2, r: 2.8 },
          { x: 20, y: -7, r: 2.2 }, { x: -12, y: -12, r: 2.5 }, { x: 8, y: -15, r: 2.8 },
          { x: -5, y: -22, r: 2.2 }, { x: 15, y: -20, r: 2.5 }, { x: -18, y: -18, r: 2.2 },
          { x: 0, y: -28, r: 2.8 }, { x: -10, y: -30, r: 2.2 }, { x: 12, y: -32, r: 2.5 },
          { x: -3, y: -38, r: 2.2 }, { x: 8, y: -42, r: 2 }, { x: -8, y: -40, r: 2 },
        ].map((f, i) => (
          <g key={i} transform={`translate(${f.x} ${f.y})`}>
            <circle r={f.r} fill={c} opacity="0.9" />
            <circle r={f.r * 0.5} fill={dark} opacity="0.4" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function Ranunculus({ size = 120, color, className = '' }: FlowerSVGProps) {
  const c = color || DEFAULT.ranunculus;
  const light = '#F0D0D8';
  const dark = '#B07080';
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="ran-grad" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={c} />
        </radialGradient>
      </defs>
      <g transform="translate(60 58)">
        {/* Many tightly packed petals */}
        {Array.from({ length: 5 }).map((_, ring) => {
          const count = 5 + ring * 2;
          const radius = 10 + ring * 8;
          return Array.from({ length: count }).map((_, i) => {
            const a = (i / count) * 360 + ring * 15;
            const x = Math.cos((a * Math.PI) / 180) * radius;
            const y = Math.sin((a * Math.PI) / 180) * radius;
            return (
              <ellipse
                key={`${ring}-${i}`}
                cx={x}
                cy={y}
                rx={6 - ring * 0.6}
                ry={8 - ring * 0.8}
                fill={ring % 2 === 0 ? 'url(#ran-grad)' : c}
                opacity={0.9 - ring * 0.05}
                transform={`rotate(${a} ${x} ${y})`}
              />
            );
          });
        })}
        <circle r="6" fill={light} opacity="0.9" />
        <circle r="3" fill={dark} opacity="0.3" />
      </g>
    </svg>
  );
}

export function Wildflower({ size = 120, color, className = '' }: FlowerSVGProps) {
  const c = color || DEFAULT.wildflower;
  const light = '#E8D8B0';
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} style={{ overflow: 'visible' }}>
      <g transform="translate(60 58)">
        {/* Stem */}
        <path d="M0 18 Q-1 35 0 52" stroke={DEFAULT.stem} strokeWidth="1.5" fill="none" opacity="0.6" />
        {/* 5 petals */}
        {[0, 72, 144, 216, 288].map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <ellipse cx="0" cy="-22" rx="8" ry="14" fill={c} opacity="0.85" />
            <ellipse cx="0" cy="-22" rx="4" ry="8" fill={light} opacity="0.6" />
          </g>
        ))}
        <circle r="7" fill={light} opacity="0.9" />
        <circle r="4" fill={c} opacity="0.7" />
      </g>
    </svg>
  );
}

export function Leaf({ size = 120, color, className = '' }: FlowerSVGProps) {
  const c = color || DEFAULT.leaf;
  const dark = '#5A6B52';
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="leaf-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
      </defs>
      <g transform="translate(60 60)">
        <path
          d="M0 -50 C-20 -40 -32 -15 -28 10 C-22 30 -8 45 0 48 C8 45 22 30 28 10 C32 -15 20 -40 0 -50 Z"
          fill="url(#leaf-grad)"
          opacity="0.85"
        />
        {/* Vein */}
        <path d="M0 -45 L0 44" stroke={dark} strokeWidth="1" fill="none" opacity="0.4" />
        <path d="M0 -25 L-18 -12 M0 -25 L18 -12 M0 -5 L-22 5 M0 -5 L22 5 M0 15 L-16 22 M0 15 L16 22"
          stroke={dark} strokeWidth="0.5" fill="none" opacity="0.3" />
      </g>
    </svg>
  );
}

export function Stem({ size = 120, color, className = '' }: FlowerSVGProps) {
  const c = color || DEFAULT.stem;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} style={{ overflow: 'visible' }}>
      <g transform="translate(60 60)">
        <path d="M0 55 Q-3 30 0 5 Q3 -20 0 -45" stroke={c} strokeWidth="2.5" fill="none" opacity="0.7" />
        <path d="M0 30 Q-15 25 -22 15" stroke={c} strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M0 10 Q15 5 22 -5" stroke={c} strokeWidth="1" fill="none" opacity="0.5" />
      </g>
    </svg>
  );
}

export const FlowerSVGs: Record<FlowerType, React.FC<FlowerSVGProps>> = {
  rose: Rose,
  peony: Peony,
  tulip: Tulip,
  orchid: Orchid,
  lily: Lily,
  babysbreath: BabyBreath,
  ranunculus: Ranunculus,
  wildflower: Wildflower,
  leaf: Leaf,
  stem: Stem,
};

export function PetalSVG({ size = 24, color = '#C98291' }: { size?: number; color?: string }) {
  const dark = '#8C5A6B';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id={`petal-${color.slice(1)}`} cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={dark} stopOpacity="0.6" />
        </radialGradient>
      </defs>
      <path
        d="M12 2C7 6 4 11 4 15c0 4 3 7 8 7s8-3 8-7c0-4-3-9-8-13z"
        fill={`url(#petal-${color.slice(1)})`}
        opacity="0.75"
      />
    </svg>
  );
}

export { DEFAULT as FLOWER_COLORS };

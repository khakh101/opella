"use client";

import React from "react";
import { Bot, Users } from "lucide-react";

// Miro-style building blocks shared by every frame of the lifecycle board.

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

// ---------------------------------------------------------------------
// Gate diamond: dashed violet = agent gate, solid pink = human gate
// ---------------------------------------------------------------------

interface GateDiamondProps {
  id: string;
  label?: string;
  type: "agent" | "human";
  size?: number;
  onOpen?: () => void;
  highlight?: boolean;
  dimmed?: boolean;
  showDetailsButton?: boolean;
  caption?: string;
}

export const GateDiamond: React.FC<GateDiamondProps> = ({
  id,
  label,
  type,
  size = 64,
  onOpen,
  highlight,
  dimmed,
  showDetailsButton = true,
  caption,
}) => {
  const isAgent = type === "agent";
  return (
    <div
      className={cx("flex flex-col items-center transition-opacity", dimmed && "opacity-50")}
      style={{ width: Math.max(size + 36, 96) }}
    >
      <div
        className={cx(
          "mb-1 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-black tracking-wider",
          isAgent ? "bg-violet-600 text-white" : "bg-gray-800 text-white"
        )}
      >
        {isAgent ? <Bot className="h-3 w-3" /> : <Users className="h-3 w-3" />}
        {isAgent ? "AGENT" : "HUMAN"}
      </div>
      <button
        type="button"
        onDoubleClick={onOpen}
        title="Double-click for details"
        className="relative flex items-center justify-center focus:outline-none"
        style={{ width: size * 1.42, height: size * 1.42 }}
      >
        <span
          className={cx(
            "absolute rotate-45 rounded-md shadow-md transition-transform",
            isAgent
              ? "border-[3px] border-dashed border-violet-500 bg-violet-50"
              : "border-2 border-pink-600 bg-pink-500",
            highlight && "ring-4 ring-offset-2 ring-amber-300",
            onOpen && "hover:scale-110"
          )}
          style={{ width: size, height: size }}
        />
        <span
          className={cx(
            "relative text-sm font-black",
            isAgent ? "text-violet-800" : "text-white"
          )}
        >
          {id}
        </span>
      </button>
      {label && (
        <div className="mt-1 text-center text-[11px] font-bold leading-tight text-gray-800">{label}</div>
      )}
      {caption && <div className="text-center text-[10px] leading-tight text-gray-500">{caption}</div>}
      {showDetailsButton && onOpen && (
        <button
          type="button"
          onClick={onOpen}
          className="mt-1 rounded-full border border-gray-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-gray-600 shadow-sm hover:border-gray-500 hover:text-gray-900"
        >
          Details
        </button>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------
// Sticky note
// ---------------------------------------------------------------------

const STICKY_COLORS = {
  yellow: "bg-[#fff59d] border-amber-300 text-amber-950",
  blue: "bg-[#d4ecfb] border-sky-300 text-sky-950",
  green: "bg-[#d7f0dc] border-emerald-300 text-emerald-950",
  pink: "bg-[#fbd9e6] border-pink-300 text-pink-950",
  violet: "bg-[#e8defc] border-violet-300 text-violet-950",
  orange: "bg-[#fde2c4] border-orange-300 text-orange-950",
  red: "bg-[#fbd1cf] border-red-300 text-red-950",
} as const;

export type StickyColor = keyof typeof STICKY_COLORS;

interface StickyProps {
  color?: StickyColor;
  title?: string;
  children?: React.ReactNode;
  tilt?: number;
  className?: string;
  style?: React.CSSProperties;
  onOpen?: () => void;
}

export const Sticky: React.FC<StickyProps> = ({
  color = "yellow",
  title,
  children,
  tilt = 0,
  className,
  style,
  onOpen,
}) => (
  <div
    onDoubleClick={onOpen}
    className={cx(
      "rounded-sm border p-3 text-xs leading-snug shadow-[2px_3px_6px_rgba(0,0,0,0.12)] transition-transform",
      STICKY_COLORS[color],
      onOpen && "cursor-pointer hover:scale-[1.03]",
      className
    )}
    style={{ transform: `rotate(${tilt}deg)`, ...style }}
  >
    {title && <div className="mb-1 text-[11px] font-black">{title}</div>}
    {children}
  </div>
);

// ---------------------------------------------------------------------
// Card (white Miro card with coloured top strip label)
// ---------------------------------------------------------------------

interface CardProps {
  kicker?: string;
  title: string;
  children?: React.ReactNode;
  onOpen?: () => void;
  className?: string;
  style?: React.CSSProperties;
  accent?: string; // hex
  dimmed?: boolean;
  highlight?: boolean;
}

export const MiroCard: React.FC<CardProps> = ({
  kicker,
  title,
  children,
  onOpen,
  className,
  style,
  accent = "#374151",
  dimmed,
  highlight,
}) => (
  <div
    onDoubleClick={onOpen}
    className={cx(
      "rounded-lg border bg-white p-3 shadow-md transition-all",
      onOpen && "cursor-pointer hover:-translate-y-0.5 hover:shadow-lg",
      dimmed && "opacity-60",
      className
    )}
    style={{
      borderColor: highlight ? accent : "#e5e7eb",
      boxShadow: highlight ? `0 0 0 3px ${accent}33, 0 4px 10px rgba(0,0,0,0.08)` : undefined,
      ...style,
    }}
  >
    {kicker && (
      <div className="mb-1 text-[10px] font-black uppercase tracking-wider" style={{ color: accent }}>
        {kicker}
      </div>
    )}
    <div className="text-[13px] font-bold leading-tight text-gray-900">{title}</div>
    {children && <div className="mt-1 text-[11px] leading-snug text-gray-600">{children}</div>}
    {onOpen && <div className="mt-2 text-[10px] font-semibold text-gray-400">Double-click to open</div>}
  </div>
);

// ---------------------------------------------------------------------
// Frame (Miro frame with a title tab)
// ---------------------------------------------------------------------

interface FrameProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const MiroFrame: React.FC<FrameProps> = ({ title, subtitle, children, className }) => (
  <div className={cx("relative rounded-xl border border-gray-300 bg-white/90 p-6 pt-8 shadow-sm", className)}>
    <div className="absolute -top-3 left-4 rounded bg-white px-2 text-xs font-bold text-gray-500">
      {title}
      {subtitle && <span className="ml-2 font-normal text-gray-400">{subtitle}</span>}
    </div>
    {children}
  </div>
);

// Small horizontal connector arrow used in flex layouts
export const FlowArrow: React.FC<{ label?: string; dashed?: boolean; width?: number }> = ({
  label,
  dashed,
  width = 48,
}) => (
  <div className="flex shrink-0 flex-col items-center justify-center" style={{ width }}>
    {label && <div className="mb-0.5 text-[10px] font-semibold text-gray-500">{label}</div>}
    <svg width={width} height="12" viewBox={`0 0 ${width} 12`}>
      <line
        x1="0"
        y1="6"
        x2={width - 8}
        y2="6"
        stroke="#6b7280"
        strokeWidth="2"
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      <polygon points={`${width - 8},1 ${width},6 ${width - 8},11`} fill="#6b7280" />
    </svg>
  </div>
);

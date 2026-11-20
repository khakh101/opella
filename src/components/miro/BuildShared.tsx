"use client";

import React from "react";
import { Bot, User, X } from "lucide-react";
import { BUILD_MODES, BUILD_MODE_ORDER, BuildMode, Chip, ORIGIN, Origin, TeamRole } from "@/lib/miroBuild";
import { cx } from "./MiroPrimitives";

// Small coloured pill: who takes part, coloured by where the role sits
export const WhoChip: React.FC<{ chip: Chip; size?: "sm" | "md" }> = ({ chip, size = "sm" }) => {
  const o = ORIGIN[chip.origin];
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border font-semibold leading-none",
        size === "sm" ? "px-2 py-1 text-[10px]" : "px-2.5 py-1.5 text-xs",
        chip.origin === "external" && "border-dashed"
      )}
      style={{ background: o.soft, borderColor: o.color, color: "#1f2937" }}
    >
      {chip.origin === "agent" ? (
        <Bot className="h-3 w-3" style={{ color: o.color }} />
      ) : (
        <span className="inline-block h-2 w-2 rounded-full" style={{ background: o.color }} />
      )}
      {chip.label}
    </span>
  );
};

// Avatar used in the team deep dives (Roles slide look: pastel circle, NEW tag, ring)
export const RoleAvatar: React.FC<{ r: TeamRole }> = ({ r }) => {
  const o = ORIGIN[r.origin];
  const dai = ORIGIN.dai;
  const bs = ORIGIN.bs;
  return (
    <div className="flex w-[104px] flex-col items-center text-center" title={r.note}>
      <div className="relative">
        <div
          className={cx(
            "flex h-14 w-14 items-center justify-center rounded-full",
            r.external || r.origin === "external" ? "border-2 border-dashed" : "border",
            r.deployed && "ring-4 ring-offset-2"
          )}
          style={{
            background: r.split ? `linear-gradient(135deg, ${bs.soft} 50%, ${dai.soft} 50%)` : o.soft,
            borderColor: r.split ? dai.color : o.color,
            // ring colour for the profiles deployed on the function side
            ["--tw-ring-color" as string]: ORIGIN.function.color,
          }}
        >
          {r.origin === "agent" ? (
            <Bot className="h-6 w-6" style={{ color: o.color }} />
          ) : (
            <User className="h-6 w-6" style={{ color: r.split ? dai.color : o.color }} />
          )}
        </div>
        {r.isNew && (
          <span className="absolute -right-3 -top-2 rounded-full bg-pink-600 px-1.5 py-0.5 text-[9px] font-black text-white shadow">
            NEW
          </span>
        )}
      </div>
      <div className="mt-1.5 text-[12px] font-bold leading-tight text-gray-900">
        {r.role}
        {r.external && "*"}
      </div>
      {r.note && <div className="mt-0.5 text-[10px] leading-tight text-gray-500">{r.note}</div>}
    </div>
  );
};

export const OriginLegend: React.FC<{ origins?: Origin[]; showRing?: boolean }> = ({
  origins = ["function", "to", "dai", "bs", "external"],
  showRing,
}) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-600">
    {origins.map((k) => (
      <span key={k} className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-3 rounded-full border-2" style={{ background: ORIGIN[k].soft, borderColor: ORIGIN[k].color }} />
        {ORIGIN[k].label}
      </span>
    ))}
    {showRing && (
      <span className="flex items-center gap-1.5">
        <span
          className="inline-block h-3 w-3 rounded-full border-2 ring-2 ring-offset-1"
          style={{ background: ORIGIN.dai.soft, borderColor: ORIGIN.dai.color, ["--tw-ring-color" as string]: ORIGIN.function.color }}
        />
        Data & AI profile deployed on the function side
      </span>
    )}
  </div>
);

// Mode switcher used inside panels and modals
export const ModePills: React.FC<{
  value: BuildMode;
  onChange: (m: BuildMode) => void;
}> = ({ value, onChange }) => (
  <div className="inline-flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
    {BUILD_MODE_ORDER.map((m) => (
      <button
        key={m}
        onClick={() => onChange(m)}
        className={cx(
          "rounded-md px-2.5 py-1 text-[11px] font-bold transition-colors",
          value === m ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-800"
        )}
        style={value === m ? { color: BUILD_MODES[m].color } : undefined}
      >
        {BUILD_MODES[m].label}
      </button>
    ))}
  </div>
);

export const CloseButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-800" aria-label="Close">
    <X className="h-5 w-5" />
  </button>
);

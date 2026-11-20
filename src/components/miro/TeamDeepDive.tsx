"use client";

import React, { useEffect } from "react";
import { BUILD_MODES, BuildMode, ORIGIN, TEAM_VIEWS, TRANSVERSAL_TEAMS } from "@/lib/miroBuild";
import { CloseButton, ModePills, OriginLegend, RoleAvatar } from "./BuildShared";

interface TeamDeepDiveProps {
  mode: Exclude<BuildMode, "self-service">;
  onClose: () => void;
  onChange: (m: BuildMode) => void;
}

const LEVERAGE_COLOR = {
  Function: ORIGIN.function,
  "Data & AI": ORIGIN.dai,
  "Transformation Office": ORIGIN.to,
} as const;

export const TeamDeepDive: React.FC<TeamDeepDiveProps> = ({ mode, onClose, onChange }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const team = TEAM_VIEWS[mode]!;
  const m = BUILD_MODES[mode];
  const hasRing = team.roles.some((r) => r.deployed);
  const hasExternal = team.roles.some((r) => r.external);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-6">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-[1080px] rounded-2xl bg-white shadow-2xl" style={{ borderTop: `6px solid ${m.color}` }}>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-4">
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-gray-400">Team deep dive</div>
            <h3 className="text-xl font-black text-gray-900">{team.title}</h3>
            <p className="text-sm text-gray-500">{team.subtitle}</p>
          </div>
          <div className="flex items-start gap-3">
            <ModePills value={mode} onChange={onChange} />
            <CloseButton onClick={onClose} />
          </div>
        </div>

        <div className="space-y-6 px-6 py-5">
          {/* Squad */}
          <section>
            <div className="mb-2 flex items-baseline justify-between">
              <h4 className="text-sm font-black text-gray-900">
                Use case squad <span className="font-semibold text-gray-400">· {team.squadName}</span>
              </h4>
              <span className="text-[11px] text-gray-500">Roles, not people</span>
            </div>
            <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-[#faf9f4] p-6">
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-6">
                {team.roles.map((r) => (
                  <RoleAvatar key={r.role + r.origin} r={r} />
                ))}
              </div>

              {team.inSupport && (
                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-3">
                  <div className="mb-2 text-[11px] font-black uppercase tracking-wider text-gray-500">In support, from Data & AI</div>
                  <div className="flex flex-wrap justify-center gap-6">
                    {team.inSupport.map((r) => (
                      <RoleAvatar key={"s" + r.role} r={r} />
                    ))}
                  </div>
                </div>
              )}

              {team.extras && (
                <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-3">
                  <div className="mb-2 text-[11px] font-black uppercase tracking-wider text-gray-500">Also in this mode</div>
                  <div className="flex flex-wrap justify-center gap-6">
                    {team.extras.map((r) => (
                      <RoleAvatar key={"x" + r.role} r={{ ...r, external: r.origin === "external" ? false : r.external }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-2 space-y-1">
              <OriginLegend showRing={hasRing} />
              {hasExternal && (
                <div className="text-[11px] text-gray-500">* External team or business-side resource, with Data & AI guidance (example: M&S)</div>
              )}
              <div className="text-[11px] text-gray-500">Digital PO comes from Data & AI or Business Solutions, per use case</div>
            </div>
          </section>

          {/* Leverage */}
          <section>
            <h4 className="mb-2 text-sm font-black text-gray-900">How the three teams are used in this mode</h4>
            <div className="grid grid-cols-3 gap-3">
              {team.leverage.map((l) => {
                const c = LEVERAGE_COLOR[l.who];
                return (
                  <div key={l.who} className="rounded-xl border p-4" style={{ borderColor: c.color, background: c.soft }}>
                    <div className="text-[11px] font-black uppercase tracking-wider" style={{ color: c.color }}>
                      {l.who}
                    </div>
                    <div className="mt-1 text-base font-black text-gray-900">{l.role}</div>
                    <p className="mt-1 text-xs leading-snug text-gray-700">{l.detail}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Transversal */}
          <section>
            <div className="mb-2 flex items-baseline justify-between">
              <h4 className="text-sm font-black text-gray-900">Transversal teams</h4>
              <span className="text-[11px] text-gray-500">Present whatever the mode</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {TRANSVERSAL_TEAMS.map((t) => {
                const o = ORIGIN[t.origin];
                return (
                  <div key={t.name} className="rounded-lg border border-dashed p-2.5" style={{ borderColor: o.color, background: o.soft }}>
                    <div className="text-[11px] font-black leading-tight" style={{ color: o.color }}>
                      {t.name}
                    </div>
                    <ul className="mt-1.5 space-y-0.5">
                      {t.members.map((mm) => (
                        <li key={mm} className="text-[11px] leading-tight text-gray-800">
                          {mm}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="border-t border-gray-200 px-6 py-2 text-[10px] text-gray-400">
          Source: Operating model & adoption deck, Pillar 2 Roles (squad modes and transversal teams)
        </div>
      </div>
    </div>
  );
};

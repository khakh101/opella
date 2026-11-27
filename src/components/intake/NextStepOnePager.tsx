"use client";

import React from "react";
import { ArrowLeft, Rocket } from "lucide-react";
import { BUILD_MODES, BUILD_STEPS, ORIGIN, Chip } from "@/lib/miroBuild";
import { ModeId, STEPS } from "@/lib/miroLifecycle";
import { USER_BUILD_VIEW } from "@/lib/buildUserView";
import { Details } from "@/components/ui/Details";

interface NextStepOnePagerProps {
  mode: ModeId;
  onChangeMode: (mode: ModeId) => void;
  onBack: () => void;
  backLabel: string;
}

const MODE_TABS: { id: ModeId; mode: string; quote?: string }[] = [
  { id: "for-me", mode: "Mode 1", quote: "We ride for you" },
  { id: "with-me", mode: "Mode 2", quote: "We ride together" },
  { id: "enable-me", mode: "Mode 3", quote: "We give you the right bike and the map" },
  { id: "self-service", mode: "Self-service" },
];

const ChipList: React.FC<{ chips: Chip[] }> = ({ chips }) => (
  <div className="flex flex-wrap gap-1.5">
    {chips.map((c) => (
      <span
        key={c.label}
        className="rounded-md px-2 py-0.5 text-[11px] font-bold"
        style={{ background: ORIGIN[c.origin].soft, color: ORIGIN[c.origin].color }}
      >
        {c.label}
      </span>
    ))}
  </div>
);

// One pager shown after step 4: what happens next (Build MVP) for the chosen mode.
// Content comes from the Build view of the Miro board (src/lib/miroBuild.ts).
export const NextStepOnePager: React.FC<NextStepOnePagerProps> = ({
  mode,
  onChangeMode,
  onBack,
  backLabel,
}) => {
  const m = BUILD_MODES[mode];
  const tab = MODE_TABS.find((t) => t.id === mode);
  const prescale = STEPS.find((s) => s.id === "prescale");
  const uv = USER_BUILD_VIEW[mode];

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {backLabel}
      </button>

      <div className="rounded-2xl border border-opella-border bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-opella-border p-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
              After step 4 · GO BUILD
            </div>
            <h2 className="mt-1 flex items-center gap-2 text-2xl font-black text-opella-forest">
              <span aria-hidden="true">🚀</span> Next step: Build (MVP)
            </h2>
            <p className="mt-1 text-sm text-gray-600">Build and test the MVP in the selected delivery mode</p>
          </div>
          <div role="tablist" aria-label="Delivery mode" className="flex flex-wrap gap-2">
            {MODE_TABS.map((t) => {
              const active = t.id === mode;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onChangeMode(t.id)}
                  className={`min-h-[44px] rounded-full border px-4 text-sm font-bold transition-colors ${
                    active
                      ? "border-opella-forest bg-opella-forest text-white"
                      : "border-gray-300 bg-white text-gray-800 hover:border-opella-forest"
                  }`}
                >
                  {t.mode} · {BUILD_MODES[t.id].label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode summary */}
        <div className="grid grid-cols-1 gap-0 border-b border-opella-border lg:grid-cols-3">
          <div className="p-6 lg:border-r lg:border-opella-border">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ background: m.color }} aria-hidden="true" />
              <span className="text-lg font-black text-gray-900">{m.label}</span>
            </div>
            {tab?.quote && <div className="mt-1 text-sm italic text-gray-600">“{tab.quote}”</div>}
            <div className="mt-3 text-sm font-semibold text-opella-forest">{m.tagline}</div>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{m.whoBuilds}</p>
          </div>
          <div className="p-6 lg:border-r lg:border-opella-border">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Who builds</div>
            <ChipList chips={m.builders} />
          </div>
          <div className="p-6">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Support</div>
            <ChipList chips={m.support} />
          </div>
        </div>

        {/* Deep dive: what the build means for the user */}
        <div className="border-b border-opella-border p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                What the build means for you
              </div>
              <p className="mt-1 max-w-3xl text-sm text-gray-800">{uv.summary}</p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-[#faf8f5] px-4 py-3">
              <span className="text-xs font-bold text-gray-500">Your effort</span>
              <span className="flex gap-1" aria-hidden="true">
                {[1, 2, 3].map((n) => (
                  <span
                    key={n}
                    className="h-3 w-7 rounded-sm"
                    style={{ background: n <= uv.effort ? m.color : "#e5e7eb" }}
                  />
                ))}
              </span>
              <span className="text-sm font-black text-gray-900">{uv.effortLabel}</span>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                  <th scope="col" className="w-[22%] border-b border-gray-200 pb-2 pr-4 font-bold">Build step</th>
                  <th scope="col" className="w-[39%] border-b border-gray-200 pb-2 pr-4 font-bold" style={{ color: m.color }}>
                    You do
                  </th>
                  <th scope="col" className="w-[39%] border-b border-gray-200 pb-2 font-bold">{uv.othersLabel}</th>
                </tr>
              </thead>
              <tbody>
                {BUILD_STEPS.map((s) => (
                  <tr key={s.n} className="align-top">
                    <td className="border-b border-gray-100 py-3 pr-4 font-bold text-gray-900">
                      {s.n}. {s.name}
                    </td>
                    <td className="border-b border-gray-100 py-3 pr-4 text-gray-900">{uv.you[s.n]}</td>
                    <td className="border-b border-gray-100 py-3 text-gray-600">{uv.others[s.n]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* The 4 build steps */}
        <div className="p-6">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">The 4 build steps</div>
          <ol className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {BUILD_STEPS.map((s) => {
              const cell = m.steps[s.n];
              return (
                <li key={s.n} className="flex flex-col rounded-xl border border-gray-200 bg-[#faf8f5] p-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                      style={{ background: m.color }}
                    >
                      {s.n}
                    </span>
                    <span className="text-sm font-black text-gray-900">{s.name}</span>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-gray-800">{cell.short}</div>
                  <div className="mt-3">
                    <ChipList chips={cell.who} />
                  </div>
                  <div className="mt-3">
                    <Details title="What happens">
                      <ul className="space-y-1.5">
                        {cell.happens.map((h) => (
                          <li key={h} className="flex gap-2 text-xs leading-snug text-gray-700">
                            <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: m.color }} />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </Details>
                  </div>
                  <div className="mt-auto pt-3 text-xs text-gray-700">
                    <span className="font-bold text-gray-900">Output: </span>
                    {cell.output}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Then */}
        {prescale && (
          <div className="flex flex-wrap items-center gap-3 rounded-b-2xl border-t border-opella-border bg-gray-50 px-6 py-4 text-sm text-gray-700">
            <Rocket className="h-4 w-4 text-opella-forest" aria-hidden="true" />
            <span className="font-bold text-gray-900">Then: {prescale.name}</span>
            <span>{prescale.oneLiner}</span>
            <span className="rounded bg-pink-500 px-2 py-0.5 text-[11px] font-black text-white">G5 · Scale validation</span>
          </div>
        )}
      </div>
    </div>
  );
};

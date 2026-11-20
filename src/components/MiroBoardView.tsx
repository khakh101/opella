"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Lightbulb, Maximize, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { EXAMPLES, MODES, PATHS, PATH_ORDER, PathId, STEPS, StepId, exampleById } from "@/lib/miroLifecycle";
import { cx } from "@/components/miro/MiroPrimitives";
import { MiroOverview } from "@/components/miro/MiroOverview";
import { FramingCanvas, FRAMING_SIZE } from "@/components/miro/FramingCanvas";
import { ScaleCanvas } from "@/components/miro/StepCanvases";
import { RunCanvas } from "@/components/miro/RunCanvas";
import { PreScaleCanvas } from "@/components/miro/PreScaleCanvas";
import { BuildCanvas } from "@/components/miro/BuildCanvas";
import { DetailPanel } from "@/components/miro/DetailPanel";

interface MiroBoardViewProps {
  onNavigateToWizard?: () => void;
  onNavigateToLifecycle?: () => void;
}

type View = "overview" | StepId;

const CONTENT_WIDTH: Record<View, number> = {
  overview: 1400,
  framing: FRAMING_SIZE.W,
  build: 1400,
  prescale: 1400,
  scale: 1400,
  run: 1400,
};

const FRAME_PADDING = 64;

export const MiroBoardView: React.FC<MiroBoardViewProps> = () => {
  const [view, setView] = useState<View>("overview");
  const [exampleId, setExampleId] = useState<string>(EXAMPLES[0].id);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  // Set when Framing is opened from Pre-scale: the T2 lane is the one to look at
  const [framingFocus, setFramingFocus] = useState<PathId | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const example = exampleById(exampleId);
  const step = STEPS.find((s) => s.id === view);
  const stepIndex = step ? STEPS.indexOf(step) : -1;

  const fit = useCallback(() => {
    const el = canvasRef.current;
    if (!el) return;
    const available = el.clientWidth - 48;
    const needed = CONTENT_WIDTH[view] + FRAME_PADDING;
    setZoom(Math.min(1, Math.max(0.5, Math.floor((available / needed) * 100) / 100)));
  }, [view]);

  // Fit the frame to the screen each time a frame is opened
  useEffect(() => {
    fit();
  }, [fit]);

  useEffect(() => {
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [fit]);

  const openStep = (id: View, focus: PathId | null = null) => {
    setDetailId(null);
    setFramingFocus(id === "framing" ? focus : null);
    setView(id);
  };

  // Overview: a gate opens its detail. G2 to G4 follow the tier of the selected example
  // (self-service skips them, so it falls back to T2, the tier it goes back to).
  const openGate = (gateId: string) => {
    const id = gateId.toLowerCase();
    if (["g2", "g3", "g4"].includes(id)) {
      setDetailId(`${id}-${example.path === "SS" ? "T2" : example.path}`);
    } else {
      setDetailId(id);
    }
  };

  return (
    <div className="flex min-h-screen select-none flex-col bg-[#f4f2eb]">
      {/* ------------------------------------------------------------- */}
      {/* Control strip */}
      {/* ------------------------------------------------------------- */}
      <div className="sticky top-[57px] z-30 border-b border-gray-200 bg-white px-4 py-2.5 shadow-sm">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-300 bg-[#fff176] text-xs font-black text-amber-950 shadow-inner">
              Miro
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-gray-900">AI use case lifecycle</h2>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <button
                  onClick={() => openStep("overview")}
                  className={cx("hover:text-gray-900", view === "overview" && "font-bold text-gray-900")}
                >
                  Overview
                </button>
                {step && (
                  <>
                    <ChevronRight className="h-3 w-3" />
                    <span className="font-bold text-gray-900">
                      {step.numeral} · {step.name}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Step tabs */}
          <div className="flex items-center gap-1 rounded-xl border border-gray-300 bg-[#f0eee6] p-1">
            <button
              onClick={() => openStep("overview")}
              className={cx(
                "rounded-lg px-2.5 py-1 text-xs font-semibold",
                view === "overview" ? "bg-white font-bold text-gray-900 shadow-sm" : "text-gray-600 hover:bg-white/60"
              )}
            >
              Overview
            </button>
            {STEPS.map((s) => (
              <button
                key={s.id}
                onClick={() => openStep(s.id)}
                className={cx(
                  "rounded-lg px-2.5 py-1 text-xs font-semibold",
                  view === s.id ? "bg-white font-bold text-gray-900 shadow-sm" : "text-gray-600 hover:bg-white/60"
                )}
              >
                {s.numeral} · {s.name}
              </button>
            ))}
          </div>

          {/* Zoom */}
          <div className="flex items-center rounded-lg border border-gray-300 bg-white p-0.5 shadow-sm">
            <button onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))} title="Zoom out" className="rounded p-1.5 text-gray-600 hover:bg-gray-100">
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="min-w-[44px] text-center font-mono text-xs text-gray-700">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom((z) => Math.min(1.5, +(z + 0.1).toFixed(2)))} title="Zoom in" className="rounded p-1.5 text-gray-600 hover:bg-gray-100">
              <ZoomIn className="h-4 w-4" />
            </button>
            <button onClick={fit} title="Fit to screen" className="rounded border-l border-gray-200 p-1.5 text-gray-600 hover:bg-gray-100">
              <Maximize className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setZoom(1)} title="100%" className="rounded p-1.5 text-gray-600 hover:bg-gray-100">
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Example switcher (tier × mode), hidden on the overview to keep it simple */}
        {view !== "overview" && (
          <div className="mx-auto mt-2 flex max-w-[1600px] flex-wrap items-center gap-2 border-t border-gray-100 pt-2">
            <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <Lightbulb className="h-3.5 w-3.5 text-amber-500" /> Example
            </span>
            {PATH_ORDER.map((p) => {
              const list = EXAMPLES.filter((e) => e.path === p);
              return (
                <div key={p} className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
                  <span className="rounded px-1.5 py-0.5 text-[10px] font-black text-white" style={{ background: PATHS[p].color }}>
                    {PATHS[p].label}
                  </span>
                  {list.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setExampleId(e.id)}
                      title={`${e.title} · ${e.functionName} · ${e.cost}`}
                      className={cx(
                        "rounded-md px-2 py-0.5 text-[11px] font-semibold transition-all",
                        exampleId === e.id
                          ? "bg-white text-gray-900 shadow-sm ring-2 ring-amber-300"
                          : "text-gray-600 hover:bg-white"
                      )}
                    >
                      {MODES[e.mode].label}
                      <span className="ml-1 font-normal text-gray-400">{e.short}</span>
                    </button>
                  ))}
                </div>
              );
            })}
            <span className="ml-auto text-[11px] text-gray-500">
              {example.functionName} · {example.cost} · {example.value}
            </span>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Canvas */}
      {/* ------------------------------------------------------------- */}
      <div
        ref={canvasRef}
        className="relative flex-1 overflow-auto p-6"
        style={{
          backgroundImage: "radial-gradient(#d5d1c4 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      >
        <div style={{ zoom }} className="mx-auto w-fit">
          <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/70 p-8 shadow-xl">
            {/* Frame header */}
            <div className="mb-6 flex items-center justify-between gap-6 border-b border-gray-200 pb-4">
              <div>
                <div className="text-2xl font-black tracking-tight text-gray-900">
                  {step ? `${step.numeral} · ${step.name}` : "From idea to run in 5 steps"}
                </div>
                <div className="text-sm text-gray-500">
                  {step ? step.oneLiner : "Each step opens its own frame; gates sit between the steps"}
                </div>
              </div>
              {view === "framing" && (
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block h-3 w-3 rotate-45 border-2 border-dashed border-violet-500 bg-violet-50" />
                    Agent gate
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block h-3 w-3 rotate-45 bg-pink-500" />
                    Human gate
                  </span>
                  <span className="rounded-md border border-amber-200 bg-amber-100 px-2 py-1 text-amber-900">
                    Double-click a gate or a card for details
                  </span>
                </div>
              )}
            </div>

            {view === "overview" && <MiroOverview onOpenStep={openStep} onOpenGate={openGate} />}
            {view === "framing" && (
              <>
                {framingFocus && (
                  <div className="mb-4 flex items-center justify-between gap-4 rounded-xl border-2 border-sky-300 bg-sky-50 px-4 py-2 text-sm text-sky-950">
                    <span>
                      <span className="font-black">T2 assessment.</span> A T3 or self-service use case, from any build mode, goes through all
                      the T2 gates here (G2 to G4), then builds as T2.
                    </span>
                    <button onClick={() => setFramingFocus(null)} className="shrink-0 rounded-md border border-sky-300 bg-white px-2 py-1 text-xs font-bold">
                      Back to the selected example
                    </button>
                  </div>
                )}
                <FramingCanvas
                  example={example}
                  focusPath={framingFocus ?? undefined}
                  onOpenDetail={setDetailId}
                  onGoToBuild={() => openStep("build")}
                />
              </>
            )}
            {view === "build" && <BuildCanvas example={example} onBackToFraming={() => openStep("framing")} />}
            {view === "prescale" && (
              <PreScaleCanvas example={example} onOpenDetail={setDetailId} onBackToFramingT2={() => openStep("framing", "T2")} />
            )}
            {view === "scale" && <ScaleCanvas example={example} onOpenDetail={setDetailId} />}
            {view === "run" && (
              <RunCanvas example={example} onOpenDetail={setDetailId} onBackToFraming={() => openStep("framing")} />
            )}

            {/* Previous / next step */}
            {step && (
              <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-4 text-sm font-semibold">
                <button
                  onClick={() => openStep(stepIndex === 0 ? "overview" : STEPS[stepIndex - 1].id)}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {stepIndex === 0 ? "Overview" : `${STEPS[stepIndex - 1].numeral} · ${STEPS[stepIndex - 1].name}`}
                </button>
                {stepIndex < STEPS.length - 1 && (
                  <button
                    onClick={() => openStep(STEPS[stepIndex + 1].id)}
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                  >
                    {`${STEPS[stepIndex + 1].numeral} · ${STEPS[stepIndex + 1].name}`}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <DetailPanel
        detailId={detailId}
        example={example}
        onClose={() => setDetailId(null)}
        onSelectExample={setExampleId}
      />
    </div>
  );
};

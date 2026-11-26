"use client";

import React, { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { GENTIANE_QUESTIONS, NavTarget } from "@/lib/supportModel";

const DOT: Record<string, string> = { a: "bg-opella-forest", p: "bg-[#D9A441]", o: "border-2 border-[#B91C1C]" };
const STATUS: Record<string, string> = { a: "Answered", p: "Partly answered", o: "Open" };

export const QAView: React.FC<{ onNavigate: (target: NavTarget) => void }> = ({ onNavigate }) => {
  const [openCat, setOpenCat] = useState(0);
  const all = GENTIANE_QUESTIONS.flatMap((c) => c.qs);
  const count = (s: string) => all.filter((q) => q.s === s).length;

  return (
    <div className="min-h-full bg-[#F4F3EE] text-[#14261D]">
      <main className="mx-auto flex max-w-[1160px] flex-col gap-6 px-6 pb-16 pt-10">
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[.1em] text-opella-forest">Q&amp;A</p>
          <h1 className="mb-2.5 text-[34px] font-bold leading-tight tracking-tight">Gentiane&apos;s questions: where each one is answered</h1>
          <p className="text-base text-[#55605A]">{all.length} questions: {count("a")} answered, {count("p")} partly, {count("o")} open. Open a category, then go to the answer.</p>
        </section>

        <div className="flex flex-wrap gap-[18px] text-[13px] text-[#55605A]">
          {["a", "p", "o"].map((s) => <span key={s} className="inline-flex items-center gap-2"><span className={`h-3 w-3 rounded-full ${DOT[s]}`} />{s === "o" ? "Open: not answered yet" : STATUS[s]}</span>)}
        </div>

        <div className="flex flex-col gap-2">
          {GENTIANE_QUESTIONS.map((c, i) => {
            const open = openCat === i;
            return (
              <div key={c.title} className="overflow-hidden rounded-[14px] border border-opella-border bg-white">
                <button onClick={() => setOpenCat(open ? -1 : i)} aria-expanded={open} className="flex min-h-[60px] w-full flex-wrap items-center gap-3.5 px-5 py-3 text-left">
                  <span className="min-w-0 flex-[1_1_380px] text-base font-bold">{i + 1}. {c.title}</span>
                  <span className="inline-flex items-center gap-1.5">{c.qs.map((q, j) => <span key={j} className={`h-3 w-3 rounded-full ${DOT[q.s]}`} />)}</span>
                  <span className="text-[13px] text-[#55605A]">{c.qs.length} {c.qs.length > 1 ? "questions" : "question"}</span>
                  <ChevronDown className={`h-[18px] w-[18px] flex-none transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
                {open && (
                  <ol className="flex flex-col gap-2.5 px-5 pb-4">
                    {c.qs.map((q) => (
                      <li key={q.text} className="flex flex-wrap items-start gap-4 rounded-xl border border-opella-border p-4">
                        <span className={`mt-1 h-3.5 w-3.5 flex-none rounded-full ${DOT[q.s]}`} />
                        <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-1.5">
                          <p className="text-[15px] font-semibold leading-normal">{q.text}</p>
                          <p className="text-sm leading-normal text-[#55605A]"><strong className="text-[#14261D]">{STATUS[q.s]}.</strong> {q.answer}</p>
                        </div>
                        {q.target ? (
                          <button onClick={() => onNavigate(q.target!)} className="inline-flex min-h-[44px] flex-none items-center gap-2 rounded-[10px] bg-opella-forest px-4 text-sm font-semibold text-white">
                            Go to {q.where} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        ) : (
                          <span className="inline-flex min-h-[44px] flex-none items-center rounded-[10px] border border-dashed border-[#B91C1C] px-4 text-sm font-semibold text-[#B91C1C]">Not on the site yet</span>
                        )}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

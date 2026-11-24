"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

interface DetailsProps {
  title: React.ReactNode;
  tone?: "light" | "dark";
  defaultOpen?: boolean;
  children: React.ReactNode;
}

/**
 * Progressive disclosure wrapper (format only).
 * Uses native <details>, so the content stays mounted and keeps its state:
 * nothing is removed, it is only collapsed until the reader opens it.
 */
export const Details: React.FC<DetailsProps> = ({
  title,
  tone = "light",
  defaultOpen = false,
  children,
}) => {
  const dark = tone === "dark";
  return (
    <details
      open={defaultOpen || undefined}
      className={`group rounded-xl border ${
        dark ? "border-white/20 bg-white/5" : "border-opella-border bg-white"
      }`}
    >
      <summary
        className={`flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold [&::-webkit-details-marker]:hidden ${
          dark ? "text-white hover:bg-white/10" : "text-opella-forest hover:bg-gray-50"
        }`}
      >
        <span className="flex items-center gap-2.5">
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              dark ? "bg-white/15 text-emerald-200" : "bg-emerald-50 text-emerald-800"
            }`}
          >
            Details
          </span>
          <span>{title}</span>
        </span>
        <ChevronDown
          className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="px-3 pb-3 pt-1">{children}</div>
    </details>
  );
};

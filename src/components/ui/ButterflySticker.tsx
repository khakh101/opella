import React from "react";

// A small visual sticker that flags what is reused from Butterfly.
export const ButterflyIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 7v13" />
    <path d="M12 9C10 4 5 3 3.5 5.5 2.5 7.5 4 11 8 11.5 5.5 12.5 5 15.5 7 17c2 1.3 4-.5 5-3" />
    <path d="M12 9c2-5 7-6 8.5-3.5 1 2-.5 5.5-4.5 6 2.5 1 3 4 1 5.5-2 1.3-4-.5-5-3" />
    <path d="M10.5 4.5C10 3.5 9.3 3 8.5 2.8M13.5 4.5c.5-1 1.2-1.5 2-1.7" />
  </svg>
);

export const ButterflySticker: React.FC<{ title: string; children?: React.ReactNode; className?: string; tilt?: number }> = ({
  title,
  children,
  className = "",
  tilt = -1.5,
}) => (
  <div
    className={`inline-flex max-w-full items-start gap-2.5 rounded-lg border border-[#D9A441] bg-[#FFF1D6] px-3.5 py-2.5 text-[#6B3A00] shadow-md ${className}`}
    style={{ transform: `rotate(${tilt}deg)` }}
  >
    <ButterflyIcon className="mt-0.5 h-5 w-5 shrink-0" />
    <span className="text-[13px] leading-snug">
      <strong className="block text-[11px] font-black uppercase tracking-wider">{title}</strong>
      {children}
    </span>
  </div>
);

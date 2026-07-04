"use client";

import { useAppStore } from "@/lib/store";

export default function Toast() {
  const { toastMsg, toastOn } = useAppStore();
  return (
    <div
      className={`fixed left-1/2 z-[1000] whitespace-nowrap bg-ink px-4 py-2 font-mono text-xs font-semibold tracking-wide text-paper transition-all duration-200 pointer-events-none ${
        toastOn ? "opacity-100" : "opacity-0"
      }`}
      style={{
        top: "calc(var(--hdr-h) + 8px)",
        transform: `translateX(-50%) translateY(${toastOn ? "0" : "-4px"})`,
      }}
    >
      {toastMsg}
    </div>
  );
}

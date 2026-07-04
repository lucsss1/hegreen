"use client";

import { useAppStore } from "@/lib/store";

export default function SyncDot() {
  const { sync } = useAppStore();
  const bg = sync === "ok" ? "var(--win)" : sync === "err" ? "var(--lose)" : "var(--warn)";
  return (
    <div
      className={`w-1.5 h-1.5 rounded-[50%] flex-shrink-0 transition-colors duration-300 ${
        sync === "sp" ? "animate-blink" : ""
      }`}
      style={{ background: bg }}
    />
  );
}

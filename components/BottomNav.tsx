"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/historico",
    label: "Hist.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="0" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
  {
    href: "/plano",
    label: "Plano",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[100] flex items-center bg-paper border-t-2 border-ink"
      style={{ height: "var(--nav-h)", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {items.slice(0, 1).map((it) => (
        <NavButton key={it.href} {...it} active={pathname === it.href} />
      ))}
      <div className="flex-1 flex items-center justify-center">
        <Link
          href="/registrar"
          className="w-11 h-9 bg-ink text-paper text-[22px] font-light flex items-center justify-center active:scale-[.93] transition-transform"
        >
          ＋
        </Link>
      </div>
      {items.slice(1).map((it) => (
        <NavButton key={it.href} {...it} active={pathname === it.href} />
      ))}
    </nav>
  );
}

function NavButton({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex-1 flex flex-col items-center justify-center gap-[3px] py-1.5 px-1 font-mono text-[10px] font-semibold uppercase tracking-wide transition-colors ${
        active ? "text-ink" : "text-ink4"
      }`}
    >
      <span className={`w-[18px] h-[18px] transition-transform ${active ? "scale-110" : ""}`}>
        {icon}
      </span>
      {label}
    </Link>
  );
}

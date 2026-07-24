"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

export type HomeNavIconType =
  | "home"
  | "compare"
  | "note"
  | "shield"
  | "settings";

type HomeNavItem = {
  readonly label: string;
  readonly href: string;
  readonly icon: HomeNavIconType;
};

type HomeMobileNavProps = {
  items: readonly HomeNavItem[];
  menuLabel: string;
  openLabel: string;
  closeLabel: string;
};

export function NavIcon({ type }: { type: HomeNavIconType }) {
  if (type === "home") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <path d="M3 11.5 12 4l9 7.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <path d="M6.5 10.5V20h11v-9.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    );
  }

  if (type === "compare") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <path d="M5 19V9m7 10V5m7 14v-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        <path d="M3 20h18" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </svg>
    );
  }

  if (type === "note") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <path d="M6 4h9l3 3v13H6z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
        <path d="M14 4v4h4M9 15l5-5 2 2-5 5H9z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === "shield") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <path d="M12 3.5 19 6v5.5c0 4.2-2.8 7.4-7 9-4.2-1.6-7-4.8-7-9V6z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
        <path d="m9 12 2 2 4-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 2.8v2.1m0 14.2v2.1M4.1 4.1l1.5 1.5m12.8 12.8 1.5 1.5M2.8 12h2.1m14.2 0h2.1M4.1 19.9l1.5-1.5M18.4 5.6l1.5-1.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

export function HomeMobileNav({
  items,
  menuLabel,
  openLabel,
  closeLabel,
}: HomeMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <div className="relative shrink-0 xl:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={isOpen ? closeLabel : openLabel}
        className="grid h-11 w-11 place-items-center rounded-[10px] border border-[#ddd7ce] bg-[#fffaf2] text-[#242424] shadow-[0_8px_20px_rgba(73,57,36,0.1)] transition hover:border-[#7d8654] hover:text-[#7d8654]"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
            <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
            <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          </svg>
        )}
      </button>

      {isOpen ? (
        <nav
          id={menuId}
          aria-label={menuLabel}
          className="absolute right-0 top-[calc(100%+12px)] z-50 w-[min(19rem,calc(100vw-2rem))] rounded-[14px] border border-[#e1d8c9] bg-[#fbfaf6] p-2 shadow-[0_18px_44px_rgba(88,67,42,0.18)]"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-[10px] px-4 py-3 text-[17px] font-semibold text-[#242424] transition hover:bg-[#fffaf2] hover:text-[#7d8654]"
              onClick={() => setIsOpen(false)}
            >
              <NavIcon type={item.icon} />
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}

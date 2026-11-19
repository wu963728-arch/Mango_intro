"use client";

import Link from "next/link";
import { useState } from "react";
import { useVisitor } from "@/lib/visitor";

const links = [
  { no: "01", href: "/#story", label: "果園" },
  { no: "02", href: "/#products", label: "商品" },
  { no: "03", href: "/#season", label: "產季" },
  { no: "04", href: "/#order", label: "搶先名單" },
  { no: "05", href: "/blog", label: "日誌" },
  { no: "06", href: "/game", label: "小遊戲" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { name } = useVisitor();

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="font-serif text-xl font-black tracking-[0.12em]">夏至果園</span>
          {name ? (
            <span className="hidden max-w-[10rem] truncate text-xs text-ink/70 sm:inline">
              嗨，<span className="font-medium text-mango">{name}</span>
            </span>
          ) : (
            <span className="hidden text-[10px] uppercase tracking-[0.3em] text-muted sm:inline md:hidden lg:inline">
              Geshi Mango Orchard
            </span>
          )}
        </Link>

        <ul className="hidden items-center gap-5 text-sm md:flex lg:gap-9">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="group flex items-baseline gap-1.5">
                <span className="font-mono text-[10px] text-muted">{l.no}</span>
                <span className="relative">
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-ink transition-all duration-300 group-hover:w-full" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/#order"
          className="hidden items-center gap-2 rounded-full bg-mango px-4 py-2 text-xs font-medium tracking-wider text-white transition hover:bg-ink md:inline-flex"
        >
          搶先通知
          <span aria-hidden>→</span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="切換選單"
          aria-expanded={open}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span className={`h-px w-5 bg-ink transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
          <span className={`h-px w-5 bg-ink transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
        </button>
      </nav>

      {open && (
        <ul className="glass mx-auto mt-2 max-w-7xl rounded-2xl p-2 md:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-3 rounded-xl px-4 py-3 transition hover:bg-white/50"
              >
                <span className="font-mono text-xs text-muted">{l.no}</span>
                <span className="font-serif text-lg font-bold">{l.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

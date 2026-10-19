"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sun, Moon, Zap } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const links = [
  { href: "/#features",    label: "Features" },
  { href: "/#how-it-works",label: "How it works" },
  { href: "/playground",   label: "Playground" },
  { href: "/docs",         label: "Docs" },
  { href: "/pricing",      label: "Pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [open, setOpen]           = useState(false);
  const { theme, toggle }         = useTheme();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isLight = theme === "light";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? "nav-glass shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-[60px]">

          {/* Logo — bloo.io style: wordmark, no icon */}
          <Link href="/" className="flex items-center gap-0 group">
            <span
              className="text-[17px] font-bold tracking-[-0.03em] transition-opacity group-hover:opacity-75"
              style={{ color: "var(--text)", fontFamily: "Inter, sans-serif" }}
            >
              phish<span style={{ color: "var(--accent)" }}>guard</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3.5 py-2 text-[13.5px] font-medium rounded-lg transition-colors"
                style={{ color: "var(--text-dim)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right: theme toggle + CTA */}
          <div className="hidden md:flex items-center gap-2">
            {/* Dark/Light toggle */}
            <button
              onClick={toggle}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: "var(--text-muted)", background: "transparent" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--surface2)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              aria-label="Toggle theme"
              title={isLight ? "Switch to dark mode" : "Switch to light mode"}
            >
              {isLight
                ? <Moon className="w-4 h-4" />
                : <Sun className="w-4 h-4" />
              }
            </button>

            <Link
              href="/playground"
              className="btn-primary text-[13px] py-[7px] px-[14px]"
            >
              Try free →
            </Link>
          </div>

          {/* Mobile: theme + menu */}
          <div className="md:hidden flex items-center gap-1.5">
            <button
              onClick={toggle}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ color: "var(--text-muted)" }}
              aria-label="Toggle theme"
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="w-8 h-8 flex items-center justify-center"
              style={{ color: "var(--text-muted)" }}
            >
              {open ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t px-5 py-4 space-y-1"
          style={{ background: "var(--bg)", borderColor: "var(--border)" }}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-[14px] rounded-lg transition-colors"
              style={{ color: "var(--text-dim)" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/playground"
            onClick={() => setOpen(false)}
            className="btn-primary w-full justify-center mt-3 text-[14px]"
          >
            Try free →
          </Link>
        </div>
      )}
    </nav>
  );
}

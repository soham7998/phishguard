"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Menu, X, Zap } from "lucide-react";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/playground", label: "Playground" },
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "nav-glass" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Phish<span className="text-indigo-400">Guard</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/playground"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25"
            >
              <Zap className="w-3.5 h-3.5" />
              Try free
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden nav-glass border-t border-slate-800 px-4 py-4 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/playground"
            onClick={() => setOpen(false)}
            className="block mt-2 px-3 py-2.5 text-sm font-medium text-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
          >
            Try free
          </Link>
        </div>
      )}
    </nav>
  );
}

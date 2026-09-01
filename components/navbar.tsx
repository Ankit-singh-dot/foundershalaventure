"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, PhoneCall, LayoutDashboard, Menu, X, ShieldCheck } from "lucide-react";
import ExpertModal from "./expert-modal";

export default function Navbar() {
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 font-bold text-white shadow-sm">
              FV
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-slate-900 flex items-center gap-2">
                FOUNDERSHALA VENTURES
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                  Investment Banking
                </span>
              </div>
              <div className="text-[10px] tracking-wider text-slate-500 uppercase font-medium">
                Unlocking Capital • Realizing Potential
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <a href="#valuation-calculator" className="hover:text-slate-900 transition-colors">
              Valuation Engine
            </a>
            <a href="#deal-vault" className="hover:text-slate-900 transition-colors">
              Deal Vault
            </a>
            <a href="#document-teaser" className="hover:text-slate-900 transition-colors">
              CIM Teaser
            </a>
            <a href="#expertise" className="hover:text-slate-900 transition-colors">
              Services
            </a>
            <a href="#team" className="hover:text-slate-900 transition-colors">
              Leadership
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-slate-600" /> Admin Portal
            </Link>

            <button
              onClick={() => setIsExpertModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-all cursor-pointer"
            >
              <PhoneCall className="h-3.5 w-3.5" /> Talk to Expert
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3 text-xs font-semibold text-slate-700">
            <a
              href="#valuation-calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-slate-900"
            >
              Valuation Engine
            </a>
            <a
              href="#deal-vault"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-slate-900"
            >
              Deal Vault (5 Deliverables)
            </a>
            <a
              href="#document-teaser"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-slate-900"
            >
              CIM Teaser Preview
            </a>
            <a
              href="#expertise"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-slate-900"
            >
              M&A & Advisory Services
            </a>
            <a
              href="#team"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-slate-900"
            >
              Our Experts
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/admin"
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-800"
              >
                <LayoutDashboard className="h-4 w-4" /> Admin Portal
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsExpertModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 py-2 text-xs font-bold text-white"
              >
                <PhoneCall className="h-4 w-4" /> Talk to Expert
              </button>
            </div>
          </div>
        )}
      </header>

      <ExpertModal
        isOpen={isExpertModalOpen}
        onClose={() => setIsExpertModalOpen(false)}
      />
    </>
  );
}

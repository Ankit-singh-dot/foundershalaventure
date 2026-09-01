"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white font-bold text-slate-900">
                FV
              </div>
              <span className="text-sm font-bold text-white tracking-tight">FOUNDERSHALA VENTURES</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering founders to build bold, scalable and impactful companies. Strategic capital, operator-led advisory & a powerful investment banking ecosystem.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Sell-Side Services</div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#valuation-calculator" className="hover:text-white">AI Valuation Engine</a></li>
              <li><a href="#deal-vault" className="hover:text-white">Pitch Deck & CIM Creation</a></li>
              <li><a href="#deal-vault" className="hover:text-white">5-Year Financial Modeling</a></li>
              <li><a href="#expertise" className="hover:text-white">Mergers & Acquisitions (M&A)</a></li>
              <li><a href="#expertise" className="hover:text-white">Audit & Taxation Advisory</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Company</div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#team" className="hover:text-white">Our Experts</a></li>
              <li><a href="#document-teaser" className="hover:text-white">CIM Preview</a></li>
              <li><Link href="/admin" className="hover:text-white">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Direct Contact</div>
            <div className="space-y-2 text-xs text-slate-300">
              <a href="mailto:Varun.singh@mail.ca.in" className="flex items-center gap-2 hover:text-white">
                <Mail className="h-3.5 w-3.5 text-slate-400" /> Varun.singh@mail.ca.in
              </a>
              <a href="tel:9587119102" className="flex items-center gap-2 hover:text-white">
                <Phone className="h-3.5 w-3.5 text-slate-400" /> +91 9587119102
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>© {new Date().getFullYear()} Foundershala Ventures. All rights reserved.</div>
          <div className="flex gap-6">
            <span className="hover:text-slate-400">Privacy Policy</span>
            <span className="hover:text-slate-400">Terms of Service</span>
            <span className="hover:text-slate-400">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

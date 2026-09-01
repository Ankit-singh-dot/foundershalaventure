"use client";

import Image from "next/image";
import { UserCheck, Mail } from "lucide-react";

export default function TeamShowcase() {
  const team = [
    {
      name: "CA Varun Deep Singh",
      role: "Founder & Managing Partner",
      bio: "Chartered Accountant & IB veteran specializing in cross-border M&A, equity research, and venture capital structuring.",
      image: "/images/partner_varun.jpg",
      initials: "VS",
    },
    {
      name: "Shruti Chopade",
      role: "Partner, IB Head",
      bio: "Leading deal sourcing, valuation benchmarking, and investor due diligence for growth-stage tech startups.",
      image: "/images/partner_shruti.jpg",
      initials: "SC",
    },
    {
      name: "Shreyash Baheti",
      role: "VP Finance & IB",
      bio: "Ex-investment banker crafting 5-year driver-based financial models and equity dilution structures.",
      image: null,
      initials: "SB",
    },
    {
      name: "CA Ankit Jain Lodha",
      role: "Partner, CFO Advisory",
      bio: "Virtual CFO partner providing audit, tax compliance, and strategic capital allocation for founders.",
      image: null,
      initials: "AL",
    },
    {
      name: "Aaditya Kochar",
      role: "Associate",
      bio: "Equity research, confidential deal memorandum creation, and institutional investor outreach coordination.",
      image: null,
      initials: "AK",
    },
    {
      name: "Ranjika Nair",
      role: "Associate",
      bio: "Startup evaluation, cap table modeling, and founder pitch collateral preparation.",
      image: null,
      initials: "RN",
    },
  ];

  return (
    <section id="team" className="relative py-20 bg-slate-50 text-slate-900 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700">
            <UserCheck className="h-3.5 w-3.5 text-slate-700" /> LEADERSHIP TEAM
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Meet the Minds Driving Growth
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Experienced partners & investment bankers empowering founders to scale with strategic guidance and capital.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex items-center gap-4">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                    {member.initials}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
                  <p className="text-xs font-semibold text-slate-600">{member.role}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{member.bio}</p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[10px] uppercase font-bold text-slate-400">Foundershala IB</span>
                <a
                  href="mailto:Varun.singh@mail.ca.in"
                  className="flex items-center gap-1 font-semibold text-slate-900 hover:underline"
                >
                  <Mail className="h-3.5 w-3.5" /> Contact Partner
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

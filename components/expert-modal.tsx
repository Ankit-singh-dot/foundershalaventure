"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, CheckCircle, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

interface ExpertModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMessage?: string;
  prefillService?: string;
}

export default function ExpertModal({
  isOpen,
  onClose,
  defaultMessage = "",
  prefillService = "",
}: ExpertModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState(defaultMessage);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError("Name and Work Email are required");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          founderName: name,
          email,
          phone,
          companyName: company || "Undisclosed Company",
          website: "https://foundershalaventures.com",
          requestedServices: prefillService ? [prefillService] : ["Investment Banking Advisory"],
          notes: message || "Direct consultation request from modal.",
        }),
      });

      if (!res.ok) throw new Error("Failed to submit request");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white p-6 sm:p-8 text-slate-900 shadow-xl z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {!submitted ? (
              <div>
                <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold uppercase tracking-wider mb-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Executive Advisory
                </div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-1">
                  Consultation with Investment Banking Partners
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Direct engagement with CA Varun Deep Singh & Foundershala IB Leadership.
                </p>

                {/* Direct Contact Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <a
                    href="mailto:Varun.singh@mail.ca.in"
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 hover:bg-slate-100 transition-colors"
                  >
                    <div className="rounded bg-slate-200 p-2 text-slate-700">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Direct Email</div>
                      <div className="text-xs font-semibold truncate text-slate-900">Varun.singh@mail.ca.in</div>
                    </div>
                  </a>

                  <a
                    href="tel:9587119102"
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 hover:bg-slate-100 transition-colors"
                  >
                    <div className="rounded bg-slate-200 p-2 text-slate-700">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Direct Call / WhatsApp</div>
                      <div className="text-xs font-semibold text-slate-900">+91 9587119102</div>
                    </div>
                  </a>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 font-medium">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ankit Singh"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="founder@company.com"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Acme Corp"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Advisory Requirement</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Specify requirements e.g., Pitch Deck, Financial Model, Valuation Report, M&A..."
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting Request...
                      </>
                    ) : (
                      <>
                        Request Priority Call <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="inline-flex rounded-full bg-slate-100 p-4 text-slate-900 ring-1 ring-slate-200">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">Consultation Requested</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Thank you, <span className="font-semibold text-slate-900">{name}</span>. CA Varun Deep Singh & our Investment Banking team will reach out to you shortly.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleReset}
                    className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

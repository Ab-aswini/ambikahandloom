"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Phone,
  User,
  Calendar,
  MessageCircle,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { getQuizResultsAsync, QuizResult } from "@/lib/admin-store";
import { products } from "@/lib/products";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "callbacks">("all");

  const loadLeads = async () => {
    setLoading(true);
    try {
      const data = await getQuizResultsAsync();
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    if (filterType === "callbacks" && (!lead.customerName || !lead.customerPhone)) {
      return false;
    }
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      lead.customerName?.toLowerCase().includes(term) ||
      lead.customerPhone?.includes(term) ||
      lead.occasion.toLowerCase().includes(term) ||
      lead.fabric.toLowerCase().includes(term) ||
      lead.budget.toLowerCase().includes(term)
    );
  });

  const callbacksCount = leads.filter((l) => l.customerName && l.customerPhone).length;

  const handleWhatsApp = (lead: QuizResult) => {
    if (!lead.customerPhone) return;
    const cleanPhone = lead.customerPhone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;

    const matchedProducts = (lead.matchedProductIds || [])
      .map((id) => products.find((p) => p.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    const text = `Namaste ${lead.customerName || "there"} 🙏\n\nThank you for exploring Ambika Handloom!\n\nWe saw you're looking for:\n• Occasion: ${lead.occasion}\n• Fabric: ${lead.fabric}\n• Budget: ${lead.budget}\n${matchedProducts ? `• Recommended: ${matchedProducts}\n` : ""}\nHow can we assist you with your handloom saree selection today?`;

    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto text-cream">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium tracking-wider uppercase mb-1">
            <Sparkles size={14} /> Weave Explorer Analytics
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-white tracking-tight">
            Quiz Leads & Callbacks
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Track visitors who used the Weave Explorer quiz and requested a callback.
          </p>
        </div>

        <button
          onClick={loadLeads}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-xs px-4 py-2.5 rounded-xl transition-colors border border-white/10 self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Leads
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10">
          <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">
            Total Quiz Takers
          </p>
          <p className="font-serif text-3xl font-semibold text-white">{leads.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-400 uppercase tracking-wider mb-1 font-medium">
            Contact Callbacks
          </p>
          <p className="font-serif text-3xl font-semibold text-amber-300">
            {callbacksCount}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10">
          <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">
            Conversion Rate
          </p>
          <p className="font-serif text-3xl font-semibold text-emerald-400">
            {leads.length > 0 ? `${Math.round((callbacksCount / leads.length) * 100)}%` : "0%"}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by name, phone, fabric, or occasion..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-900 border border-white/10 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterType("all")}
            className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-colors border ${
              filterType === "all"
                ? "bg-white text-black border-white"
                : "bg-neutral-900 text-neutral-400 border-white/10 hover:text-white"
            }`}
          >
            All Submissions ({leads.length})
          </button>
          <button
            onClick={() => setFilterType("callbacks")}
            className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-colors border ${
              filterType === "callbacks"
                ? "bg-amber-500 text-black border-amber-500 font-bold"
                : "bg-neutral-900 text-neutral-400 border-white/10 hover:text-white"
            }`}
          >
            With Contact ({callbacksCount})
          </button>
        </div>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div className="p-12 text-center text-neutral-500">
          <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-amber-500" />
          Loading quiz submissions...
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="p-12 rounded-2xl bg-neutral-900 border border-white/10 text-center text-neutral-400">
          <HelpCircle size={32} className="mx-auto mb-3 text-neutral-600" />
          <p className="font-serif text-lg text-white">No submissions found</p>
          <p className="text-xs text-neutral-500 mt-1">
            {searchTerm || filterType !== "all"
              ? "Try clearing your search filters."
              : "Submissions from the Weave Explorer quiz will appear here."}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-neutral-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead className="bg-white/5 text-[10px] uppercase tracking-wider text-neutral-400 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Occasion</th>
                  <th className="px-6 py-4">Fabric</th>
                  <th className="px-6 py-4">Budget</th>
                  <th className="px-6 py-4">Submitted At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLeads.map((lead) => {
                  const hasContact = lead.customerName && lead.customerPhone;
                  return (
                    <tr
                      key={lead.id}
                      className={`hover:bg-white/5 transition-colors ${
                        hasContact ? "bg-amber-500/5" : ""
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-white">
                        {hasContact ? (
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            {lead.customerName}
                          </div>
                        ) : (
                          <span className="text-neutral-500 italic">Anonymous Visitor</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {lead.customerPhone ? (
                          <a
                            href={`tel:${lead.customerPhone}`}
                            className="inline-flex items-center gap-1.5 text-amber-300 hover:underline font-mono text-xs"
                          >
                            <Phone size={12} /> {lead.customerPhone}
                          </a>
                        ) : (
                          <span className="text-neutral-600">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">{lead.occasion}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs">
                          {lead.fabric}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono">{lead.budget}</td>
                      <td className="px-6 py-4 text-xs text-neutral-500">
                        {new Date(lead.completedAt).toLocaleString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {hasContact ? (
                          <button
                            onClick={() => handleWhatsApp(lead)}
                            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium"
                          >
                            <MessageCircle size={13} /> WhatsApp
                          </button>
                        ) : (
                          <span className="text-xs text-neutral-600">No contact info</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

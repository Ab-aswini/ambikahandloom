"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, RotateCcw } from "lucide-react";
import { getSettings, saveSettings, SiteSettings } from "@/lib/admin-store";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const handleSave = () => {
    if (!settings) return;
    setIsSaving(true);
    saveSettings(settings);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 400);
  };

  const handleReset = () => {
    setSettings(getSettings());
  };

  if (!settings) return null;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-white text-2xl font-medium tracking-tight">
            Settings
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Manage website configuration
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 text-white/50 text-sm rounded-lg hover:bg-white/10 transition-colors"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#0A0A0A] text-sm font-medium rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            <Save size={14} />
            {saved ? "✓ Saved!" : isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>

      <div className="space-y-6">
        {/* Payment Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white/[0.03] border border-white/5 rounded-xl p-6 space-y-4"
        >
          <h3 className="text-xs text-white/30 uppercase tracking-wider mb-4">
            Payment Details
          </h3>
          <p className="text-xs text-white/20">
            These details are shown to customers after order confirmation.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="payment-upi" className="block text-xs text-white/40 mb-1.5">
                UPI ID
              </label>
              <input
                id="payment-upi"
                type="text"
                value={settings.paymentUpi}
                onChange={(e) =>
                  setSettings({ ...settings, paymentUpi: e.target.value })
                }
                placeholder="example@upi"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="payment-bank" className="block text-xs text-white/40 mb-1.5">
                Bank Name
              </label>
              <input
                id="payment-bank"
                type="text"
                value={settings.paymentBank}
                onChange={(e) =>
                  setSettings({ ...settings, paymentBank: e.target.value })
                }
                placeholder="Bank name"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="payment-account" className="block text-xs text-white/40 mb-1.5">
                Account Number
              </label>
              <input
                id="payment-account"
                type="text"
                value={settings.paymentAccountNo}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    paymentAccountNo: e.target.value,
                  })
                }
                placeholder="Account number"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="payment-ifsc" className="block text-xs text-white/40 mb-1.5">
                IFSC Code
              </label>
              <input
                id="payment-ifsc"
                type="text"
                value={settings.paymentIfsc}
                onChange={(e) =>
                  setSettings({ ...settings, paymentIfsc: e.target.value })
                }
                placeholder="IFSC code"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
              />
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.03] border border-white/5 rounded-xl p-6 space-y-4"
        >
          <h3 className="text-xs text-white/30 uppercase tracking-wider mb-4">
            Contact Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-email" className="block text-xs text-white/40 mb-1.5">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={settings.contactEmail}
                onChange={(e) =>
                  setSettings({ ...settings, contactEmail: e.target.value })
                }
                placeholder="email@example.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="contact-phone" className="block text-xs text-white/40 mb-1.5">
                Phone
              </label>
              <input
                id="contact-phone"
                type="text"
                value={settings.contactPhone}
                onChange={(e) =>
                  setSettings({ ...settings, contactPhone: e.target.value })
                }
                placeholder="+91 9876543210"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
              />
            </div>
          </div>
          <div>
            <label htmlFor="contact-address" className="block text-xs text-white/40 mb-1.5">
              Address
            </label>
            <textarea
              id="contact-address"
              value={settings.contactAddress}
              onChange={(e) =>
                setSettings({ ...settings, contactAddress: e.target.value })
              }
              rows={2}
              placeholder="Full address"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors resize-none"
            />
          </div>
        </motion.div>

        {/* Hero / Marketing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/[0.03] border border-white/5 rounded-xl p-6 space-y-4"
        >
          <h3 className="text-xs text-white/30 uppercase tracking-wider mb-4">
            Homepage & Marketing
          </h3>
          <div>
            <label htmlFor="hero-title" className="block text-xs text-white/40 mb-1.5">
              Hero Title
            </label>
            <input
              id="hero-title"
              type="text"
              value={settings.heroTitle}
              onChange={(e) =>
                setSettings({ ...settings, heroTitle: e.target.value })
              }
              placeholder="Main hero heading"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="hero-subtitle" className="block text-xs text-white/40 mb-1.5">
              Hero Subtitle
            </label>
            <textarea
              id="hero-subtitle"
              value={settings.heroSubtitle}
              onChange={(e) =>
                setSettings({ ...settings, heroSubtitle: e.target.value })
              }
              rows={3}
              placeholder="Hero description text"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors resize-none"
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded-lg border border-white/5">
            <div>
              <p className="text-sm text-white/60">
                Mother&apos;s Day Section
              </p>
              <p className="text-xs text-white/25 mt-0.5">
                Show the special gifting section on the homepage
              </p>
            </div>
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  mothersDayEnabled: !settings.mothersDayEnabled,
                })
              }
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.mothersDayEnabled ? "bg-emerald-500" : "bg-white/10"
              }`}
              role="switch"
              aria-checked={settings.mothersDayEnabled ? "true" : "false"}
              aria-label={`Mother's Day section is ${settings.mothersDayEnabled ? "enabled" : "disabled"}. Click to toggle.`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  settings.mothersDayEnabled
                    ? "translate-x-[22px]"
                    : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

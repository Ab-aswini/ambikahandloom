"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, RotateCcw, Sparkles, Plus, Trash2, Database, RefreshCw } from "lucide-react";
import {
  getSettings,
  saveSettings,
  SiteSettings,
  PromotionFeature,
  isSupabaseConfigured,
  syncLocalStorageToSupabase,
  clearAllOrdersAsync,
  resetProductsToDefaultAsync,
} from "@/lib/admin-store";

const inputClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [supabaseActive, setSupabaseActive] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isClearingOrders, setIsClearingOrders] = useState(false);
  const [isResettingProducts, setIsResettingProducts] = useState(false);
  const [dangerMessage, setDangerMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(getSettings());
    setSupabaseActive(isSupabaseConfigured());
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

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await syncLocalStorageToSupabase();
      if (res.success) {
        setSyncMessage({ type: "success", text: res.message });
      } else {
        setSyncMessage({ type: "error", text: res.message });
      }
    } catch (err: any) {
      setSyncMessage({ type: "error", text: err.message || "An unexpected error occurred during sync." });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearOrders = async () => {
    if (!confirm("Are you absolutely sure you want to delete all customer orders? This cannot be undone.")) return;
    setIsClearingOrders(true);
    setDangerMessage(null);
    try {
      const res = await clearAllOrdersAsync();
      if (res.success) {
        setDangerMessage({ type: "success", text: res.message });
      } else {
        setDangerMessage({ type: "error", text: res.message });
      }
    } catch (err: any) {
      setDangerMessage({ type: "error", text: err.message || "Failed to clear orders." });
    } finally {
      setIsClearingOrders(false);
    }
  };

  const handleResetProducts = async () => {
    if (!confirm("Are you absolutely sure you want to reset products to defaults? All custom products (like Product 13) will be deleted.")) return;
    setIsResettingProducts(true);
    setDangerMessage(null);
    try {
      const res = await resetProductsToDefaultAsync();
      if (res.success) {
        setDangerMessage({ type: "success", text: res.message });
      } else {
        setDangerMessage({ type: "error", text: res.message });
      }
    } catch (err: any) {
      setDangerMessage({ type: "error", text: err.message || "Failed to reset products." });
    } finally {
      setIsResettingProducts(false);
    }
  };

  const updateFeature = (index: number, field: keyof PromotionFeature, value: string) => {
    if (!settings) return;
    const features = [...settings.promotionFeatures];
    features[index] = { ...features[index], [field]: value };
    setSettings({ ...settings, promotionFeatures: features });
  };

  const addFeature = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      promotionFeatures: [
        ...settings.promotionFeatures,
        { emoji: "🎉", title: "", description: "" },
      ],
    });
  };

  const removeFeature = (index: number) => {
    if (!settings) return;
    const features = settings.promotionFeatures.filter((_, i) => i !== index);
    setSettings({ ...settings, promotionFeatures: features });
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
                className={inputClass}
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
                className={inputClass}
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
                className={inputClass}
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
                className={inputClass}
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
                className={inputClass}
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
                className={inputClass}
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
              className={`${inputClass} resize-none`}
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
            Homepage Hero
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
              className={inputClass}
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
              className={`${inputClass} resize-none`}
            />
          </div>
        </motion.div>

        {/* ─── Promotion / Festival Section ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.03] border border-white/5 rounded-xl p-6 space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" />
              <h3 className="text-xs text-white/30 uppercase tracking-wider">
                Promotion / Festival Section
              </h3>
            </div>
            {/* Enable / Disable Toggle */}
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  promotionEnabled: !settings.promotionEnabled,
                })
              }
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.promotionEnabled ? "bg-emerald-500" : "bg-white/10"
              }`}
              role="switch"
              aria-checked={settings.promotionEnabled}
              aria-label={`Promotion section is ${settings.promotionEnabled ? "enabled" : "disabled"}. Click to toggle.`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  settings.promotionEnabled
                    ? "translate-x-[22px]"
                    : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <p className="text-xs text-white/20">
            Configure the promotional section on the homepage. Change for any occasion — Diwali, Christmas, Mother&apos;s Day, Raksha Bandhan, etc.
          </p>

          {settings.promotionEnabled && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="promo-emoji" className="block text-xs text-white/40 mb-1.5">
                    Badge Emoji
                  </label>
                  <input
                    id="promo-emoji"
                    type="text"
                    value={settings.promotionEmoji}
                    onChange={(e) =>
                      setSettings({ ...settings, promotionEmoji: e.target.value })
                    }
                    placeholder="❤️"
                    className={inputClass}
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="promo-badge" className="block text-xs text-white/40 mb-1.5">
                    Badge Text (e.g. &quot;Diwali Special&quot;)
                  </label>
                  <input
                    id="promo-badge"
                    type="text"
                    value={settings.promotionBadge}
                    onChange={(e) =>
                      setSettings({ ...settings, promotionBadge: e.target.value })
                    }
                    placeholder="Mother's Day Special"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="promo-title" className="block text-xs text-white/40 mb-1.5">
                  Section Title
                </label>
                <input
                  id="promo-title"
                  type="text"
                  value={settings.promotionTitle}
                  onChange={(e) =>
                    setSettings({ ...settings, promotionTitle: e.target.value })
                  }
                  placeholder="This Diwali, Gift Heritage"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="promo-subtitle" className="block text-xs text-white/40 mb-1.5">
                  Section Description
                </label>
                <textarea
                  id="promo-subtitle"
                  value={settings.promotionSubtitle}
                  onChange={(e) =>
                    setSettings({ ...settings, promotionSubtitle: e.target.value })
                  }
                  rows={3}
                  placeholder="A description about the occasion and why your products make great gifts..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Feature Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/40">Feature Cards</p>
                  {settings.promotionFeatures.length < 4 && (
                    <button
                      onClick={addFeature}
                      className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <Plus size={12} /> Add Feature
                    </button>
                  )}
                </div>
                {settings.promotionFeatures.map((feature, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[60px_1fr_1fr_32px] gap-2 items-start bg-white/[0.02] border border-white/5 rounded-lg p-3"
                  >
                    <input
                      type="text"
                      value={feature.emoji}
                      onChange={(e) => updateFeature(i, "emoji", e.target.value)}
                      placeholder="🎁"
                      className="px-2 py-2 bg-white/5 border border-white/10 rounded text-white text-center text-lg focus:outline-none focus:border-white/25"
                      aria-label={`Feature ${i + 1} emoji`}
                    />
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => updateFeature(i, "title", e.target.value)}
                      placeholder="Feature Title"
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-white/25"
                      aria-label={`Feature ${i + 1} title`}
                    />
                    <input
                      type="text"
                      value={feature.description}
                      onChange={(e) => updateFeature(i, "description", e.target.value)}
                      placeholder="Short description"
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-white/25"
                      aria-label={`Feature ${i + 1} description`}
                    />
                    <button
                      onClick={() => removeFeature(i)}
                      className="p-2 text-white/20 hover:text-rose-400 transition-colors rounded"
                      aria-label={`Remove feature ${i + 1}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Database Sync */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/[0.03] border border-white/5 rounded-xl p-6 space-y-4"
        >
          <h3 className="text-xs text-white/30 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Database size={14} /> Database Synchronization
          </h3>
          <p className="text-xs text-white/40 leading-relaxed">
            Synchronize all settings, products (including custom added ones like product 13), customer orders, and reviews currently saved in your local browser storage directly with the remote Supabase database.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${supabaseActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="text-xs text-white/60">
                  {supabaseActive ? 'Supabase is fully configured' : 'Supabase is running in local storage fallback'}
                </span>
              </div>
            </div>

            <button
              onClick={handleSync}
              disabled={isSyncing || !supabaseActive}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#0A0A0A] disabled:bg-white/10 disabled:text-white/30 text-xs font-semibold rounded-lg hover:bg-white/95 transition-all"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="animate-spin" size={13} />
                  Synchronizing...
                </>
              ) : (
                <>
                  <RefreshCw size={13} />
                  Sync Local Data to Supabase
                </>
              )}
            </button>
          </div>

          {syncMessage && (
            <div className={`p-4 rounded-lg text-xs leading-relaxed border ${
              syncMessage.type === "success" 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" 
                : "bg-rose-500/10 border-rose-500/20 text-rose-300"
            }`}>
              {syncMessage.text}
            </div>
          )}
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-rose-950/10 border border-rose-500/10 rounded-xl p-6 space-y-4"
        >
          <h3 className="text-xs text-rose-400 font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
            ⚠️ Danger Zone
          </h3>
          <p className="text-xs text-white/40 leading-relaxed">
            Perform database maintenance tasks. Use these options with caution when preparing the website for client launch.
          </p>

          <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Clear Orders */}
            <div className="bg-rose-950/5 border border-rose-500/5 rounded-lg p-4 flex flex-col justify-between gap-4">
              <div>
                <h4 className="text-xs font-semibold text-rose-300">Clear All Orders</h4>
                <p className="text-[10px] text-white/30 mt-1 leading-relaxed">
                  Permanently deletes all customer checkout orders, transaction references, and order status histories.
                </p>
              </div>
              <button
                onClick={handleClearOrders}
                disabled={isClearingOrders}
                className="w-full py-2 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-300 disabled:opacity-50 text-xs font-medium rounded-lg transition-colors"
              >
                {isClearingOrders ? "Clearing..." : "Delete All Orders"}
              </button>
            </div>

            {/* Reset Products */}
            <div className="bg-rose-950/5 border border-rose-500/5 rounded-lg p-4 flex flex-col justify-between gap-4">
              <div>
                <h4 className="text-xs font-semibold text-rose-300">Reset Products Catalog</h4>
                <p className="text-[10px] text-white/30 mt-1 leading-relaxed">
                  Removes all newly added custom products (such as test product 13) and resets the catalog to the 12 original seeded master weavers' products.
                </p>
              </div>
              <button
                onClick={handleResetProducts}
                disabled={isResettingProducts}
                className="w-full py-2 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-300 disabled:opacity-50 text-xs font-medium rounded-lg transition-colors"
              >
                {isResettingProducts ? "Resetting..." : "Reset to 12 Seed Products"}
              </button>
            </div>
          </div>

          {dangerMessage && (
            <div className={`p-4 rounded-lg text-xs leading-relaxed border ${
              dangerMessage.type === "success" 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" 
                : "bg-rose-500/10 border-rose-500/20 text-rose-300"
            }`}>
              {dangerMessage.text}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/hungerai/supabase";
import type { Restaurant } from "@/types/hungerai";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";

type SubStatus = "trial" | "active" | "expired" | "suspended";
type SubPlan = "starter" | "boost" | "pro";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [subModal, setSubModal] = useState<Restaurant | null>(null);

  const handleSignOut = async () => {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/hungerai/login");
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = createBrowserSupabaseClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/hungerai/login");
        return;
      }

      // Check if admin
      if (session.user.email !== ADMIN_EMAIL) {
        router.push("/hungerai/login");
        return;
      }

      setIsAdmin(true);

      // Fetch all restaurants
      const { data } = await supabase
        .from("restaurants")
        .select("*")
        .order("created_at", { ascending: false });

      setRestaurants((data || []) as Restaurant[]);
      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="hai-skeleton w-32 h-8" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <img src="/branding/hungerai-logo.png" alt="HungerAI" style={{ height: 36, width: "auto" }} draggable={false} />
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="hai-btn hai-btn-primary"
          >
            + Add Restaurant
          </button>
          <button
            onClick={handleSignOut}
            className="hai-btn hai-btn-secondary"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats */}
      {(() => {
        const rs = restaurants as any[];
        const active = rs.filter(r => r.subscription_status === "active").length;
        const trial = rs.filter(r => r.subscription_status === "trial").length;
        const expired = rs.filter(r => r.subscription_status === "expired" || r.subscription_status === "suspended").length;
        const expiringSoon = rs.filter(r => {
          if (r.subscription_status !== "active" || !r.subscription_expires_at) return false;
          const days = Math.ceil((new Date(r.subscription_expires_at).getTime() - Date.now()) / 86400000);
          return days <= 7 && days > 0;
        }).length;
        const MRR_MAP: Record<string, number> = { starter: 3999, boost: 4999, pro: 6999 };
        const mrr = rs.filter(r => r.subscription_status === "active" && r.subscription_plan)
          .reduce((sum: number, r: any) => sum + (MRR_MAP[r.subscription_plan] || 0), 0);

        const stats = [
          { label: "Total Restaurants", value: restaurants.length, color: "var(--hai-text-primary)", sub: "all time" },
          { label: "Active", value: active, color: "#22c55e", sub: "subscribed" },
          { label: "On Trial", value: trial, color: "#60a5fa", sub: "free tier" },
          { label: "Expired / Suspended", value: expired, color: "#ef4444", sub: "no access" },
          { label: "Expiring ≤ 7 days", value: expiringSoon, color: "#f59e0b", sub: "needs renewal" },
          { label: "Est. MRR", value: `Rs. ${mrr.toLocaleString()}`, color: "#a78bfa", sub: "active plans" },
        ];

        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {stats.map((s) => (
              <div key={s.label} className="hai-card p-4">
                <p className="text-xs text-[var(--hai-text-muted)] mb-1 uppercase tracking-wide">{s.label}</p>
                <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-[var(--hai-text-muted)] mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        );
      })()}

      {/* Subscription breakdown bar */}
      {restaurants.length > 0 && (() => {
        const rs = restaurants as any[];
        const counts: Record<string, number> = { starter: 0, boost: 0, pro: 0 };
        rs.filter(r => r.subscription_status === "active" && r.subscription_plan)
          .forEach((r: any) => { counts[r.subscription_plan] = (counts[r.subscription_plan] || 0) + 1; });
        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        const plans = [
          { key: "starter", label: "Starter", color: "#60a5fa" },
          { key: "boost",   label: "Boost",   color: "#f97316" },
          { key: "pro",     label: "Pro",     color: "#a78bfa" },
        ];
        if (total === 0) return null;
        return (
          <div className="hai-card p-4 mb-6">
            <p className="text-xs text-[var(--hai-text-muted)] uppercase tracking-wide mb-3">Active Plan Distribution</p>
            <div className="flex rounded-full overflow-hidden h-3 mb-3">
              {plans.map(p => (
                counts[p.key] > 0 && (
                  <div key={p.key} style={{ width: `${(counts[p.key] / total) * 100}%`, background: p.color }} />
                )
              ))}
            </div>
            <div className="flex gap-4">
              {plans.map(p => (
                <div key={p.key} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                  <span className="text-xs text-[var(--hai-text-muted)]">{p.label} <strong className="text-[var(--hai-text-primary)]">{counts[p.key]}</strong></span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Restaurants List */}
      <div className="hai-card overflow-hidden">
        {/* Header row */}
        <div className="grid px-4 py-2 border-b border-[var(--hai-border-subtle)]"
          style={{ gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1.2fr 2fr" }}>
          {["Restaurant","Owner","WhatsApp","Status","Subscription","Actions"].map(h => (
            <span key={h} className="text-xs font-semibold text-[var(--hai-text-muted)] uppercase tracking-wide">{h}</span>
          ))}
        </div>

        {/* Data rows */}
        {restaurants.map((restaurant) => {
          const r = restaurant as any;
          const subStatus: SubStatus = r.subscription_status || "trial";
          const plan: SubPlan | null = r.subscription_plan || null;
          const exp: string | null = r.subscription_expires_at || null;
          const daysLeft = exp ? Math.ceil((new Date(exp).getTime() - Date.now()) / 86400000) : null;

          const subColors: Record<string, string> = {
            trial: "bg-blue-500/20 text-blue-400",
            active: "bg-[var(--hai-accent-green)]/20 text-[var(--hai-accent-green)]",
            expired: "bg-[var(--hai-accent-red)]/20 text-[var(--hai-accent-red)]",
            suspended: "bg-yellow-500/20 text-yellow-400",
          };

          return (
            <div key={restaurant.id}
              className="grid px-4 py-3 border-b border-[var(--hai-border-subtle)] last:border-0 hover:bg-white/5 transition-colors items-center"
              style={{ gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1.2fr 2fr" }}>

              {/* Restaurant */}
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{restaurant.name}</p>
                <p className="text-xs text-[var(--hai-text-muted)] truncate">/{restaurant.slug}</p>
              </div>

              {/* Owner */}
              <p className="text-sm text-[var(--hai-text-muted)] truncate pr-2">{restaurant.owner_email || "—"}</p>

              {/* WhatsApp */}
              <a href={`https://wa.me/${restaurant.whatsapp_number}`} target="_blank" rel="noopener noreferrer"
                className="text-sm text-[var(--hai-accent-wa)] hover:underline truncate">
                {restaurant.whatsapp_number}
              </a>

              {/* Status */}
              <span className={`text-xs font-medium px-2 py-1 rounded-full w-fit ${
                restaurant.is_open
                  ? "bg-[var(--hai-accent-green)]/20 text-[var(--hai-accent-green)]"
                  : "bg-[var(--hai-accent-red)]/20 text-[var(--hai-accent-red)]"
              }`}>
                {restaurant.is_open ? "Open" : "Closed"}
              </span>

              {/* Subscription */}
              <div className="flex flex-col gap-0.5">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${subColors[subStatus]}`}>
                  {subStatus.charAt(0).toUpperCase() + subStatus.slice(1)}
                </span>
                {plan && (
                  <span className="text-xs text-[var(--hai-text-muted)]">
                    {plan.charAt(0).toUpperCase() + plan.slice(1)}
                    {daysLeft !== null && (
                      <span className={daysLeft <= 7 ? " text-yellow-400" : ""}>
                        {" · "}{daysLeft > 0 ? `${daysLeft}d` : "expired"}
                      </span>
                    )}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 whitespace-nowrap">
                <a href={`/hungerai/${restaurant.slug}`} target="_blank"
                  className="text-xs font-medium text-[var(--hai-accent-green)] hover:underline whitespace-nowrap">
                  View Menu
                </a>
                <button onClick={() => setSubModal(restaurant)}
                  className="text-xs text-[var(--hai-text-muted)] hover:text-white underline whitespace-nowrap">
                  Subscription
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Add Restaurant Modal */}
      {showAddModal && (
        <AddRestaurantModal
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
            window.location.reload();
          }}
        />
      )}

      {/* Subscription Modal */}
      {subModal && (
        <SubscriptionModal
          restaurant={subModal}
          onClose={() => setSubModal(null)}
          onSave={() => {
            setSubModal(null);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

function AddRestaurantModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    slug: "",
    name: "",
    whatsapp_number: "",
    owner_email: "",
    city_lat: "31.5204",
    city_lng: "74.3587",
    delivery_base_fee: "50",
    delivery_fee_per_km: "20",
    delivery_radius_km: "10",
    online_payment_details: "",
    card_on_delivery_enabled: false,
    pickup_enabled: false,
    delivery_enabled: true,
    pickup_address: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!form.slug || !form.name || !form.whatsapp_number) {
      setError("Slug, name, and WhatsApp number are required");
      return;
    }

    setSaving(true);
    setError(null);

    const supabase = createBrowserSupabaseClient();

    const { error: insertError } = await supabase.from("restaurants").insert({
      slug: form.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      name: form.name,
      whatsapp_number: form.whatsapp_number.replace(/\D/g, ""),
      owner_email: form.owner_email || null,
      city_lat: parseFloat(form.city_lat),
      city_lng: parseFloat(form.city_lng),
      delivery_base_fee: parseInt(form.delivery_base_fee),
      delivery_fee_per_km: parseInt(form.delivery_fee_per_km),
      delivery_radius_km: parseInt(form.delivery_radius_km),
      online_payment_details: form.online_payment_details || null,
      card_on_delivery_enabled: form.card_on_delivery_enabled,
      pickup_enabled: form.pickup_enabled,
      delivery_enabled: form.delivery_enabled,
      pickup_address: form.pickup_address || null,
      is_open: true,
    });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-[var(--hai-bg-secondary)] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="font-display text-xl font-bold mb-4">Add Restaurant</h2>

        {error && (
          <div className="hai-closed-banner mb-4 text-sm">⚠️ {error}</div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--hai-text-muted)] mb-1">
                Slug *
              </label>
              <input
                type="text"
                className="hai-input"
                placeholder="burger-point"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--hai-text-muted)] mb-1">
                Name *
              </label>
              <input
                type="text"
                className="hai-input"
                placeholder="Burger Point"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--hai-text-muted)] mb-1">
                WhatsApp Number *
              </label>
              <input
                type="text"
                className="hai-input"
                placeholder="923001234567"
                value={form.whatsapp_number}
                onChange={(e) =>
                  setForm({ ...form, whatsapp_number: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--hai-text-muted)] mb-1">
                Owner Email
              </label>
              <input
                type="email"
                className="hai-input"
                placeholder="owner@restaurant.pk"
                value={form.owner_email}
                onChange={(e) => setForm({ ...form, owner_email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--hai-text-muted)] mb-1">
                City Latitude
              </label>
              <input
                type="text"
                className="hai-input"
                value={form.city_lat}
                onChange={(e) => setForm({ ...form, city_lat: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--hai-text-muted)] mb-1">
                City Longitude
              </label>
              <input
                type="text"
                className="hai-input"
                value={form.city_lng}
                onChange={(e) => setForm({ ...form, city_lng: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-[var(--hai-text-muted)] mb-1">
                Base Fee (Rs)
              </label>
              <input
                type="number"
                className="hai-input"
                value={form.delivery_base_fee}
                onChange={(e) =>
                  setForm({ ...form, delivery_base_fee: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--hai-text-muted)] mb-1">
                Per KM (Rs)
              </label>
              <input
                type="number"
                className="hai-input"
                value={form.delivery_fee_per_km}
                onChange={(e) =>
                  setForm({ ...form, delivery_fee_per_km: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--hai-text-muted)] mb-1">
                Radius (KM)
              </label>
              <input
                type="number"
                className="hai-input"
                value={form.delivery_radius_km}
                onChange={(e) =>
                  setForm({ ...form, delivery_radius_km: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[var(--hai-text-muted)] mb-1">
              Online Payment Details
            </label>
            <textarea
              className="hai-input min-h-[80px]"
              placeholder="JazzCash: 0300-1234567&#10;Bank: HBL 1234567890"
              value={form.online_payment_details}
              onChange={(e) =>
                setForm({ ...form, online_payment_details: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="card_on_delivery"
              checked={form.card_on_delivery_enabled}
              onChange={(e) => setForm({ ...form, card_on_delivery_enabled: e.target.checked })}
              className="w-4 h-4 accent-[var(--hai-accent-primary)]"
            />
            <label htmlFor="card_on_delivery" className="text-sm text-[var(--hai-text-secondary)] cursor-pointer">
              Card on Delivery enabled
            </label>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="delivery_enabled"
                checked={form.delivery_enabled}
                onChange={(e) => setForm({ ...form, delivery_enabled: e.target.checked })}
                className="w-4 h-4 accent-[var(--hai-accent-primary)]"
              />
              <label htmlFor="delivery_enabled" className="text-sm text-[var(--hai-text-secondary)] cursor-pointer">
                Delivery enabled
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="pickup_enabled"
                checked={form.pickup_enabled}
                onChange={(e) => setForm({ ...form, pickup_enabled: e.target.checked })}
                className="w-4 h-4 accent-[var(--hai-accent-primary)]"
              />
              <label htmlFor="pickup_enabled" className="text-sm text-[var(--hai-text-secondary)] cursor-pointer">
                Pickup enabled
              </label>
            </div>
          </div>

          {form.pickup_enabled && (
            <div>
              <label className="block text-sm text-[var(--hai-text-muted)] mb-1">
                Pickup Address
              </label>
              <input
                type="text"
                className="hai-input"
                placeholder="Shop 4, DHA Phase 5, Lahore"
                value={form.pickup_address}
                onChange={(e) => setForm({ ...form, pickup_address: e.target.value })}
              />
              <p className="text-xs text-[var(--hai-text-muted)] mt-1">Shown to customers on pickup orders. Map pin uses City Lat/Lng above.</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="hai-btn hai-btn-secondary flex-1">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="hai-btn hai-btn-primary flex-1"
          >
            {saving ? "Creating..." : "Create Restaurant"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Subscription Modal
// ---------------------------------------------------------------------------
const PLANS: { value: SubPlan; label: string; monthly: string }[] = [
  { value: "starter", label: "Starter", monthly: "Rs. 3,999/mo" },
  { value: "boost",   label: "Boost",   monthly: "Rs. 4,999/mo" },
  { value: "pro",     label: "Pro",     monthly: "Rs. 6,999/mo" },
];

const DURATIONS: { label: string; months: number }[] = [
  { label: "1 Month",  months: 1 },
  { label: "3 Months", months: 3 },
  { label: "6 Months", months: 6 },
  { label: "1 Year",   months: 12 },
];

function SubscriptionModal({
  restaurant,
  onClose,
  onSave,
}: {
  restaurant: Restaurant;
  onClose: () => void;
  onSave: () => void;
}) {
  const r = restaurant as any;
  const [plan, setPlan] = useState<SubPlan>(r.subscription_plan || "starter");
  const [months, setMonths] = useState(1);
  const [status, setStatus] = useState<SubStatus>(r.subscription_status || "trial");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expiresAt = r.subscription_expires_at
    ? new Date(r.subscription_expires_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })
    : null;

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const supabase = createBrowserSupabaseClient();

    // Compute new expiry: extend from today or from existing expiry (whichever is later)
    const base = r.subscription_expires_at && new Date(r.subscription_expires_at) > new Date()
      ? new Date(r.subscription_expires_at)
      : new Date();
    const newExpiry = new Date(base);
    newExpiry.setMonth(newExpiry.getMonth() + months);

    const { error: updateError } = await supabase
      .from("restaurants")
      .update({
        subscription_status: status === "trial" || status === "suspended" ? status : "active",
        subscription_plan: status === "trial" || status === "suspended" ? null : plan,
        subscription_expires_at: status === "active" ? newExpiry.toISOString() : null,
      })
      .eq("id", restaurant.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-[var(--hai-bg-secondary)] rounded-2xl p-6 w-full max-w-sm">
        <h2 className="font-display text-lg font-bold mb-1">Subscription</h2>
        <p className="text-sm text-[var(--hai-text-muted)] mb-4">{restaurant.name}</p>

        {expiresAt && (
          <div className="hai-card p-3 mb-4 text-sm text-center">
            Current expiry: <strong>{expiresAt}</strong>
          </div>
        )}

        {error && (
          <div className="hai-closed-banner mb-4 text-sm">⚠️ {error}</div>
        )}

        {/* Status */}
        <div className="mb-4">
          <label className="block text-sm text-[var(--hai-text-muted)] mb-2">Status</label>
          <div className="grid grid-cols-2 gap-2">
            {(["trial", "active", "expired", "suspended"] as SubStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-2 rounded-lg text-sm capitalize border transition-colors ${
                  status === s
                    ? "border-[var(--hai-accent-primary)] bg-[var(--hai-accent-primary)]/10 text-[var(--hai-accent-primary)]"
                    : "border-[var(--hai-border-subtle)] text-[var(--hai-text-muted)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Plan — only when activating */}
        {status === "active" && (
          <>
            <div className="mb-4">
              <label className="block text-sm text-[var(--hai-text-muted)] mb-2">Plan</label>
              <div className="grid grid-cols-3 gap-2">
                {PLANS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPlan(p.value)}
                    className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                      plan === p.value
                        ? "border-[var(--hai-accent-primary)] bg-[var(--hai-accent-primary)]/10 text-[var(--hai-accent-primary)]"
                        : "border-[var(--hai-border-subtle)] text-[var(--hai-text-muted)]"
                    }`}
                  >
                    <div className="font-semibold">{p.label}</div>
                    <div style={{ fontSize: 10 }}>{p.monthly}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-[var(--hai-text-muted)] mb-2">Add Duration</label>
              <div className="grid grid-cols-2 gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d.months}
                    onClick={() => setMonths(d.months)}
                    className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                      months === d.months
                        ? "border-[var(--hai-accent-primary)] bg-[var(--hai-accent-primary)]/10 text-[var(--hai-accent-primary)]"
                        : "border-[var(--hai-border-subtle)] text-[var(--hai-text-muted)]"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="hai-btn hai-btn-secondary flex-1">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="hai-btn hai-btn-primary flex-1">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

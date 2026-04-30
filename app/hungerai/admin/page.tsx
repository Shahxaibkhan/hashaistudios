"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/hungerai/supabase";
import type { Restaurant } from "@/types/hungerai";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

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
    <div className="min-h-screen px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Admin Panel</h1>
          <p className="text-[var(--hai-text-muted)]">
            Manage all HungerAI restaurants
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="hai-btn hai-btn-primary"
        >
          + Add Restaurant
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="hai-card p-4 text-center">
          <p className="text-3xl font-bold text-[var(--hai-accent-green)]">
            {restaurants.length}
          </p>
          <p className="text-sm text-[var(--hai-text-muted)]">Restaurants</p>
        </div>
        <div className="hai-card p-4 text-center">
          <p className="text-3xl font-bold text-[var(--hai-accent-green)]">
            {restaurants.filter((r) => r.is_open).length}
          </p>
          <p className="text-sm text-[var(--hai-text-muted)]">Open Now</p>
        </div>
        <div className="hai-card p-4 text-center">
          <p className="text-3xl font-bold text-[var(--hai-accent-amber)]">
            {restaurants.filter((r) => !r.is_open).length}
          </p>
          <p className="text-sm text-[var(--hai-text-muted)]">Closed</p>
        </div>
      </div>

      {/* Restaurants Table */}
      <div className="hai-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--hai-border-subtle)]">
                <th className="text-left px-4 py-3 text-sm font-medium text-[var(--hai-text-muted)]">
                  Restaurant
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[var(--hai-text-muted)]">
                  Slug
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[var(--hai-text-muted)]">
                  Owner
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[var(--hai-text-muted)]">
                  WhatsApp
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[var(--hai-text-muted)]">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[var(--hai-text-muted)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => (
                <tr
                  key={restaurant.id}
                  className="border-b border-[var(--hai-border-subtle)] last:border-0"
                >
                  <td className="px-4 py-3 font-medium">{restaurant.name}</td>
                  <td className="px-4 py-3 text-sm text-[var(--hai-text-muted)]">
                    /{restaurant.slug}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--hai-text-muted)]">
                    {restaurant.owner_email || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <a
                      href={`https://wa.me/${restaurant.whatsapp_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--hai-accent-wa)] hover:underline"
                    >
                      {restaurant.whatsapp_number}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        restaurant.is_open
                          ? "bg-[var(--hai-accent-green)]/20 text-[var(--hai-accent-green)]"
                          : "bg-[var(--hai-accent-red)]/20 text-[var(--hai-accent-red)]"
                      }`}
                    >
                      {restaurant.is_open ? "Open" : "Closed"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`/hungerai/${restaurant.slug}`}
                      target="_blank"
                      className="text-sm text-[var(--hai-accent-green)] hover:underline"
                    >
                      View Menu
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/hungerai/supabase";
import type { Order } from "@/types/hungerai";

type FilterType = "today" | "week" | "all";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("today");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const supabase = createBrowserSupabaseClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      // Get restaurant
      const { data: restaurantData } = await supabase
        .from("restaurants")
        .select("id")
        .eq("owner_email", session.user.email)
        .single();

      if (!restaurantData) return;

      // Build query
      let query = supabase
        .from("orders")
        .select("*")
        .eq("restaurant_id", restaurantData.id)
        .order("created_at", { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);

      // Apply date filter
      const now = new Date();
      if (filter === "today") {
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        query = query.gte("created_at", todayStart);
      } else if (filter === "week") {
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte("created_at", weekStart);
      }

      const { data } = await query;
      setOrders((data || []) as Order[]);
      setLoading(false);
    };

    fetchOrders();
  }, [filter, page]);

  // Filter by search
  const filteredOrders = orders.filter((order) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      order.order_number.toString().includes(search) ||
      order.customer_name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">Orders</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4">
        {/* Date Filter */}
        <div className="flex gap-2">
          {(["today", "week", "all"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(0);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-[var(--hai-accent-green)] text-white"
                  : "bg-[var(--hai-bg-card)] text-[var(--hai-text-secondary)] hover:text-[var(--hai-text-primary)]"
              }`}
            >
              {f === "today" ? "Today" : f === "week" ? "This Week" : "All Time"}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          className="hai-input"
          placeholder="Search by order # or customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="hai-skeleton h-32 rounded-xl" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-4xl">📦</span>
          <p className="text-[var(--hai-text-muted)] mt-4">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {orders.length === pageSize && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="hai-btn hai-btn-secondary px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="hai-btn hai-btn-secondary px-4 py-2"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const items = order.items as any[];
  const createdAt = new Date(order.created_at);
  const timeAgo = getTimeAgo(createdAt);
  const formattedDate = createdAt.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const openWhatsApp = () => {
    window.open(`https://wa.me/${order.customer_whatsapp}`, "_blank");
  };

  const openLocation = () => {
    if (order.delivery_lat && order.delivery_lng) {
      window.open(
        `https://maps.google.com/?q=${order.delivery_lat},${order.delivery_lng}`,
        "_blank"
      );
    }
  };

  return (
    <div className="hai-card p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg">
              #{order.order_number}
            </span>
            <span className="text-sm text-[var(--hai-text-muted)]">{timeAgo}</span>
          </div>
          <p className="text-xs text-[var(--hai-text-muted)]">{formattedDate}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg text-[var(--hai-accent-green)]">
            Rs {order.total.toLocaleString("en-PK")}
          </p>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              order.payment_method === "cod"
                ? "bg-[var(--hai-accent-amber)]/20 text-[var(--hai-accent-amber)]"
                : "bg-[var(--hai-accent-green)]/20 text-[var(--hai-accent-green)]"
            }`}
          >
            {order.payment_method === "cod" ? "COD" : "Online"}
          </span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-3 pb-3 border-b border-[var(--hai-border-subtle)]">
        <p className="font-medium">{order.customer_name}</p>
        <div className="flex items-center gap-4 mt-1">
          <button
            onClick={openWhatsApp}
            className="text-sm text-[var(--hai-accent-wa)] hover:underline"
          >
            📱 {formatPhone(order.customer_whatsapp)}
          </button>
          {order.delivery_lat && order.delivery_lng && (
            <button
              onClick={openLocation}
              className="text-sm text-[var(--hai-accent-green)] hover:underline"
            >
              📍 View Location
            </button>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="space-y-1">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-[var(--hai-text-secondary)]">
              {item.qty}x {item.name}
              {item.options?.length > 0 && (
                <span className="text-[var(--hai-text-muted)]">
                  {" "}
                  (+{item.options.map((o: any) => o.label).join(", ")})
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-3 pt-3 border-t border-[var(--hai-border-subtle)] text-sm">
        <div className="flex justify-between text-[var(--hai-text-muted)]">
          <span>Subtotal</span>
          <span>Rs {order.subtotal.toLocaleString("en-PK")}</span>
        </div>
        <div className="flex justify-between text-[var(--hai-text-muted)]">
          <span>Delivery</span>
          <span>Rs {order.delivery_fee.toLocaleString("en-PK")}</span>
        </div>
      </div>

      {/* WhatsApp Status */}
      <div className="mt-3 flex items-center gap-2 text-sm">
        {order.wa_sent ? (
          <span className="text-[var(--hai-accent-green)]">
            ✓ Sent via WhatsApp
          </span>
        ) : (
          <span className="text-[var(--hai-accent-amber)]">
            ⚠ Not sent via WhatsApp
          </span>
        )}
      </div>
    </div>
  );
}

function formatPhone(phone: string): string {
  if (phone.startsWith("92") && phone.length === 12) {
    return `0${phone.slice(2, 5)}-${phone.slice(5)}`;
  }
  return phone;
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

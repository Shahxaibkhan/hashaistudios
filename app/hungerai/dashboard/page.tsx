"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/hungerai/supabase";
import type { Restaurant, Order } from "@/types/hungerai";

interface Stats {
  ordersToday: number;
  ordersThisWeek: number;
  revenueToday: number;
  revenueThisWeek: number;
  topItem: string | null;
}

export default function DashboardHomePage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createBrowserSupabaseClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const { data: restaurantData } = await supabase
        .from("restaurants")
        .select("*")
        .eq("owner_email", session.user.email)
        .single();

      if (!restaurantData) return;
      setRestaurant(restaurantData as Restaurant);

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("restaurant_id", restaurantData.id)
        .gte("created_at", weekStart)
        .order("created_at", { ascending: false });

      const orders = (ordersData || []) as Order[];
      const ordersToday = orders.filter((o) => o.created_at >= todayStart);

      const itemCounts: Record<string, number> = {};
      orders.forEach((order) => {
        const items = order.items as { name: string; qty: number }[];
        items.forEach((item) => {
          itemCounts[item.name] = (itemCounts[item.name] || 0) + item.qty;
        });
      });
      const topItem = Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

      setStats({
        ordersToday: ordersToday.length,
        ordersThisWeek: orders.length,
        revenueToday: ordersToday.reduce((sum, o) => sum + o.total, 0),
        revenueThisWeek: orders.reduce((sum, o) => sum + o.total, 0),
        topItem,
      });

      setRecentOrders(orders.slice(0, 5));
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCopy = () => {
    if (!restaurant) return;
    navigator.clipboard.writeText(`${window.location.origin}/hungerai/${restaurant.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="hai-skeleton h-28 rounded-2xl" />
          ))}
        </div>
        <div className="hai-skeleton h-40 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<PackageIcon />}
          label="Orders Today"
          value={stats?.ordersToday.toString() || "0"}
          trend={stats?.ordersToday ? "+12%" : undefined}
        />
        <StatCard
          icon={<WalletIcon />}
          label="Revenue Today"
          value={`Rs ${(stats?.revenueToday || 0).toLocaleString("en-PK")}`}
          accent
        />
        <StatCard
          icon={<ChartIcon />}
          label="This Week"
          value={stats?.ordersThisWeek.toString() || "0"}
          subtext="orders"
        />
        <StatCard
          icon={<TrophyIcon />}
          label="Top Seller"
          value={stats?.topItem || "—"}
          small
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/hungerai/dashboard/orders" className="group">
          <div className="hai-card p-6 flex items-center gap-5 group-hover:border-[var(--hai-accent-primary)] transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff6b35] to-[#f7931e] flex items-center justify-center shadow-md">
              <PackageIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg font-bold">View Orders</h3>
              <p className="text-sm text-[var(--hai-text-muted)]">Track and manage incoming orders</p>
            </div>
            <ArrowIcon className="w-5 h-5 text-[var(--hai-text-muted)] group-hover:text-[var(--hai-accent-primary)] group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
        
        <Link href="/hungerai/dashboard/menu" className="group">
          <div className="hai-card p-6 flex items-center gap-5 group-hover:border-[var(--hai-accent-primary)] transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center shadow-md">
              <MenuIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg font-bold">Manage Menu</h3>
              <p className="text-sm text-[var(--hai-text-muted)]">Edit items, prices & categories</p>
            </div>
            <ArrowIcon className="w-5 h-5 text-[var(--hai-text-muted)] group-hover:text-[var(--hai-accent-primary)] group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </div>

      {/* Menu Link Card */}
      {restaurant && (
        <div className="hai-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-display text-lg font-bold">Your Menu Link</h3>
              <p className="text-sm text-[var(--hai-text-muted)] mt-1">
                Share with customers or use as WhatsApp auto-reply
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[var(--hai-accent-primary-light)] flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-[var(--hai-accent-primary)]" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                readOnly
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/hungerai/${restaurant.slug}`}
                className="hai-input pr-12 text-sm font-mono"
              />
            </div>
            <button
              onClick={handleCopy}
              className={`hai-btn ${copied ? 'hai-btn-primary' : 'hai-btn-secondary'} min-w-[100px] transition-all`}
            >
              {copied ? (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <CopyIcon className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Recent Orders</h2>
            <Link
              href="/hungerai/dashboard/orders"
              className="text-sm font-medium text-[var(--hai-accent-primary)] hover:underline flex items-center gap-1"
            >
              View all
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  trend,
  subtext,
  accent,
  small,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  subtext?: string;
  accent?: boolean;
  small?: boolean;
}) {
  return (
    <div className="hai-stat-card">
      <div className={`stat-icon ${accent ? 'bg-[var(--hai-accent-primary-light)]' : ''}`}>
        {icon}
      </div>
      <p className="stat-label">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className={`stat-value ${small ? 'text-lg truncate' : ''}`}>{value}</p>
        {subtext && <span className="text-sm text-[var(--hai-text-muted)]">{subtext}</span>}
        {trend && (
          <span className="text-xs font-semibold text-[var(--hai-accent-green)] bg-[var(--hai-accent-green-light)] px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const items = order.items as { name: string; qty: number }[];
  const itemText = items.map((i) => `${i.qty}x ${i.name}`).join(", ");
  const time = new Date(order.created_at).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="hai-card p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-[var(--hai-bg-secondary)] flex items-center justify-center text-lg font-bold text-[var(--hai-text-muted)]">
        #{order.order_number}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{order.customer_name}</p>
        <p className="text-sm text-[var(--hai-text-muted)] truncate">{itemText}</p>
      </div>
      <div className="text-right">
        <p className="font-display font-bold hai-price">
          Rs {order.total.toLocaleString("en-PK")}
        </p>
        <p className="text-xs text-[var(--hai-text-muted)]">{time}</p>
      </div>
    </div>
  );
}

// Icons
function PackageIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function WalletIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

function ChartIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function TrophyIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function MenuIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function ArrowIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

function LinkIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function CopyIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

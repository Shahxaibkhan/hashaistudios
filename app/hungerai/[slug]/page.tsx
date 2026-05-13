import { notFound } from "next/navigation";
import { createSimpleServerClient } from "@/lib/hungerai/supabase";
import type { RestaurantWithMenu, CategoryWithItems, MenuItemWithOptions } from "@/types/hungerai";
import MenuPage from "@/components/hungerai/customer/MenuPage";

// Force fresh data on every request — no Next.js fetch cache
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getRestaurantWithMenu(slug: string): Promise<RestaurantWithMenu | null> {
  const supabase = createSimpleServerClient();

  // Fetch restaurant
  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .single();

  if (restaurantError || !restaurant) {
    return null;
  }

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("sort_order");

  // Fetch menu items
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("sort_order");

  // Fetch all options for these items
  const itemIds = menuItems?.map((item) => item.id) || [];
  const { data: options } = await supabase
    .from("item_options")
    .select("*")
    .in("menu_item_id", itemIds);

  // Build the menu structure
  const categoriesWithItems: CategoryWithItems[] = (categories || []).map((cat) => ({
    ...cat,
    items: (menuItems || [])
      .filter((item) => item.category_id === cat.id)
      .map((item) => ({
        ...item,
        options: (options || []).filter((opt) => opt.menu_item_id === item.id),
      })) as MenuItemWithOptions[],
  }));

  return {
    ...restaurant,
    categories: categoriesWithItems,
  } as RestaurantWithMenu;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const restaurant = await getRestaurantWithMenu(slug);

  if (!restaurant) {
    return {
      title: "Restaurant Not Found | HungerAI",
    };
  }

  return {
    title: `${restaurant.name} | HungerAI`,
    description: `Order from ${restaurant.name} via WhatsApp`,
  };
}

export default async function RestaurantMenuPage({ params }: PageProps) {
  const { slug } = await params;
  const restaurant = await getRestaurantWithMenu(slug);

  if (!restaurant) {
    notFound();
  }

  // Subscription check — compute effective status server-side
  const now = new Date();
  const isExpired =
    restaurant.subscription_status === "expired" ||
    restaurant.subscription_status === "suspended" ||
    (restaurant.subscription_status === "active" &&
      restaurant.subscription_expires_at !== null &&
      new Date(restaurant.subscription_expires_at) < now);

  if (isExpired) {
    return (
      <div className="hungerai min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <img
          src="/branding/hungerai-logo.png"
          alt="HungerAI"
          style={{ height: 40, width: "auto", marginBottom: 24, opacity: 0.7 }}
          draggable={false}
        />
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h1 className="font-display text-xl font-bold mb-2">{restaurant.name}</h1>
        <p className="text-[var(--hai-text-muted)] text-sm max-w-xs">
          This restaurant&apos;s online menu is temporarily unavailable.
          Please contact the restaurant directly to place an order.
        </p>
        {restaurant.whatsapp_number && (
          <a
            href={`https://wa.me/${restaurant.whatsapp_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hai-btn hai-btn-primary mt-6"
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.104 1.51 5.833L0 24l6.335-1.492A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.374l-.36-.213-3.73.978.995-3.636-.234-.373A9.818 9.818 0 1112 21.818z"/></svg>
            Contact on WhatsApp
          </a>
        )}
      </div>
    );
  }

  // Timing-based open/closed logic (PKT = UTC+5)
  // Only override is_open if both timing fields are set
  if (restaurant.opening_time && restaurant.closing_time) {
    const pkt = new Date(now.getTime() + 5 * 60 * 60 * 1000);
    const [openH, openM] = restaurant.opening_time.split(":").map(Number);
    const [closeH, closeM] = restaurant.closing_time.split(":").map(Number);
    const currentMins = pkt.getUTCHours() * 60 + pkt.getUTCMinutes();
    const openMins = openH * 60 + openM;
    const closeMins = closeH * 60 + closeM;
    // Handle overnight hours (e.g. 20:00 – 02:00)
    if (closeMins > openMins) {
      restaurant.is_open = currentMins >= openMins && currentMins < closeMins;
    } else {
      restaurant.is_open = currentMins >= openMins || currentMins < closeMins;
    }
  }
  // If no timing set, keep is_open as-is from the database

  return <MenuPage restaurant={{
    ...restaurant,
    opening_time: restaurant.opening_time ?? null,
    closing_time: restaurant.closing_time ?? null,
  }} />;
}

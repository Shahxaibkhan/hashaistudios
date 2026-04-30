import { notFound } from "next/navigation";
import { createSimpleServerClient } from "@/lib/hungerai/supabase";
import type { RestaurantWithMenu, CategoryWithItems, MenuItemWithOptions } from "@/types/hungerai";
import MenuPage from "@/components/hungerai/customer/MenuPage";

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

  return <MenuPage restaurant={restaurant} />;
}

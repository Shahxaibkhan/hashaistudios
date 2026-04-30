import { NextRequest, NextResponse } from "next/server";
import { createSimpleServerClient } from "@/lib/hungerai/supabase";
import type { RestaurantWithMenu, CategoryWithItems, MenuItemWithOptions } from "@/types/hungerai";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const supabase = createSimpleServerClient();

    // Fetch restaurant
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("*")
      .eq("slug", slug)
      .single();

    if (restaurantError || !restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
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
      .in("menu_item_id", itemIds.length > 0 ? itemIds : ["none"]);

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

    const result: RestaurantWithMenu = {
      ...restaurant,
      categories: categoriesWithItems,
    } as RestaurantWithMenu;

    return NextResponse.json(result);
  } catch (error) {
    console.error("Menu API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

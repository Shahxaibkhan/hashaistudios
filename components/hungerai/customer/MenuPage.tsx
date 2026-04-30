"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type { RestaurantWithMenu, MenuItemWithOptions, CartItemOption } from "@/types/hungerai";
import { useRestaurantCart } from "@/store/hungerai/cartStore";
import CategoryTabs from "./CategoryTabs";
import ItemCard from "./ItemCard";
import ItemSheet from "./ItemSheet";
import CartButton from "./CartButton";

interface MenuPageProps {
  restaurant: RestaurantWithMenu;
}

export default function MenuPage({ restaurant }: MenuPageProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(
    restaurant.categories[0]?.id || null
  );
  const [selectedItem, setSelectedItem] = useState<MenuItemWithOptions | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const cart = useRestaurantCart(restaurant.slug);

  // Scroll to category section
  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = categoryRefs.current[categoryId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Update active category on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;

      for (const category of restaurant.categories) {
        const element = categoryRefs.current[category.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveCategory(category.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [restaurant.categories]);

  const handleItemClick = (item: MenuItemWithOptions) => {
    setSelectedItem(item);
    setIsSheetOpen(true);
  };

  const handleQuickAdd = (item: MenuItemWithOptions) => {
    if (!restaurant.is_open) return;
    cart.addItem(item, 1, []);
  };

  const handleAddToCart = (item: MenuItemWithOptions, qty: number, options: CartItemOption[]) => {
    cart.addItem(item, qty, options);
    setIsSheetOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--hai-bg-primary)] border-b border-[var(--hai-border-subtle)]">
        <div className="px-4 py-4">
          {/* Restaurant Info */}
          <div className="flex items-center gap-4">
            {restaurant.logo_url ? (
              <Image
                src={restaurant.logo_url}
                alt={restaurant.name}
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#f7931e] flex items-center justify-center text-xl font-bold text-white shadow-md">
                {restaurant.name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <h1 className="font-display text-xl font-bold">{restaurant.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                {restaurant.is_open ? (
                  <span className="hai-badge hai-badge-green">Open Now</span>
                ) : (
                  <span className="hai-badge hai-badge-red">Closed</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Closed Banner */}
        {!restaurant.is_open && (
          <div className="px-4 pb-3">
            <div className="hai-closed-banner">
              🚫 We&apos;re currently closed. Check back later!
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="px-4">
          <CategoryTabs
            categories={restaurant.categories}
            activeCategory={activeCategory}
            onCategoryClick={scrollToCategory}
          />
        </div>
      </header>

      {/* Menu Content */}
      <main className="px-4 py-4">
        {restaurant.categories.map((category) => {
          const availableItems = category.items.filter((item) => item.is_available);
          return (
            <div
              key={category.id}
              id={`category-${category.id}`}
              ref={(el) => {
                categoryRefs.current[category.id] = el;
              }}
              className="mb-10 scroll-mt-40"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-[var(--hai-accent-primary)] rounded-full" />
                <h2 className="font-display text-xl font-bold text-[var(--hai-text-primary)]">
                  {category.name}
                </h2>
                <span className="text-sm text-[var(--hai-text-muted)]">
                  {availableItems.length} {availableItems.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              
              {/* Items Grid */}
              <div className="space-y-3">
                {availableItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    isOpen={restaurant.is_open}
                    onClick={() => handleItemClick(item)}
                    onQuickAdd={() => handleQuickAdd(item)}
                  />
                ))}
                {availableItems.length === 0 && (
                  <p className="text-[var(--hai-text-muted)] text-sm py-4">
                    No items available in this category
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </main>

      {/* Floating Cart Button */}
      {cart.itemCount > 0 && restaurant.is_open && (
        <CartButton
          itemCount={cart.itemCount}
          subtotal={cart.subtotal}
          slug={restaurant.slug}
        />
      )}

      {/* Item Detail Sheet */}
      <ItemSheet
        item={selectedItem}
        isOpen={isSheetOpen}
        isRestaurantOpen={restaurant.is_open}
        onClose={() => {
          setIsSheetOpen(false);
          setSelectedItem(null);
        }}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

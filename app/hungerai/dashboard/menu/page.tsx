"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/hungerai/supabase";
import type { Restaurant, Category, MenuItem, ItemOption } from "@/types/hungerai";

interface CategoryWithItems extends Category {
  items: (MenuItem & { options: ItemOption[] })[];
}

export default function MenuEditorPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<CategoryWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingItem, setEditingItem] = useState<(MenuItem & { options: ItemOption[] }) | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    const supabase = createBrowserSupabaseClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    // Fetch restaurant
    const { data: restaurantData } = await supabase
      .from("restaurants")
      .select("*")
      .eq("owner_email", session.user.email)
      .single();

    if (!restaurantData) return;
    setRestaurant(restaurantData as Restaurant);

    // Fetch categories
    const { data: categoriesData } = await supabase
      .from("categories")
      .select("*")
      .eq("restaurant_id", restaurantData.id)
      .order("sort_order");

    // Fetch items
    const { data: itemsData } = await supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", restaurantData.id)
      .order("sort_order");

    // Fetch options
    const itemIds = (itemsData || []).map((i) => i.id);
    const { data: optionsData } = await supabase
      .from("item_options")
      .select("*")
      .in("menu_item_id", itemIds.length > 0 ? itemIds : ["none"]);

    // Build structure
    const cats: CategoryWithItems[] = (categoriesData || []).map((cat) => ({
      ...cat,
      items: (itemsData || [])
        .filter((item) => item.category_id === cat.id)
        .map((item) => ({
          ...item,
          options: (optionsData || []).filter((opt) => opt.menu_item_id === item.id),
        })),
    })) as CategoryWithItems[];

    setCategories(cats);
    setLoading(false);
  };

  const toggleRestaurantOpen = async () => {
    if (!restaurant) return;
    setSaving(true);

    const supabase = createBrowserSupabaseClient();
    await supabase
      .from("restaurants")
      .update({ is_open: !restaurant.is_open })
      .eq("id", restaurant.id);

    setRestaurant({ ...restaurant, is_open: !restaurant.is_open });
    setSaving(false);
  };

  const toggleItemAvailability = async (item: MenuItem) => {
    const supabase = createBrowserSupabaseClient();
    await supabase
      .from("menu_items")
      .update({ is_available: !item.is_available })
      .eq("id", item.id);

    setCategories((cats) =>
      cats.map((cat) => ({
        ...cat,
        items: cat.items.map((i) =>
          i.id === item.id ? { ...i, is_available: !i.is_available } : i
        ),
      }))
    );
  };

  const deleteItem = async (itemId: string) => {
    if (!confirm("Delete this item?")) return;

    const supabase = createBrowserSupabaseClient();
    await supabase.from("menu_items").delete().eq("id", itemId);

    setCategories((cats) =>
      cats.map((cat) => ({
        ...cat,
        items: cat.items.filter((i) => i.id !== itemId),
      }))
    );
  };

  const deleteCategory = async (categoryId: string) => {
    if (!confirm("Delete this category and all its items?")) return;

    const supabase = createBrowserSupabaseClient();
    await supabase.from("categories").delete().eq("id", categoryId);

    setCategories((cats) => cats.filter((c) => c.id !== categoryId));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="hai-skeleton h-16 rounded-xl" />
        <div className="hai-skeleton h-48 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Open/Closed Toggle */}
      <div className="hai-card p-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Restaurant Status</h2>
          <p className="text-sm text-[var(--hai-text-muted)]">
            {restaurant?.is_open
              ? "Accepting orders"
              : "Not accepting orders"}
          </p>
        </div>
        <button
          onClick={toggleRestaurantOpen}
          disabled={saving}
          className={`relative w-14 h-8 rounded-full transition-colors ${
            restaurant?.is_open
              ? "bg-[var(--hai-accent-green)]"
              : "bg-[var(--hai-bg-elevated)]"
          }`}
        >
          <span
            className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
              restaurant?.is_open ? "left-7" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* Add Category Button */}
      <button
        onClick={() => {
          setEditingCategory(null);
          setShowCategoryModal(true);
        }}
        className="hai-btn hai-btn-secondary w-full"
      >
        + Add Category
      </button>

      {/* Categories & Items */}
      {categories.map((category) => (
        <div key={category.id} className="space-y-3">
          {/* Category Header */}
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">{category.name}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingCategory(category);
                  setShowCategoryModal(true);
                }}
                className="text-sm text-[var(--hai-text-muted)] hover:text-[var(--hai-text-primary)]"
              >
                Edit
              </button>
              <button
                onClick={() => deleteCategory(category.id)}
                className="text-sm text-[var(--hai-accent-red)] hover:underline"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2">
            {category.items.map((item) => (
              <div
                key={item.id}
                className={`hai-card p-3 flex items-center gap-3 ${
                  !item.is_available ? "opacity-50" : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.name}</span>
                    {!item.is_available && (
                      <span className="text-xs text-[var(--hai-accent-red)]">
                        Unavailable
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--hai-accent-green)]">
                    Rs {item.price.toLocaleString("en-PK")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleItemAvailability(item)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      item.is_available
                        ? "bg-[var(--hai-accent-green)]"
                        : "bg-[var(--hai-bg-elevated)]"
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform mx-1 ${
                        item.is_available ? "translate-x-4" : ""
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setSelectedCategoryId(category.id);
                      setShowItemModal(true);
                    }}
                    className="text-sm text-[var(--hai-text-muted)] hover:text-[var(--hai-text-primary)]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-sm text-[var(--hai-accent-red)]"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Item Button */}
          <button
            onClick={() => {
              setEditingItem(null);
              setSelectedCategoryId(category.id);
              setShowItemModal(true);
            }}
            className="w-full py-3 border border-dashed border-[var(--hai-border)] rounded-xl text-[var(--hai-text-muted)] hover:text-[var(--hai-text-primary)] hover:border-[var(--hai-text-muted)] transition-colors"
          >
            + Add Item to {category.name}
          </button>
        </div>
      ))}

      {/* Category Modal */}
      {showCategoryModal && (
        <CategoryModal
          category={editingCategory}
          restaurantId={restaurant?.id || ""}
          onClose={() => setShowCategoryModal(false)}
          onSave={() => {
            setShowCategoryModal(false);
            fetchMenu();
          }}
        />
      )}

      {/* Item Modal */}
      {showItemModal && (
        <ItemModal
          item={editingItem}
          categoryId={selectedCategoryId || ""}
          restaurantId={restaurant?.id || ""}
          onClose={() => setShowItemModal(false)}
          onSave={() => {
            setShowItemModal(false);
            fetchMenu();
          }}
        />
      )}
    </div>
  );
}

// Category Modal
function CategoryModal({
  category,
  restaurantId,
  onClose,
  onSave,
}: {
  category: Category | null;
  restaurantId: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const [name, setName] = useState(category?.name || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);

    const supabase = createBrowserSupabaseClient();

    if (category) {
      await supabase.from("categories").update({ name }).eq("id", category.id);
    } else {
      await supabase.from("categories").insert({
        restaurant_id: restaurantId,
        name,
        sort_order: 999,
      });
    }

    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-[var(--hai-bg-secondary)] rounded-2xl p-6 w-full max-w-sm">
        <h2 className="font-display text-xl font-bold mb-4">
          {category ? "Edit Category" : "Add Category"}
        </h2>
        <input
          type="text"
          className="hai-input mb-4"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="hai-btn hai-btn-secondary flex-1">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="hai-btn hai-btn-primary flex-1"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Item Modal
function ItemModal({
  item,
  categoryId,
  restaurantId,
  onClose,
  onSave,
}: {
  item: (MenuItem & { options: ItemOption[] }) | null;
  categoryId: string;
  restaurantId: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const [price, setPrice] = useState(item?.price.toString() || "");
  const [options, setOptions] = useState<{ label: string; price_delta: string }[]>(
    item?.options.map((o) => ({ label: o.label, price_delta: o.price_delta.toString() })) || []
  );
  const [saving, setSaving] = useState(false);

  const addOption = () => {
    setOptions([...options, { label: "", price_delta: "0" }]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, field: "label" | "price_delta", value: string) => {
    setOptions(
      options.map((opt, i) => (i === index ? { ...opt, [field]: value } : opt))
    );
  };

  const handleSave = async () => {
    if (!name.trim() || !price) return;
    setSaving(true);

    const supabase = createBrowserSupabaseClient();

    if (item) {
      // Update item
      await supabase
        .from("menu_items")
        .update({
          name,
          description: description || null,
          price: parseInt(price),
        })
        .eq("id", item.id);

      // Delete existing options
      await supabase.from("item_options").delete().eq("menu_item_id", item.id);

      // Insert new options
      if (options.filter((o) => o.label.trim()).length > 0) {
        await supabase.from("item_options").insert(
          options
            .filter((o) => o.label.trim())
            .map((o) => ({
              menu_item_id: item.id,
              label: o.label,
              price_delta: parseInt(o.price_delta) || 0,
            }))
        );
      }
    } else {
      // Create item
      const { data: newItem } = await supabase
        .from("menu_items")
        .insert({
          restaurant_id: restaurantId,
          category_id: categoryId,
          name,
          description: description || null,
          price: parseInt(price),
          is_available: true,
          sort_order: 999,
        })
        .select()
        .single();

      // Insert options
      if (newItem && options.filter((o) => o.label.trim()).length > 0) {
        await supabase.from("item_options").insert(
          options
            .filter((o) => o.label.trim())
            .map((o) => ({
              menu_item_id: newItem.id,
              label: o.label,
              price_delta: parseInt(o.price_delta) || 0,
            }))
        );
      }
    }

    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-[var(--hai-bg-secondary)] rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="font-display text-xl font-bold mb-4">
          {item ? "Edit Item" : "Add Item"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--hai-text-muted)] mb-1">
              Name *
            </label>
            <input
              type="text"
              className="hai-input"
              placeholder="Item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--hai-text-muted)] mb-1">
              Description
            </label>
            <textarea
              className="hai-input min-h-[80px]"
              placeholder="Item description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--hai-text-muted)] mb-1">
              Price (Rs) *
            </label>
            <input
              type="number"
              className="hai-input"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm text-[var(--hai-text-muted)] mb-2">
              Customizations / Add-ons
            </label>
            <div className="space-y-2">
              {options.map((opt, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    className="hai-input flex-1"
                    placeholder="Option name"
                    value={opt.label}
                    onChange={(e) => updateOption(index, "label", e.target.value)}
                  />
                  <input
                    type="number"
                    className="hai-input w-24"
                    placeholder="+Rs"
                    value={opt.price_delta}
                    onChange={(e) => updateOption(index, "price_delta", e.target.value)}
                  />
                  <button
                    onClick={() => removeOption(index)}
                    className="text-[var(--hai-accent-red)] px-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addOption}
              className="text-sm text-[var(--hai-accent-green)] mt-2"
            >
              + Add Option
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="hai-btn hai-btn-secondary flex-1">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim() || !price}
            className="hai-btn hai-btn-primary flex-1"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

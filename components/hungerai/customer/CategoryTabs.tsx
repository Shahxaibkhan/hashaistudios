"use client";

import type { Category } from "@/types/hungerai";

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string | null;
  onCategoryClick: (categoryId: string) => void;
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onCategoryClick,
}: CategoryTabsProps) {
  return (
    <div className="hai-category-tabs">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`hai-category-tab ${activeCategory === category.id ? "active" : ""}`}
          onClick={() => onCategoryClick(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

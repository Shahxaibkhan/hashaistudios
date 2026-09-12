"use client";

import { useEffect, useRef, useState } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateFades = () => {
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };

    updateFades();
    el.addEventListener("scroll", updateFades, { passive: true });
    window.addEventListener("resize", updateFades);
    return () => {
      el.removeEventListener("scroll", updateFades);
      window.removeEventListener("resize", updateFades);
    };
  }, [categories]);

  return (
    <div className="hai-category-tabs-wrap">
      <div ref={scrollRef} className="hai-category-tabs">
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
      <div className={`hai-category-fade hai-category-fade-left ${canScrollLeft ? "visible" : ""}`}>
        <span className="hai-category-chevron">‹</span>
      </div>
      <div className={`hai-category-fade hai-category-fade-right ${canScrollRight ? "visible" : ""}`}>
        <span className="hai-category-chevron">›</span>
      </div>
    </div>
  );
}

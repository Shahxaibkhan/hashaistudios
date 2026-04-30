"use client";

import type { MenuItemWithOptions } from "@/types/hungerai";

interface ItemCardProps {
  item: MenuItemWithOptions;
  isOpen: boolean;
  onClick: () => void;
  onQuickAdd: () => void;
}

export default function ItemCard({ item, isOpen, onClick, onQuickAdd }: ItemCardProps) {
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen) {
      onQuickAdd();
    }
  };

  return (
    <div
      className="hai-card p-4 cursor-pointer active:scale-[0.98] transition-transform"
      onClick={onClick}
    >
      {/* Item Details */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--hai-text-primary)] leading-tight">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-sm text-[var(--hai-text-muted)] mt-1 line-clamp-2">
              {item.description}
            </p>
          )}
        </div>
        
        {/* Add Button */}
        <button
          className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md transition-all ${
            isOpen
              ? "bg-[var(--hai-accent-primary)] hover:bg-[var(--hai-accent-primary-hover)] active:scale-95"
              : "bg-[var(--hai-text-muted)] cursor-not-allowed"
          }`}
          onClick={handleQuickAdd}
          disabled={!isOpen}
          aria-label={`Add ${item.name} to cart`}
        >
          +
        </button>
      </div>
      
      {/* Price Row */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--hai-border-subtle)]">
        <span className="font-bold text-[var(--hai-accent-primary)]">
          Rs {item.price.toLocaleString("en-PK")}
        </span>
        {item.options.length > 0 && (
          <span className="text-xs text-[var(--hai-text-muted)] bg-[var(--hai-bg-elevated)] px-2 py-1 rounded-full">
            Customizable
          </span>
        )}
      </div>
    </div>
  );
}

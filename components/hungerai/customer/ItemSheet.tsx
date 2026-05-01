"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { MenuItemWithOptions, CartItemOption, ItemOption } from "@/types/hungerai";

interface ItemSheetProps {
  item: MenuItemWithOptions | null;
  isOpen: boolean;
  isRestaurantOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItemWithOptions, qty: number, options: CartItemOption[]) => void;
}

// Check if options are radio (mutually exclusive) based on option_type field
function isSizeOption(options: ItemOption[]): boolean {
  if (options.length === 0) return false;
  return options.some((o) => o.option_type === "radio");
}

export default function ItemSheet({
  item,
  isOpen,
  isRestaurantOpen,
  onClose,
  onAddToCart,
}: ItemSheetProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<CartItemOption[]>([]);

  const isSizeBasedItem = item ? isSizeOption(item.options) : false;

  // Reset state when item changes, auto-select first radio option
  useEffect(() => {
    if (item) {
      setQuantity(1);
      const firstRadio = item.options.find((o) => o.option_type === "radio");
      if (firstRadio) {
        setSelectedOptions([{
          id: firstRadio.id,
          label: firstRadio.label,
          price_delta: firstRadio.price_delta,
        }]);
      } else {
        setSelectedOptions([]);
      }
    }
  }, [item]);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!item) return null;

  const selectSizeOption = (option: CartItemOption) => {
    setSelectedOptions([option]);
  };

  const toggleOption = (option: CartItemOption) => {
    setSelectedOptions((prev) => {
      const exists = prev.find((o) => o.id === option.id);
      if (exists) {
        return prev.filter((o) => o.id !== option.id);
      }
      return [...prev, option];
    });
  };

  const optionsDelta = selectedOptions.reduce((sum, opt) => sum + opt.price_delta, 0);
  const itemTotal = (item.price + optionsDelta) * quantity;

  const handleAddToCart = () => {
    if (!isRestaurantOpen) return;
    onAddToCart(item, quantity, selectedOptions);
  };

  return (
    <>
      {/* Overlay - clicking closes the sheet */}
      <div
        className={`hai-sheet-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div className={`hai-sheet ${isOpen ? "open" : ""}`}>
        {/* Close Button */}
        <button
          className="hai-sheet-close"
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Handle - can drag to close */}
        <div className="hai-sheet-handle" onClick={onClose} />

        {/* Content */}
        <div className="px-4 pb-8 pt-2">
          {/* Image - only show if available */}
          {item.image_url && (
            <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4">
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Name & Description */}
          <h2 className="font-display text-2xl font-bold">
            {item.name}
          </h2>
          {item.description && (
            <p className="text-[var(--hai-text-secondary)] mt-2 text-sm leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Base Price */}
          <div className="mt-4">
            <span className="text-2xl font-bold hai-price">
              {isSizeBasedItem ? "From " : ""}Rs {item.price.toLocaleString("en-PK")}
            </span>
          </div>

          {/* Radio Options (mutually exclusive - sizes) */}
          {item.options.some((o) => o.option_type === "radio") && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                Select Size
                <span className="text-xs font-normal text-[var(--hai-text-muted)]">(Required)</span>
              </h3>
              <div className="flex gap-3">
                {item.options.filter((o) => o.option_type === "radio").map((option) => {
                  const isSelected = selectedOptions.some((o) => o.id === option.id);
                  const totalPrice = item.price + option.price_delta;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={`hai-size-btn ${isSelected ? "active" : ""}`}
                      onClick={() =>
                        selectSizeOption({
                          id: option.id,
                          label: option.label,
                          price_delta: option.price_delta,
                        })
                      }
                    >
                      <div className="size-label">{option.label}</div>
                      <div className="size-price">Rs {totalPrice.toLocaleString("en-PK")}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Checkbox Options (add-ons) */}
          {item.options.some((o) => o.option_type === "checkbox") && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">
                Customize <span className="text-xs font-normal text-[var(--hai-text-muted)]">(Optional)</span>
              </h3>
              <div className="space-y-2">
                {item.options.filter((o) => o.option_type === "checkbox").map((option) => {
                  const isSelected = selectedOptions.some((o) => o.id === option.id);
                  return (
                    <div
                      key={option.id}
                      className={`hai-checkbox ${isSelected ? "checked" : ""}`}
                      onClick={() =>
                        toggleOption({
                          id: option.id,
                          label: option.label,
                          price_delta: option.price_delta,
                        })
                      }
                    >
                      <div className="hai-checkbox-box">
                        {isSelected && (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="2,7 5.5,10.5 12,4" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <span>{option.label}</span>
                      </div>
                      {option.price_delta > 0 && (
                        <span className="text-[var(--hai-text-muted)] text-sm">
                          +Rs {option.price_delta}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center justify-between mt-6 py-4 border-t border-[var(--hai-border)]">
            <span className="font-semibold">Quantity</span>
            <div className="hai-stepper">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              className="hai-btn hai-btn-secondary flex-1"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`hai-btn flex-[2] ${
                isRestaurantOpen ? "hai-btn-primary" : "hai-btn-secondary cursor-not-allowed"
              }`}
              onClick={handleAddToCart}
              disabled={!isRestaurantOpen}
            >
              {isRestaurantOpen ? (
                <>Add — Rs {itemTotal.toLocaleString("en-PK")}</>
              ) : (
                "Restaurant Closed"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

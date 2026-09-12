"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/hungerai/cartStore";
import { createBrowserSupabaseClient } from "@/lib/hungerai/supabase";
import { buildWaLink } from "@/lib/hungerai/waLink";
import { loadCheckoutPrefill, saveCheckoutPrefill } from "@/lib/hungerai/checkoutPrefill";
import { loadOrderTypeContext, clearOrderTypeContext } from "@/lib/hungerai/orderTypeContext";
import type { Restaurant, OrderItem, OrderPayload, OrderType } from "@/types/hungerai";
import CartReview from "@/components/hungerai/checkout/CartReview";
import CustomerForm from "@/components/hungerai/checkout/CustomerForm";
import DeliveryMap from "@/components/hungerai/checkout/DeliveryMap";
import OrderTypeToggle from "@/components/hungerai/checkout/OrderTypeToggle";
import PaymentSelector from "@/components/hungerai/checkout/PaymentSelector";
import OrderSummary from "@/components/hungerai/checkout/OrderSummary";

export default function CheckoutPage() {
  const router = useRouter();
  const routeParams = useParams();
  const slug = routeParams?.slug as string;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [customerName, setCustomerName] = useState("");
  const [customerWhatsApp, setCustomerWhatsApp] = useState("");
  const [deliveryLat, setDeliveryLat] = useState<number | null>(null);
  const [deliveryLng, setDeliveryLng] = useState<number | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online" | "card">("cod");
  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [carPlateNumber, setCarPlateNumber] = useState("");
  const [carColor, setCarColor] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  // Set when the customer arrived via a curbside/table QR — widens which
  // options OrderTypeToggle shows, beyond the restaurant's normal delivery/pickup config.
  const [qrOrderType, setQrOrderType] = useState<"curbside" | "dine_in" | null>(null);

  // Collapse a section into a compact summary once it's filled in and the
  // customer has moved on — cuts down how much of the page they have to
  // scroll through, especially on a repeat visit where it's prefilled.
  const [detailsExpanded, setDetailsExpanded] = useState(true);
  const [locationExpanded, setLocationExpanded] = useState(true);

  // Set once the order is placed — swaps the whole page for a brief
  // confirmation beat before handing off to WhatsApp.
  const [orderPlaced, setOrderPlaced] = useState<{ waUrl: string } | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Refs for scroll-to-error
  const nameRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const carDetailsRef = useRef<HTMLDivElement>(null);
  const tableNumberRef = useRef<HTMLDivElement>(null);

  // Cart store - always called unconditionally
  const cartStore = useCartStore();

  // Fetch restaurant
  useEffect(() => {
    if (!slug) return;

    const fetchRestaurant = async () => {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from("restaurants_public")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        router.push(`/hungerai/${slug}`);
        return;
      }

      setRestaurant(data as Restaurant);
      setDeliveryLat(data.city_lat);
      setDeliveryLng(data.city_lng);
      // Default order type: pickup-only restaurants start on pickup
      const pickupOnly = !data.delivery_enabled && data.pickup_enabled;
      if (pickupOnly) {
        setOrderType("pickup");
      }

      // A curbside/table QR overrides the default above — explicit QR
      // intent wins over the restaurant's general delivery/pickup config.
      const qrContext = loadOrderTypeContext(slug);
      if (qrContext) {
        setQrOrderType(qrContext.orderType);
        setOrderType(qrContext.orderType);
        if (qrContext.orderType === "dine_in" && qrContext.tableNumber) {
          setTableNumber(qrContext.tableNumber);
        }
      }

      // Prefill from a previous order on this device, and collapse any
      // section that's already complete so a repeat order is one tap away.
      const prefill = loadCheckoutPrefill();
      if (prefill) {
        if (prefill.name) setCustomerName(prefill.name);
        if (prefill.whatsapp) setCustomerWhatsApp(prefill.whatsapp);
        if (prefill.name && prefill.whatsapp) setDetailsExpanded(false);

        if (!pickupOnly && prefill.address && prefill.lat != null && prefill.lng != null) {
          setDeliveryAddress(prefill.address);
          setDeliveryLat(prefill.lat);
          setDeliveryLng(prefill.lng);
          setLocationExpanded(false);
        }
      }

      setLoading(false);
    };

    fetchRestaurant();
  }, [slug, router]);

  // Compute cart items for the current restaurant
  const cartItems = cartStore.restaurantSlug === slug ? cartStore.items : [];
  const cartSubtotal = cartStore.restaurantSlug === slug ? cartStore.getSubtotal() : 0;

  // Redirect if cart is empty — but not right after a successful order,
  // since placing one deliberately empties the cart.
  useEffect(() => {
    if (!loading && slug && cartItems.length === 0 && !orderPlaced) {
      router.push(`/hungerai/${slug}`);
    }
  }, [loading, cartItems.length, slug, router, orderPlaced]);

  // Give the customer a visible "Order Sent" beat before handing off to
  // WhatsApp, instead of yanking them out of the browser instantly.
  useEffect(() => {
    if (!orderPlaced) return;
    const timer = setTimeout(() => {
      window.location.href = orderPlaced.waUrl;
    }, 900);
    return () => clearTimeout(timer);
  }, [orderPlaced]);

  // Re-validate live after first submit attempt — clears errors as user fixes fields
  useEffect(() => {
    if (!submitAttempted) return;
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) newErrors.name = "Name is required";
    if (!customerWhatsApp.trim()) {
      newErrors.whatsapp = "WhatsApp number is required";
    } else if (!/^\d{10}$/.test(customerWhatsApp.replace(/\D/g, ""))) {
      newErrors.whatsapp = "Enter a valid 10-digit number";
    }
    if (orderType === "delivery") {
      if (!deliveryAddress.trim()) newErrors.address = "Please enter your delivery address";
      if (!deliveryLat || !deliveryLng) newErrors.location = "Please set your delivery location on the map";
    }
    if (orderType === "curbside") {
      if (!carPlateNumber.trim()) newErrors.carPlate = "Car plate number is required";
      if (!carColor.trim()) newErrors.carColor = "Car color is required";
    }
    if (orderType === "dine_in") {
      if (!tableNumber.trim()) newErrors.tableNumber = "Table number is required";
    }
    setErrors(newErrors);
  }, [submitAttempted, customerName, customerWhatsApp, deliveryAddress, deliveryLat, deliveryLng, orderType, carPlateNumber, carColor, tableNumber]);

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="hai-checkmark mb-8">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle className="hai-checkmark-circle" cx="60" cy="60" r="56" />
            <path className="hai-checkmark-check" d="M38 62 L52 76 L82 46" fill="none" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-bold text-[var(--hai-text-primary)] mb-2">
          Order Sent! 🎉
        </h1>
        <p className="text-[var(--hai-text-secondary)]">Taking you to WhatsApp to confirm…</p>
      </div>
    );
  }

  if (loading || !restaurant || !slug || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="hai-skeleton w-32 h-8" />
      </div>
    );
  }

  // Calculate delivery info
  const deliveryFee = 0; // Owner will confirm delivery fee via WhatsApp
  const subtotal = cartSubtotal;

  // Delivery/pickup availability follows the restaurant's own config;
  // curbside/dine-in only ever appear when a QR carried that context in —
  // there's no per-restaurant toggle for them since a scanned QR is itself
  // the proof the restaurant deployed that flow.
  const availableOrderTypes: OrderType[] = [
    ...(restaurant.delivery_enabled ? (["delivery"] as const) : []),
    ...(restaurant.pickup_enabled ? (["pickup"] as const) : []),
    ...(qrOrderType === "curbside" ? (["curbside"] as const) : []),
    ...(qrOrderType === "dine_in" ? (["dine_in"] as const) : []),
  ];

  const isDetailsComplete = customerName.trim() !== "" && customerWhatsApp.trim() !== "";
  const isLocationComplete = deliveryAddress.trim() !== "" && deliveryLat !== null && deliveryLng !== null;
  // Errors always force the form back open so they're visible, even if the
  // section had been collapsed as "done" from a prior fill.
  const showDetailsForm = detailsExpanded || !!errors.name || !!errors.whatsapp;
  const showLocationForm = locationExpanded || !!errors.address || !!errors.location;

  // Tax calculation
  const taxRate = restaurant.tax_enabled
    ? paymentMethod === "online"
      ? (restaurant.tax_online_percent ?? 5)
      : (restaurant.tax_cod_percent ?? 16) // cod & card use the same rate
    : 0;
  const taxAmount = taxRate > 0 ? Math.round(subtotal * taxRate / 100) : 0;
  const total = subtotal + taxAmount; // Delivery confirmed separately

  const handlePlaceOrder = async () => {
    setSubmitAttempted(true);

    // Build errors inline for scroll-to-first logic
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) newErrors.name = "Name is required";
    if (!customerWhatsApp.trim()) {
      newErrors.whatsapp = "WhatsApp number is required";
    } else if (!/^\d{10}$/.test(customerWhatsApp.replace(/\D/g, ""))) {
      newErrors.whatsapp = "Enter a valid 10-digit number";
    }
    if (orderType === "delivery") {
      if (!deliveryAddress.trim()) newErrors.address = "Please enter your delivery address";
      if (!deliveryLat || !deliveryLng) newErrors.location = "Please set your delivery location on the map";
    }
    if (orderType === "curbside") {
      if (!carPlateNumber.trim()) newErrors.carPlate = "Car plate number is required";
      if (!carColor.trim()) newErrors.carColor = "Car color is required";
    }
    if (orderType === "dine_in") {
      if (!tableNumber.trim()) newErrors.tableNumber = "Table number is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstRef = newErrors.name ? nameRef
        : newErrors.whatsapp ? nameRef // WhatsApp lives in the same "Your Details" section
        : newErrors.address ? addressRef
        : newErrors.location ? locationRef
        : newErrors.carPlate || newErrors.carColor ? carDetailsRef
        : tableNumberRef;
      firstRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Format WhatsApp number (add 92 prefix if needed)
      const formattedWhatsApp = customerWhatsApp.startsWith("0")
        ? `92${customerWhatsApp.slice(1)}`
        : `92${customerWhatsApp}`;

      // Build order items
      const orderItems: OrderItem[] = cartItems.map((item) => ({
        id: item.menuItemId,
        name: item.name,
        qty: item.qty,
        price: item.price,
        options: item.options.map((o) => ({
          label: o.label,
          price_delta: o.price_delta,
        })),
      }));

      // Create order payload
      const orderPayload: OrderPayload = {
        restaurant_id: restaurant.id,
        customer_name: customerName,
        customer_whatsapp: formattedWhatsApp,
        items: orderItems,
        subtotal,
        delivery_fee: orderType === "delivery" ? deliveryFee : 0,
        tax_amount: taxAmount,
        total,
        delivery_lat: orderType === "delivery" ? deliveryLat : null,
        delivery_lng: orderType === "delivery" ? deliveryLng : null,
        delivery_address: orderType === "delivery" ? deliveryAddress : "",
        payment_method: paymentMethod,
        order_type: orderType,
        car_plate_number: orderType === "curbside" ? carPlateNumber.trim() : "",
        car_color: orderType === "curbside" ? carColor.trim() : "",
        table_number: orderType === "dine_in" ? tableNumber.trim() : "",
      };

      // POST to API
      const response = await fetch("/api/hungerai/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => null);
        throw new Error(errBody?.error || "Failed to create order");
      }

      const confirmed = await response.json();
      const { order_number, id: orderId } = confirmed;

      // Build WhatsApp link using the server-confirmed pricing/items —
      // never the client-computed values, in case they diverged.
      const receiptUrl = `https://hashaistudios.com/hungerai/${slug}/order/${orderId}`;
      const waUrl = buildWaLink({
        orderNumber: order_number,
        restaurantWhatsApp: restaurant.whatsapp_number,
        items: confirmed.items ?? orderItems,
        customerName,
        customerWhatsApp: formattedWhatsApp,
        deliveryLat: orderType === "delivery" ? deliveryLat : null,
        deliveryLng: orderType === "delivery" ? deliveryLng : null,
        deliveryAddress: orderType === "delivery" ? deliveryAddress : "",
        subtotal: confirmed.subtotal ?? subtotal,
        deliveryFee: confirmed.delivery_fee ?? deliveryFee,
        taxAmount: confirmed.tax_amount ?? taxAmount,
        taxRate: confirmed.tax_rate ?? taxRate,
        total: confirmed.total ?? total,
        paymentMethod,
        orderType,
        restaurantAddress: restaurant.pickup_address,
        restaurantLat: restaurant.city_lat,
        restaurantLng: restaurant.city_lng,
        carPlateNumber: orderType === "curbside" ? carPlateNumber.trim() : undefined,
        carColor: orderType === "curbside" ? carColor.trim() : undefined,
        tableNumber: orderType === "dine_in" ? tableNumber.trim() : undefined,
        receiptUrl,
      });

      // Remember these details on this device for next time.
      saveCheckoutPrefill({
        name: customerName,
        whatsapp: customerWhatsApp,
        address: orderType === "delivery" ? deliveryAddress : "",
        lat: orderType === "delivery" ? deliveryLat : null,
        lng: orderType === "delivery" ? deliveryLng : null,
      });
      clearOrderTypeContext(slug);

      // Clear cart and show a brief confirmation beat before handing off.
      cartStore.clearCart();
      setOrderPlaced({ waUrl });
    } catch (err) {
      console.error("Order error:", err);
      setError(err instanceof Error ? err.message : "Failed to place order. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--hai-bg-primary)] border-b border-[var(--hai-border-subtle)] px-4 py-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/hungerai/${slug}`}
            className="w-10 h-10 rounded-full bg-[var(--hai-bg-card)] flex items-center justify-center"
          >
            ←
          </Link>
          <h1 className="font-display text-xl font-bold">Checkout</h1>
        </div>
      </header>

      <main className="px-4 py-4 space-y-6">
        {/* Error Banner */}
        {error && (
          <div className="hai-closed-banner">
            ⚠️ {error}
          </div>
        )}

        {/* Order Type Toggle — only when there's an actual choice to make */}
        {availableOrderTypes.length > 1 && (
          <section>
            <h2 className="font-display text-lg font-bold mb-3">Order Type</h2>
            <OrderTypeToggle selected={orderType} onSelect={setOrderType} available={availableOrderTypes} />
          </section>
        )}

        {/* Cart Review */}
        <section>
          <h2 className="font-display text-lg font-bold mb-3">Your Order</h2>
          <CartReview
            items={cartItems}
            onUpdateQuantity={cartStore.updateQuantity}
            onRemoveItem={cartStore.removeItem}
          />
        </section>

        {/* Customer Details */}
        <section
          ref={nameRef}
          onBlur={(e) => {
            if (isDetailsComplete && !e.currentTarget.contains(e.relatedTarget as Node)) {
              setDetailsExpanded(false);
            }
          }}
        >
          <h2 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
            Your Details
            {isDetailsComplete ? (
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-[var(--hai-accent-green-light)] text-[var(--hai-accent-green)]">✓ Done</span>
            ) : submitAttempted ? (
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-[var(--hai-accent-red-light)] text-[var(--hai-accent-red)]">Required</span>
            ) : (
              <span className="text-xs font-normal text-[var(--hai-text-muted)]">Fill in below</span>
            )}
          </h2>
          {showDetailsForm ? (
            <CustomerForm
              name={customerName}
              whatsapp={customerWhatsApp}
              onNameChange={setCustomerName}
              onWhatsAppChange={setCustomerWhatsApp}
              errors={errors}
            />
          ) : (
            <div className="hai-card p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-[var(--hai-text-primary)] truncate">{customerName}</p>
                <p className="text-sm text-[var(--hai-text-muted)]">+92 {customerWhatsApp}</p>
              </div>
              <button
                type="button"
                onClick={() => setDetailsExpanded(true)}
                className="text-sm font-medium text-[var(--hai-accent-primary)] shrink-0"
              >
                Edit
              </button>
            </div>
          )}
        </section>

        {/* Delivery Location — only for delivery orders */}
        {orderType === "delivery" && (
        <section
          onBlur={(e) => {
            if (isLocationComplete && !e.currentTarget.contains(e.relatedTarget as Node)) {
              setLocationExpanded(false);
            }
          }}
        >
          <h2 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
            Delivery Location
            {isLocationComplete ? (
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-[var(--hai-accent-green-light)] text-[var(--hai-accent-green)]">✓ Done</span>
            ) : submitAttempted ? (
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-[var(--hai-accent-red-light)] text-[var(--hai-accent-red)]">Required</span>
            ) : (
              <span className="text-xs font-normal text-[var(--hai-text-muted)]">Fill in below</span>
            )}
          </h2>

          {showLocationForm ? (
            <>
              {/* Address Input */}
              <div className="hai-card p-4 mb-4" ref={addressRef}>
                <label className="block text-sm font-medium text-[var(--hai-text-primary)] mb-2">
                  Delivery Address
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="House #, Street, Area, City (e.g., House 123, Street 5, Gulberg III, Lahore)"
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border bg-[var(--hai-bg-primary)] text-[var(--hai-text-primary)] placeholder:text-[var(--hai-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--hai-accent-primary)] focus:border-transparent resize-none text-base transition-colors ${
                    errors.address
                      ? "border-[var(--hai-accent-red)]"
                      : "border-[var(--hai-border-subtle)]"
                  }`}
                />
                {errors.address && (
                  <p className="text-[var(--hai-accent-red)] text-sm mt-2">{errors.address}</p>
                )}
              </div>

              {/* Map */}
              <div ref={locationRef}>
                <DeliveryMap
                  centerLat={restaurant.city_lat}
                  centerLng={restaurant.city_lng}
                  pinLat={deliveryLat}
                  pinLng={deliveryLng}
                  onPinChange={(lat, lng) => {
                    setDeliveryLat(lat);
                    setDeliveryLng(lng);
                  }}
                />
              </div>
              <p className="text-sm text-[var(--hai-text-muted)] mt-2 text-center">
                Delivery fee will be confirmed by the restaurant
              </p>
              {errors.location && (
                <p className="text-[var(--hai-accent-red)] text-sm mt-2">{errors.location}</p>
              )}
            </>
          ) : (
            <div className="hai-card p-4 flex items-center justify-between gap-3">
              <div className="min-w-0 flex items-start gap-2">
                <span className="text-lg shrink-0">📍</span>
                <p className="text-sm text-[var(--hai-text-primary)] line-clamp-2">{deliveryAddress}</p>
              </div>
              <button
                type="button"
                onClick={() => setLocationExpanded(true)}
                className="text-sm font-medium text-[var(--hai-accent-primary)] shrink-0"
              >
                Edit
              </button>
            </div>
          )}
        </section>
        )}

        {/* Pickup Info — only for pickup orders */}
        {orderType === "pickup" && (
          <section>
            <div className="hai-card p-4 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏱️</span>
                <div>
                  <p className="font-semibold text-[var(--hai-text-primary)]">Ready in 30–40 min</p>
                  <p className="text-sm text-[var(--hai-text-muted)]">We&apos;ll confirm the exact time via WhatsApp</p>
                </div>
              </div>
              {(restaurant.pickup_address || restaurant.city_lat) && (
                <div className="border-t border-[var(--hai-border-subtle)] pt-3 flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="text-sm font-medium text-[var(--hai-text-primary)] mb-1">Pickup Location</p>
                    {restaurant.pickup_address && (
                      <p className="text-sm text-[var(--hai-text-secondary)]">{restaurant.pickup_address}</p>
                    )}
                    <a
                      href={`https://maps.google.com/?q=${restaurant.city_lat},${restaurant.city_lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[var(--hai-accent-primary)] font-medium mt-1 hover:underline"
                    >
                      🗺️ View on Google Maps
                    </a>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Car Details — only for curbside orders */}
        {orderType === "curbside" && (
          <section ref={carDetailsRef}>
            <h2 className="font-display text-lg font-bold mb-3">Car Details</h2>
            <div className="hai-card p-4 space-y-4">
              <div>
                <label htmlFor="car-plate" className="block text-sm font-medium text-[var(--hai-text-secondary)] mb-2">
                  Car Plate Number
                </label>
                <input
                  id="car-plate"
                  type="text"
                  className={`hai-input ${errors.carPlate ? "border-[var(--hai-accent-red)]" : ""}`}
                  placeholder="e.g. LEA-1234"
                  value={carPlateNumber}
                  onChange={(e) => setCarPlateNumber(e.target.value)}
                />
                {errors.carPlate && (
                  <p className="text-[var(--hai-accent-red)] text-sm mt-1">{errors.carPlate}</p>
                )}
              </div>
              <div>
                <label htmlFor="car-color" className="block text-sm font-medium text-[var(--hai-text-secondary)] mb-2">
                  Car Color
                </label>
                <input
                  id="car-color"
                  type="text"
                  className={`hai-input ${errors.carColor ? "border-[var(--hai-accent-red)]" : ""}`}
                  placeholder="e.g. White"
                  value={carColor}
                  onChange={(e) => setCarColor(e.target.value)}
                />
                {errors.carColor && (
                  <p className="text-[var(--hai-accent-red)] text-sm mt-1">{errors.carColor}</p>
                )}
              </div>
              <p className="text-sm text-[var(--hai-text-muted)]">
                We&apos;ll bring your order out to your car — no need to leave it.
              </p>
            </div>
          </section>
        )}

        {/* Table Number — only for dine-in orders */}
        {orderType === "dine_in" && (
          <section ref={tableNumberRef}>
            <h2 className="font-display text-lg font-bold mb-3">Table Number</h2>
            <div className="hai-card p-4">
              <label htmlFor="table-number" className="block text-sm font-medium text-[var(--hai-text-secondary)] mb-2">
                Table Number
              </label>
              <input
                id="table-number"
                type="text"
                className={`hai-input ${errors.tableNumber ? "border-[var(--hai-accent-red)]" : ""}`}
                placeholder="e.g. 7"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              />
              {errors.tableNumber && (
                <p className="text-[var(--hai-accent-red)] text-sm mt-1">{errors.tableNumber}</p>
              )}
              <p className="text-sm text-[var(--hai-text-muted)] mt-2">
                We&apos;ll bring your order straight to your table.
              </p>
            </div>
          </section>
        )}

        {/* Payment Method */}
        <section>
          <h2 className="font-display text-lg font-bold mb-3">Payment Method</h2>
          <PaymentSelector
            selected={paymentMethod}
            onSelect={setPaymentMethod}
            onlinePaymentDetails={restaurant.online_payment_details}
            cardOnDeliveryEnabled={restaurant.card_on_delivery_enabled}
          />
        </section>

        {/* Order Summary */}
        <section>
          <OrderSummary
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            taxAmount={taxAmount}
            taxRate={taxRate}
            total={total}
            onPlaceOrder={handlePlaceOrder}
            isSubmitting={submitting}
            isDisabled={
              (orderType === "delivery" && (!deliveryLat || !deliveryLng)) ||
              (orderType === "curbside" && (!carPlateNumber.trim() || !carColor.trim())) ||
              (orderType === "dine_in" && !tableNumber.trim())
            }
            validationErrors={errors}
            orderType={orderType}
          />
        </section>
      </main>
    </div>
  );
}

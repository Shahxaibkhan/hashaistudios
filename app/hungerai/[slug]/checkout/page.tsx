"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/hungerai/cartStore";
import { createBrowserSupabaseClient } from "@/lib/hungerai/supabase";
import { buildWaLink } from "@/lib/hungerai/waLink";
import type { Restaurant, OrderItem, OrderPayload } from "@/types/hungerai";
import CartReview from "@/components/hungerai/checkout/CartReview";
import CustomerForm from "@/components/hungerai/checkout/CustomerForm";
import DeliveryMap from "@/components/hungerai/checkout/DeliveryMap";
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
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cart store - always called unconditionally
  const cartStore = useCartStore();

  // Fetch restaurant
  useEffect(() => {
    if (!slug) return;

    const fetchRestaurant = async () => {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from("restaurants")
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
      setLoading(false);
    };

    fetchRestaurant();
  }, [slug, router]);

  // Compute cart items for the current restaurant
  const cartItems = cartStore.restaurantSlug === slug ? cartStore.items : [];
  const cartSubtotal = cartStore.restaurantSlug === slug ? cartStore.getSubtotal() : 0;
  const cartItemCount = cartStore.restaurantSlug === slug ? cartStore.getItemCount() : 0;

  // Redirect if cart is empty
  useEffect(() => {
    if (!loading && slug && cartItems.length === 0) {
      router.push(`/hungerai/${slug}`);
    }
  }, [loading, cartItems.length, slug, router]);

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

  // Tax calculation
  const taxRate = restaurant.tax_enabled
    ? paymentMethod === "cod"
      ? (restaurant.tax_cod_percent ?? 16)
      : (restaurant.tax_online_percent ?? 5)
    : 0;
  const taxAmount = taxRate > 0 ? Math.round(subtotal * taxRate / 100) : 0;
  const total = subtotal + taxAmount; // Delivery confirmed separately

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!customerName.trim()) {
      newErrors.name = "Name is required";
    }

    if (!customerWhatsApp.trim()) {
      newErrors.whatsapp = "WhatsApp number is required";
    } else if (!/^\d{10}$/.test(customerWhatsApp.replace(/\D/g, ""))) {
      newErrors.whatsapp = "Enter a valid 10-digit number";
    }

    if (!deliveryLat || !deliveryLng) {
      newErrors.location = "Please set your delivery location on the map";
    }

    if (!deliveryAddress.trim()) {
      newErrors.address = "Please enter your delivery address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

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
        delivery_fee: deliveryFee,
        tax_amount: taxAmount,
        total,
        delivery_lat: deliveryLat,
        delivery_lng: deliveryLng,
        delivery_address: deliveryAddress,
        payment_method: paymentMethod,
      };

      // POST to API
      const response = await fetch("/api/hungerai/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const { order_number } = await response.json();

      // Build WhatsApp link
      const waUrl = buildWaLink({
        orderNumber: order_number,
        restaurantWhatsApp: restaurant.whatsapp_number,
        items: orderItems,
        customerName,
        customerWhatsApp: formattedWhatsApp,
        deliveryLat,
        deliveryLng,
        deliveryAddress,
        subtotal,
        deliveryFee,
        taxAmount,
        taxRate,
        total,
        paymentMethod,
      });

      // Clear cart
      cartStore.clearCart();

      // Redirect to WhatsApp
      window.location.href = waUrl;

      // After delay, redirect to confirmation
      setTimeout(() => {
        router.push(`/hungerai/${slug}/confirmation?order=${order_number}`);
      }, 1500);
    } catch (err) {
      console.error("Order error:", err);
      setError("Failed to place order. Please try again.");
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
        <section>
          <h2 className="font-display text-lg font-bold mb-3">Your Details</h2>
          <CustomerForm
            name={customerName}
            whatsapp={customerWhatsApp}
            onNameChange={setCustomerName}
            onWhatsAppChange={setCustomerWhatsApp}
            errors={errors}
          />
        </section>

        {/* Delivery Location */}
        <section>
          <h2 className="font-display text-lg font-bold mb-3">Delivery Location</h2>
          
          {/* Address Input */}
          <div className="hai-card p-4 mb-4">
            <label className="block text-sm font-medium text-[var(--hai-text-primary)] mb-2">
              Delivery Address
            </label>
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="House #, Street, Area, City (e.g., House 123, Street 5, Gulberg III, Lahore)"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[var(--hai-border-subtle)] bg-[var(--hai-bg-primary)] text-[var(--hai-text-primary)] placeholder:text-[var(--hai-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--hai-accent-primary)] focus:border-transparent resize-none text-base"
            />
            {errors.address && (
              <p className="text-[var(--hai-accent-red)] text-sm mt-2">{errors.address}</p>
            )}
          </div>

          {/* Map */}
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
          <p className="text-sm text-[var(--hai-text-muted)] mt-2 text-center">
            Delivery fee will be confirmed by the restaurant
          </p>
          {errors.location && (
            <p className="text-[var(--hai-accent-red)] text-sm mt-2">{errors.location}</p>
          )}
        </section>

        {/* Payment Method */}
        <section>
          <h2 className="font-display text-lg font-bold mb-3">Payment Method</h2>
          <PaymentSelector
            selected={paymentMethod}
            onSelect={setPaymentMethod}
            onlinePaymentDetails={restaurant.online_payment_details}
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
            isDisabled={!deliveryLat || !deliveryLng}
          />
        </section>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";

interface CartButtonProps {
  itemCount: number;
  subtotal: number;
  slug: string;
}

export default function CartButton({ itemCount, subtotal, slug }: CartButtonProps) {
  return (
    <Link href={`/hungerai/${slug}/checkout`} className="hai-cart-float">
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
          {itemCount}
        </span>
        <span className="font-semibold">View Cart</span>
      </div>
      <span className="font-bold">Rs {subtotal.toLocaleString("en-PK")}</span>
    </Link>
  );
}

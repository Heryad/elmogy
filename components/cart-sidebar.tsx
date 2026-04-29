"use client"

import { useStore } from "@/lib/store-context"
import { t } from "@/lib/translations"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function CartSidebar() {
  const { language, isCartOpen, setIsCartOpen, cartItems, updateCartItemQuantity, removeFromCart } = useStore()

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle>{t('cart.title', language)}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              {t('cart.empty', language)}
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0">
                <div className="relative w-20 h-20 bg-secondary/30 rounded-lg overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                    <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-muted-foreground mt-1">
                    {item.grade} • {item.simType.toUpperCase()}
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="font-bold">
                      {item.price.toLocaleString()} <span className="text-[10px] text-muted-foreground font-normal">{t('product.price', language)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() => item.quantity > 1 ? updateCartItemQuantity(item.id, item.quantity - 1) : removeFromCart(item.id)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t bg-card mt-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">{t('cart.total', language)}</span>
              <span className="text-xl font-bold">
                {total.toLocaleString()} <span className="text-xs text-muted-foreground font-normal">{t('product.price', language)}</span>
              </span>
            </div>

            <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
              <Button className="w-full" size="lg">
                {t('cart.checkout', language)}
              </Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

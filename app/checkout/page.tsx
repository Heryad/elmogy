"use client"

import { useStore } from "@/lib/store-context"
import { t } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { CheckCircle2, AlertCircle } from "lucide-react"

export default function CheckoutPage() {
  const { language, cartItems, user, clearCart } = useStore()
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  if (cartItems.length === 0 && status !== 'success') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('cart.empty', language)}</h1>
        <Button onClick={() => router.push('/')}>{t('nav.backToStore', language)}</Button>
      </div>
    )
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      router.push('/login?callbackUrl=/checkout')
      return
    }

    setStatus('processing')

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          total: total
        })
      })

      if (!res.ok) {
        throw new Error('Failed to place order')
      }

      const data = await res.json()
      
      // Clear the cart
      clearCart()
      setStatus('success')
    } catch (error) {
      console.error(error)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">{t('checkout.title', language)}</h1>
        <p className="text-muted-foreground mb-8">{t('checkout.success', language)}</p>
        <div className="flex flex-col gap-3">
          <Button onClick={() => router.push('/profile')}>{t('nav.profile', language)}</Button>
          <Button variant="outline" onClick={() => router.push('/')}>{t('nav.backToStore', language)}</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">{t('checkout.title', language)}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* User Details */}
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">{t('checkout.userDetails', language)}</h2>
            {user ? (
              <div className="space-y-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">{t('signup.step1.fullName', language)}</span>
                  <span className="font-medium text-base">{user.fullName}</span>
                </div>
                <div className="flex flex-col mt-4">
                  <span className="text-muted-foreground">{t('signup.step1.phone', language)}</span>
                  <span className="font-medium text-base">{user.countryCode} {user.phone}</span>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">
                Please login to place an order.
                <Button variant="link" className="px-2" onClick={() => router.push('/login?callbackUrl=/checkout')}>Login</Button>
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">{t('checkout.orderSummary', language)}</h2>
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0">
                  <div className="relative w-16 h-16 bg-secondary/30 rounded-lg overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                    <div className="text-xs text-muted-foreground mt-1">
                      {item.grade} • {item.simType.toUpperCase()}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm">{item.quantity} x {item.price.toLocaleString()}</span>
                      <span className="font-bold">{(item.quantity * item.price).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-semibold mb-6">{t('cart.total', language)}</h2>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('invoice.subtotal', language)}</span>
                <span>{total.toLocaleString()} {t('product.price', language)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>{t('invoice.grandTotal', language)}</span>
                <span>{total.toLocaleString()} {t('product.price', language)}</span>
              </div>
            </div>

            {status === 'error' && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{t('checkout.error', language)}</span>
              </div>
            )}

            <Button 
              className="w-full" 
              size="lg" 
              onClick={handlePlaceOrder}
              disabled={status === 'processing' || !user}
            >
              {status === 'processing' ? t('checkout.processing', language) : t('checkout.orderPending', language)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

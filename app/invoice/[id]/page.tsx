"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Download,
  Printer,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Phone,
  User,
  Calendar,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore, Order } from "@/lib/store-context"
import { Navbar } from "@/components/navbar"
import { t } from "@/lib/translations"

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 }
}

function InvoiceContent() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading, language } = useStore()
  const [order, setOrder] = useState<Order | null>(null)

  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      label: t('profile.orders.status.pending', language)
    },
    processing: {
      icon: Package,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      label: t('profile.orders.status.processing', language)
    },
    shipped: {
      icon: Truck,
      color: 'text-primary bg-primary/10 border-primary/30',
      label: t('profile.orders.status.shipped', language)
    },
    delivered: {
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      label: t('profile.orders.status.delivered', language)
    }
  }

  useEffect(() => {
    if (!isLoading && user) {
      const foundOrder = user.orders.find(o => o.id === params.id)
      if (foundOrder) {
        setOrder(foundOrder)
      }
    }
  }, [user, params.id, isLoading])

  // Fix: Move the redirect to useEffect to avoid "update while rendering" error
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signup')
    }
  }, [isLoading, user, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-xl font-semibold mb-2">Invoice Not Found</h1>
        <p className="text-muted-foreground text-sm mb-6">The invoice you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/profile')} variant="outline">
          {t('invoice.backToProfile', language)}
        </Button>
      </div>
    )
  }

  const status = statusConfig[order.status]
  const StatusIcon = status.icon

  const subtotal = order.total
  const grandTotal = subtotal

  return (
    <div className="min-h-screen bg-background pb-8">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <button
            onClick={() => router.push('/profile')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold">{t('invoice.backToProfile', language)}</span>
          </button>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 rounded-xl font-bold">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">{t('invoice.download', language)}</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2 rounded-xl font-bold">
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">{t('invoice.print', language)}</span>
            </Button>
          </div>
        </motion.div>

        {/* Invoice Card */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-2xl shadow-black/5"
        >
          {/* Invoice Header */}
          <motion.div variants={item} className="p-6 border-b border-border bg-secondary/30 backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h1 className="text-sm font-black uppercase tracking-widest text-muted-foreground">{t('invoice.title', language)}</h1>
                </div>
                <p className="text-2xl font-black text-foreground tracking-tight">{order.id}</p>
              </div>

              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${status.color}`}>
                <StatusIcon className="h-3.5 w-3.5" />
                <span>{status.label}</span>
              </div>
            </div>
          </motion.div>

          {/* Invoice Details */}
          <div className="p-6 space-y-6">
            {/* Date & Customer */}
            <motion.div variants={item} className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t('invoice.date', language)}</span>
                </div>
                <p className="font-bold text-sm text-foreground">{new Date(order.date).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t('invoice.customerName', language)}</span>
                </div>
                <p className="font-bold text-sm text-foreground">{user.fullName}</p>
              </div>
            </motion.div>

            <motion.div variants={item} className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t('invoice.customerPhone', language)}</span>
                </div>
                <p className="font-bold text-sm text-foreground">{user.phone}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Delivery</span>
                </div>
                <p className="font-bold text-sm text-foreground">Dubai, UAE</p>
              </div>
            </motion.div>

            {/* Divider */}
            <motion.div variants={item} className="border-t border-dashed border-border" />

            {/* Items Table */}
            <motion.div variants={item}>
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">{t('invoice.items', language)}</h3>

              <div className="rounded-xl border border-border/50 overflow-hidden shadow-sm">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-secondary/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">
                  <div className="col-span-5">{t('invoice.itemName', language)}</div>
                  <div className="col-span-2 text-center">{t('invoice.itemQty', language)}</div>
                  <div className="col-span-2 text-right">{t('invoice.itemPrice', language)}</div>
                  <div className="col-span-3 text-right">{t('invoice.itemTotal', language)}</div>
                </div>

                {/* Table Body */}
                {order.items.map((orderItem, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="grid grid-cols-12 gap-2 px-4 py-4 border-t border-border/30 text-sm hover:bg-secondary/20 transition-colors"
                  >
                    <div className="col-span-5 font-bold text-foreground">{orderItem.name}</div>
                    <div className="col-span-2 text-center text-muted-foreground font-medium">{orderItem.quantity}</div>
                    <div className="col-span-2 text-right text-muted-foreground font-medium">{orderItem.price.toLocaleString()}</div>
                    <div className="col-span-3 text-right font-black text-foreground">{(orderItem.quantity * orderItem.price).toLocaleString()} <span className="text-[10px] opacity-60 font-bold">{t('product.price', language)}</span></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Totals */}
            <motion.div variants={item} className="space-y-3 pt-4 bg-secondary/20 rounded-2xl p-5 border border-border/30">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground uppercase tracking-widest">{t('invoice.subtotal', language)}</span>
                <span className="text-foreground">{subtotal.toLocaleString()} {t('product.price', language)}</span>
              </div>

              <div className="border-t border-border/50 pt-3 mt-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-black uppercase tracking-[0.2em]">{t('invoice.grandTotal', language)}</span>
                  <span className="text-2xl font-black text-primary tracking-tight">{grandTotal.toLocaleString()} <span className="text-sm opacity-60 font-bold">{t('product.price', language)}</span></span>
                </div>
              </div>
            </motion.div>

            {/* Footer Note */}
            <motion.div variants={item} className="bg-primary/5 border border-primary/10 rounded-2xl p-5 text-[11px] text-muted-foreground leading-relaxed">
              <p className="mb-2 font-black uppercase tracking-widest text-primary">Payment Terms</p>
              <p className="font-medium">Payment is due within 30 days. For credit customers, amount will be deducted from available credit balance.</p>
            </motion.div>
          </div>

          {/* Invoice Footer */}
          <motion.div
            variants={item}
            className="px-6 py-6 bg-navbar text-navbar-foreground text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/10 blur-2xl -translate-y-1/2 translate-x-1/2" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Thank you for your business</p>
            <p className="text-lg font-black tracking-tight">Elmougy Wholesale</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default function InvoicePage() {
  return (
    <InvoiceContent />
  )
}

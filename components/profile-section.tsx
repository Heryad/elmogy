"use client"

import { motion } from "framer-motion"
import {
  CreditCard,
  Package,
  TrendingUp,
  CheckCircle2,
  Clock,
  Truck,
  LogOut,
  ChevronRight,
  Award,
  ExternalLink,
  ShieldAlert
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store-context"
import { useRouter } from "next/navigation"
import { t } from "@/lib/translations"

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
}

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
}

export function ProfileSection() {
  const { user, logout, language } = useStore()
  const router = useRouter()

  if (!user) return null

  const handleLogout = async () => {
    // Optional: remove JWT cookie here by making an API call
    logout()
    router.push('/')
  }

  const isPending = user.status === 'pending'
  const milestoneProgress = (user.creditMilestone.current / user.creditMilestone.required) * 100

  const statusConfig = {
    pending: { icon: Clock, color: 'text-amber-600 bg-amber-50', label: t('profile.orders.status.pending', language) },
    processing: { icon: Package, color: 'text-blue-600 bg-blue-50', label: t('profile.orders.status.processing', language) },
    shipped: { icon: Truck, color: 'text-primary bg-primary/10', label: t('profile.orders.status.shipped', language) },
    delivered: { icon: CheckCircle2, color: 'text-success bg-success/10', label: t('profile.orders.status.delivered', language) }
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {t('profile.welcome', language)}, {user.fullName.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">{user.phone}</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 rounded-xl border-border/50 bg-background shadow-sm">
            <LogOut className="h-4 w-4 text-destructive" />
            <span className="hidden sm:inline font-bold">{t('profile.logout', language)}</span>
          </Button>
        </motion.div>
      </motion.div>

      {isPending ? (
        <motion.div
          variants={item}
          className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <ShieldAlert className="h-8 w-8 text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Account Under Review</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your wholesale account application is currently being reviewed by our team. We will verify your trade license and passport details. You will be able to place orders once approved.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Credit Card */}
          <motion.div
            variants={item}
            whileHover={{ y: -5 }}
            className="relative overflow-hidden rounded-2xl bg-navbar p-6 text-navbar-foreground shadow-2xl shadow-black/20"
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-blue-500/5 blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <CreditCard className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-navbar-foreground/60">{t('profile.creditCard.available', language)}</span>
              </div>

              <div className="text-4xl font-black tracking-tight flex items-baseline gap-2">
                {user.creditAvailable.toLocaleString()}
                <span className="text-xl font-bold opacity-60">{t('product.price', language)}</span>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between">
                <div>
                  <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-40 mb-1">{t('profile.creditCard.orders', language)}</p>
                  <p className="text-lg font-bold">{user.totalOrders}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-40 mb-1">{t('profile.creditCard.total', language)}</p>
                  <p className="text-lg font-bold flex items-baseline justify-end gap-1">
                    {user.totalSpent.toLocaleString()}
                    <span className="text-xs font-bold opacity-60">{t('product.price', language)}</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Credit Milestone */}
          <motion.div
            variants={item}
            className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm">{t('profile.milestone.title', language)}</h3>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  {user.creditMilestone.required} {t('profile.milestone.ordersOf', language)} {(user.creditMilestone.threshold / 1000)}K+ {t('product.price', language)}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground uppercase tracking-widest">{t('profile.milestone.progress', language)}</span>
                <span className="text-foreground">
                  {user.creditMilestone.current} / {user.creditMilestone.required}
                </span>
              </div>

              <div className="relative h-2.5 rounded-full bg-secondary/50 overflow-hidden border border-border/30">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${milestoneProgress}%` }}
                  transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.5 }}
                  className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] rounded-full"
                />
              </div>

              <p className="text-[11px] text-muted-foreground font-medium italic">
                {user.creditMilestone.required - user.creditMilestone.current} {t('profile.milestone.moreToUnlock', language)}
              </p>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={item} className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 border border-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-black text-foreground">{user.totalOrders}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{t('profile.creditCard.orders', language)}</p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center mb-3 border border-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <p className="text-2xl font-black text-foreground">{(user.totalSpent / 1000).toFixed(0)}K</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{t('product.price', language)} {t('profile.milestone.progress', language)}</p>
            </div>
          </motion.div>

          {/* Orders */}
          {user.orders && user.orders.length > 0 && (
            <motion.div variants={item} className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-bold text-foreground">{t('profile.orders.recent', language)}</h2>
                <Button variant="ghost" size="sm" className="gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                  {t('profile.orders.viewAll', language)}
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>

              <div className="space-y-3">
                {user.orders.map((order, index) => {
                  const status = statusConfig[order.status]
                  const StatusIcon = status.icon

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      onClick={() => router.push(`/invoice/${order.id}`)}
                      className="group rounded-2xl border border-border bg-card/80 p-4 cursor-pointer hover:border-primary/50 hover:shadow-xl hover:shadow-black/5 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-foreground text-sm">{order.id}</p>
                            <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-[10px] font-bold text-muted-foreground mt-0.5">{order.date}</p>
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${status.color} border border-current/10 shadow-sm`}>
                          <StatusIcon className="h-3 w-3" />
                          <span>{status.label}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4 bg-secondary/30 rounded-xl p-3 border border-border/30">
                        {order.items.map((orderItem, i) => (
                          <div key={i} className="flex justify-between text-xs font-medium">
                            <span className="text-muted-foreground">{orderItem.quantity}x {orderItem.name}</span>
                            <span className="text-foreground font-bold">{orderItem.price.toLocaleString()} {t('product.price', language)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-border/50 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('profile.orders.total', language)}</span>
                        </div>
                        <span className="text-lg font-black text-foreground">{order.total.toLocaleString()} {t('product.price', language)}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  )
}

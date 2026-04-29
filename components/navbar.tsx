"use client"

import { motion, AnimatePresence } from "framer-motion"
import { User, LogIn, Menu, X, Globe, ShoppingBag } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useStore } from "@/lib/store-context"
import { t } from "@/lib/translations"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const { isLoggedIn, isLoading, language, setLanguage, cartItems, setIsCartOpen } = useStore()
  
  const cartItemCount = cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 w-full bg-navbar">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3"
          >
            <Image 
              src="/logo.png" 
              alt="Elmougy" 
              width={44} 
              height={44}
              className="h-11 w-11 object-contain"
            />
            <span className="text-xl font-semibold tracking-tight text-navbar-foreground">
              Elmougy
            </span>
          </motion.div>
        </Link>

        <div className="hidden sm:flex items-center gap-2">
          {/* Desktop Language Selector */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 hover:bg-white/10 transition-all bg-white/5 backdrop-blur-sm"
            >
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-navbar-foreground">
                {language === 'ar' ? 'عربي' : 'English'}
              </span>
            </motion.button>
            
            <AnimatePresence>
              {langMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setLangMenuOpen(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl overflow-hidden z-50 min-w-[140px] shadow-2xl shadow-black/20"
                  >
                    {(['en', 'ar'] as const).map(lang => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang)
                          setLangMenuOpen(false)
                        }}
                        className={`w-full px-4 py-3 text-sm text-left flex items-center justify-between hover:bg-secondary transition-colors ${
                          language === lang ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground'
                        }`}
                      >
                        <span>{lang === 'ar' ? 'عربي' : 'English'}</span>
                        {language === lang && (
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Cart Icon */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-navbar-foreground hover:bg-white/10 rounded-full transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                {cartItemCount}
              </span>
            )}
          </motion.button>

          {isLoading ? (
            <div className="w-24 h-10 bg-white/10 animate-pulse rounded-lg" />
          ) : isLoggedIn ? (
            <Link href="/profile">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-lg">
                  <User className="h-4 w-4" />
                  {t('nav.profile', language)}
                </Button>
              </motion.div>
            </Link>
          ) : (
            <Link href="/login">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-lg">
                  <LogIn className="h-4 w-4" />
                  {t('nav.signIn', language)}
                </Button>
              </motion.div>
            </Link>
          )}
        </div>

        <div className="flex sm:hidden items-center gap-2">
          {/* Mobile Cart Icon */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-navbar-foreground"
          >
            <ShoppingBag className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                {cartItemCount}
              </span>
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-navbar-foreground"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden sm:hidden bg-navbar border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-3">
              {/* Mobile Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-navbar-foreground"
                >
                  <Globe className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{language === 'ar' ? 'عربي' : 'English'}</span>
                </button>
                
                <AnimatePresence>
                  {langMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute left-0 right-0 top-full mt-2 bg-card border border-border rounded-xl overflow-hidden z-50 shadow-xl"
                    >
                      {(['en', 'ar'] as const).map(lang => (
                        <button
                          key={lang}
                          onClick={() => {
                            setLanguage(lang)
                            setLangMenuOpen(false)
                          }}
                          className={`w-full px-4 py-3 text-sm text-left hover:bg-secondary transition-colors ${
                            language === lang ? 'bg-primary/10 text-primary' : 'text-foreground'
                          }`}
                        >
                          {lang === 'ar' ? 'عربي' : 'English'}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {isLoading ? (
                <div className="w-full h-10 bg-white/10 animate-pulse rounded-lg" />
              ) : isLoggedIn ? (
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg">
                    <User className="h-4 w-4" />
                    {t('nav.profile', language)}
                  </Button>
                </Link>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg">
                    <LogIn className="h-4 w-4" />
                    {t('nav.signIn', language)}
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

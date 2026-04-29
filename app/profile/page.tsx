"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { ProfileSection } from "@/components/profile-section"
import { useStore } from "@/lib/store-context"
import { ArrowLeft, LogIn, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { t } from "@/lib/translations"

function ProfileContent() {
  const { isLoggedIn, isLoading, language } = useStore()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-bold"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('nav.backToStore', language)}
          </Link>
        </motion.div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground font-medium">{t('signup.step3.processing', language)}</p>
          </motion.div>
        ) : isLoggedIn ? (
          <ProfileSection />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 border border-border/50">
              <LogIn className="h-7 w-7 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">{t('nav.signIn', language)}</h2>
            <p className="text-sm text-muted-foreground mb-6 font-medium">
              {t('signup.step1.subtitle', language)}
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/login">
                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl shadow-lg shadow-primary/20">
                  <LogIn className="h-4 w-4" />
                  {t('nav.signIn', language)}
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" className="font-bold rounded-xl border-border/50">
                  Sign Up
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProfileContent />
  )
}

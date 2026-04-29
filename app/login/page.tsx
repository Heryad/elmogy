"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, ChevronDown, LogIn, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useStore, mockUser } from "@/lib/store-context"
import { t } from "@/lib/translations"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Check } from "lucide-react"

const countries = [
  { code: "+971", name: "UAE", flag: "🇦🇪" },
  { code: "+966", name: "KSA", flag: "🇸🇦" },
  { code: "+974", name: "Qatar", flag: "🇶🇦" },
  { code: "+973", name: "Bahrain", flag: "🇧🇭" },
  { code: "+968", name: "Oman", flag: "🇴🇲" },
  { code: "+965", name: "Kuwait", flag: "🇰🇼" },
  { code: "+20", name: "Egypt", flag: "🇪🇬" },
  { code: "+962", name: "Jordan", flag: "🇯🇴" },
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+92", name: "Pakistan", flag: "🇵🇰" },
  { code: "+44", name: "UK", flag: "🇬🇧" },
  { code: "+1", name: "USA", flag: "🇺🇸" },
]

export default function LoginPage() {
  const router = useRouter()
  const { login, language } = useStore()
  
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countryCode, setCountryCode] = useState("+971")
  const [showCountryPicker, setShowCountryPicker] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const selectedCountry = countries.find(c => c.code === countryCode) || countries[0]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phoneNumber.length < 6) return

    setIsSubmitting(true)
    setError("")

    try {
      const phoneFull = `${countryCode}${phoneNumber.replace(/\s/g, '')}`

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneFull })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Update local state context
      const userToStore = data.user 
        ? {
            id: data.user.id,
            fullName: data.user.full_name,
            phone: data.user.phone_number,
            countryCode: data.user.country_code,
            status: data.user.status,
            creditAvailable: data.user.available_credit || data.user.credit_limit || 0,
            totalOrders: 0,
            totalSpent: data.user.total_spent || 0,
            creditMilestone: { current: 0, required: 3, threshold: 30000 },
            orders: []
          }
        : { ...mockUser, fullName: "User", phone: phoneNumber, countryCode, id: phoneFull }
        
      login(userToStore)

      router.push('/profile')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An error occurred during login')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-6">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-bold mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('nav.backToStore', language)}
            </Link>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-8 shadow-2xl shadow-black/5">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <LogIn className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">{t('nav.signIn', language)}</h1>
              <p className="text-sm text-muted-foreground mt-2 font-medium">Enter your phone number to continue</p>
            </div>

            {error && (
              <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-medium text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80">{t('signup.step1.phone', language)}</label>
                <div className="flex gap-3 relative z-20">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryPicker(!showCountryPicker)}
                      className="h-12 px-4 flex items-center gap-2 rounded-xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-all"
                    >
                      <span className="text-lg">{selectedCountry.flag}</span>
                      <span className="text-sm font-bold">{selectedCountry.code}</span>
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </button>
                    
                    <AnimatePresence>
                      {showCountryPicker && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-2xl max-h-72 overflow-auto p-2"
                        >
                          {countries.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => {
                                setCountryCode(country.code)
                                setShowCountryPicker(false)
                              }}
                              className="w-full px-3 py-3 flex items-center gap-3 hover:bg-secondary rounded-xl transition-all text-left"
                            >
                              <span className="text-xl">{country.flag}</span>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-foreground">{country.name}</span>
                                <span className="text-[10px] text-muted-foreground font-medium">{country.code}</span>
                              </div>
                              {countryCode === country.code && (
                                <Check className="h-4 w-4 text-primary ml-auto" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="relative flex-1 group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="50 123 4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-12 h-12 bg-secondary/20 border-border/50 focus:border-primary/50 transition-all rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={phoneNumber.length < 6 || isSubmitting}
                className="w-full h-12 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold shadow-lg shadow-primary/20"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    {t('nav.signIn', language)}
                  </>
                )}
              </Button>

              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-primary font-bold hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

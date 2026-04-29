"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User, 
  Phone, 
  Upload, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Scan,
  CheckCircle2,
  Loader2,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useStore, mockUser } from "@/lib/store-context"
import { t } from "@/lib/translations"
import { supabase } from "@/lib/supabase"

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

interface FileUploadProps {
  label: string
  description: string
  onUpload: (file: File) => void
  uploadedFile: File | null
  isScanning: boolean
  language: any
}

function FileUpload({ label, description, onUpload, uploadedFile, isScanning, language }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onUpload(file)
  }, [onUpload])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onUpload(file)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-foreground/80">{label}</label>
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-xl border-2 border-dashed p-8 transition-all cursor-pointer ${
          isDragging 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : uploadedFile 
            ? "border-success bg-success/5" 
            : "border-border hover:border-primary/50 hover:bg-secondary/30"
        }`}
      >
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleChange}
          className="absolute inset-0 cursor-pointer opacity-0 z-10"
        />
        
        <AnimatePresence mode="wait">
          {isScanning ? (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-4"
            >
              <div className="relative w-20 h-20 mb-4">
                <div className="absolute inset-0 rounded-xl border-2 border-primary/20 bg-primary/5" />
                <motion.div
                  className="absolute left-0 right-0 top-0 h-1 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <Scan className="absolute inset-0 m-auto h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-primary font-bold tracking-wide">{t('signup.step2.scanning', language)}</p>
            </motion.div>
          ) : uploadedFile ? (
            <motion.div
              key="uploaded"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mb-3 shadow-inner"
              >
                <CheckCircle2 className="h-7 w-7 text-success" />
              </motion.div>
              <p className="text-sm font-bold text-foreground truncate max-w-[240px]">
                {uploadedFile.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">{t('signup.step2.tapToReplace', language)}</p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-4"
            >
              <div className="w-14 h-14 rounded-full bg-secondary/50 flex items-center justify-center mb-3 border border-border">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-foreground font-bold">{description}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('signup.step2.formats', language)}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export function SignupForm() {
  const router = useRouter()
  const { login, language } = useStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [showCountryPicker, setShowCountryPicker] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    countryCode: "+971"
  })
  const [license, setLicense] = useState<File | null>(null)
  const [passport, setPassport] = useState<File | null>(null)
  const [isScanning, setIsScanning] = useState<'license' | 'passport' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const steps = [
    { id: 1, title: t('signup.step1.title', language) },
    { id: 2, title: t('signup.step2.title', language) },
    { id: 3, title: t('signup.step3.title', language) }
  ]

  const selectedCountry = countries.find(c => c.code === formData.countryCode) || countries[0]

  const handleFileUpload = (type: 'license' | 'passport') => (file: File) => {
    setIsScanning(type)
    setTimeout(() => {
      if (type === 'license') setLicense(file)
      else setPassport(file)
      setIsScanning(null)
    }, 1800)
  }

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(prev => prev + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      let licenseUrl = ""
      let passportUrl = ""

      const phoneFull = `${formData.countryCode}${formData.phoneNumber.replace(/\s/g, '')}`

      // Upload license
      if (license) {
        const fileExt = license.name.split('.').pop()
        const fileName = `${phoneFull}/license_${Date.now()}.${fileExt}`
        const { error: uploadError, data } = await supabase.storage
          .from('verification_documents')
          .upload(fileName, license)

        if (uploadError) throw uploadError
        if (data) {
          const { data: publicUrlData } = supabase.storage.from('verification_documents').getPublicUrl(fileName)
          licenseUrl = publicUrlData.publicUrl
        }
      }

      // Upload passport
      if (passport) {
        const fileExt = passport.name.split('.').pop()
        const fileName = `${phoneFull}/passport_${Date.now()}.${fileExt}`
        const { error: uploadError, data } = await supabase.storage
          .from('verification_documents')
          .upload(fileName, passport)

        if (uploadError) throw uploadError
        if (data) {
          const { data: publicUrlData } = supabase.storage.from('verification_documents').getPublicUrl(fileName)
          passportUrl = publicUrlData.publicUrl
        }
      }

      // Insert user
      const { error: insertError } = await supabase.from('users').insert([{
        full_name: formData.fullName,
        phone_number: phoneFull,
        country_code: formData.countryCode,
        country: selectedCountry.name,
        trade_license_url: licenseUrl,
        passport_url: passportUrl,
        status: 'pending'
      }])

      if (insertError) {
        console.error("Insert error:", insertError)
        // If it's a unique constraint violation on phone, we ignore it for now or assume they are logging in
        // In a real app we'd show "Phone number already exists"
        if (insertError.code !== '23505') { 
            throw insertError
        }
      }

      // Login to issue JWT cookie and get user data
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneFull })
      })

      const authData = await res.json()

      // Store in context/localstorage for UI state using real DB data
      if (authData.user) {
        const userToStore = {
          id: authData.user.id,
          fullName: authData.user.full_name,
          phone: authData.user.phone_number,
          countryCode: authData.user.country_code,
          status: authData.user.status,
          creditAvailable: authData.user.available_credit || authData.user.credit_limit || 0,
          totalOrders: 0,
          totalSpent: authData.user.total_spent || 0,
          creditMilestone: { current: 0, required: 3, threshold: 30000 },
          orders: []
        }
        login(userToStore)
      } else {
        login({ ...mockUser, fullName: formData.fullName, phone: formData.phoneNumber, countryCode: formData.countryCode, id: phoneFull })
      }

      setIsSubmitting(false)
      setIsComplete(true)
      
      setTimeout(() => {
        router.push('/')
      }, 1500)

    } catch (error) {
      console.error("Error signing up:", error)
      setIsSubmitting(false)
      alert("An error occurred during signup. Please try again.")
    }
  }

  const canProceed = () => {
    if (currentStep === 1) return formData.fullName.length > 2 && formData.phoneNumber.length > 6
    if (currentStep === 2) return license && passport
    return true
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress Steps */}
      <div className="mb-10 px-2">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-10 right-10 h-[3px] bg-border/40 rounded-full" />
          
          <motion.div 
            className="absolute top-5 left-10 h-[3px] bg-primary shadow-[0_0_10px_rgba(var(--primary),0.3)] rounded-full"
            initial={{ width: "0%" }}
            animate={{ 
              width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%" 
            }}
            style={{ 
              maxWidth: "calc(100% - 80px)" 
            }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          />

          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <motion.div
                animate={{
                  backgroundColor: currentStep >= step.id ? "hsl(var(--primary))" : "hsl(var(--card))",
                  borderColor: currentStep >= step.id ? "hsl(var(--primary))" : "hsl(var(--border))",
                  scale: currentStep === step.id ? 1.1 : 1,
                  boxShadow: currentStep === step.id ? "0 0 20px rgba(var(--primary), 0.2)" : "none"
                }}
                className="w-11 h-11 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all"
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5 text-primary-foreground" />
                ) : (
                  <span className={currentStep >= step.id ? "text-primary-foreground" : "text-muted-foreground"}>
                    {step.id}
                  </span>
                )}
              </motion.div>
              <span className={`mt-3 text-[10px] font-black uppercase tracking-widest ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <motion.div 
        layout 
        className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-8 shadow-2xl shadow-black/5"
      >
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-foreground">{t('signup.step1.title', language)}</h2>
                <p className="text-sm text-muted-foreground mt-2 font-medium">{t('signup.step1.subtitle', language)}</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80">{t('signup.step1.fullName', language)}</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder={t('signup.step1.fullNamePlaceholder', language)}
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="pl-12 h-12 bg-secondary/20 border-border/50 focus:border-primary/50 transition-all rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80">{t('signup.step1.phone', language)}</label>
                  <div className="flex gap-3">
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
                            className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-2xl z-50 max-h-72 overflow-auto p-2"
                          >
                            {countries.map((country) => (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, countryCode: country.code }))
                                  setShowCountryPicker(false)
                                }}
                                className="w-full px-3 py-3 flex items-center gap-3 hover:bg-secondary rounded-xl transition-all text-left"
                              >
                                <span className="text-xl">{country.flag}</span>
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-foreground">{country.name}</span>
                                  <span className="text-[10px] text-muted-foreground font-medium">{country.code}</span>
                                </div>
                                {formData.countryCode === country.code && (
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
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        className="pl-12 h-12 bg-secondary/20 border-border/50 focus:border-primary/50 transition-all rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-foreground">{t('signup.step2.title', language)}</h2>
                <p className="text-sm text-muted-foreground mt-2 font-medium">{t('signup.step2.subtitle', language)}</p>
              </div>

              <div className="space-y-5">
                <FileUpload
                  label={t('signup.step2.tradeLicense', language)}
                  description={t('signup.step2.licenseHint', language)}
                  onUpload={handleFileUpload('license')}
                  uploadedFile={license}
                  isScanning={isScanning === 'license'}
                  language={language}
                />

                <FileUpload
                  label={t('signup.step2.idDocument', language)}
                  description={t('signup.step2.passportHint', language)}
                  onUpload={handleFileUpload('passport')}
                  uploadedFile={passport}
                  isScanning={isScanning === 'passport'}
                  language={language}
                />
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <AnimatePresence mode="wait">
                {isComplete ? (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-success/10"
                    >
                      <CheckCircle2 className="h-10 w-10 text-success" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-foreground">{t('signup.step3.successTitle', language)}</h2>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">{t('signup.step3.successSubtitle', language)}</p>
                  </motion.div>
                ) : isSubmitting ? (
                  <motion.div
                    key="submitting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-10"
                  >
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-4 border-primary/10 border-t-primary shadow-lg shadow-primary/10"
                      />
                      <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">{t('signup.step3.processing', language)}</h2>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">{t('signup.step3.verifying', language)}</p>
                  </motion.div>
                ) : (
                  <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-foreground">{t('signup.step3.title', language)}</h2>
                      <p className="text-sm text-muted-foreground mt-2 font-medium">{t('signup.step3.confirm', language)}</p>
                    </div>

                    <div className="space-y-1 bg-secondary/20 rounded-2xl p-6 border border-border/50">
                      <div className="flex justify-between items-center py-3 border-b border-border/50">
                        <span className="text-sm text-muted-foreground font-medium">{t('signup.step1.fullName', language)}</span>
                        <span className="text-sm font-bold text-foreground">{formData.fullName}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-border/50">
                        <span className="text-sm text-muted-foreground font-medium">{t('signup.step1.phone', language)}</span>
                        <span className="text-sm font-bold text-foreground">{formData.countryCode} {formData.phoneNumber}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-border/50">
                        <span className="text-sm text-muted-foreground font-medium">{t('signup.step2.tradeLicense', language)}</span>
                        <span className="text-xs font-bold text-success flex items-center gap-1.5 bg-success/10 px-2.5 py-1 rounded-full">
                          <Check className="h-3 w-3" /> {t('signup.step2.uploadComplete', language)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <span className="text-sm text-muted-foreground font-medium">{t('signup.step2.idDocument', language)}</span>
                        <span className="text-xs font-bold text-success flex items-center gap-1.5 bg-success/10 px-2.5 py-1 rounded-full">
                          <Check className="h-3 w-3" /> {t('signup.step2.uploadComplete', language)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {!isComplete && !isSubmitting && (
          <div className="mt-8 flex gap-4">
            {currentStep > 1 && (
              <Button 
                variant="outline" 
                onClick={handleBack} 
                className="flex-1 h-12 gap-2 border-border/50 hover:bg-secondary rounded-xl font-bold"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('signup.step1.back', language)}
              </Button>
            )}
            
            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 h-12 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold shadow-lg shadow-primary/20"
              >
                {t('signup.step1.continue', language)}
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex-1 h-12 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold shadow-lg shadow-primary/20"
              >
                {t('signup.step3.submit', language)}
                <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}

"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { SignupForm } from "@/components/signup-form"
import { StoreProvider } from "@/lib/store-context"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

function SignupContent() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>
        </motion.div>

        <SignupForm />
      </main>
    </div>
  )
}

export default function SignupPage() {
  return (
    <StoreProvider>
      <SignupContent />
    </StoreProvider>
  )
}

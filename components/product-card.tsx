"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useStore } from "@/lib/store-context"
import { t } from "@/lib/translations"
import { ShoppingBag, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ProductCardProps {
  id?: string
  name: string
  image: string
  price: number
  simType: 'esim' | 'normal' | 'dual'
  grade: 'HB+' | 'DNA' | 'DNB' | 'DNC' | 'CPO' | 'TMC' | 'A+' | 'B+' | 'A' | 'B' | 'C'
  minQty: number
  index: number
}

export function ProductCard({ id, name, image, price, simType, grade, minQty, index }: ProductCardProps) {
  const { language, addToCart } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [quantity, setQuantity] = useState(minQty)
  
  const simLabels = {
    esim: t('product.esim', language),
    normal: t('product.normalSim', language),
    dual: t('product.dualSim', language)
  }

  const handleAddToCart = () => {
    addToCart({
      id: id || `${name}-${grade}-${simType}`, // Generate a fallback ID if not provided
      name,
      image,
      price,
      quantity,
      simType,
      grade
    })
    setIsModalOpen(false)
    setQuantity(minQty) // reset
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.03 }}
        whileHover={{ y: -4 }}
        className="group relative bg-card rounded-xl border border-border overflow-hidden transition-shadow hover:shadow-lg hover:shadow-black/5"
      >
        {/* SIM Badge - Top Right */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`px-2 py-1 rounded text-[10px] font-medium backdrop-blur-md shadow-sm ${
            simType === 'esim' 
              ? 'bg-primary/20 text-primary border border-primary/20' 
              : simType === 'dual'
              ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/20'
              : 'bg-muted/50 text-muted-foreground border border-border'
          }`}>
            {simLabels[simType]}
          </span>
        </div>


        <div className="aspect-square p-6 bg-secondary/30 relative">
          <div className="relative w-full h-full">
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        <div className="p-4 relative z-10 bg-card">
          <h3 className="font-medium text-foreground text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
            {name}
          </h3>
          
          <div className="mt-3 flex items-end justify-between gap-2">
            <div>
              <span className="text-lg font-bold text-foreground">
                {price.toLocaleString()}
              </span>
              <span className="text-[10px] text-muted-foreground mx-1 font-medium">{t('product.price', language)}</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-muted-foreground block uppercase tracking-tight font-semibold">{t('product.minQty', language)}</span>
              <span className="text-xs font-bold text-foreground">{minQty} {t('product.pcs', language)}</span>
            </div>
          </div>

          <Button 
            onClick={() => setIsModalOpen(true)}
            variant="secondary"
            className="w-full mt-4 font-semibold hover:bg-primary hover:text-primary-foreground transition-all group-hover:shadow-md"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            {t('cart.add', language)}
          </Button>
        </div>
      </motion.div>

      {/* Add to Cart Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('cart.add', language)}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 bg-secondary/30 rounded-md">
                <Image src={image} alt={name} fill className="object-contain p-2" />
              </div>
              <div>
                <h4 className="font-medium text-sm leading-tight">{name}</h4>
                <div className="text-lg font-bold mt-1">
                  {price.toLocaleString()} <span className="text-xs text-muted-foreground font-normal">{t('product.price', language)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">{t('cart.quantity', language)}</span>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setQuantity(Math.max(minQty, quantity - 1))}
                  disabled={quantity <= minQty}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-semibold w-8 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <Button onClick={handleAddToCart} className="w-full">
            {t('cart.confirmAdd', language)}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}

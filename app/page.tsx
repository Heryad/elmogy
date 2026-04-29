"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { CategoryChips } from "@/components/category-chips"
import { ProductCard } from "@/components/product-card"
import { useStore } from "@/lib/store-context"
import { t } from "@/lib/translations"

type Grade = 'HB+' | 'DNA' | 'DNB' | 'DNC' | 'CPO' | 'TMC' | 'A+' | 'B+' | 'A' | 'B' | 'C'
type SimType = 'esim' | 'normal' | 'dual'

const products: Array<{
  name: string
  image: string
  price: number
  simType: SimType
  category: string
  grade: Grade
  minQty: number
}> = [
  { name: "iPhone 7 32 GB", image: "https://elmougi.ae/cdn/shop/files/Red_9ddd76e3-14bb-40fb-9ad0-8bb769bd508c.png?v=1777011291&width=400", price: 65, simType: 'normal', category: 'apple', grade: 'C', minQty: 10 },
  { name: "iPhone 7 Plus 32 GB", image: "https://elmougi.ae/cdn/shop/files/SpaceGrey_1_fc7d81a9-b887-42a1-93d2-e404265145f6.png?v=1777011386&width=400", price: 85, simType: 'normal', category: 'apple', grade: 'B', minQty: 10 },
  { name: "iPhone X 64 GB", image: "https://elmougi.ae/cdn/shop/files/SpaceGrey_5d50a7a9-b02d-4d50-8b45-4576a0692a1a.png?v=1777011255&width=400", price: 140, simType: 'normal', category: 'apple', grade: 'A', minQty: 5 },
  { name: "iPhone X 256 GB", image: "https://elmougi.ae/cdn/shop/files/Silver_143240c5-22aa-491b-9bff-834626cf69d4.png?v=1777011129&width=400", price: 160, simType: 'normal', category: 'apple', grade: 'A+', minQty: 5 },
  { name: "iPhone 11 64 GB", image: "https://elmougi.ae/cdn/shop/files/Purple_3_8131ec58-9be5-4a0d-a726-fce118f5d50c.png?v=1777011165&width=400", price: 210, simType: 'normal', category: 'apple', grade: 'DNA', minQty: 5 },
  { name: "iPhone 11 128 GB", image: "https://elmougi.ae/cdn/shop/files/Green_45ee8e3f-ddb5-420f-b121-29f1cf96220b.png?v=1777011042&width=400", price: 240, simType: 'normal', category: 'apple', grade: 'DNB', minQty: 5 },
  { name: "iPhone 11 Pro 64 GB", image: "https://elmougi.ae/cdn/shop/files/Gold_4_b277dc48-b80f-4ba8-a5f0-63e4d43fbcd8.png?v=1777011332&width=400", price: 260, simType: 'normal', category: 'apple', grade: 'A+', minQty: 5 },
  { name: "iPhone 11 Pro Max 64 GB", image: "https://elmougi.ae/cdn/shop/files/Gold_0258d68b-8bbf-4f20-be7d-57e5555c8972.png?v=1777011255&width=400", price: 310, simType: 'normal', category: 'apple', grade: 'CPO', minQty: 5 },
  { name: "iPhone 12 64 GB", image: "https://elmougi.ae/cdn/shop/files/PacificBlue_7c9cb29a-d4bd-492b-b343-49c65a1395c8.png?v=1777011102&width=400", price: 290, simType: 'normal', category: 'apple', grade: 'DNA', minQty: 5 },
  { name: "iPhone 12 Pro 128 GB", image: "https://elmougi.ae/cdn/shop/files/PacificBlue_7c9cb29a-d4bd-492b-b343-49c65a1395c8.png?v=1777011102&width=400", price: 390, simType: 'normal', category: 'apple', grade: 'HB+', minQty: 5 },
  { name: "iPhone 12 Pro Max 128 GB", image: "https://elmougi.ae/cdn/shop/files/Graphite_4_52887618-56f5-4744-b8a7-c30f8ebe257c.png?v=1777011008&width=400", price: 470, simType: 'normal', category: 'apple', grade: 'A+', minQty: 5 },
  { name: "iPhone 13 128 GB", image: "https://elmougi.ae/cdn/shop/files/Green_48f4836b-2579-466e-a21f-73349511dd96.png?v=1777010644&width=400", price: 440, simType: 'esim', category: 'apple', grade: 'DNA', minQty: 5 },
  { name: "iPhone 13 Pro 128 GB", image: "https://elmougi.ae/cdn/shop/files/Sierra_Blue_4.png?v=1777011008&width=400", price: 580, simType: 'esim', category: 'apple', grade: 'HB+', minQty: 5 },
  { name: "iPhone 13 Pro 256 GB", image: "https://elmougi.ae/cdn/shop/files/Sierra_Blue_4.png?v=1777011008&width=400", price: 630, simType: 'esim', category: 'apple', grade: 'CPO', minQty: 5 },
  { name: "iPhone 13 Pro Max 128 GB", image: "https://elmougi.ae/cdn/shop/files/AlpineGreen_4_34f68df1-f293-4a40-8961-49a7e6e47b56.png?v=1777010975&width=400", price: 680, simType: 'esim', category: 'apple', grade: 'A+', minQty: 5 },
  { name: "iPhone 13 Pro Max 256 GB", image: "https://elmougi.ae/cdn/shop/files/AlpineGreen_4_34f68df1-f293-4a40-8961-49a7e6e47b56.png?v=1777010975&width=400", price: 730, simType: 'esim', category: 'apple', grade: 'HB+', minQty: 5 },
  { name: "iPhone 13 Pro Max 512 GB", image: "https://elmougi.ae/cdn/shop/files/AlpineGreen_4_34f68df1-f293-4a40-8961-49a7e6e47b56.png?v=1777010975&width=400", price: 790, simType: 'esim', category: 'apple', grade: 'DNA', minQty: 5 },
  { name: "iPhone 14 Pro 128 GB", image: "https://elmougi.ae/cdn/shop/files/DeepPurp.png?v=1777010853&width=400", price: 720, simType: 'esim', category: 'apple', grade: 'HB+', minQty: 5 },
  { name: "iPhone 14 Pro 256 GB", image: "https://elmougi.ae/cdn/shop/files/DeepPurp.png?v=1777010853&width=400", price: 780, simType: 'esim', category: 'apple', grade: 'CPO', minQty: 5 },
  { name: "iPhone 14 Pro Max 256 GB", image: "https://elmougi.ae/cdn/shop/files/DeepPurp.png?v=1777010853&width=400", price: 880, simType: 'esim', category: 'apple', grade: 'HB+', minQty: 5 },
  { name: "iPhone 15 128 GB", image: "https://elmougi.ae/cdn/shop/files/LimeGreen_65696fae-4c06-4dfc-b6ce-d21df2514cf3.png?v=1777011291&width=400", price: 680, simType: 'esim', category: 'apple', grade: 'DNA', minQty: 5 },
  { name: "iPhone 15 Pro 128 GB", image: "https://elmougi.ae/cdn/shop/files/Natural_Titanium_f87efc3a-f0d6-4f56-9b2c-8e81003fd82d.png?v=1777010578&width=400", price: 890, simType: 'esim', category: 'apple', grade: 'HB+', minQty: 5 },
  { name: "iPhone 15 Pro 256 GB", image: "https://elmougi.ae/cdn/shop/files/BlueTitanium_37ddf517-67f9-4260-a465-7e3f3d7d1a86.png?v=1777010550&width=400", price: 980, simType: 'esim', category: 'apple', grade: 'CPO', minQty: 5 },
  { name: "iPhone 15 Pro Max 512 GB", image: "https://elmougi.ae/cdn/shop/files/WhiteTitanium_74e75398-dcf5-43d6-97b5-25abc3f0d6a2.png?v=1777010578&width=400", price: 1150, simType: 'esim', category: 'apple', grade: 'HB+', minQty: 5 },
  { name: "iPhone 15 Pro Max 1 TB", image: "https://elmougi.ae/cdn/shop/files/BlackTitanium_7c83a2b1-4a47-41b1-8cbd-681d230dc4fa.png?v=1777010550&width=400", price: 1250, simType: 'esim', category: 'apple', grade: 'HB+', minQty: 5 },
  { name: "iPhone 16 Pro Max 256 GB", image: "https://elmougi.ae/cdn/shop/files/Desert_Titanium.png?v=1777012758&width=400", price: 1190, simType: 'esim', category: 'apple', grade: 'HB+', minQty: 5 },
  { name: "Galaxy S22 Ultra 12 / 256 GB", image: "https://elmougi.ae/cdn/shop/files/PhantomBlack_1_8467d1d4-83d4-4131-85ad-ef1106ad59bb.png?v=1777012084&width=400", price: 450, simType: 'dual', category: 'samsung', grade: 'A+', minQty: 5 },
  { name: "Galaxy S23 Ultra 8 / 256 GB", image: "https://elmougi.ae/cdn/shop/files/Cream_395a7a58-da37-49c4-9a16-82fb8a9db2e0.png?v=1777012039&width=400", price: 650, simType: 'dual', category: 'samsung', grade: 'HB+', minQty: 5 },
  { name: "Galaxy S24 Ultra 12 / 256 GB", image: "https://elmougi.ae/cdn/shop/files/PhantomBlack_1_8467d1d4-83d4-4131-85ad-ef1106ad59bb.png?v=1777012084&width=400", price: 890, simType: 'dual', category: 'samsung', grade: 'HB+', minQty: 5 },
]

function HomeContent() {
  const { selectedCategory, selectedGrade, language } = useStore()
  
  const filteredProducts = products.filter(p => {
    const matchesBrand = !selectedCategory || p.category === selectedCategory
    const matchesGrade = !selectedGrade || p.grade === selectedGrade
    return matchesBrand && matchesGrade
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-balance">
            {t('home.hero.title', language)}
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            {t('home.hero.subtitle', language)}
          </p>
        </motion.div>

        {/* Category Chips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <CategoryChips />
        </motion.div>

        {/* Products Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-4"
        >
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} {t('home.productsCount', language)}
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.name + index}
              name={product.name}
              image={product.image}
              price={product.price}
              simType={product.simType}
              grade={product.grade}
              minQty={product.minQty}
              index={index}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {t('footer.rights', language)}
            </p>
            <div className="flex gap-5 text-xs text-muted-foreground">
              <span className="hover:text-foreground cursor-pointer transition-colors">{t('footer.terms', language)}</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">{t('footer.privacy', language)}</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">{t('footer.contact', language)}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomeContent

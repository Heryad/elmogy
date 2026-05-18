"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { CategoryChips } from "@/components/category-chips"
import { ProductCard } from "@/components/product-card"
import { useStore } from "@/lib/store-context"
import { t } from "@/lib/translations"

type Grade = 'HB+' | 'DNA' | 'DNB' | 'DNC' | 'CPO' | 'TMC' | 'A+' | 'B+' | 'A' | 'B' | 'C'
type SimType = 'esim' | 'normal' | 'dual'

const I = {
  x: "https://elmougi.ae/cdn/shop/files/SpaceGrey_5.png?v=1777011386&width=1600",
  xS: "https://elmougi.ae/cdn/shop/files/Silver_5aee878a-4691-47e4-ba2c-fe2b4ee98f42.png?v=1777011332&width=1600",
  i11: "https://elmougi.ae/cdn/shop/files/black_97945f03-27df-4717-90bb-ff139859a0a5.png?v=1777011291&width=1600",
  i11g: "https://elmougi.ae/cdn/shop/files/Green_45ee8e3f-ddb5-420f-b121-29f1cf96220b.png?v=1777011042&width=400",
  i11p: "https://elmougi.ae/cdn/shop/files/Silver_faf0fad4-8661-4655-b337-47cd9eca9c47.png?v=1777011255&width=1600",
  i11pm: "https://elmougi.ae/cdn/shop/files/Gold_0258d68b-8bbf-4f20-be7d-57e5555c8972.png?v=1777011255&width=400",
  i12: "https://elmougi.ae/cdn/shop/files/Black_80a669d0-9c2e-4526-8add-841fa48f5a8c.png?v=1777011164&width=1600",
  i12pm: "https://elmougi.ae/cdn/shop/files/Gold_a72758d8-81f0-40a7-9ebd-842777fc4d4d.png?v=1777011129&width=1600",
  i13: "https://elmougi.ae/cdn/shop/files/Starlight_fa1daf7c-961f-480e-9b48-e25f529b10bb.png?v=1777011042&width=1600",
  i13p: "https://elmougi.ae/cdn/shop/files/Sierra_Blue_4.png?v=1777011008&width=400",
  i13pm: "https://elmougi.ae/cdn/shop/files/AlpineGreen_4_34f68df1-f293-4a40-8961-49a7e6e47b56.png?v=1777010975&width=400",
  i14: "https://elmougi.ae/cdn/shop/files/Blue_6b8b3e2d-2de7-4e2c-ba93-c645eb591fca.png?v=1777010943&width=1600",
  i14p: "https://elmougi.ae/cdn/shop/files/SpaceBlack_68a3d268-e8ba-4342-9a2d-e2340fc51921.png?v=1777010853&width=1600",
  i15: "https://elmougi.ae/cdn/shop/files/Black_2a4d038d-be7b-4d8f-8b59-936ec17de928.png?v=1777010643&width=1600",
  i15p: "https://elmougi.ae/cdn/shop/files/Natural_Titanium_f87efc3a-f0d6-4f56-9b2c-8e81003fd82d.png?v=1777010578&width=400",
  i15pB: "https://elmougi.ae/cdn/shop/files/BlueTitanium_37ddf517-67f9-4260-a465-7e3f3d7d1a86.png?v=1777010550&width=400",
  i15pm: "https://elmougi.ae/cdn/shop/files/Natural_Titanium_f87efc3a-f0d6-4f56-9b2c-8e81003fd82d.png?v=1777010578&width=400",
  i15pmB: "https://elmougi.ae/cdn/shop/files/Natural_Titanium_f87efc3a-f0d6-4f56-9b2c-8e81003fd82d.png?v=1777010578&width=400",
  i16: "https://elmougi.ae/cdn/shop/files/Desert_Titanium.png?v=1777012758&width=400",
  i16m: "https://elmougi.ae/cdn/shop/files/Ultramarine.png?v=1777012778&width=1600",
  sFlip3: "https://elmougi.ae/cdn/shop/files/Frame_180_41.png?v=1777012187&width=1600",
  sFlip4: "https://elmougi.ae/cdn/shop/files/Frame_180_61.png?v=1777012159&width=1600",
  sFlip5: "https://elmougi.ae/cdn/shop/files/Frame_180_85.png?v=1777012288&width=1600",
  sFlip6: "https://elmougi.ae/cdn/shop/files/Frame_180_99.png?v=1777012257&width=1600",
  sFold4: "https://elmougi.ae/cdn/shop/files/PhantomBlack_cab75149-43b0-43e4-bf2d-1126601b9458.png?v=1777012142&width=1600",
  sFold5: "https://elmougi.ae/cdn/shop/files/Frame180-2024-11-22T152034.564.png?v=1777012228&width=1600",
  sFold6: "https://elmougi.ae/cdn/shop/files/Frame180-2024-11-22T160654.147.png?v=1777012208&width=1600",
}

type P = { name: string; image: string; price: number; simType: SimType; category: string; grade: Grade; minQty: number }

// helper: expand one model into 3 grade entries
function g(name: string, img: string, b: number, a: number, ap: number, sim: SimType, cat = 'apple', qty = 5): P[] {
  return [
    { name, image: img, price: b, simType: sim, category: cat, grade: 'B', minQty: qty },
    { name, image: img, price: a, simType: sim, category: cat, grade: 'A', minQty: qty },
    { name, image: img, price: ap, simType: sim, category: cat, grade: 'A+', minQty: qty },
  ]
}

const products: P[] = [
  // iPhone X
  ...g("iPhone X 64 GB", I.x, 95, 100, 105, 'normal'),
  ...g("iPhone X 256 GB", I.xS, 110, 115, 120, 'normal'),
  // iPhone XS
  ...g("iPhone XS 64 GB", I.x, 110, 115, 120, 'normal'),
  ...g("iPhone XS 256 GB", I.x, 125, 130, 135, 'normal'),
  ...g("iPhone XS 512 GB", I.x, 135, 140, 145, 'normal'),
  // iPhone XS Max
  ...g("iPhone XS Max 64 GB", I.xS, 150, 165, 175, 'normal'),
  ...g("iPhone XS Max 256 GB", I.xS, 170, 185, 195, 'normal'),
  ...g("iPhone XS Max 512 GB", I.xS, 180, 195, 205, 'normal'),
  // iPhone 11
  ...g("iPhone 11 64 GB", I.i11, 140, 150, 160, 'normal'),
  ...g("iPhone 11 128 GB", I.i11g, 165, 175, 185, 'normal'),
  ...g("iPhone 11 256 GB", I.i11, 175, 185, 195, 'normal'),
  // iPhone 11 Pro
  ...g("iPhone 11 Pro 64 GB", I.i11p, 180, 190, 200, 'normal'),
  ...g("iPhone 11 Pro 256 GB", I.i11p, 200, 210, 220, 'normal'),
  ...g("iPhone 11 Pro 512 GB", I.i11p, 210, 220, 230, 'normal'),
  // iPhone 11 Pro Max
  ...g("iPhone 11 Pro Max 64 GB", I.i11pm, 190, 200, 210, 'normal'),
  ...g("iPhone 11 Pro Max 256 GB", I.i11pm, 230, 240, 250, 'normal'),
  ...g("iPhone 11 Pro Max 512 GB", I.i11pm, 240, 250, 260, 'normal'),
  // iPhone 12
  ...g("iPhone 12 64 GB", I.i12, 165, 175, 185, 'normal'),
  ...g("iPhone 12 128 GB", I.i12, 195, 205, 215, 'normal'),
  ...g("iPhone 12 256 GB", I.i12, 205, 215, 225, 'normal'),
  // iPhone 12 Pro
  ...g("iPhone 12 Pro 128 GB", I.i12, 240, 250, 260, 'normal'),
  ...g("iPhone 12 Pro 256 GB", I.i12, 260, 270, 290, 'normal'),
  // iPhone 12 Pro Max
  ...g("iPhone 12 Pro Max 128 GB", I.i12pm, 280, 290, 300, 'normal'),
  ...g("iPhone 12 Pro Max 256 GB", I.i12pm, 290, 300, 310, 'normal'),
  // iPhone 13
  ...g("iPhone 13 128 GB", I.i13, 250, 260, 270, 'normal'),
  ...g("iPhone 13 256 GB", I.i13, 260, 270, 280, 'normal'),
  // iPhone 13 Pro
  ...g("iPhone 13 Pro 128 GB", I.i13p, 320, 330, 340, 'normal'),
  ...g("iPhone 13 Pro 256 GB", I.i13p, 350, 360, 370, 'normal'),
  ...g("iPhone 13 Pro 512 GB", I.i13p, 360, 370, 380, 'normal'),
  ...g("iPhone 13 Pro 1 TB", I.i13p, 370, 380, 390, 'normal'),
  // iPhone 13 Pro Max
  ...g("iPhone 13 Pro Max 128 GB", I.i13pm, 370, 390, 405, 'normal'),
  ...g("iPhone 13 Pro Max 256 GB", I.i13pm, 435, 450, 465, 'normal'),
  ...g("iPhone 13 Pro Max 512 GB", I.i13pm, 445, 460, 475, 'normal'),
  ...g("iPhone 13 Pro Max 1 TB", I.i13pm, 455, 470, 485, 'normal'),
  // iPhone 14
  ...g("iPhone 14 128 GB", I.i14, 290, 310, 325, 'normal'),
  ...g("iPhone 14 256 GB", I.i14, 300, 320, 330, 'normal'),
  // iPhone 14 Pro — E SIM
  ...g("iPhone 14 Pro 128 GB E SIM", I.i14p, 370, 390, 410, 'esim'),
  ...g("iPhone 14 Pro 256 GB E SIM", I.i14p, 405, 430, 445, 'esim'),
  ...g("iPhone 14 Pro 512 GB E SIM", I.i14p, 415, 440, 455, 'esim'),
  ...g("iPhone 14 Pro 1 TB E SIM", I.i14p, 425, 450, 465, 'esim'),
  // iPhone 14 Pro Max — E SIM
  ...g("iPhone 14 Pro Max 128 GB E SIM", I.i14p, 430, 450, 465, 'esim'),
  ...g("iPhone 14 Pro Max 256 GB E SIM", I.i14p, 475, 485, 500, 'esim'),
  ...g("iPhone 14 Pro Max 512 GB E SIM", I.i14p, 485, 495, 510, 'esim'),
  ...g("iPhone 14 Pro Max 1 TB E SIM", I.i14p, 495, 505, 520, 'esim'),
  // iPhone 14 Pro — Normal SIM
  ...g("iPhone 14 Pro 128 GB", I.i14p, 390, 405, 420, 'normal'),
  ...g("iPhone 14 Pro 256 GB", I.i14p, 420, 440, 460, 'normal'),
  // iPhone 14 Pro Max — Normal SIM
  ...g("iPhone 14 Pro Max 128 GB", I.i14p, 490, 510, 530, 'normal'),
  ...g("iPhone 14 Pro Max 256 GB", I.i14p, 520, 540, 560, 'normal'),
  ...g("iPhone 14 Pro Max 512 GB", I.i14p, 530, 550, 570, 'normal'),
  ...g("iPhone 14 Pro Max 1 TB", I.i14p, 550, 570, 590, 'normal'),
  // iPhone 15
  ...g("iPhone 15 128 GB", I.i15, 450, 470, 490, 'normal'),
  ...g("iPhone 15 256 GB", I.i15, 475, 495, 515, 'normal'),
  // iPhone 15 Pro
  ...g("iPhone 15 Pro 128 GB", I.i15p, 530, 550, 570, 'normal'),
  ...g("iPhone 15 Pro 256 GB", I.i15pB, 560, 580, 610, 'normal'),
  ...g("iPhone 15 Pro 512 GB", I.i15p, 575, 595, 615, 'normal'),
  ...g("iPhone 15 Pro 1 TB", I.i15p, 585, 605, 625, 'normal'),
  // iPhone 15 Pro Max — E SIM (first listing)
  ...g("iPhone 15 Pro Max 256 GB E SIM", I.i15pm, 565, 590, 610, 'esim'),
  ...g("iPhone 15 Pro Max 512 GB E SIM", I.i15pm, 585, 610, 630, 'esim'),
  ...g("iPhone 15 Pro Max 1 TB E SIM", I.i15pmB, 600, 625, 645, 'esim'),
  // iPhone 15 Pro Max — Normal SIM
  ...g("iPhone 15 Pro Max 256 GB", I.i15pm, 630, 650, 670, 'normal'),
  ...g("iPhone 15 Pro Max 512 GB", I.i15pm, 645, 665, 685, 'normal'),
  ...g("iPhone 15 Pro Max 1 TB", I.i15pmB, 660, 685, 700, 'normal'),
  // iPhone 16
  ...g("iPhone 16 128 GB", I.i16m, 550, 570, 590, 'normal'),
  ...g("iPhone 16 256 GB", I.i16m, 570, 590, 610, 'normal'),
  // iPhone 16 Pro
  ...g("iPhone 16 Pro 128 GB", I.i16, 650, 670, 690, 'normal'),
  ...g("iPhone 16 Pro 256 GB", I.i16, 670, 690, 710, 'normal'),
  ...g("iPhone 16 Pro 512 GB", I.i16, 685, 705, 720, 'normal'),
  ...g("iPhone 16 Pro 1 TB", I.i16, 710, 725, 740, 'normal'),
  // iPhone 16 Pro Max — E SIM (first listing)
  ...g("iPhone 16 Pro Max 256 GB E SIM", I.i16, 770, 795, 815, 'esim'),
  ...g("iPhone 16 Pro Max 512 GB E SIM", I.i16, 785, 810, 830, 'esim'),
  ...g("iPhone 16 Pro Max 1 TB E SIM", I.i16, 800, 825, 840, 'esim'),
  // iPhone 16 Pro Max — Normal SIM
  ...g("iPhone 16 Pro Max 256 GB", I.i16, 830, 850, 870, 'normal'),
  ...g("iPhone 16 Pro Max 512 GB", I.i16, 850, 870, 890, 'normal'),
  ...g("iPhone 16 Pro Max 1 TB", I.i16, 865, 885, 905, 'normal'),
  // Samsung Flip
  ...g("Samsung Flip 3 256 GB", I.sFlip3, 135, 145, 170, 'dual', 'samsung'),
  ...g("Samsung Flip 4 128 GB", I.sFlip4, 170, 180, 205, 'dual', 'samsung'),
  ...g("Samsung Flip 4 256 GB", I.sFlip4, 190, 200, 225, 'dual', 'samsung'),
  ...g("Samsung Flip 5 256 GB", I.sFlip5, 230, 240, 265, 'dual', 'samsung'),
  ...g("Samsung Flip 5 512 GB", I.sFlip5, 250, 260, 285, 'dual', 'samsung'),
  ...g("Samsung Flip 6 256 GB", I.sFlip6, 290, 300, 325, 'dual', 'samsung'),
  ...g("Samsung Flip 6 512 GB", I.sFlip6, 310, 320, 345, 'dual', 'samsung'),
  // Samsung Fold
  ...g("Samsung Fold 4 256 GB", I.sFold4, 305, 315, 345, 'dual', 'samsung'),
  ...g("Samsung Fold 4 512 GB", I.sFold4, 325, 335, 365, 'dual', 'samsung'),
  ...g("Samsung Fold 5 256 GB", I.sFold5, 430, 440, 470, 'dual', 'samsung'),
  ...g("Samsung Fold 6 256 GB", I.sFold6, 605, 615, 645, 'dual', 'samsung'),
  ...g("Samsung Fold 6 512 GB", I.sFold6, 625, 635, 665, 'dual', 'samsung'),
  ...g("Samsung Fold 6 1 TB", I.sFold6, 645, 655, 685, 'dual', 'samsung'),
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

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <CategoryChips />
        </motion.div>

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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.name + product.grade + index}
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

      <footer className="mt-16 border-t border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">{t('footer.rights', language)}</p>
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
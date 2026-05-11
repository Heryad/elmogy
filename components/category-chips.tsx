"use client"

import { motion } from "framer-motion"
import { useStore } from "@/lib/store-context"
import { t } from "@/lib/translations"

const brands = [
  { id: "all", key: "brand.all" },
  { id: "apple", key: "brand.apple" },
  { id: "samsung", key: "brand.samsung" },
]

const grades = [
  { id: "all", label: "All" },
  { id: "B",   label: "Grade B" },
  { id: "A",   label: "Grade A" },
  { id: "A+",  label: "Grade A+" },
]

function ChipRow({
  items,
  activeId,
  onSelect,
  layoutId,
  language,
}: {
  items: any[]
  activeId: string
  onSelect: (id: string) => void
  layoutId: string
  language: any
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {items.map((item) => {
        const isActive = activeId === item.id
        const label = item.key 
          ? t(item.key, language) 
          : item.labelKey 
          ? `${t(item.labelKey, language)} ${item.labelSuffix}`
          : item.label ?? item.name ?? item.id
          
        return (
          <motion.button
            key={item.id}
            onClick={() => onSelect(item.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`relative flex-shrink-0 px-4 py-2 rounded-full text-[11px] font-bold transition-all ${
              isActive
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "bg-secondary/50 text-secondary-foreground hover:bg-secondary border border-border/50"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 bg-primary rounded-full -z-0"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}

export function CategoryChips() {
  const { selectedCategory, setSelectedCategory, selectedGrade, setSelectedGrade, language } = useStore()

  return (
    <div className="flex flex-col gap-4">
      {/* Brand row */}
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground shrink-0 w-12">
          {t('home.brand', language)}
        </span>
        <ChipRow
          items={brands}
          activeId={selectedCategory ?? "all"}
          onSelect={(id) => setSelectedCategory(id === "all" ? null : id)}
          layoutId="activeBrandChip"
          language={language}
        />
      </div>

      {/* Grade row */}
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground shrink-0 w-12">
          Grade
        </span>
        <ChipRow
          items={grades}
          activeId={selectedGrade ?? "all"}
          onSelect={(id) => setSelectedGrade(id === "all" ? null : id)}
          layoutId="activeGradeChip"
          language={language}
        />
      </div>
    </div>
  )
}

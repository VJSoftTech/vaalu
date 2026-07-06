import { useEffect, useState } from 'react'
import { categoryService } from '@/services/categoryService'
import type { BookFilters, Category } from '@/types'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  filters: BookFilters
  onChange: (partial: Partial<BookFilters>) => void
}

export default function BookCategoryMenu({ filters, onChange }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const { t } = useLanguage()
  const s = t.sidebar

  useEffect(() => {
    categoryService.getAll()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
  }, [])

  if (categories.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-6">
      <button
        onClick={() => onChange({ category_id: undefined })}
        className={cn(
          'shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors',
          filters.category_id == null
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background text-muted-foreground border-border hover:bg-muted'
        )}
      >
        {s.allCategories}
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange({ category_id: cat.id })}
          className={cn(
            'shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors',
            filters.category_id === cat.id
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-muted-foreground border-border hover:bg-muted'
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}

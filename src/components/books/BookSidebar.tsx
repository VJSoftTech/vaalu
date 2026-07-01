import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, X, LayoutList, Menu } from 'lucide-react'
import { categoryService } from '@/services/categoryService'
import type { BookFilters, Category } from '@/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  open: boolean
  onClose: () => void
  filters: BookFilters
  onChange: (partial: Partial<BookFilters>) => void
  onClear: () => void
}

function Section({ title, children, defaultOpen = true }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b pb-4 mb-4">
      <button
        className="flex w-full items-center justify-between py-1 font-semibold text-sm uppercase tracking-wide"
        onClick={() => setOpen((o) => !o)}
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && <div className="mt-3 space-y-2.5">{children}</div>}
    </div>
  )
}

export function FilterIcon({ onClick, activeCount }: { onClick: () => void; activeCount: number }) {
  return (
    <button
      onClick={onClick}
      className="relative inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95"
      title="Filter by Category"
    >
      <Menu className="h-5 w-5" />
      {activeCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
          {activeCount}
        </span>
      )}
    </button>
  )
}

export default function BookSidebar({ open, onClose, filters, onChange, onClear }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const { t } = useLanguage()
  const s = t.sidebar

  useEffect(() => {
    categoryService.getAll()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
  }, [])

  const hasActiveFilters = filters.category_id != null

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Drawer from left */}
      <div className="relative w-72 max-w-[85vw] h-full bg-background shadow-2xl flex flex-col">
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <span className="font-bold text-base flex items-center gap-2">
            <LayoutList className="h-4 w-4" /> {s.categories}
          </span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 text-sm">
          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="mb-4 text-xs text-primary hover:underline flex items-center gap-1"
            >
              <X className="h-3 w-3" /> {s.clearFilter}
            </button>
          )}

          <Section title={s.category}>
            {categories.length === 0 ? (
              <p className="text-xs text-muted-foreground">{s.loading}</p>
            ) : (
              <>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category_id == null}
                    onChange={() => onChange({ category_id: undefined })}
                    className="accent-primary"
                  />
                  <span className={cn('text-sm', filters.category_id == null ? 'text-primary font-medium' : 'text-muted-foreground')}>
                    {s.allCategories}
                  </span>
                </label>
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category_id === cat.id}
                      onChange={() => onChange({ category_id: cat.id })}
                      className="accent-primary"
                    />
                    <span className={cn('text-sm', filters.category_id === cat.id ? 'text-primary font-medium' : 'text-muted-foreground')}>
                      {cat.name}
                    </span>
                  </label>
                ))}
              </>
            )}
          </Section>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t">
          <Button className="w-full" onClick={onClose}>
            {s.showResults}
          </Button>
        </div>
      </div>
    </div>
  )
}

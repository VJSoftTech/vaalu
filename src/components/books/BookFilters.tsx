import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { BookFilters } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  filters: BookFilters
  onChange: (filters: Partial<BookFilters>) => void
}

export default function BookFilters({ filters, onChange }: Props) {
  const { t } = useLanguage()
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={t.books.searchPlaceholder}
        className="pl-9"
        value={filters.search ?? ''}
        onChange={(e) => onChange({ search: e.target.value })}
      />
    </div>
  )
}

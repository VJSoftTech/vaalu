import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { BookFilters } from '@/types'

interface Props {
  filters: BookFilters
  onChange: (filters: Partial<BookFilters>) => void
}

export default function BookFilters({ filters, onChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search books..."
          className="pl-9"
          value={filters.search ?? ''}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </div>

      <Select
        value={filters.sort_by ?? 'created_at'}
        onValueChange={(v) => onChange({ sort_by: v as BookFilters['sort_by'] })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created_at">Newest</SelectItem>
          <SelectItem value="price">Price</SelectItem>
          <SelectItem value="rating">Rating</SelectItem>
          <SelectItem value="title">Title</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

import { useState } from 'react'
import { X, Users, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Author } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'

const PINNED_AUTHOR = 'மோ. கணேசன்'

interface Props {
  open: boolean
  onClose: () => void
  authors: Author[]
  searchValue: string
  onSearch: (v: string) => void
}

export function AuthorMenuIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95"
      title="Browse Authors"
    >
      <Menu className="h-5 w-5" />
    </button>
  )
}

export default function AuthorSidebar({ open, onClose, authors, searchValue, onSearch }: Props) {
  const [query, setQuery] = useState(searchValue)
  const { t } = useLanguage()
  const s = t.sidebar

  const handleSearch = (v: string) => {
    setQuery(v)
    onSearch(v)
  }

  const pinned = authors.find((a) => a.name === PINNED_AUTHOR)
  const rest = authors.filter((a) => a.name !== PINNED_AUTHOR)
  const ordered = pinned ? [pinned, ...rest] : rest

  const filtered = query.trim()
    ? ordered.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()))
    : ordered

  if (!open) return null

  return (
    <aside className="w-full sm:w-64 shrink-0 border rounded-lg bg-background shadow-sm flex flex-col mb-6 sm:mb-0 sm:sticky sm:top-24 sm:max-h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <span className="font-bold text-base flex items-center gap-2">
          <Users className="h-4 w-4" /> {s.authors}
        </span>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Search */}
      <div className="px-5 py-3 border-b">
        <Input
          placeholder={s.searchAuthors}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-8 text-sm"
        />
      </div>

      {/* Author list */}
      <div className="flex-1 overflow-y-auto py-2">
        {filtered.length === 0 ? (
          <p className="px-5 py-4 text-sm text-muted-foreground">{s.noAuthorsFound}</p>
        ) : (
          filtered.map((author, idx) => {
            const isPinned = author.name === PINNED_AUTHOR
            return (
              <Link
                key={author.id}
                to={`/authors/${author.id}`}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-5 py-2.5 hover:bg-muted transition-colors text-sm',
                  isPinned && 'bg-primary/5 border-l-2 border-primary',
                )}
              >
                <img
                  src={author.photo}
                  alt={author.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-muted"
                />
                <div className="min-w-0">
                  <p className={cn('font-medium truncate', isPinned && 'text-primary')}>
                    {author.name}
                  </p>
                  {isPinned && (
                    <p className="text-[10px] text-primary/70 leading-none mt-0.5">{s.featuredAuthor}</p>
                  )}
                  {author.books_count != null && !isPinned && (
                    <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
                      {author.books_count} {s.books}
                    </p>
                  )}
                </div>
                {idx === 0 && isPinned && (
                  <span className="ml-auto text-[10px] font-semibold bg-primary text-primary-foreground px-1.5 py-0.5 rounded shrink-0">
                    #1
                  </span>
                )}
              </Link>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t">
        <Button variant="outline" className="w-full" onClick={onClose}>
          {s.close}
        </Button>
      </div>
    </aside>
  )
}

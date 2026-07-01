import { useEffect, useState, useMemo } from 'react'
import { authorService } from '@/services/authorService'
import type { Author } from '@/types'
import AuthorCard from '@/components/authors/AuthorCard'
import AuthorSidebar, { AuthorMenuIcon } from '@/components/authors/AuthorSidebar'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useLanguage } from '@/contexts/LanguageContext'

const PINNED_AUTHOR = 'மோ. கணேசன்'

function pinnedFirst(authors: Author[]): Author[] {
  const pinned = authors.find((a) => a.name === PINNED_AUTHOR)
  const rest = authors.filter((a) => a.name !== PINNED_AUTHOR)
  return pinned ? [pinned, ...rest] : rest
}

export default function Authors() {
  const { t } = useLanguage()
  const a = t.authors
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    authorService.getAll()
      .then((res) => setAuthors(pinnedFirst(res.data ?? [])))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const displayedAuthors = useMemo(() => {
    if (!search.trim()) return authors
    const q = search.toLowerCase()
    const filtered = authors.filter((a) => a.name.toLowerCase().includes(q))
    return pinnedFirst(filtered)
  }, [authors, search])

  return (
    <div className="container py-8">
      {/* Title row */}
      <div className="flex items-center gap-3 mb-6">
        <AuthorMenuIcon onClick={() => setSidebarOpen(true)} />
        <h1 className="text-3xl font-bold">{a.pageTitle}</h1>
      </div>

      {/* Author menu drawer */}
      <AuthorSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        authors={authors}
        searchValue={search}
        onSearch={setSearch}
      />

      {/* Grid */}
      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : displayedAuthors.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">{a.noAuthors}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {displayedAuthors.map((author, idx) => (
            <div key={author.id} className="relative">
              {idx === 0 && author.name === PINNED_AUTHOR && (
                <span className="absolute -top-1.5 -left-1.5 z-10 text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded shadow">
                  #1
                </span>
              )}
              <AuthorCard author={author} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Book, BookFilters } from '@/types'
import { bookService } from '@/services/bookService'
import BookCard from '@/components/books/BookCard'
import BookFiltersBar from '@/components/books/BookFilters'
import BookSidebar, { FilterIcon } from '@/components/books/BookSidebar'
import BookCategoryMenu from '@/components/books/BookCategoryMenu'
import BookPageLoader from '@/components/common/BookPageLoader'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'
import { ITEMS_PER_PAGE } from '@/utils/constants'
import { useLanguage } from '@/contexts/LanguageContext'

const DEFAULT_FILTERS: BookFilters = {
  page: 1,
  limit: ITEMS_PER_PAGE,
  sort_by: 'created_at',
  sort_order: 'desc',
}

export default function Books() {
  const { t } = useLanguage()
  const b = t.books
  const [searchParams] = useSearchParams()
  const [books, setBooks] = useState<Book[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filters, setFilters] = useState<BookFilters>(() => ({
    ...DEFAULT_FILTERS,
    search: searchParams.get('search') ?? undefined,
  }))

  useEffect(() => {
    const urlSearch = searchParams.get('search') ?? undefined
    setFilters((f) => ({ ...f, search: urlSearch, page: 1 }))
  }, [searchParams])

  const debouncedSearch = useDebounce(filters.search, 400)

  const fetchBooks = useCallback(() => {
    setLoading(true)
    setError(null)
    bookService
      .getAll({ ...filters, search: debouncedSearch })
      .then((res) => { setBooks(res.data ?? []); setTotal(res.total ?? 0); setTotalPages(res.total_pages ?? 1) })
      .catch((err) => {
        setError(err?.response?.data?.message ?? err?.message ?? b.failedToLoad)
        setBooks([])
      })
      .finally(() => setLoading(false))
  }, [filters, debouncedSearch])

  useEffect(() => { fetchBooks() }, [fetchBooks])

  const updateFilters = (partial: Partial<BookFilters>) =>
    setFilters((f) => ({ ...f, ...partial, page: 1 }))

  const goToPage = (page: number) =>
    setFilters((f) => ({ ...f, page }))

  const clearFilters = () =>
    setFilters((f) => ({ ...DEFAULT_FILTERS, search: f.search }))

  const activeFilterCount = filters.category_id != null ? 1 : 0

  const currentPage = filters.page ?? 1

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Title row */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <FilterIcon onClick={() => setSidebarOpen(true)} activeCount={activeFilterCount} />
            <h1 className="text-3xl font-bold">{b.pageTitle}</h1>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">{total} {b.booksAvailable}</p>
        </div>
        {/* Search bar */}
        <div className="w-64 hidden sm:block">
          <BookFiltersBar filters={filters} onChange={updateFilters} />
        </div>
      </div>

      {/* Mobile search */}
      <div className="sm:hidden mb-4">
        <BookFiltersBar filters={filters} onChange={updateFilters} />
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Category sidebar */}
        <BookSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          filters={filters}
          onChange={updateFilters}
          onClear={clearFilters}
        />

        <div className="flex-1 min-w-0">
          {/* Horizontal category menu */}
          <BookCategoryMenu filters={filters} onChange={updateFilters} />

          {/* Book grid */}
          {loading ? (
            <BookPageLoader className="py-16" />
          ) : error ? (
            <div className="text-center py-16 text-destructive">{error}</div>
          ) : books.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">{b.noBooks}</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={currentPage <= 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                {b.previous}
              </Button>
              <span className="text-sm text-muted-foreground">
                {b.page} {currentPage} {b.of} {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage >= totalPages}
                onClick={() => goToPage(currentPage + 1)}
              >
                {b.next}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

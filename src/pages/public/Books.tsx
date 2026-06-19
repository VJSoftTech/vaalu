import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Book, BookFilters } from '@/types'
import { bookService } from '@/services/bookService'
import BookCard from '@/components/books/BookCard'
import BookFiltersBar from '@/components/books/BookFilters'
import BookPageLoader from '@/components/common/BookPageLoader'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'
import { ITEMS_PER_PAGE } from '@/utils/constants'

export default function Books() {
  const [searchParams] = useSearchParams()
  const [books, setBooks] = useState<Book[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<BookFilters>(() => ({
    page: 1,
    limit: ITEMS_PER_PAGE,
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
      .then((res) => {
        setBooks(res.data ?? [])
        setTotal(res.total ?? 0)
      })
      .catch((err) => {
        setError(err?.response?.data?.message ?? err?.message ?? 'Failed to load books')
        setBooks([])
      })
      .finally(() => setLoading(false))
  }, [filters, debouncedSearch])

  useEffect(() => { fetchBooks() }, [fetchBooks])

  const updateFilters = (partial: Partial<BookFilters>) =>
    setFilters((f) => ({ ...f, ...partial, page: 1 }))

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Books</h1>
        <p className="text-muted-foreground mt-1">{total} books available</p>
      </div>

      <BookFiltersBar filters={filters} onChange={updateFilters} />

      {loading ? (
        <BookPageLoader className="py-16" />
      ) : error ? (
        <div className="text-center py-16 text-destructive">{error}</div>
      ) : books.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No books found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {total > ITEMS_PER_PAGE && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={(filters.page ?? 1) <= 1}
            onClick={() => updateFilters({ page: (filters.page ?? 1) - 1 })}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={(filters.page ?? 1) * ITEMS_PER_PAGE >= total}
            onClick={() => updateFilters({ page: (filters.page ?? 1) + 1 })}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

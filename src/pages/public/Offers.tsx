import { useEffect, useState } from 'react'
import { Tag } from 'lucide-react'
import { bookService } from '@/services/bookService'
import type { Book } from '@/types'
import BookCard from '@/components/books/BookCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function Offers() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bookService.getAll({ limit: 24, sort_by: 'price', sort_order: 'asc' })
      .then((res) => setBooks(res.data.filter((b) => b.discount_price && b.discount_price < b.price)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Tag className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Special Offers</h1>
          <p className="text-sm text-muted-foreground">Discounted books — limited time only!</p>
        </div>
      </div>
      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : books.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No offers available right now. Check back soon!</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {books.map((book) => <BookCard key={book.id} book={book} />)}
        </div>
      )}
    </div>
  )
}

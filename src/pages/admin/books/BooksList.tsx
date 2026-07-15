import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { bookService } from '@/services/bookService'
import type { Book } from '@/types'
import PageTitle from '@/components/common/PageTitle'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/formatters'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

export default function BooksList() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  const loadBooks = () => {
    setLoading(true)
    bookService.getAll().then((res) => setBooks(res.data)).finally(() => setLoading(false))
  }

  useEffect(() => { loadBooks() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this book?')) return
    await bookService.delete(id)
    loadBooks()
  }

  return (
    <div>
      <PageTitle
        title="Books"
        action={
          <Link to="/admin/books/add">
            <Button><Plus className="h-4 w-4 mr-1" /> Add Book</Button>
          </Link>
        }
      />
      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">S.No.</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book, index) => (
                <TableRow key={book.id}>
                  <TableCell className="text-sm text-muted-foreground">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={book.cover_image} alt={book.title} className="w-8 h-10 object-cover rounded" />
                      <span className="font-medium text-sm line-clamp-1">{book.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{book.author_name}</TableCell>
                  <TableCell className="text-sm">{formatCurrency(book.discount_price ?? book.price)}</TableCell>
                  <TableCell className="text-sm">{book.stock_quantity}</TableCell>
                  <TableCell className="text-sm">{book.rating != null ? Number(book.rating).toFixed(1) : '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link to={`/admin/books/${book.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(book.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

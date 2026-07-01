import { useEffect, useState } from 'react'
import { reportService, type PopularBook } from '@/services/reportService'
import PageTitle from '@/components/common/PageTitle'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { formatCurrency } from '@/utils/formatters'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const rankStyles = [
  'bg-amber-100 text-amber-700',
  'bg-slate-200 text-slate-600',
  'bg-orange-100 text-orange-700',
]

export default function PopularBooks() {
  const [books, setBooks] = useState<PopularBook[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reportService.getPopularBooks()
      .then((res) => setBooks(Array.isArray(res) ? res : []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageTitle title="Popular Books" />
      {loading ? <LoadingSpinner className="py-16" /> : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Book</TableHead>
                  <TableHead>Total Sold</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book, i) => (
                  <TableRow key={book.id}>
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                          i < 3 ? rankStyles[i] : 'text-muted-foreground',
                        )}
                      >
                        {i + 1}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={book.cover_image} alt={book.title} className="w-8 h-10 object-cover rounded" />
                        <span className="font-medium text-sm">{book.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{book.total_sold}</TableCell>
                    <TableCell className="font-medium text-emerald-600">{formatCurrency(book.revenue)}</TableCell>
                  </TableRow>
                ))}
                {!loading && books.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No book sales recorded yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

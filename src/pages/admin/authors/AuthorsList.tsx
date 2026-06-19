import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { authorService } from '@/services/authorService'
import type { Author } from '@/types'
import PageTitle from '@/components/common/PageTitle'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function AuthorsList() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    authorService.getAll().then((r) => setAuthors(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this author?')) return
    await authorService.delete(id)
    load()
  }

  return (
    <div>
      <PageTitle
        title="Authors"
        action={<Link to="/admin/authors/add"><Button><Plus className="h-4 w-4 mr-1" /> Add Author</Button></Link>}
      />
      {loading ? <LoadingSpinner className="py-16" /> : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Books</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authors.map((author) => (
                <TableRow key={author.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={author.photo} alt={author.name} className="w-8 h-8 rounded-full object-cover" />
                      <span className="font-medium">{author.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{author.books_count ?? 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link to={`/admin/authors/${author.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(author.id)}>
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

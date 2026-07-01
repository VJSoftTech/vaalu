import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Megaphone } from 'lucide-react'
import { announcementService } from '@/services/announcementService'
import type { Announcement } from '@/types'
import PageTitle from '@/components/common/PageTitle'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/utils/formatters'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const PRIORITY_COLORS: Record<string, string> = {
  urgent:    'bg-red-100 text-red-800',
  important: 'bg-amber-100 text-amber-800',
  normal:    'bg-blue-100 text-blue-800',
}

export default function AnnouncementsList() {
  const [items, setItems] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    announcementService.getAll().then((r) => setItems(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this announcement?')) return
    await announcementService.delete(id)
    load()
  }

  return (
    <div>
      <PageTitle
        title="Announcements"
        action={
          <Link to="/admin/announcements/add">
            <Button><Plus className="h-4 w-4 mr-1" /> Add Announcement</Button>
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
                <TableHead>Announcement</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-16 h-9 object-cover rounded border" />
                      ) : (
                        <div className="w-16 h-9 rounded border bg-muted flex items-center justify-center">
                          <Megaphone className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[220px]">{item.message}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${PRIORITY_COLORS[item.priority] ?? 'bg-gray-100 text-gray-700'}`}>
                      {item.priority}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.start_date || item.end_date ? `${formatDate(item.start_date)} – ${formatDate(item.end_date)}` : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.is_active ? 'default' : 'secondary'}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(item.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link to={`/admin/announcements/${item.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No announcements yet. Add your first one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

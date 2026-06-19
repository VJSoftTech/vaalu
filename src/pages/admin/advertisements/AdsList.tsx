import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { advertisementService } from '@/services/advertisementService'
import type { Advertisement } from '@/types'
import PageTitle from '@/components/common/PageTitle'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/utils/formatters'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function AdsList() {
  const [ads, setAds] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    advertisementService.getAll().then((r) => setAds(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this ad?')) return
    await advertisementService.delete(id)
    load()
  }

  return (
    <div>
      <PageTitle
        title="Advertisements"
        action={<Link to="/admin/advertisements/add"><Button><Plus className="h-4 w-4 mr-1" /> Add Ad</Button></Link>}
      />
      {loading ? <LoadingSpinner className="py-16" /> : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={ad.banner_image} alt={ad.title} className="w-14 h-8 object-cover rounded" />
                      <span className="font-medium text-sm">{ad.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(ad.start_date)} – {formatDate(ad.end_date)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={ad.is_active ? 'default' : 'secondary'}>
                      {ad.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link to={`/admin/advertisements/${ad.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(ad.id)}>
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

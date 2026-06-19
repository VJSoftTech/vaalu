import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { videoService } from '@/services/videoService'
import type { Video } from '@/types'
import PageTitle from '@/components/common/PageTitle'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function VideosList() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    videoService.getAll().then((r) => setVideos(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this video?')) return
    await videoService.delete(id)
    load()
  }

  return (
    <div>
      <PageTitle
        title="Vaalu TV"
        action={<Link to="/admin/vaalu-tv/add"><Button><Plus className="h-4 w-4 mr-1" /> Add Video</Button></Link>}
      />
      {loading ? <LoadingSpinner className="py-16" /> : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Video</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={v.thumbnail} alt={v.title} className="w-14 h-8 object-cover rounded" />
                      <span className="text-sm font-medium line-clamp-1 max-w-xs">{v.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{v.duration}</TableCell>
                  <TableCell className="text-sm">{v.category ?? '—'}</TableCell>
                  <TableCell>{v.is_featured && <Badge variant="secondary">Featured</Badge>}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link to={`/admin/vaalu-tv/${v.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(v.id)}>
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

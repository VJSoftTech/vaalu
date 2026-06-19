import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Star, TrendingUp, Eye, EyeOff } from 'lucide-react'
import { giftService } from '@/services/giftService'
import type { GiftItem } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/useToast'

export default function GiftsList() {
  const [gifts, setGifts] = useState<GiftItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const load = () => {
    setLoading(true)
    giftService.getAll({ limit: 100 })
      .then((r) => setGifts(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      await giftService.delete(id)
      toast({ title: 'Gift deleted' })
      load()
    } catch {
      toast({ title: 'Failed to delete', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gift Currency & Calendar Gifts</h1>
          <p className="text-muted-foreground text-sm">Manage all gift products</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/gifts/enquiries">
            <Button variant="outline">View Enquiries</Button>
          </Link>
          <Link to="/admin/gifts/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Gift
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground">Loading…</div>
      ) : gifts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 gap-3 text-muted-foreground border rounded-xl">
          <p>No gifts yet.</p>
          <Link to="/admin/gifts/add"><Button size="sm">Add First Gift</Button></Link>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gift</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gifts.map((gift) => (
                <TableRow key={gift.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {gift.cover_image ? (
                        <img
                          src={gift.cover_image}
                          alt={gift.title}
                          className="h-12 w-12 rounded-lg object-cover border shrink-0"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0 text-xl">
                          🎁
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-sm leading-tight">{gift.title}</div>
                        <div className="text-xs text-muted-foreground">{gift.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{gift.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {gift.is_featured && (
                        <Badge className="text-[10px] px-1.5 py-0 bg-yellow-100 text-yellow-800 border-yellow-200 gap-0.5">
                          <Star className="h-2.5 w-2.5" /> Featured
                        </Badge>
                      )}
                      {gift.is_trending && (
                        <Badge className="text-[10px] px-1.5 py-0 bg-orange-100 text-orange-800 border-orange-200 gap-0.5">
                          <TrendingUp className="h-2.5 w-2.5" /> Trending
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={gift.is_active ? 'default' : 'secondary'}
                      className="gap-1 text-xs"
                    >
                      {gift.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {gift.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/admin/gifts/${gift.id}/edit`}>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(gift.id, gift.title)}
                      >
                        <Trash2 className="h-4 w-4" />
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

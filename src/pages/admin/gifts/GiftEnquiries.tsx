import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { giftService } from '@/services/giftService'
import type { GiftEnquiry } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate } from '@/utils/formatters'

export default function GiftEnquiries() {
  const [enquiries, setEnquiries] = useState<GiftEnquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    giftService.getEnquiries()
      .then((r) => setEnquiries(r.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link to="/admin/gifts">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Gift Enquiries</h1>
          <p className="text-muted-foreground text-sm">Customer enquiries for gift products</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground">Loading…</div>
      ) : enquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground border rounded-xl">
          <MessageSquare className="h-8 w-8 opacity-30" />
          <p>No enquiries yet.</p>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Gift</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enquiries.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.customer_name}</TableCell>
                  <TableCell>
                    <div className="text-sm">{e.phone_number}</div>
                    {e.email && <div className="text-xs text-muted-foreground">{e.email}</div>}
                  </TableCell>
                  <TableCell>
                    {e.gift_title ? (
                      <Badge variant="outline" className="text-xs">{e.gift_title}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">General</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm truncate">{e.message || '—'}</p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={e.status === 'new' ? 'default' : 'secondary'}
                      className="capitalize text-xs"
                    >
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(e.created_at)}
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

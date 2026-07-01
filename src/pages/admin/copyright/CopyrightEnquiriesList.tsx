import { useEffect, useState } from 'react'
import { Copyright } from 'lucide-react'
import { copyrightService } from '@/services/copyrightService'
import type { CopyrightEnquiry } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate } from '@/utils/formatters'

export default function CopyrightEnquiriesList() {
  const [enquiries, setEnquiries] = useState<CopyrightEnquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    copyrightService.getAll()
      .then((r) => setEnquiries(r.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Copyright Enquiries</h1>
        <p className="text-muted-foreground text-sm">Translation, reprint, and adaptation rights enquiries submitted via the Copyright Enquiries page</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground">Loading…</div>
      ) : enquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground border rounded-xl">
          <Copyright className="h-8 w-8 opacity-30" />
          <p>No copyright enquiries yet.</p>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enquiries.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.applicant_name}</TableCell>
                  <TableCell>
                    <div className="text-sm">{e.phone_number}</div>
                    {e.email && <div className="text-xs text-muted-foreground">{e.email}</div>}
                  </TableCell>
                  <TableCell>
                    {e.book_title ? (
                      <Badge variant="outline" className="text-xs">{e.book_title}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{e.enquiry_type}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm truncate">{e.comments || '—'}</p>
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

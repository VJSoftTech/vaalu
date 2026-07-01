import { useEffect, useState } from 'react'
import { Building2 } from 'lucide-react'
import { corporateService } from '@/services/corporateService'
import type { CorporateEnquiry } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate } from '@/utils/formatters'

export default function CorporateEnquiriesList() {
  const [enquiries, setEnquiries] = useState<CorporateEnquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    corporateService.getAll()
      .then((r) => setEnquiries(r.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Corporate Enquiries</h1>
        <p className="text-muted-foreground text-sm">Bulk order and book fair enquiries submitted via the Corporate Enquiries page</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground">Loading…</div>
      ) : enquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground border rounded-xl">
          <Building2 className="h-8 w-8 opacity-30" />
          <p>No corporate enquiries yet.</p>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Best Time to Call</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enquiries.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.company_name}</TableCell>
                  <TableCell>{e.contact_person_name}</TableCell>
                  <TableCell>
                    <div className="text-sm">{e.phone_number}</div>
                    {e.email && <div className="text-xs text-muted-foreground">{e.email}</div>}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{e.enquiry_type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{e.best_time_to_call || '—'}</TableCell>
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

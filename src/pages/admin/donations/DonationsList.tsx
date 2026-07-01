import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { donationService } from '@/services/donationService'
import type { BookDonation } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate } from '@/utils/formatters'

export default function DonationsList() {
  const [donations, setDonations] = useState<BookDonation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    donationService.getAll()
      .then((r) => setDonations(r.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Book Donations</h1>
        <p className="text-muted-foreground text-sm">Donation requests submitted via the Donate Books page</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground">Loading…</div>
      ) : donations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground border rounded-xl">
          <Heart className="h-8 w-8 opacity-30" />
          <p>No donation requests yet.</p>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Best Time to Call</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">{d.phone_number}</div>
                    {d.email && <div className="text-xs text-muted-foreground">{d.email}</div>}
                  </TableCell>
                  <TableCell className="text-sm">{d.best_time_to_call || '—'}</TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm truncate">{d.comments || '—'}</p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={d.status === 'new' ? 'default' : 'secondary'}
                      className="capitalize text-xs"
                    >
                      {d.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(d.created_at)}
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

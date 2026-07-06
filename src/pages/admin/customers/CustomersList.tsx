import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Pencil, Trash2, Plus } from 'lucide-react'
import { customerService } from '@/services/customerService'
import type { Customer } from '@/types'
import PageTitle from '@/components/common/PageTitle'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/formatters'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/hooks/useToast'

export default function CustomersList() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    customerService.getAll().then((r) => setCustomers(r.data)).finally(() => setLoading(false))
  }, [])

  const handleDelete = async (c: Customer) => {
    if (!confirm(`Delete customer "${c.name}"? This will also remove their login access. This cannot be undone.`)) return
    try {
      await customerService.remove(c.id)
      setCustomers((prev) => prev.filter((x) => x.id !== c.id))
      toast({ title: 'Customer deleted' })
    } catch (err: any) {
      toast({ title: err?.response?.data?.message ?? 'Failed to delete customer', variant: 'destructive' })
    }
  }

  return (
    <div>
      <PageTitle
        title="Customers"
        action={
          <Link to="/admin/customers/add">
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Customer</Button>
          </Link>
        }
      />
      {loading ? <LoadingSpinner className="py-16" /> : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.email}</TableCell>
                  <TableCell className="text-sm">{c.mobile_number}</TableCell>
                  <TableCell className="text-sm">{c.orders_count ?? 0}</TableCell>
                  <TableCell className="text-sm">{formatCurrency(c.total_spent ?? 0)}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Link to={`/admin/customers/${c.id}`}>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                    </Link>
                    <Link to={`/admin/customers/${c.id}/edit`}>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(c)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {customers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No customers found
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

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { userService } from '@/services/userService'
import type { User } from '@/types'
import PageTitle from '@/components/common/PageTitle'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/hooks/useToast'

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const load = () =>
    userService.getAll().then((r) => setUsers(r.data)).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleDelete = async (u: User) => {
    if (!confirm(`Delete user "${u.name}"? This cannot be undone.`)) return
    try {
      await userService.remove(u.id)
      setUsers((prev) => prev.filter((x) => x.id !== u.id))
      toast({ title: 'User deleted' })
    } catch {
      toast({ title: 'Failed to delete user', variant: 'destructive' })
    }
  }

  const handleToggle = async (u: User) => {
    try {
      const updated = await userService.toggleActive(u.id, !u.is_active)
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, is_active: updated.is_active } : x)))
      toast({ title: updated.is_active ? 'User activated' : 'User deactivated' })
    } catch {
      toast({ title: 'Failed to update user', variant: 'destructive' })
    }
  }

  return (
    <div>
      <PageTitle
        title="Staff & Admin Users"
        action={
          <Link to="/admin/users/add">
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add User</Button>
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <Badge variant={u.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.is_active ? 'default' : 'outline'}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(u.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      title={u.is_active ? 'Deactivate' : 'Activate'}
                      onClick={() => handleToggle(u)}
                    >
                      {u.is_active
                        ? <ToggleRight className="h-3.5 w-3.5 text-green-600" />
                        : <ToggleLeft className="h-3.5 w-3.5 text-muted-foreground" />}
                    </Button>
                    <Link to={`/admin/users/${u.id}/edit`}>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(u)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No users found
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

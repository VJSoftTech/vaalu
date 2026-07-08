import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react'
import { categoryService } from '@/services/categoryService'
import type { Category } from '@/types'
import PageTitle from '@/components/common/PageTitle'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface RowForm { name: string; slug: string }

const toSlug = (name: string) =>
  name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

export default function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]       = useState(true)

  // new row form
  const [adding, setAdding]         = useState(false)
  const [newForm, setNewForm]       = useState<RowForm>({ name: '', slug: '' })
  const [newSaving, setNewSaving]   = useState(false)

  // inline edit
  const [editId, setEditId]         = useState<number | null>(null)
  const [editForm, setEditForm]     = useState<RowForm>({ name: '', slug: '' })
  const [editSaving, setEditSaving] = useState(false)

  const load = () => {
    setLoading(true)
    categoryService.getAll().then(setCategories).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  // ── Add ──────────────────────────────────────────────────────
  const handleNewNameChange = (name: string) =>
    setNewForm({ name, slug: toSlug(name) })

  const submitAdd = async () => {
    if (!newForm.name.trim() || !newForm.slug.trim()) return
    setNewSaving(true)
    try {
      await categoryService.create(newForm)
      setNewForm({ name: '', slug: '' })
      setAdding(false)
      load()
    } finally { setNewSaving(false) }
  }

  // ── Edit ─────────────────────────────────────────────────────
  const startEdit = (cat: Category) => {
    setEditId(cat.id)
    setEditForm({ name: cat.name, slug: cat.slug })
  }

  const handleEditNameChange = (name: string) =>
    setEditForm({ name, slug: toSlug(name) })

  const submitEdit = async () => {
    if (!editId || !editForm.name.trim()) return
    setEditSaving(true)
    try {
      await categoryService.update(editId, editForm)
      setEditId(null)
      load()
    } finally { setEditSaving(false) }
  }

  const cancelEdit = () => setEditId(null)

  // ── Delete ───────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return
    await categoryService.delete(id)
    load()
  }

  return (
    <div>
      <PageTitle
        title="Categories"
        action={
          !adding && (
            <Button onClick={() => setAdding(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add Category
            </Button>
          )
        }
      />

      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Name <span className="text-red-500">*</span></TableHead>
                <TableHead>Slug <span className="text-red-500">*</span></TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Add row */}
              {adding && (
                <TableRow className="bg-muted/30">
                  <TableCell className="text-muted-foreground text-xs">New</TableCell>
                  <TableCell>
                    <Input
                      autoFocus
                      placeholder="Category name"
                      value={newForm.name}
                      onChange={(e) => handleNewNameChange(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && submitAdd()}
                      className="h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="slug"
                      value={newForm.slug}
                      onChange={(e) => setNewForm((f) => ({ ...f, slug: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && submitAdd()}
                      className="h-8 text-sm font-mono"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" className="h-7 w-7" onClick={submitAdd} disabled={newSaving}>
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => { setAdding(false); setNewForm({ name: '', slug: '' }) }}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {categories.length === 0 && !adding && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-12">
                    No categories yet. Click "Add Category" to create one.
                  </TableCell>
                </TableRow>
              )}

              {categories.map((cat, i) => (
                <TableRow key={cat.id}>
                  <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>

                  {editId === cat.id ? (
                    <>
                      <TableCell>
                        <Input
                          autoFocus
                          value={editForm.name}
                          onChange={(e) => handleEditNameChange(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && submitEdit()}
                          className="h-8 text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm.slug}
                          onChange={(e) => setEditForm((f) => ({ ...f, slug: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && submitEdit()}
                          className="h-8 text-sm font-mono"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" className="h-7 w-7" onClick={submitEdit} disabled={editSaving}>
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="outline" className="h-7 w-7" onClick={cancelEdit}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-medium">{cat.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground font-mono">{cat.slug}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(cat)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(cat.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, X, ChevronUp, ChevronDown } from 'lucide-react'
import { bookSchema } from '@/utils/validators'
import { bookService } from '@/services/bookService'
import { authorService } from '@/services/authorService'
import { categoryService } from '@/services/categoryService'
import { toast } from '@/hooks/useToast'
import type { BookFormData } from '@/types'
import type { Author, Category } from '@/types'
import PageTitle from '@/components/common/PageTitle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function AddBook() {
  const navigate = useNavigate()
  const [authors, setAuthors] = useState<Author[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState('')
  const [coAuthorIds, setCoAuthorIds] = useState<number[]>([])
  const [editorNames, setEditorNames] = useState<string[]>([''])
  const [titleWarning, setTitleWarning] = useState('')

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
  })

  const primaryAuthorId = watch('author_id')

  useEffect(() => {
    authorService.getAll({ limit: 100 }).then((r) => setAuthors(r.data)).catch(() => {})
    categoryService.getAll().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    setValue('co_author_ids', coAuthorIds)
  }, [coAuthorIds, setValue])

  useEffect(() => {
    setValue('editor_names', editorNames.filter((n) => n.trim() !== ''))
  }, [editorNames, setValue])

  const addEditor = () => {
    if (editorNames.length >= 10) return
    setEditorNames((prev) => [...prev, ''])
  }
  const removeEditor = (idx: number) => setEditorNames((prev) => prev.filter((_, i) => i !== idx))
  const updateEditor = (idx: number, value: string) =>
    setEditorNames((prev) => prev.map((v, i) => (i === idx ? value : v)))
  const moveEditor = (idx: number, dir: -1 | 1) =>
    setEditorNames((prev) => {
      const target = idx + dir
      if (target < 1 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[idx], next[target]] = [next[target], next[idx]]
      return next
    })

  const checkDuplicateTitle = async (title: string) => {
    const trimmed = title.trim()
    if (!trimmed) { setTitleWarning(''); return }
    try {
      const res = await bookService.getAll({ search: trimmed, limit: 50 })
      const dup = res.data.some((b) => b.title.trim().toLowerCase() === trimmed.toLowerCase())
      setTitleWarning(dup ? 'A book with this title already exists. Please use a different title.' : '')
    } catch {
      // ignore lookup errors; server-side check still applies on save
    }
  }

  const addCoAuthor = () => {
    if (1 + coAuthorIds.length >= 10) return
    setCoAuthorIds((prev) => [...prev, 0])
  }
  const removeCoAuthor = (idx: number) => setCoAuthorIds((prev) => prev.filter((_, i) => i !== idx))
  const updateCoAuthor = (idx: number, value: number) =>
    setCoAuthorIds((prev) => prev.map((v, i) => (i === idx ? value : v)))
  const moveCoAuthor = (idx: number, dir: -1 | 1) =>
    setCoAuthorIds((prev) => {
      const target = idx + dir
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[idx], next[target]] = [next[target], next[idx]]
      return next
    })
  const availableAuthorsFor = (idx: number) => {
    const chosenElsewhere = new Set(coAuthorIds.filter((_, i) => i !== idx))
    if (primaryAuthorId) chosenElsewhere.add(primaryAuthorId)
    return authors.filter((a) => a.id === coAuthorIds[idx] || !chosenElsewhere.has(a.id))
  }

  const submitForm = async (data: BookFormData, force: boolean) => {
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, String(v))
    })
    if (coverFile) fd.append('cover_image', coverFile)
    if (force) fd.append('allow_duplicate', 'true')
    try {
      await bookService.create(fd)
      toast({ title: 'Book added successfully' })
      navigate('/admin/books')
    } catch (err) {
      const status = (err as { response?: { status?: number; data?: { message?: string } } }).response?.status
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message
      if (status === 409 && !force) {
        if (window.confirm(`${message || 'A book with this title already exists.'} Save anyway?`)) {
          return submitForm(data, true)
        }
        return
      }
      toast({ title: message || 'Failed to add book', variant: 'destructive' })
    }
  }

  const onSubmit = (data: BookFormData) => submitForm(data, false)

  const titleField = register('title')

  const textFields = [
    { id: 'subtitle', label: 'Subtitle', type: 'text', required: false },
    { id: 'isbn', label: 'ISBN', type: 'text', required: true, placeholder: '978-81-985419-6-3' },
    { id: 'publisher', label: 'Publisher Name', type: 'text', required: false },
    { id: 'publisher_serial_number', label: 'Publisher Book Serial Number', type: 'text', required: false },
    { id: 'total_pages', label: 'Total Number of Pages', type: 'number', required: false },
    { id: 'publication_year', label: 'Publication Year', type: 'number', required: false },
    { id: 'edition', label: 'Edition', type: 'text', required: false },
    { id: 'price', label: 'Price (₹)', type: 'number', required: true },
    { id: 'discount_price', label: 'Discount Price (₹)', type: 'number', required: false },
    { id: 'stock_quantity', label: 'Stock Quantity', type: 'number', required: true },
    { id: 'rating', label: 'Rating (0–5)', type: 'number', required: false },
  ]

  return (
    <div>
      <PageTitle title="Add Book" />
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 items-start">
            <div className="space-y-1">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                {...titleField}
                onBlur={(e) => {
                  titleField.onBlur(e)
                  checkDuplicateTitle(e.target.value)
                }}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
              {!errors.title && titleWarning && <p className="text-xs text-amber-600">{titleWarning}</p>}
            </div>

            {textFields.map(({ id, label, type, required, placeholder }) => (
              <div key={id} className="space-y-1">
                <Label htmlFor={id}>
                  {label} {required && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id={id}
                  type={type}
                  placeholder={placeholder}
                  step={id === 'rating' ? '0.1' : undefined}
                  min={id === 'rating' ? '0' : undefined}
                  max={id === 'rating' ? '5' : undefined}
                  {...register(
                    id as keyof BookFormData,
                    type === 'number' ? { setValueAs: (v) => (v === '' ? undefined : Number(v)) } : {}
                  )}
                />
                {errors[id as keyof BookFormData] && (
                  <p className="text-xs text-destructive">{errors[id as keyof BookFormData]?.message}</p>
                )}
              </div>
            ))}

            <div className="space-y-1">
              <Label>Author</Label>
              <Controller
                name="author_id"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(v) => field.onChange(Number(v))}
                    value={field.value ? String(field.value) : ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map((a) => (
                        <SelectItem key={a.id} value={String(a.id)}>
                          {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.author_id && <p className="text-xs text-destructive">{errors.author_id.message}</p>}
            </div>

            <div className="space-y-1">
              <Label>Book Print Type</Label>
              <Controller
                name="print_type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select print type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Black & White">Black & White</SelectItem>
                      <SelectItem value="Color">Color</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1 sm:col-span-2 lg:col-span-3">
              <Label>Co-Authors</Label>
              <div className="space-y-2">
                {coAuthorIds.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Select
                      onValueChange={(v) => updateCoAuthor(idx, Number(v))}
                      value={val ? String(val) : ''}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select co-author" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableAuthorsFor(idx).map((a) => (
                          <SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" size="icon" onClick={() => moveCoAuthor(idx, -1)} disabled={idx === 0}>
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" size="icon" onClick={() => moveCoAuthor(idx, 1)} disabled={idx === coAuthorIds.length - 1}>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" size="icon" onClick={() => removeCoAuthor(idx)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={addCoAuthor}
                disabled={1 + coAuthorIds.length >= 10}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Author
              </Button>
              {errors.co_author_ids && <p className="text-xs text-destructive">{errors.co_author_ids.message}</p>}
            </div>

            <div className="space-y-1 sm:col-span-2 lg:col-span-3">
              <Label>Editor(s)</Label>
              <div className="space-y-2">
                {editorNames.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      placeholder={idx === 0 ? 'Primary editor name' : 'Additional editor name'}
                      value={val}
                      onChange={(e) => updateEditor(idx, e.target.value)}
                    />
                    {idx > 0 && (
                      <>
                        <Button type="button" variant="outline" size="icon" onClick={() => moveEditor(idx, -1)} disabled={idx === 1}>
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="outline" size="icon" onClick={() => moveEditor(idx, 1)} disabled={idx === editorNames.length - 1}>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button type="button" variant="outline" size="icon" onClick={() => removeEditor(idx)} disabled={idx === 0}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={addEditor}
                disabled={editorNames.length >= 10}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Editor
              </Button>
              {errors.author_id && <p className="text-xs text-destructive">{errors.author_id.message}</p>}
              {errors.editor_names && <p className="text-xs text-destructive">{errors.editor_names.message}</p>}
            </div>

            <div className="space-y-1">
              <Label>Category <span className="text-red-500">*</span></Label>
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(v) => field.onChange(Number(v))}
                    value={field.value ? String(field.value) : ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category_id && <p className="text-xs text-destructive">{errors.category_id.message}</p>}
            </div>

            <div className="space-y-1 sm:col-span-2 lg:col-span-3">
              <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
              <Textarea id="description" rows={4} {...register('description')} />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="cover_image">Cover Image</Label>
              <Input
                id="cover_image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setCoverFile(file)
                    setCoverPreview(URL.createObjectURL(file))
                  }
                }}
              />
              {coverPreview && (
                <img src={coverPreview} alt="Preview" className="mt-2 h-24 w-24 rounded object-cover border" />
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="preview_pdf">Preview PDF URL</Label>
              <Input id="preview_pdf" type="text" placeholder="https://..." {...register('preview_pdf')} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="external_url">External Listing URL</Label>
              <Input
                id="external_url"
                type="text"
                placeholder="https://thamizhbooks.com/product/..."
                {...register('external_url')}
              />
            </div>

            <div className="flex gap-3 sm:col-span-2 lg:col-span-3 pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Add Book'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/books')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

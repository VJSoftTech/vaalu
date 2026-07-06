import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
  })

  useEffect(() => {
    authorService.getAll({ limit: 100 }).then((r) => setAuthors(r.data)).catch(() => {})
    categoryService.getAll().then(setCategories).catch(() => {})
  }, [])

  const onSubmit = async (data: BookFormData) => {
    try {
      const fd = new FormData()
      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined && v !== null) fd.append(k, String(v))
      })
      if (coverFile) fd.append('cover_image', coverFile)
      await bookService.create(fd)
      toast({ title: 'Book added successfully' })
      navigate('/admin/books')
    } catch {
      toast({ title: 'Failed to add book', variant: 'destructive' })
    }
  }

  const textFields = [
    { id: 'title', label: 'Title', type: 'text' },
    { id: 'isbn', label: 'ISBN', type: 'text' },
    { id: 'price', label: 'Price (₹)', type: 'number' },
    { id: 'discount_price', label: 'Discount Price (₹)', type: 'number' },
    { id: 'stock_quantity', label: 'Stock Quantity', type: 'number' },
    { id: 'rating', label: 'Rating (0–5)', type: 'number' },
  ]

  return (
    <div>
      <PageTitle title="Add Book" />
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 items-start">
            {textFields.map(({ id, label, type }) => (
              <div key={id} className="space-y-1">
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  type={type}
                  step={id === 'rating' ? '0.1' : undefined}
                  min={id === 'rating' ? '0' : undefined}
                  max={id === 'rating' ? '5' : undefined}
                  {...register(id as keyof BookFormData, { valueAsNumber: type === 'number' })}
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
              <Label>Category</Label>
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
              <Label htmlFor="description">Description</Label>
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

import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { blogSchema } from '@/utils/validators'
import { blogService } from '@/services/blogService'
import { toast } from '@/hooks/useToast'
import type { BlogFormData } from '@/types'
import PageTitle from '@/components/common/PageTitle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function EditBlog() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const existingSlug = useRef('')
  const existingAuthorId = useRef<number | undefined>(undefined)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
  })

  useEffect(() => {
    if (!id) return
    blogService.getById(Number(id))
      .then((b) => {
        reset({ title: b.title, content: b.content })
        existingSlug.current = b.slug
        existingAuthorId.current = b.author_id
        setImagePreview(b.featured_image || '')
      })
      .finally(() => setLoading(false))
  }, [id, reset])

  const onSubmit = async (data: BlogFormData) => {
    try {
      const fd = new FormData()
      fd.append('title', data.title)
      fd.append('slug', existingSlug.current)
      fd.append('content', data.content)
      if (existingAuthorId.current) fd.append('author_id', String(existingAuthorId.current))
      if (imageFile) fd.append('featured_image', imageFile)
      await blogService.update(Number(id), fd)
      toast({ title: 'Blog updated successfully' })
      navigate('/admin/blogs')
    } catch {
      toast({ title: 'Failed to update blog', variant: 'destructive' })
    }
  }

  if (loading) return <LoadingSpinner className="py-16" />

  return (
    <div>
      <PageTitle title="Edit Blog" />
      <Card className="max-w-3xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Title</Label>
              <Input {...register('title')} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Content</Label>
              <Textarea rows={12} {...register('content')} />
              {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Featured Image <span className="text-muted-foreground text-xs">(optional)</span></Label>
              {imagePreview && !imageFile && (
                <img src={imagePreview} alt="Current image" className="mb-2 h-32 w-auto rounded object-cover border" />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setImageFile(file)
                    setImagePreview(URL.createObjectURL(file))
                  }
                }}
              />
              {imageFile && (
                <img src={imagePreview} alt="New image preview" className="mt-2 h-32 w-auto rounded object-cover border" />
              )}
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/blogs')}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

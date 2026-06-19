import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { blogSchema } from '@/utils/validators'
import { blogService } from '@/services/blogService'
import { toast } from '@/hooks/useToast'
import type { BlogFormData } from '@/types'
import { slugify } from '@/utils/formatters'
import PageTitle from '@/components/common/PageTitle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

export default function AddBlog() {
  const navigate = useNavigate()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
  })

  const onSubmit = async (data: BlogFormData) => {
    try {
      const fd = new FormData()
      fd.append('title', data.title)
      fd.append('slug', slugify(data.title))
      fd.append('content', data.content)
      if (imageFile) fd.append('featured_image', imageFile)
      await blogService.create(fd)
      toast({ title: 'Blog published successfully' })
      navigate('/admin/blogs')
    } catch {
      toast({ title: 'Failed to publish blog', variant: 'destructive' })
    }
  }

  return (
    <div>
      <PageTitle title="Add Blog" />
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
              <Textarea rows={12} placeholder="Write your blog content here..." {...register('content')} />
              {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Featured Image <span className="text-muted-foreground text-xs">(optional)</span></Label>
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
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-auto rounded object-cover border" />
              )}
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Publish Blog'}</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/blogs')}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

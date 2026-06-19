import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authorSchema } from '@/utils/validators'
import { authorService } from '@/services/authorService'
import { toast } from '@/hooks/useToast'
import type { AuthorFormData } from '@/types'
import PageTitle from '@/components/common/PageTitle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

export default function AddAuthor() {
  const navigate = useNavigate()
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthorFormData>({
    resolver: zodResolver(authorSchema),
  })

  const onSubmit = async (data: AuthorFormData) => {
    try {
      const fd = new FormData()
      fd.append('name', data.name)
      fd.append('biography', data.biography)
      fd.append('social_links', JSON.stringify(data.social_links ?? {}))
      if (photoFile) fd.append('photo', photoFile)
      await authorService.create(fd)
      toast({ title: 'Author added successfully' })
      navigate('/admin/authors')
    } catch {
      toast({ title: 'Failed to add author', variant: 'destructive' })
    }
  }

  return (
    <div>
      <PageTitle title="Add Author" />
      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Biography</Label>
              <Textarea rows={5} {...register('biography')} />
              {errors.biography && <p className="text-xs text-destructive">{errors.biography.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Photo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setPhotoFile(file)
                    setPhotoPreview(URL.createObjectURL(file))
                  }
                }}
              />
              {photoPreview && (
                <img src={photoPreview} alt="Preview" className="mt-2 h-20 w-20 rounded-full object-cover border" />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(['website', 'facebook', 'twitter', 'instagram'] as const).map((s) => (
                <div key={s} className="space-y-1">
                  <Label className="capitalize">{s}</Label>
                  <Input placeholder={`https://...`} {...register(`social_links.${s}`)} />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Add Author'}</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/authors')}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

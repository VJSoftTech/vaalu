import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { advertisementService } from '@/services/advertisementService'
import PageTitle from '@/components/common/PageTitle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import LoadingSpinner from '@/components/common/LoadingSpinner'

interface SimpleEditForm {
  banner_image?: FileList
  redirect_url?: string
}

export default function EditAd() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState('')
  const [newImagePreview, setNewImagePreview] = useState('')
  const [adMeta, setAdMeta] = useState<Record<string, unknown>>({})
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SimpleEditForm>()

  const { onChange: onBannerChange, ...bannerImageField } = register('banner_image')

  useEffect(() => {
    if (!id) return
    advertisementService.getById(Number(id)).then((a) => {
      setCurrentImage(a.banner_image)
      setAdMeta({
        title:         a.title,
        subtitle:      a.subtitle ?? '',
        type:          a.type ?? 'hero',
        is_active:     a.is_active,
        start_date:    a.start_date,
        end_date:      a.end_date,
        display_order: a.display_order ?? 0,
      })
      reset({ redirect_url: a.redirect_url })
    }).finally(() => setLoading(false))
  }, [id, reset])

  const onSubmit = async (data: SimpleEditForm) => {
    const fd = new FormData()
    if (data.banner_image?.[0]) fd.append('banner_image', data.banner_image[0])
    if (data.redirect_url !== undefined) fd.append('redirect_url', data.redirect_url)
    Object.entries(adMeta).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, String(v))
    })
    await advertisementService.update(Number(id), fd)
    navigate('/admin/advertisements')
  }

  if (loading) return <LoadingSpinner className="py-16" />

  return (
    <div>
      <PageTitle title="Edit Advertisement" />
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
            <div className="space-y-1">
              <Label>Banner Image</Label>
              {currentImage && !newImagePreview && (
                <img src={currentImage} alt="Current banner" className="w-full h-24 object-cover rounded mb-2 border" />
              )}
              <Input
                type="file"
                accept="image/*"
                {...bannerImageField}
                onChange={(e) => {
                  onBannerChange(e)
                  const file = e.target.files?.[0]
                  if (file) setNewImagePreview(URL.createObjectURL(file))
                }}
              />
              <p className="text-xs text-muted-foreground">Leave empty to keep the current image</p>
              {newImagePreview && (
                <img src={newImagePreview} alt="New banner preview" className="mt-2 w-full h-24 object-cover rounded border" />
              )}
            </div>

            <div className="space-y-1">
              <Label>Redirect URL <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Input {...register('redirect_url')} placeholder="https://... or /books" />
            </div>

            <div className="flex gap-3 md:col-span-2">
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/advertisements')}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

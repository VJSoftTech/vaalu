import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { advertisementService } from '@/services/advertisementService'
import type { AdvertisementFormData } from '@/types'
import PageTitle from '@/components/common/PageTitle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import LoadingSpinner from '@/components/common/LoadingSpinner'

const AD_TYPES = [
  { value: 'hero',      label: 'Hero Slider (Home Page)' },
  { value: 'banner',    label: 'Banner' },
  { value: 'festival',  label: 'Festival' },
  { value: 'countdown', label: 'Countdown' },
  { value: 'gift',      label: 'Gift' },
]

export default function EditAd() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<AdvertisementFormData>()

  useEffect(() => {
    if (!id) return
    advertisementService.getById(Number(id)).then((a) => {
      setCurrentImage(a.banner_image)
      reset({
        title:         a.title,
        subtitle:      a.subtitle ?? '',
        redirect_url:  a.redirect_url,
        start_date:    a.start_date,
        end_date:      a.end_date,
        is_active:     a.is_active,
        type:          a.type ?? 'banner',
        display_order: a.display_order ?? 0,
      })
    }).finally(() => setLoading(false))
  }, [id, reset])

  const onSubmit = async (data: AdvertisementFormData) => {
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, v as string | Blob)
    })
    await advertisementService.update(Number(id), fd)
    navigate('/admin/advertisements')
  }

  if (loading) return <LoadingSpinner className="py-16" />

  return (
    <div>
      <PageTitle title="Edit Advertisement" />
      <Card className="max-w-xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Type</Label>
              <select
                {...register('type')}
                className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {AD_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label>Title</Label>
              <Input {...register('title')} placeholder="Banner headline" />
            </div>

            <div className="space-y-1">
              <Label>Subtitle <span className="text-muted-foreground text-xs">(optional overlay text)</span></Label>
              <Input {...register('subtitle')} placeholder="Short description below the title" />
            </div>

            <div className="space-y-1">
              <Label>Banner Image</Label>
              {currentImage && (
                <img src={currentImage} alt="Current banner" className="w-full h-24 object-cover rounded mb-2 border" />
              )}
              <Input type="file" accept="image/*" {...register('banner_image')} />
              <p className="text-xs text-muted-foreground">Leave empty to keep the current image</p>
            </div>

            <div className="space-y-1">
              <Label>Redirect URL</Label>
              <Input {...register('redirect_url')} placeholder="https://... or /books" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Start Date</Label>
                <Input type="date" {...register('start_date')} />
              </div>
              <div className="space-y-1">
                <Label>End Date</Label>
                <Input type="date" {...register('end_date')} />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Display Order <span className="text-muted-foreground text-xs">(lower = shown first)</span></Label>
              <Input type="number" min={0} {...register('display_order', { valueAsNumber: true })} />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="active"
                checked={watch('is_active')}
                onCheckedChange={(v) => setValue('is_active', v)}
              />
              <Label htmlFor="active">Active</Label>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/advertisements')}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

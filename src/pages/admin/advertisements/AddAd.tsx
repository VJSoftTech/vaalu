import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { advertisementService } from '@/services/advertisementService'
import type { AdvertisementFormData } from '@/types'
import PageTitle from '@/components/common/PageTitle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

export default function AddAd() {
  const navigate = useNavigate()
  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm<AdvertisementFormData>({ defaultValues: { is_active: true } })

  const onSubmit = async (data: AdvertisementFormData) => {
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, v as string | Blob)
    })
    await advertisementService.create(fd)
    navigate('/admin/advertisements')
  }

  return (
    <div>
      <PageTitle title="Add Advertisement" />
      <Card className="max-w-xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1"><Label>Title</Label><Input {...register('title', { required: true })} /></div>
            <div className="space-y-1"><Label>Banner Image</Label><Input type="file" accept="image/*" {...register('banner_image')} /></div>
            <div className="space-y-1"><Label>Redirect URL</Label><Input type="url" {...register('redirect_url', { required: true })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Start Date</Label><Input type="date" {...register('start_date', { required: true })} /></div>
              <div className="space-y-1"><Label>End Date</Label><Input type="date" {...register('end_date', { required: true })} /></div>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="active" defaultChecked onCheckedChange={(v) => setValue('is_active', v)} />
              <Label htmlFor="active">Active</Label>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Add Ad'}</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/advertisements')}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

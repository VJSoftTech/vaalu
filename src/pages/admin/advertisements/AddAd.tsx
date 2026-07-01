import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { advertisementService } from '@/services/advertisementService'
import PageTitle from '@/components/common/PageTitle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

interface SimpleAdForm {
  banner_image: FileList
  redirect_url?: string
}

export default function AddAd() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SimpleAdForm>()

  const onSubmit = async (data: SimpleAdForm) => {
    const fd = new FormData()
    if (data.banner_image?.[0]) fd.append('banner_image', data.banner_image[0])
    if (data.redirect_url) fd.append('redirect_url', data.redirect_url)
    fd.append('type', 'hero')
    fd.append('is_active', 'true')
    await advertisementService.create(fd)
    navigate('/admin/advertisements')
  }

  return (
    <div>
      <PageTitle title="Add Advertisement" />
      <Card className="max-w-xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Banner Image <span className="text-destructive">*</span></Label>
              <Input type="file" accept="image/*" {...register('banner_image', { required: true })} />
              <p className="text-xs text-muted-foreground">Recommended: 1920×600px or 16:5 aspect ratio</p>
            </div>

            <div className="space-y-1">
              <Label>Redirect URL <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Input {...register('redirect_url')} placeholder="https://... or /books" />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Add Banner'}</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/advertisements')}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

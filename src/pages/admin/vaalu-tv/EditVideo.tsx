import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { videoService } from '@/services/videoService'
import { toast } from '@/hooks/useToast'
import type { VideoFormData } from '@/types'
import PageTitle from '@/components/common/PageTitle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function EditVideo() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<VideoFormData>({
    defaultValues: {
      is_featured: false,
    },
  })

  useEffect(() => {
    if (!id) return

    videoService
      .getById(Number(id))
      .then((video) => {
        reset({
          ...video,
          is_featured: video.is_featured ?? false,
        })
      })
      .catch(() => {
        toast({ title: 'Video not found', variant: 'destructive' })
        navigate('/admin/vaalu-tv')
      })
      .finally(() => setLoading(false))
  }, [id, reset])

  const onSubmit = async (data: VideoFormData) => {
    try {
      await videoService.update(Number(id), {
        ...data,
        is_featured: Boolean(data.is_featured),
      })
      toast({ title: 'Video updated successfully' })
      navigate('/admin/vaalu-tv')
    } catch {
      toast({ title: 'Failed to update video', variant: 'destructive' })
    }
  }

  if (loading) {
    return <LoadingSpinner className="py-16" />
  }

  return (
    <div>
      <PageTitle title="Edit Video" />

      <Card>
        <CardContent className="p-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start"
          >
            <div className="space-y-1">
              <Label>YouTube Video ID</Label>
              <Input {...register('youtube_id')} />
            </div>

            <div className="space-y-1">
              <Label>Title</Label>
              <Input {...register('title')} />
            </div>

            <div className="space-y-1">
              <Label>Duration</Label>
              <Input {...register('duration')} />
            </div>

            <div className="space-y-1">
              <Label>Category</Label>
              <Input {...register('category')} />
            </div>

            <div className="flex items-center gap-3 md:col-span-2">
              <Switch
                id="featured"
                checked={watch('is_featured') || false}
                onCheckedChange={(checked) =>
                  setValue('is_featured', checked, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />

              <Label htmlFor="featured">
                Featured Video
              </Label>
            </div>

            <div className="flex gap-3 md:col-span-2">
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/vaalu-tv')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { videoService } from '@/services/videoService'
import PageTitle from '@/components/common/PageTitle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

const extractYoutubeId = (url: string) => {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=))([^#&?]*).*/

  const match = url.match(regExp)

  return match && match[7].length === 11 ? match[7] : ''
}

const fetchVideoInfo = async (url: string) => {
  const res = await fetch(
    `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
  )

  return res.json()
}

export default function AddVideo() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<any>({
    defaultValues: {
      is_featured: false,
    },
  })

  const youtubeUrl = watch('youtube_url')
  const youtubeId = extractYoutubeId(youtubeUrl || '')
  const isFeatured = watch('is_featured')

  const handleYoutubeUrl = async (url: string) => {
    if (!url) return

    try {
      const info = await fetchVideoInfo(url)

      setValue('title', info.title)

      setValue(
        'thumbnail',
        `https://img.youtube.com/vi/${extractYoutubeId(url)}/maxresdefault.jpg`
      )
    } catch (error) {
      console.error('Failed to fetch video info:', error)
    }
  }

  const onSubmit = async (data: any) => {
    const youtubeId = extractYoutubeId(data.youtube_url)

    console.log('Submitting:', data)

    await videoService.create({
      youtube_id: youtubeId,
      title: data.title,
      duration: data.duration || '',
      category: data.category || '',
      is_featured: Boolean(data.is_featured),
      thumbnail:
        data.thumbnail ||
        `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
    })

    navigate('/admin/vaalu-tv')
  }

  return (
    <div>
      <PageTitle title="Add Video" />

      <Card className="max-w-xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div className="space-y-1">
              <Label>YouTube URL</Label>
              <Input
                placeholder="https://youtu.be/fQZkUynCHUc"
                {...register('youtube_url', { required: true })}
                onBlur={(e) => handleYoutubeUrl(e.target.value)}
              />
            </div>

            {youtubeId && (
              <img
                src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                alt="Thumbnail"
                className="w-full aspect-video object-cover rounded"
              />
            )}

            <div className="space-y-1">
              <Label>Title</Label>
              <Input {...register('title', { required: true })} />
            </div>

            <div className="space-y-1">
              <Label>Duration</Label>
              <Input
                placeholder="e.g. 12:34"
                {...register('duration')}
              />
            </div>

            <div className="space-y-1">
              <Label>Category</Label>
              <Input {...register('category')} />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="featured"
                checked={isFeatured}
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

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Add Video'}
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
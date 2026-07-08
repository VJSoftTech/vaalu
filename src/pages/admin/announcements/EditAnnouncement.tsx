import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { announcementService } from '@/services/announcementService'
import type { AnnouncementPriority } from '@/types'
import PageTitle from '@/components/common/PageTitle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import LoadingSpinner from '@/components/common/LoadingSpinner'

const PRIORITIES = [
  { value: 'normal',    label: 'Normal' },
  { value: 'important',  label: 'Important' },
  { value: 'urgent',    label: 'Urgent' },
]

interface EditAnnouncementForm {
  title: string
  message: string
  image?: FileList
  link_url?: string
  priority: AnnouncementPriority
  is_active: boolean
  start_date?: string
  end_date?: string
}

export default function EditAnnouncement() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState('')
  const [newImagePreview, setNewImagePreview] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<EditAnnouncementForm>()

  const { onChange: onImageChange, ...imageField } = register('image')

  useEffect(() => {
    if (!id) return
    announcementService.getById(Number(id)).then((a) => {
      setCurrentImage(a.image)
      reset({
        title:      a.title,
        message:    a.message,
        link_url:   a.link_url ?? '',
        priority:   a.priority ?? 'normal',
        is_active:  a.is_active,
        start_date: a.start_date ?? '',
        end_date:   a.end_date ?? '',
      })
    }).finally(() => setLoading(false))
  }, [id, reset])

  const onSubmit = async (data: EditAnnouncementForm) => {
    const fd = new FormData()
    fd.append('title', data.title)
    fd.append('message', data.message)
    if (data.image?.[0]) fd.append('image', data.image[0])
    fd.append('link_url', data.link_url ?? '')
    fd.append('priority', data.priority)
    fd.append('is_active', String(data.is_active))
    fd.append('start_date', data.start_date ?? '')
    fd.append('end_date', data.end_date ?? '')
    await announcementService.update(Number(id), fd)
    navigate('/admin/announcements')
  }

  if (loading) return <LoadingSpinner className="py-16" />

  return (
    <div>
      <PageTitle title="Edit Announcement" />
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 items-start">
            <div className="space-y-1">
              <Label>Title <span className="text-red-500">*</span></Label>
              <Input {...register('title', { required: true })} placeholder="Announcement headline" />
            </div>

            <div className="space-y-1">
              <Label>Link URL</Label>
              <Input {...register('link_url')} placeholder="https://... or /books" />
            </div>

            <div className="space-y-1">
              <Label>Priority</Label>
              <select
                {...register('priority')}
                className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label>Image <span className="text-muted-foreground text-xs">(optional banner)</span></Label>
              {currentImage && !newImagePreview && (
                <img src={currentImage} alt="Current banner" className="w-full h-24 object-cover rounded mb-2 border" />
              )}
              <Input
                type="file"
                accept="image/*"
                {...imageField}
                onChange={(e) => {
                  onImageChange(e)
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
              <Label>Start Date</Label>
              <Input type="date" {...register('start_date')} />
            </div>
            <div className="space-y-1">
              <Label>End Date</Label>
              <Input type="date" {...register('end_date')} />
            </div>

            <div className="space-y-1 sm:col-span-2 lg:col-span-3">
              <Label>Message <span className="text-red-500">*</span></Label>
              <Textarea {...register('message', { required: true })} rows={4} />
            </div>

            <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-3">
              <Switch
                id="active"
                checked={watch('is_active')}
                onCheckedChange={(v) => setValue('is_active', v)}
              />
              <Label htmlFor="active">Active</Label>
            </div>

            <div className="flex gap-3 sm:col-span-2 lg:col-span-3 pt-2">
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/announcements')}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

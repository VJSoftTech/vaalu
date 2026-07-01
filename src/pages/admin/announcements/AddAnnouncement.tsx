import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { announcementService } from '@/services/announcementService'
import type { AnnouncementPriority } from '@/types'
import PageTitle from '@/components/common/PageTitle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

const PRIORITIES = [
  { value: 'normal',    label: 'Normal' },
  { value: 'important',  label: 'Important' },
  { value: 'urgent',    label: 'Urgent' },
]

interface AddAnnouncementForm {
  title: string
  message: string
  image: FileList
  link_url?: string
  priority: AnnouncementPriority
  start_date?: string
  end_date?: string
}

export default function AddAnnouncement() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AddAnnouncementForm>({ defaultValues: { priority: 'normal' } })

  const onSubmit = async (data: AddAnnouncementForm) => {
    const fd = new FormData()
    fd.append('title', data.title)
    fd.append('message', data.message)
    if (data.image?.[0]) fd.append('image', data.image[0])
    if (data.link_url) fd.append('link_url', data.link_url)
    fd.append('priority', data.priority)
    fd.append('is_active', 'true')
    if (data.start_date) fd.append('start_date', data.start_date)
    if (data.end_date) fd.append('end_date', data.end_date)
    await announcementService.create(fd)
    navigate('/admin/announcements')
  }

  return (
    <div>
      <PageTitle title="Add Announcement" />
      <Card className="max-w-xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Title <span className="text-destructive">*</span></Label>
              <Input {...register('title', { required: true })} placeholder="Announcement headline" />
            </div>

            <div className="space-y-1">
              <Label>Message <span className="text-destructive">*</span></Label>
              <Textarea {...register('message', { required: true })} placeholder="Announcement details" rows={4} />
            </div>

            <div className="space-y-1">
              <Label>Image <span className="text-muted-foreground text-xs">(optional banner)</span></Label>
              <Input type="file" accept="image/*" {...register('image')} />
            </div>

            <div className="space-y-1">
              <Label>Link URL <span className="text-muted-foreground text-xs">(optional)</span></Label>
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

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Start Date <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input type="date" {...register('start_date')} />
              </div>
              <div className="space-y-1">
                <Label>End Date <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input type="date" {...register('end_date')} />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Publish Announcement'}</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/announcements')}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2, ImagePlus } from 'lucide-react'
import { giftService } from '@/services/giftService'
import { giftSchema } from '@/utils/validators'
import { GIFT_CATEGORIES, type GiftFormData } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/useToast'

export default function EditGift() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState('')
  const [existingCoverUrl, setExistingCoverUrl] = useState('')

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<GiftFormData>({
    resolver: zodResolver(giftSchema),
    defaultValues: {
      is_featured: false,
      is_trending: false,
      is_active: true,
    },
  })

  useEffect(() => {
    if (!id) return
    giftService.getById(parseInt(id))
      .then((gift) => {
        reset({
          title: gift.title,
          description: gift.description,
          category: gift.category,
          video_url: gift.video_url ?? '',
          is_featured: gift.is_featured,
          is_trending: gift.is_trending,
          is_active: gift.is_active,
        })
        setExistingCoverUrl(gift.cover_image ?? '')
      })
      .catch(() => toast({ title: 'Gift not found', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }, [id, reset, toast])

  const onSubmit = async (data: GiftFormData) => {
    if (!id) return
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined && v !== null) fd.append(k, String(v))
      })
      if (coverFile) {
        fd.append('cover_image', coverFile)
      } else if (existingCoverUrl) {
        fd.append('cover_image', existingCoverUrl)
      }
      await giftService.update(parseInt(id), fd)
      toast({ title: 'Gift updated successfully' })
      navigate('/admin/gifts')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to save'
      toast({ title: msg, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-40 text-muted-foreground">Loading…</div>
  }

  const displayedImage = coverPreview || existingCoverUrl

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/gifts">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Gift</h1>
          <p className="text-muted-foreground text-sm">Update gift details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" {...register('title')} />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Category *</Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {GIFT_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea id="description" {...register('description')} rows={5} placeholder="Product description (short or detailed)…" />
          {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
        </div>

        {/* Cover Image (file browse) */}
        <div className="space-y-1.5">
          <Label>Cover Image</Label>
          <label className="flex items-center gap-3 border-2 border-dashed rounded-xl p-4 cursor-pointer hover:border-teal-500 transition-colors">
            <ImagePlus className="h-5 w-5 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground">
              {coverFile ? coverFile.name : 'Click to browse and replace image…'}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setCoverFile(file)
                  setCoverPreview(URL.createObjectURL(file))
                }
              }}
            />
          </label>
          {displayedImage && (
            <img src={displayedImage} alt="Cover" className="mt-2 h-32 w-32 rounded-lg object-cover border" />
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="video_url">YouTube Video URL</Label>
          <Input id="video_url" {...register('video_url')} />
        </div>

        <div className="border rounded-xl p-4 space-y-4 md:col-span-2">
          <h3 className="font-semibold text-sm">Visibility & Flags</h3>
          {(
            [
              { name: 'is_featured', label: 'Featured', desc: 'Show in featured section on homepage' },
              { name: 'is_trending', label: 'Trending', desc: 'Show in trending section' },
              { name: 'is_active', label: 'Active', desc: 'Visible on public website' },
            ] as const
          ).map(({ name, label, desc }) => (
            <div key={name} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{label}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </div>
              <Controller
                name={name}
                control={control}
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-2 md:col-span-2">
          <Button type="submit" disabled={saving} className="gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
          <Link to="/admin/gifts"><Button type="button" variant="outline">Cancel</Button></Link>
        </div>
      </form>
    </div>
  )
}

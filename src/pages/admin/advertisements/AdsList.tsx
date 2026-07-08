import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Monitor, CheckCircle2, Clock } from 'lucide-react'
import { advertisementService } from '@/services/advertisementService'
import type { Advertisement } from '@/types'
import PageTitle from '@/components/common/PageTitle'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/utils/formatters'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const TYPE_LABELS: Record<string, string> = {
  hero:      'Hero Slider',
  banner:    'Banner',
  festival:  'Festival',
  countdown: 'Countdown',
  gift:      'Gift',
}

const TYPE_COLORS: Record<string, string> = {
  hero:      'bg-purple-100 text-purple-800',
  banner:    'bg-blue-100 text-blue-800',
  festival:  'bg-orange-100 text-orange-800',
  countdown: 'bg-red-100 text-red-800',
  gift:      'bg-green-100 text-green-800',
}

function HeroSlidesPreview({ slides }: { slides: Advertisement[] }) {
  const today = new Date().toISOString().slice(0, 10)
  const liveSlides = slides
    .filter((s) => s.type === 'hero' && s.is_active)
    .filter((s) => (!s.start_date || s.start_date <= today) && (!s.end_date || s.end_date >= today))
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))

  const pendingSlides = slides
    .filter((s) => s.type === 'hero' && s.is_active && s.start_date > today)

  return (
    <div className="mb-6 rounded-xl border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Monitor className="h-4 w-4 text-primary" />
          Home Page Hero Slider
          <Badge variant="outline" className="text-xs ml-1">
            {liveSlides.length} live slide{liveSlides.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">
          Slides shown below are currently live on the homepage
        </span>
      </div>

      {liveSlides.length === 0 ? (
        <div className="px-4 py-8 text-center text-muted-foreground text-sm">
          No active hero slides — the default hero banner is showing on the homepage.
          <div className="mt-2">
            <Link to="/admin/advertisements/add">
              <Button size="sm" variant="outline" className="gap-1 mt-1">
                <Plus className="h-3.5 w-3.5" /> Add First Slide
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {liveSlides.map((slide, i) => (
              <div key={slide.id} className="shrink-0 w-48 group">
                <div className="relative rounded-lg overflow-hidden border aspect-[16/6] bg-muted">
                  {slide.banner_image ? (
                    <img
                      src={slide.banner_image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                  <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    #{i + 1}
                  </div>
                  <div className="absolute top-1.5 right-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-400 drop-shadow" />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Link to={`/admin/advertisements/${slide.id}/edit`}>
                      <Button size="sm" variant="secondary" className="h-6 text-xs gap-1 px-2">
                        <Pencil className="h-3 w-3" /> Edit
                      </Button>
                    </Link>
                  </div>
                </div>
                <p className="text-xs font-medium mt-1.5 truncate text-foreground/80">{slide.title}</p>
                <p className="text-[10px] text-muted-foreground">{formatDate(slide.start_date)} – {formatDate(slide.end_date)}</p>
              </div>
            ))}
          </div>
          {pendingSlides.length > 0 && (
            <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {pendingSlides.length} slide{pendingSlides.length > 1 ? 's' : ''} scheduled (not yet started)
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdsList() {
  const [ads, setAds] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    advertisementService.getAll().then((r) => setAds(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this ad?')) return
    await advertisementService.delete(id)
    load()
  }

  return (
    <div>
      <PageTitle
        title="Home Slider"
        action={
          <Link to="/admin/advertisements/add">
            <Button><Plus className="h-4 w-4 mr-1" /> Add Slide</Button>
          </Link>
        }
      />
      {loading ? <LoadingSpinner className="py-16" /> : (
        <>
          <HeroSlidesPreview slides={ads} />
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {ad.banner_image ? (
                        <img src={ad.banner_image} alt={ad.title} className="w-16 h-9 object-cover rounded border" />
                      ) : (
                        <div className="w-16 h-9 rounded border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          No img
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-sm">{ad.title}</div>
                        {ad.subtitle && (
                          <div className="text-xs text-muted-foreground truncate max-w-[160px]">{ad.subtitle}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[ad.type] ?? 'bg-gray-100 text-gray-700'}`}>
                      {TYPE_LABELS[ad.type] ?? ad.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ad.is_active ? 'default' : 'secondary'}>
                      {ad.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link to={`/admin/advertisements/${ad.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(ad.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {ads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    No advertisements yet. Add your first one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        </>
      )}
    </div>
  )
}

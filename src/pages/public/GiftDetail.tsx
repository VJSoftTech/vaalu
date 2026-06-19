import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Play, Tag, Star, TrendingUp, MessageSquare, Loader2 } from 'lucide-react'
import WhatsAppIcon from '@/components/common/WhatsAppIcon'
import { giftService } from '@/services/giftService'
import { giftEnquirySchema } from '@/utils/validators'
import type { GiftItem } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/useToast'

interface EnquiryForm {
  customer_name: string
  phone_number?: string
  email?: string
  message?: string
}

function extractYoutubeInfo(url: string): { id: string; isShort: boolean } | null {
  const shortsMatch = url.match(/youtube\.com\/shorts\/([^?&/]+)/)
  if (shortsMatch) return { id: shortsMatch[1], isShort: true }
  const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/)
  return m ? { id: m[1], isShort: false } : null
}

export default function GiftDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { toast } = useToast()
  const [gift, setGift] = useState<GiftItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryForm>({ resolver: zodResolver(giftEnquirySchema) })

  useEffect(() => {
    if (!slug) return
    giftService.getBySlug(slug)
      .then((g) => { setGift(g); setActiveImg(g.cover_image || '') })
      .catch(() => setGift(null))
      .finally(() => setLoading(false))
  }, [slug])

  const onEnquiry = async (data: EnquiryForm) => {
    if (!gift) return
    setSubmitting(true)
    try {
      await giftService.submitEnquiry({ ...data, gift_id: gift.id })
      toast({ title: 'Enquiry sent! We will contact you soon.' })
      setSubmitted(true)
      reset()
    } catch {
      toast({ title: 'Failed to send enquiry', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-700" />
      </div>
    )
  }

  if (!gift) {
    return (
      <div className="container py-20 text-center space-y-4">
        <p className="text-5xl">🎁</p>
        <h2 className="text-2xl font-bold">Gift not found</h2>
        <Link to="/gifts"><Button>Browse Gifts</Button></Link>
      </div>
    )
  }

  const youtubeInfo = gift.video_url ? extractYoutubeInfo(gift.video_url) : null
  const youtubeId = youtubeInfo?.id ?? null
  const isShort = youtubeInfo?.isShort ?? false
  const images = [gift.cover_image, ...(gift.gallery || [])].filter(Boolean) as string[]

  return (
    <div className="container py-10 space-y-8">
      <Link to="/gifts" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Gifts
      </Link>

      {/* Heading & Description */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="gap-1 text-teal-700 border-teal-200 bg-teal-50">
            <Tag className="h-3 w-3" /> {gift.category}
          </Badge>
          {gift.is_featured && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 gap-1">
              <Star className="h-3 w-3" /> Featured
            </Badge>
          )}
          {gift.is_trending && (
            <Badge className="bg-orange-100 text-orange-800 border-orange-200 gap-1">
              <TrendingUp className="h-3 w-3" /> Trending
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold leading-tight">{gift.title}</h1>
        {gift.description && (
          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{gift.description}</p>
        )}
        <div className="flex flex-wrap gap-3 pt-1">
          <Button
            className="bg-teal-700 hover:bg-teal-800 gap-2"
            onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <MessageSquare className="h-4 w-4" /> Send Enquiry
          </Button>
          <a
            href="https://wa.me/919444296929?text=Hi%2C%20I%20have%20an%20enquiry%20about%20a%20Gift%20Currency%20Note"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="gap-2 border-green-600 text-green-700 hover:bg-green-50">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp Enquiry
            </Button>
          </a>
        </div>
      </motion.div>

      {/* 3-column row: Cover Image | YouTube Video | Enquiry Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Cover Image */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
          <div className="rounded-2xl overflow-hidden border bg-gradient-to-br from-teal-50 to-orange-50">
            {activeImg ? (
              <img src={activeImg} alt={gift.title} className="w-full h-auto" />
            ) : (
              <div className="flex items-center justify-center py-16 text-7xl">🎁</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(img)}
                  className={`shrink-0 h-14 w-14 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImg === img ? 'border-teal-600' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* YouTube Video */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          {youtubeId ? (
            <>
              <div className={`rounded-2xl overflow-hidden border bg-black ${isShort ? 'mx-auto max-w-[300px] w-full' : 'w-full'}`}>
                <div className={isShort ? 'aspect-[9/16] w-full' : 'aspect-video w-full'}>
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                    title={gift.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Play className="h-3 w-3 text-teal-600" /> Watch product video
              </p>
            </>
          ) : gift.video_url ? (
            <a
              href={gift.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-teal-700 hover:underline"
            >
              <Play className="h-4 w-4" /> Watch video preview
            </a>
          ) : (
            <div className="rounded-2xl border border-dashed flex items-center justify-center py-16 text-muted-foreground text-sm">
              No video available
            </div>
          )}
        </motion.div>

        {/* Enquiry Form */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div id="enquiry-form" className="border rounded-2xl p-5 space-y-4 bg-teal-50/50">
            <div className="flex items-center gap-2 font-semibold">
              <MessageSquare className="h-4 w-4 text-teal-700" />
              Send Enquiry
            </div>

            {submitted ? (
              <div className="text-center py-4 space-y-2">
                <p className="text-2xl">✅</p>
                <p className="font-medium text-teal-700">Enquiry sent successfully!</p>
                <p className="text-sm text-muted-foreground">We'll contact you shortly.</p>
                <a
                  href="https://wa.me/919444296929?text=Hi%2C%20I%20sent%20an%20enquiry%20about%20a%20Gift%20Currency%20Note"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:underline"
                >
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp: 9444296929
                </a>
                <div>
                  <Button size="sm" variant="outline" onClick={() => setSubmitted(false)}>
                    Send Another
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onEnquiry)} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="customer_name">Your Name *</Label>
                  <Input id="customer_name" {...register('customer_name')} placeholder="John Doe" />
                  {errors.customer_name && (
                    <p className="text-xs text-destructive">{errors.customer_name.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone_number">Phone</Label>
                  <Input id="phone_number" {...register('phone_number')} placeholder="9876543210" />
                  {errors.phone_number && (
                    <p className="text-xs text-destructive">{errors.phone_number.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register('email')} placeholder="optional" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    {...register('message')}
                    placeholder="Tell us more about your requirement…"
                    rows={3}
                  />
                </div>
                <Button type="submit" disabled={submitting} className="w-full bg-teal-700 hover:bg-teal-800 gap-2">
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {submitting ? 'Sending…' : 'Send Enquiry'}
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

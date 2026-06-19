import { format } from 'date-fns'

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)

export const formatDate = (date: string | null | undefined, pattern = 'dd MMM yyyy'): string => {
  if (!date) return '—'
  const d = new Date(date)
  return isNaN(d.getTime()) ? '—' : format(d, pattern)
}

export const formatDateTime = (date: string): string =>
  format(new Date(date), 'dd MMM yyyy, hh:mm a')

export const truncateText = (text: string, maxLength: number): string =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const getYoutubeThumbnail = (youtubeId: string): string =>
  `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`

export const getYoutubeEmbedUrl = (youtubeId: string): string =>
  `https://www.youtube.com/embed/${youtubeId}`

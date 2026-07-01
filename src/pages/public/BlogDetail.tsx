import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Calendar, User } from 'lucide-react'
import { blogService } from '@/services/blogService'
import type { Blog } from '@/types'
import { formatDate } from '@/utils/formatters'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Badge } from '@/components/ui/badge'
import ImageLightbox from '@/components/common/ImageLightbox'

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [zoomImg, setZoomImg] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!slug) return
    blogService.getBySlug(slug).then(setBlog).catch(() => {}).finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG') setZoomImg((target as HTMLImageElement).src)
    }
    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  }, [blog])

  if (loading) return <LoadingSpinner className="py-24" />
  if (!blog) return <div className="container py-24 text-center">Article not found.</div>

  return (
    <article className="container py-8 max-w-3xl mx-auto">
      {blog.category && <Badge variant="secondary" className="mb-4">{blog.category}</Badge>}
      <h1 className="text-4xl font-bold leading-tight">{blog.title}</h1>

      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
        {blog.author_name && (
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" /> {blog.author_name}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" /> {formatDate(blog.published_at)}
        </span>
      </div>

      {blog.featured_image && (
        <img
          src={blog.featured_image}
          alt={blog.title}
          onClick={() => setZoomImg(blog.featured_image)}
          className="w-full aspect-video object-cover rounded-lg mt-6 cursor-zoom-in"
        />
      )}

      <div
        ref={contentRef}
        className="prose prose-lg max-w-none mt-8 [&_img]:cursor-zoom-in"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {blog.tags && blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t">
          {blog.tags.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
      )}

      <ImageLightbox src={zoomImg ?? ''} alt={blog.title} open={!!zoomImg} onClose={() => setZoomImg(null)} />
    </article>
  )
}

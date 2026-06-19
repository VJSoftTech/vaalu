import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import type { Blog } from '@/types'
import { formatDate, truncateText } from '@/utils/formatters'
import { Badge } from '@/components/ui/badge'

interface Props {
  blog: Blog
}

export default function BlogCard({ blog }: Props) {
  return (
    <article className="rounded-lg border bg-card overflow-hidden hover:shadow-md transition-shadow group">
      <Link to={`/blog/${blog.slug}`} className="block aspect-video overflow-hidden">
        <img
          src={blog.featured_image}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="p-4">
        {blog.category && <Badge variant="secondary" className="mb-2 text-xs">{blog.category}</Badge>}
        <Link to={`/blog/${blog.slug}`}>
          <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
            {blog.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {truncateText(blog.content.replace(/<[^>]+>/g, ''), 120)}
        </p>
        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(blog.published_at)}</span>
          {blog.author_name && <span>· {blog.author_name}</span>}
        </div>
      </div>
    </article>
  )
}

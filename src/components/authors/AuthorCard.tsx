import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import type { Author } from '@/types'

interface Props {
  author: Author
}

export default function AuthorCard({ author }: Props) {
  return (
    <Link
      to={`/authors/${author.id}`}
      className="flex flex-col items-center text-center p-4 rounded-lg border bg-card hover:shadow-md transition-shadow group"
    >
      <img
        src={author.photo}
        alt={author.name}
        className="w-20 h-20 rounded-full object-cover mb-3 ring-2 ring-muted group-hover:ring-primary transition-all"
      />
      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
        {author.name}
      </h3>
      {author.books_count !== undefined && (
        <span className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <BookOpen className="h-3 w-3" />
          {author.books_count} Books
        </span>
      )}
    </Link>
  )
}

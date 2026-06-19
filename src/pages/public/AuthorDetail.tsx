import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Globe, Facebook, Twitter, Instagram } from 'lucide-react'
import { authorService } from '@/services/authorService'
import { bookService } from '@/services/bookService'
import type { Author, Book } from '@/types'
import BookCard from '@/components/books/BookCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function AuthorDetail() {
  const { id } = useParams<{ id: string }>()
  const [author, setAuthor] = useState<Author | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([
      authorService.getById(Number(id)),
      bookService.getAll({ author_id: Number(id) }),
    ])
      .then(([a, b]) => { setAuthor(a); setBooks(b.data) })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner className="py-24" />
  if (!author) return <div className="container py-24 text-center">Author not found.</div>

  const socials = [
    { icon: Globe, href: author.social_links.website, label: 'Website' },
    { icon: Facebook, href: author.social_links.facebook, label: 'Facebook' },
    { icon: Twitter, href: author.social_links.twitter, label: 'Twitter' },
    { icon: Instagram, href: author.social_links.instagram, label: 'Instagram' },
  ].filter((s) => s.href)

  return (
    <div className="container py-8 space-y-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <img
          src={author.photo}
          alt={author.name}
          className="w-36 h-36 rounded-full object-cover ring-4 ring-primary/20 mx-auto md:mx-0"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{author.name}</h1>
          <p className="text-muted-foreground mt-3 leading-relaxed">{author.biography}</p>
          {socials.length > 0 && (
            <div className="flex gap-3 mt-4">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {books.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Books by {author.name}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {books.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        </div>
      )}
    </div>
  )
}

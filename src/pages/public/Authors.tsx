import { useEffect, useState } from 'react'
import { authorService } from '@/services/authorService'
import type { Author } from '@/types'
import AuthorCard from '@/components/authors/AuthorCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function Authors() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authorService.getAll().then((res) => setAuthors(res.data)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Authors</h1>
      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {authors.map((author) => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { blogService } from '@/services/blogService'
import type { Blog } from '@/types'
import BlogCard from '@/components/blogs/BlogCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Blog() {
  const { t } = useLanguage()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    blogService.getAll().then((res) => setBlogs(res.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">{t.blog.pageTitle}</h1>
      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
        </div>
      )}
    </div>
  )
}

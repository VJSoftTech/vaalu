import { useEffect, useState } from 'react'
import { blogService } from '@/services/blogService'
import type { Blog } from '@/types'
import BlogCard from '@/components/blogs/BlogCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    blogService.getAll().then((res) => setBlogs(res.data)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
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

export interface Blog {
  id: number
  title: string
  slug: string
  content: string
  featured_image: string
  author_id: number
  author_name?: string
  category?: string
  tags?: string[]
  published_at: string
  views?: number
}

export interface BlogFormData {
  title: string
  content: string
  featured_image?: string
}

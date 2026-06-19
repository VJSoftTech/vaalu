export interface Video {
  id: number
  youtube_id: string
  title: string
  thumbnail: string
  duration: string
  is_featured: boolean
  category?: string
  description?: string
  created_at?: string
}

export interface VideoFormData {
  youtube_id: string
  title: string
  thumbnail?: string
  duration: string
  is_featured: boolean
  category?: string
  description?: string
}

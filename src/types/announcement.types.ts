export type AnnouncementPriority = 'normal' | 'important' | 'urgent'

export interface Announcement {
  id: number
  title: string
  message: string
  image: string
  link_url: string
  priority: AnnouncementPriority
  is_active: boolean
  start_date: string | null
  end_date: string | null
  created_at: string
  is_read?: boolean
}

export interface AnnouncementFormData {
  title: string
  message: string
  image?: File
  link_url?: string
  priority: AnnouncementPriority
  is_active: boolean
  start_date?: string
  end_date?: string
}

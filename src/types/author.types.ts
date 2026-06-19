export interface Author {
  id: number
  name: string
  biography: string
  photo: string
  social_links: {
    website?: string
    facebook?: string
    twitter?: string
    instagram?: string
  }
  books_count?: number
}

export interface AuthorFormData {
  name: string
  biography: string
  photo?: string
  social_links: {
    website?: string
    facebook?: string
    twitter?: string
    instagram?: string
  }
}

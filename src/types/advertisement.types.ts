export interface Advertisement {
  id: number
  title: string
  subtitle?: string
  banner_image: string
  redirect_url: string
  start_date: string
  end_date: string
  is_active: boolean
  type: 'hero' | 'banner' | 'festival' | 'countdown' | 'gift'
  display_order: number
}

export interface AdvertisementFormData {
  title?: string
  subtitle?: string
  banner_image?: File
  redirect_url: string
  start_date: string
  end_date: string
  is_active: boolean
  type: 'hero' | 'banner' | 'festival' | 'countdown' | 'gift'
  display_order: number
}

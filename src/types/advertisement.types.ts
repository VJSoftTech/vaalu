export interface Advertisement {
  id: number
  title: string
  banner_image: string
  redirect_url: string
  start_date: string
  end_date: string
  is_active: boolean
  type?: 'banner' | 'festival' | 'countdown' | 'gift'
}

export interface AdvertisementFormData {
  title: string
  banner_image?: File
  redirect_url: string
  start_date: string
  end_date: string
  is_active: boolean
  type?: 'banner' | 'festival' | 'countdown' | 'gift'
}

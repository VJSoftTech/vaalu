export interface BookDonation {
  id: number
  name: string
  email: string
  phone_number: string
  best_time_to_call: string
  comments: string
  status: string
  created_at: string
}

export interface BookDonationFormData {
  name: string
  email: string
  phone_number: string
  best_time_to_call: string
  comments?: string
}

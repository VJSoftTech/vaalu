export type CorporateEnquiryType = 'Bulk Order' | 'Book Fair' | 'Both'

export interface CorporateEnquiry {
  id: number
  company_name: string
  contact_person_name: string
  email: string
  phone_number: string
  best_time_to_call: string
  enquiry_type: CorporateEnquiryType
  comments: string
  status: string
  created_at: string
}

export interface CorporateEnquiryFormData {
  company_name: string
  contact_person_name: string
  email?: string
  phone_number: string
  best_time_to_call?: string
  enquiry_type: CorporateEnquiryType
  comments?: string
}

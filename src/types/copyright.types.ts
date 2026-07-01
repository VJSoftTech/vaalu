export type CopyrightEnquiryType = 'Translation Rights' | 'Reprint Rights' | 'Adaptation Rights' | 'Other'

export interface CopyrightEnquiry {
  id: number
  applicant_name: string
  email: string
  phone_number: string
  book_id: number | null
  book_title?: string
  enquiry_type: CopyrightEnquiryType
  comments: string
  status: string
  created_at: string
}

export interface CopyrightEnquiryFormData {
  applicant_name: string
  email: string
  phone_number: string
  book_id: number | ''
  enquiry_type: CopyrightEnquiryType
  comments?: string
}

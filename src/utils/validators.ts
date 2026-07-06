import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author_id: z.number().positive('Author is required'),
  category_id: z.number().positive('Category is required'),
  isbn: z.string().min(10, 'Invalid ISBN').max(13, 'Invalid ISBN'),
  description: z.string().min(10, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  discount_price: z.number().positive().optional(),
  stock_quantity: z.number().int().min(0, 'Stock cannot be negative'),
  rating: z.number().min(0, 'Rating cannot be negative').max(5, 'Rating cannot exceed 5').optional(),
  preview_pdf: z.string().optional().or(z.literal('')),
  external_url: z.string().optional().or(z.literal('')),
})

export const reviewSchema = z.object({
  customer_name: z.string().min(1, 'Name is required'),
  customer_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  rating: z.number().int().min(1, 'Please select a rating').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(5, 'Please write a few words about the book'),
})

export const authorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  biography: z.string().min(10, 'Biography is required'),
  social_links: z.object({
    website: z.string().url().optional().or(z.literal('')),
    facebook: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
  }),
})

export const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(50, 'Content is too short'),
})

export const advertisementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  redirect_url: z.string().url('Invalid URL'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  is_active: z.boolean(),
})

export const giftSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  video_url: z.string().optional().or(z.literal('')),
  is_featured: z.boolean(),
  is_trending: z.boolean(),
  is_active: z.boolean(),
})

export const staffUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'staff']),
  is_active: z.boolean(),
})

export const staffUserEditSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  role: z.enum(['admin', 'staff']),
  is_active: z.boolean(),
})

export const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  mobile_number: z.string().min(10, 'Mobile number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const customerEditSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  mobile_number: z.string().min(10, 'Mobile number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
})

export const giftEnquirySchema = z.object({
  customer_name: z.string().min(1, 'Name is required'),
  phone_number: z.string().min(10, 'Enter a valid phone number').optional().or(z.literal('')),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  message: z.string().optional(),
})

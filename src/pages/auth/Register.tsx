import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authService } from '@/services/authService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email'),
    mobile_number: z.string().min(10, 'Invalid phone number'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

type RegisterData = z.infer<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data: RegisterData) => {
    try {
      setServerError('')
      await authService.register({
        name: data.name,
        email: data.email,
        mobile_number: data.mobile_number,
        password: data.password,
      })
      navigate('/auth/login', { state: { registered: true } })
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined
      setServerError(msg || 'Registration failed. Please try again.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Join Vaalu Pathippagam today</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{serverError}</p>
          )}
          {[
            { id: 'name', label: 'Full Name', type: 'text' },
            { id: 'email', label: 'Email', type: 'email' },
            { id: 'mobile_number', label: 'Mobile Number', type: 'tel' },
            { id: 'password', label: 'Password', type: 'password' },
            { id: 'confirm_password', label: 'Confirm Password', type: 'password' },
          ].map(({ id, label, type }) => (
            <div key={id} className="space-y-1">
              <Label htmlFor={id}>{label}</Label>
              <Input id={id} type={type} {...register(id as keyof RegisterData)} />
              {errors[id as keyof RegisterData] && (
                <p className="text-xs text-destructive">
                  {errors[id as keyof RegisterData]?.message}
                </p>
              )}
            </div>
          ))}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

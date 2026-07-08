import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema } from '@/utils/validators'
import type { LoginCredentials } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function Login() {
  const { login, isLoading, error } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({ resolver: zodResolver(loginSchema) })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(login)} className="space-y-4" autoComplete="off">
          <div className="space-y-1">
            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
            <Input id="email" type="email" autoComplete="off" {...register('email')} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
            <Input id="password" type="password" autoComplete="new-password" {...register('password')} />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          {error && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

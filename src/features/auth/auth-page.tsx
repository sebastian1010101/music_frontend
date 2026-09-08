import { zodResolver } from '@hookform/resolvers/zod'
import { Disc3, LockKeyhole, Music2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Spinner, TextField } from '@/components/ui'
import { useAuth } from '@/features/auth/use-auth'
import { loginSchema, registerSchema, type LoginValues, type RegisterValues } from '@/features/auth/schemas'
import { authService } from '@/lib/services'
import { getErrorMessage } from '@/lib/utils'

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [apiError, setApiError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const submit = handleSubmit(async (values) => {
    setApiError('')
    try {
      const { token } = await authService.login(values)
      signIn(token)
      const destination = (location.state as { from?: string } | null)?.from || '/dashboard'
      navigate(destination, { replace: true })
    } catch (error) {
      setApiError(getErrorMessage(error))
    }
  })

  return (
    <AuthLayout title="Welcome back" description="Sign in to manage your music catalog.">
      <form onSubmit={submit} className="auth-form" noValidate>
        {apiError && <div className="form-alert" role="alert">{apiError}</div>}
        <TextField label="Email address" type="email" autoComplete="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
        <TextField label="Password" type="password" autoComplete="current-password" placeholder="Enter your password" error={errors.password?.message} {...register('password')} />
        <Button type="submit" disabled={isSubmitting} className="button-full">
          {isSubmitting && <Spinner />} Sign in
        </Button>
        <p className="auth-switch">New to Resonance? <Link to="/register">Create an account</Link></p>
      </form>
    </AuthLayout>
  )
}

export function RegisterPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '' },
  })

  const submit = handleSubmit(async (values) => {
    setApiError('')
    try {
      await authService.register(values)
      const { token } = await authService.login({ email: values.email, password: values.password })
      signIn(token)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setApiError(getErrorMessage(error))
    }
  })

  return (
    <AuthLayout title="Create your account" description="Set up your catalog manager workspace.">
      <form onSubmit={submit} className="auth-form" noValidate>
        {apiError && <div className="form-alert" role="alert">{apiError}</div>}
        <TextField label="Username" autoComplete="username" placeholder="Your display name" error={errors.username?.message} {...register('username')} />
        <TextField label="Email address" type="email" autoComplete="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
        <TextField label="Password" type="password" autoComplete="new-password" placeholder="At least 12 characters" hint="Use 12–72 UTF-8 bytes" error={errors.password?.message} {...register('password')} />
        <Button type="submit" disabled={isSubmitting} className="button-full">
          {isSubmitting && <Spinner />} Create account
        </Button>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </form>
    </AuthLayout>
  )
}

function AuthLayout({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <main className="auth-page">
      <section className="auth-visual">
        <Link to="/" className="brand brand-light"><span className="brand-mark"><Music2 /></span><span>Resonance</span></Link>
        <div className="auth-visual-copy">
          <div className="eyebrow eyebrow-light"><Disc3 size={15} /> Music catalog workspace</div>
          <h1>Your collection,<br />clearly organized.</h1>
          <p>A focused workspace for managing bands, tracks, and the details that define your catalog.</p>
        </div>
        <div className="auth-security"><LockKeyhole size={16} /><span>Secure one-hour sessions</span></div>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <div className="mobile-brand"><span className="brand-mark"><Music2 /></span>Resonance</div>
          <div className="auth-heading"><h2>{title}</h2><p>{description}</p></div>
          {children}
        </div>
      </section>
    </main>
  )
}

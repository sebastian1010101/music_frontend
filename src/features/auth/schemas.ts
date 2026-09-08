import { z } from 'zod'

const passwordBytes = (value: string) => new TextEncoder().encode(value).length

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
})

export const registerSchema = loginSchema.extend({
  username: z
    .string()
    .trim()
    .min(2, 'Username must contain at least 2 characters')
    .max(50, 'Username must contain at most 50 characters'),
  password: z
    .string()
    .refine(
      (value) => passwordBytes(value) >= 12,
      'Password must contain at least 12 bytes',
    )
    .refine(
      (value) => passwordBytes(value) <= 72,
      'Password must contain at most 72 bytes',
    ),
})

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>

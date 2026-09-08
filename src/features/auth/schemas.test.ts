import { loginSchema, registerSchema } from '@/features/auth/schemas'

describe('authentication validation', () => {
  it('accepts valid login credentials', () => {
    expect(
      loginSchema.safeParse({
        email: 'manager@example.com',
        password: 'secret',
      }).success,
    ).toBe(true)
  })

  it('enforces registration username, email, and password constraints', () => {
    const result = registerSchema.safeParse({
      username: 'x',
      email: 'invalid',
      password: 'short',
    })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues).toHaveLength(3)
  })

  it('measures non-ASCII passwords in UTF-8 bytes', () => {
    expect(
      registerSchema.safeParse({
        username: 'manager',
        email: 'manager@example.com',
        password: 'éééééé',
      }).success,
    ).toBe(true)
  })
})

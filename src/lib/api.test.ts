import { ApiError, normalizeApiError } from '@/lib/api'

describe('API error normalization', () => {
  it('uses the first validation message and preserves all details', () => {
    const error = normalizeApiError(
      { message: ['Email is invalid', 'Password is short'] },
      400,
    )
    expect(error).toBeInstanceOf(ApiError)
    expect(error.message).toBe('Email is invalid')
    expect(error.status).toBe(400)
    expect(error.details).toEqual(['Email is invalid', 'Password is short'])
  })

  it('falls back to the HTTP error label', () => {
    expect(normalizeApiError({ error: 'Not Found' }, 404).message).toBe(
      'Not Found',
    )
  })
})

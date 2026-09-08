import { bandSchema } from '@/features/bands/schemas'
import { trackSchema } from '@/features/tracks/schemas'
import { formatDuration } from '@/lib/utils'

describe('catalog validation and formatting', () => {
  it('validates band input', () => {
    expect(
      bandSchema.safeParse({ name: 'Radiohead', formatYear: 1985 }).success,
    ).toBe(true)
    expect(bandSchema.safeParse({ name: '', formatYear: -1 }).success).toBe(
      false,
    )
  })

  it('requires a valid track, duration, and band UUID', () => {
    expect(
      trackSchema.safeParse({
        title: 'Karma Police',
        length: 261,
        bandId: '36e722e1-ade5-4a70-bee6-b80ff9c2a40c',
      }).success,
    ).toBe(true)
    expect(
      trackSchema.safeParse({ title: '', length: 0, bandId: 'bad-id' }).success,
    ).toBe(false)
  })

  it('formats seconds for short and long catalog durations', () => {
    expect(formatDuration(245)).toBe('4:05')
    expect(formatDuration(3725)).toBe('1:02:05')
  })
})

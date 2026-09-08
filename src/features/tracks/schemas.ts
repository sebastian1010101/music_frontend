import { z } from 'zod'

export const trackSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Enter a track title')
    .max(50, 'Title must contain at most 50 characters'),
  length: z.coerce
    .number<number>()
    .int('Enter a whole number of seconds')
    .positive('Duration must be positive'),
  bandId: z.string().uuid('Choose a band'),
})

export type TrackValues = z.infer<typeof trackSchema>

import { z } from 'zod'

export const bandSchema = z.object({
  name: z.string().trim().min(1, 'Enter a band name'),
  formatYear: z.coerce
    .number<number>()
    .int('Enter a whole year')
    .positive('Year must be positive')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
})

export type BandValues = z.infer<typeof bandSchema>

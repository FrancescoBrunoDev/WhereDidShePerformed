import { z } from "zod"

export const EventModifyValidator = z.object({
  eventId: z.any(),
})

export type EventModifyPayload = z.infer<typeof EventModifyValidator>

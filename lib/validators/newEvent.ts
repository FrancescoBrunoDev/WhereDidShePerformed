import { z } from "zod"

import { Category } from "@prisma/client"

const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/

export const newEventValidator = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.nativeEnum(Category),
  
  date: z.string().refine(
    (value) => {
      const dateFormatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      return dateFormatRegex.test(value)
    },
    {
      message: "Invalid date format. Use yyyy-MM-ddTHH:mm:ss.sssZ",
      path: ["date"],
    }
  ),
  locationsM: z.array(z.string()),
  personsM: z.array(z.string()),
  worksM: z.array(z.string()),
  uid: z.string(),
  link: z.string(),
  comment: z.string(),
})

export type NewEventPayload = z.infer<typeof newEventValidator>

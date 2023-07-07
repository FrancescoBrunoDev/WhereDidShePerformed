import { Category, StateVerification } from "@prisma/client"
import { z } from "zod"

import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { newEventValidator } from "@/lib/validators/newEvent"

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()
    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()

    const {
      title,
      locationsM,
      personsM,
      worksM,
      date,
      category,
      uid,
      link,
      comment,
    } = newEventValidator.parse(body)

    await db.event.update({
      where: {
        uid: uid,
      },
      data: {
        title: title,
        date: date,
        category: category as Category,
        locationsM: locationsM,
        updatedAt: new Date(),
        personsM: personsM,
        worksM: worksM,
        link: link,
        comment: comment,
        stateVerification: StateVerification.NONE,
      },
    })

    await db.userEventVerification.updateMany({
      where: {
        eventId: uid,
      },
      data: {
        stateVerification: StateVerification.NONE,
      },
    })

    return new Response("success", { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }
    return new Response("cannot update event", { status: 500 })
  }
}

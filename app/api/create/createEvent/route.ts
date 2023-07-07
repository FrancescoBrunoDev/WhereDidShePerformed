import { StateVerification } from "@prisma/client"
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
      link,
      comment,
    } = newEventValidator.parse(body)

    const event = await db.event.create({
      data: {
        title: title,
        date: date,
        category: category,
        locationsM: locationsM,
        creatorId: session.user.id,
        personsM: personsM,
        worksM: worksM,
        link: link,
        comment: comment,
        stateVerification: StateVerification.NONE,
      },
    })

    await db.userEventVerification.create({
      data: {
        user: { connect: { id: session.user.id } },
        event: { connect: { uid: event.uid } },
        stateVerification: StateVerification.NONE,
      },
    })

    return new Response("success")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }
    return new Response("cannot create event", { status: 500 })
  }
}

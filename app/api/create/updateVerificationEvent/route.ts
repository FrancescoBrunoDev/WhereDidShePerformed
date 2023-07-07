import { Role, StateVerification } from "@prisma/client"
import { z } from "zod"

import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"

interface EventVerification {
  uid: string
  stateVerification: StateVerification
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()
    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    const user = await db.user.findUnique({
      where: {
        id: session?.user?.id,
      },
    })

    const body = await req.json()

    await Promise.all(
      body.map(async (event: EventVerification) => {

        console.log(event, "eventId")
         if (user?.role === Role.USER) {
          if (
            event.stateVerification === StateVerification.VERIFIED ||
            event.stateVerification === StateVerification.REJECTED
          ) {
            return new Response(
              "Forbidden. You can accept or reject an event only if you are an admin",
              { status: 403 }
            )
          }

          await db.event.updateMany({
            where: {
              uid: event.uid,
              creatorId: session.user.id,
            },
            data: {
              stateVerification: event.stateVerification as StateVerification,
            },
          })

          await db.userEventVerification.updateMany({
            where: {
              eventId: event.uid,
              userId: session.user.id,
            },
            data: {
              stateVerification: event.stateVerification as StateVerification,
            },
          })
        }

        await db.event.update({
          where: {
            uid: event.uid,
          },
          data: {
            stateVerification: event.stateVerification as StateVerification,
          },
        })

        await db.userEventVerification.updateMany({
          where: {
            eventId: event.uid,
          },
          data: {
            stateVerification: event.stateVerification as StateVerification,
          },
        }) 
      })
    )

    return new Response("success", { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }
    return new Response("cannot update validation event", { status: 500 })
  }
}

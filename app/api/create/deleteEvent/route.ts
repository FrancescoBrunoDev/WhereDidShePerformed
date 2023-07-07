import { Role } from "@prisma/client"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { EventModifyValidator } from "@/lib/validators/modifyEvent"

export async function POST(req: Request) {
  try {


    const session = await getServerSession(authOptions)

    const user = await db.user.findUnique({
      where: {
        id: session?.user?.id,
      },
      select: {
        role: true,
      },
    })

    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()

    const { eventId } = EventModifyValidator.parse(body)
    console.log(eventId, "eventId")

    await Promise.all(
      eventId.map(async (eventId: any) => {
        const event = await db.event.findUnique({
          where: {
            uid: eventId,
          },
        })

        if (!event) {
          return new Response("Event not found", { status: 404 })
        }

        if (user?.role === Role.USER) {
          if (event.creatorId !== session.user.id) {
            return new Response("Forbidden", { status: 403 })
          }
        }

        await db.userEventVerification.deleteMany({
          where: {
            eventId: eventId,
          },
        })

        await db.event.delete({
          where: {
            uid: eventId,
          },
        })
      })
    )

    return new Response("Event(s) deleted successfully", { status: 200 })
  } catch (error) {
    console.error("Error deleting event:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}

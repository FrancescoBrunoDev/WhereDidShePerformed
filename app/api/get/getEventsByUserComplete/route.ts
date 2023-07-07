import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    const session = await getAuthSession()
    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }
    const user = await db.user.findUnique({
      where: {
        id: session?.user?.id,
      },
      select: {
        role: true,
      },
    })

    if (user?.role === "USER") {
      return new Response("Unauthorized. You must be admin to use this API", {
        status: 401,
      })
    }

    const events = await db.event.findMany({
      where: {
        creatorId: userId,
      },
    })

    const resoponse = {
      events: events,
      role: user?.role,
    }

    return new Response(JSON.stringify(resoponse), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error(error)
    return new Response("Unable to retrieve users", { status: 500 })
  }
}

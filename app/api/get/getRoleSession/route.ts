import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
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

    return new Response(JSON.stringify(user), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error(error)
    return new Response("Unable to retrieve users", { status: 500 })
  }
}

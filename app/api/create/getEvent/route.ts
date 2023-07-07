import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { GetTitle } from "@/app/api/musiconn"

interface JsonObject {
  [key: string]: any
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()
    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()

    const { uid } = body
    const event = await db.event.findUnique({
      where: {
        uid: uid,
      },
    })

    if (!event) {
      return new Response("Event not found", { status: 404 })
    }

    if (!Array.isArray(event.locationsM)) {
      event.locationsM = []
    }

    if (!Array.isArray(event.personsM)) {
      event.personsM = []
    }

    if (!Array.isArray(event.worksM)) {
      event.worksM = []
    }

    const locationsWithTitle = await Promise.all(
      event.locationsM.map(async (locationMUid) => {
        const data: JsonObject = await GetTitle(locationMUid, "location")
        const title = data.location[locationMUid as string].title
        return { title, mUid: locationMUid }
      })
    )
    event.locationsM = locationsWithTitle

    const personMUidList = event.personsM.join("|")
    const data: JsonObject = await GetTitle(personMUidList, "person")

    const personsMArray = Array.isArray(event.personsM)
      ? event.personsM
      : [event.personsM]
    const personsWithTitle = personsMArray.map((personMUid) => {
      const title = data.person[personMUid as string].title
      return { title, mUid: personMUid }
    })

    event.personsM = personsWithTitle

    const workMUidList = event.worksM.join("|")
    const data2: JsonObject = await GetTitle(workMUidList, "work")

    const worksMArray = Array.isArray(event.worksM) ? event.worksM : []
    const worksWithTitle = worksMArray.map((workMUid) => {
      const title = data2.work[workMUid as string].title
      return { title, mUid: workMUid }
    })

    event.worksM = worksWithTitle

    return new Response(JSON.stringify(event))
  } catch (error) {
    console.error(error)
    return new Response("Internal Server Error", { status: 500 })
  }
}

import { connect } from "http2"
import { StateVerification } from "@prisma/client"
import { z } from "zod"

import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { newLocationMCValidator } from "@/lib/validators/newLocationMC"

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()
    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { uid, coordinateCandidateId, lat, lon, locationName } =
      newLocationMCValidator.parse(body)

    // verifico se la locationMC esiste già, se no la creo
    const locationMC = await db.locationMC.findMany({
      where: {
        uid: uid,
      },
    })

    if (locationMC.length === 0) {
      await db.locationMC.create({
        data: {
          uid: uid,
        },
      })
    }
    // verifico se la coordinateCandidateExists esiste già, se no la creo
    const coordinateCandidateExists = await db.coordinateCandidate.findUnique({
      where: {
        locationMCId_coordinateCandidateId: {
          coordinateCandidateId: coordinateCandidateId,
          locationMCId: uid,
        },
      },
    })

    console.log(coordinateCandidateExists, "coordinate")

    if (!coordinateCandidateExists) {
      await db.coordinateCandidate.create({
        data: {
          locationName: locationName,
          locationMCId: uid,
          coordinateCandidateId: coordinateCandidateId,
          lat: lat,
          lon: lon,
          votes: {
            connectOrCreate: {
              where: {
                userId_locationMCId: {
                  userId: session.user.id,
                  locationMCId: uid,
                },
              },
              create: {
                userId: session.user.id,
              },
            },
          },
        },
        include: {
          votes: true,
        },
      })
    }

    // se l'utente ha già votato per questa coordinateCandidateId, aggiorno il suo voto
    const userVoteUpdate = await db.usersVotesACandidate.findUnique({
      where: {
        userId_locationMCId: {
          userId: session.user.id,
          locationMCId: uid,
        },
      },
    })
    if (userVoteUpdate) {
      await db.usersVotesACandidate.update({
        where: {
          userId_locationMCId: {
            userId: session.user.id,
            locationMCId: uid,
          },
        },
        data: {
          coordinateCandidateId: coordinateCandidateId,
        },
      })
    } else {
      // se l'utente non ha ancora votato per questa coordinateCandidateId, creo il suo voto
      await db.usersVotesACandidate.create({
        data: {
          userId: session.user.id,
          coordinateCandidateId: coordinateCandidateId,
          locationMCId: uid,
        },
      })
    }

    return new Response("success", { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }
    return new Response("cannot create event", { status: 500 })
  }
}

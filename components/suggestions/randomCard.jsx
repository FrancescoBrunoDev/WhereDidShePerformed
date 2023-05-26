import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { motion as m } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Loading } from "@/components/loading"
import { GetInfoPerson } from "@/app/api/musiconn"

export default function RandomCard() {
  const [loading, setLoading] = useState(true)
  const [person, setPerson] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getCurrentDayNumber = () => {
          const currentDate = new Date()
          return currentDate.getDate()
        }

        const dayNumber = getCurrentDayNumber()
        const query = String(dayNumber)
        const personData = await GetInfoPerson(query)

        // Find the first performer with at least 20 events
        const performers = Object.values(personData)
        const performerWithEvents = performers.find(
          (performer) => performer.events && performer.events.length >= 20
        )

        if (performerWithEvents) {
          setPerson(performerWithEvents)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <Suspense fallback={<Loading />}>
      {person && (
        <Link href={`/${person.uid}/`}>
          <m.div
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.1 },
            }}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 5, opacity: 0 }}
          >
            <Card className="w-64 bg-secondary shadow-lg border-0">
              <CardHeader className="pb-2">
                <h2 className="text-2xl font-black">Performer of the day</h2>
              </CardHeader>
              <CardFooter className="grid grid-cols-1 gap-y-4">
                <h3 className="text-base font-black">{person.title}</h3>
                <div className="flex gap-x-1">
                  <Badge>Events {person.events.length}</Badge>
                  <Badge variant="outline" className="bg-background">
                    {person.uid}
                  </Badge>
                </div>
              </CardFooter>
            </Card>
          </m.div>
        </Link>
      )}
    </Suspense>
  )
}

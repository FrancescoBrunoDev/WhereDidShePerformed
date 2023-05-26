import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion as m, useInView } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Card, CardHeader } from "@/components/ui/card"
import { list } from "@/components/animationConst/animationConst"
import { CardItem } from "@/components/list/cardItem"
import getRandomSentenceList from "@/components/list/randomSencences"

export function CardItemMoreLeft({ location, remainingCount }) {
  // Find the highest and lowest dates
  const dates = location.eventInfo.map((event) => new Date(event.date))
  const minDate = dates.reduce(
    (min, date) => (date < min ? date : min),
    dates[0]
  )
  const maxDate = dates.reduce(
    (max, date) => (date > max ? date : max),
    dates[0]
  )

  // Format the dates as "dd-mm-yyyy"
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  return (
    <Card
      key="remaining-events"
      className="col-span-2 flex items-center justify-center bg-secondary shadow-lg"
    >
      <CardHeader className="flex gap-y-2">
        <div className=" text-sm font-bold">
          There are still {remainingCount}{" "}
          {remainingCount === 1 ? "event" : "events"} remaining. I recommend
          using filters for more effective search.
        </div>
        <div className="mt-2 text-xs">
          Events from {formatDate(minDate)} to {formatDate(maxDate)}
        </div>
      </CardHeader>
    </Card>
  )
}

export default function CardList({ locationsData, areAllFiltersDeactivated }) {
  const [sentence, setSentence] = useState(getRandomSentenceList())
  const ref = useRef(null)
  const isInView = useInView(ref)

  useEffect(() => {
    const interval = setInterval(() => {
      setSentence(getRandomSentenceList())
    }, 20000) // Update sentence every 20 seconds

    return () => {
      clearInterval(interval) // Clean up the interval on component unmount
    }
  }, [])

  if (locationsData.length === 0 && areAllFiltersDeactivated) {
    return (
      <div className="container -z-10 mx-auto">
        <div className="flex h-[90vh] items-center justify-center text-center">
          <AnimatePresence initial={false} mode="wait">
            <m.div
              key={sentence}
              className="max-w-sm rounded-lg bg-secondary p-2 text-sm font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {sentence}
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return (
    <div className="container -z-10 mx-auto pt-72">
      {locationsData.map((city) => {
        const hasEvents = city.locations.some(
          (location) => location.eventInfo.length > 0
        )
        if (!hasEvents) {
          return null // Skip rendering the city if it has no events
        }
        return (
          <m.div variants={list} key={city.key}>
            <div className="mb-5 mt-7 flex items-center space-x-2">
              <h1 className="text-4xl font-black leading-none">{city.city}</h1>{" "}
            </div>
            {city.locations.map((location) => {
              if (location.eventInfo.length === 0) {
                return null // Skip rendering the location if it has no events
              }
              return (
                <m.div variants={list} key={location.locationId}>
                  <div className="mb-5 mt-7 flex items-center space-x-2">
                    <h1 className="text-lg font-black leading-none">
                      {location.title}
                    </h1>{" "}
                    <Badge className="flex h-6 w-14 justify-center">
                      {location.locationId}
                    </Badge>
                  </div>
                  <m.div
                    variants={list}
                    className="grid grid-flow-row grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                  >
                    {location.eventInfo.map((event, index) => {
                      if (index < 20) {
                        return <CardItem event={event} />
                      } else if (index === 20) {
                        const remainingCount = location.eventInfo.length - 20
                        if (remainingCount < 20) {
                          return <CardItem event={event} />
                        } else {
                          return (
                            <CardItemMoreLeft
                              location={location}
                              remainingCount={remainingCount}
                            />
                          )
                        }
                      }
                      return null
                    })}
                  </m.div>
                </m.div>
              )
            })}
          </m.div>
        )
      })}
    </div>
  )
}

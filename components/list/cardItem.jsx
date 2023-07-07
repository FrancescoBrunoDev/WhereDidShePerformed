import Link from "next/link"
import { linkMaker } from "@/utils/linkMaker"
import { motion as m } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader } from "@/components/ui/card"
import { item } from "@/components/animationConst/animationConst"
import { useStoreFiltersMap } from "@/store/useStoreFiltersMap"

export function CardItem({ event }) {
  const title = event.eventTitle
  const cleanedTitleLink = linkMaker(title)

  const expandedLocations = useStoreFiltersMap(
    (state) => state.expandedLocations
  )

  return (
    <m.div variants={item} initial="hidden" animate="visible" exit="hidden">
      <Card className="border-none">
        <CardHeader>
          <div className="flex items-center text-lg">
            <div className="w-8">
              <Link
                href={`https://performance.musiconn.de/event/${cleanedTitleLink}`}
                target="_blank"
              >
                <Badge className="-z-10 flex w-14 origin-center -translate-x-3 -rotate-90 justify-center">
                  {event.eventId}
                </Badge>
              </Link>
            </div>
            <div className="grid w-full grid-cols-1 justify-center gap-2">
              <div className="text-c inline-flex items-center rounded-lg bg-secondary px-2.5 py-0.5 text-xs font-bold">
                {event.date}
              </div>
              <div className="inline-flex items-center rounded-lg bg-secondary px-2.5 py-0.5 text-xs font-semibold">
                {event.eventCategory === 1
                  ? "Season"
                  : event.eventCategory === 2
                  ? "Concert"
                  : event.eventCategory === 3
                  ? "Religious Event"
                  : event.eventCategory === 4
                  ? "Music Theater"
                  : event.eventCategory}
              </div>
            </div>
          </div>

          {expandedLocations && event.composerNamesArray && event.composerNamesArray.length > 0 && (
            <m.div
              key={event.composerNamesArray}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center rounded-lg bg-secondary px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <m.span>
                {event.composerNamesArray.map((composer, index) => (
                  <m.span key={composer?.title}>
                    {composer?.title}
                    {index < event.composerNamesArray.length - 1 && " • "}
                  </m.span>
                ))}
              </m.span>
            </m.div>
          )}
        </CardHeader>
      </Card>
    </m.div>
  )
}

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
      className="col-span-2 flex items-center justify-center border-none bg-secondary shadow-lg"
    >
      <CardHeader className="flex gap-y-2">
        <div className=" text-sm font-bold">
          There are {remainingCount} more{" "}
          {remainingCount === 1 ? "event" : "events"} remaining. I recommend
          using filters for more effective search.
        </div>
        <CardDescription className="text-xs">
          Events from {formatDate(minDate)} to {formatDate(maxDate)}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

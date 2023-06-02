import { motion as m } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Card, CardHeader } from "@/components/ui/card"
import { item } from "@/components/animationConst/animationConst"

export function CardItem({ event }) {
  return (
    <m.div
      key={event.eventId}
      variants={item}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center text-lg">
            <div className="w-8">
              <Badge className="-z-10 flex w-14 origin-center -translate-x-3 -rotate-90 justify-center">
                {event.eventId}
              </Badge>
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

          {event.composerNamesArray && event.composerNamesArray.length > 0 && (
            <m.div
              key={event.composerNamesArray}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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

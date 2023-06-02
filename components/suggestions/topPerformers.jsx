import Link from "next/link"
import { motion as m } from "framer-motion"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

import statistic from "./statistic.json"

export default function TopPerfomers() {
  const topComposers = statistic.topComposers
  const performersByComposer = statistic.performersByComposer

  // Sorting the performersByComposer array based on topComposers
  performersByComposer.sort((a, b) => {
    const composerIdA = a.composerId
    const composerIdB = b.composerId

    // Finding the index of composerId in topComposers
    const indexA = topComposers.findIndex(
      (composer) => composer.composerId === composerIdA
    )
    const indexB = topComposers.findIndex(
      (composer) => composer.composerId === composerIdB
    )

    // Sorting based on the index in topComposers
    return indexA - indexB
  })

  return (
    <Card className="w-[600px] shrink-0">
      <CardHeader className="pb-2">
        <div className="grid grid-cols-4">
          <CardTitle>Wall of Fame 💪</CardTitle>
          <div className="col-span-3">
            <CardDescription>
              Who is the performer with the most performances for each of the 30
              top composers?
            </CardDescription>
            <CardDescription className="flex justify-end font-black">
              works played
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-72">
        <ScrollArea className="h-full shrink-0">
          {performersByComposer.map(
            ({ performerId, performerName, composerName, count }, index) => (
              <div key={composerName} className="grid grid-cols-2 gap-2">
                <div className="col-span-1 grid grid-cols-6">
                  <h1 className="col-span-1 font-black">{index + 1}</h1>
                  <div className="col-span-5">
                    <h2 className="p-1 text-right text-sm">
                      {composerName.replace(/\s\(\d{4}–\d{4}\)/, "")}
                    </h2>
                  </div>
                </div>
                <div className="col-span-1 grid grid-cols-6">
                  <Link
                    key={performerId}
                    href={`/perfomer/${performerId}/`}
                    className="col-span-5"
                  >
                    <m.h2
                      whileHover={{
                        scale: 1.01,
                        transition: { duration: 0.1 },
                      }}
                      className=" rounded-lg p-1 text-sm hover:bg-secondary"
                    >
                      {performerName.replace(/\s\(\d{4}–\d{4}\)/, "")}
                    </m.h2>
                  </Link>
                  <h3 className="col-span-1 w-10 py-1 pr-3 text-right text-sm">
                    {count}
                  </h3>
                </div>
              </div>
            )
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

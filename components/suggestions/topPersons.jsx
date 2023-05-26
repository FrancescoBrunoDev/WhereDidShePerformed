import Link from "next/link"
import { motion as m } from "framer-motion"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import statistic from "./statistic.json"

export function TopPersons() {
  const performer = statistic.topPerformers
  const composers = statistic.topComposers
  const sortedPerformer = performer.sort((a, b) => b.count - a.count)
  const sortedComposers = composers.sort((a, b) => b.count - a.count)
  return (
    <Tabs defaultValue="performers" className="w-[400px] shrink-0">
      <TabsList className="mb-2 grid w-full grid-cols-2">
        <TabsTrigger value="composers">Composers</TabsTrigger>
        <TabsTrigger value="performers">Performers</TabsTrigger>
      </TabsList>

      <TabsContent value="composers">
        <Card className="">
          <CardHeader className="pb-0">
            <CardTitle className="text-2xl font-black">
              Most played composers
            </CardTitle>
            <CardDescription className="flex justify-end font-black">
              played for
            </CardDescription>
          </CardHeader>
          <CardContent className="flex h-64 flex-col">
            <ScrollArea className="h-full">
              {sortedComposers.map(
                ({ composerId, composerName, count }, index) => (
                  <div
                    key={composerId}
                    className="flex-cols-2 flex justify-between px-3"
                  >
                    <div className="flex-cols-3 flex">
                      <h1 className="w-10 font-black">{index + 1}</h1>
                      <h2 className="pr-3 text-sm">{composerName}</h2>
                    </div>
                    <h3 className="w-20 text-right text-sm">{count}</h3>
                  </div>
                )
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="performers">
        <Card className="">
          <CardHeader className="pb-0">
            <CardTitle className="text-2xl font-black">
              Most active performers
            </CardTitle>
            <CardDescription className="flex justify-end font-black">
              Events
            </CardDescription>
          </CardHeader>
          <CardContent className="flex h-64 flex-col">
            <ScrollArea className="h-full">
              {sortedPerformer.map(
                ({ performerId, performerName, count }, index) => (
                  <Link key={performerId} href={`/${performerId}/`}>
                    <m.div
                      whileHover={{
                        scale: 1.01,
                        transition: { duration: 0.1 },
                      }}
                      className="flex-cols-2 flex justify-between space-y-1 rounded-lg px-3 py-1 hover:bg-secondary"
                    >
                      <div className="flex-cols-3 flex">
                        <h1 className="w-10 font-black">{index + 1}</h1>
                        <h2 className="pr-3 text-sm">{performerName}</h2>
                      </div>
                      <h3 className="w-20 text-right text-sm">{count}</h3>
                    </m.div>
                  </Link>
                )
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

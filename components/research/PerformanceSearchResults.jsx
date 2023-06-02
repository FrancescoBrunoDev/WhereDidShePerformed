import { Suspense } from "react"
import Link from "next/link"
import { motion as m } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { item, list } from "@/components/animationConst/animationConst"
import { Loading } from "@/components/loading"

import getRandomSentenceWithEmoji from "./randomSencences"

export default function PerformanceSearchResults({ results }) {
  if (!results || results.length === 0) {
    return null
  }

  if (!results[0].person) {
    return (
      <m.div
        initial="hidden"
        animate="visible"
        variants={list}
        className="mt-20 flex justify-center"
      >
        <div className="rounded-lg bg-secondary p-2">
          <p className="text-sm">no result found</p>
        </div>
      </m.div>
    )
  }

  const content = Object.keys(results[0].person).map((personId) => {
    const person = results[0].person[personId]
    const event = results[0].person[personId].events.count

    if (person.title.includes("<mark>")) {
      return null // Exclude this person from the regular mapping
    } else {
      return (
        <m.div key={person.uid} variants={item}>
          <Link href={`/perfomer/${person.uid}/`}>
            <Card key={person.uid}>
              <CardHeader>{person.title}</CardHeader>
              <CardFooter className="gap-x-1">
                <Badge>Events {event}</Badge>
                <Badge variant="secondary">{person.uid}</Badge>
              </CardFooter>
            </Card>
          </Link>
        </m.div>
      )
    }
  })

  // Find the person with the "<mark>" title
  const markedPerson = Object.keys(results[0].person).find((personId) => {
    const person = results[0].person[personId]
    return person.title.includes("<mark>")
  })

  if (markedPerson) {
    const person = results[0].person[markedPerson]
    const event = results[0].person[markedPerson].events.count
    const cleanedTitle = person.title.replace(/<\/?mark>/g, "")
    const sentenceWithEmoji = getRandomSentenceWithEmoji()

    content.unshift(
      <m.div variants={item} key={person.uid} className="col-span-2">
        <Link href={`/perfomer/${person.uid}/`}>
          <Card key={person.uid} className="border-0 bg-accent shadow-lg">
            <CardHeader>
              <span>{sentenceWithEmoji}</span>
              <span style={{ fontWeight: "bold" }}>{cleanedTitle}</span>
            </CardHeader>
            <CardFooter className="gap-x-1">
              <Badge>Events {event}</Badge>
              <Badge variant="outline">{person.uid}</Badge>
            </CardFooter>
          </Card>
        </Link>
      </m.div>
    )
  } else {
    content.unshift(
      <m.div variants={item} className="col-span-2">
        <Card
          key="no-results"
          className="border-0 bg-accent text-center shadow-lg"
        >
          <CardHeader className="font-bold">
            <span>Tip</span>
          </CardHeader>
          <CardFooter className="gap-x-1">
            <span>
              Mmm, that&apos;s strange. No luck finding a match! Are you in
              search of a composer? Just a friendly reminder that Musiconn
              Performance database primarily focuses on performers, not
              composers. 🎹
            </span>
          </CardFooter>
        </Card>
      </m.div>
    )
  }

  return (
    <m.div
      initial="hidden"
      animate="visible"
      variants={list}
      className="xs:grid-cols-1 grid grid-flow-row place-content-stretch gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      <Suspense fallback={<Loading />}>{content}</Suspense>
    </m.div>
  )
}

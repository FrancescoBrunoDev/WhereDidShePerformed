import { useEffect, useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"

interface ResultFoundProps {
  dateUids: any[]
  startDate: string
  endDate: string
  searchData: boolean
  setResults: (results: any) => void
}

export default function ResultFound(props: ResultFoundProps) {
  const uids = props.dateUids.map((dateUids) => dateUids.uid)
  const uidString = uids.join("-")
  const timeFrame = `${props.startDate}|${props.endDate}`

  return (
    <>
      <CardHeader className={props.searchData ? "p-0" : "flex"}>
        <CardTitle className="text-center text-2xl font-black">
          {props.searchData ? null : (
            <h1>{props.dateUids.length > 1000 ? "Upsy" : "Good news!"}</h1>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent
        className={
          props.searchData
            ? "flex h-full items-center justify-center p-0"
            : "flex h-28 items-center justify-center p-0"
        }
      >
        {props.dateUids.length > 1000 ? (
          <div className="px-5 text-center text-sm font-bold">
            <div className="rounded-lg bg-secondary p-3">
              <span className="text-3xl">😰</span>
              <p className="pb-2">
                Oh boy, {uids.length} events are a lot! Sorry but I can&apos;t handle
                it at the moment.
              </p>

              <Button
                onClick={() =>
                  props.setResults({
                    filteredEvents: [],
                    startDate: "",
                    endDate: "",
                  })
                }
                variant={"destructive"}
                size={"sm"}
              >
                <Icons.undo className="h-5 w-5" />
                <span className="sr-only">undo reasearch</span>
              </Button>
            </div>
          </div>
        ) : (
          <Link href={`/date/${timeFrame}/${uidString}`}>
            <div className="flex gap-2">
              <Button size={"sm"}>
                I&apos;ve found {props.dateUids.length} events for you!
              </Button>
              <Button
                onClick={() =>
                  props.setResults({
                    filteredEvents: [],
                    startDate: "",
                    endDate: "",
                  })
                }
                variant={"destructive"}
                size={"sm"}
              >
                <Icons.undo className="h-5 w-5" />
                <span className="sr-only">undo reasearch</span>
              </Button>
            </div>
          </Link>
        )}
      </CardContent>
    </>
  )
}

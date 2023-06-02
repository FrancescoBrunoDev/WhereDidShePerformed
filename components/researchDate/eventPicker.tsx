import * as React from "react"
import { ChangeEventHandler, useState } from "react"
import { format, isAfter, isBefore, isValid, parse } from "date-fns"
import { AnimatePresence, motion as m } from "framer-motion"
import Lottie from "lottie-react"
import { DateRange } from "react-day-picker"

import { Badge } from "@/components/ui/badge"
import { Card, CardFooter } from "@/components/ui/card"
import { main } from "@/components/researchDate/EventByDateFinder"
import animationData from "@/components/researchDate/calendarAnimation.json"

import ResultFound from "./resultFound"
import SearchDates from "./searchDates"

interface DatePickerProps {
  searchData: boolean
}

interface FilteredData {
  filteredEvents: any[]
  startDate: string
  endDate: string
}

export function DatePicker(props: DatePickerProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange>()
  const [fromValue, setFromValue] = useState<string>("")
  const [toValue, setToValue] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false) // Add loading state
  const [results, setResults] = useState<FilteredData>({
    filteredEvents: [],
    startDate: "",
    endDate: "",
  })

  const handleFromChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFromValue(e.target.value)
    const date = parse(e.target.value, "y-MM-dd", new Date())
    if (!isValid(date)) {
      return setSelectedRange({ from: undefined, to: undefined })
    }
    if (selectedRange?.to && isAfter(date, selectedRange.to)) {
      setSelectedRange({ from: selectedRange.to, to: date })
    } else {
      setSelectedRange({ from: date, to: selectedRange?.to })
    }
  }

  const handleToChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setToValue(e.target.value)
    const date = parse(e.target.value, "y-MM-dd", new Date())

    if (!isValid(date)) {
      return setSelectedRange({ from: selectedRange?.from, to: undefined })
    }
    if (selectedRange?.from && isBefore(date, selectedRange.from)) {
      setSelectedRange({ from: date, to: selectedRange.from })
    } else {
      setSelectedRange({ from: selectedRange?.from, to: date })
    }
  }

  async function handleDateSubmit() {
    let startDateString: string | undefined
    let endDateString: string | undefined

    if (selectedRange?.from && selectedRange?.to) {
      startDateString = format(selectedRange.from, "y-MM-dd")
      endDateString = format(selectedRange.to, "y-MM-dd")
    } else if (
      isValid(parse(fromValue, "y-MM-dd", new Date())) &&
      isValid(parse(toValue, "y-MM-dd", new Date()))
    ) {
      startDateString = fromValue
      endDateString = toValue
    }

    if (startDateString && endDateString) {
      setLoading(true) // Start the loading animation

      const filteredEventsForDate = await main(fromValue, toValue)

      setResults(filteredEventsForDate) // Set the results if not empty

      setLoading(false) // Stop the loading animation
    } else {
      console.log("Please select a date range")
    }
  }

  return (
    <m.div>
      <Card
        className={
          props.searchData
            ? "h-full border-0 bg-transparent pb-0 shadow-none"
            : "relative h-64 w-[350px] shrink-0 shadow-lg"
        }
      >
        <AnimatePresence initial={false} mode="wait">
          <m.div
            className={
              props.searchData ? "flex h-32 items-center py-3" : "h-52"
            }
            layout
          >
            {/* Render animation when loading is true */}
            {loading ? (
              <m.div
                key={"loading"}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex h-full w-full items-center justify-center"
              >
                <Lottie
                  animationData={animationData}
                  loop={true}
                  className="w-24"
                ></Lottie>
              </m.div>
            ) : (
              <React.Fragment key={"query"}>
                <m.div
                  className="h-full w-full"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  {results.filteredEvents.length > 0 ? (
                    <ResultFound
                      setResults={setResults}
                      dateUids={results.filteredEvents}
                      startDate={results.startDate}
                      endDate={results.endDate}
                      searchData={props.searchData}
                    />
                  ) : (
                    <SearchDates
                      searchData={props.searchData}
                      handleFromChange={handleFromChange}
                      handleToChange={handleToChange}
                      fromValue={fromValue}
                      toValue={toValue}
                      handleDateSubmit={handleDateSubmit}
                    />
                  )}
                </m.div>
              </React.Fragment>
            )}
          </m.div>
        </AnimatePresence>
        {props.searchData ? null : (
          <CardFooter className=" flex h-5 w-full items-center justify-center">
            <Badge variant={"secondary"} className=" absolute bottom-3">
              <span>this function is in beta</span>
            </Badge>
          </CardFooter>
        )}
      </Card>
    </m.div>
  )
}

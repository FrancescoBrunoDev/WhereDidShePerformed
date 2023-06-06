import React, { ChangeEventHandler, useEffect, useState } from "react"
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
  const [fromValueIsValid, setFromValueIsValid] = useState<boolean>(false)
  const [toValueIsValid, setToValueIsValid] = useState<boolean>(false)
  const [fromValueIsAfterToValue, setFromValueIsAfterToValue] =
    useState<boolean>(false)

  const handleFromChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFromValue(e.target.value)
    const date = parse(e.target.value, "y-MM-dd", new Date())
    if (!isValid(date)) {
      setFromValueIsValid(false)
      setSelectedRange({ from: undefined, to: undefined })
    } else {
      setFromValueIsValid(true)
    }
    setSelectedRange({ from: date, to: selectedRange?.to })
  }

  const handleToChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setToValue(e.target.value)
    const date = parse(e.target.value, "y-MM-dd", new Date())
    if (!isValid(date)) {
      setToValueIsValid(false)
      setSelectedRange({ from: selectedRange?.from, to: undefined })
    } else {
      setToValueIsValid(true)
    }
    setSelectedRange({ from: selectedRange?.from, to: date })
  }
  // chek if the from value is after the to value
  useEffect(() => {
    if (selectedRange?.from && selectedRange?.to && isAfter(selectedRange.from, selectedRange.to)) {
      setFromValueIsAfterToValue(true)
    } else {
      setFromValueIsAfterToValue(false)
    }
  }, [selectedRange?.from, selectedRange?.to])

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

      /* 
      I can't use API becaue the request is too long      
      const res = await fetch(`/api/getEventByDate?startDateString${fromValue}&endDateString=${toValue}`);
      console.log(res, "filteredEventsForDate")
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
    
      const data = await res.json(); */

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
                      fromValueIsValid={fromValueIsValid}
                      toValueIsValid={toValueIsValid}
                      fromValueIsAfterToValue={fromValueIsAfterToValue}
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

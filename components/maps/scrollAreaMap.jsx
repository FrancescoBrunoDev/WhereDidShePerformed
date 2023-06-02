import { Suspense, useCallback, useState } from "react"
import { AnimatePresence, motion as m } from "framer-motion"

import {
  Accordion,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { DatePicker } from "@/components/researchDate/eventPicker"
import CarrerTimeline from "@/components/maps/careerTimeline"

import ScrollAreaItem from "./scrollAreaMapItem"

export default function ScrollAreaMap({
  locationsData,
  onLocationHover,
  lowestYear,
  highestYear,
  updateFilterHighestYear,
  setIsHover,
  filterHighestYear,
  isByCity,
  expandedLocations,
  searchData,
}) {
  const [isTimeVisible, setIsTimeVisible] = useState(false)
  const handleAccordionHover = useCallback(
    (locationId) => {
      onLocationHover(locationId)
    },
    [onLocationHover]
  )

  return (
    <Suspense>
      <m.div
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="container hidden lg:block"
      >
        <div className="fixed bottom-10 top-60 z-20 w-96">
          <m.div layout className="mb-4 mt-5 rounded-lg bg-secondary p-4">
            <m.div
              layout
              className=" flex justify-between text-xl font-black leading-none"
            >
              <m.div layout>
                {searchData ? "Pick new dates" : "Career Timeline"}
              </m.div>
              <Switch
                isChecked={isTimeVisible}
                onCheckedChange={() => setIsTimeVisible(!isTimeVisible)}
              ></Switch>
            </m.div>
            <AnimatePresence>
              {!isTimeVisible ? null : searchData ? (
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key="datePicker"
                >
                  <DatePicker searchData={searchData} />
                </m.div>
              ) : (
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key="careerTimeline"
                >
                  <CarrerTimeline
                    highestYear={highestYear}
                    lowestYear={lowestYear}
                    filterHighestYear={filterHighestYear}
                    updateFilterHighestYear={updateFilterHighestYear}
                    expandedLocations={expandedLocations}
                  />
                </m.div>
              )}
            </AnimatePresence>
          </m.div>
          
          <m.div layout>
            <h4 className="mb-4 text-2xl font-black leading-none">Locations</h4>
            <ScrollArea className="h-[30rem] w-full rounded-lg pr-2">
              <Accordion collapsible>
                <ScrollAreaItem
                  locationsData={locationsData}
                  handleAccordionHover={handleAccordionHover}
                  setIsHover={setIsHover}
                  isByCity={isByCity}
                />
              </Accordion>
            </ScrollArea>
          </m.div>
        </div>
      </m.div>
    </Suspense>
  )
}

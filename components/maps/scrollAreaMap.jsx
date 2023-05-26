import { Suspense, useCallback } from "react"
import { motion as m } from "framer-motion"

import { Accordion } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"

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
}) {
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
          <h4 className="mb-4 mt-5 text-2xl font-black leading-none">
            Career Timeline
          </h4>
          <Suspense>
            <div className="mr-3 flex items-center justify-normal space-x-2 py-1 pb-5">
              {highestYear || lowestYear ? (
                lowestYear === highestYear ? (
                  <p className="w-15 text-base">
                    It seems that I only have data for the year {lowestYear}
                  </p>
                ) : (
                  <>
                    {expandedLocations ? (
                      <div className="text-sm">The slider&apos;s value is fixed due to the active composer filter, prohibiting any modifications.</div>
                    ) : (
                      <>
                        {" "}
                        <p className="w-15 text-primary">{lowestYear}</p>
                        <Slider
                          disabled={
                            expandedLocations || lowestYear === highestYear
                              ? true
                              : false
                          }
                          defaultValue={[filterHighestYear]}
                          min={lowestYear}
                          max={highestYear}
                          step={1}
                          onValueChange={(newValue) => {
                            updateFilterHighestYear(newValue[0])
                          }}
                        />
                        <p className="w-15">{highestYear}</p>{" "}
                      </>
                    )}
                  </>
                )
              ) : null}
            </div>
          </Suspense>

          <h4 className="mb-4 text-2xl font-black leading-none">Locations</h4>

          <ScrollArea className="h-[30rem] w-full rounded-lg pr-2">
            <Accordion>
              <ScrollAreaItem
                locationsData={locationsData}
                handleAccordionHover={handleAccordionHover}
                setIsHover={setIsHover}
                isByCity={isByCity}
              />
            </Accordion>
          </ScrollArea>
        </div>
      </m.div>
    </Suspense>
  )
}

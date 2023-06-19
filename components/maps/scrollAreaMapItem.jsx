import { Suspense, useState } from "react"
import Link from "next/link"
import { linkMaker } from "@/utils/linkMaker"
import { groupBy } from "lodash"

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"

export default function ScrollAreaItem({
  locationsData,
  handleAccordionHover,
  setIsHover,
  filteredDataContinent,
  filteredDataCountry,
  isEuropeMap,
  handleSwitchToggleContinent,
  handleSwitchToggleCountry,
  activeContinents,
  activeCountries,
}) {
  const [visibleItems, setVisibleItems] = useState(20)
  console.log("locationsData", locationsData)
  return (
    <div className={!isEuropeMap ? "sflex flex-col space-y-2" : ""}>
      {Object.entries(
        groupBy(locationsData, (location) => location.continent)
      ).map(([continent]) => (
        <div key={continent}>
          {isEuropeMap ? null : (
            <Toggle
              className="pl-1"
              onPressedChange={() => handleSwitchToggleContinent(continent)}
              pressed={!activeContinents.includes(continent)}
            >
              <h1 className="rounded-lg bg-secondary px-2 py-1 text-xl font-black">
                {continent}
              </h1>
            </Toggle>
          )}

          <div className="grid grid-cols-1 space-y-1 rounded-lg bg-secondary p-1">
            {Object.entries(
              groupBy(
                filteredDataContinent.filter(
                  (city) => city.continent === continent
                ),
                "country"
              )
            ).map(([country]) => (
              <div key={country}>
                <div className="rounded-lg bg-background">
                  <Toggle
                    className={`flex w-full justify-start px-2 py-1 text-xl 
              font-black ${
                activeCountries.includes(country) && 
                "data-[state=off]:bg-secondary"
              }`}
                    onPressedChange={() => handleSwitchToggleCountry(country)}
                    pressed={!activeCountries.includes(country)}
                  >
                    <h2>{country}</h2>
                  </Toggle>
                </div>
                {!isEuropeMap
                  ? null
                  : filteredDataCountry
                      .filter(
                        (city) =>
                          city.continent === continent &&
                          city.country === country
                      )
                      .map(({ city, locations, key }) => (
                        <div
                          className="ml-4"
                          key={key}
                          onMouseEnter={() => {
                            handleAccordionHover(key)
                            setIsHover(true)
                          }}
                          onMouseLeave={() => {
                            handleAccordionHover(null)
                            setIsHover(false)
                          }}
                        >
                          <h2 className="font-black">{city}</h2>
                          {locations.map(
                            ({ locationId, title, count, eventInfo }) => {
                              const locationTitleLink = linkMaker(title)
                              return (
                                <AccordionItem
                                  className="justify-normal border-0"
                                  value={locationId}
                                  key={locationId}
                                  id={locationId}
                                >
                                  <AccordionTrigger
                                    id={locationId}
                                    className="flex justify-normal py-0 hover:no-underline"
                                  >
                                    {" "}
                                    <div className="mt-1 flex h-5 w-14 justify-center">
                                      <Link
                                        href={`https://performance.musiconn.de/location/${locationTitleLink}`}
                                        target="_blank"
                                      >
                                        <Badge className="flex w-14 justify-center">
                                          {locationId}
                                        </Badge>
                                      </Link>
                                    </div>
                                    <p className="ml-1 flex w-full justify-self-start rounded-lg px-2 py-1 text-left  hover:bg-background hover:text-primary">
                                      {title} for {count}{" "}
                                      {count === 1 ? "time" : "times"}
                                    </p>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <Suspense>
                                      {eventInfo
                                        .slice(0, visibleItems)
                                        .map(
                                          ({ eventId, date, eventTitle }) => {
                                            const cleanedTitleLink =
                                              linkMaker(eventTitle)
                                            return (
                                              <div
                                                key={eventId}
                                                className="ml-6 flex justify-normal border-0"
                                              >
                                                <div className="flex items-center justify-normal py-1">
                                                  <Link
                                                    href={`https://performance.musiconn.de/event/${cleanedTitleLink}`}
                                                    target="_blank"
                                                  >
                                                    <Badge className="flex w-14 justify-center">
                                                      {eventId}
                                                    </Badge>
                                                  </Link>
                                                </div>
                                                <div className="ml-2 flex items-center">
                                                  <p>{date}</p>
                                                </div>
                                              </div>
                                            )
                                          }
                                        )}
                                      {visibleItems < eventInfo.length && (
                                        <div className="flex w-full justify-center pb-5">
                                          <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => {
                                              setVisibleItems(
                                                (prevVisibleItems) =>
                                                  prevVisibleItems + 20
                                              )
                                            }}
                                          >
                                            Show More
                                          </Button>
                                        </div>
                                      )}
                                    </Suspense>
                                  </AccordionContent>
                                </AccordionItem>
                              )
                            }
                          )}
                        </div>
                      ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

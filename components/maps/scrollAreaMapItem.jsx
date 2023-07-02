import { Suspense, useState } from "react"
import Link from "next/link"
import { useStoreFiltersMap } from "@/store/useStoreFiltersMap"
import { useStoreSettingMap } from "@/store/useStoreSettingMap"
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

export default function ScrollAreaItem() {
  const [visibleItems, setVisibleItems] = useState(20)
  const [isEuropeMap, setIsHover] = useStoreSettingMap((state) => [
    state.isEuropeMap,
    state.setIsHover,
  ])

  const [
    locationsWithFilterCategory,
    activeCountries,
    setActiveCountries,
    activeContinents,
    setActiveContinents,
  ] = useStoreFiltersMap((state) => [
    state.locationsWithFilterCategory,
    state.activeCountries,
    state.setActiveCountries,
    state.activeContinents,
    state.setActiveContinents,
  ])

  return (
    <div className={!isEuropeMap ? "flex flex-col space-y-2" : ""}>
      {Object.entries(
        groupBy(locationsWithFilterCategory, (location) => location.continent)
      ).map(([continent]) => {
        const filteredDataContinent = locationsWithFilterCategory
          .filter((city) => !activeContinents.includes(city.continent))
          .filter((city) => city.continent === continent)
        return (
          <div key={continent}>
            {isEuropeMap ? null : (
              <Toggle
                className="pl-1"
                onPressedChange={() => setActiveContinents(continent)}
                pressed={!activeContinents.includes(continent)}
              >
                <h1 className="rounded-lg bg-secondary px-2 py-1 text-xl font-black">
                  {continent}
                </h1>
              </Toggle>
            )}

            <div className="grid grid-cols-1 space-y-1 rounded-lg bg-secondary p-1">
              {Object.entries(groupBy(filteredDataContinent, "country")).map(
                ([country]) => {
                  const filteredDataCountry = filteredDataContinent
                    .filter((city) => !activeCountries.includes(city.country))
                    .filter((city) => city.country === country)
                  return (
                    <div key={country}>
                      <div className="rounded-lg bg-background">
                        <Toggle
                          className={`flex w-full justify-start px-2 py-1 text-xl 
                        font-black ${
                          activeCountries.includes(country) &&
                          "data-[state=off]:bg-secondary"
                        }`}
                          onPressedChange={() => setActiveCountries(country)}
                          pressed={!activeCountries.includes(country)}
                        >
                          <h2>{country}</h2>
                        </Toggle>
                      </div>
                      {!isEuropeMap
                        ? null
                        : filteredDataCountry.map((city) => {
                            const hasEvents = city.locations.some(
                              (location) => location.eventInfo.length > 0
                            )
                            if (!hasEvents) {
                              return null // Skip rendering the city if it has no events
                            }
                            return (
                              <div
                                className="ml-4"
                                key={city.key}
                                onMouseEnter={() => {
                                  setIsHover(city.key)
                                }}
                                onMouseLeave={() => {
                                  setIsHover(null)
                                }}
                              >
                                <h2 className="font-black">{city.city}</h2>
                                {city.locations.map(
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
                                                ({
                                                  eventId,
                                                  date,
                                                  eventTitle,
                                                  stateVerification,
                                                }) => {
                                                  const cleanedTitleLink =
                                                    linkMaker(eventTitle)
                                                  return (
                                                    <div
                                                      key={eventId}
                                                      className="ml-6 flex justify-normal border-0"
                                                    >
                                                      <div className="flex items-center justify-normal py-1">
                                                        {stateVerification ? (
                                                          <Badge
                                                            className={
                                                              stateVerification ===
                                                              "VERIFIED"
                                                                ? "bg-green-500"
                                                                : stateVerification ===
                                                                  "REJECTED"
                                                                ? "bg-destructive"
                                                                : stateVerification ===
                                                                  "PENDING"
                                                                ? "bg-orange-500"
                                                                : stateVerification ===
                                                                  "NONE"
                                                                ? "bg-gray-500"
                                                                : ""
                                                            }
                                                          >
                                                            {stateVerification}
                                                          </Badge>
                                                        ) : (
                                                          <Link
                                                            href={`https://performance.musiconn.de/event/${cleanedTitleLink}`}
                                                            target="_blank"
                                                          >
                                                            <Badge className="flex w-14 justify-center">
                                                              {eventId}
                                                            </Badge>
                                                          </Link>
                                                        )}
                                                      </div>
                                                      <div className="ml-2 flex items-center">
                                                        <p>{date}</p>
                                                      </div>
                                                    </div>
                                                  )
                                                }
                                              )}
                                            {visibleItems <
                                              eventInfo.length && (
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
                            )
                          })}
                    </div>
                  )
                }
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

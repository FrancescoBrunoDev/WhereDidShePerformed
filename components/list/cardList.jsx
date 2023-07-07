import { use, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useStoreFiltersMap } from "@/store/useStoreFiltersMap"
import { linkMaker } from "@/utils/linkMaker"
import { AnimatePresence, motion as m, useInView } from "framer-motion"
import { groupBy } from "lodash"

import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { list } from "@/components/animationConst/animationConst"
import { CardItem, CardItemMoreLeft } from "@/components/list/cardItem"
import getRandomSentenceList from "@/components/list/randomSencences"

export default function CardList({}) {
  const [sentence, setSentence] = useState(getRandomSentenceList())

  const [
    activeCountries,
    setActiveCountries,
    activeContinents,
    setActiveContinents,
    locationsWithFilterCategory,
  ] = useStoreFiltersMap((state) => [
    state.activeCountries,
    state.setActiveCountries,
    state.activeContinents,
    state.setActiveContinents,
    state.locationsWithFilterCategory,
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setSentence(getRandomSentenceList())
    }, 20000) // Update sentence every 20 seconds

    return () => {
      clearInterval(interval) // Clean up the interval on component unmount
    }
  }, [])

  if (locationsWithFilterCategory.length === 0) {
    return (
      <div className="container -z-10 mx-auto">
        <div className="flex h-[90vh] items-center justify-center text-center">
          <AnimatePresence initial={false} mode="wait">
            <m.div
              key={sentence}
              className="max-w-sm rounded-lg bg-secondary p-2 text-sm font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {sentence}
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return (
    <div className="container -z-10 mx-auto pt-80">
      {Object.entries(
        groupBy(locationsWithFilterCategory, (location) => location.continent)
      ).map(([continent]) => {
        const filteredDataContinent = locationsWithFilterCategory
          .filter((city) => !activeContinents.includes(city.continent))
          .filter((city) => city.continent === continent)

        return (
          <div key={continent}>
            <div className="flex items-center pl-5 pt-5">
              <div className="flex items-center space-x-2 rounded-lg bg-secondary px-5 py-2">
                <h1 className="w-24 text-6xl font-black">{continent}</h1>
                <Switch
                  onCheckedChange={() => setActiveContinents(continent)}
                  name={continent}
                  checked={!activeContinents.includes(continent)}
                />
              </div>
            </div>
            {Object.entries(groupBy(filteredDataContinent, "country")).map(
              ([country]) => {
                const filteredDataCountry = filteredDataContinent
                  .filter((city) => !activeCountries.includes(city.country))
                  .filter((city) => city.country === country)
                return (
                  <div
                    key={country}
                    className="mt-5 rounded-lg bg-secondary p-5"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2 rounded-lg bg-background px-5 py-2">
                        <h2 className="text-4xl font-black">{country}</h2>
                        <Switch
                          onCheckedChange={() => setActiveCountries(country)}
                          name={country}
                          checked={!activeCountries.includes(country)}
                        />
                      </div>
                    </div>

                    {filteredDataCountry.map((city) => {
                      const hasEvents = city.locations.some(
                        (location) => location.eventInfo.length > 0
                      )
                      if (!hasEvents) {
                        return null // Skip rendering the city if it has no events
                      }

                      return (
                        <m.div variants={list} key={city.key} className="pt-5">
                          <div className="flex items-center space-x-2 ">
                            <h3 className="text-3xl font-black leading-none ">
                              {city.city}
                            </h3>
                          </div>
                          <div>
                            {city.locations.map((location) => {
                              if (location.eventInfo.length === 0) {
                                return null // Skip rendering the location if it has no events
                              }
                              const locationTitleLink = linkMaker(
                                location.title
                              )

                              return (
                                <m.div
                                  variants={list}
                                  key={location.locationId}
                                >
                                  <div>
                                    <div className="flex items-center space-x-2 pb-5 pt-3">
                                      <h1 className="text-lg font-black leading-none">
                                        {location.title}
                                      </h1>{" "}
                                      <Link
                                        href={`https://performance.musiconn.de/location/${locationTitleLink}`}
                                        target="_blank"
                                      >
                                        <Badge className="flex h-6 w-14 justify-center">
                                          {location.locationId}
                                        </Badge>
                                      </Link>
                                    </div>
                                    <m.div
                                      variants={list}
                                      className="grid grid-flow-dense grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                                    >
                                      {location.eventInfo.map(
                                        (event, index) => {
                                          if (index < 20) {
                                            return (
                                              <CardItem
                                                key={event.eventId}
                                                event={event}
                                              />
                                            )
                                          } else if (index === 20) {
                                            const remainingCount =
                                              location.eventInfo.length - 20
                                            if (remainingCount < 20) {
                                              return (
                                                <CardItem
                                                  key={event.eventId}
                                                  event={event}
                                                />
                                              )
                                            } else {
                                              return (
                                                <CardItemMoreLeft
                                                  key={event.eventId}
                                                  location={location}
                                                  remainingCount={
                                                    remainingCount
                                                  }
                                                />
                                              )
                                            }
                                          }
                                          return null
                                        }
                                      )}
                                    </m.div>
                                  </div>
                                </m.div>
                              )
                            })}
                          </div>
                        </m.div>
                      )
                    })}
                  </div>
                )
              }
            )}
          </div>
        )
      })}
    </div>
  )
}

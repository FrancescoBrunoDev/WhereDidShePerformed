"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { format, parseISO } from "date-fns"
import { LayoutGroup, motion as m } from "framer-motion"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToastAction } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import {
  checkCategoryAvailability,
  filterLocationsData,
} from "@/components/list/filterLocationsData"
import List from "@/components/list/list"
import {
  GetExpandedEventWithPerformances,
  GetLocationsWithEventsAndTitle,
} from "@/components/maps/getMergedLocations"
import MapVisualizer from "@/components/maps/mapVisualizer"
import { GetEventsDetails } from "@/app/api/musiconn"

const geoUrl =
  "https://raw.githubusercontent.com/leakyMirror/map-of-europe/27a335110674ae5b01a84d3501b227e661beea2b/TopoJSON/europe.topojson"

export default function Dates() {
  const params = useParams()
  const eventIds = params.eventIds
  const timeFrame = params.timeFrame
  const [startDateString, endDateString] = timeFrame.split("%7C")
  const startDate = parseISO(startDateString)
  const endDate = parseISO(endDateString)
  const formattedStartDate = format(startDate, "do MMM, yyyy")
  const formattedEndDate = format(endDate, "do MMM, yyyy")
  const [searchData, setSearchData] = useState(true)

  const [locationsData, setLocationsData] = useState([])
  const [id, setId] = useState(null)
  const [isByCity, setIsByCity] = useState(true) // Track the current map type

  const [mapUrl, setMapUrl] = useState(geoUrl) // Initial map URL is geoUrl
  const [isHighQuality, setIsHighQuality] = useState(true) // Track the current map type
  const [isEuropeMap, setIsGeoMap] = useState(true) // Track the current map type
  const [changeMap, setChangeMap] = useState(0) // Track if the map is changed
  const [expandedLocations, setExpandedLocations] = useState(false) // Track if the composer is expanded
  const [concerts, setConcerts] = useState(true) // Track if the concerts-filter are triggered
  const [musicTheater, setMusicTheater] = useState(true) // Track if the musicTheater-filter are triggered
  const [religiousEvent, setReligiousEvent] = useState(true) // Track if the religiousEvent-filter are triggered
  const [season, setSeason] = useState(true) // Track if the season-filter are triggered
  const [areAllFiltersDeactivated, setAreAllFiltersDeactivated] =
    useState(false)

  const [isConcertCategoryAvailable, setIsConcertCategoryAvailable] =
    useState(true)
  const [isMusicTheaterCategoryAvailable, setIsMusicTheaterCategoryAvailable] =
    useState(true)
  const [
    isReligiousEventCategoryAvailable,
    setIsReligiousEventCategoryAvailable,
  ] = useState(true)
  const [isSeasonCategoryAvailable, setIsSeasonCategoryAvailable] =
    useState(true)

  const [filteredLocationsData, setFilteredLocationsData] = useState()
  const [selectedComposerNames, setSelectedComposerNames] = useState([])
  const [locationsWithComposer, setlocationsWithComposer] = useState([])

  const handleFilterChange = () => {
    if (
      (!concerts || !isConcertCategoryAvailable) &&
      (!musicTheater || !isMusicTheaterCategoryAvailable) &&
      (!religiousEvent || !isReligiousEventCategoryAvailable) &&
      (!season || !isSeasonCategoryAvailable)
    ) {
      setAreAllFiltersDeactivated(true)
    } else {
      setAreAllFiltersDeactivated(false)
    }
  }

  useEffect(() => {
    handleFilterChange()
  }, [
    concerts,
    musicTheater,
    religiousEvent,
    season,
    isConcertCategoryAvailable,
    isMusicTheaterCategoryAvailable,
    isReligiousEventCategoryAvailable,
    isSeasonCategoryAvailable,
    handleFilterChange,
  ])

  useEffect(() => {
    async function fetchData() {
      const eventIdsArray = eventIds.split("-")
      const uidString = eventIdsArray.join("|")
      const batches = []
      for (let i = 0; i < uidString.length; i += 800) {
        const batch = uidString.slice(i, i + 800)
        batches.push(batch)
      }
      const fetchPromises = batches.map((batch) => GetEventsDetails(batch))
      const fetchResults = await Promise.all(fetchPromises)
      const events = []
      for (const fetchResult of fetchResults) {
        const batchEvents = Object.values(fetchResult).map(({ uid }) => ({
          event: uid,
        }))
        events.push(...batchEvents)
      }
      let id = {
        events: events,
      }
      const data = await GetLocationsWithEventsAndTitle(id)
      setId(id)
      setLocationsData(data)
      setSearchData(true)
    }

    if (eventIds) {
      fetchData()
    }
  }, [eventIds])

  let highestYear = null
  let lowestYear = null

  if (locationsData.length > 0) {
    locationsData.forEach(({ locations }) => {
      if (locations) {
        locations.forEach(({ eventInfo }) => {
          if (eventInfo) {
            eventInfo.forEach(({ date }) => {
              const year = Number(date.substr(0, 4))

              if (highestYear === null || year > highestYear) {
                highestYear = year
              }

              if (lowestYear === null || year < lowestYear) {
                lowestYear = year
              }
            })
          }
        })
      }
    })
  }

  let filterLowestYear = lowestYear

  const [filterHighestYear, setFilterHighestYear] = useState(highestYear)

  useEffect(() => {
    setFilterHighestYear(highestYear)
  }, [highestYear])

  const updateFilterHighestYear = (newValue) => {
    setFilterHighestYear(newValue)
  }

  useEffect(() => {
    async function fetchData() {
      const locationsWithComposer = await GetExpandedEventWithPerformances(
        id,
        locationsData
      )
      setlocationsWithComposer(locationsWithComposer)
    }

    if (expandedLocations) {
      fetchData()
    }
  }, [id, expandedLocations])

  useEffect(() => {
    filterLocationsData(
      expandedLocations,
      concerts,
      musicTheater,
      religiousEvent,
      season,
      locationsData,
      setFilteredLocationsData,
      selectedComposerNames,
      locationsWithComposer,
      filterLowestYear,
      filterHighestYear,
    )

    const seasonAvailable = checkCategoryAvailability(locationsData, 1)
    setIsSeasonCategoryAvailable(seasonAvailable)

    const concertAvailable = checkCategoryAvailability(locationsData, 2)
    setIsConcertCategoryAvailable(concertAvailable)

    const religiousEventAvailable = checkCategoryAvailability(locationsData, 3)
    setIsReligiousEventCategoryAvailable(religiousEventAvailable)

    const musicTheaterAvailable = checkCategoryAvailability(locationsData, 4)
    setIsMusicTheaterCategoryAvailable(musicTheaterAvailable)
  }, [
    expandedLocations,
    concerts,
    musicTheater,
    religiousEvent,
    season,
    locationsData,
    setFilteredLocationsData,
    selectedComposerNames,
    locationsWithComposer,
    filterLowestYear,
    filterHighestYear,
  ])

  const { toast } = useToast()

  return (
    <m.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      className="relative"
    >
      <div className="container">
        {startDateString && endDateString && (
          <h1 className="fixed top-16 z-10 w-fit text-3xl font-black md:text-4xl lg:top-32 lg:w-96">
            From {formattedStartDate}
            <br />
            to {formattedEndDate}
          </h1>
        )}
      </div>
      <Tabs defaultValue="map">
        <div className="fixed bottom-10 z-20 flex w-full justify-center lg:top-16">
          <TabsList className="flex justify-center shadow-lg lg:shadow-none">
            <TabsTrigger
              onClick={() => {
                toast({
                  title: areAllFiltersDeactivated
                    ? "It's more fun with at least one filter!"
                    : "The map is updated with your filter settings!",
                  action: (
                    <ToastAction altText="Goto schedule to undo">
                      {areAllFiltersDeactivated ? "leave me alone!" : "Thanks!"}
                    </ToastAction>
                  ),
                })
              }}
              value="map"
            >
              map
            </TabsTrigger>
            <TabsTrigger value="list">list</TabsTrigger>
          </TabsList>
        </div>

        <LayoutGroup>
          <TabsContent value="map">
            <MapVisualizer
              locationsData={filteredLocationsData}
              lowestYear={lowestYear}
              highestYear={highestYear}
              filterHighestYear={filterHighestYear}
              updateFilterHighestYear={updateFilterHighestYear}
              isByCity={isByCity}
              setIsByCity={setIsByCity}
              isHighQuality={isHighQuality}
              setIsHighQuality={setIsHighQuality}
              isEuropeMap={isEuropeMap}
              setIsGeoMap={setIsGeoMap}
              changeMap={changeMap}
              setChangeMap={setChangeMap}
              mapUrl={mapUrl}
              setMapUrl={setMapUrl}
              expandedLocations={expandedLocations}
              searchData={searchData}
            />
          </TabsContent>
          <TabsContent value="list">
            {filteredLocationsData && (
              <List
                filteredLocationsData={filteredLocationsData}
                setExpandedLocations={setExpandedLocations}
                setConcerts={setConcerts}
                setMusicTheater={setMusicTheater}
                setReligiousEvent={setReligiousEvent}
                setSeason={setSeason}
                isConcertCategoryAvailable={isConcertCategoryAvailable}
                isMusicTheaterCategoryAvailable={
                  isMusicTheaterCategoryAvailable
                }
                isReligiousEventCategoryAvailable={
                  isReligiousEventCategoryAvailable
                }
                isSeasonCategoryAvailable={isSeasonCategoryAvailable}
                concerts={concerts}
                musicTheater={musicTheater}
                religiousEvent={religiousEvent}
                season={season}
                areAllFiltersDeactivated={areAllFiltersDeactivated}
                expandedLocations={expandedLocations}
                setSelectedComposerNames={setSelectedComposerNames}
                selectedComposerNames={selectedComposerNames}
                searchData={searchData}
              />
            )}
          </TabsContent>
        </LayoutGroup>
      </Tabs>
      <Toaster />
    </m.section>
  )
}

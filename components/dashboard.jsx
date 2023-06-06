"use client"

import { useEffect, useState } from "react"
import { useViewportSize } from "@mantine/hooks"
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
import { GetExpandedEventWithPerformances } from "@/components/maps/getExpandedLocations"
import MapVisualizer from "@/components/maps/mapVisualizer"
import { GetInfoPerson } from "@/app/api/musiconn"

const geoUrl =
  "https://raw.githubusercontent.com/leakyMirror/map-of-europe/27a335110674ae5b01a84d3501b227e661beea2b/TopoJSON/europe.topojson"

export default function Dashboard({ params }) {
  const [locationsData, setLocationsData] = useState([])
  const [id, setId] = useState(null)
  const { timeFrame } = params
  const [searchData, setSearchData] = useState(timeFrame !== undefined)
  let startDate, endDate, formattedStartDate, formattedEndDate

  if (timeFrame !== undefined) {
    const [startDateString, endDateString] = timeFrame.split("%7C")
    startDate = parseISO(startDateString)
    endDate = parseISO(endDateString)
    formattedStartDate = format(startDate, "do MMM, yyyy")
    formattedEndDate = format(endDate, "do MMM, yyyy")
  }

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

  const { width } = useViewportSize()
  //select and show accordingly the map
  const [thereIsMoreInWorld, setThereIsMoreInWorld] = useState(false)
  const [thereIsMoreInWorldPopup, setThereIsMoreInWorldPopup] = useState(false)
  // filter from list
  const [activeContinents, setActiveContinents] = useState([])
  const [activeCountries, setActiveCountries] = useState([])

  const handleSwitchToggleContinent = (continent) => {
    setActiveContinents((prev) =>
      prev.includes(continent)
        ? prev.filter((c) => c !== continent)
        : [...prev, continent]
    )
  }
  const handleSwitchToggleCountry = (country) => {
    setActiveCountries((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country]
    )
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setThereIsMoreInWorldPopup(false)
    }, 10000)

    return () => clearTimeout(timeoutId)
  }, [])

  const filteredLocationsDataViewMap = isEuropeMap
    ? filteredLocationsData?.filter((location) => location.continent === "EU")
    : filteredLocationsData

  useEffect(() => {
    if (filteredLocationsData && filteredLocationsData.length > 0) {
      const nonEuLocations = filteredLocationsData.filter(
        (location) => location.continent !== "EU"
      )
      if (nonEuLocations.length > 0) {
        setThereIsMoreInWorld(true)
        setThereIsMoreInWorldPopup(true)
        setTimeout(() => {
          setThereIsMoreInWorldPopup(false)
        }, 5000)
      } else {
        setThereIsMoreInWorld(false)
      }
    }
  }, [filteredLocationsData])

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

  const { performerId } = params
  const { eventIds } = params

  const searchId = performerId ? performerId : eventIds
  const searchKind = performerId ? "performerId" : "eventIds"

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `/api/getMergedLocations?${searchKind}=${searchId}`
      )

      if (!res.ok) {
        throw new Error("Failed to fetch data")
      }

      const data = await res.json()
      setLocationsData(data)
    }

    if (performerId || eventIds) {
      fetchData()
    }
  }, [performerId, eventIds])

  useEffect(() => {
    async function getData() {
      const data = await GetInfoPerson(performerId)
      setId(data[performerId])
    }
    if (performerId) {
      getData()
    }
  }, [performerId, eventIds])

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
        locationsData,
        eventIds
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
      filterHighestYear
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

  // filter list
  const filteredDataContinent = filteredLocationsData
    ? filteredLocationsData.filter(
        (location) => !activeContinents.includes(location.continent)
      )
    : locationsData.filter(
        (location) => !activeContinents.includes(location.continent)
      )

  const filteredDataCountry = filteredDataContinent.filter(
    (location) => !activeCountries.includes(location.country)
  )

  const { toast } = useToast()
  return (
    <m.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
    >
      <div className="container">
        {id && (
          <div className="fixed top-16 z-10 w-fit text-3xl font-black md:text-4xl lg:top-32 lg:w-96">
            <h1>{id.title}</h1>
          </div>
        )}
        {timeFrame && (
          <h1 className="fixed top-16 z-10 w-fit text-3xl font-black md:text-4xl lg:top-32 lg:w-96">
            From {formattedStartDate}
            <br />
            to {formattedEndDate}
          </h1>
        )}
      </div>
      <Tabs defaultValue="map">
        <div
          className={
            // It can't be done with tailwind because otherwise it makes the items in the list not clickable
            width < 1024
              ? "fixed bottom-10 z-20 flex w-full justify-center"
              : "fixed top-16 z-20 flex w-full justify-center"
          }
        >
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
              locationsData={filteredLocationsDataViewMap}
              lowestYear={lowestYear}
              highestYear={highestYear}
              filterHighestYear={filterHighestYear}
              updateFilterHighestYear={updateFilterHighestYear}
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
              thereIsMoreInWorld={thereIsMoreInWorld}
              thereIsMoreInWorldPopup={thereIsMoreInWorldPopup}
              filteredDataContinent={filteredDataContinent}
              filteredDataCountry={filteredDataCountry}
              handleSwitchToggleContinent={handleSwitchToggleContinent}
              handleSwitchToggleCountry={handleSwitchToggleCountry}
              activeContinents={activeContinents}
              activeCountries={activeCountries}
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
                activeContinents={activeContinents}
                activeCountries={activeCountries}
                filteredDataContinent={filteredDataContinent}
                filteredDataCountry={filteredDataCountry}
                handleSwitchToggleContinent={handleSwitchToggleContinent}
                handleSwitchToggleCountry={handleSwitchToggleCountry}
              />
            )}
          </TabsContent>
        </LayoutGroup>
      </Tabs>
      <Toaster />
    </m.section>
  )
}

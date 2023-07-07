"use client"

import { useEffect } from "react"
import { useStoreFiltersMap } from "@/store/useStoreFiltersMap"
import { useStoreSearchByDate } from "@/store/useStoreSearchByDate"
import { useViewportSize } from "@mantine/hooks"
import { format, parseISO } from "date-fns"
import { LayoutGroup, motion as m } from "framer-motion"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import List from "@/components/list/list"
import { Loading } from "@/components/loading"
import MapVisualizer from "@/components/maps/mapVisualizer"
import { GetInfoPerson } from "@/app/api/musiconn"

export default function Dashboard({ params }) {
  const [
    id,
    setId,
    locationsData,
    setLocationsData,
    isCategoryAvailable,
    applyCategoryFilters,
    categoryFiltersActive,
    filterHighestYear,
    activeContinents,
    activeCountries,
    getAvaiableComposers,
    expandedLocations,
    selectedComposerNames,
    findHigestYear,
    setSearchData,
  ] = useStoreFiltersMap((state) => [
    state.id,
    state.setId,
    state.locationsData,
    state.setLocationsData,
    state.isCategoryAvailable,
    state.applyCategoryFilters,
    state.categoryFiltersActive,
    state.filterHighestYear,
    state.activeContinents,
    state.activeCountries,
    state.getAvaiableComposers,
    state.expandedLocations,
    state.selectedComposerNames,
    state.findHigestYear,
    state.setSearchData,
  ])

  const date = useStoreSearchByDate((state) => state.date)
  let startDate, endDate, formattedStartDate, formattedEndDate
  const { timeFrame } = params

  if (timeFrame !== undefined) {
    const [startDateString, endDateString] = timeFrame.split("%7C")
    startDate = parseISO(startDateString)
    endDate = parseISO(endDateString)
    formattedStartDate = format(startDate, "do MMM, yyyy")
    formattedEndDate = format(endDate, "do MMM, yyyy")
  }

  const { width } = useViewportSize()

  // fetch data

  const { performerId } = params
  const { userId } = params
  const eventIds = date.filteredEvents

  const searchId = performerId ? performerId : eventIds ? eventIds : userId
  const searchKind = performerId
    ? "performerId"
    : eventIds
    ? "eventIds"
    : "userId"

  useEffect(() => {
    async function fetchData() {
      setLocationsData([])
      setId(null)
      const res = await fetch(
        `/api/getMergedLocations?${searchKind}=${searchId}`
      )

      if (!res.ok) {
        throw new Error("Failed to fetch data")
      }

      if (timeFrame !== undefined) {
        setSearchData(true)
      }

      const data = await res.json()
      setLocationsData(data)
      isCategoryAvailable()
      findHigestYear()
    }

    if (performerId || eventIds || userId) {
      fetchData()
    }
  }, [
    performerId,
    eventIds,
    userId,
    searchKind,
    searchId,
    timeFrame,
    findHigestYear,
    isCategoryAvailable,
    setSearchData,
    setLocationsData,
  ])

  useEffect(() => {
    async function getData() {
      const data = await GetInfoPerson(performerId)
      setId(data[performerId])
    }
    if (performerId) {
      getData()
    }
  }, [performerId, eventIds, userId, setId])

  useEffect(() => {
    if (expandedLocations) {
      getAvaiableComposers(id, locationsData, eventIds)
      applyCategoryFilters()
    }
  }, [expandedLocations, id, locationsData, eventIds, getAvaiableComposers])

  // FILTERS

  useEffect(() => {
    applyCategoryFilters()
  }, [
    categoryFiltersActive,
    filterHighestYear,
    activeCountries,
    activeContinents,
    expandedLocations,
    selectedComposerNames,
    applyCategoryFilters,
  ])

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
              ? "fixed bottom-10 z-20 flex w-full scale-125 justify-center"
              : "fixed top-16 z-20 flex w-full justify-center"
          }
        >
          <TabsList className="flex justify-center shadow-lg lg:shadow-none">
            <TabsTrigger value="map">map</TabsTrigger>
            <TabsTrigger value="list">list</TabsTrigger>
          </TabsList>
        </div>

        <LayoutGroup>
          <TabsContent value="map">
            {locationsData.length > 0 ? <MapVisualizer /> : <Loading />}
          </TabsContent>
          <TabsContent value="list">
            <List />
          </TabsContent>
        </LayoutGroup>
      </Tabs>
      <Toaster />
    </m.section>
  )
}

import { create } from "zustand"

import { GetExpandedEventWithPerformances } from "@/components/maps/getExpandedLocations"

interface Location {
  locationId: number
  title: string
  coordinates: [number, number]
  eventInfo: EventInfo[]
  categories: { label: number }[]
  count: number
}

interface EventInfo {
  eventId: number
  date: string
  eventCategory: number
  eventTitle: string
  composerNamesArray?: composerNamesArray[]
}

interface composerNamesArray {
  title: string
}

interface City {
  key: number
  city: string
  count: number
  countLocations: number
  locations: Location[]
  coordinates: [number, number]
  country: string
  coordinatesCountry: [number, number]
  continent: string
}

interface CategoryFilter {
  state: boolean
  id: number
}

interface Filters {
  eventIds: any[]
  id: number | null
  locationsData: City[]
  activeCountries: string[]
  activeContinents: string[]
  areAllFiltersDeactivated: boolean
  selectedComposerNames: string[]
  expandedLocations: boolean
  locationsWithComposer: any[] // Update the type of this property accordingly
  categoryFiltersActive: CategoryFilter[]
  highestYear: number | null
  lowestYear: number | null
  filterHighestYear: number | null
  locationsWithFilterCategory: City[]
  avaiableComposers: any[]
  searchData: boolean
}

export const useStoreFiltersMap = create<Filters>()((set) => ({
  eventIds: [],
  id: null,
  locationsData: [],
  activeCountries: [],
  activeContinents: [],
  areAllFiltersDeactivated: false,
  selectedComposerNames: [],
  expandedLocations: false,
  locationsWithComposer: [],
  categoryFiltersActive: [],
  highestYear: null,
  lowestYear: null,
  filterHighestYear: null,
  locationsWithFilterCategory: [],
  avaiableComposers: [],
  searchData: false,

  setId: (id: number) => set({ id }),
  setSearchData: (searchData: boolean) => set({ searchData }),

  setlocationsWithComposer: (locationsWithComposer: []) =>
    set({ locationsWithComposer }),
  setLocationsData: (locationsData: []) => set({ locationsData }),
  setExpandedLocations: (expandedLocations: boolean) =>
    set({ expandedLocations }),

  setActiveCountries: (country: any) => {
    set((state: { activeCountries: any[] }) => {
      const updatedActiveCountries = state.activeCountries.includes(country)
        ? state.activeCountries.filter((c) => c !== country)
        : [...state.activeCountries, country]

      return {
        activeCountries: updatedActiveCountries,
      }
    })
  },

  setActiveContinents: (continent: any) => {
    set((state: { activeContinents: any[] }) => {
      const updatedActiveContinents = state.activeContinents.includes(continent)
        ? state.activeContinents.filter((c) => c !== continent)
        : [...state.activeContinents, continent]

      return {
        activeContinents: updatedActiveContinents,
      }
    })
  },
  setAreAllFiltersDeactivated: (areAllFiltersDeactivated: boolean) =>
    set({ areAllFiltersDeactivated }),
  setSelectedComposerNames: (name: any, checked: boolean) => {
    set((state: { selectedComposerNames: any[] }) => {
      if (checked) {
        return {
          selectedComposerNames: [...state.selectedComposerNames, name],
        }
      } else {
        const updatedSelectedComposerNames = state.selectedComposerNames.filter(
          (n) => n !== name
        )
        return {
          selectedComposerNames: updatedSelectedComposerNames,
        }
      }
    })
  },
  resetSelectedComposerNames: () => set({ selectedComposerNames: [] }),
  setCategoryFilters: (category: any) => {
    set((state: { categoryFiltersActive: any }) => {
      const currentFilterValue = state.categoryFiltersActive[category].state
      const updatedFilterValue = !currentFilterValue

      return {
        categoryFiltersActive: {
          ...state.categoryFiltersActive,
          [category]: {
            ...state.categoryFiltersActive[category],
            state: updatedFilterValue,
          },
        },
      }
    })
  },
  isCategoryAvailable: () => {
    set((state: { locationsData: any[] }) => {
      const locationsData = state.locationsData
      const categoryFiltersActive: any = {}

      locationsData.forEach((city) => {
        city.locations.forEach((location: { eventInfo: any[] }) => {
          location.eventInfo.forEach((event) => {
            const eventCategory = event.eventCategory
            if (eventCategory === 1) {
              categoryFiltersActive.Season = { state: true, id: eventCategory }
            } else if (eventCategory === 2) {
              categoryFiltersActive.Concerts = {
                state: true,
                id: eventCategory,
              }
            } else if (eventCategory === 3) {
              categoryFiltersActive.Religious_Event = {
                state: true,
                id: eventCategory,
              }
            } else if (eventCategory === 4) {
              categoryFiltersActive.Music_Theater = {
                state: true,
                id: eventCategory,
              }
            } else {
              categoryFiltersActive.Other = { state: true, id: eventCategory }
            }
          })
        })
      })

      return {
        categoryFiltersActive,
      }
    })
  },
  findHigestYear: () => {
    set((state: Filters) => {
      let highestYear: number | null = null
      let lowestYear: number | null = null

      const locationsData: City[] = state.locationsData
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
      return {
        highestYear,
        lowestYear,
        filterHighestYear: highestYear,
      }
    })
  },
  updateFilterHighestYear: (filterHighestYear: number | null) =>
    set({ filterHighestYear }),

  applyCategoryFilters: () => {
    set((state: any) => {
      const expandedLocations = state.expandedLocations
      const selectedComposerNames = state.selectedComposerNames
      const categoryFiltersActive = state.categoryFiltersActive
      const filterHighestYear = state.filterHighestYear
      const filteredData = state.locationsData
        .map((city: City) => {
          const { locations } = city

          const filteredLocations = locations.reduce(
            (filtered: Location[], location: Location) => {
              const filteredEventInfo = location.eventInfo
                .filter((event) => {
                  const composerNamesArray = event?.composerNamesArray
                  if (composerNamesArray && composerNamesArray.length > 0) {
                    const hasAllSelectedNames = selectedComposerNames.every(
                      (selectedName: string) =>
                        composerNamesArray.some(
                          (composer) => composer?.title === selectedName
                        )
                    )

                    return hasAllSelectedNames
                  }
                  if (expandedLocations && selectedComposerNames.length > 0) {
                    return false
                  }
                  return true
                })
                .filter((event: EventInfo) => {
                  const year = Number(event.date.slice(0, 4))
                  return year <= filterHighestYear
                })
                .filter((event: EventInfo) =>
                  Object.values(categoryFiltersActive).some(
                    (category: any) =>
                      category.state && event.eventCategory === category.id
                  )
                )

              const count = filteredEventInfo.length

              if (count > 0) {
                const updatedLocation: Location = {
                  ...location,
                  eventInfo: filteredEventInfo,
                  count,
                }
                filtered.push(updatedLocation)
              }

              return filtered
            },
            []
          )

          if (filteredLocations.length > 0) {
            const count = filteredLocations.reduce(
              (total, location) => total + location.count,
              0
            )
            return {
              ...city,
              locations: filteredLocations,
              count,
              countLocations: filteredLocations.length,
            }
          }

          return null
        })
        .filter((city: City | null) => city !== null)

      return {
        ...state,
        locationsWithFilterCategory: filteredData,
      }
    })
  },
  getAvaiableComposers: async (
    id: string,
    locationsData: City[],
    eventIds: string[]
  ) => {
    const composerSet = new Set()

    const locationsWithComposer = await GetExpandedEventWithPerformances(
      id,
      locationsData,
      eventIds
    )

    locationsWithComposer.forEach((city: City) => {
      city.locations.forEach((location) => {
        location.eventInfo.forEach((event) => {
          event.composerNamesArray?.forEach((composer) => {
            composerSet.add(composer?.title)
          })
        })
      })
    })

    const avaibleComposers = Array.from(composerSet).map((title) => ({ title }))

    set({
      locationsData: locationsWithComposer,
      avaiableComposers: avaibleComposers,
    })
  },
}))

import CardList from "@/components/list/cardList"
import { SettingsList } from "@/components/list/settingsList"

export default function List({
  filteredLocationsData,
  setExpandedLocations,
  setConcerts,
  setMusicTheater,
  setReligiousEvent,
  setSeason,
  isConcertCategoryAvailable,
  isMusicTheaterCategoryAvailable,
  isReligiousEventCategoryAvailable,
  isSeasonCategoryAvailable,
  concerts,
  musicTheater,
  religiousEvent,
  season,
  expandedLocations,
  areAllFiltersDeactivated,
}) {
  return (
    <>
      <SettingsList
        setConcerts={setConcerts}
        concerts={concerts}
        setExpandedLocations={setExpandedLocations}
        expandedLocations={expandedLocations}
        setMusicTheater={setMusicTheater}
        musicTheater={musicTheater}
        isConcertAvailable={isConcertCategoryAvailable}
        isMusicTheaterAvailable={isMusicTheaterCategoryAvailable}
        setReligiousEvent={setReligiousEvent}
        religiousEvent={religiousEvent}
        isReligiousEventAvailable={isReligiousEventCategoryAvailable}
        setSeason={setSeason}
        season={season}
        isSeasonAvailable={isSeasonCategoryAvailable}
        locationsData={filteredLocationsData}
      />

      <section className="relative mb-10 overflow-y-scroll lg:container">
        <CardList
          locationsData={filteredLocationsData}
          areAllFiltersDeactivated={areAllFiltersDeactivated}
        />

        <div className="fixed top-0 z-0 h-72 w-full bg-gradient-to-b from-background from-70% via-background to-transparent lg:h-80" />
      </section>
    </>
  )
}

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function FilterList({
  setConcerts,
  concerts,
  musicTheater,
  setMusicTheater,
  isConcertAvailable,
  isMusicTheaterAvailable,
  setReligiousEvent,
  religiousEvent,
  isReligiousEventAvailable,
  setSeason,
  season,
  isSeasonAvailable,
}) {
  return (
    <>
      {isConcertAvailable && (
        <div className="lg:flex-cols-2 grid grid-cols-2 items-center space-x-2 lg:flex">
          <Label>Concerts</Label>
          <Switch
            onCheckedChange={() => {
              setConcerts((prevConcerts) => !prevConcerts)
            }}
            checked={concerts}
          />
        </div>
      )}
      {isMusicTheaterAvailable && (
        <div className="lg:flex-cols-2 grid grid-cols-2 items-center space-x-2 lg:flex">
          <Label>Music Theatre</Label>
          <Switch
            onCheckedChange={() => {
              setMusicTheater((prevMusicTheater) => !prevMusicTheater)
            }}
            checked={musicTheater}
          />
        </div>
      )}
      {isReligiousEventAvailable && (
        <div className="lg:flex-cols-2 grid grid-cols-2 items-center space-x-2 lg:flex">
          <Label>Religious Event</Label>
          <Switch
            onCheckedChange={() => {
              setReligiousEvent((prevReligiousEvent) => !prevReligiousEvent)
            }}
            checked={religiousEvent}
          />
        </div>
      )}
      {isSeasonAvailable && (
        <div className=" lg:flex-cols-2 grid grid-cols-2 items-center space-x-2 lg:flex">
          <Label>Season</Label>
          <Switch
            onCheckedChange={() => {
              setSeason((prevSeason) => !prevSeason)
            }}
            checked={season}
          />
        </div>
      )}
    </>
  )
}

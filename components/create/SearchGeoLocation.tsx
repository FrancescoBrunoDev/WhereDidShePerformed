import { useEffect, useState } from "react"
import { useClickOutside } from "@mantine/hooks"
import { AnimatePresence, motion as m } from "framer-motion"

import { CoordinatesGeo, LocationGeocode } from "@/types/locationGeo"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { autocompleteGeo } from "@/app/api/geoCode"
import { Label } from "../ui/label"

interface InputAutosuggestProps {
  address: string
  setCoordinateCandidate: (coordinates: CoordinatesGeo) => void
}

export default function InputAutosuggest({
  address,
  setCoordinateCandidate,
}: InputAutosuggestProps): JSX.Element {
  const [opened, setOpened] = useState(false)
  const [searchTerm, setSearchTerm] = useState<string>(address)
  const [suggestionsGeo, setSuggestionsGeo] = useState<LocationGeocode[]>([])
  const ref = useClickOutside(() => setOpened(false))

  useEffect(() => {
    if (searchTerm) {
      const fetchSuggestions = async () => {
        try {
          const suggestions = await autocompleteGeo(searchTerm)
          setSuggestionsGeo(suggestions || [])
          if (suggestions?.length > 0) {
            setOpened(true)
          }
        } catch (error) {
          console.error(error)
        }
      }

      fetchSuggestions()
    } else {
      setSuggestionsGeo([])
    }
  }, [searchTerm])

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newSearchTerm = event.target.value
    setSearchTerm(newSearchTerm)
    setOpened(true)
  }

  function handleSuggestionClick(name: string, lat: string, lon: string, place_id: number) {
    setCoordinateCandidate({name, place_id, geometries: {lat, lon} })
    setSearchTerm(name)
    setSuggestionsGeo([])
    setOpened(false)
  }

  return (
    <div className="relative w-full">
      <Label className="text-sm">Help me find the coordinates of this place. </Label>
      <Input
        className="w-full bg-background"
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <AnimatePresence>
        {opened && suggestionsGeo.length > 0 && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            layout
            className="absolute top-12 z-20 h-64 w-full"
          >
            <ScrollArea
              ref={ref}
              className="mt-3 h-full rounded-md border bg-background shadow-lg"
            >
              <div className="p-4">
                {suggestionsGeo.map((location, index) => (
                  <div
                    className="rounded-lg p-2 text-sm hover:bg-secondary"
                    key={index}
                    onClick={() =>
                      handleSuggestionClick(
                        location.display_name,
                        location.lat,
                        location.lon,
                        location.place_id
                      )
                    }
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    {location.display_name}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}

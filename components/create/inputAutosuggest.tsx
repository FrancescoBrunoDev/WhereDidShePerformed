import { useEffect, useState } from "react"
import { useClickOutside } from "@mantine/hooks"
import { AnimatePresence, motion as m } from "framer-motion"

import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { autocomplete } from "@/app/api/musiconn"

interface InputAutosuggestProps {
  paramsAPI: string
  setFormData: React.Dispatch<React.SetStateAction<any>>
}

export default function InputAutosuggest({
  paramsAPI,
  setFormData,
}: InputAutosuggestProps): JSX.Element {
  const [opened, setOpened] = useState(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [suggestions, setSuggestions] = useState<[string, number][]>([])
  const ref = useClickOutside(() => setOpened(false))

  useEffect(() => {
    if (searchTerm) {
      const fetchSuggestions = async () => {
        try {
          const params = paramsAPI
          const suggestions = await autocomplete(searchTerm, params)
          setSuggestions(suggestions || [])
        } catch (error) {
          console.error(error)
        }
      }
      fetchSuggestions()
    } else {
      setSuggestions([])
    }
  }, [searchTerm, paramsAPI])

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newSearchTerm = event.target.value
    setSearchTerm(newSearchTerm)
    setOpened(true)
  }

  function handleSuggestionClick(suggestion: [string, number]) {
    setSearchTerm(suggestion[0])
    setSuggestions([])
    setOpened(false)
    setFormData(suggestion)
  }

  return (
    <div className="relative top-0 w-full">
      <Input
        className="w-full"
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder={`Search for a ${paramsAPI}`}
      />
      <AnimatePresence>
        {opened && suggestions.length > 0 && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            layout
            className="absolute top-10 z-20 h-64 w-full"
          >
            <ScrollArea
              ref={ref}
              className="mt-3 h-full rounded-md border bg-background shadow-lg"
            >
              <div className="p-4">
                {suggestions.map((suggestion, index) => (
                  <div
                    className="rounded-lg p-2 text-sm hover:bg-secondary"
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    {suggestion[0]}
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

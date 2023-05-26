import React, { useEffect, useState } from "react"
import { useClickOutside } from "@mantine/hooks"
import { AnimatePresence, motion as m } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { autocomplete } from "@/app/api/musiconn"

export default function PerformanceSearchForm({ onSubmit, opened, setOpened, setIsClicked }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const ref = useClickOutside(() => setOpened(false))

  useEffect(() => {
    if (searchTerm) {
      const fetchSuggestions = async () => {
        try {
          const suggestions = await autocomplete(searchTerm)
          setSuggestions(suggestions || [])
        } catch (error) {
          console.error(error)
        }
      }
      fetchSuggestions()
    } else {
      setSuggestions([])
    }
  }, [searchTerm])

  function handleInputChange(event) {
    const newSearchTerm = event.target.value
    setSearchTerm(newSearchTerm)
    setOpened(true)
  }

  function handleSuggestionClick(suggestion) {
    setSearchTerm(suggestion)
    setSuggestions([])
    setOpened(false)
    onSubmit(suggestion) // Trigger the search with the clicked suggestion
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(searchTerm)
    setSearchTerm("")
    setOpened(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute flex w-full content-center space-x-2  pb-5"
    >
      <div className="realtive w-full md:w-96">
        <Input
          className="w-full md:w-96"
          type="text"
          value={searchTerm}
          onChange={(event) => handleInputChange(event)}
          onClick={() => setIsClicked(true)}
          placeholder="Search for a performer"
        />
        <AnimatePresence>
          {opened && suggestions.length > 0 && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              layout
              className="h-64"
            >
              <ScrollArea
                ref={ref}
                className="absolute mt-3 h-full rounded-md border bg-background shadow-lg md:w-96"
              >
                <m.div className="p-4">
                  {suggestions.map((suggestion, index) => (
                    <m.div
                      layout
                      className="rounded-lg p-2 hover:bg-secondary text-sm"
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion[0])}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      {suggestion[0]}
                      {/* <Separator className="my-2" /> */}
                    </m.div>
                  ))}
                </m.div>
              </ScrollArea>
            </m.div>
          )}
        </AnimatePresence>
      </div>
      <Button type="submit">Search</Button>
    </form>
  )
}

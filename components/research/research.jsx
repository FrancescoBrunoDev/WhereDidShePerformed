"use client"

import { Suspense, useState } from "react"
import { AnimatePresence, motion as m } from "framer-motion"

import Loading from "@/components/ui/loading"
import PerformanceSearchResults from "@/components/research/PerformanceSearchResults"
import Suggestions from "@/components/suggestions/suggestions"

import { queryData } from "../../app/api/musiconn"
import PerformanceSearchForm from "./PerformanceSearchForm"

export default function PerformanceSearch() {
  const [results, setResults] = useState([])
  const [opened, setOpened] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  async function handleSearch(searchTerm) {
    const data = await queryData(searchTerm)
    setResults([data])
  }

  return (
    <section className="px-0 md:px-20 xl:px-40">
      <m.div
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 5, opacity: 0 }}
        className="sticky top-[-5rem] z-10 pb-14 pt-32"
      >
        <h1 className="pb-5 text-6xl font-black md:text-8xl ">
          Who&apos;s the performer?
        </h1>
        <PerformanceSearchForm
          onSubmit={handleSearch}
          opened={opened}
          setOpened={setOpened}
          setIsClicked={setIsClicked}
        />
      </m.div>
      <div className="-z-10 pt-10">
        {opened || results.length > 0 ? (
          <Suspense fallback={<Loading />}>
            <PerformanceSearchResults results={results} />
          </Suspense>
        ) : (
          <AnimatePresence>
            {!isClicked && !opened && <Suggestions />}
          </AnimatePresence>
        )}
      </div>
    </section>
  )
}

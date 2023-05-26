"use client"

import { motion as m } from "framer-motion"

import PerformanceSearch from "@/components/research/research"

export default function IndexPage() {
  return (
    <>
      <m.section className="container h-screen">
        <PerformanceSearch />
      </m.section>
      <div className="fixed top-0 z-0 h-72 w-full bg-gradient-to-b from-background from-70% via-background to-transparent lg:h-96" />
    </>
  )
}

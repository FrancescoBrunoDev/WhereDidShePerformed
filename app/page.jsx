import PerformanceSearch from "@/components/research/research"

export default function IndexPage() {
  return (
    <>
      <section className="container h-screen">
        <PerformanceSearch />
      </section>
      <div className="fixed top-0 z-0 h-72 w-full bg-gradient-to-b from-background from-70% via-background to-transparent lg:h-96" />
    </>
  )
}

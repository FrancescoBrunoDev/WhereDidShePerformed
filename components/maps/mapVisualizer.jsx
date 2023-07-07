"user client"

import MapCamp from "@/components/maps/mapCamp"
import ScrollAreaMap from "@/components/maps/scrollAreaMap"

export default function MapVisualizer() {
  return (
    <section>
      <ScrollAreaMap />
      <div>
        <MapCamp />
      </div>
    </section>
  )
}

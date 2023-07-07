import { useStoreFiltersMap } from "@/store/useStoreFiltersMap"

import { Slider } from "@/components/ui/slider"

export default function CareerTimeline() {
  const [lowestYear, highestYear, updateFilterHighestYear, filterHighestYear] =
    useStoreFiltersMap((state) => [
      state.lowestYear,
      state.highestYear,
      state.updateFilterHighestYear,
      state.filterHighestYear,
    ])

  return (
    <>
      <div className="flex items-center justify-normal space-x-2 pt-6">
        {highestYear || lowestYear ? (
          lowestYear === highestYear ? (
            <p className="w-15 text-base">
              It seems that I only have data for the year {lowestYear}
            </p>
          ) : (
            <>
              {" "}
              <p className="w-15 text-primary">{lowestYear}</p>
              <Slider
                defaultValue={[filterHighestYear]}
                min={lowestYear}
                max={highestYear}
                step={1}
                onValueChange={(newValue) => {
                  updateFilterHighestYear(newValue[0])
                }}
              />
              <p className="w-15">{highestYear}</p>{" "}
            </>
          )
        ) : null}
      </div>
    </>
  )
}

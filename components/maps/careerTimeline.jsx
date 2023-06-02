import { Slider } from "@/components/ui/slider"

export default function careerTimeline({
  highestYear,
  lowestYear,
  filterHighestYear,
  updateFilterHighestYear,
  expandedLocations,
}) {
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
              {expandedLocations ? (
                <div className="text-sm">
                  The slider&apos;s value is fixed due to the active composer
                  filter, prohibiting any modifications.
                </div>
              ) : (
                <>
                  {" "}
                  <p className="w-15 text-primary">{lowestYear}</p>
                  <Slider
                    disabled={
                      expandedLocations || lowestYear === highestYear
                        ? true
                        : false
                    }
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
              )}
            </>
          )
        ) : null}
      </div>
    </>
  )
}

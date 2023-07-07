import { useStoreFiltersMap } from "@/store/useStoreFiltersMap"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function FilterList({}) {
  const [categoryFiltersActive, setCategoryFilters] =
    useStoreFiltersMap((state) => [
      state.categoryFiltersActive,
      state.setCategoryFilters,
    ])


  return (
    <>
      {Object.keys(categoryFiltersActive).map((category) => {
        const nameCategory = category.split("_").join(" ")

        return (
          <div className="lg:flex-cols-2 grid grid-cols-2 items-center space-x-2 lg:flex">
            <Label>{nameCategory}</Label>
            <Switch
              onCheckedChange={() => {
                setCategoryFilters(category)
              }}
              checked={categoryFiltersActive[category].state}
            />
          </div>
        )
      })}
    </>
  )
}

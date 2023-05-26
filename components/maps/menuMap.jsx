import { buttonVariants } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Icons } from "@/components/icons"

export default function MenuMap({
  setChangeMap,
  changeMap,
  setIsGeoMap,
  setIsHighQuality,
  isHighQuality,
  setIsByCity,
  isEuropeMap,
  isByCity,
}) {

  return (
    <Popover openDelay={200}>
      <PopoverTrigger>
        <div
          className={buttonVariants({
            size: "sm",
            variant: "ghost",
          })}
        >
          <Icons.settings className="h-5 w-5" />
          <span className="sr-only">settings</span>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid w-40 grid-cols-1 gap-y-2">
          <div className="grid grid-cols-2 items-center space-x-2 ">
            <Label>{isEuropeMap ? "World Map" : "Europe Map"}</Label>
            <Switch
              className="data-[state=checked]:bg-input"
              onCheckedChange={() => {
                setChangeMap(changeMap + 1)
                setTimeout(() => {
                  setIsGeoMap((prevIsGeoMap) => !prevIsGeoMap)
                }, 100)
              }}
              checked={isEuropeMap}
            />
          </div>
          <div className="grid grid-cols-2 items-center space-x-2">
            {" "}
            {/* set the a drop shadow effect */}
            <Label>Marks are {isByCity ? " Cities" : " Places"}</Label>
            <Switch
              className="data-[state=checked]:bg-input"
              onCheckedChange={() => {
                setIsByCity((prevIsByCity) => !prevIsByCity)
              }}
              checked={isByCity}
            />
          </div>
          <div className="grid grid-cols-2 items-center space-x-2">
            {" "}
            {/* set the a drop shadow effect */}
            <Label>Marker Shadow</Label>
            <Switch
              onCheckedChange={() => {
                setIsHighQuality((prevIsHighQuality) => !prevIsHighQuality)
              }}
              checked={isHighQuality}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
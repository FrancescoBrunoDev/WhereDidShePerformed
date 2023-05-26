import { Suspense, useState } from "react"

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function ScrollAreaItem({
  locationsData,
  handleAccordionHover,
  setIsHover,
  isByCity,
}) {
  const [visibleItems, setVisibleItems] = useState(20)

  return (
    <div>
      {locationsData?.map(({ city, locations, key, locationId }) => (
        <div key={isByCity ? key : locationId}>
          <h2 className="font-black">{city}</h2>
          {locations.map(({ locationId, title, count, eventInfo }) => (
            <AccordionItem
              className="justify-normal border-0"
              value={locationId}
              key={locationId}
              id={locationId}
              onMouseEnter={() => {
                handleAccordionHover(isByCity ? key : locationId)
                setIsHover(true)
              }}
              onMouseLeave={() => {
                handleAccordionHover(null)
                setIsHover(false)
              }}
            >
              <AccordionTrigger
                id={locationId}
                className="flex justify-normal py-0 hover:no-underline"
              >
                {" "}
                <div className="mt-1 flex h-5 w-14 justify-center">
                  <Badge className="flex w-14 justify-center">
                    {locationId}
                  </Badge>
                </div>
                <p
                  className="mx-1 flex w-full justify-self-start rounded-lg p-2 text-left  hover:bg-secondary hover:text-primary"
                  key={isByCity ? key : locationId}
                >
                  {title} for {count} {count === 1 ? "time" : "times"}
                </p>
              </AccordionTrigger>
              <AccordionContent>
                <Suspense>
                  {eventInfo.slice(0, visibleItems).map(({ eventId, date }) => (
                    <div
                      key={eventId}
                      className="ml-6 flex justify-normal border-0"
                    >
                      <div className="flex items-center justify-normal py-1">
                        <Badge
                          variant={"secondary"}
                          className="flex w-14 justify-center"
                        >
                          {eventId}
                        </Badge>
                      </div>
                      <div className="ml-2 flex items-center">
                        <p>{date}</p>
                      </div>
                    </div>
                  ))}
                  {visibleItems < eventInfo.length && (
                    <div className="flex w-full justify-center pb-5">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setVisibleItems(
                            (prevVisibleItems) => prevVisibleItems + 20
                          )
                        }}
                      >
                        Show More
                      </Button>
                    </div>
                  )}
                </Suspense>
              </AccordionContent>
            </AccordionItem>
          ))}
        </div>
      ))}
    </div>
  )
}

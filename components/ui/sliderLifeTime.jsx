import React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const SliderLifeTime = React.forwardRef(
  (
    {
      className,
      filterHighestYear,
      highestYear,
      lowestYear,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const value = highestYear

    // Flag variable to track if handleValueChange has been called on load
    const [isHandleValueChangeCalled, setIsHandleValueChangeCalled] =
      React.useState(false)

    // Function to handle initial value change on load
    React.useEffect(() => {
      if (
        !isHandleValueChangeCalled &&
        highestYear !== null &&
        lowestYear !== null
      ) {
        handleValueChange(highestYear)
        setIsHandleValueChangeCalled(true)
        // Wait before calling handleValueChange
      }
    }, [highestYear, isHandleValueChangeCalled])

    const handleValueChange = (newValue) => {
      onValueChange(newValue)
    }

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex h-16 w-full touch-none select-none items-center",
          className
        )}
        {...props}
        onValueChange={handleValueChange}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        {value.map((i) => (
          <SliderPrimitive.Thumb key={i} className="">
            <p className="w-10 pb-8 text-center text-sm text-background animate-in hover:text-primary">
              {filterHighestYear}
            </p>
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Root>
    )
  }
)

SliderLifeTime.displayName = SliderPrimitive.Root.displayName

export { SliderLifeTime }

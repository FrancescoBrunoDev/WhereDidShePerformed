import * as React from "react"

import { Progress } from "@/components/ui/progress"

export function Loading() {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex min-h-screen scale-50 flex-col items-center justify-center px-20">
      <Progress value={progress} className="w-[25%]" />
    </div>
  )
}

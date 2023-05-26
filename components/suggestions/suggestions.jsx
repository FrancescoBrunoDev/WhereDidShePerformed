import { useEffect, useState } from "react"

import { Button } from "../ui/button"
import RandomCard from "./randomCard"
import main from "./statisticGenerator"
import TopPerfomers from "./topPerformers"
import { TopPersons } from "./topPersons"

export default function Suggestions() {
  const handleButtonClick = () => {
    main();
  };

  return (
    <div className="flex snap-x scroll-pl-6 flex-nowrap gap-4 overflow-x-scroll pr-10 pt-1">
      <TopPersons />
      <TopPerfomers />
      <RandomCard />
{/*       <Button onClick={handleButtonClick}>More</Button> */}
    </div>
  )
}

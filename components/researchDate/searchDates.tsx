import { Button } from "@/components/ui/button"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SearchDatesProps {
  handleFromChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleToChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleDateSubmit: () => void
  fromValue: string
  toValue: string
  searchData: boolean
}

export default function SearchDates({
  handleFromChange,
  handleToChange,
  handleDateSubmit,
  fromValue,
  toValue,
  searchData,
}: SearchDatesProps) {
  return (
    <>
      {searchData ? null : (
        <CardHeader>
          <CardTitle>Search by Dates</CardTitle>
          <CardDescription>pick a date</CardDescription>
        </CardHeader>
      )}
      <CardContent
        className={
          searchData
            ? "grid max-w-sm content-center gap-1.5 p-0"
            : "grid max-w-sm items-center gap-1.5"
        }
      >
        {" "}
        <div className="grid grid-cols-2 gap-1">
          <Input
            className="col-span-1"
            placeholder="From Date"
            value={fromValue}
            onChange={handleFromChange}
          />
          <Input
            className="col-span-1"
            placeholder="From Date"
            value={toValue}
            onChange={handleToChange}
          />
        </div>
        <CardDescription>
          use the format yyyy-MM-dd
        </CardDescription>
        <Button className="col-span-1" type="submit" onClick={handleDateSubmit}>
          Search
        </Button>
      </CardContent>
    </>
  )
}

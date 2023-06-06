import { Button } from "@/components/ui/button"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import getRandomSentenceList from "@/components/researchDate/randomSentences"

interface SearchDatesProps {
  handleFromChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleToChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleDateSubmit: () => void
  fromValue: string
  toValue: string
  searchData: boolean
  fromValueIsValid: boolean
  toValueIsValid: boolean
  fromValueIsAfterToValue: boolean
}

export default function SearchDates({
  handleFromChange,
  handleToChange,
  handleDateSubmit,
  fromValue,
  toValue,
  searchData,
  fromValueIsValid,
  toValueIsValid,
  fromValueIsAfterToValue,
}: SearchDatesProps) {
  return (
    <>
      {searchData ? null : (
        <CardHeader>
          <CardTitle>Search by Dates</CardTitle>
        </CardHeader>
      )}

      <CardContent
        className={`grid max-w-sm space-y-1
          ${searchData ? "content-center p-1 rounded-lg bg-background" : "items-center"}
            `}
      >
        <CardDescription></CardDescription>
        <div className="grid grid-cols-2 gap-1 mt-0">
          <div className="col-span-1 grid grid-cols-1 space-y-1">
            <CardDescription className="flex items-center justify-start">
              start date{" "}
              {fromValueIsValid && (
                <Icons.check className="h-4 text-green-600" />
              )}
            </CardDescription>
            <Input
              placeholder="yyyy-MM-dd"
              value={fromValue}
              onChange={handleFromChange}
            />
          </div>
          <div className="col-span-1 grid grid-cols-1 space-y-1">
            <CardDescription className="flex items-center justify-start">
              end date{" "}
              {toValueIsValid && <Icons.check className="h-4 text-green-600" />}
            </CardDescription>
            <Input
              placeholder="yyyy-MM-dd"
              value={toValue}
              onChange={handleToChange}
            />
          </div>
        </div>
        <Button
          className={`col-span-1 ${
            fromValueIsValid && toValueIsValid && !fromValueIsAfterToValue
              ? ""
              : "cursor-no-drop"
          }`}
          variant={
            fromValueIsValid && toValueIsValid && !fromValueIsAfterToValue
              ? "default"
              : "secondary"
          }
          type="submit"
          onClick={() => {
            if (
              fromValueIsValid &&
              toValueIsValid &&
              !fromValueIsAfterToValue
            ) {
              handleDateSubmit()
            }
          }}
        >
          {fromValueIsAfterToValue ? (
            <span className="text-xs">{getRandomSentenceList()}</span>
          ) : (
            "Search"
          )}
        </Button>
      </CardContent>
    </>
  )
}

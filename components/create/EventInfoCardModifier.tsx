"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Category, StateVerification } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { isValid } from "date-fns"

import { LocationM, PersonM, WorkM } from "@/types/database"
import { CoordinatesGeo } from "@/types/locationGeo"
import { NewEventPayload } from "@/lib/validators/newEvent"
import { newLocationMCPayload } from "@/lib/validators/newLocationMC"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import InputAutosuggest from "@/components/create/inputAutosuggest"
import { Icons } from "@/components/icons"
import { GetCoordinates } from "@/app/api/musiconn"

import { Label } from "../ui/label"
import SearchGeoLocation from "./SearchGeoLocation"

const EventInfoCardModifier = ({
  uid,
  type,
}: {
  uid: string
  type: string
}) => {
  const router = useRouter()
  const [dataFormat, setDataFormat] = useState<boolean>()
  const [isLinkVisible, setIsLinkVisible] = useState<boolean>(false)
  const [isImgVisible, setIsImgVisible] = useState<boolean>(false)
  const [coodinateButtonActive, setCoodinateButtonActive] =
    useState<boolean>(true)
  const [hasCoordinates, setHasCoordinates] = useState<boolean>(false)
  const [coordinateCandidate, setCoordinateCandidate] =
    useState<CoordinatesGeo>()
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: null as Date | null,
    locationsM: [] as LocationM[],
    personsM: [] as PersonM[],
    worksM: [] as WorkM[],
    uid: uid,
    link: "",
    comment: "",
    stateVerification: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    if (type === "modify") {
      const fetchData = async () => {
        try {
          const payload = {
            uid: uid,
          }

          const { data } = await axios.post(`/api/create/getEvent/`, payload)
          const dateConverted = new Date(data.date)
          setFormData({
            title: data.title,
            category: data.category as Category,
            date: dateConverted,
            locationsM: data.locationsM,
            personsM: data.personsM,
            worksM: data.worksM,
            uid: uid,
            link: data.link,
            comment: data.comment,
            stateVerification: data.stateVerification as StateVerification,
          })
          if (data.link !== "") {
            setIsLinkVisible(true)
          }
        } catch (error) {
          console.log(error)
        }
      }
      fetchData()
      setDataFormat(true)
    }
  }, [uid, type])

  const { mutate: manageEvent, isLoading } = useMutation({
    mutationFn: async () => {
      const dateValue: string = formData.date ? formData.date.toISOString() : "" // Use an empty string as the default value
      const personMUidString = formData.personsM.map((person) => person.mUid)
      const workMUidString = formData.worksM.map((work) => work.mUid)
      const locationMUidString = formData.locationsM.map(
        (location) => location.mUid
      )
      if (!isLinkVisible) {
        formData.link = ""
      }

      const payload: NewEventPayload = {
        title: formData.title,
        category: formData.category as Category,
        date: dateValue,
        locationsM: locationMUidString,
        personsM: personMUidString,
        worksM: workMUidString,
        uid: formData.uid,
        link: formData.link,
        comment: formData.comment,
      }

      const url =
        type === "new" ? "/api/create/createEvent" : "/api/create/updateEvent"

      const { data } = await axios.post(url, payload)
      const result = data as string

      if (result === "success") {
        if (coordinateCandidate) {
          const place_id = coordinateCandidate.place_id
          const lat = coordinateCandidate.geometries.lat
          const lon = coordinateCandidate.geometries.lon
          const locationName = coordinateCandidate.name
          const request: newLocationMCPayload = {
            locationName: locationName,
            uid: formData.locationsM[0].mUid,
            coordinateCandidateId: place_id,
            lat: lat,
            lon: lon,
          }
          console.log(request, "request")
          const { data } = await axios.post(
            "/api/create/createLocationMC",
            request
          )
          const result = data as string
          console.log(result, "result")
          
        }
        toast({
          title: "Event added!",
          /*           description: "There was a problem with your request.", */
        })
        router.back()
        router.refresh()
        
      } else {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        })
      }
      return data as string
    },
  })
  console.log(coordinateCandidate, "coordinateCandidate")

  const handleAddPerson = (value: [string, string, string]) => {
    const newMUid = value[2]
    const mUidExists = formData.personsM.some(
      (person) => person.mUid === newMUid
    )
    if (!mUidExists) {
      const newPerson = { title: value[0], mUid: newMUid }
      const newPersons = [...formData.personsM, newPerson]
      setFormData({
        ...formData,
        personsM: newPersons,
      })
    }
  }

  const handleRemovePerson = (title: string) => {
    const newPersons = formData.personsM.filter(
      (person) => person.title !== title
    )
    setFormData({
      ...formData,
      personsM: newPersons,
    })
  }

  const handleAddWork = (value: [string, string, string]) => {
    const newMUid = value[2]
    const mUidExists = formData.worksM.some((work) => work.mUid === newMUid)
    if (!mUidExists) {
      const newWork = { title: value[0], mUid: newMUid }
      const newWorks = [...formData.worksM, newWork]
      setFormData({
        ...formData,
        worksM: newWorks,
      })
    }
  }

  const handleRemoveWork = (title: string) => {
    const newWorks = formData.worksM.filter((work) => work.title !== title)
    setFormData({
      ...formData,
      worksM: newWorks,
    })
  }

  let formattedDate = ""

  if (type !== "new" && formData.date) {
    const dateObj = new Date(formData.date)

    if (!isNaN(dateObj.getTime())) {
      const year = dateObj.getFullYear()
      const month = String(dateObj.getMonth() + 1).padStart(2, "0")
      const day = String(dateObj.getDate()).padStart(2, "0")
      formattedDate = `${year}-${month}-${day}`
    }
  }

  useEffect(() => {
    const hasCoordinates = async () => {
      let coordinates
      if (formData.locationsM.length === 0) return
      const idLocation = formData.locationsM[0].mUid
      const { location } = await GetCoordinates(idLocation)
      coordinates = location[idLocation].geometries
      if (coordinates) {
        setHasCoordinates(true)
      } else {
        const payload = { idLocation: idLocation, type: "highestVote" }
        const { data } = await axios.post(
          "/api/get/getCoordinatesCommunity", // api da fare
          payload
        )
        // filter the coordinateCandidate with highest number votes and set it as coordinateCandidate

        setCoordinateCandidate(data)

        setHasCoordinates(false)
      }
    }
    hasCoordinates()
  }, [formData.locationsM])

  return (
    <>
      <div className="z-50 mx-4 flex w-fit flex-col gap-16">
        <Input
          className="-mx-4 h-20 w-full border-none text-7xl font-black"
          placeholder={type === "new" ? "Event Name" : ""}
          defaultValue={type !== "new" ? formData.title : ""}
          name={"title"}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        {formData.stateVerification !== StateVerification.NONE &&
          formData.stateVerification !== "" && (
            <div className="rounded-lg bg-secondary p-2 text-sm">
              Hey, just wanted to give you a heads-up that this event{" "}
              {formData.stateVerification === StateVerification.PENDING
                ? "is still being reviewed"
                : formData.stateVerification === StateVerification.VERIFIED
                ? "has been already verified"
                : null}
              . If you make any changes, you&apos;ll need to resubmit it for
              review.
            </div>
          )}
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-10">
          <h2 className="col-span-3 pt-2 text-5xl font-black">General Data</h2>
          <div className="col-span-7 flex max-w-xl flex-col gap-4">
            <div className="flex w-full shrink-0 items-start gap-4">
              <div className="flex shrink-0 items-center gap-4">
                <span className="shrink-0 text-7xl font-black">1</span>
                <span className="shrink-0 text-lg font-bold uppercase">
                  select a category
                </span>
              </div>
              <div className="w-full pt-4">
                <Select
                  value={formData.category}
                  onValueChange={(e) =>
                    setFormData({ ...formData, category: e })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Season">Season</SelectItem>
                    <SelectItem value="Concert">Concert</SelectItem>
                    <SelectItem value="Religious_Event">
                      Religious Event
                    </SelectItem>
                    <SelectItem value="Music_Theater">Music Theater</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex w-full shrink-0 items-start gap-4">
              <div className="flex shrink-0 items-center gap-4">
                <span className="text-7xl font-black">2</span>
                <span className="shrink-0 text-lg font-bold uppercase">
                  Date of the Event
                </span>
              </div>
              <div className="flex w-full items-center gap-1 pt-4">
                <Input
                  defaultValue={type === "new" ? "" : formattedDate}
                  placeholder="yyyy-MM-dd"
                  onChange={(e) => {
                    const inputDate = new Date(e.target.value)
                    const isDateValid = isValid(inputDate)
                    if (!isDateValid) {
                      setFormData({ ...formData, date: null })
                      setDataFormat(false)
                    }
                    if (isDateValid) {
                      setFormData({ ...formData, date: inputDate })
                      setDataFormat(true)
                    }
                  }}
                />

                {dataFormat ? (
                  <Icons.check className="h-4 shrink-0 text-green-600" />
                ) : null}
              </div>
            </div>
            <div className="flex w-full shrink-0 items-start gap-4">
              <div className="flex shrink-0 items-center gap-4">
                <span className="text-7xl font-black">3</span>
                <span className="shrink-0 self-center text-lg font-bold uppercase">
                  location
                </span>
              </div>

              {!formData.locationsM[0]?.title ? (
                <div className="grid w-full grid-cols-1 pt-4">
                  <InputAutosuggest
                    paramsAPI={"location"}
                    setFormData={(locationData) =>
                      setFormData({
                        ...formData,
                        locationsM: [
                          {
                            title: locationData[0],
                            mUid: locationData[2],
                          },
                        ],
                      })
                    }
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 pt-6">
                  <div className="flex items-center">
                    <Badge
                      className="h-fit max-w-[220px] cursor-pointer hover:bg-destructive hover:text-primary"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          locationsM: [],
                        })
                        setCoordinateCandidate(undefined)
                      }}
                    >
                      <span className="truncate">
                        {formData.locationsM[0]?.title}
                      </span>
                    </Badge>
                    {hasCoordinates && (
                      <Icons.check className="h-4 shrink-0 text-green-600" />
                    )}
                  </div>
                  <div className="pt-2">
                    {!hasCoordinates && !coordinateCandidate ? (
                      <div className="rounded-lg bg-secondary p-2 text-sm">
                        <span className="flex flex-col justify-center text-sm">
                          <div className="w-full text-center text-lg">🤔</div>
                          <div>
                            Apparently this location doesn&apos;t have
                            coordinates on the musiconn.performance database.
                            Would you like to add them?
                          </div>
                        </span>
                        <div className="pt-2">
                          <SearchGeoLocation
                            address={formData.locationsM[0].title}
                            setCoordinateCandidate={setCoordinateCandidate}
                          />
                        </div>
                      </div>
                    ) : coordinateCandidate ? (
                      <div className="grid w-full grid-cols-1 gap-2 rounded-lg bg-secondary p-2 text-center text-sm">
                        <p className="flex flex-col justify-center  text-sm font-semibold">
                          Do you confirm that this is the correct location?
                        </p>
                        <div className="">{coordinateCandidate.name}</div>
                        <div className="grid w-full grid-cols-2 space-x-2">
                          <Button
                            onClick={() => {
                              setCoordinateCandidate(undefined)
                            }}
                            variant={"destructive"}
                            size={"xs"}
                          >
                            I can do better 🤓
                          </Button>
                          <Button
                            variant={
                              coodinateButtonActive ? "default" : "outline"
                            }
                            disabled={!coodinateButtonActive}
                            onClick={() => setCoodinateButtonActive(false)}
                            size={"xs"}
                          >
                            {!coodinateButtonActive
                              ? "thank you 🚀"
                              : "looks good to me 👌"}
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-10">
          <h2 className="col-span-3 text-5xl font-black ">Relationships</h2>
          <div className="col-span-7 flex max-w-xl flex-col gap-4">
            <div className="flex w-full shrink-0 items-start gap-4">
              <div className="flex items-center gap-4">
                <span className="text-7xl font-black">4</span>
                <span className="text-lg font-bold uppercase">Persons</span>
              </div>
              <div className="flex w-full flex-col space-y-2 pt-4">
                <div className="flex shrink-0 items-center gap-4">
                  <InputAutosuggest
                    paramsAPI={"person"}
                    setFormData={handleAddPerson}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.personsM.map((person, index) => (
                    <Badge
                      className="max-w-[220px] cursor-pointer hover:bg-destructive hover:text-primary"
                      onClick={() => handleRemovePerson(person.title)}
                      key={index}
                    >
                      <span className="truncate">{person.title}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex w-full shrink-0 items-start gap-4">
              <div className="flex items-center gap-4">
                <span className="text-7xl font-black">5</span>
                <span className="text-lg font-bold uppercase">Program</span>
              </div>
              <div className="flex w-full flex-col space-y-2 pt-4">
                <div className="flex shrink-0 items-center gap-4">
                  <InputAutosuggest
                    paramsAPI={"work"}
                    setFormData={handleAddWork}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  {formData.worksM.map((work, index) => (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-black">{index + 1}.</span>
                      <Badge
                        className="max-w-[320px] cursor-pointer hover:bg-destructive hover:text-primary"
                        onClick={() => handleRemoveWork(work.title)}
                        key={index}
                      >
                        <span className="truncate">{work.title}</span>
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-10">
          <h2 className="col-span-3 text-5xl font-black ">Sources</h2>
          <div className="col-span-7 flex max-w-xl flex-col gap-4">
            <div className="flex w-full shrink-0 items-start gap-4">
              <div className="flex items-center gap-4">
                <span className="text-7xl font-black">6</span>
                <span className="text-lg font-bold uppercase">Import</span>
              </div>
              <div className="flex w-full flex-col space-y-2 pt-4">
                <div className="flex h-6 items-center space-x-2 py-6">
                  <Checkbox
                    checked={isLinkVisible}
                    onCheckedChange={() => setIsLinkVisible(!isLinkVisible)}
                  />
                  <Label className="shrink-0">link to a trustable source</Label>
                  {isLinkVisible && (
                    <Input
                      placeholder="https://www.example.com"
                      value={formData.link}
                      onChange={(e) => {
                        const linkValue = e.target.value
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          link: linkValue,
                        }))
                      }}
                    />
                  )}
                </div>
                <div className="flex h-6 items-center space-x-2 py-6">
                  <Checkbox
                    onCheckedChange={() => setIsImgVisible(!isImgVisible)}
                  />
                  <Label className="shrink-0">upload an image</Label>
                  {isImgVisible && (
                    <Input
                      placeholder="https://www.example.com"
                      /*   value={formData.img} */
                      onChange={(e) => {
                        const imglinkValue = e.target.value
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          img: imglinkValue,
                        }))

                        if (imglinkValue === "") {
                          setIsLinkVisible(false)
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-10">
          <div className="col-span-3">
            <h2 className="text-5xl font-black">Comment</h2>
            <p className="text-sm font-normal">Anything else to declare?</p>
          </div>
          <div className="col-span-7 flex max-w-xl flex-col gap-4">
            <div className="flex w-full shrink-0 gap-4">
              <span className="text-7xl font-black">7</span>
              <div className="mt-[0.85rem] flex w-full flex-col space-y-2">
                <Textarea
                  onChange={(e) => {
                    const commentValue = e.target.value
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      comment: commentValue,
                    }))
                  }}
                  defaultValue={type !== "new" ? formData.comment : ""}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 flex justify-center gap-4">
        <Button variant="subtle" onClick={() => router.back()}>
          Back
        </Button>
        <Button
          isLoading={isLoading}
          disabled={
            formData.title === "" ||
            !dataFormat ||
            formData.locationsM.length === 0 ||
            formData.personsM.length === 0 ||
            formData.worksM.length === 0
          }
          onClick={() => {
            manageEvent()
          }}
        >
          {type === "new" ? "Create a new Event" : "Update Event"}
        </Button>
      </div>
    </>
  )
}

export default EventInfoCardModifier

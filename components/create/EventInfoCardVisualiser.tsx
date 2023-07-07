import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Category, StateVerification } from "@prisma/client"
import axios from "axios"

import { LocationM, PersonM, WorkM } from "@/types/database"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { GetCoordinates } from "@/app/api/musiconn"

const EventInfoCardVisualiser = ({
  uid,
}: {
  uid: string
}) => {
  const router = useRouter()
  const [hasCoordinates, setHasCoordinates] = useState<boolean>(false)
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

  useEffect(() => {
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
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [uid])

  useEffect(() => {
    const hasCoordinates = async () => {
      if (formData.locationsM.length === 0) return
      const idLocation = formData.locationsM[0].mUid
      const { location } = await GetCoordinates(idLocation)
      const coordinates = location[idLocation].geometries
      if (coordinates) {
        setHasCoordinates(true)
      } else {
        setHasCoordinates(false)
      }
    }
    hasCoordinates()
  }, [formData.locationsM])

  let formattedDate = ""

  if (uid && formData.date) {
    const dateObj = new Date(formData.date)

    if (!isNaN(dateObj.getTime())) {
      const year = dateObj.getFullYear()
      const month = String(dateObj.getMonth() + 1).padStart(2, "0")
      const day = String(dateObj.getDate()).padStart(2, "0")
      formattedDate = `${year}-${month}-${day}`
    }
  }

  return (
    <>
      <div className="z-50 mx-4 flex w-fit flex-col gap-16">
        <h1 className=" h-20 w-full border-none text-7xl font-black">
          {formData.title}
        </h1>
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-10">
          <h2 className="col-span-3 pt-2 text-5xl font-black">General Data</h2>
          <div className="col-span-7 flex max-w-xl flex-col gap-4">
            <div className="flex w-full items-center gap-4">
              <span className="shrink-0 text-7xl font-black">1</span>
              <span className="shrink-0 text-lg font-bold uppercase">
                select a category
              </span>
              <Badge>{formData.category}</Badge>
            </div>
            <div className="relative flex w-full items-center gap-4">
              <span className="text-7xl font-black">2</span>
              <span className="shrink-0 text-lg font-bold uppercase">
                Date of the Event
              </span>
              <Badge>{formattedDate}</Badge>
            </div>
            <div className="flex h-20 w-full shrink-0 items-center gap-4">
              <span className="text-7xl font-black">3</span>
              <span className="shrink-0 text-lg font-bold uppercase">
                location
              </span>

              <Badge className="h-fit max-w-[220px] cursor-pointer">
                {formData.locationsM[0]?.title}
              </Badge>
              {hasCoordinates ? (
                <Icons.check className="h-4 shrink-0 text-green-600" />
              ) : (
                <span className="text-sm">
                  mmm apparently this location doesn&apos;t have coordinates on
                  the musiconn.performance database
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-10">
          <h2 className="col-span-3 text-5xl font-black ">Relationships</h2>
          <div className="col-span-7 flex max-w-xl flex-col gap-4">
            <div className="flex w-full shrink-0 gap-4">
              <span className="text-7xl font-black">4</span>
              <span className="mt-5 text-lg font-bold uppercase">Persons</span>
              <div className="mt-[0.85rem] flex w-full flex-col space-y-2">
                <div className="flex flex-col gap-2">
                  {formData.personsM.map((person, index) => (
                    <Badge className="max-w-[220px] cursor-pointer" key={index}>
                      <span className="truncate">{person.title}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex w-full shrink-0 gap-4">
              <span className="text-7xl font-black">5</span>
              <span className="mt-5 text-lg font-bold uppercase">Program</span>
              <div className="mt-[0.85rem] flex w-full flex-col space-y-2">
                <div className="flex flex-col gap-2">
                  {formData.worksM.map((work, index) => (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-black">{index + 1}.</span>
                      <Badge
                        className="max-w-[320px] cursor-pointer"
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
            <div className="flex w-full shrink-0 gap-4">
              <span className="text-7xl font-black">6</span>
              <span className="mt-6 text-lg font-bold uppercase">Import</span>
              <div className="mt-[0.85rem] flex w-full flex-col space-y-2">
                <div className="flex h-6 items-center space-x-2 py-6">
                  {formData.link && (
                    <Link href={formData.link}>
                      <Badge>{formData.link}</Badge>
                    </Link>
                  )}
                </div>
                <div className="flex h-6 items-center space-x-2 py-6">
                  {/*     {formData.img && <Badge>{formData.img}</Badge>} */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {formData.comment && (
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-10">
            <div className="col-span-3">
              <h2 className="text-5xl font-black">Comment</h2>
              <p className="text-sm font-normal">Anything else to declare?</p>
            </div>
            <div className="col-span-7 flex max-w-xl flex-col gap-4">
              <div className="flex w-full shrink-0 gap-4">
                <span className="text-7xl font-black">7</span>
                <div className="mt-[0.85rem] flex w-full flex-col space-y-2">
                  <p>{formData.comment}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-10 flex justify-center gap-4">
        <Button variant="subtle" onClick={() => router.back()}>
          Back
        </Button>
        <Button onClick={() => router.push(`/profile/eventinfo/modify/${uid}`)}>
          Modify
        </Button>
      </div>
    </>
  )
}

export default EventInfoCardVisualiser

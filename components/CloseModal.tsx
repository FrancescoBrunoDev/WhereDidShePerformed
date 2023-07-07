"use client"

import { FC } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"

interface CloseModalProps {}

const CloseModal: FC<CloseModalProps> = ({}) => {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      className="h-6 w-6 rounded-md p-0"
      onClick={() => router.back()}
    >
      <X aria-label="close modal" className="h-4 w-4" />
    </Button>
  )
}

export default CloseModal

"use client"

import { useEffect, useState } from "react"
import { Role, StateVerification } from "@prisma/client"
import axios from "axios"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Badge } from "./ui/badge"

interface ModifierVerificationEventProps {
  eventId: number | string
  verificationStatus: StateVerification
}

const ModifierVerificationEventAdmin = ({
  eventId,
  verificationStatus,
}: ModifierVerificationEventProps) => {
  const [role, setRole] = useState<Role>("" as Role)
  const [stateVerification, setStateVerification] = useState<StateVerification>(
    verificationStatus as StateVerification
  )

  useEffect(() => {
    const fetchRole = async () => {
      const data = await fetch("/api/get/getRoleSession")
      const { role } = await data.json()
      setRole(role)
    }
    fetchRole()
  }, [])

  const handleStateChange = async (
    value: StateVerification,
    eventId: ModifierVerificationEventProps
  ) => {
    try {
      const payload = [
        {
          uid: eventId,
          stateVerification: value as StateVerification,
        },
      ]
      const response = await axios.post(
        `/api/create/updateVerificationEvent`,
        payload
      )

      if (response.status === 200) {
        // Request successful
        setStateVerification(value as unknown as StateVerification)
      } else {
        // Request failed
        console.error("Failed to update event")
      }
    } catch (error) {
      console.error("An error occurred while updating event:", error)
    }
  }

  return (
    <Select
      disabled={
        stateVerification === StateVerification.VERIFIED && role === Role.USER
      }
      onValueChange={(value) => {
        handleStateChange(
          value as unknown as StateVerification,
          eventId as unknown as ModifierVerificationEventProps
        )
      }}
      defaultValue={stateVerification as StateVerification}
    >
      <SelectTrigger className="h-fit w-fit border-none bg-none p-0">
        <Badge
          className={
            (stateVerification as StateVerification) ===
            StateVerification.VERIFIED
              ? "bg-green-500"
              : (stateVerification as StateVerification) ===
                StateVerification.REJECTED
              ? "bg-destructive"
              : (stateVerification as StateVerification) ===
                StateVerification.PENDING
              ? "bg-orange-500"
              : (stateVerification as StateVerification) ===
                StateVerification.NONE
              ? "bg-gray-500"
              : ""
          }
        >
          <SelectValue />
        </Badge>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PENDING">PENDING</SelectItem>
        <SelectItem
          disabled={role === Role.USER ? true : false}
          value="VERIFIED"
        >
          VERIFIED
        </SelectItem>
        <SelectItem
          disabled={role === Role.USER ? true : false}
          value="REJECTED"
        >
          REJECTED
        </SelectItem>
        <SelectItem value="NONE">NONE</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default ModifierVerificationEventAdmin

import { Role } from "@prisma/client"
import axios from "axios"
import { create } from "zustand"

import { EventTable } from "@/types/database"

interface ProfileStore {
  events: EventTable[]
  role: Role
  userId?: any,

  fetchData: (
    events?: EventTable[],
    userId?: any,
    userRole?: Role
  ) => Promise<void>
  setUserId: (id?: string) => void
}

export const useStoreProfile = create<ProfileStore>()((set) => ({
  events: [],
  role: Role.USER,
  userId: "",

  fetchData: async (events?: EventTable[], userId?: any, userRole?: Role) => {
    let role = userRole as Role
    let fetchedEvents = events as EventTable[]
    if (!events) {
      const payload = {
        userId: userId,
      }
      const { data } = await axios.post("/api/get/getEventsByUser", payload)

      if (data.role) {
        role = data.role as Role // set the role in case of open as modal
      }

      fetchedEvents = data.events as EventTable[]
    } else {
      role = userRole as Role // set the role in any case
      fetchedEvents = events as EventTable[]
    }
    set({ events: fetchedEvents as EventTable[], role: role as Role })
  },
  setUserId: (id?: string) => set({ userId: id }),
}))

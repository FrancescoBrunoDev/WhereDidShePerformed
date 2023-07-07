import { create } from "zustand"

interface FilteredData {
  filteredEvents: any
  startDate: string
  endDate: string
}

interface SearchByDateStore {
  date: FilteredData
  setDate: (date: FilteredData) => void
}

export const useStoreSearchByDate = create<SearchByDateStore>()((set) => ({
  date: {
    filteredEvents: [],
    startDate: "",
    endDate: "",
  },

  setDate: (date: FilteredData) => {
    const uids = date.filteredEvents.map((dateUid: { uid: any }) => dateUid.uid)
    const uidString = uids.join("|")

    set(() => ({
      date: {
        filteredEvents: uidString,
        startDate: date.startDate,
        endDate: date.endDate,
      },
    }))
  },
}))

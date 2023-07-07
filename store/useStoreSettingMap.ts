import { create } from "zustand"

const EuropeUrl = "/maps/europe.json"

const worldUrl = "/maps/world.json"

export const useStoreSettingMap = create((set) => ({
  thereIsMoreInWorld: false,
  thereIsMoreInWorldPopup: false,
  isEuropeMap: true,
  isWorldMap: false,
  mapUrl: EuropeUrl,
  isHighQuality: false,
  isHover: null,
  isTimeVisible: false,

  setThereIsMoreInWorld: (thereIsMoreInWorld: boolean) =>
    set({ thereIsMoreInWorld }),
  setThereIsMoreInWorldPopup: (thereIsMoreInWorldPopup: boolean) =>
    set({ thereIsMoreInWorldPopup }),
  updateMapUrl: (mapUrl: string) => set({ mapUrl }),
  setIsEuropeMap: (isEuropeMap: boolean) => {
    set({ isEuropeMap, mapUrl: isEuropeMap ? EuropeUrl : worldUrl })
  },
  setIsWorldMap: (isWorldMap: boolean) =>
    set({ isWorldMap, mapUrl: isWorldMap ? worldUrl : EuropeUrl }),
  setIsHighQuality: (isHighQuality: boolean) => set({ isHighQuality }),
  setIsHover: (isHover: number) => set({ isHover }),
  setIsTimeVisible: (isTimeVisible: boolean) => set({ isTimeVisible }),
}))

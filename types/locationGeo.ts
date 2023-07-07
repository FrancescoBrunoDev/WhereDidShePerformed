export interface LocationGeocode {
  place_id: number
  licence: string
  powered_by: string
  osm_type: string
  osm_id: number
  boundingbox: string[]
  lat: string
  lon: string
  display_name: string
  class: string
  type: string
  importance: number
}

export interface CoordinatesGeo {
  name: string
  place_id: number
  geometries: {
    lat: string
    lon: string
  }
}

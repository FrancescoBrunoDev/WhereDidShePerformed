const geolib = require("geolib")
const worldData = require("@/public/countries-land-10km.geo.json")
const WorldCities = require("worldcities")

function getCountryFromCoordinates(longitude, latitude) {
  // Function to determine the country for a given point
  function getCountry(point, geojsonData) {
    const [longitude, latitude] = point
    for (const feature of geojsonData.features) {
      if (feature.geometry?.type === "MultiPolygon") {
        for (const polygon of feature.geometry.coordinates) {
          if (geolib.isPointInPolygon({ longitude, latitude }, polygon[0])) {
            return feature.properties.A3
          }
        }
      } else if (feature.geometry?.type === "Polygon") {
        if (
          geolib.isPointInPolygon(
            { longitude, latitude },
            feature.geometry.coordinates[0]
          )
        ) {
          return feature.properties.A3
        }
      }
    }

    return "Unknown"
  }

  // Determine the country for the point
  const country = getCountry([longitude, latitude], worldData)
  return country
}

export { getCountryFromCoordinates }

// Function to get the country from a city name

function getCountryFromCityName(cities) {
  const countries = []
  for (const city of cities) {
    const cityName = city.split("(")[0].trim() // Extract the city name before any additional information
    const cityData = WorldCities.getByName(cityName)
    const country = cityData ? cityData.country : null
    const countryObject = {
      cityName: cityName,
      country: country,
    }
    countries.push(countryObject)
  }
  return countries
}

export { getCountryFromCityName }

function getCityNameByCoordinates(longitude, latitude) {
  const city = WorldCities.getNearestLargeCity(longitude, latitude)

  return city
}

export { getCityNameByCoordinates }

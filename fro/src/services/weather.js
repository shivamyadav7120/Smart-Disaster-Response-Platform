import { api } from './api'

// Fetch current weather from our backend.
// Backend -> OpenWeather API
// Frontend -> our backend only
//
// This keeps the OpenWeather API key on the server
// and prevents the frontend from exposing it.
export async function fetchWeatherAlert(lat, lon) {
  try {
    const response = await api.get('/weather', {
      params: {
        ...(lat != null ? { lat } : {}),
        ...(lon != null ? { lon } : {}),
      },
    })

    // Support both:
    // { data: {...} }
    // and
    // {...}
    const body = response?.data
    const weatherData = body?.data ?? body

    if (!weatherData || typeof weatherData !== 'object') {
      throw new Error('Invalid weather response')
    }

    const description =
      weatherData.description ||
      weatherData.weather ||
      'Current conditions'

    return {
      title:
        typeof description === 'string'
          ? description.charAt(0).toUpperCase() +
            description.slice(1)
          : 'Current conditions',

      area:
        weatherData.location ||
        weatherData.city ||
        'Your area',

      validUntil:
        weatherData.validUntil || '',

      temperature:
        weatherData.temperature ?? null,

      feelsLike:
        weatherData.feelsLike ?? null,

      humidity:
        weatherData.humidity ?? null,

      pressure:
        weatherData.pressure ?? null,

      windSpeed:
        weatherData.windSpeed ?? null,

      weather:
        weatherData.weather ||
        weatherData.description ||
        '',

      icon:
        weatherData.icon || '',
    }
  } catch (error) {
    console.warn(
      '[weather] Backend weather request failed:',
      error?.message || error
    )

    // Keep UI working even when backend/OpenWeather is unavailable.
    throw error
  }
};

// Get the device's current GPS position. No location is hardcoded.
export function getCurrentBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator?.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 300000,
    })
  })
}

// Get live weather for the device's current area.
export async function fetchCurrentAreaWeather() {
  const position = await getCurrentBrowserLocation()
  const { latitude, longitude, accuracy } = position.coords

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('Invalid GPS coordinates')
  }

  const weather = await fetchWeatherAlert(latitude, longitude)

  return {
    ...weather,
    latitude,
    longitude,
    locationAccuracy: Number.isFinite(accuracy) ? accuracy : null,
  }
}

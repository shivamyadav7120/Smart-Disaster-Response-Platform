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
      return null
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
    return null
  }
};
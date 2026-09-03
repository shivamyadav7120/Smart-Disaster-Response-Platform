import axios from 'axios'

const ENDPOINT = import.meta.env.VITE_AI_DAMAGE_ENDPOINT || 'http://localhost:8001/predict'

// Sends an image to your FastAPI + YOLO damage-detection service.
// imageFile: a File/Blob from an <input type="file"> or the map's report-damage flow.
export async function detectDamage(imageFile) {
  if (!imageFile) return null

  try {
    const form = new FormData()
    form.append('file', imageFile)

    const { data } = await axios.post(ENDPOINT, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 15000
    })

    // Expected FastAPI response shape: { title, confidence, severity, imageUrl }
    return data
  } catch (err) {
    console.warn('[ai-damage] model endpoint not reachable:', err.message)
    return null
  }
}

export async function fetchDamageReports() {
  try {
    const { data } = await axios.get(`${ENDPOINT.replace('/predict', '')}/reports`)
    return data
  } catch (err) {
    console.warn('[ai-damage] reports endpoint not reachable:', err.message)
    return []
  }
}

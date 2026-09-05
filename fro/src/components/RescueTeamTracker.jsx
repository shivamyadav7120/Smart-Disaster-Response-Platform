import React, { useEffect, useRef, useState } from 'react'
import { FiMapPin, FiRadio } from 'react-icons/fi'
import { updateMyRescueTeamLocation } from '../services/api'

export default function RescueTeamTracker() {
  const [sharing, setSharing] = useState(false)
  const [message, setMessage] = useState('Location sharing is off')
  const [lastUpdate, setLastUpdate] = useState(null)
  const [accuracy, setAccuracy] = useState(null)
  const watchId = useRef(null)
  const latestPosition = useRef(null)
  const timer = useRef(null)
  const sending = useRef(false)

  useEffect(() => () => stopTracking(), [])

  const sendLatest = async () => {
    const position = latestPosition.current
    if (!position || sending.current) return
    sending.current = true
    try {
      const { latitude, longitude, accuracy: gpsAccuracy } = position.coords
      await updateMyRescueTeamLocation({ latitude, longitude, accuracy: gpsAccuracy })
      setLastUpdate(new Date())
      setAccuracy(Number.isFinite(gpsAccuracy) ? gpsAccuracy : null)
      setMessage(`GPS sent: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`)
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Could not send GPS location.')
    } finally {
      sending.current = false
    }
  }

  const stopTracking = () => {
    if (watchId.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId.current)
      watchId.current = null
    }
    if (timer.current) {
      clearInterval(timer.current)
      timer.current = null
    }
    latestPosition.current = null
    setSharing(false)
    setMessage('Location sharing is off')
  }

  const startTracking = () => {
    if (!navigator.geolocation) {
      setMessage('GPS is not supported by this browser.')
      return
    }
    if (watchId.current !== null) return
    setSharing(true)
    setMessage('Waiting for GPS permission/location...')
    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        latestPosition.current = position
        setAccuracy(Number.isFinite(position.coords.accuracy) ? position.coords.accuracy : null)
        if (!lastUpdate) sendLatest()
      },
      (error) => setMessage(error.message || 'Unable to read GPS location.'),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    )
    timer.current = setInterval(sendLatest, 10000)
  }

  return (
    <div className="mb-4 rounded-2xl border border-[#dbeadb] bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center"><FiRadio /></div>
          <div>
            <div className="font-bold text-forest-900">Rescue Team GPS Tracking</div>
            <p className="text-xs text-slate-500 mt-1">Real device GPS is sent to the SDRP command map every 10 seconds.</p>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1"><FiMapPin /> {message}</p>
            {accuracy != null && <p className="text-[11px] text-slate-500 mt-1">GPS accuracy: ~{Math.round(accuracy)} m</p>}
            {lastUpdate && <p className="text-[10px] text-slate-400 mt-1">Last server update: {lastUpdate.toLocaleTimeString()}</p>}
          </div>
        </div>
        {sharing ? (
          <button type="button" onClick={stopTracking} className="px-4 py-2 rounded-xl bg-red-50 text-red-700 text-xs font-bold">Stop Live GPS</button>
        ) : (
          <button type="button" onClick={startTracking} className="px-4 py-2 rounded-xl bg-green-700 text-white text-xs font-bold">Start Live GPS</button>
        )}
      </div>
    </div>
  )
}

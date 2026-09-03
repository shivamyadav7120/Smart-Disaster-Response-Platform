import React, { useEffect, useRef, useState } from 'react'
import { FiMapPin, FiRadio } from 'react-icons/fi'
import {
  updateMyRescueTeamLocation,
  stopMyRescueTeamLocation,
} from '../services/api'

const HEARTBEAT_MS = 10000

export default function RescueTeamTracker() {
  const [sharing, setSharing] = useState(false)
  const [message, setMessage] = useState('Location sharing is off')
  const [lastUpdate, setLastUpdate] = useState(null)
  const [accuracy, setAccuracy] = useState(null)

  const watchId = useRef(null)
  const heartbeatId = useRef(null)
  const sending = useRef(false)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true

    return () => {
      mounted.current = false

      if (watchId.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId.current)
      }

      if (heartbeatId.current !== null) {
        window.clearInterval(heartbeatId.current)
      }
    }
  }, [])

  const sendPosition = async (position) => {
    if (!position || sending.current) return

    const {
      latitude,
      longitude,
      accuracy: gpsAccuracy,
    } = position.coords || {}

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) return

    sending.current = true

    try {
      await updateMyRescueTeamLocation({
        latitude,
        longitude,
        accuracy: gpsAccuracy,
      })

      if (!mounted.current) return

      setLastUpdate(new Date())
      setAccuracy(
        Number.isFinite(gpsAccuracy)
          ? Math.round(gpsAccuracy)
          : null
      )
      setMessage(
        `LIVE GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
      )
    } catch (error) {
      if (mounted.current) {
        setMessage(
          error?.response?.data?.message ||
          'Could not send GPS location. Retrying...'
        )
      }
    } finally {
      sending.current = false
    }
  }

  const requestCurrentPosition = () => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      sendPosition,
      (error) => {
        if (mounted.current) {
          setMessage(
            error?.message ||
            'Unable to read GPS location.'
          )
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      },
    )
  }

  const stopTracking = async () => {
    if (watchId.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId.current)
      watchId.current = null
    }

    if (heartbeatId.current !== null) {
      window.clearInterval(heartbeatId.current)
      heartbeatId.current = null
    }

    try {
      await stopMyRescueTeamLocation()
      setMessage('Live GPS stopped. Team is no longer shown as live.')
    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
        'GPS stopped on this device, but server status could not be updated.'
      )
    }

    setSharing(false)
    setAccuracy(null)
  }

  const startTracking = () => {
    if (!navigator.geolocation) {
      setMessage('GPS is not supported by this browser.')
      return
    }

    if (
      !window.isSecureContext &&
      window.location.hostname !== 'localhost'
    ) {
      setMessage('Live GPS requires HTTPS on deployed sites.')
      return
    }

    setSharing(true)
    setMessage('Requesting real device GPS permission...')

    watchId.current = navigator.geolocation.watchPosition(
      sendPosition,
      (error) => {
        if (mounted.current) {
          setMessage(
            error?.message ||
            'Unable to read GPS location.'
          )
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      },
    )

    // watchPosition can remain quiet when the device is stationary.
    // Heartbeats keep MongoDB's lastUpdated fresh.
    heartbeatId.current = window.setInterval(
      requestCurrentPosition,
      HEARTBEAT_MS
    )

    requestCurrentPosition()
  }

  return (
    <div className="mb-4 rounded-2xl border border-[#dbeadb] bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            sharing
              ? 'bg-green-100 text-green-700'
              : 'bg-slate-100 text-slate-600'
          }`}>
            <FiRadio />
          </div>

          <div>
            <div className="font-bold text-forest-900">
              Rescue Team GPS Tracking
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Real device GPS is sent to the SDRP command map every 10 seconds.
            </p>

            <p className={`text-[11px] mt-1 flex items-center gap-1 ${
              sharing ? 'text-green-700 font-semibold' : 'text-slate-500'
            }`}>
              <FiMapPin />
              {message}
            </p>

            {accuracy !== null && (
              <p className="text-[10px] text-slate-400 mt-1">
                GPS accuracy: ~{accuracy} m
              </p>
            )}

            {lastUpdate && (
              <p className="text-[10px] text-slate-400 mt-1">
                Last server update: {lastUpdate.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {sharing ? (
          <button
            type="button"
            onClick={stopTracking}
            className="px-4 py-2 rounded-xl bg-red-50 text-red-700 text-xs font-bold"
          >
            Stop Live GPS
          </button>
        ) : (
          <button
            type="button"
            onClick={startTracking}
            className="px-4 py-2 rounded-xl bg-green-700 text-white text-xs font-bold"
          >
            Start Live GPS
          </button>
        )}
      </div>
    </div>
  )
}

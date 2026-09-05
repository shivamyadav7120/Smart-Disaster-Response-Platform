import React, { useEffect, useMemo, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  GeoJSON,
  Polyline,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'

import {
  FiNavigation,
  FiSearch,
  FiRefreshCw,
  FiCrosshair,
  FiAlertTriangle,
  FiHome,
  FiTruck,
  FiHeart,
  FiMapPin,
} from 'react-icons/fi'

import {
  fetchHospitals,
  fetchLiveRescueTeams,
  fetchShelters,
  fetchSOSRequests,
} from '../services/api'

import {
  getRoute,
  searchPlaces,
} from '../services/gis'

import {
  nearestByDistance,
} from '../utils/geo'

import {
  joinLiveMap,
  onLocationUpdate,
  onNewSOS,
} from '../services/socket'

import {
  blockedRoads as fallbackBlockedRoads,
} from '../data/mockData'

import riskZones from '../data/riskZones'


const CENTER = [28.66, 77.35]


const LAYERS = [
  {
    key: 'sos',
    label: 'SOS',
    color: '#dc2626',
    icon: FiAlertTriangle,
  },
  {
    key: 'shelters',
    label: 'Shelters',
    color: '#2563eb',
    icon: FiHome,
  },
  {
    key: 'teams',
    label: 'Rescue Teams',
    color: '#16a34a',
    icon: FiTruck,
  },
  {
    key: 'hospitals',
    label: 'Hospitals',
    color: '#e11d48',
    icon: FiHeart,
  },
  {
    key: 'blocked',
    label: 'Blocked Roads',
    color: '#f59e0b',
    icon: FiAlertTriangle,
  },
  {
    key: 'risk',
    label: 'Risk Zones',
    color: '#7c3aed',
    icon: FiMapPin,
  },
]


const pin = (color, emoji) =>
  L.divIcon({
    html: `
      <div
        style="
          width:34px;
          height:34px;
          border-radius:50% 50% 50% 0;
          background:${color};
          transform:rotate(-45deg);
          border:2px solid #fff;
          box-shadow:0 4px 12px rgba(0,0,0,.28);
          display:flex;
          align-items:center;
          justify-content:center;
        "
      >
        <span
          style="
            transform:rotate(45deg);
            font-size:16px;
          "
        >
          ${emoji}
        </span>
      </div>
    `,
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -30],
  })


function Recenter({ center, zoom }) {
  const map = useMap()

  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 0.7,
    })
  }, [center, zoom, map])

  return null
}


function LocateControl({ onLocation }) {
  const map = useMap()

  const locate = () => {
    map.locate({
      setView: true,
      maxZoom: 14,
    })

    map.once('locationfound', (e) => {
      onLocation([
        e.latlng.lat,
        e.latlng.lng,
      ])
    })
  }

  return (
    <button
      type="button"
      onClick={locate}
      className="absolute z-[1000] top-3 right-3 bg-white border border-slate-200 shadow-lg rounded-xl p-2.5 hover:bg-slate-50"
      title="Use my location"
    >
      <FiCrosshair />
    </button>
  )
}


const riskStyle = (feature) => {
  const risk = feature?.properties?.risk

  if (risk === 'High') {
    return {
      color: '#dc2626',
      fillColor: '#ef4444',
      fillOpacity: 0.22,
      weight: 2,
    }
  }

  if (risk === 'Medium') {
    return {
      color: '#f59e0b',
      fillColor: '#f59e0b',
      fillOpacity: 0.18,
      weight: 2,
    }
  }

  return {
    color: '#16a34a',
    fillColor: '#22c55e',
    fillOpacity: 0.14,
    weight: 2,
  }
}


export default function LiveMap({
  height = 620,
  showLegend = true,
}) {

  const [visible, setVisible] = useState({
    sos: true,
    shelters: true,
    teams: true,
    hospitals: true,
    blocked: true,
    risk: true,
  })

  const [center, setCenter] =
    useState(CENTER)

  const [zoom, setZoom] =
    useState(10.5)

  const [query, setQuery] =
    useState('')

  const [results, setResults] =
    useState([])

  const [searching, setSearching] =
    useState(false)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [sos, setSOS] =
    useState([])

  const [shelters, setShelters] =
    useState([])

  const [hospitals, setHospitals] =
    useState([])

  const [teams, setTeams] =
    useState([])

  const [route, setRoute] =
    useState(null)

  const [routeTarget, setRouteTarget] =
    useState('')

  const [selectedSOS, setSelectedSOS] =
    useState(null)

  const [selectedResource, setSelectedResource] =
    useState(null)


  // =========================================================
  // LOAD LIVE BACKEND DATA
  // =========================================================

  const loadData = async () => {

    setLoading(true)
    setError('')

    try {

      const [
        sosData,
        shelterData,
        hospitalData,
        teamData,
      ] = await Promise.all([
        fetchSOSRequests(),
        fetchShelters(),
        fetchHospitals(),
        fetchLiveRescueTeams(),
      ])

      setSOS(
        Array.isArray(sosData)
          ? sosData
          : []
      )

      setShelters(
        Array.isArray(shelterData)
          ? shelterData
          : []
      )

      setHospitals(
        Array.isArray(hospitalData)
          ? hospitalData
          : []
      )

      setTeams(
        Array.isArray(teamData)
          ? teamData
          : []
      )

    } catch (err) {

      console.error(
        'Live map data error:',
        err
      )

      setSOS([])
      setShelters([])
      setHospitals([])
      setTeams([])

      setError(
        'Unable to load live backend data. Please check the server and login.'
      )

    } finally {

      setLoading(false)

    }
  }


  useEffect(() => {
    loadData()
  }, [])

  // Receive newly created SOS alerts without refreshing the command map.
  useEffect(() => {
    const stopListening = onNewSOS((incoming) => {
      if (!incoming?._id && !incoming?.id) return
      setSOS((current) => {
        const id = String(incoming._id || incoming.id)
        const index = current.findIndex((item) => String(item._id || item.id) === id)
        if (index === -1) return [incoming, ...current]
        const next = [...current]
        next[index] = { ...next[index], ...incoming }
        return next
      })
    })
    return stopListening
  }, [])

  // Receive rescue-team GPS updates without refreshing the page.
  useEffect(() => {
    joinLiveMap()

    const stopListening = onLocationUpdate((update) => {
      if (update?.type !== 'RescueTeam') return

      setTeams((current) => {
        const incoming = {
          ...update,
          lat: Number(update.lat ?? update.location?.latitude),
          lng: Number(update.lng ?? update.location?.longitude),
          status: update.status || 'Available',
        }

        const index = current.findIndex(
          (team) => String(team._id || team.teamId) === String(update.teamId)
        )

        if (index === -1) return [...current, incoming]

        const next = [...current]
        next[index] = { ...next[index], ...incoming }
        return next
      })
    })

    return stopListening
  }, [])


  // =========================================================
  // STATISTICS
  // =========================================================

  const stats = useMemo(
    () => ({
      sos: sos.filter(
        (x) =>
          x.status !== 'Resolved' &&
          x.status !== 'Cancelled'
      ).length,

      shelters: shelters.filter(
        (x) =>
          x.status !== 'Closed'
      ).length,

      hospitals: hospitals.filter(
        (x) =>
          x.status !== 'Closed'
      ).length,

      teams: teams.filter(
        (x) =>
          x.status !== 'Offline'
      ).length,

      blocked:
        fallbackBlockedRoads.length,
    }),

    [
      sos,
      shelters,
      hospitals,
      teams,
    ]
  )


  // =========================================================
  // SEARCH
  // =========================================================

  const doSearch = async (e) => {

    e?.preventDefault()

    const text =
      query.trim().toLowerCase()

    if (text.length < 2) {

      setResults([])

      return
    }

    setSearching(true)
    setError('')

    try {

      // -----------------------------------------------------
      // SEARCH LIVE SDRP DATA
      // -----------------------------------------------------

      const localResults = [

        ...sos.map((x) => ({
          type: 'SOS',

          name:
            x.id ||
            x._id ||
            'SOS Request',

          lat: Number(x.lat),

          lng: Number(x.lng),

          displayName:
            x.loc ||
            x.location ||
            x.address ||
            'SOS Request',
        })),

        ...shelters.map((x) => ({
          type: 'Shelter',

          name:
            x.name ||
            'Shelter',

          lat: Number(x.lat),

          lng: Number(x.lng),

          displayName:
            x.name ||
            'Shelter',
        })),

        ...hospitals.map((x) => ({
          type: 'Hospital',

          name:
            x.name ||
            'Hospital',

          lat: Number(x.lat),

          lng: Number(x.lng),

          displayName:
            x.name ||
            'Hospital',
        })),

        ...teams.map((x) => ({
          type: 'Rescue Team',

          name:
            x.name ||
            'Rescue Team',

          lat: Number(x.lat),

          lng: Number(x.lng),

          displayName:
            x.name ||
            'Rescue Team',
        })),

      ].filter(
        (x) =>
          x.displayName &&
          Number.isFinite(x.lat) &&
          Number.isFinite(x.lng) &&
          x.displayName
            .toLowerCase()
            .includes(text)
      )


      // -----------------------------------------------------
      // IF LIVE SDRP DATA FOUND
      // -----------------------------------------------------

      if (localResults.length > 0) {

        setResults(localResults)

        setCenter([
          localResults[0].lat,
          localResults[0].lng,
        ])

        setZoom(15)

        return
      }


      // -----------------------------------------------------
      // OTHERWISE SEARCH REAL MAP LOCATION
      // -----------------------------------------------------

      const mapResults =
        await searchPlaces(
          query.trim()
        )

      setResults(
        Array.isArray(mapResults)
          ? mapResults
          : []
      )

      if (mapResults?.[0]) {

        setCenter([
          Number(mapResults[0].lat),
          Number(mapResults[0].lng),
        ])

        setZoom(14)
      }

    } catch (err) {

      console.error(
        'Search error:',
        err
      )

      setResults([])

      setError(
        'Search failed. Please try again.'
      )

    } finally {

      setSearching(false)

    }
  }


  // =========================================================
  // ROUTING
  // =========================================================

  const buildRoute = async (
    sosItem,
    destination,
    label
  ) => {

    if (
      !sosItem ||
      !destination
    ) {
      return
    }

    setSelectedSOS(sosItem)

    setRouteTarget(label)

    setError('')

    try {

      const data =
        await getRoute({
          fromLat:
            Number(sosItem.lat),

          fromLng:
            Number(sosItem.lng),

          toLat:
            Number(destination.lat),

          toLng:
            Number(destination.lng),
        })

      setRoute(data)

      setCenter([
        Number(sosItem.lat),
        Number(sosItem.lng),
      ])

      setZoom(12)

    } catch (err) {

      console.error(
        'Routing error:',
        err
      )

      setError(
        'Routing service unavailable. Please try again.'
      )
    }
  }


  const routeToNearest = async (
    sosItem,
    type
  ) => {

    const pool =
      type === 'hospital'
        ? hospitals
        : shelters

    const nearest =
      nearestByDistance(
        sosItem,
        pool
      )[0]

    if (nearest) {

      await buildRoute(
        sosItem,
        nearest,
        `${
          type === 'hospital'
            ? 'Hospital'
            : 'Shelter'
        }: ${nearest.name}`
      )

    } else {

      setError(
        `No nearby ${
          type === 'hospital'
            ? 'hospital'
            : 'shelter'
        } found.`
      )
    }
  }


  const routeLine =
    route?.geometry?.coordinates?.map(
      ([lng, lat]) => [
        lat,
        lng,
      ]
    ) || []


  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="card p-4 bg-white border border-[#dbeadb] rounded-2xl shadow-sm">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">

        <div>

          <div className="flex items-center gap-2">

            <h2 className="font-bold text-[17px] text-forest-900">
              Live GIS Disaster Map
            </h2>

            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#2f8a52] bg-green-50 px-2 py-1 rounded-full">

              <span className="w-2 h-2 rounded-full bg-[#2f8a52] pulse-dot" />

              LIVE

            </span>

          </div>

          <p className="text-xs text-slate-500 mt-1">
            SOS, shelters, hospitals, response teams,
            risk zones and emergency routing
          </p>

        </div>


        <div className="flex gap-2">

          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-slate-50 disabled:opacity-60"
          >

            <FiRefreshCw />

            {loading
              ? 'Refreshing...'
              : 'Refresh'}

          </button>

        </div>

      </div>


      {/* STATISTICS */}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">

        {[
          [
            'SOS',
            stats.sos,
            'bg-red-50 text-red-700',
          ],

          [
            'Shelters',
            stats.shelters,
            'bg-blue-50 text-blue-700',
          ],

          [
            'Hospitals',
            stats.hospitals,
            'bg-rose-50 text-rose-700',
          ],

          [
            'Teams',
            stats.teams,
            'bg-green-50 text-green-700',
          ],

          [
            'Blocked',
            stats.blocked,
            'bg-amber-50 text-amber-700',
          ],

        ].map(
          ([
            label,
            value,
            cls,
          ]) => (

            <div
              key={label}
              className={`rounded-xl px-3 py-2 ${cls}`}
            >

              <div className="text-lg font-extrabold">
                {value}
              </div>

              <div className="text-[11px] font-semibold">
                {label}
              </div>

            </div>

          )
        )}

      </div>


      {/* SEARCH */}

      <form
        onSubmit={doSearch}
        className="relative flex gap-2 mb-3"
      >

        <div className="relative flex-1">

          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Search SOS, shelter, hospital, team or location..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
          />

        </div>


        <button
          type="submit"
          disabled={searching}
          className="px-4 rounded-xl bg-forest-900 text-white text-sm font-semibold disabled:opacity-60"
        >

          {searching
            ? 'Searching...'
            : 'Search'}

        </button>


        {/* SEARCH RESULTS */}

        {results.length > 0 && (

          <div className="absolute top-12 left-0 right-20 z-[1100] bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-80 overflow-y-auto">

            {results.map(
              (r, index) => (

                <button
                  type="button"
                  key={
                    r.placeId ||
                    `${r.type}-${r.name}-${index}`
                  }

                  onClick={() => {

                    const lat =
                      Number(r.lat)

                    const lng =
                      Number(r.lng)

                    if (
                      Number.isFinite(lat) &&
                      Number.isFinite(lng)
                    ) {

                      setCenter([
                        lat,
                        lng,
                      ])

                      setZoom(15)
                    }

                    setResults([])

                    setQuery(
                      r.displayName ||
                      r.name ||
                      ''
                    )
                  }}

                  className="block w-full text-left px-3 py-2.5 hover:bg-slate-50 border-b last:border-b-0 text-xs"
                >

                  <b>

                    {r.name ||
                      r.displayName?.split(',')[0] ||
                      'Location'}

                  </b>


                  <span className="block text-slate-500 mt-0.5">

                    {r.type &&
                      `${r.type} • `}

                    {r.displayName}

                  </span>

                </button>

              )
            )}

          </div>

        )}

      </form>


      {/* ERROR */}

      {error && (

        <div className="mb-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2">

          {error}

        </div>

      )}


      {/* MAP */}

      <div
        id="map-container"
        className="relative overflow-hidden rounded-2xl border border-slate-200"
        style={{ height }}
      >

        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom
          className="h-full w-full"
        >

          <Recenter
            center={center}
            zoom={zoom}
          />


          <LocateControl
            onLocation={(loc) => {

              setCenter(loc)

              setZoom(14)

            }}
          />


          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />


          {/* RISK ZONES */}

          {visible.risk && (

            <GeoJSON
              data={riskZones}
              style={riskStyle}

              onEachFeature={(
                feature,
                layer
              ) =>
                layer.bindPopup(`
                  <b>${feature.properties.name}</b>
                  <br/>
                  Risk: ${feature.properties.risk}
                  <br/>
                  Score: ${feature.properties.score}/100
                `)
              }
            />

          )}


          {/* SOS */}

          {visible.sos &&

            sos
              .filter(
                (s) =>
                  Number.isFinite(
                    Number(s.lat)
                  ) &&
                  Number.isFinite(
                    Number(s.lng)
                  )
              )

              .map((s) => (

                <Marker
                  key={
                    s.id ||
                    s._id
                  }

                  position={[
                    Number(s.lat),
                    Number(s.lng),
                  ]}

                  icon={pin(
                    '#dc2626',
                    '⚠️'
                  )}

                  eventHandlers={{
                    click: () =>
                      setSelectedSOS(s),
                  }}
                >

                  <Popup>

                    <div className="min-w-[210px]">

                      <b className="text-red-700">

                        {s.id ||
                          s._id ||
                          'SOS Request'}

                      </b>

                      <br />

                      {s.loc ||
                        s.location ||
                        s.address ||
                        'Unknown location'}

                      <br />

                      <span>

                        Priority:{' '}

                        <b>
                          {s.priority ||
                            s.severity ||
                            'Normal'}
                        </b>

                      </span>

                      <br />

                      Status:{' '}

                      {s.status ||
                        'Pending'}


                      <div className="flex gap-1 mt-2">

                        <button
                          type="button"
                          className="text-[11px] px-2 py-1 rounded bg-rose-50 text-rose-700"
                          onClick={() =>
                            routeToNearest(
                              s,
                              'hospital'
                            )
                          }
                        >
                          Route Hospital
                        </button>


                        <button
                          type="button"
                          className="text-[11px] px-2 py-1 rounded bg-blue-50 text-blue-700"
                          onClick={() =>
                            routeToNearest(
                              s,
                              'shelter'
                            )
                          }
                        >
                          Route Shelter
                        </button>

                      </div>

                    </div>

                  </Popup>

                </Marker>

              ))

          }


          {/* SHELTERS */}

          {visible.shelters &&

            shelters
              .filter(
                (s) =>
                  Number.isFinite(
                    Number(s.lat)
                  ) &&
                  Number.isFinite(
                    Number(s.lng)
                  )
              )

              .map((s) => (

                <Marker
                  key={
                    s._id ||
                    s.name
                  }

                  position={[
                    Number(s.lat),
                    Number(s.lng),
                  ]}

                  icon={pin(
                    '#2563eb',
                    '🏠'
                  )}

                  eventHandlers={{
                    click: () =>
                      setSelectedResource(s),
                  }}
                >

                  <Popup>

                    <b>
                      {s.name ||
                        'Shelter'}
                    </b>

                    <br />

                    Status:{' '}

                    {s.status ||
                      'Open'}

                    <br />

                    Available:{' '}

                    {Math.max(
                      0,
                      Number(
                        s.capacity || 0
                      ) -
                        Number(
                          s.occupied || 0
                        )
                    )}

                    /
                    {s.capacity || 0}

                    <br />

                    {s.contact || ''}

                  </Popup>

                </Marker>

              ))

          }


          {/* RESCUE TEAMS */}

          {visible.teams &&

            teams
              .filter(
                (t) =>
                  Number.isFinite(
                    Number(t.lat)
                  ) &&
                  Number.isFinite(
                    Number(t.lng)
                  )
              )

              .map((t, i) => (

                <Marker
                  key={
                    t._id ||
                    t.name ||
                    i
                  }

                  position={[
                    Number(t.lat),
                    Number(t.lng),
                  ]}

                  icon={pin(
                    '#16a34a',
                    '🚒'
                  )}
                >

                  <Popup>

                    <div className="min-w-[230px]">
                      <div className="font-bold text-green-700 text-sm">
                        {t.name || 'Rescue Team'}
                      </div>

                      <div className="mt-2 space-y-1 text-xs text-slate-600">
                        <div><b>Leader:</b> {t.leaderName || t.user?.name || '—'}</div>
                        <div><b>Phone:</b> {t.phone || t.user?.phone || '—'}</div>
                        <div><b>Members:</b> {t.members || 1}</div>
                        <div><b>Status:</b> {t.status || t.trackingStatus || 'Available'}</div>
                        <div><b>Area:</b> {t.assignedArea || t.area || '—'}</div>
                        <div><b>Skills:</b> {Array.isArray(t.skills) && t.skills.length ? t.skills.join(', ') : '—'}</div>
                        <div><b>GPS:</b> {Number(t.lat).toFixed(5)}, {Number(t.lng).toFixed(5)}</div>
                        <div><b>Updated:</b> {t.lastUpdated ? new Date(t.lastUpdated).toLocaleString() : 'Just now'}</div>
                      </div>

                      {Array.isArray(t.assignments) && t.assignments.length ? (
                        <div className="mt-2 rounded-lg bg-red-50 px-2 py-1.5 text-[11px] text-red-700">
                          <div className="font-bold mb-1">Active SOS / Distance</div>
                          {t.assignments.map((a, i) => (
                            <div key={a.sos?._id || i}>
                              #{String(a.sos?._id || '').slice(-8)} — {a.distanceText || (a.distanceMeters != null ? `${a.distanceMeters} m` : 'GPS unavailable')}
                            </div>
                          ))}
                        </div>
                      ) : t.assignedSOS ? (
                        <div className="mt-2 rounded-lg bg-red-50 px-2 py-1.5 text-[11px] text-red-700">
                          Assigned SOS: {t.assignedSOS._id || t.assignedSOS.id || 'Active incident'}
                        </div>
                      ) : null}
                    </div>

                  </Popup>

                </Marker>

              ))

          }


          {/* HOSPITALS */}

          {visible.hospitals &&

            hospitals
              .filter(
                (h) =>
                  Number.isFinite(
                    Number(h.lat)
                  ) &&
                  Number.isFinite(
                    Number(h.lng)
                  )
              )

              .map((h) => (

                <Marker
                  key={
                    h._id ||
                    h.name
                  }

                  position={[
                    Number(h.lat),
                    Number(h.lng),
                  ]}

                  icon={pin(
                    '#e11d48',
                    '🏥'
                  )}
                >

                  <Popup>

                    <b>
                      {h.name ||
                        'Hospital'}
                    </b>

                    <br />

                    Status:{' '}

                    {h.status ||
                      'Open'}

                    <br />

                    Available beds:{' '}

                    {h.available ??
                      h.availableBeds ??
                      0}

                    /

                    {h.beds ??
                      h.totalBeds ??
                      0}

                    <br />

                    {h.phone || ''}

                  </Popup>

                </Marker>

              ))

          }


          {/* BLOCKED ROADS */}

          {visible.blocked &&

            fallbackBlockedRoads.map(
              (b) => (

                <CircleMarker
                  key={b.name}

                  center={[
                    Number(b.lat),
                    Number(b.lng),
                  ]}

                  radius={9}

                  pathOptions={{
                    color: '#f59e0b',
                    fillColor: '#f59e0b',
                    fillOpacity: 0.9,
                  }}
                >

                  <Popup>

                    <b>
                      ⚠️ Blocked Road
                    </b>

                    <br />

                    {b.name}

                    <br />

                    Use alternate route.

                  </Popup>

                </CircleMarker>

              )
            )

          }


          {/* ROUTE */}

          {routeLine.length > 1 && (

            <Polyline
              positions={routeLine}

              pathOptions={{
                color: '#0f766e',
                weight: 6,
                opacity: 0.85,
                dashArray: '10 8',
              }}
            />

          )}

        </MapContainer>


        {/* LAYER CONTROLS */}

        <div className="absolute z-[1000] bottom-3 left-3 right-3 md:right-auto bg-white/95 backdrop-blur border border-slate-200 shadow-lg rounded-xl p-2 flex flex-wrap gap-1.5">

          {LAYERS.map((l) => {

            const Icon = l.icon

            return (

              <button
                key={l.key}
                type="button"

                onClick={() =>
                  setVisible((v) => ({
                    ...v,
                    [l.key]:
                      !v[l.key],
                  }))
                }

                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border ${
                  visible[l.key]
                    ? 'bg-white border-slate-200'
                    : 'bg-slate-100 border-slate-100 opacity-50'
                }`}
              >

                <Icon
                  style={{
                    color: l.color,
                  }}
                />

                {l.label}

              </button>

            )

          })}

        </div>

      </div>


      {/* LEGEND / ROUTE INFO */}

      {showLegend && (

        <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs">

          <div className="flex flex-wrap gap-2 text-slate-500">

            <span>
              🔴 High Risk
            </span>

            <span>
              🟠 Medium Risk
            </span>

            <span>
              🟢 Low Risk
            </span>

            <span>
              ⚠️ Blocked
            </span>

          </div>


          {route && (

            <div className="flex items-center gap-2 bg-teal-50 text-teal-800 rounded-lg px-3 py-2">

              <FiNavigation />

              <b>
                {routeTarget}
              </b>

              · {route.distanceKm} km ·{' '}
              {route.durationMin} min


              <button
                type="button"
                onClick={() => {
                  setRoute(null)
                  setRouteTarget('')
                }}
                className="ml-1 underline"
              >
                Clear
              </button>

            </div>

          )}

        </div>

      )}


      {/* LOADING */}

      {loading && (

        <div className="text-xs text-slate-500 mt-2">

          Loading live GIS data…

        </div>

      )}

    </div>
  )
}
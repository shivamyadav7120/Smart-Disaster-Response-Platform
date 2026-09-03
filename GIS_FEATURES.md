# SDRP GIS Features Added

The corrected project now includes a GIS-focused Live Disaster Map.

## Added features

1. **Live backend map data**
   - SOS requests
   - shelters
   - hospitals
   - live volunteer/responder tracking
   - automatic demo fallback if the backend is unavailable

2. **Location search**
   - React search box -> `GET /api/gis/geocode`
   - Node proxies the request to OpenStreetMap Nominatim
   - Results can recenter the Leaflet map

3. **Emergency routing**
   - `GET /api/gis/route`
   - Node proxies routing requests to OSRM
   - Route is rendered as a Leaflet polyline
   - SOS popup can route to nearest hospital or shelter

4. **Nearest-resource calculation**
   - Local geographic distance calculation in `fronten-sdrp/src/utils/geo.js`
   - No extra browser API key required

5. **Risk zones**
   - GeoJSON risk polygons in `fronten-sdrp/src/data/riskZones.geojson`
   - High/Medium/Low risk styling

6. **Map controls**
   - Layer toggles
   - Refresh
   - Locate-me control
   - Search
   - GIS statistics
   - Route distance/duration display

## Backend endpoints

- `GET /api/gis/geocode?q=Indirapuram, Ghaziabad`
- `GET /api/gis/route?fromLat=28.64&fromLng=77.37&toLat=28.66&toLng=77.45`

Both endpoints use the existing authentication middleware.

## Important setup

The public Nominatim and OSRM services are suitable for development/demo use but have usage/capacity policies. For production or high traffic, use a dedicated/self-hosted provider.

The backend `.env` in this archive contains placeholders intentionally. Add your own MongoDB, JWT and OpenWeather values before running.

## Run

Terminal 1:

```bash
cd sdrp-backend
npm install
npm run dev
```

Terminal 2:

```bash
cd fronten-sdrp
npm install
npm run dev
```

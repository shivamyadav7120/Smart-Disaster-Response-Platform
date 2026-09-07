# SDRP — Smart Disaster Response Platform (Frontend)

A fully working, clickable React dashboard matching the SDRP design — routed pages,
interactive map, charts, notifications, and every card wired to a service layer
that's ready for a real backend.

⚠️ This is frontend only, as requested. All data is mock data served through
service functions that already speak axios / OpenWeather / FastAPI / Socket.IO —
point the `.env` values at your real services and nothing else needs to change.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173

## Build for production

```bash
npm run build
npm run preview
```

## Tech stack (matches the spec)

| Component      | Technology                          |
|-----------------|--------------------------------------|
| Navbar          | React + Tailwind                    |
| Sidebar         | React + Tailwind + React Router     |
| Cards           | React Components                    |
| Live Map        | React Leaflet + OpenStreetMap       |
| SOS Table       | React + Axios (`src/services/api.js`) |
| Weather         | OpenWeather API (`src/services/weather.js`) |
| Charts          | Recharts (Analytics & Resources pages) |
| AI Damage       | React + FastAPI (`src/services/aiDamage.js`) |
| Notifications   | Socket.IO client (`src/services/socket.js`) |
| Icons           | React Icons (`src/components/icons.js`) |
| Animations      | Framer Motion (sidebar, cards, modals, page transitions) |

## What's actually clickable right now

- **Sidebar** — every item routes to a real page (`/map`, `/sos`, `/teams`, `/shelters`,
  `/resources`, `/volunteers`, `/hospitals`, `/analytics`, `/reports`, `/settings`).
- **Live Map** — click any pin for a popup with real details; click a legend chip to
  toggle that layer on/off.
- **SOS list** — click a row to open a detail modal with a "Dispatch Team" action.
- **Notification bell / profile menu** — click to open dropdowns (top right).
- **AI Damage card** — "Upload photo" actually opens a file picker and calls the
  FastAPI service function (falls back to mock data if no backend is running).
- **Settings page** — a real controlled form with save confirmation.

## Folder structure

```
src/
├── components/       Navbar, Sidebar, StatCard, LiveMap, SOSList,
│                      WeatherCard, ResourceCard, AIDamageCard, PageHeader, icons.js
├── pages/             One page per sidebar item — Dashboard, LiveMapPage, SOSRequestsPage,
│                      RescueTeamsPage, SheltersPage, ResourcesPage, VolunteersPage,
│                      HospitalsPage, AnalyticsPage, ReportsPage, SettingsPage
├── services/
│   ├── api.js          axios instance + fetchSOSRequests / fetchShelters / fetchRescueTeams /
│   │                    fetchHospitals / fetchVolunteers / fetchResources / fetchStats
│   │                    — each falls back to mock data if the backend isn't reachable yet
│   ├── weather.js       OpenWeather One Call API — needs VITE_OPENWEATHER_API_KEY
│   ├── aiDamage.js       detectDamage(file) posts to your FastAPI/YOLO endpoint
│   └── socket.js         Socket.IO client, autoConnect: false until you call connectSocket()
├── data/mockData.js    All fallback data in one place
├── App.jsx              Routes + layout shell
└── main.jsx             Entry point, wraps App in BrowserRouter
```

## Connecting your real backend (next steps, not done here)

1. Set `VITE_API_BASE_URL` in `.env` to your FastAPI/Express server. The moment
   it responds, `services/api.js` stops using mock data automatically — no
   component code needs to change.
2. Set `VITE_OPENWEATHER_API_KEY` to go live on the Weather card.
3. Point `VITE_AI_DAMAGE_ENDPOINT` at your FastAPI + YOLO service; the "Upload
   photo" button on the AI Damage card already posts a `multipart/form-data` file to it.
4. Point `VITE_SOCKET_URL` at your Socket.IO server, then call `connectSocket()`
   and listen for a `sos:new` event (see the comment at the bottom of `services/socket.js`)
   to push new SOS pins onto the map/list in real time instead of polling.

## Theme tokens

Colors live in `tailwind.config.js` under `theme.extend.colors` (`forest`, `mint`, `alert.*`).
Change them there to re-theme the whole app consistently.

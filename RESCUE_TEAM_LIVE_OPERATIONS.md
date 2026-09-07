# SDRP Rescue Team Live Operations

Implemented flow:

- Public registration creates **Citizen** accounts only.
- Authorized `SuperAdmin`, `DistrictAdmin`, and `NGO` can register a RescueTeam account + RescueTeam document.
- RescueTeam logs in using the created account and is routed to `/rescue-team-portal`.
- RescueTeam can start browser GPS; current location is stored in `rescueteams.currentLocation` and `tracking`.
- Socket.IO broadcasts live team locations to the admin live map and the citizen tracking room for the assigned SOS.
- Admin can assign a registered available team to an SOS from `/sos`.
- Citizen portal `/citizen` can create SOS and track an assigned team at `/track-rescue/:sosId`.
- Citizen sees team location, distance, ETA, and status.
- RescueTeam can set `Accepted`, `Rescue On Way`, `Reached`, and `Resolved`.
- Resolving an SOS marks it inactive and returns the team to `Available`.

## Run

Backend:
```bash
cd bac
npm install
npm run dev
```

Frontend:
```bash
cd fro
npm install
npm run dev
```

Use `http://localhost:5173` or HTTPS for browser GPS.

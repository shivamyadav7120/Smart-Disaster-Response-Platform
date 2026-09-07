# SDRP Updated Rescue Operations

This version adds the complete Citizen -> SOS -> Admin -> Rescue Team -> Live GPS -> Reached -> Resolved workflow.

## Run backend

```bash
cd bac
npm install
npm run dev
```

## Run frontend

```bash
cd fro
npm install
npm run dev
```

## Port defaults

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API: http://localhost:5000/api

## Roles

- Citizen: public registration, send SOS, view own SOS, track assigned rescue team.
- RescueTeam: account created by authorized admin; dedicated portal and browser GPS.
- DistrictAdmin / SuperAdmin / NGO: register teams and assign teams to SOS.

## Main new APIs

- `POST /api/rescue-teams`
- `GET /api/rescue-teams`
- `GET /api/rescue-teams/live`
- `PATCH /api/rescue-teams/assign/:sosId`
- `GET /api/rescue-teams/track/my`
- `GET /api/rescue-teams/my`
- `GET /api/rescue-teams/my/assignments`
- `POST /api/rescue-teams/my/location`
- `PATCH /api/rescue-teams/my/assignments/:sosId/status`

## Frontend pages

- `/register` - Citizen registration
- `/citizen` - Citizen emergency portal
- `/track-rescue/latest` - Track active assigned rescue team
- `/rescue-team-portal` - Rescue team operations portal
- `/teams/register` - Admin rescue team registration
- `/teams` - Admin team management
- `/sos` - Admin SOS management and team assignment
- `/map` - Admin live map

## GPS

Browser GPS requires localhost or HTTPS. Give the RescueTeam browser/device location permission, then click **Start Live GPS**.

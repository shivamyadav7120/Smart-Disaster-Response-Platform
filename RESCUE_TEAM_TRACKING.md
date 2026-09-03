# Rescue Team Live Tracking

## Backend

- `POST /api/rescue-teams` — create a team (SuperAdmin/DistrictAdmin)
- `GET /api/rescue-teams` — list active teams
- `GET /api/rescue-teams/:id` — team details
- `PUT /api/rescue-teams/:id` — update a team
- `DELETE /api/rescue-teams/:id` — deactivate a team (SuperAdmin)
- `GET /api/rescue-teams/my` — team account details (RescueTeam role)
- `POST /api/rescue-teams/my/location` — authenticated team GPS update
- `GET /api/map/live-rescue-teams` — teams with current live locations

A rescue-team account must be linked to a `RescueTeam` document. The location is stored separately in `Tracking` with `type: "RescueTeam"`.

## Real-time flow

GPS device -> `/api/rescue-teams/my/location` -> MongoDB `Tracking` -> Socket.IO `locationUpdate` -> Live Map marker.

The Live Map joins the `live_map` Socket.IO room and updates a team's marker without page refresh.

## Frontend

`RescueTeamTracker` uses browser Geolocation (`watchPosition`) and sends the current coordinates while the team member has enabled sharing. The Live Map popup shows leader, phone, members, status, area, skills, GPS coordinates, last update, and assigned SOS.

## Creating a team

Create a normal user first through the admin user management flow, give that account the `RescueTeam` role, then create a rescue team linked to that user's `_id`. Public registration intentionally remains `Citizen`.


## Live operations update
The project now includes dedicated citizen and rescue-team portals, real SOS-to-team assignment, targeted Socket.IO tracking, distance/ETA, reached/resolved statuses, and admin team registration with RescueTeam login account creation.

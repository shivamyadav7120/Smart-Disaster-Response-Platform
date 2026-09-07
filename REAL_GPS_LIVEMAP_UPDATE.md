# SDRP Real Rescue Team GPS + Live Map Update

This update makes the Rescue Team -> real device GPS -> MongoDB -> Socket.IO -> Live Map flow stricter and more reliable.

## Main changes

1. Rescue Team GPS sends immediately and every 10 seconds.
2. GPS accuracy is sent to the backend and stored in Tracking.
3. New stop-GPS endpoint marks tracking Offline.
4. Live-map APIs show only active GPS reports from the last 45 seconds.
5. LiveMap removes a team immediately when Stop Live GPS is pressed.
6. LiveMap reconciles with MongoDB every 30 seconds.
7. Team popup shows GPS accuracy and LIVE GPS status.
8. No mock Rescue Team array is used as the LiveMap source.

## Test

Admin:
- Register a Rescue Team.

Rescue device/browser:
- Login as RescueTeam.
- Open Rescue Team Portal.
- Click Start Live GPS.
- Allow Location permission.

Admin:
- Open Live Disaster Map.
- The registered team's real GPS marker should appear.
- Move the device or wait for GPS changes.
- Marker should move without refreshing.

Then:
- Click Stop Live GPS.
- The team should disappear from the live map.

## Browser/deployment note

Localhost can use browser geolocation. A deployed site must use HTTPS. The device/browser must grant Location permission. Phone GPS is normally more useful for field testing than a desktop browser.

## MongoDB

The live location is stored in:
- RescueTeam.currentLocation
- Tracking.location
- Tracking.lastUpdated

The live map uses recent active Tracking data.

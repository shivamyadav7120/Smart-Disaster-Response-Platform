# SDRP Location & Live Tracking Features

Implemented in this build:

- High-accuracy browser/device GPS using `navigator.geolocation` with `enableHighAccuracy: true`.
- GPS accuracy is captured in metres and classified as High (<=20 m), Medium (20-50 m), or Low (>50 m).
- Citizen SOS stores latitude, longitude, accuracy, and confidence.
- Rescue Team portal sends live GPS to `POST /api/rescue-teams/my/location` every 10 seconds while tracking is enabled.
- Rescue Team location is stored as the current position in MongoDB and each accepted update is also written to `LocationHistory`.
- Backend movement validation calculates distance/time and rejects an implausible GPS jump above 200 km/h.
- Socket.IO broadcasts rescue location updates to the live map/SOS room.
- Citizen can track assigned rescue teams with live distance/ETA updates.
- Rescue Team portal has a working Logout action using the central AuthContext.
- Hospitals, shelters, and volunteers no longer silently fall back to frontend mock data when their API fails; the UI reports the server error instead.

## Important

Phone GPS may be less accurate indoors or near tall buildings. Wi-Fi/cell assistance is normally handled by the device/browser location provider rather than exposed directly to the web app. For a production dedicated rescue-device application, an Android/iOS native location service can provide stronger background tracking.

## Accuracy policy

The 15-20 metre target is treated as a practical high-confidence target, not a guarantee. The UI exposes the actual reported GPS accuracy and timestamp so operators can judge freshness.

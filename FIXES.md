# SDRP Corrected Build

## UI/navigation fixes
- Added working navigation from Dashboard Weather -> `/weather`.
- Added working navigation from Dashboard Resources -> `/resources`.
- Added working navigation from Dashboard AI Damage -> `/reports`.
- Added Weather and Notifications to the sidebar navigation.
- Notification bell now links to the Notifications page.
- Profile/Settings menu actions now open Settings.
- Shelter, Hospital, Rescue Team and AI Damage report cards now open detail dialogs.
- SOS table rows now open a detail dialog; Dispatch Team updates the UI and attempts the backend status update.
- Settings are persisted in browser localStorage for demo use.
- Added a favicon to remove the browser 404 request.

## Resilience fixes
- Dashboard statistics fall back to mock data when the API is unavailable.
- Shelters, Hospitals, Rescue Teams, Volunteers, SOS, Resources and AI Reports fall back to the bundled mock data when their APIs are unavailable.
- Weather page uses the existing weather service and its mock fallback.

## Important backend note
The uploaded project does not contain the separate FastAPI + YOLO service. The frontend still uses `http://localhost:8001/predict` (configurable with `VITE_AI_DAMAGE_ENDPOINT`) for AI damage detection and `/reports`. If that service is not running, the frontend intentionally falls back to mock AI reports.

## Validation
- All 33 JavaScript/JSX source files were parsed successfully with Babel parser.
- A full Vite production build could not be executed in this Linux validation environment because the uploaded `node_modules` contains Windows-only native Rollup/esbuild binaries. Delete `node_modules` and run `npm install` on the machine where the project will run, then `npm run build`.

/* =========================================================
   DISTANCE BETWEEN TWO LOCATIONS
   Uses Haversine Formula
========================================================= */

export function distanceKm(a = {}, b = {}) {
  const lat1 = Number(a.lat);
  const lng1 = Number(a.lng);

  const lat2 = Number(b.lat);
  const lng2 = Number(b.lng);

  // Invalid coordinates
  if (
    !Number.isFinite(lat1) ||
    !Number.isFinite(lng1) ||
    !Number.isFinite(lat2) ||
    !Number.isFinite(lng2)
  ) {
    return Infinity;
  }

  // Earth radius in kilometers
  const R = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLng =
    ((lng2 - lng1) * Math.PI) / 180;

  const lat1Rad =
    (lat1 * Math.PI) / 180;

  const lat2Rad =
    (lat2 * Math.PI) / 180;

  const aValue =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLng / 2) ** 2;

  const safeA = Math.min(
    1,
    Math.max(0, aValue)
  );

  const c =
    2 *
    Math.atan2(
      Math.sqrt(safeA),
      Math.sqrt(1 - safeA)
    );

  return R * c;
}

/* =========================================================
   FIND NEAREST LOCATIONS
========================================================= */

export function nearestByDistance(
  origin = {},
  items = []
) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => ({
      ...item,

      distanceKm: distanceKm(
        origin,
        item
      ),
    }))

    // Remove invalid locations
    .filter(
      (item) =>
        Number.isFinite(
          item.distanceKm
        )
    )

    // Nearest first
    .sort(
      (a, b) =>
        a.distanceKm -
        b.distanceKm
    );
}

/* =========================================================
   GET ONLY THE NEAREST LOCATION
========================================================= */

export function nearestLocation(
  origin = {},
  items = []
) {
  const locations =
    nearestByDistance(
      origin,
      items
    );

  return locations[0] || null;
}
import { api } from "./api";

/* =========================================================
   LOCATION SEARCH
========================================================= */

export const searchPlaces = async (query) => {
  if (!query || query.trim().length < 3) {
    return [];
  }

  try {
    const response = await api.get("/gis/geocode", {
      params: {
        q: query.trim(),
      },
    });

    const data =
      response?.data?.data ??
      response?.data ??
      [];

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((place, index) => ({
      placeId:
        place.placeId ||
        place.place_id ||
        place.id ||
        `place-${index}`,

      displayName:
        place.displayName ||
        place.display_name ||
        place.name ||
        "Unknown location",

      lat: Number(
        place.lat ??
          place.latitude
      ),

      lng: Number(
        place.lng ??
          place.lon ??
          place.longitude
      ),
    })).filter(
      (place) =>
        Number.isFinite(place.lat) &&
        Number.isFinite(place.lng)
    );

  } catch (error) {
    console.error(
      "GIS search failed:",
      error
    );

    throw error;
  }
};

/* =========================================================
   ROUTE
========================================================= */

export const getRoute = async ({
  fromLat,
  fromLng,
  toLat,
  toLng,
}) => {
  if (
    !Number.isFinite(Number(fromLat)) ||
    !Number.isFinite(Number(fromLng)) ||
    !Number.isFinite(Number(toLat)) ||
    !Number.isFinite(Number(toLng))
  ) {
    throw new Error(
      "Invalid route coordinates"
    );
  }

  try {
    const response = await api.get(
      "/gis/route",
      {
        params: {
          fromLat: Number(fromLat),
          fromLng: Number(fromLng),
          toLat: Number(toLat),
          toLng: Number(toLng),
        },
      }
    );

    const data =
      response?.data?.data ??
      response?.data;

    if (!data) {
      throw new Error(
        "Route data not received"
      );
    }

    return data;

  } catch (error) {
    console.error(
      "GIS routing failed:",
      error
    );

    throw error;
  }
};
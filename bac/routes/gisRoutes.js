const express = require('express');
const axios = require('axios');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const NOMINATIM_URL = process.env.NOMINATIM_URL || 'https://nominatim.openstreetmap.org/search';
const OSRM_URL = process.env.OSRM_URL || 'https://router.project-osrm.org/route/v1/driving';

const geocodeCache = new Map();

router.get('/geocode', protect, async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    if (q.length < 3) return res.status(400).json({ success: false, message: 'Search query must be at least 3 characters' });

    const key = q.toLowerCase();
    if (geocodeCache.has(key)) return res.json({ success: true, data: geocodeCache.get(key), cached: true });

    const response = await axios.get(NOMINATIM_URL, {
      params: { q, format: 'jsonv2', limit: 5, addressdetails: 1 },
      headers: {
        'User-Agent': process.env.NOMINATIM_USER_AGENT || 'SDRP-Disaster-Response/1.0 (local development)'
      },
      timeout: 10000
    });

    const data = (response.data || []).map((item) => ({
      placeId: item.place_id,
      displayName: item.display_name,
      lat: Number(item.lat),
      lng: Number(item.lon),
      type: item.type,
      address: item.address || {}
    }));

    geocodeCache.set(key, data);
    if (geocodeCache.size > 100) geocodeCache.delete(geocodeCache.keys().next().value);
    return res.json({ success: true, data });
  } catch (error) {
    console.error('GIS geocode error:', error.message);
    return res.status(502).json({ success: false, message: 'Location search service is temporarily unavailable' });
  }
});

router.get('/route', protect, async (req, res) => {
  try {
    const { fromLat, fromLng, toLat, toLng, profile = 'driving' } = req.query;
    const values = [fromLat, fromLng, toLat, toLng].map(Number);
    if (values.some((value) => !Number.isFinite(value))) {
      return res.status(400).json({ success: false, message: 'Valid from/to coordinates are required' });
    }

    const [fl, fg, tl, tg] = values;
    const response = await axios.get(`${OSRM_URL.replace(/driving$/, profile)}/${fg},${fl};${tg},${tl}`, {
      params: { overview: 'full', geometries: 'geojson', steps: true },
      timeout: 15000
    });

    const route = response.data?.routes?.[0];
    if (!route) return res.status(404).json({ success: false, message: 'No route found' });

    return res.json({
      success: true,
      data: {
        distanceKm: Number((route.distance / 1000).toFixed(2)),
        durationMin: Number((route.duration / 60).toFixed(1)),
        geometry: route.geometry,
        legs: route.legs || []
      }
    });
  } catch (error) {
    console.error('GIS routing error:', error.message);
    return res.status(502).json({ success: false, message: 'Routing service is temporarily unavailable' });
  }
});

module.exports = router;

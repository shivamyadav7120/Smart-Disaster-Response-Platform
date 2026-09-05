import axios from "axios";

/* =========================================================
   BASE URL
========================================================= */

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "http://localhost:5000";


/* =========================================================
   AXIOS INSTANCE
========================================================= */

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});


/* =========================================================
   TOKEN
========================================================= */

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("auth_token") ||
    localStorage.getItem("authToken") ||
    ""
  );
};


/* =========================================================
   REQUEST INTERCEPTOR
========================================================= */

api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


/* =========================================================
   RESPONSE INTERCEPTOR
========================================================= */

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      console.warn(
        "401 Unauthorized:",
        error?.config?.url
      );
    }

    if (status === 404) {
      console.warn(
        "404 API route not found:",
        error?.config?.url
      );
    }

    if (status >= 500) {
      console.error(
        "Server error:",
        error?.config?.url
      );
    }

    return Promise.reject(error);
  }
);


/* =========================================================
   RESPONSE HELPERS
========================================================= */

const unwrap = (response) => {
  const body = response?.data;

  if (body?.data !== undefined) {
    return body.data;
  }

  return body;
};


const arrayData = async (request) => {
  const data = unwrap(await request());

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
};


/* =========================================================
   LOCATION HELPERS
========================================================= */

const getLat = (item = {}) => {
  const location = item.location || {};

  return (
    Number(
      item.lat ??
        item.latitude ??
        location.lat ??
        location.latitude ??
        location.coordinates?.[1]
    ) || 0
  );
};


const getLng = (item = {}) => {
  const location = item.location || {};

  return (
    Number(
      item.lng ??
        item.longitude ??
        location.lng ??
        location.longitude ??
        location.coordinates?.[0]
    ) || 0
  );
};


/* =========================================================
   SOS NORMALIZER
========================================================= */

const normalizeSOS = (s = {}, index = 0) => {
  const created =
    s.createdAt ||
    s.created_at ||
    s.reportedAt ||
    "";

  return {
    ...s,

    id:
      s.id ||
      s._id ||
      `SOS-${index + 1}`,

    _id:
      s._id ||
      s.id ||
      `SOS-${index + 1}`,

    loc:
      s.loc ||
      s.address ||
      [s.city, s.state]
        .filter(Boolean)
        .join(", ") ||
      "Location unavailable",

    time:
      s.time ||
      (created
        ? new Date(created).toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )
        : ""),

    date:
      s.date ||
      (created
        ? new Date(created).toLocaleDateString()
        : ""),

    priority:
      s.priority ||
      s.severity ||
      "Medium",

    status:
      s.status ||
      "Pending",

    assignedRescueTeam:
      s.assignedRescueTeam ||
      null,

    assignedRescueTeams:
      Array.isArray(s.assignedRescueTeams)
        ? s.assignedRescueTeams
        : s.assignedRescueTeam
          ? [s.assignedRescueTeam]
          : [],

    lat: getLat(s),
    lng: getLng(s),
  };
};


/* =========================================================
   STATS
========================================================= */

export const fetchStats = async () => {
  try {
    const data =
      unwrap(await api.get("/stats")) || {};

    if (Array.isArray(data)) {
      return data;
    }

    return [
      {
        label: "Active SOS Requests",
        value: Number(
          data.activeSOS ??
            data.activeSos ??
            data.totalSOS ??
            0
        ),
        delta: "",
        tone: "red",
        icon: "alert",
      },

      {
        label: "Shelters Open",
        value: Number(
          data.shelters ??
            data.totalShelters ??
            0
        ),
        delta: "",
        tone: "blue",
        icon: "home",
      },

      {
        label: "Active Rescue Teams",
        value: Number(
          data.rescueTeams ??
            data.teams ??
            data.activeTeams ??
            0
        ),
        delta: "",
        tone: "green",
        icon: "users",
      },

      {
        label: "Volunteers Deployed",
        value: Number(
          data.volunteers ??
            data.activeVolunteers ??
            0
        ),
        delta: "",
        tone: "purple",
        icon: "hands",
      },
    ];
  } catch (error) {
    console.error(
      "Stats API failed:",
      error
    );

    return [];
  }
};


/* =========================================================
   SOS APIs
========================================================= */

export const fetchSOSRequests = async () => {
  const data = await arrayData(() =>
    api.get("/sos")
  );

  return data.map(normalizeSOS);
};


export const fetchMySOS = async () => {
  const data = await arrayData(() =>
    api.get("/sos/my")
  );

  return data.map(normalizeSOS);
};


export const fetchSOSById = async (id) => {
  return unwrap(
    await api.get(`/sos/${id}`)
  );
};


export const createSOSRequest = async (
  payload
) => {
  return unwrap(
    await api.post("/sos", payload)
  );
};


export const updateSOS = async (
  id,
  payload
) => {
  return unwrap(
    await api.put(`/sos/${id}`, payload)
  );
};


export const deleteSOS = async (id) => {
  return unwrap(
    await api.delete(`/sos/${id}`)
  );
};


export const updateSOSStatus = async (
  id,
  status
) => {
  return unwrap(
    await api.patch(
      `/sos/status/${id}`,
      { status }
    )
  );
};


/* =========================================================
   SHELTERS
========================================================= */

export const fetchShelters = async () => {
  const data = await arrayData(() =>
    api.get("/shelters")
  );

  return data.map((s) => ({
    ...s,

    name:
      s.name ||
      "Shelter",

    lat: getLat(s),

    lng: getLng(s),

    capacity: Number(
      s.capacity ??
        s.totalCapacity ??
        0
    ),

    occupied: Number(
      s.occupied ??
        s.currentOccupancy ??
        0
    ),

    contact:
      s.contact ||
      s.contactPhone ||
      s.phone ||
      "",

    status:
      s.status ||
      "Open",
  }));
};


/* =========================================================
   HOSPITALS
========================================================= */

export const fetchHospitals = async () => {
  const data = await arrayData(() =>
    api.get("/hospitals")
  );

  return data.map((hospital) => ({
    ...hospital,

    name:
      hospital.name ||
      hospital.hospitalName ||
      "Hospital",

    lat: getLat(hospital),

    lng: getLng(hospital),

    address:
      hospital.address ||
      hospital.location?.address ||
      "",

    contact:
      hospital.contact ||
      hospital.contactPhone ||
      hospital.phone ||
      "",

    phone:
      hospital.phone ||
      hospital.contactPhone ||
      hospital.contact ||
      "",

    status:
      hospital.status ||
      "Available",

    beds: Number(
      hospital.beds ??
        hospital.totalBeds ??
        hospital.availableBeds ??
        0
    ),
  }));
};


/* =========================================================
   VOLUNTEERS
========================================================= */

export const fetchVolunteers = async () => {
  const data = await arrayData(() =>
    api.get("/volunteers")
  );

  return data.map((v) => ({
    ...v,

    name:
      v.name ||
      v.user?.name ||
      "Volunteer",

    role:
      v.role ||
      v.specialization ||
      "Volunteer",

    area:
      v.area ||
      v.city ||
      v.address ||
      "",

    status:
      v.status ||
      "Available",

    lat: getLat(v),
    lng: getLng(v),
  }));
};


/* =========================================================
   RESCUE TEAMS
========================================================= */

export const fetchRescueTeams = async () => {
  const data = await arrayData(() =>
    api.get("/rescue-teams")
  );

  return data.map((team) => ({
    ...team,

    name:
      team.name ||
      team.teamName ||
      "Rescue Team",

    area:
      team.assignedArea ||
      team.area ||
      team.city ||
      team.address ||
      "",

    members: Number(
      team.members ??
        team.teamSize ??
        1
    ),

    status:
      team.trackingStatus ||
      team.status ||
      "Available",

    leaderName:
      team.leaderName ||
      team.user?.name ||
      "—",

    phone:
      team.phone ||
      team.user?.phone ||
      "—",

    skills:
      Array.isArray(team.skills)
        ? team.skills
        : [],

    assignedSOS:
      team.assignedSOS ||
      null,

    assignedSOSs:
      Array.isArray(team.assignedSOSs)
        ? team.assignedSOSs
        : team.assignedSOS
          ? [team.assignedSOS]
          : [],

    assignments:
      Array.isArray(team.assignments) ? team.assignments : [],

    lastUpdated:
      team.lastUpdated ||
      null,

    lat: getLat(team),
    lng: getLng(team),
  }));
};


/* =========================================================
   LIVE RESCUE TEAMS
========================================================= */

export const fetchLiveRescueTeams = async () => {
  const data = await arrayData(() =>
    api.get("/map/live-rescue-teams")
  );

  return data.map((team) => ({
    ...team,

    name:
      team.name ||
      "Rescue Team",

    area:
      team.assignedArea ||
      team.area ||
      "",

    members: Number(
      team.members ??
        1
    ),

    status:
      team.trackingStatus ||
      team.status ||
      "Available",

    leaderName:
      team.leaderName ||
      team.user?.name ||
      "—",

    phone:
      team.phone ||
      team.user?.phone ||
      "—",

    skills:
      Array.isArray(team.skills)
        ? team.skills
        : [],

    lat: getLat(team),
    lng: getLng(team),
  }));
};


/* =========================================================
   MY RESCUE TEAM
========================================================= */

export const fetchMyRescueTeam = async () => {
  const data = unwrap(
    await api.get("/rescue-teams/my")
  );

  return {
    ...data,

    name:
      data?.name ||
      "Rescue Team",

    status:
      data?.trackingStatus ||
      data?.status ||
      "Available",

    lat: getLat(data || {}),

    lng: getLng(data || {}),
  };
};


/* =========================================================
   UPDATE MY RESCUE TEAM LOCATION
========================================================= */

export const updateMyRescueTeamLocation = async ({
  latitude,
  longitude,
  status,
}) => {
  const response = await api.post(
    "/rescue-teams/my/location",
    {
      latitude,
      longitude,
      ...(status
        ? { status }
        : {}),
    }
  );

  return unwrap(response);
};


/* =========================================================
   CREATE RESCUE TEAM
========================================================= */

export const createRescueTeam = async (
  payload
) => {
  return unwrap(
    await api.post(
      "/rescue-teams",
      payload
    )
  );
};


/* =========================================================
   UPDATE RESCUE TEAM
========================================================= */

export const updateRescueTeam = async (
  id,
  payload
) => {
  return unwrap(
    await api.put(
      `/rescue-teams/${id}`,
      payload
    )
  );
};


/* =========================================================
   DELETE RESCUE TEAM
========================================================= */

export const deleteRescueTeam = async (
  id
) => {
  return unwrap(
    await api.delete(
      `/rescue-teams/${id}`
    )
  );
};



/* =========================================================
   RESCUE OPERATIONS
========================================================= */

export const fetchMyRescueAssignments = async () => {
  return arrayData(() => api.get("/rescue-teams/my/assignments"));
};

export const trackMyRescueTeam = async () => {
  return unwrap(await api.get("/rescue-teams/track/my"));
};

export const assignRescueTeam = async (sosId, rescueTeamIds) => {
  const ids = Array.isArray(rescueTeamIds) ? rescueTeamIds : [rescueTeamIds];
  return unwrap(await api.patch(`/rescue-teams/assign/${sosId}`, { rescueTeamIds: ids }));
};

export const updateRescueAssignmentStatus = async (sosId, status) => {
  return unwrap(await api.patch(`/rescue-teams/my/assignments/${sosId}/status`, { status }));
};

/* =========================================================
   NOTIFICATIONS
========================================================= */

export const fetchNotifications = async () => {
  const data = await arrayData(() =>
    api.get("/notifications")
  );

  return data;
};
export const fetchResources = async () => {
  const data = await arrayData(() =>
    api.get("/resources")
  );

  return data;
};



export { getToken };
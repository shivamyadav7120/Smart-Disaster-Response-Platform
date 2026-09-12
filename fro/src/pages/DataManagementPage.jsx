import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import {
  createHospital,
  createShelter,
  createVolunteer,
  createResource,
  fetchHospitals,
  fetchShelters,
  fetchVolunteers,
  fetchResources,
  fetchRiskZones,
  fetchBlockedRoads,
  createRiskZone,
  createBlockedRoad,
  deleteHospital,
  deleteShelter,
  deleteVolunteer,
  deleteResource,
  deleteRiskZone,
  deleteBlockedRoad,
<<<<<<< HEAD
=======
  updateHospital,
  updateShelter,
  updateVolunteer,
  updateResource,
  updateRiskZone,
  updateBlockedRoad,
>>>>>>> 729b613 (Fix rescue team and analytics)
} from "../services/api";
import { useAuth } from "../context/AuthContext";

const initial = {
<<<<<<< HEAD
  name: "",
  address: "",
  city: "",
  state: "Uttar Pradesh",
  pincode: "",
  latitude: "",
  longitude: "",
  contactPerson: "",
  contactPhone: "",
  capacity: "",
  availableBeds: "",
  totalBeds: "",
  phone: "",
  email: "",
  age: "",
  gender: "Other",
  skills: "",
  assignedArea: "",
  availability: "Available",
  category: "Food",
  quantity: 1,
  unit: "Units",
  provider: "",
  reason: "",
  risk: "",
  score: 0,
  geometry: "",
  status: "Active",
=======
  name: "", address: "", city: "", state: "Uttar Pradesh", pincode: "",
  latitude: "", longitude: "", accuracy: "", contactPerson: "", contactPhone: "",
  capacity: "", availableBeds: "", totalBeds: "", phone: "", email: "", age: "",
  gender: "Other", skills: "", assignedArea: "", availability: "Available",
  category: "Food", quantity: 1, unit: "Units", provider: "", reason: "",
  risk: "", score: 0, geometry: "", status: "Available",
>>>>>>> 729b613 (Fix rescue team and analytics)
};

const configs = {
  Shelters: [
<<<<<<< HEAD
    ["name", "Name"], ["address", "Address"], ["city", "City"],
    ["state", "State"], ["pincode", "Pincode"], ["latitude", "Latitude"],
    ["longitude", "Longitude"], ["capacity", "Capacity"],
    ["availableBeds", "Available Beds"], ["contactPerson", "Contact Person"],
    ["contactPhone", "Contact Phone"],
  ],
  Hospitals: [
    ["name", "Name"], ["address", "Address"], ["city", "City"],
    ["state", "State"], ["pincode", "Pincode"], ["latitude", "Latitude"],
    ["longitude", "Longitude"], ["totalBeds", "Total Beds"],
    ["availableBeds", "Available Beds"], ["contactPerson", "Contact Person"],
    ["contactPhone", "Contact Phone"],
  ],
  Volunteers: [
    ["name", "Full Name"], ["email", "Email"], ["phone", "Phone"],
    ["address", "Address"], ["city", "City"], ["state", "State"],
    ["pincode", "Pincode"], ["latitude", "Latitude"],
    ["longitude", "Longitude"], ["age", "Age"], ["assignedArea", "Assigned Area"],
    ["skills", "Skills (comma separated)"],
  ],
  Resources: [
    ["name", "Name"], ["category", "Category"], ["quantity", "Quantity"],
    ["unit", "Unit"], ["contactPerson", "Contact Person"],
    ["contactPhone", "Contact Phone"],
  ],
  "Risk Zones": [
    ["name", "Name"], ["risk", "Risk Level"], ["score", "Risk Score"],
    ["geometry", "GeoJSON Geometry"],
  ],
  "Blocked Roads": [
    ["name", "Road / Location Name"], ["reason", "Reason"],
    ["latitude", "Latitude"], ["longitude", "Longitude"],
=======
    ["name","Name"],["address","Address"],["city","City"],["state","State"],
    ["pincode","Pincode"],["latitude","Latitude"],["longitude","Longitude"],
    ["capacity","Capacity"],["availableBeds","Available Beds"],
    ["contactPerson","Contact Person"],["contactPhone","Contact Phone"],
  ],
  Hospitals: [
    ["name","Name"],["address","Address"],["city","City"],["state","State"],
    ["pincode","Pincode"],["latitude","Latitude"],["longitude","Longitude"],
    ["totalBeds","Total Beds"],["availableBeds","Available Beds"],
    ["contactPerson","Contact Person"],["contactPhone","Contact Phone"],
  ],
  Volunteers: [
    ["name","Full Name"],["email","Email"],["phone","Phone"],["address","Address"],
    ["city","City"],["state","State"],["pincode","Pincode"],["latitude","Latitude"],
    ["longitude","Longitude"],["age","Age"],["assignedArea","Assigned Area"],
    ["skills","Skills (comma separated)"],
  ],
  Resources: [
    ["name","Name"],["category","Category"],["quantity","Quantity"],["unit","Unit"],
    ["contactPerson","Contact Person"],["contactPhone","Contact Phone"],
    ["latitude","Latitude"],["longitude","Longitude"],
  ],
  "Risk Zones": [
    ["name","Name"],["risk","Risk Level"],["score","Risk Score"],["geometry","GeoJSON Geometry"],
  ],
  "Blocked Roads": [
    ["name","Road / Location Name"],["reason","Reason"],["latitude","Latitude"],["longitude","Longitude"],
>>>>>>> 729b613 (Fix rescue team and analytics)
  ],
};

const requiredByType = {
<<<<<<< HEAD
  Shelters: ["name", "address", "city", "state", "pincode", "latitude", "longitude", "capacity", "availableBeds", "contactPerson", "contactPhone"],
  Hospitals: ["name", "address", "city", "state", "pincode", "latitude", "longitude", "totalBeds", "availableBeds", "contactPerson", "contactPhone"],
  Volunteers: ["name", "email", "phone", "address", "city", "state", "pincode", "latitude", "longitude", "age"],
  Resources: ["name", "category", "quantity", "unit"],
  "Risk Zones": ["name", "risk", "score", "geometry"],
  "Blocked Roads": ["name", "reason", "latitude", "longitude"],
};

const statusOptions = {
  Shelters: ["Open", "Closed"],
  Hospitals: ["Available", "Busy", "Closed"],
  Volunteers: ["Active", "Inactive"],
  Resources: ["Available", "Reserved", "Distributed", "Deployed"],
  "Risk Zones": ["Active", "Inactive"],
  "Blocked Roads": ["Active", "Inactive"],
};

export default function DataManagementPage() {
  const { user } = useAuth();
  const [type, setType] = useState("Shelters");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
=======
  Shelters:["name","address","city","state","pincode","latitude","longitude","capacity","availableBeds","contactPerson","contactPhone"],
  Hospitals:["name","address","city","state","pincode","latitude","longitude","totalBeds","availableBeds","contactPerson","contactPhone"],
  Volunteers:["name","email","phone","address","city","state","pincode","latitude","longitude","age"],
  Resources:["name","category","quantity","unit","contactPerson","contactPhone","latitude","longitude"],
  "Risk Zones":["name","risk","score","geometry"],
  "Blocked Roads":["name","reason","latitude","longitude"],
};

const statusOptions = {
  Shelters:["Open","Full","Closed"],
  Hospitals:["Open","Busy","Closed"],
  Volunteers:["Active","Inactive"],
  Resources:["Available","Reserved","Distributed"],
  "Risk Zones":["Active","Inactive"],
  "Blocked Roads":["Active","Inactive"],
};

const locationTypes = new Set(["Shelters","Hospitals","Volunteers","Resources","Blocked Roads"]);

const statusFor = (kind) => ({
  Shelters:"Open", Hospitals:"Open", Volunteers:"Active", Resources:"Available",
  "Risk Zones":"Active", "Blocked Roads":"Active"
}[kind]);

export default function DataManagementPage() {
  const { user } = useAuth();
  const [type,setType] = useState("Shelters");
  const [items,setItems] = useState([]);
  const [form,setForm] = useState({...initial,status:statusFor("Shelters")});
  const [error,setError] = useState("");
  const [saving,setSaving] = useState(false);
  const [editingId,setEditingId] = useState(null);
  const [locating,setLocating] = useState(false);
  const [locationMessage,setLocationMessage] = useState("");
>>>>>>> 729b613 (Fix rescue team and analytics)

  const load = async () => {
    setError("");
    try {
      const fn = {
<<<<<<< HEAD
        Shelters: fetchShelters,
        Hospitals: fetchHospitals,
        Volunteers: fetchVolunteers,
        Resources: fetchResources,
        "Risk Zones": fetchRiskZones,
        "Blocked Roads": fetchBlockedRoads,
      }[type];

      setItems(await fn());
    } catch (e) {
=======
        Shelters:fetchShelters, Hospitals:fetchHospitals, Volunteers:fetchVolunteers,
        Resources:fetchResources, "Risk Zones":fetchRiskZones, "Blocked Roads":fetchBlockedRoads,
      }[type];
      setItems(await fn());
    } catch(e) {
>>>>>>> 729b613 (Fix rescue team and analytics)
      setError(e?.response?.data?.message || "Unable to load MongoDB data.");
    }
  };

<<<<<<< HEAD
  useEffect(() => {
    setForm(initial);
    load();
=======
  const setCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }
    setLocating(true);
    setLocationMessage("Getting current GPS/device location...");
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setForm(v => ({
          ...v,
          latitude: latitude.toFixed(7),
          longitude: longitude.toFixed(7),
          accuracy: Number.isFinite(accuracy) ? Math.round(accuracy) : "",
        }));
        setLocationMessage(
          `Location detected • ±${Number.isFinite(accuracy) ? Math.round(accuracy) : "?"} m`
        );

        // Best-effort reverse geocoding. Coordinates remain usable even if this fails.
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { Accept: "application/json" } }
          );
          if (r.ok) {
            const data = await r.json();
            const a = data.address || {};
            setForm(v => ({
              ...v,
              address: v.address || data.display_name || "",
              city: v.city || a.city || a.town || a.village || a.municipality || "",
              state: v.state || a.state || "Uttar Pradesh",
              pincode: v.pincode || a.postcode || "",
            }));
          }
        } catch (_) {
          // Do not fail record creation just because reverse geocoding is unavailable.
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        setLocationMessage("");
        const msg = {
          1:"Location permission was denied. Allow location access in the browser and try again.",
          2:"Current location could not be determined. Try again or enter it manually.",
          3:"Location request timed out. Try again.",
        }[err.code] || "Unable to get current location.";
        setError(msg);
      },
      { enableHighAccuracy:true, timeout:15000, maximumAge:0 }
    );
  };

  useEffect(() => {
    setForm({...initial,status:statusFor(type)});
    setLocationMessage("");
    load();
    // Automatically request current location for point-based operational data.
    if (locationTypes.has(type)) {
      const timer = setTimeout(() => setCurrentLocation(), 250);
      return () => clearTimeout(timer);
    }
>>>>>>> 729b613 (Fix rescue team and analytics)
  }, [type]);

  const fields = useMemo(() => configs[type], [type]);

<<<<<<< HEAD
  if (!["SuperAdmin", "DistrictAdmin"].includes(user?.role)) {
    return (
      <div className="p-6">
        <PageHeader title="Data Management" />
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          Admin access required.
        </div>
      </div>
    );
  }

  const change = (e) =>
    setForm((v) => ({ ...v, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (type === "Shelters") {
        await createShelter({
          name: form.name,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          location: {
            latitude: Number(form.latitude),
            longitude: Number(form.longitude),
          },
          capacity: Number(form.capacity),
          availableBeds: Number(form.availableBeds),
          contactPerson: form.contactPerson,
          contactPhone: form.contactPhone,
          status: form.status,
        });
      } else if (type === "Hospitals") {
        await createHospital({
          name: form.name,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          location: {
            latitude: Number(form.latitude),
            longitude: Number(form.longitude),
          },
          totalBeds: Number(form.totalBeds),
          availableBeds: Number(form.availableBeds),
          contactPerson: form.contactPerson,
          contactPhone: form.contactPhone,
          status: form.status,
        });
      } else if (type === "Volunteers") {
        await createVolunteer({
          name: form.name,
          email: form.email.trim().toLowerCase(),
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          location: {
            latitude: Number(form.latitude),
            longitude: Number(form.longitude),
          },
          age: Number(form.age),
          gender: form.gender,
          skills: form.skills
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
          assignedArea: form.assignedArea,
          availability: form.availability,
          status: form.status,
        });
      } else if (type === "Resources") {
        await createResource({
          name: form.name,
          category: form.category,
          quantity: Number(form.quantity),
          unit: form.unit,
          contactPerson: form.contactPerson,
          contactPhone: form.contactPhone,
          status: form.status,
        });
      } else if (type === "Risk Zones") {
        await createRiskZone({
          name: form.name,
          risk: form.risk,
          score: Number(form.score),
          geometry: JSON.parse(form.geometry),
        });
      } else {
        await createBlockedRoad({
          name: form.name,
          reason: form.reason,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
        });
      }

      setForm(initial);
      await load();
    } catch (e) {
      const serverMessage =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e.message ||
        "Save failed.";

      setError(serverMessage);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      const fn = {
        Shelters: deleteShelter,
        Hospitals: deleteHospital,
        Volunteers: deleteVolunteer,
        Resources: deleteResource,
        "Risk Zones": deleteRiskZone,
        "Blocked Roads": deleteBlockedRoad,
      }[type];

      await fn(id);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div>
      <PageHeader
        title="Data Management"
        subtitle="Authorized admins create, update and remove operational data stored in MongoDB."
      />

      <div className="flex flex-wrap gap-2 mb-5">
        {Object.keys(configs).map((x) => (
          <button
            key={x}
            onClick={() => setType(x)}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${
              type === x ? "bg-[#18352a] text-white" : "bg-white border"
            }`}
          >
            {x}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        <form
          onSubmit={submit}
          className="bg-white border rounded-2xl p-5 grid sm:grid-cols-2 gap-3"
        >
          {fields.map(([name, label]) => (
            <label key={name} className="text-xs font-bold">
              {label}
              <input
                name={name}
                type={
                  ["latitude", "longitude", "age", "capacity", "availableBeds", "totalBeds", "quantity", "score"].includes(name)
                    ? "number"
                    : name === "geometry"
                    ? "text"
                    : name === "email"
                    ? "email"
                    : "text"
                }
                step={["latitude", "longitude", "score"].includes(name) ? "any" : undefined}
                value={form[name]}
                onChange={change}
                required={requiredByType[type].includes(name)}
                className="mt-1.5 w-full"
              />
            </label>
          ))}

          {type === "Volunteers" && (
            <>
              <label className="text-xs font-bold">
                Gender
                <select
                  name="gender"
                  value={form.gender}
                  onChange={change}
                  className="mt-1.5 w-full"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="text-xs font-bold">
                Availability
                <select
                  name="availability"
                  value={form.availability}
                  onChange={change}
                  className="mt-1.5 w-full"
                >
                  <option>Available</option>
                  <option>Busy</option>
                  <option>Offline</option>
                </select>
              </label>
            </>
          )}

          {type !== "Blocked Roads" && (
            <label className="text-xs font-bold">
              Status
              <select
                name="status"
                value={form.status}
                onChange={change}
                className="mt-1.5 w-full"
              >
                {statusOptions[type].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          )}

          <button
            disabled={saving}
            className="sm:col-span-2 py-3 rounded-xl bg-[#18352a] text-white font-bold"
          >
            {saving ? "Saving..." : `Add ${type.replace(/s$/, "")}`}
          </button>
        </form>

        <div className="lg:col-span-2 space-y-3">
          {items.length === 0 ? (
            <div className="bg-white border rounded-2xl p-8 text-center text-slate-500">
              No records in MongoDB yet. Add the first record using the form.
            </div>
          ) : (
            items.map((x) => (
              <div
                key={x._id}
                className="bg-white border rounded-2xl p-4 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-bold">
                    {x.name || x.title || x.category || "Record"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {x.status || x.availability || x.risk || x.reason || ""}
                    {x.location?.latitude != null
                      ? ` · ${x.location.latitude}, ${x.location.longitude}`
                      : ""}
                  </div>
                </div>

                <button
                  onClick={() => remove(x._id)}
                  className="px-3 py-2 rounded-lg bg-red-50 text-red-700 text-xs font-bold"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
=======
  if (!["SuperAdmin","DistrictAdmin"].includes(user?.role)) {
    return <div className="p-6"><PageHeader title="Data Management"/>
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">Admin access required.</div>
    </div>;
  }

  const change = e => setForm(v => ({...v,[e.target.name]:e.target.value}));

  const submit = async e => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const location = locationTypes.has(type)
        ? { latitude:Number(form.latitude), longitude:Number(form.longitude), accuracy:form.accuracy === "" ? undefined : Number(form.accuracy) }
        : undefined;

      const payload = type === "Shelters" ? {
        name:form.name,address:form.address,city:form.city,state:form.state,pincode:form.pincode,
        location,capacity:Number(form.capacity),availableBeds:Number(form.availableBeds),
        contactPerson:form.contactPerson,contactPhone:form.contactPhone,status:form.status
      } : type === "Hospitals" ? {
        name:form.name,address:form.address,city:form.city,state:form.state,pincode:form.pincode,
        location,totalBeds:Number(form.totalBeds),availableBeds:Number(form.availableBeds),
        contactPerson:form.contactPerson,contactPhone:form.contactPhone,status:form.status
      } : type === "Volunteers" ? {
        name:form.name,email:form.email.trim().toLowerCase(),phone:form.phone,address:form.address,
        city:form.city,state:form.state,pincode:form.pincode,location,age:Number(form.age),
        gender:form.gender,skills:form.skills.split(",").map(x=>x.trim()).filter(Boolean),
        assignedArea:form.assignedArea,availability:form.availability,status:form.status
      } : type === "Resources" ? {
        name:form.name,category:form.category,quantity:Number(form.quantity),unit:form.unit,
        contactPerson:form.contactPerson,contactPhone:form.contactPhone,location,status:form.status
      } : type === "Risk Zones" ? {
        name:form.name,risk:form.risk,score:Number(form.score),geometry:JSON.parse(form.geometry)
      } : {
        name:form.name,reason:form.reason,latitude:Number(form.latitude),longitude:Number(form.longitude)
      };

      const createFns = {
        Shelters:createShelter,Hospitals:createHospital,Volunteers:createVolunteer,
        Resources:createResource,"Risk Zones":createRiskZone,"Blocked Roads":createBlockedRoad
      };
      const updateFns = {
        Shelters:updateShelter,Hospitals:updateHospital,Volunteers:updateVolunteer,
        Resources:updateResource,"Risk Zones":updateRiskZone,"Blocked Roads":updateBlockedRoad
      };

      if (editingId) {
        await updateFns[type](editingId, payload);
      } else {
        await createFns[type](payload);
      }

      setEditingId(null);
      setForm({...initial,status:statusFor(type)});
      setLocationMessage("");
      await load();
      if (locationTypes.has(type)) setTimeout(() => setCurrentLocation(), 250);
    } catch(e) {
      setError(e?.response?.data?.message || e?.response?.data?.error || e.message || "Save failed.");
    } finally { setSaving(false); }
  };

  const startEdit = (item) => {
    const loc = item.location || {};
    setEditingId(item._id);
    setError("");
    setLocationMessage("");
    setForm({
      ...initial,
      status: item.status || statusFor(type),
      name: item.name || "",
      address: item.address || loc.address || "",
      city: item.city || loc.city || "",
      state: item.state || loc.state || "Uttar Pradesh",
      pincode: item.pincode || loc.pincode || "",
      latitude: item.latitude ?? loc.latitude ?? "",
      longitude: item.longitude ?? loc.longitude ?? "",
      accuracy: item.accuracy ?? loc.accuracy ?? "",
      contactPerson: item.contactPerson || "",
      contactPhone: item.contactPhone || "",
      capacity: item.capacity ?? "",
      availableBeds: item.availableBeds ?? "",
      totalBeds: item.totalBeds ?? "",
      phone: item.phone || "",
      email: item.email || "",
      age: item.age ?? "",
      gender: item.gender || "Other",
      skills: Array.isArray(item.skills) ? item.skills.join(", ") : (item.skills || ""),
      assignedArea: item.assignedArea || "",
      availability: item.availability || "Available",
      category: item.category || "Food",
      quantity: item.quantity ?? 1,
      unit: item.unit || "Units",
      reason: item.reason || "",
      risk: item.risk || "",
      score: item.score ?? 0,
      geometry: item.geometry ? JSON.stringify(item.geometry) : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({...initial,status:statusFor(type)});
    setLocationMessage("");
  };

  const remove = async id => {
    try {
      const fn = {Shelters:deleteShelter,Hospitals:deleteHospital,Volunteers:deleteVolunteer,
        Resources:deleteResource,"Risk Zones":deleteRiskZone,"Blocked Roads":deleteBlockedRoad}[type];
      await fn(id); await load();
    } catch(e) { setError(e?.response?.data?.message || "Delete failed."); }
  };

  return <div>
    <PageHeader title="Data Management"
      subtitle="Authorized admins create, update and remove operational data stored in MongoDB." />

    <div className="flex flex-wrap gap-2 mb-5">
      {Object.keys(configs).map(x => <button key={x} onClick={()=>setType(x)}
        className={`px-4 py-2 rounded-lg text-sm font-bold ${type===x?"bg-[#18352a] text-white":"bg-white border"}`}>
        {x}
      </button>)}
    </div>

    {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

    <div className="grid lg:grid-cols-3 gap-5">
      <form onSubmit={submit} className="bg-white border rounded-2xl p-5 grid sm:grid-cols-2 gap-3">
        {locationTypes.has(type) && (
          <div className="sm:col-span-2 rounded-xl border border-green-200 bg-green-50 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-green-900">📍 Current Location</div>
                <div className="text-xs text-green-800 mt-1">
                  {locationMessage || "Location will be detected automatically."}
                </div>
              </div>
              <button type="button" onClick={setCurrentLocation} disabled={locating}
                className="px-3 py-2 rounded-lg bg-[#18352a] text-white text-xs font-bold">
                {locating ? "Detecting..." : "Use Current Location"}
              </button>
            </div>
          </div>
        )}

        {fields.map(([name,label]) => {
          const numeric = ["latitude","longitude","age","capacity","availableBeds","totalBeds","quantity","score"].includes(name);
          const isLocation = ["latitude","longitude"].includes(name);
          return <label key={name} className="text-xs font-bold">
            {label}
            <input name={name} type={numeric?"number":name==="email"?"email":"text"}
              step={["latitude","longitude","score"].includes(name)?"any":undefined}
              value={form[name]} onChange={change}
              readOnly={isLocation}
              required={requiredByType[type].includes(name)}
              className={`mt-1.5 w-full ${isLocation?"bg-slate-50":""}`} />
          </label>;
        })}

        {locationTypes.has(type) && form.accuracy !== "" &&
          <div className="sm:col-span-2 text-xs text-slate-500">Location accuracy: approximately ±{form.accuracy} m</div>
        }

        {type==="Volunteers" && <>
          <label className="text-xs font-bold">Gender<select name="gender" value={form.gender} onChange={change} className="mt-1.5 w-full">
            <option>Male</option><option>Female</option><option>Other</option>
          </select></label>
          <label className="text-xs font-bold">Availability<select name="availability" value={form.availability} onChange={change} className="mt-1.5 w-full">
            <option>Available</option><option>Busy</option><option>Offline</option>
          </select></label>
        </>}

        {type!=="Blocked Roads" && <label className="text-xs font-bold">Status<select name="status" value={form.status} onChange={change} className="mt-1.5 w-full">
          {statusOptions[type].map(option=><option key={option}>{option}</option>)}
        </select></label>}

        <button disabled={saving || (locationTypes.has(type) && (!form.latitude || !form.longitude))}
          className="sm:col-span-2 py-3 rounded-xl bg-[#18352a] text-white font-bold disabled:opacity-50">
          {saving ? "Saving..." : `Add ${type.replace(/s$/,"")}`}
        </button>
      </form>

      <div className="lg:col-span-2 space-y-3">
        {items.length===0 ? <div className="bg-white border rounded-2xl p-8 text-center text-slate-500">
          No records in MongoDB yet. Add the first record using the form.
        </div> : items.map(x=><div key={x._id} className="bg-white border rounded-2xl p-4 flex items-center justify-between gap-3">
          <div><div className="font-bold">{x.name||x.title||x.category||"Record"}</div>
            <div className="text-xs text-slate-500">
              {x.status||x.availability||x.risk||x.reason||""}
              {x.location?.latitude!=null ? ` · ${x.location.latitude}, ${x.location.longitude}` :
                (x.latitude!=null ? ` · ${x.latitude}, ${x.longitude}` : "")}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>startEdit(x)} className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">Edit</button>
            <button onClick={()=>remove(x._id)} className="px-3 py-2 rounded-lg bg-red-50 text-red-700 text-xs font-bold">Delete</button>
          </div>
        </div>)}
      </div>
    </div>
  </div>;
>>>>>>> 729b613 (Fix rescue team and analytics)
}

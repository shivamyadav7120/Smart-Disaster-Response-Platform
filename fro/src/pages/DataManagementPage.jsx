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
} from "../services/api";
import { useAuth } from "../context/AuthContext";

const initial = {
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
};

const configs = {
  Shelters: [
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
  ],
};

const requiredByType = {
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

  const load = async () => {
    setError("");
    try {
      const fn = {
        Shelters: fetchShelters,
        Hospitals: fetchHospitals,
        Volunteers: fetchVolunteers,
        Resources: fetchResources,
        "Risk Zones": fetchRiskZones,
        "Blocked Roads": fetchBlockedRoads,
      }[type];

      setItems(await fn());
    } catch (e) {
      setError(e?.response?.data?.message || "Unable to load MongoDB data.");
    }
  };

  useEffect(() => {
    setForm(initial);
    load();
  }, [type]);

  const fields = useMemo(() => configs[type], [type]);

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
}

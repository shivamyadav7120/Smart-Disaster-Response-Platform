import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { fetchMySOS, createSOSRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function CitizenDashboard() {
  const [sos, setSos] = useState([]);

  const [form, setForm] = useState({
    disasterType: "Medical",
    severity: "High",
    description: "",
    peopleAffected: 1,
  });

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const nav = useNavigate();
  const { user, logout } = useAuth();
  const [gpsInfo, setGpsInfo] = useState(null);

  // =========================
  // LOAD USER SOS REQUESTS
  // =========================
  const load = () => {
    fetchMySOS()
      .then(setSos)
      .catch(() => setSos([]));
  };

  useEffect(() => {
    load();
  }, []);

  // =========================
  // SEND SOS
  // =========================
  const send = async () => {
    setError("");
    setSending(true);

    try {
      if (!navigator.geolocation) {
        throw new Error(
          "GPS is not supported by this browser."
        );
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const gpsAccuracy = Number.isFinite(pos.coords.accuracy) ? pos.coords.accuracy : null;
            const confidence = gpsAccuracy == null ? "Low" : gpsAccuracy <= 20 ? "High" : gpsAccuracy <= 50 ? "Medium" : "Low";
            const location = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: gpsAccuracy,
              confidence,
            };
            setGpsInfo({ ...location, capturedAt: new Date() });

            await createSOSRequest({
              ...form,
              location,
            });

            // Clear description after successful SOS
            setForm((v) => ({
              ...v,
              description: "",
            }));

            // Reload SOS list
            await load();
          } catch (e) {
            setError(
              e?.response?.data?.message ||
                e?.message ||
                "Failed to send SOS."
            );
          } finally {
            setSending(false);
          }
        },

        (e) => {
          setError(
            e?.message ||
              "Location permission is required to send an SOS."
          );

          setSending(false);
        },

        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 5000,
        }
      );
    } catch (e) {
      setError(e?.message || "Something went wrong.");
      setSending(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div>
      {/* =========================
          HEADER
      ========================= */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <PageHeader
          title="Citizen Emergency Portal"
          subtitle="Send SOS, monitor response, and track your assigned rescue team."
        />

        <button
          type="button"
          onClick={logout}
          className="shrink-0 px-5 py-2.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {gpsInfo && (
        <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="font-extrabold text-emerald-900">📍 SOS GPS captured</div>
          <div className="text-sm text-emerald-800 mt-1">
            Accuracy: ~{Math.round(gpsInfo.accuracy || 0)} m · Confidence: <b>{gpsInfo.confidence}</b>
          </div>
          <div className="text-xs text-emerald-700 mt-1">
            {gpsInfo.latitude.toFixed(5)}, {gpsInfo.longitude.toFixed(5)}
          </div>
        </div>
      )}

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* =========================
            SEND SOS
        ========================= */}
        <section className="lg:col-span-2 bg-white border border-[#dbeadb] rounded-2xl p-6">
          <div className="text-lg font-extrabold text-[#18352a]">
            🚨 Send Emergency SOS
          </div>

          {/* ERROR */}
          {error && (
            <div className="my-3 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* FORM */}
          <div className="grid sm:grid-cols-2 gap-4 mt-4">

            {/* DISASTER TYPE */}
            <label className="text-sm font-semibold">
              Emergency Type

              <select
                value={form.disasterType}
                onChange={(e) =>
                  setForm((v) => ({
                    ...v,
                    disasterType: e.target.value,
                  }))
                }
                className="mt-1.5 w-full"
              >
                <option>Medical</option>
                <option>Fire</option>
                <option>Flood</option>
                <option>Earthquake</option>
                <option>Accident</option>
                <option>Landslide</option>
                <option>Cyclone</option>
                <option>Other</option>
              </select>
            </label>

            {/* SEVERITY */}
            <label className="text-sm font-semibold">
              Severity

              <select
                value={form.severity}
                onChange={(e) =>
                  setForm((v) => ({
                    ...v,
                    severity: e.target.value,
                  }))
                }
                className="mt-1.5 w-full"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </label>

            {/* DESCRIPTION */}
            <label className="sm:col-span-2 text-sm font-semibold">
              Description

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((v) => ({
                    ...v,
                    description: e.target.value,
                  }))
                }
                required
                className="mt-1.5 w-full"
                rows="3"
                placeholder="Tell the response team what happened..."
              />
            </label>

            {/* PEOPLE AFFECTED */}
            <label className="text-sm font-semibold">
              People Affected

              <input
                type="number"
                min="1"
                value={form.peopleAffected}
                onChange={(e) =>
                  setForm((v) => ({
                    ...v,
                    peopleAffected: Number(e.target.value),
                  }))
                }
                className="mt-1.5 w-full"
              />
            </label>
          </div>

          {/* SEND SOS BUTTON */}
          <button
            type="button"
            onClick={send}
            disabled={sending}
            className="mt-5 w-full py-4 rounded-xl bg-red-600 text-white font-extrabold text-lg disabled:opacity-60 hover:bg-red-700 transition"
          >
            {sending
              ? "Detecting location & sending..."
              : "SEND SOS"}
          </button>
        </section>

        {/* =========================
            ACTIVE SOS
        ========================= */}
        <section className="bg-white border border-[#dbeadb] rounded-2xl p-6">
          <div className="font-extrabold text-[#18352a]">
            My Active SOS
          </div>

          <div className="mt-4 space-y-3">

            {sos
              .filter((x) => x.isActive !== false)
              .slice(0, 5)
              .map((x) => (
                <div
                  key={x._id || x.id}
                  className="border rounded-xl p-4"
                >
                  <div className="flex justify-between">
                    <b>
                      {x._id?.slice(-8) || x.id}
                    </b>

                    <span className="text-xs font-bold">
                      {x.status}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 mt-1">
                    {x.disasterType} · {x.severity}
                  </p>

                  {/* TRACK RESCUE TEAM */}
                  {(x.assignedRescueTeam || (Array.isArray(x.assignedRescueTeams) && x.assignedRescueTeams.length)) && (
                    <button
                      type="button"
                      onClick={() =>
                        nav(`/track-rescue/${x._id}`)
                      }
                      className="mt-3 w-full py-2 rounded-lg bg-green-700 text-white text-sm font-bold hover:bg-green-800 transition"
                    >
                      Track Rescue Team
                    </button>
                  )}
                </div>
              ))}

            {/* NO SOS */}
            {!sos.length && (
              <p className="text-sm text-slate-500">
                No SOS requests yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function CitizenDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sosList, setSosList] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // SOS Form
  // ==========================================

  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const [sendingSOS, setSendingSOS] = useState(false);

  // ==========================================
  // Get Current Location
  // ==========================================

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log(
          "Location permission/error:",
          error.message
        );
      }
    );
  }, []);

  // ==========================================
  // Get My SOS Requests
  // ==========================================

  const loadMySOS = async () => {
    try {
      setLoading(true);

      const res = await api.get("/sos/my");

      const data =
        res?.data?.data ||
        res?.data?.sos ||
        res?.data ||
        [];

      setSosList(
        Array.isArray(data) ? data : []
      );

    } catch (error) {
      console.error(
        "Failed to load SOS:",
        error?.response?.data ||
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMySOS();
  }, []);

  // ==========================================
  // Create SOS
  // ==========================================

  const handleSOS = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      alert(
        "Please describe your emergency before sending SOS."
      );
      return;
    }

    if (
      location.latitude === null ||
      location.longitude === null
    ) {
      alert(
        "Please allow location access so rescue teams can find you."
      );
      return;
    }

    try {
      setSendingSOS(true);

      await api.post("/sos", {
        description: description.trim(),
        latitude: location.latitude,
        longitude: location.longitude,
      });

      alert(
        "SOS sent successfully! Rescue teams have been notified."
      );

      setDescription("");

      await loadMySOS();

    } catch (error) {
      console.error(
        "Create SOS Error:",
        error?.response?.data ||
        error.message
      );

      alert(
        error?.response?.data?.message ||
        "Failed to send SOS. Please try again."
      );

    } finally {
      setSendingSOS(false);
    }
  };

  // ==========================================
  // Logout
  // ==========================================

  const handleLogout = () => {
    logout();
  };

  // ==========================================
  // Status Color
  // ==========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700";

      case "Accepted":
        return "bg-blue-100 text-blue-700";

      case "In Progress":
        return "bg-yellow-100 text-yellow-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  // ==========================================
  // Dashboard
  // ==========================================

  return (
    <div className="min-h-screen bg-[#f4f8f4]">

      {/* ======================================
          Header
      ====================================== */}

      <header className="sticky top-0 z-30 bg-white border-b border-[#d9ead9] shadow-sm">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

          {/* Logo / Title */}

          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#123322]">
              Citizen Dashboard
            </h1>

            <p className="text-sm text-[#4d6156]">
              Smart Disaster Response Platform
            </p>
          </div>

          {/* User + Logout */}

          <div className="flex items-center gap-3">

            <div className="hidden sm:block text-right">
              <p className="font-semibold text-[#123322]">
                {user?.name || "Citizen"}
              </p>

              <p className="text-xs text-[#4d6156]">
                {user?.role || "Citizen"}
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-[#d9a441] flex items-center justify-center font-bold text-[#123322]">
              {(user?.name || "C")
                .charAt(0)
                .toUpperCase()}
            </div>

            {/* VISIBLE LOGOUT BUTTON */}

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-[#dc4b3e] text-white font-semibold text-sm hover:bg-[#c63e33] transition"
            >
              Logout
            </button>

          </div>

        </div>

      </header>


      {/* ======================================
          Main Content
      ====================================== */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Welcome */}

        <section className="mb-8">

          <h2 className="text-2xl font-bold text-[#123322]">
            Welcome, {user?.name || "Citizen"} 👋
          </h2>

          <p className="text-[#4d6156] mt-1">
            Use this dashboard to request emergency assistance
            and track your SOS requests.
          </p>

        </section>


        {/* ====================================
            SOS CARD
        ==================================== */}

        <section className="bg-white rounded-2xl border border-[#d9ead9] shadow-sm p-6 mb-8">

          <div className="mb-5">

            <h3 className="text-xl font-bold text-[#123322]">
              🚨 Emergency SOS
            </h3>

            <p className="text-sm text-[#4d6156] mt-1">
              Describe your emergency and send your current
              location to the response team.
            </p>

          </div>


          <form onSubmit={handleSOS}>

            {/* Description */}

            <label className="block text-sm font-semibold text-[#123322] mb-2">
              Emergency Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Example: I am trapped in my house due to flooding..."
              rows={4}
              className="w-full border border-[#cfe0cf] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#7da982] resize-none"
              required
            />


            {/* Location */}

            <div className="mt-4 p-4 rounded-xl bg-[#f4f8f4]">

              <p className="text-sm font-semibold text-[#123322]">
                📍 Current Location
              </p>

              {location.latitude !== null ? (

                <p className="text-xs text-[#4d6156] mt-1">
                  Location detected successfully
                </p>

              ) : (

                <p className="text-xs text-red-500 mt-1">
                  Location not detected. Please allow browser
                  location permission.
                </p>

              )}

            </div>


            {/* Send SOS */}

            <button
              type="submit"
              disabled={sendingSOS}
              className="mt-5 w-full sm:w-auto px-8 py-3 rounded-xl bg-[#dc4b3e] text-white font-bold hover:bg-[#c63e33] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {sendingSOS
                ? "Sending SOS..."
                : "🚨 Send Emergency SOS"}
            </button>

          </form>

        </section>


        {/* ====================================
            MY SOS REQUESTS
        ==================================== */}

        <section className="bg-white rounded-2xl border border-[#d9ead9] shadow-sm p-6">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h3 className="text-xl font-bold text-[#123322]">
                My SOS Requests
              </h3>

              <p className="text-sm text-[#4d6156]">
                Track the status of your emergency requests.
              </p>

            </div>

            <button
              onClick={loadMySOS}
              className="px-4 py-2 rounded-lg border border-[#cfe0cf] text-sm font-semibold hover:bg-[#f4f8f4]"
            >
              Refresh
            </button>

          </div>


          {loading ? (

            <div className="py-10 text-center text-[#4d6156]">
              Loading SOS requests...
            </div>

          ) : sosList.length === 0 ? (

            <div className="py-10 text-center text-[#4d6156]">
              No SOS requests yet.
            </div>

          ) : (

            <div className="space-y-4">

              {sosList.map((sos, index) => (

                <div
                  key={
                    sos._id ||
                    sos.id ||
                    index
                  }
                  className="border border-[#d9ead9] rounded-xl p-4"
                >

                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                    <div className="flex-1">

                      <p className="font-semibold text-[#123322]">
                        {sos.description ||
                          "Emergency request"}
                      </p>

                      <p className="text-xs text-[#718579] mt-2">
                        {sos.createdAt
                          ? new Date(
                              sos.createdAt
                            ).toLocaleString()
                          : ""}
                      </p>

                    </div>


                    <span
                      className={`inline-flex w-fit px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(
                        sos.status
                      )}`}
                    >
                      {sos.status ||
                        "Pending"}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import StatCard from "../components/StatCard";
import LiveMap from "../components/LiveMap";
import SOSList from "../components/SOSList";
import WeatherCard from "../components/WeatherCard";
import ResourceCard from "../components/ResourceCard";
import AIDamageCard from "../components/AIDamageCard";

import { fetchStats } from "../services/api";
import { stats as mockStats } from "../data/mockData";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(mockStats);
  const [loading, setLoading] = useState(true);
  const [usingDemoData, setUsingDemoData] =
    useState(false);

  /* =====================================================
     LOAD DASHBOARD STATS
  ===================================================== */

  const loadStats = async () => {
    setLoading(true);
    setUsingDemoData(false);

    try {
      const data = await fetchStats();

      if (Array.isArray(data) && data.length > 0) {
        setStats(data);
      } else {
        setStats(mockStats);
        setUsingDemoData(true);
      }
    } catch (error) {
      console.error(
        "Dashboard stats error:",
        error
      );

      setStats(mockStats);
      setUsingDemoData(true);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="space-y-6">

      {/* =================================================
          DEMO DATA WARNING
      ================================================= */}

      {usingDemoData && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          Live dashboard statistics are
          unavailable. Demo data is being shown.
        </div>
      )}

      {/* =================================================
          STATISTICS
      ================================================= */}

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {loading
          ? Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-28 rounded-2xl bg-slate-100 animate-pulse"
                />
              )
            )
          : stats.map((s, i) => (
              <StatCard
                key={
                  s.label ||
                  `stat-${i}`
                }
                {...s}
                index={i}
              />
            ))}

      </section>

      {/* =================================================
          MAP + SOS
      ================================================= */}

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        <div className="xl:col-span-2">
          <LiveMap />
        </div>

        <SOSList
          limit={5}
          onViewAll={() =>
            navigate("/sos")
          }
        />

      </section>

      {/* =================================================
          WEATHER + RESOURCES + AI
      ================================================= */}

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <WeatherCard />

        <ResourceCard />

        <AIDamageCard />

      </section>

    </div>
  );
}
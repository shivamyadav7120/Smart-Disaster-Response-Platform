import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchWeatherAlert } from "../services/weather";
import { Icon } from "./icons";

export default function WeatherCard() {
  const navigate = useNavigate();

  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD WEATHER
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

    const loadWeather = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchWeatherAlert();

        if (!cancelled) {
          setAlert(data || null);
        }
      } catch (err) {
        console.error(
          "Weather API error:",
          err
        );

        if (!cancelled) {
          setAlert(null);
          setError(
            "Weather data unavailable."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadWeather();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasDetail =
    alert &&
    alert.temperature !== undefined &&
    alert.temperature !== null;

  return (
    <div className="card p-5 bg-white border border-[#dbeadb] rounded-2xl">

      {/* =================================================
          HEADER
      ================================================= */}

      <h2 className="font-bold text-[15px] mb-3 text-forest-900">
        Weather Alerts
      </h2>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="space-y-2">

          <div className="h-16 rounded-lg bg-[#f3f7f3] animate-pulse" />

          <div className="h-8 rounded-lg bg-[#f3f7f3] animate-pulse" />

        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {!loading && error && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-3 text-xs text-amber-800">
          {error}
        </div>
      )}

      {/* =================================================
          WEATHER DATA
      ================================================= */}

      {!loading && !error && alert && (
        <>
          <div className="flex gap-3 items-start">

            {/* WEATHER ICON */}

            <span className="text-3xl text-[#2f6fb0]">
              <Icon.weather />
            </span>

            {/* WEATHER INFO */}

            <div className="flex-1 min-w-0">

              <div className="flex items-baseline justify-between gap-2">

                <div
                  className="font-bold text-[15px] truncate"
                  style={{
                    color: "#dc4b3e",
                  }}
                >
                  {alert.title ||
                    "Weather Alert"}
                </div>

                {hasDetail && (
                  <div className="font-bold text-[15px] text-forest-900 whitespace-nowrap">
                    {Math.round(
                      Number(
                        alert.temperature
                      )
                    )}
                    °C
                  </div>
                )}

              </div>

              <div className="text-sm text-[#4d6156] mt-0.5">
                {alert.area ||
                  "Location unavailable"}
              </div>

              {alert.validUntil && (
                <div className="text-xs text-[#7d9285] mt-1">
                  {alert.validUntil}
                </div>
              )}

            </div>
          </div>

          {/* =================================================
              WEATHER DETAILS
          ================================================= */}

          {hasDetail && (
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-[#4d6156]">

              {/* FEELS LIKE */}

              <div className="flex justify-between bg-[#f3f7f3] rounded-lg px-3 py-2">

                <span>
                  Feels like
                </span>

                <span className="font-semibold text-forest-900">
                  {Number.isFinite(
                    Number(
                      alert.feelsLike
                    )
                  )
                    ? `${Math.round(
                        Number(
                          alert.feelsLike
                        )
                      )}°C`
                    : "--"}
                </span>

              </div>

              {/* HUMIDITY */}

              <div className="flex justify-between bg-[#f3f7f3] rounded-lg px-3 py-2">

                <span>
                  Humidity
                </span>

                <span className="font-semibold text-forest-900">
                  {alert.humidity !==
                  undefined
                    ? `${alert.humidity}%`
                    : "--"}
                </span>

              </div>

              {/* WIND */}

              <div className="flex justify-between bg-[#f3f7f3] rounded-lg px-3 py-2">

                <span>
                  Wind
                </span>

                <span className="font-semibold text-forest-900">
                  {alert.windSpeed !==
                  undefined
                    ? `${alert.windSpeed} m/s`
                    : "--"}
                </span>

              </div>

              {/* PRESSURE */}

              <div className="flex justify-between bg-[#f3f7f3] rounded-lg px-3 py-2">

                <span>
                  Pressure
                </span>

                <span className="font-semibold text-forest-900">
                  {alert.pressure !==
                  undefined
                    ? `${alert.pressure} hPa`
                    : "--"}
                </span>

              </div>

            </div>
          )}
        </>
      )}

      {/* =================================================
          NO DATA
      ================================================= */}

      {!loading &&
        !error &&
        !alert && (
          <div className="py-6 text-center text-sm text-slate-500">
            No weather information available.
          </div>
        )}

      {/* =================================================
          VIEW DETAILS
      ================================================= */}

      <button
        type="button"
        onClick={() =>
          navigate("/weather")
        }
        className="mt-4 w-full py-2.5 rounded-lg text-white text-sm font-semibold bg-forest-800 hover:opacity-90 transition"
      >
        View Details
      </button>

    </div>
  );
}
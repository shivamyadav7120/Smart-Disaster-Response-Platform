import React, { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { fetchWeatherAlert } from "../services/weather";

export default function WeatherPage() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD WEATHER
  ===================================================== */

  useEffect(() => {
    let mounted = true;

    const loadWeather = async () => {
      setLoading(true);
      setError("");

      try {
        const data =
          await fetchWeatherAlert();

        if (mounted) {
          setWeather(data || null);
        }
      } catch (err) {
        console.error(
          "Weather page error:",
          err
        );

        if (mounted) {
          setWeather(null);
          setError(
            "Unable to load weather data."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadWeather();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-5">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <PageHeader
        title="Weather"
        subtitle="Current weather conditions and emergency alerts"
      />

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="card p-6 bg-white border border-[#dbeadb] rounded-2xl">

          <div className="space-y-4 animate-pulse">

            <div className="h-12 w-12 rounded-full bg-slate-200" />

            <div className="h-6 w-2/3 rounded bg-slate-200" />

            <div className="h-4 w-1/3 rounded bg-slate-200" />

            <div className="grid grid-cols-2 gap-3 mt-5">

              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="h-16 rounded-xl bg-slate-100"
                  />
                )
              )}

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {!loading && error && (
        <div className="card p-6 bg-amber-50 border border-amber-200 rounded-2xl">

          <h2 className="font-bold text-amber-900">
            Weather unavailable
          </h2>

          <p className="text-sm text-amber-800 mt-1">
            {error}
          </p>

          <p className="text-xs text-amber-700 mt-2">
            Please check your weather API
            configuration and try again.
          </p>

        </div>
      )}

      {/* =================================================
          WEATHER DATA
      ================================================= */}

      {!loading &&
        !error &&
        weather && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* =================================================
                CURRENT CONDITION
            ================================================= */}

            <div className="card p-6 bg-white border border-[#dbeadb] rounded-2xl">

              <div className="text-5xl mb-4">
                🌦️
              </div>

              <h2 className="text-xl font-extrabold text-forest-900">
                {weather.title ||
                  "Current conditions"}
              </h2>

              <p className="text-sm text-[#4d6156] mt-1">
                {weather.area ||
                  "Your area"}
              </p>

              {weather.validUntil && (
                <p className="text-xs text-[#7d9285] mt-2">
                  {weather.validUntil}
                </p>
              )}

              {weather.weather && (
                <div className="mt-4 inline-block px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                  {weather.weather}
                </div>
              )}

            </div>

            {/* =================================================
                WEATHER METRICS
            ================================================= */}

            <div className="card p-6 bg-white border border-[#dbeadb] rounded-2xl">

              <h3 className="font-bold text-forest-900 mb-4">
                Weather Details
              </h3>

              <div className="grid grid-cols-2 gap-3">

                <Metric
                  label="Temperature"
                  value={
                    weather.temperature !=
                    null
                      ? `${Math.round(
                          Number(
                            weather.temperature
                          )
                        )}°C`
                      : "—"
                  }
                />

                <Metric
                  label="Feels like"
                  value={
                    weather.feelsLike !=
                    null
                      ? `${Math.round(
                          Number(
                            weather.feelsLike
                          )
                        )}°C`
                      : "—"
                  }
                />

                <Metric
                  label="Humidity"
                  value={
                    weather.humidity !=
                    null
                      ? `${weather.humidity}%`
                      : "—"
                  }
                />

                <Metric
                  label="Wind"
                  value={
                    weather.windSpeed !=
                    null
                      ? `${weather.windSpeed} m/s`
                      : "—"
                  }
                />

                <Metric
                  label="Pressure"
                  value={
                    weather.pressure !=
                    null
                      ? `${weather.pressure} hPa`
                      : "—"
                  }
                />

                <Metric
                  label="Condition"
                  value={
                    weather.weather ||
                    "—"
                  }
                />

              </div>

            </div>

          </div>
        )}

      {/* =================================================
          NO DATA
      ================================================= */}

      {!loading &&
        !error &&
        !weather && (
          <div className="card p-6 bg-white border border-[#dbeadb] rounded-2xl text-center">

            <div className="text-4xl mb-2">
              🌤️
            </div>

            <h2 className="font-bold text-forest-900">
              No weather data
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Weather information is
              currently unavailable.
            </p>

          </div>
        )}

    </div>
  );
}

/* =====================================================
   METRIC COMPONENT
===================================================== */

function Metric({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-[#f3f7f3] p-4">

      <div className="text-xs text-[#7d9285]">
        {label}
      </div>

      <div className="font-bold text-forest-900 mt-1">
        {value}
      </div>

    </div>
  );
}
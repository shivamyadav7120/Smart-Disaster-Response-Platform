import React, { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  fetchSOSRequests,
  updateSOSStatus,
} from "../services/api";

import { Icon } from "./icons";

const priorityStyle = {
  High: {
    background: "#fbe7e4",
    color: "#dc4b3e",
  },

  Medium: {
    background: "#fbf0dd",
    color: "#d98a1f",
  },

  Low: {
    background: "#e4f4e9",
    color: "#2f8a52",
  },
};

const getPriorityStyle = (priority) => {
  return (
    priorityStyle[priority] ||
    priorityStyle.Medium
  );
};

export default function SOSList({
  limit,
  onViewAll,
}) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [dispatching, setDispatching] =
    useState(false);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD SOS REQUESTS
  ===================================================== */

  const loadSOS = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchSOSRequests();

      const safeData = Array.isArray(data)
        ? data
        : [];

      setRequests(
        limit
          ? safeData.slice(0, limit)
          : safeData
      );
    } catch (err) {
      console.error(
        "SOS API error:",
        err
      );

      setRequests([]);

      setError(
        "Unable to load SOS requests."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    loadSOS();
  }, [limit]);

  /* =====================================================
     DISPATCH SOS
  ===================================================== */

  const dispatchSOS = async () => {
    if (!selected || dispatching) {
      return;
    }

    const id =
      selected._id ||
      selected.id;

    if (!id) {
      setError(
        "SOS ID is missing."
      );
      return;
    }

    setDispatching(true);
    setError("");

    try {
      await updateSOSStatus(
        id,
        "Dispatched"
      );

      // Update list
      setRequests((items) =>
        items.map((item) =>
          (item._id || item.id) === id
            ? {
                ...item,
                status: "Dispatched",
              }
            : item
        )
      );

      // Update selected SOS
      setSelected((item) =>
        item
          ? {
              ...item,
              status: "Dispatched",
            }
          : null
      );
    } catch (err) {
      console.error(
        "SOS dispatch failed:",
        err
      );

      setError(
        "Failed to dispatch the rescue team."
      );
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="card p-5 bg-white border border-[#dbeadb] rounded-2xl flex flex-col">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center justify-between mb-3">

        <h2 className="font-bold text-[15px] text-forest-900">
          Recent SOS Requests
        </h2>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold text-forest-700 hover:underline"
          >
            View All
          </button>
        )}

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="mb-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
          {error}
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (
        <div className="space-y-2">

          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-12 rounded-lg bg-[#f3f7f3] animate-pulse"
              />
            )
          )}

        </div>
      ) : requests.length === 0 ? (

        /* =================================================
           EMPTY STATE
        ================================================= */

        <div className="py-10 text-center text-sm text-slate-500">
          No SOS requests found.
        </div>

      ) : (

        /* =================================================
           SOS LIST
        ================================================= */

        <div
          className="space-y-2 overflow-y-auto pr-1"
          style={{
            maxHeight: 360,
          }}
        >

          {requests.map(
            (s, index) => {
              const priority =
                s.priority ||
                "Medium";

              return (
                <motion.div
                  key={
                    s._id ||
                    s.id ||
                    `sos-${index}`
                  }

                  initial={{
                    opacity: 0,
                    y: 6,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    duration: 0.3,
                    delay:
                      index * 0.05,
                  }}

                  onClick={() =>
                    setSelected(s)
                  }

                  className="flex items-center justify-between gap-2 p-2.5 rounded-lg hover:bg-[#f3f9f2] cursor-pointer"
                >

                  {/* LEFT */}

                  <div className="flex items-center gap-2 min-w-0">

                    <span className="text-red-500 shrink-0">
                      <Icon.pin />
                    </span>

                    <div className="min-w-0">

                      <div className="text-sm font-semibold truncate text-forest-900">
                        {s.id ||
                          s._id ||
                          "SOS Request"}
                      </div>

                      <div className="text-xs text-[#7d9285] truncate">
                        {s.loc ||
                          "Location unavailable"}
                      </div>

                    </div>

                  </div>

                  {/* RIGHT */}

                  <div className="text-right shrink-0">

                    <div className="text-[11px] text-[#7d9285] font-mono">
                      {s.time ||
                        "--:--"}
                    </div>

                    <span
                      className="inline-block mt-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                      style={getPriorityStyle(
                        priority
                      )}
                    >
                      {priority}
                    </span>

                  </div>

                </motion.div>
              );
            }
          )}

        </div>
      )}

      {/* =================================================
          VIEW ALL
      ================================================= */}

      {onViewAll && (
        <button
          type="button"
          onClick={onViewAll}
          className="mt-4 w-full py-2.5 rounded-lg text-white text-sm font-semibold bg-forest-800 hover:bg-forest-900"
        >
          View All Requests
        </button>
      )}

      {/* =================================================
          SOS DETAILS MODAL
      ================================================= */}

      <AnimatePresence>

        {selected && (
          <motion.div
            initial={{
              opacity: 0,
            }}

            animate={{
              opacity: 1,
            }}

            exit={{
              opacity: 0,
            }}

            className="fixed inset-0 bg-black/40 z-[2000] flex items-center justify-center p-4"

            onClick={() =>
              setSelected(null)
            }
          >

            <motion.div
              initial={{
                scale: 0.95,
                opacity: 0,
              }}

              animate={{
                scale: 1,
                opacity: 1,
              }}

              exit={{
                scale: 0.95,
                opacity: 0,
              }}

              onClick={(e) =>
                e.stopPropagation()
              }

              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
            >

              {/* MODAL HEADER */}

              <div className="flex items-center justify-between mb-4">

                <h3 className="font-bold text-lg text-forest-900">

                  {selected.id ||
                    selected._id ||
                    "SOS Request"}

                </h3>

                <span
                  className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                  style={getPriorityStyle(
                    selected.priority
                  )}
                >
                  {selected.priority ||
                    "Medium"}
                </span>

              </div>

              {/* DETAILS */}

              <div className="space-y-2 text-sm text-[#4d6156]">

                <div>
                  <span className="font-semibold text-forest-900">
                    Location:
                  </span>{" "}
                  {selected.loc ||
                    "Unavailable"}
                </div>

                <div>
                  <span className="font-semibold text-forest-900">
                    Reported:
                  </span>{" "}
                  {selected.time ||
                    "--:--"}
                  {selected.date
                    ? `, ${selected.date}`
                    : ""}
                </div>

                <div>
                  <span className="font-semibold text-forest-900">
                    Status:
                  </span>{" "}
                  {selected.status ||
                    "Pending"}
                </div>

                {selected.description && (
                  <div>
                    <span className="font-semibold text-forest-900">
                      Description:
                    </span>{" "}
                    {selected.description}
                  </div>
                )}

              </div>

              {/* ACTIONS */}

              <div className="flex gap-2 mt-5">

                <button
                  type="button"
                  disabled={
                    dispatching ||
                    selected.status ===
                      "Dispatched"
                  }

                  onClick={
                    dispatchSOS
                  }

                  className="flex-1 py-2 rounded-lg bg-forest-800 text-white text-sm font-semibold disabled:opacity-60"
                >
                  {dispatching
                    ? "Dispatching..."
                    : selected.status ===
                        "Dispatched"
                      ? "Dispatched"
                      : "Dispatch Team"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelected(null)
                  }

                  className="flex-1 py-2 rounded-lg border border-[#dbeadb] text-forest-900 text-sm font-semibold hover:bg-slate-50"
                >
                  Close
                </button>

              </div>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
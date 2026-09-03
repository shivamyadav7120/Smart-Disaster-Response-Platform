
import React, { useEffect, useState } from "react";
import { Icon } from "./icons";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchNotifications } from "../services/api";

export default function Navbar({ onMenuClick, title, subtitle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let mounted = true;

    fetchNotifications()
      .then((data) => {
        if (mounted) {
          setNotifications(
            Array.isArray(data) ? data : []
          );
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================
  // Logout Handler
  // ==========================================

  const handleLogout = () => {
    setShowProfile(false);
    setShowNotifs(false);

    logout();

    navigate("/login");
  };

  // ==========================================
  // Check User Role
  // ==========================================

  const isCitizen = user?.role === "Citizen";

  return (
    <header className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-[#d9ead9] sticky top-0 z-20 backdrop-blur bg-white/80">

      {/* ======================================
          Left Side
      ====================================== */}

      <div className="flex items-center gap-3 min-w-0">

        <button
          onClick={onMenuClick}
          className="lg:hidden text-2xl"
        >
          ☰
        </button>

        <div className="min-w-0">

          <h1 className="text-lg sm:text-xl font-extrabold text-forest-900 truncate">
            {title}
          </h1>

          <p className="text-xs sm:text-sm text-[#4d6156] truncate">
            {subtitle}
          </p>

        </div>
      </div>

      {/* ======================================
          Right Side
      ====================================== */}

      <div className="flex items-center gap-4 shrink-0">

        {/* ====================================
            Notifications
        ==================================== */}

        <div className="relative">

          <button
            aria-label="Open notifications"
            className="relative text-xl text-forest-800"
            onClick={() => {
              setShowNotifs((v) => !v);
              setShowProfile(false);
            }}
          >
            <Icon.bell />

            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                {notifications.length > 9
                  ? "9+"
                  : notifications.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute right-0 mt-3 w-80 max-w-[calc(100vw-2rem)] bg-white border border-[#dbeadb] rounded-xl shadow-lg overflow-hidden"
              >

                <button
                  onClick={() => {
                    setShowNotifs(false);
                    navigate("/notifications");
                  }}
                  className="w-full text-left px-4 py-3 border-b font-semibold text-sm hover:bg-[#f7fbf7]"
                >
                  Notifications
                </button>

                {notifications.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500">
                    No notifications.
                  </div>
                ) : (
                  notifications.slice(0, 8).map((n, i) => (
                    <div
                      key={n._id || n.id || i}
                      className="px-4 py-3 text-sm border-b last:border-0"
                    >
                      <div>
                        {n.text ||
                          n.message ||
                          n.title ||
                          "New notification"}
                      </div>

                      <div className="text-[11px] text-[#8aa192] mt-1">
                        {n.time || n.createdAt || ""}
                      </div>
                    </div>
                  ))
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ====================================
            Citizen Logout
        ==================================== */}

        {isCitizen && (
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-lg text-sm font-semibold text-[#dc4b3e] hover:bg-[#fbe7e4] transition"
          >
            Logout
          </button>
        )}

        {/* ====================================
            Profile
        ==================================== */}

        <div className="relative">

          <button
            className="flex items-center gap-2"
            onClick={() => {
              setShowProfile((v) => !v);
              setShowNotifs(false);
            }}
          >

            <div className="w-9 h-9 rounded-full bg-[#d9a441] flex items-center justify-center font-bold text-[#123322]">
              {(user?.name || "A")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="hidden sm:block leading-tight text-left">

              <div className="text-sm font-semibold text-forest-900">
                {user?.name || "Admin"}
              </div>

              <div className="text-[11px] text-[#4d6156]">
                {user?.role || "District Admin"}
              </div>

            </div>

          </button>

          {/* ==================================
              Profile Dropdown
          ================================== */}

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                className="absolute right-0 mt-3 w-48 bg-white border border-[#dbeadb] rounded-xl shadow-lg overflow-hidden text-sm"
              >

                <div className="px-4 py-3 border-b">

                  <div className="font-semibold">
                    {user?.name || "Admin"}
                  </div>

                  <div className="text-xs text-gray-500 truncate">
                    {user?.email || ""}
                  </div>

                </div>

                <button
                  onClick={() => {
                    setShowProfile(false);
                    navigate("/settings");
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#f7fbf7]"
                >
                  Profile
                </button>

                <button
                  onClick={() => {
                    setShowProfile(false);
                    navigate("/settings");
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#f7fbf7]"
                >
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#fbe7e4] text-[#dc4b3e]"
                >
                  Logout
                </button>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </header>
  );
}


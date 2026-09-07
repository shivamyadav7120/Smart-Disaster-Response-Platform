import React from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "./icons";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({
  navItems,
  open,
  onClose,
}) {
  const { logout, user } = useAuth();
  const visibleItems = user?.role === "Citizen" ? [
    { key: "citizen", path: "/citizen", label: "My Emergency Portal", icon: "home" },
    { key: "track", path: "/track-rescue/latest", label: "Track Rescue Team", icon: "map" },
  ] : user?.role === "RescueTeam" ? [
    { key: "rescue", path: "/rescue-team-portal", label: "Rescue Team Portal", icon: "users" },
  ] : navItems;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          w-64 shrink-0 flex flex-col justify-between
          text-white/80
          fixed lg:static
          inset-y-0 left-0
          z-40
          transform transition-transform duration-200
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
        style={{
          background:
            "linear-gradient(180deg,#0c2117,#123322)",
        }}
      >

        {/* Top Section */}
        <div>

          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#d9a441] text-[#123322] text-xl">
              🛡️
            </div>

            <div>
              <div className="text-white font-extrabold text-lg">
                SDRP
              </div>

              <div className="text-[11px] text-white/50">
                Smart Disaster
                <br />
                Response Platform
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-3 py-4 space-y-1 text-sm font-medium">

            {visibleItems.map((item) => {
              const IconComp =
                Icon[item.icon] || Icon.home;

              return (
                <NavLink
                  key={item.key}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `
                    sidebar-item
                    relative
                    flex items-center
                    gap-3
                    px-3 py-2.5
                    rounded-lg
                    cursor-pointer
                    transition-all
                    duration-150
                    ${
                      isActive
                        ? "active"
                        : "hover:bg-white/10 hover:text-white"
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={
                          isActive
                            ? "text-[#123322]"
                            : ""
                        }
                      >
                        <IconComp className="w-4 h-4" />
                      </span>

                      <span>
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}

            {/* Logout */}
            <button
              onClick={logout}
              className="
                sidebar-item
                w-full
                flex items-center
                gap-3
                px-3 py-2.5
                rounded-lg
                text-left
                text-red-200
                hover:text-red-100
                hover:bg-red-500/10
                cursor-pointer
              "
            >
              <Icon.logout className="w-4 h-4" />

              <span>
                Logout
              </span>
            </button>

          </nav>
        </div>

        {/* Emergency Helpline */}
        <div className="p-4">
          <div className="rounded-xl p-4 bg-[#17402b]">

            <div className="flex items-center gap-2 text-white text-sm font-semibold mb-1">
              <Icon.phone className="w-3.5 h-3.5" />

              <span>
                Emergency Helpline
              </span>
            </div>

            <div className="text-2xl font-extrabold font-mono">
              112
            </div>

            <div className="text-[11px] text-white/50">
              24x7 Available
            </div>

          </div>
        </div>

      </aside>
    </>
  );
}
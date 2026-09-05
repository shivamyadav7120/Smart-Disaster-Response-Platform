import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const AuthContext = createContext(null);

const TOKEN_KEYS = ["token", "auth_token", "authToken"];

const getToken = () => {
  for (const key of TOKEN_KEYS) {
    const value = localStorage.getItem(key);
    if (value) return value;
  }
  return null;
};

const saveToken = (token) => {
  localStorage.setItem("token", token);
  TOKEN_KEYS.filter((k) => k !== "token").forEach((k) => localStorage.removeItem(k));
};

const clearAuth = () => {
  TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
  localStorage.removeItem("user");
};

const normalizeUser = (user, email = "") => {
  if (!user) return email ? { email } : null;
  return {
    ...user,
    name: user.name || user.fullName || user.username || email.split("@")[0] || "Admin",
    email: user.email || email,
    role: user.role || user.userRole || "DistrictAdmin",
  };
};

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        // Prefer /auth/me; if your backend doesn't expose it, saved user is retained.
        const res = await api.get("/auth/me");
        const data = res?.data?.data || res?.data?.user || res?.data;
        if (data && typeof data === "object") {
          const normalized = normalizeUser(data);
          setUser(normalized);
          localStorage.setItem("user", JSON.stringify(normalized));
        }
      } catch {
        try {
          const saved = localStorage.getItem("user");
          if (saved) setUser(JSON.parse(saved));
        } catch {}
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const root = res?.data || {};
    const data = root.data && typeof root.data === "object" ? root.data : root;

    const token = root.token || data.token || root.accessToken || data.accessToken;
    if (!token) throw new Error("Backend login did not return a JWT token.");

    const loggedUser = normalizeUser(root.user || data.user || data, email);
    saveToken(token);
    localStorage.setItem("user", JSON.stringify(loggedUser));
    setUser(loggedUser);
    const destination = loggedUser.role === "Citizen" ? "/citizen" : loggedUser.role === "RescueTeam" ? "/rescue-team-portal" : "/";
    navigate(destination, { replace: true });

    return { success: true, token, user: loggedUser };
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      token: getToken(),
      isAuthenticated: Boolean(getToken()),
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

export default AuthContext;


import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { api } from "../services/api";


// ==========================================
// Create Auth Context
// ==========================================

const AuthContext = createContext(null);


// ==========================================
// JWT Token Keys
// ==========================================

const TOKEN_KEYS = [
  "token",
  "auth_token",
  "authToken",
];


// ==========================================
// Get Token
// ==========================================

const getToken = () => {

  for (const key of TOKEN_KEYS) {

    const value = localStorage.getItem(key);

    if (value) {
      return value;
    }
  }

  return null;
};


// ==========================================
// Save Token
// ==========================================

const saveToken = (token) => {

  localStorage.setItem(
    "token",
    token
  );

  TOKEN_KEYS
    .filter((key) => key !== "token")
    .forEach((key) => {
      localStorage.removeItem(key);
    });
};


// ==========================================
// Clear Authentication
// ==========================================

const clearAuth = () => {

  TOKEN_KEYS.forEach((key) => {
    localStorage.removeItem(key);
  });

  localStorage.removeItem("user");
};


// ==========================================
// Normalize User
// ==========================================

const normalizeUser = (user, email = "") => {

  if (!user) {

    return email
      ? {
          email,
          name: email.split("@")[0],
          role: "Citizen",
        }
      : null;
  }

  return {
    ...user,

    name:
      user.name ||
      user.fullName ||
      user.username ||
      email.split("@")[0] ||
      "User",

    email:
      user.email ||
      email,

    role:
      user.role ||
      user.userRole ||
      "Citizen",
  };
};


// ==========================================
// Auth Provider
// ==========================================

export function AuthProvider({ children }) {

  const navigate = useNavigate();

  // ========================================
  // User State
  // ========================================

  const [user, setUser] = useState(() => {

    try {

      const saved =
        localStorage.getItem("user");

      return saved
        ? JSON.parse(saved)
        : null;

    } catch {

      return null;
    }
  });


  // ========================================
  // Loading State
  // ========================================

  const [loading, setLoading] =
    useState(true);


  // ========================================
  // Load Existing User
  // ========================================

  useEffect(() => {

    const token = getToken();

    // No JWT
    if (!token) {

      setLoading(false);

      return;
    }


    const loadUser = async () => {

      try {

        // Get current user from backend
        const res =
          await api.get("/auth/me");

        const data =
          res?.data?.data ||
          res?.data?.user ||
          res?.data;


        if (
          data &&
          typeof data === "object"
        ) {

          const normalized =
            normalizeUser(data);

          setUser(normalized);

          localStorage.setItem(
            "user",
            JSON.stringify(normalized)
          );
        }

      } catch (error) {

        console.log(
          "Unable to load authenticated user:",
          error?.response?.data ||
          error.message
        );

        // If backend authentication fails,
        // clear the invalid JWT.
        if (
          error?.response?.status === 401
        ) {

          clearAuth();
          setUser(null);

          navigate(
            "/login",
            {
              replace: true,
            }
          );

          return;
        }


        // Otherwise retain saved user
        try {

          const saved =
            localStorage.getItem("user");

          if (saved) {

            setUser(
              JSON.parse(saved)
            );
          }

        } catch {}
      }

      finally {

        setLoading(false);
      }
    };


    loadUser();

  }, [navigate]);


  // ========================================
  // Login
  // ========================================

  const login = async (
    email,
    password
  ) => {

    const res =
      await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );


    const root =
      res?.data || {};


    const data =
      root.data &&
      typeof root.data === "object"
        ? root.data
        : root;


    // ======================================
    // Get JWT
    // ======================================

    const token =
      root.token ||
      data.token ||
      root.accessToken ||
      data.accessToken;


    if (!token) {

      throw new Error(
        "Backend login did not return a JWT token."
      );
    }


    // ======================================
    // Get User
    // ======================================

    const loggedUser =
      normalizeUser(
        root.user ||
        data.user ||
        data,
        email
      );


    // ======================================
    // Save Authentication
    // ======================================

    saveToken(token);

    localStorage.setItem(
      "user",
      JSON.stringify(loggedUser)
    );

    setUser(loggedUser);


    // ======================================
    // Redirect Based On Role
    // ======================================

    let destination = "/";


    if (
      loggedUser.role === "Citizen"
    ) {

      destination = "/citizen";

    } else if (
      loggedUser.role === "RescueTeam"
    ) {

      destination =
        "/rescue-team-portal";

    } else if (
      loggedUser.role === "Volunteer"
    ) {

      destination =
        "/volunteer";

    } else if (
      loggedUser.role === "Hospital"
    ) {

      destination =
        "/hospital";

    } else if (
      loggedUser.role === "Police"
    ) {

      destination =
        "/police";

    } else if (
      loggedUser.role === "NGO"
    ) {

      destination =
        "/ngo";

    } else {

      // Admin roles
      destination = "/";
    }


    navigate(
      destination,
      {
        replace: true,
      }
    );


    return {
      success: true,
      token,
      user: loggedUser,
    };
  };


  // ========================================
  // Logout
  // ========================================

  const logout = () => {

    // Remove JWT
    clearAuth();

    // Clear React authentication state
    setUser(null);

    // Go to login page
    navigate(
      "/login",
      {
        replace: true,
      }
    );
  };


  // ========================================
  // Auth Context Value
  // ========================================

  const value = useMemo(
    () => ({

      user,

      loading,

      login,

      logout,

      token:
        getToken(),

      isAuthenticated:
        Boolean(getToken()),

    }),

    [
      user,
      loading,
    ]
  );


  // ========================================
  // Provider
  // ========================================

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}


// ==========================================
// useAuth Hook
// ==========================================

export const useAuth = () => {

  const context =
    useContext(AuthContext);

  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};


// ==========================================
// Export
// ==========================================

export default AuthContext;


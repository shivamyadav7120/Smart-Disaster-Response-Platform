import React, { useState } from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!loading && isAuthenticated) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Login failed. Check your credentials.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef8ef] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#dbeadb] rounded-2xl shadow-xl p-7">
        <div className="flex items-center gap-3 mb-7">
          <div className="w-12 h-12 rounded-xl bg-[#d9a441] flex items-center justify-center text-xl">🛡️</div>
          <div>
            <h1 className="font-extrabold text-xl text-[#123322]">SDRP Admin</h1>
            <p className="text-xs text-[#718078]">Smart Disaster Response Platform</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#18352a]">Welcome back</h2>
        <p className="text-sm text-[#718078] mt-1 mb-6">Sign in to the emergency management dashboard.</p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm p-3">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-semibold text-[#18352a]">
            Email
            <input className="mt-1.5" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" placeholder="admin@example.com" />
          </label>

          <label className="block text-sm font-semibold text-[#18352a]">
            Password
            <div className="relative mt-1.5">
              <input className="pr-20" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder="Enter password" />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#2f8a52]">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <button disabled={submitting} className="w-full rounded-lg bg-[#18352a] text-white py-3 font-semibold disabled:opacity-60">
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-[#718078]">
          Citizen account? <Link to="/register" className="font-bold text-green-700">Create an account</Link>
        </div>
        <div className="mt-3 text-center text-xs text-[#8a9b91]">Authentication is handled by the SDRP backend JWT API.</div>
      </div>
    </div>
  );
}

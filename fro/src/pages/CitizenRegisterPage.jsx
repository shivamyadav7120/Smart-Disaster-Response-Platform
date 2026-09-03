import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function CitizenRegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", phone:"", password:"", address:"", city:"", state:"", pincode:"" });
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const change = e => setForm(v => ({...v, [e.target.name]: e.target.value}));
  const submit = async e => { e.preventDefault(); setError(""); setBusy(true); try { const res=await api.post("/auth/register", form); const root=res.data||{}; localStorage.setItem("token", root.token || root.data?.token || ""); localStorage.setItem("user", JSON.stringify(root.user || root.data?.user || {})); navigate("/citizen", {replace:true}); } catch(err){ setError(err?.response?.data?.message || err.message || "Registration failed"); } finally{setBusy(false);} };
  const fields=["name","email","phone","password","address","city","state","pincode"];
  return <div className="min-h-screen bg-[#eef8ef] flex items-center justify-center p-4"><div className="w-full max-w-2xl bg-white rounded-2xl border border-[#dbeadb] shadow-xl p-7"><div className="flex items-center gap-3 mb-6"><div className="w-12 h-12 rounded-xl bg-[#d9a441] flex items-center justify-center">🛡️</div><div><h1 className="text-xl font-extrabold text-[#123322]">SDRP Citizen Registration</h1><p className="text-xs text-slate-500">Create an account to send and track emergency SOS requests.</p></div></div>{error&&<div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 p-3 text-sm">{error}</div>}<form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">{fields.map(f=><label key={f} className="text-sm font-semibold text-[#18352a]">{f[0].toUpperCase()+f.slice(1)}<input name={f} value={form[f]} onChange={change} type={f==="password"?"password":f==="email"?"email":"text"} required={!["address","city","state","pincode"].includes(f)} className="mt-1.5" /></label>)}<button disabled={busy} className="sm:col-span-2 py-3 rounded-xl bg-[#18352a] text-white font-bold disabled:opacity-60">{busy?"Creating account...":"Create Citizen Account"}</button></form><p className="text-sm text-center text-slate-500 mt-5">Already registered? <Link className="font-bold text-green-700" to="/login">Sign in</Link></p></div></div>
}

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import RescueTeamTracker from "../components/RescueTeamTracker";
import { fetchMyRescueTeam, fetchMyRescueAssignments, updateRescueAssignmentStatus } from "../services/api";
import { connectSocket, onRescueAssignment, onRescueStatusUpdate } from "../services/socket";
export default function RescueTeamPortal(){
 const { user, logout } = useAuth();
 const navigate = useNavigate();
 const [team,setTeam]=useState(null);const [assignments,setAssignments]=useState([]);const [error,setError]=useState("");
 const load=async()=>{try{const [t,a]=await Promise.all([fetchMyRescueTeam(),fetchMyRescueAssignments()]);setTeam(t);setAssignments(a)}catch(e){setError(e?.response?.data?.message||e.message)}};
 useEffect(()=>{load();connectSocket();const a=onRescueAssignment(load);const b=onRescueStatusUpdate(load);return()=>{a();b()}},[]);
 const update=async(id,status)=>{try{await updateRescueAssignmentStatus(id,status);await load()}catch(e){setError(e?.response?.data?.message||e.message)}};
 const handleLogout = () => {
  logout();
  navigate("/login", { replace: true });
 };

 return <div className="min-h-screen bg-[#f4f8f4]">
  <header className="sticky top-0 z-30 bg-white border-b border-[#d9ead9] shadow-sm">
   <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
    <div>
     <h1 className="text-xl sm:text-2xl font-extrabold text-[#123322]">Rescue Team Portal</h1>
     <p className="text-sm text-[#4d6156]">Operational dashboard • Live GPS tracking</p>
    </div>
    <div className="flex items-center gap-3">
     <div className="hidden sm:block text-right">
      <p className="font-semibold text-[#123322]">{user?.name || team?.name || "Rescue Team"}</p>
      <p className="text-xs text-[#4d6156]">{user?.role || "RescueTeam"}</p>
     </div>
     <div className="w-10 h-10 rounded-full bg-[#d9a441] flex items-center justify-center font-bold text-[#123322]">
      {(user?.name || team?.name || "R").charAt(0).toUpperCase()}
     </div>
     <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-[#dc4b3e] text-white font-semibold text-sm hover:bg-[#c63e33] transition">
      Logout
     </button>
    </div>
   </div>
  </header>
  <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
   <PageHeader title="Rescue Team Portal" subtitle="Operational dashboard for assigned emergencies and live GPS."/>{error&&<div className="mb-4 bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-sm">{error}</div>}<RescueTeamTracker/><div className="grid lg:grid-cols-3 gap-5"><div className="lg:col-span-2 space-y-4">{assignments.map(s=><div key={s._id} className="bg-white border border-[#dbeadb] rounded-2xl p-5"><div className="flex justify-between gap-4"><div><div className="font-extrabold text-[#18352a]">SOS #{String(s._id).slice(-8)}</div><div className="text-sm text-slate-500">{s.disasterType} · {s.severity}</div></div><span className="text-xs font-bold rounded-full bg-amber-50 text-amber-800 px-3 py-1 h-fit">{s.status}</span></div><div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm"><div>Citizen: <b>{s.user?.name||"Citizen"}</b></div><div>Phone: <b>{s.user?.phone||"—"}</b></div><div>Location: <b>{s.location?.latitude?.toFixed?.(5)}, {s.location?.longitude?.toFixed?.(5)}</b></div><div>Description: <b>{s.description}</b></div></div><div className="flex flex-wrap gap-2 mt-5">{s.status!=="Accepted"&&<button onClick={()=>update(s._id,"Accepted")} className="px-3 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold">Accept</button>}<button onClick={()=>update(s._id,"Rescue On Way")} className="px-3 py-2 rounded-lg bg-blue-700 text-white text-xs font-bold">Rescue On Way</button><button onClick={()=>update(s._id,"Reached")} className="px-3 py-2 rounded-lg bg-green-700 text-white text-xs font-bold">Team Reached</button><button onClick={()=>update(s._id,"Resolved")} className="px-3 py-2 rounded-lg bg-emerald-900 text-white text-xs font-bold">Resolved</button></div></div>)}{!assignments.length&&<div className="bg-white border rounded-2xl p-8 text-center text-slate-500">No SOS assignments currently.</div>}</div><div className="bg-white border border-[#dbeadb] rounded-2xl p-5 h-fit"><div className="font-extrabold">Team Status</div><div className="text-3xl font-black text-green-700 mt-2">{team?.status||"—"}</div><div className="text-sm text-slate-500 mt-2">{team?.name}</div><div className="mt-4 text-sm space-y-2"><div>Leader: <b>{team?.leaderName||"—"}</b></div><div>Members: <b>{team?.members||0}</b></div><div>Area: <b>{team?.assignedArea||"—"}</b></div><div>GPS: <b>{team?.lat&&team?.lng?`${team.lat.toFixed(5)}, ${team.lng.toFixed(5)}`:"Start Live GPS"}</b></div></div></div></div>
  </main>
 </div>
}

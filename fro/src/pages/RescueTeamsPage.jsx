import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import { fetchRescueTeams } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { joinLiveMap, onLocationUpdate } from '../services/socket'
import { useAuth } from '../context/AuthContext'
import RescueTeamTracker from '../components/RescueTeamTracker'
import { Icon } from '../components/icons'
import { updateRescueTeam } from '../services/api'

export default function RescueTeamsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [teams, setTeams] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetchRescueTeams().then(setTeams).catch((e) => { console.error(e); setTeams([]); setError(e?.response?.data?.message || 'Unable to load live rescue teams') })
    if (user?.role !== 'RescueTeam') { joinLiveMap(); return onLocationUpdate((u) => { if (u?.type !== 'RescueTeam') return; setTeams(items => { const key = String(u.teamId || u._id || u.teamUserId || ''); const i = items.findIndex(t => String(t._id || t.teamId || t.teamUserId || '') === key); const incoming = { ...u, _id: u.teamId || u._id, lat: Number(u.lat ?? u.location?.latitude), lng: Number(u.lng ?? u.location?.longitude), status: u.status || 'Available', lastUpdated: u.lastUpdated }; if (i === -1) return [...items, incoming]; const next=[...items]; next[i]={...next[i],...incoming}; return next; }); }) }
  }, [user?.role])

  const refresh = async () => {
    try { setTeams(await fetchRescueTeams()) } catch (e) { setError(e?.response?.data?.message || 'Unable to load live rescue teams') }
  }

  const saveTeam = async (payload) => {
    if (!selected?._id) return
    setSaving(true); setError('')
    try {
      const updated = await updateRescueTeam(selected._id, payload)
      setTeams(items => items.map(t => String(t._id) === String(selected._id) ? updated : t))
      setSelected(updated)
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to update rescue team')
    } finally { setSaving(false) }
  }

  const activeCount = teams.filter(t => t.isLive || t.trackingStatus === 'Busy' || t.status === 'Busy' || t.status === 'Emergency').length
  const inactiveCount = Math.max(0, teams.length - activeCount)

  return (
    <div>
      {user?.role === 'RescueTeam' && <RescueTeamTracker />}
      <PageHeader title="Rescue Teams" subtitle={`${activeCount} active · ${inactiveCount} inactive · ${teams.length} registered`} action={user?.role !== 'RescueTeam' ? <button onClick={() => navigate('/teams/register')} className="px-4 py-2 rounded-xl bg-[#18352a] text-white text-sm font-bold">+ Register Team</button> : null} />
      {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatusBox label="Active / Live" value={activeCount} />
        <StatusBox label="Inactive / Offline" value={inactiveCount} />
        <StatusBox label="Total Registered" value={teams.length} />
      </div>
      {teams.length === 0 ? <div className="bg-white border rounded-2xl p-10 text-center text-slate-500">No rescue teams registered in MongoDB.</div> :
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((t, i) => {
          const live = Boolean(t.isLive)
          const operational = live ? 'Active' : (t.status || 'Offline')
          return <motion.div key={t._id || `team-${i}`} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*.04}} onClick={()=>setSelected(t)} className="card p-5 bg-white border border-[#dbeadb] rounded-2xl cursor-pointer hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#e4f4e9] flex items-center justify-center text-[#2f8a52]"><Icon.users /></div><div><div className="font-bold text-forest-900">{t.name}</div><div className="text-xs text-[#7d9285]">{t.assignedArea || 'Area not set'}</div></div></div><span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${live ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{live ? 'ACTIVE / LIVE' : operational.toUpperCase()}</span></div>
            <div className="text-sm text-[#4d6156]">{t.members ?? 0} members · {t.lat != null && t.lng != null ? `${Number(t.lat).toFixed(5)}, ${Number(t.lng).toFixed(5)}` : 'GPS location unavailable'}</div>
            <div className="text-xs text-slate-500 mt-2">{t.assignedSOS ? `SOS assigned: #${String(t.assignedSOS._id || t.assignedSOS).slice(-8)}` : 'No SOS assigned'}</div>
            <div className="text-xs text-slate-400 mt-1">Last GPS: {t.lastUpdated ? new Date(t.lastUpdated).toLocaleString() : 'Never'}</div>
          </motion.div>
        })}
      </div>}
      {selected && <EditTeamModal team={selected} saving={saving} onClose={()=>setSelected(null)} onSave={saveTeam} />}
    </div>
  )
}

function StatusBox({label,value}) { return <div className="bg-white border border-[#dbeadb] rounded-2xl p-4"><div className="text-xs text-slate-500">{label}</div><div className="text-2xl font-extrabold text-[#18352a]">{value}</div></div> }

function EditTeamModal({team,saving,onClose,onSave}) {
  const [form,setForm]=useState({name:team.name||'',leaderName:team.leaderName||'',phone:team.phone||'',members:team.members||1,assignedArea:team.assignedArea||team.area||'',skills:Array.isArray(team.skills)?team.skills.join(', '):'',status:team.status||'Available',isActive:team.isActive!==false})
  const ch=e=>setForm(v=>({...v,[e.target.name]:e.target.value}))
  const submit=e=>{e.preventDefault();onSave({...form,members:Number(form.members),skills:form.skills.split(',').map(x=>x.trim()).filter(Boolean),isActive:form.isActive,status:form.isActive?form.status:'Offline'})}
  return <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}><form onSubmit={submit} onClick={e=>e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4"><div className="flex justify-between"><div><h3 className="text-lg font-bold">Update {team.name}</h3><p className="text-xs text-slate-500">Admin changes are saved to MongoDB.</p></div><button type="button" onClick={onClose} className="text-xl">×</button></div><div className="grid sm:grid-cols-2 gap-3">{[['name','Team Name'],['leaderName','Leader'],['phone','Phone'],['members','Members'],['assignedArea','Area'],['skills','Skills']].map(([n,l])=><label key={n} className="text-sm font-semibold">{l}<input name={n} value={form[n]} onChange={ch} type={n==='members'?'number':'text'} className="mt-1 w-full" /></label>)}<label className="text-sm font-semibold">Operational Status<select name="status" value={form.status} onChange={ch} className="mt-1 w-full"><option>Available</option><option>Busy</option><option>Emergency</option><option>Offline</option></select></label><label className="flex items-center gap-2 text-sm font-semibold mt-6"><input type="checkbox" checked={form.isActive} onChange={e=>setForm(v=>({...v,isActive:e.target.checked}))}/> Team account active</label></div><button disabled={saving} className="w-full py-3 rounded-xl bg-[#18352a] text-white font-bold">{saving?'Saving...':'Save Team Update'}</button></form></div>
}

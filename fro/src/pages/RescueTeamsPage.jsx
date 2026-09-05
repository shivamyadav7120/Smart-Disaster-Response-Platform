import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import { fetchRescueTeams } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { joinLiveMap, onLocationUpdate } from '../services/socket'
import { useAuth } from '../context/AuthContext'
import RescueTeamTracker from '../components/RescueTeamTracker'
import { Icon } from '../components/icons'
import { rescueTeams as mockTeams } from '../data/mockData'

export default function RescueTeamsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [teams, setTeams] = useState(mockTeams)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetchRescueTeams().then(setTeams).catch(() => setTeams([]))
    if (user?.role !== 'RescueTeam') { joinLiveMap(); return onLocationUpdate((u) => { if (u?.type !== 'RescueTeam') return; setTeams(items => items.map(t => String(t._id || t.teamId) === String(u.teamId) ? { ...t, lat: u.lat, lng: u.lng, status: u.status, lastUpdated: u.lastUpdated } : t)); }) }
  }, [user?.role])

  return (
    <div>
      {user?.role === 'RescueTeam' && <RescueTeamTracker />}
      <PageHeader title="Rescue Teams" subtitle={`${teams.length} teams tracked`} action={user?.role !== 'RescueTeam' ? <button onClick={() => navigate('/teams/register')} className="px-4 py-2 rounded-xl bg-[#18352a] text-white text-sm font-bold">+ Register Team</button> : null} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => setSelected(t)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setSelected(t)}
            className="card p-5 bg-white border border-[#dbeadb] rounded-2xl cursor-pointer hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#e4f4e9] flex items-center justify-center text-[#2f8a52]">
                <Icon.users />
              </div>
              <div>
                <div className="font-bold text-forest-900">{t.name}</div>
                <div className="text-xs text-[#7d9285]">{t.area}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#4d6156]">{t.members} members · {t.lat && t.lng ? `${Number(t.lat).toFixed(4)}, ${Number(t.lng).toFixed(4)}` : 'GPS offline'}</span>
              <span
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                style={
                  t.status === 'Active'
                    ? { background: '#e4f4e9', color: '#2f8a52' }
                    : { background: '#fbf0dd', color: '#d98a1f' }
                }
              >
                {t.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      {selected && <DetailModal title={selected.name} onClose={() => setSelected(null)}><p>Area: {selected.area || '—'}</p><p>Leader: {selected.leaderName || '—'}</p><p>Phone: {selected.phone || '—'}</p><p>Members: {selected.members ?? 0}</p><p>Status: {selected.status || '—'}</p><p>GPS: {Number.isFinite(selected.lat) && Number.isFinite(selected.lng) ? `${selected.lat.toFixed(5)}, ${selected.lng.toFixed(5)}` : 'Not available'}</p><p>Last update: {selected.lastUpdated ? new Date(selected.lastUpdated).toLocaleString() : '—'}</p></DetailModal>}
    </div>
  )
}

function DetailModal({ title, onClose, children }) {
  return <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}><div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-2 text-sm text-[#4d6156]" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between mb-3"><h3 className="text-lg font-bold text-forest-900">{title}</h3><button onClick={onClose} className="text-xl">×</button></div>{children}</div></div>;
}

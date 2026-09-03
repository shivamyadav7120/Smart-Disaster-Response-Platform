import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import { fetchShelters } from '../services/api'
import { Icon } from '../components/icons'
import { shelters as mockShelters } from '../data/mockData'

export default function SheltersPage() {
  const [shelters, setShelters] = useState(mockShelters)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetchShelters().then((data) => setShelters(data.length ? data : mockShelters)).catch(() => setShelters(mockShelters))
  }, [])

  return (
    <div>
      <PageHeader title="Shelters" subtitle={`${shelters.length} shelters registered`} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shelters.map((s, i) => {
          const pct = Math.round((s.occupied / s.capacity) * 100)
          return (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setSelected(s)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setSelected(s)}
            className="card p-5 bg-white border border-[#dbeadb] rounded-2xl cursor-pointer hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#e4eef8] flex items-center justify-center text-[#2f6fb0]">
                  <Icon.shelter />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-forest-900 truncate">{s.name}</div>
                  <div className="text-xs text-[#7d9285]">{s.contact}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-[#4d6156] mb-1">
                <span>
                  {s.occupied}/{s.capacity} occupied
                </span>
                <span
                  className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                  style={
                    s.status === 'Open' ? { background: '#e4f4e9', color: '#2f8a52' } : { background: '#fbe7e4', color: '#dc4b3e' }
                  }
                >
                  {s.status}
                </span>
              </div>
              <div className="h-2 rounded-full bg-[#eef2ee] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: pct > 90 ? '#dc4b3e' : '#2f6fb0' }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
      {selected && <DetailModal title={selected.name} onClose={() => setSelected(null)}><p>Contact: {selected.contact || '—'}</p><p>Status: {selected.status || '—'}</p><p>Occupancy: {selected.occupied ?? 0} / {selected.capacity ?? 0}</p></DetailModal>}
    </div>
  )
}

function DetailModal({ title, onClose, children }) {
  return <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}><div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-2 text-sm text-[#4d6156]" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between mb-3"><h3 className="text-lg font-bold text-forest-900">{title}</h3><button onClick={onClose} className="text-xl">×</button></div>{children}</div></div>;
}

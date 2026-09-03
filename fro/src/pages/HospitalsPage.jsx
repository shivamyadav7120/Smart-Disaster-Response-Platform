import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import { fetchHospitals } from '../services/api'
import { Icon } from '../components/icons'
import { hospitals as mockHospitals } from '../data/mockData'

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState(mockHospitals)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetchHospitals().then((data) => setHospitals(data.length ? data : mockHospitals)).catch(() => setHospitals(mockHospitals))
  }, [])

  return (
    <div>
      <PageHeader title="Hospitals" subtitle={`${hospitals.length} hospitals connected`} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {hospitals.map((h, i) => (
          <motion.div
            key={h.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => setSelected(h)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setSelected(h)}
            className="card p-5 bg-white border border-[#dbeadb] rounded-2xl cursor-pointer hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#fbe7e4] flex items-center justify-center text-[#dc4b3e]">
                <Icon.hospital />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-forest-900 truncate">{h.name}</div>
                <div className="text-xs text-[#7d9285]">{h.phone}</div>
              </div>
            </div>
            <div className="text-sm text-[#4d6156]">
              Beds available: <span className="font-semibold text-forest-900">{h.available}</span> / {h.beds}
            </div>
          </motion.div>
        ))}
      </div>
      {selected && <DetailModal title={selected.name} onClose={() => setSelected(null)}><p>Phone: {selected.phone || '—'}</p><p>Beds available: {selected.available ?? 0} / {selected.beds ?? 0}</p></DetailModal>}
    </div>
  )
}

function DetailModal({ title, onClose, children }) {
  return <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}><div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-2 text-sm text-[#4d6156]" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between mb-3"><h3 className="text-lg font-bold text-forest-900">{title}</h3><button onClick={onClose} className="text-xl">×</button></div>{children}</div></div>;
}

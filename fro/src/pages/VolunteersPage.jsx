import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import { fetchVolunteers } from '../services/api'
import { Icon } from '../components/icons'
import { volunteers as mockVolunteers } from '../data/mockData'

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState(mockVolunteers)

  useEffect(() => {
    fetchVolunteers().then((data) => setVolunteers(data.length ? data : mockVolunteers)).catch(() => setVolunteers(mockVolunteers))
  }, [])

  return (
    <div>
      <PageHeader title="Volunteers" subtitle={`${volunteers.length} volunteers active`} />
      <div className="card bg-white border border-[#dbeadb] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#7d9285] border-b border-[#eef2ee]">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Area</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map((v, i) => (
              <motion.tr
                key={v.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-[#f3f7f3] last:border-0 hover:bg-[#f7fbf7] cursor-pointer"
              >
                <td className="px-5 py-3 font-semibold text-forest-900 flex items-center gap-2">
                  <Icon.hands className="text-[#6a4fb5]" /> {v.name}
                </td>
                <td className="px-5 py-3 text-[#3a4a3f]">{v.role}</td>
                <td className="px-5 py-3 text-[#3a4a3f]">{v.area}</td>
                <td className="px-5 py-3">
                  <span
                    className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                    style={
                      v.status === 'Deployed'
                        ? { background: '#e4f4e9', color: '#2f8a52' }
                        : { background: '#fbf0dd', color: '#d98a1f' }
                    }
                  >
                    {v.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { fetchResources } from '../services/api'
import { Icon } from './icons'
import { useNavigate } from 'react-router-dom'

export default function ResourceCard() {
  const [resources, setResources] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchResources().then((data) => setResources(Array.isArray(data) ? data : [])).catch(() => setResources([]))
  }, [])

  return (
    <div className="card p-5 bg-white border border-[#dbeadb] rounded-2xl">
      <h2 className="font-bold text-[15px] mb-4 text-forest-900">Resource Status</h2>
      <div className="grid grid-cols-4 gap-2 text-center">
        {resources.map((r) => {
          const IconComp = Icon[r.icon] || Icon.box
          return (
            <div key={r.label}>
              <div className="text-2xl mb-1 flex justify-center text-forest-700">
                <IconComp />
              </div>
              <div className="font-extrabold text-lg text-forest-900">{r.value}</div>
              <div className="text-[10px] text-[#7d9285] leading-tight">
                {r.label}
                <br />
                {r.unit}
              </div>
            </div>
          )
        })}
      </div>
      <button onClick={() => navigate('/resources')} className="mt-4 w-full py-2.5 rounded-lg text-white text-sm font-semibold bg-forest-800 hover:opacity-90 transition">
        View All Resources
      </button>
    </div>
  )
}

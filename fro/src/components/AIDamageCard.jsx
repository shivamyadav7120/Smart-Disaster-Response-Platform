import React, { useRef, useState } from 'react'
import { detectDamage } from '../services/aiDamage'
import { aiDamageReport as initialReport } from '../data/mockData'
import { useNavigate } from 'react-router-dom'

const severityColor = { High: '#dc4b3e', Medium: '#d98a1f', Low: '#2f8a52' }

export default function AIDamageCard() {
  const [report, setReport] = useState(initialReport)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const fileRef = useRef(null)

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    const result = await detectDamage(file)
    setReport(result)
    setLoading(false)
  }

  return (
    <div className="card p-5 bg-white border border-[#dbeadb] rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-[15px] text-forest-900">AI Damage Assessment</h2>
        <button
          onClick={() => fileRef.current?.click()}
          className="text-xs font-semibold text-forest-700"
        >
          Upload photo
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </div>

      {loading ? (
        <div className="h-16 rounded-lg bg-[#f3f7f3] animate-pulse" />
      ) : (
        <div className="flex gap-3 items-center">
          <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-[#dceadd] flex items-center justify-center text-2xl">
            🌊
          </div>
          <div>
            <div className="font-bold text-[15px] text-forest-900">{report.title}</div>
            <div className="text-sm text-[#4d6156] mt-0.5">
              Confidence: <span className="font-semibold">{report.confidence}</span>
            </div>
            <div className="text-sm text-[#4d6156]">
              Severity:{' '}
              <span className="font-bold" style={{ color: severityColor[report.severity] || '#dc4b3e' }}>
                {report.severity}
              </span>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => navigate('/reports')} className="mt-4 w-full py-2.5 rounded-lg text-white text-sm font-semibold bg-forest-800 hover:opacity-90 transition">
        View All Reports
      </button>
    </div>
  )
}

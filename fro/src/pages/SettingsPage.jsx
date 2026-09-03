import React, { useState } from 'react'
import PageHeader from '../components/PageHeader'

export default function SettingsPage() {
  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem('sdrp_settings')
      if (saved) return JSON.parse(saved)
    } catch {}
    return {
    name: 'Amit Kumar',
    email: 'amit.kumar@sdrp.gov.in',
    district: 'Ghaziabad',
    notifyHighPriority: true,
    notifyWeather: true
    }
  })
  const [saved, setSaved] = useState(false)

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSave = (e) => {
    e.preventDefault()
    localStorage.setItem('sdrp_settings', JSON.stringify(form))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Admin profile and notification preferences" />

      <form onSubmit={handleSave} className="card p-6 bg-white border border-[#dbeadb] rounded-2xl max-w-xl space-y-5">
        <div>
          <label className="text-sm font-semibold text-forest-900">Full name</label>
          <input
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-[#dbeadb] text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-forest-900">Email</label>
          <input
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-[#dbeadb] text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-forest-900">District</label>
          <input
            value={form.district}
            onChange={(e) => update('district', e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-[#dbeadb] text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-[#3a4a3f]">
            <input
              type="checkbox"
              checked={form.notifyHighPriority}
              onChange={(e) => update('notifyHighPriority', e.target.checked)}
            />
            Notify me for high-priority SOS requests
          </label>
          <label className="flex items-center gap-2 text-sm text-[#3a4a3f]">
            <input
              type="checkbox"
              checked={form.notifyWeather}
              onChange={(e) => update('notifyWeather', e.target.checked)}
            />
            Notify me for weather alerts
          </label>
        </div>

        <button type="submit" className="w-full py-2.5 rounded-lg text-white text-sm font-semibold bg-forest-800">
          {saved ? 'Saved ✓' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}

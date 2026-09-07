import React, { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { useAuth } from '../context/AuthContext'

const DISTRICTS = [
  'All Districts', 'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amroha', 'Auraiya',
  'Ayodhya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda',
  'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr',
  'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur',
  'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur',
  'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi',
  'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kushinagar',
  'Lakhimpur Kheri', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri',
  'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit',
  'Pratapgarh', 'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal',
  'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar',
  'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'
]

export default function SettingsPage() {
  const { user } = useAuth()
  const isDistrictAdmin = user?.role === 'DistrictAdmin'
  const [district, setDistrict] = useState(() => localStorage.getItem('sdrp_admin_district') || user?.district || 'All Districts')
  const [notifyHighPriority, setNotifyHighPriority] = useState(() => localStorage.getItem('sdrp_notify_high') !== 'false')
  const [notifyWeather, setNotifyWeather] = useState(() => localStorage.getItem('sdrp_notify_weather') !== 'false')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('sdrp_admin_district') && user?.district) setDistrict(user.district)
  }, [user?.district])

  const handleSave = (e) => {
    e.preventDefault()
    localStorage.setItem('sdrp_admin_district', isDistrictAdmin ? (user?.district || district) : district)
    localStorage.setItem('sdrp_notify_high', String(notifyHighPriority))
    localStorage.setItem('sdrp_notify_weather', String(notifyWeather))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    window.dispatchEvent(new Event('sdrp-district-changed'))
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Admin profile and district jurisdiction" />
      <form onSubmit={handleSave} className="card p-6 bg-white border border-[#dbeadb] rounded-2xl max-w-xl space-y-5">
        <div>
          <label className="text-sm font-semibold text-forest-900">Admin</label>
          <div className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-50 border border-[#dbeadb] text-sm">{user?.name || 'Administrator'} · {user?.email || '—'}</div>
        </div>
        <div>
          <label className="text-sm font-semibold text-forest-900">Active district / jurisdiction</label>
          <select value={isDistrictAdmin ? (user?.district || district) : district} disabled={isDistrictAdmin} onChange={(e) => setDistrict(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border border-[#dbeadb] text-sm disabled:bg-slate-100">
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <p className="text-xs text-slate-500 mt-1">All rescue teams, hospitals, shelters, volunteers, resources, SOS records, risk zones and blocked roads shown to this admin are filtered to this district.</p>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-[#3a4a3f]"><input type="checkbox" checked={notifyHighPriority} onChange={(e) => setNotifyHighPriority(e.target.checked)} />Notify me for high-priority SOS requests</label>
          <label className="flex items-center gap-2 text-sm text-[#3a4a3f]"><input type="checkbox" checked={notifyWeather} onChange={(e) => setNotifyWeather(e.target.checked)} />Notify me for weather alerts</label>
        </div>
        <button type="submit" className="w-full py-2.5 rounded-lg text-white text-sm font-semibold bg-forest-800">{saved ? 'Saved ✓' : 'Save district settings'}</button>
      </form>
    </div>
  )
}

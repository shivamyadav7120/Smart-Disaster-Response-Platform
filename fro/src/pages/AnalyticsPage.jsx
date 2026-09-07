import React, { useEffect, useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import PageHeader from '../components/PageHeader'
import { api } from '../services/api'

export default function AnalyticsPage() {
  const [data, setData] = useState({ trend: [], priority: [] })
  const [error, setError] = useState('')
  useEffect(() => { api.get('/stats/analytics').then(r => setData(r.data?.data || r.data || {trend:[],priority:[]})).catch(e => setError(e?.response?.data?.message || 'Unable to load analytics from MongoDB.')) }, [])
  return <div><PageHeader title="Analytics" subtitle="Live analytics calculated from MongoDB" />{error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}<div className="grid grid-cols-1 lg:grid-cols-2 gap-5"><div className="card p-5 bg-white border rounded-2xl"><h3 className="font-bold mb-4">SOS Requests vs Resolved</h3><div style={{width:'100%',height:280}}><ResponsiveContainer><BarChart data={data.trend || []}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="day"/><YAxis/><Tooltip/><Legend/><Bar dataKey="sos" name="SOS Received"/><Bar dataKey="resolved" name="Resolved"/></BarChart></ResponsiveContainer></div></div><div className="card p-5 bg-white border rounded-2xl"><h3 className="font-bold mb-4">Priority Breakdown</h3><div style={{width:'100%',height:280}}><ResponsiveContainer><LineChart data={data.priority || []}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis/><Tooltip/><Line type="monotone" dataKey="value" name="SOS"/></LineChart></ResponsiveContainer></div></div></div></div>
}

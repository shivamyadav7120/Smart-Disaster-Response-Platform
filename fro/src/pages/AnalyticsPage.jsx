import React from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import PageHeader from '../components/PageHeader'
import { sosTrend, priorityBreakdown } from '../data/mockData'

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="Analytics" subtitle="Trends across the last 7 days" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card p-5 bg-white border border-[#dbeadb] rounded-2xl lg:col-span-2">
          <h3 className="font-bold text-[15px] text-forest-900 mb-4">SOS Requests vs Resolved</h3>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={sosTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2ee" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#7d9285" />
                <YAxis tick={{ fontSize: 12 }} stroke="#7d9285" />
                <Tooltip />
                <Legend />
                <Bar dataKey="sos" fill="#dc4b3e" name="SOS Received" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="#2f8a52" name="Resolved" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5 bg-white border border-[#dbeadb] rounded-2xl">
          <h3 className="font-bold text-[15px] text-forest-900 mb-4">Priority Breakdown</h3>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={priorityBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {priorityBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5 bg-white border border-[#dbeadb] rounded-2xl lg:col-span-3">
          <h3 className="font-bold text-[15px] text-forest-900 mb-4">Resolution Rate Trend</h3>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={sosTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2ee" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#7d9285" />
                <YAxis tick={{ fontSize: 12 }} stroke="#7d9285" />
                <Tooltip />
                <Line type="monotone" dataKey="resolved" stroke="#2f6fb0" strokeWidth={3} dot={{ r: 4 }} name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

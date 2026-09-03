import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import PageHeader from '../components/PageHeader'
import ResourceCard from '../components/ResourceCard'
import { resourceTrend } from '../data/mockData'

export default function ResourcesPage() {
  return (
    <div>
      <PageHeader title="Resources" subtitle="Current stock and 7-day consumption trend" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ResourceCard />

        <div className="card p-5 bg-white border border-[#dbeadb] rounded-2xl lg:col-span-2">
          <h3 className="font-bold text-[15px] text-forest-900 mb-4">7-Day Stock Trend</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={resourceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2ee" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#7d9285" />
                <YAxis tick={{ fontSize: 12 }} stroke="#7d9285" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="food" stroke="#2f8a52" strokeWidth={2} name="Food Packets" />
                <Line type="monotone" dataKey="water" stroke="#2f6fb0" strokeWidth={2} name="Water (L)" />
                <Line type="monotone" dataKey="medicine" stroke="#6a4fb5" strokeWidth={2} name="Medicine Kits" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

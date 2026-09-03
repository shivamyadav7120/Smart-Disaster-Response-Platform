import React from 'react'
import PageHeader from '../components/PageHeader'
import LiveMap from '../components/LiveMap'

export default function LiveMapPage() {
  return (
    <div>
      <PageHeader title="Live Disaster Map" subtitle="Real-time view of SOS requests, shelters, teams and hospitals" />
      <LiveMap height={620} />
    </div>
  )
}

import React from 'react'

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
      <div>
        <h2 className="text-lg font-extrabold text-forest-900">{title}</h2>
        {subtitle && <p className="text-sm text-[#4d6156]">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

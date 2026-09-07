import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from './icons'

const toneStyles = {
  red: { bg: '#fbe7e4', color: '#dc4b3e', text: '#3a2c29' },
  blue: { bg: '#e4eef8', color: '#2f6fb0', text: '#26374a' },
  green: { bg: '#e4f4e9', color: '#2f8a52', text: '#1f3a28' },
  purple: { bg: '#ece6f8', color: '#6a4fb5', text: '#332a4a' }
}

export default function StatCard({ icon, value, label, delta, tone, index = 0 }) {
  const t = toneStyles[tone] || toneStyles.green
  const IconComp = Icon[icon] || Icon.alert

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="p-5 rounded-2xl"
      style={{ background: t.bg }}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl" style={{ color: t.color }}>
          <IconComp />
        </span>
        <span className="text-3xl font-extrabold" style={{ color: t.color }}>
          {value}
        </span>
      </div>
      <div className="mt-2 text-sm font-semibold" style={{ color: t.text }}>
        {label}
      </div>
      <div className="mt-1 text-xs font-medium" style={{ color: t.color }}>
        ↑ {delta}
      </div>
    </motion.div>
  )
}

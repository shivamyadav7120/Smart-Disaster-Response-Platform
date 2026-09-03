export const stats = [
  { label: 'Active SOS Requests', value: 42, delta: '12% from yesterday', tone: 'red', icon: 'alert' },
  { label: 'Shelters Open', value: 18, delta: '8% from yesterday', tone: 'blue', icon: 'home' },
  { label: 'Active Rescue Teams', value: 12, delta: '5% from yesterday', tone: 'green', icon: 'users' },
  { label: 'Volunteers Deployed', value: 156, delta: '15% from yesterday', tone: 'purple', icon: 'hands' }
]

export const sosRequests = [
  { id: 'SOS-1083', loc: 'Near Sector 62, Noida', time: '10:30 AM', date: '20 May', priority: 'High', status: 'Pending', lat: 28.628, lng: 77.3649 },
  { id: 'SOS-1082', loc: 'Loni, Ghaziabad', time: '10:15 AM', date: '20 May', priority: 'Medium', status: 'Dispatched', lat: 28.7515, lng: 77.2897 },
  { id: 'SOS-1081', loc: 'Shastri Nagar, Delhi', time: '09:50 AM', date: '20 May', priority: 'High', status: 'Pending', lat: 28.674, lng: 77.181 },
  { id: 'SOS-1080', loc: 'Okhla, Delhi', time: '09:30 AM', date: '20 May', priority: 'Low', status: 'Resolved', lat: 28.5433, lng: 77.2726 },
  { id: 'SOS-1079', loc: 'Vasundhara, Ghaziabad', time: '09:10 AM', date: '20 May', priority: 'Medium', status: 'Dispatched', lat: 28.6603, lng: 77.391 },
  { id: 'SOS-1078', loc: 'Indirapuram, Ghaziabad', time: '08:55 AM', date: '20 May', priority: 'High', status: 'Pending', lat: 28.6461, lng: 77.3733 },
  { id: 'SOS-1077', loc: 'Dwarka Sector 12, Delhi', time: '08:40 AM', date: '20 May', priority: 'Low', status: 'Resolved', lat: 28.5921, lng: 77.041 }
]

export const shelters = [
  { name: 'Loni Relief Shelter', lat: 28.71, lng: 77.31, status: 'Open', capacity: 200, occupied: 134, contact: '+91 98110 22331' },
  { name: 'Vaishali Community Shelter', lat: 28.6, lng: 77.22, status: 'Open', capacity: 150, occupied: 98, contact: '+91 98110 44521' },
  { name: 'Indirapuram School Shelter', lat: 28.6461, lng: 77.3733, status: 'Open', capacity: 300, occupied: 260, contact: '+91 98110 88760' },
  { name: 'Dwarka Sector 12 Shelter', lat: 28.5921, lng: 77.041, status: 'Full', capacity: 120, occupied: 120, contact: '+91 98110 33982' }
]

export const rescueTeams = [
  { name: 'Rescue Team Alpha', lat: 28.68, lng: 77.42, status: 'Active', members: 8, area: 'Greater Noida' },
  { name: 'Rescue Team Bravo', lat: 28.56, lng: 77.3, status: 'Active', members: 6, area: 'Faridabad' },
  { name: 'Rescue Team Charlie', lat: 28.75, lng: 77.29, status: 'On Break', members: 5, area: 'Loni' },
  { name: 'Rescue Team Delta', lat: 28.59, lng: 77.22, status: 'Active', members: 7, area: 'Vaishali' }
]

export const hospitals = [
  { name: 'Greater Noida District Hospital', lat: 28.545, lng: 77.44, beds: 340, available: 62, phone: '+91 120 233 4455' },
  { name: 'Ghaziabad Combined Hospital', lat: 28.6692, lng: 77.4538, beds: 220, available: 31, phone: '+91 120 277 8890' },
  { name: 'Delhi Shastri Nagar Hospital', lat: 28.674, lng: 77.181, beds: 180, available: 12, phone: '+91 11 2345 6789' }
]

export const volunteers = [
  { name: 'Priya Sharma', role: 'Medical Aid', area: 'Noida', status: 'Deployed' },
  { name: 'Rohit Verma', role: 'Logistics', area: 'Ghaziabad', status: 'Deployed' },
  { name: 'Ayesha Khan', role: 'Shelter Coordination', area: 'Delhi', status: 'On Call' },
  { name: 'Karan Mehta', role: 'Rescue Support', area: 'Faridabad', status: 'Deployed' },
  { name: 'Neha Gupta', role: 'Food Distribution', area: 'Vaishali', status: 'On Call' }
]

export const blockedRoads = [{ name: 'NH28', lat: 28.6, lng: 77.35 }]

export const weatherAlert = {
  title: 'Heavy Rainfall Warning',
  area: 'in your area',
  validUntil: 'Valid until 11:30 PM, 20 May'
}

export const resourceStatus = [
  { label: 'Food Packets', unit: 'units', value: '320', icon: 'box' },
  { label: 'Water Bottles', unit: 'Liters', value: '1,240', icon: 'water' },
  { label: 'Medicine Kits', unit: 'kits', value: '420', icon: 'medkit' },
  { label: 'Blankets', unit: 'units', value: '810', icon: 'blanket' }
]

export const aiDamageReport = {
  title: 'Flood Detected',
  confidence: '92%',
  severity: 'High',
  location: 'Indirapuram, Ghaziabad',
  detectedAt: '10:05 AM, 20 May'
}

export const damageReports = [
  { title: 'Flood Detected', confidence: '92%', severity: 'High', location: 'Indirapuram, Ghaziabad', detectedAt: '10:05 AM, 20 May' },
  { title: 'Structural Collapse', confidence: '78%', severity: 'Medium', location: 'Loni, Ghaziabad', detectedAt: '09:20 AM, 20 May' },
  { title: 'Waterlogging', confidence: '85%', severity: 'Low', location: 'Okhla, Delhi', detectedAt: '08:45 AM, 20 May' }
]

// SOS trend over the last 7 days, for Recharts on the Analytics page
export const sosTrend = [
  { day: 'Mon', sos: 22, resolved: 18 },
  { day: 'Tue', sos: 28, resolved: 21 },
  { day: 'Wed', sos: 19, resolved: 17 },
  { day: 'Thu', sos: 34, resolved: 24 },
  { day: 'Fri', sos: 41, resolved: 30 },
  { day: 'Sat', sos: 37, resolved: 33 },
  { day: 'Sun', sos: 42, resolved: 29 }
]

export const priorityBreakdown = [
  { name: 'High', value: 18, color: '#dc4b3e' },
  { name: 'Medium', value: 15, color: '#d98a1f' },
  { name: 'Low', value: 9, color: '#2f8a52' }
]

export const resourceTrend = [
  { day: 'Mon', food: 410, water: 1500, medicine: 500 },
  { day: 'Tue', food: 390, water: 1420, medicine: 480 },
  { day: 'Wed', food: 360, water: 1380, medicine: 460 },
  { day: 'Thu', food: 350, water: 1310, medicine: 445 },
  { day: 'Fri', food: 335, water: 1290, medicine: 430 },
  { day: 'Sat', food: 328, water: 1260, medicine: 425 },
  { day: 'Sun', food: 320, water: 1240, medicine: 420 }
]

export const navItems = [
  { key: 'dashboard', path: '/', label: 'Dashboard', icon: 'home' },
  { key: 'map', path: '/map', label: 'Live Map', icon: 'map' },
  { key: 'sos', path: '/sos', label: 'SOS Requests', icon: 'pin' },
  { key: 'teams', path: '/teams', label: 'Rescue Teams', icon: 'users' },
  { key: 'shelters', path: '/shelters', label: 'Shelters', icon: 'shelter' },
  { key: 'resources', path: '/resources', label: 'Resources', icon: 'box' },
  { key: 'volunteers', path: '/volunteers', label: 'Volunteers', icon: 'hands' },
  { key: 'hospitals', path: '/hospitals', label: 'Hospitals', icon: 'hospital' },
  { key: 'weather', path: '/weather', label: 'Weather', icon: 'weather' },
  { key: 'notifications', path: '/notifications', label: 'Notifications', icon: 'bell' },
  { key: 'analytics', path: '/analytics', label: 'Analytics', icon: 'chart' },
  { key: 'reports', path: '/reports', label: 'Reports', icon: 'file' },
  { key: 'settings', path: '/settings', label: 'Settings', icon: 'settings' }
]

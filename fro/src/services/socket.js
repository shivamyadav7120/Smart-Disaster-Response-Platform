import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling'],
})

export function connectSocket() {
  if (!socket.connected) socket.connect()
}

export function disconnectSocket() {
  if (socket.connected) socket.disconnect()
}

export function joinLiveMap() {
  connectSocket()
  socket.emit('joinMap')
}

export function leaveLiveMap() {
  if (socket.connected) socket.off('locationUpdate')
}

export function onLocationUpdate(callback) {
  socket.on('locationUpdate', callback)
  return () => socket.off('locationUpdate', callback)
}


export function joinSOSRoom(sosId) {
  connectSocket()
  socket.emit('joinSOS', sosId)
}

export function leaveSOSRoom(sosId) {
  if (socket.connected) socket.emit('leaveSOS', sosId)
}

export function onRescueLocationUpdate(callback) {
  socket.on('rescueLocationUpdate', callback)
  return () => socket.off('rescueLocationUpdate', callback)
}

export function onRescueStatusUpdate(callback) {
  socket.on('rescueStatusUpdate', callback)
  return () => socket.off('rescueStatusUpdate', callback)
}

export function onNewSOS(callback) {
  socket.on('newSOS', callback)
  return () => socket.off('newSOS', callback)
}

export function onRescueAssignment(callback) {
  socket.on('rescueAssignment', callback)
  return () => socket.off('rescueAssignment', callback)
}

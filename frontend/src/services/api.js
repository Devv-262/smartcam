import axios from 'axios';
import io from 'socket.io-client';

const API_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Socket.IO connection
export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: true
});

// API methods
export const apiService = {
  // Sensor APIs
  getSensors: () => api.get('/sensors'),
  controlSensor: (sector, sensor, action) => 
    api.post('/sensors/control', { sector, sensor, action }),
  
  // System APIs
  getSystemStats: () => api.get('/system/stats'),
  
  // Security APIs
  getAttacks: () => api.get('/security/attacks'),
  getSecurityStats: () => api.get('/security/stats'),
  blockIP: (ip) => api.post('/security/block-ip', { ip }),
  unblockIP: (ip) => api.post('/security/unblock-ip', { ip }),
  
  // Mitigation APIs
  toggleMitigation: (measure, enabled) => 
    api.post('/mitigation/toggle', { measure, enabled }),
  
  // Email APIs
  sendEmailReport: () => api.post('/email/send-report'),
  toggleEmailAlerts: (enabled) => api.post('/email/toggle', { enabled })
};

export default api;
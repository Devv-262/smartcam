import axios from 'axios';
import { io } from 'socket.io-client';

<<<<<<< HEAD
// Allow overriding via Vite env variables `VITE_API_URL` and `VITE_SOCKET_URL`.
// Default: Use current page host for Socket.IO (leverages Vite proxy).
// For API, explicitly use the configured backend host.
const pageHost = (typeof window !== 'undefined' && window.location && window.location.host) ? window.location.host : 'localhost:5174';
const apiEnv = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL;
const socketEnv = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SOCKET_URL;

// API always goes to explicit backend URL (or uses env var)
const API_URL = apiEnv || `http://localhost:5000/api`;
// Socket.IO uses current page host by default (leverages Vite proxy at /socket.io),
// or explicit env var if set
const SOCKET_URL = socketEnv || `http://${pageHost}`;
=======
const API_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';
>>>>>>> 4513f3dbe49a135911df4895bf01bc2e063e2c0f

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
<<<<<<< HEAD
  path: '/socket.io',
=======
>>>>>>> 4513f3dbe49a135911df4895bf01bc2e063e2c0f
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
<<<<<<< HEAD
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity
=======
  reconnectionAttempts: 5
>>>>>>> 4513f3dbe49a135911df4895bf01bc2e063e2c0f
});

// Socket connection handlers
socket.on('connect', () => {
  console.log('Connected to backend:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from backend');
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
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

<<<<<<< HEAD
export default api;

// Helpful debug information printed when frontend loads
if (typeof window !== 'undefined') {
  console.info('[frontend] API base URL:', API_URL);
  console.info('[frontend] Socket URL:', SOCKET_URL);
  console.info('[frontend] Socket connected:', socket.connected);
  console.info('[frontend] Socket ID:', socket.id || 'NOT_SET_YET');
}
=======
export default api;
>>>>>>> 4513f3dbe49a135911df4895bf01bc2e063e2c0f

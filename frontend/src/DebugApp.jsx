import React, { useState, useEffect } from 'react'

function DebugApp() {
  const [connected, setConnected] = useState(false)
  const [socketId, setSocketId] = useState('...')
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('[DebugApp] Component mounted')
    
    // Test 1: Can we import socket?
    try {
      const { socket } = require('../services/api.js')
      console.log('[DebugApp] Socket imported:', socket)
      setSocketId(socket.id || 'not-yet-set')
      setConnected(socket.connected || false)
      
      const unsubscribe = () => {
        socket.on('connect', () => {
          console.log('[DebugApp] Socket connected!', socket.id)
          setConnected(true)
          setSocketId(socket.id)
        })
      }
      unsubscribe()
    } catch (err) {
      console.error('[DebugApp] Error:', err)
      setError(err.message)
    }
  }, [])

  return (
    <div style={{ 
      background: '#1a1a2e', 
      color: '#00d4ff', 
      padding: '40px', 
      fontFamily: 'monospace',
      minHeight: '100vh'
    }}>
      <h1>🔧 Frontend Debug Console</h1>
      <div style={{ marginTop: '20px', padding: '20px', background: '#16213e', borderRadius: '8px' }}>
        <p><strong>React App:</strong> ✓ MOUNTED</p>
        <p><strong>Socket Connected:</strong> {connected ? '✓ YES' : '✗ NO'}</p>
        <p><strong>Socket ID:</strong> {socketId}</p>
        {error && <p style={{ color: '#ff4444' }}><strong>Error:</strong> {error}</p>}
      </div>
      
      <div style={{ marginTop: '30px', padding: '20px', background: '#16213e', borderRadius: '8px' }}>
        <h2>📋 Check Browser Console (F12)</h2>
        <p>- Look for Socket.IO connection messages</p>
        <p>- Check for [frontend] logs</p>
        <p>- Look for any red error messages</p>
      </div>

      <button 
        onClick={() => {
          const { socket } = require('../services/api.js')
          console.log('Current socket state:', {
            connected: socket.connected,
            id: socket.id,
            url: socket.io.uri
          })
          alert(`Socket connected: ${socket.connected}\nSocket ID: ${socket.id}`)
        }}
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          background: '#00d4ff',
          color: '#000',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px'
        }}
      >
        Check Socket Status
      </button>
    </div>
  )
}

export default DebugApp

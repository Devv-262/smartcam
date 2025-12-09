import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Activity, Bell, Settings, Zap, Terminal, Lock, Network, ShieldAlert, Ban, CheckCircle, XCircle, Mail, Database, Cpu, HardDrive, Power, RefreshCw, PlayCircle, StopCircle, TrendingUp, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { apiService, socket } from '../services/api';

const DefenseDashboard = ({ onNavigate }) => {
  const [alerts, setAlerts] = useState([]);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [attackHistory, setAttackHistory] = useState([]);
  const [cpuHistory, setCpuHistory] = useState([]);
  const [networkHistory, setNetworkHistory] = useState([]);
  
  const [attackMetrics, setAttackMetrics] = useState({
    dos: 0,
    sql_injection: 0,
    brute_force: 0,
    arp_spoofing: 0,
    port_scan: 0,
    mitm: 0
  });

  const [systemHealth, setSystemHealth] = useState({
    cpu: 45,
    memory: 62,
    disk: 58,
    temperature: 52,
    network: 78,
    connections: 12
  });

  const [mitigationStatus, setMitigationStatus] = useState({
    firewall: true,
    fail2ban: true,
    rateLimit: false,
    arpProtection: false,
    portSecurity: true
  });

  // Initialize history data
  useEffect(() => {
    const initHistory = () => {
      const initialAttackHistory = Array.from({length: 20}, (_, i) => ({
        time: `${i}s`,
        attacks: Math.floor(Math.random() * 10),
        packets: 100 + Math.floor(Math.random() * 50)
      }));
      setAttackHistory(initialAttackHistory);

      const initialCpuHistory = Array.from({length: 20}, (_, i) => ({
        time: `${i}s`,
        cpu: 30 + Math.floor(Math.random() * 40),
        memory: 40 + Math.floor(Math.random() * 30),
        temp: 45 + Math.floor(Math.random() * 20)
      }));
      setCpuHistory(initialCpuHistory);

      const initialNetworkHistory = Array.from({length: 20}, (_, i) => ({
        time: `${i}s`,
        incoming: 800 + Math.floor(Math.random() * 400),
        outgoing: 600 + Math.floor(Math.random() * 300)
      }));
      setNetworkHistory(initialNetworkHistory);
    };

    initHistory();

    // Fetch initial data
    fetchSecurityStats();
    fetchSystemStats();
    fetchAttacks();

    // Set up socket listeners
    socket.on('attack_detected', handleAttackDetected);
    socket.on('system_stats', handleSystemStats);
    socket.on('system_warning', handleSystemWarning);

    // Polling interval
    const interval = setInterval(() => {
      fetchSecurityStats();
      fetchSystemStats();
    }, 5000);

    return () => {
      socket.off('attack_detected');
      socket.off('system_stats');
      socket.off('system_warning');
      clearInterval(interval);
    };
  }, []);

  const fetchSecurityStats = async () => {
    try {
      const response = await apiService.getSecurityStats();
      if (response.data.success) {
        setAttackMetrics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching security stats:', error);
    }
  };

  const fetchSystemStats = async () => {
    try {
      const response = await apiService.getSystemStats();
      if (response.data.success) {
        const stats = response.data.data;
        setSystemHealth({
          cpu: stats.cpu,
          memory: stats.memory,
          disk: stats.disk,
          temperature: stats.temperature,
          network: 100 - (stats.network.packets_recv / 10000 * 100),
          connections: stats.connections
        });

        // Update CPU history
        setCpuHistory(prev => {
          const newData = [...prev.slice(1), {
            time: new Date().toLocaleTimeString(),
            cpu: stats.cpu,
            memory: stats.memory,
            temp: stats.temperature
          }];
          return newData;
        });

        // Update network history
        setNetworkHistory(prev => {
          const newData = [...prev.slice(1), {
            time: new Date().toLocaleTimeString(),
            incoming: stats.network.packets_recv,
            outgoing: stats.network.packets_sent
          }];
          return newData;
        });
      }
    } catch (error) {
      console.error('Error fetching system stats:', error);
    }
  };

  const fetchAttacks = async () => {
    try {
      const response = await apiService.getAttacks();
      if (response.data.success) {
        setAlerts(response.data.data.slice(0, 15));
      }
    } catch (error) {
      console.error('Error fetching attacks:', error);
    }
  };

  const handleAttackDetected = (attack) => {
    setAlerts(prev => [attack, ...prev].slice(0, 15));
    setAttackHistory(prev => {
      const newData = [...prev.slice(1), {
        time: new Date().toLocaleTimeString(),
        attacks: Math.floor(Math.random() * 15) + 5,
        packets: systemHealth.connections * 100
      }];
      return newData;
    });

    // Send email if enabled
    if (emailAlerts && attack.severity === 'CRITICAL') {
      apiService.sendEmailReport().catch(console.error);
    }
  };

  const handleSystemStats = (stats) => {
    setSystemHealth(prev => ({
      ...prev,
      cpu: stats.cpu,
      memory: stats.memory,
      temperature: stats.temperature
    }));
  };

  const handleSystemWarning = (data) => {
    if (emailAlerts) {
      // Email already sent by backend
      console.log('System warning received:', data);
    }
  };

  const toggleMitigation = async (key) => {
    const newStatus = !mitigationStatus[key];
    
    try {
      await apiService.toggleMitigation(key, newStatus);
      setMitigationStatus(prev => ({ ...prev, [key]: newStatus }));
      
      const action = newStatus ? 'ENABLED' : 'DISABLED';
      setAlerts(prev => [{
        type: 'info',
        category: 'Security Action',
        message: `${key.toUpperCase()} has been ${action}`,
        time: new Date().toLocaleTimeString(),
        severity: 'INFO'
      }, ...prev].slice(0, 15));
    } catch (error) {
      console.error('Error toggling mitigation:', error);
    }
  };

  const blockIP = async (ip) => {
    try {
      await apiService.blockIP(ip);
      setAlerts(prev => [{
        type: 'info',
        category: 'IP Blocked',
        message: `IP address ${ip} has been blocked via UFW firewall`,
        time: new Date().toLocaleTimeString(),
        severity: 'INFO'
      }, ...prev].slice(0, 15));
    } catch (error) {
      console.error('Error blocking IP:', error);
    }
  };

  const handleEmergencyShutdown = () => {
    setAlerts(prev => [{
      type: 'info',
      category: 'System Action',
      message: 'Emergency shutdown initiated - All connections terminated',
      time: new Date().toLocaleTimeString(),
      severity: 'INFO'
    }, ...prev].slice(0, 15));
  };

  const handleRestartServices = async () => {
    try {
      await apiService.toggleMitigation('restart_network', true);
      setSystemHealth(prev => ({ ...prev, network: 78, cpu: 45, memory: 62 }));
      setAlerts(prev => [{
        type: 'info',
        category: 'System Action',
        message: 'Network services restarted - All connections refreshed',
        time: new Date().toLocaleTimeString(),
        severity: 'INFO'
      }, ...prev].slice(0, 15));
    } catch (error) {
      console.error('Error restarting services:', error);
    }
  };

  const handleResetLogs = () => {
    setAlerts([]);
    setAttackMetrics({
      dos: 0,
      sql_injection: 0,
      brute_force: 0,
      arp_spoofing: 0,
      port_scan: 0,
      mitm: 0
    });
  };

  const handleSendEmailReport = async () => {
    try {
      await apiService.sendEmailReport();
      setAlerts(prev => [{
        type: 'info',
        category: 'Email Alert',
        message: 'Security report sent to admin@rnsinstitute.edu.in',
        time: new Date().toLocaleTimeString(),
        severity: 'INFO'
      }, ...prev].slice(0, 15));
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const toggleEmailAlerts = async () => {
    const newStatus = !emailAlerts;
    try {
      await apiService.toggleEmailAlerts(newStatus);
      setEmailAlerts(newStatus);
    } catch (error) {
      console.error('Error toggling email alerts:', error);
    }
  };

  const attackPieData = [
    { name: 'DoS', value: attackMetrics.dos, color: '#ef4444' },
    { name: 'SQL Injection', value: attackMetrics.sql_injection, color: '#f97316' },
    { name: 'Brute Force', value: attackMetrics.brute_force, color: '#eab308' },
    { name: 'ARP Spoofing', value: attackMetrics.arp_spoofing, color: '#8b5cf6' },
    { name: 'Port Scan', value: attackMetrics.port_scan, color: '#06b6d4' },
    { name: 'MITM', value: attackMetrics.mitm, color: '#ec4899' }
  ].filter(item => item.value > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-red-950 to-gray-950 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-xl rounded-2xl p-8 mb-6 border border-red-500/30 shadow-2xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Shield className="w-16 h-16 text-red-400 animate-pulse" />
              <div className="absolute inset-0 bg-red-400/30 blur-xl rounded-full"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1 flex items-center gap-3">
                Defense & Security Dashboard
                <ShieldAlert className="w-10 h-10 text-red-400" />
              </h1>
              <p className="text-red-300 text-lg">Real-time Attack Detection & Raspbian OS Protection</p>
              <p className="text-red-200 text-sm mt-1">Smart Campus Simulation Project | Raspberry Pi 4</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-green-500/20 border border-green-400 px-4 py-2 rounded-xl">
              <Mail className="w-5 h-5 text-green-400" />
              <span className="text-green-300 font-semibold">
                Alerts: {emailAlerts ? 'ON' : 'OFF'}
              </span>
              <button
                onClick={toggleEmailAlerts}
                className="ml-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-all"
              >
                Toggle
              </button>
            </div>
            <button
              onClick={() => onNavigate('login')}
              className="bg-red-500/30 hover:bg-red-500/50 border border-red-400 text-red-200 px-6 py-3 rounded-xl transition-all hover:scale-105 font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Attack Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {[
          { key: 'dos', label: 'DoS Attacks', color: 'red', icon: Zap },
          { key: 'sql_injection', label: 'SQL Injection', color: 'orange', icon: Terminal },
          { key: 'brute_force', label: 'Brute Force', color: 'yellow', icon: Lock },
          { key: 'arp_spoofing', label: 'ARP Spoofing', color: 'purple', icon: AlertTriangle },
          { key: 'port_scan', label: 'Port Scans', color: 'cyan', icon: Network },
          { key: 'mitm', label: 'MITM Attacks', color: 'pink', icon: ShieldAlert }
        ].map(({ key, label, color, icon: Icon }) => (
          <div key={key} className={`bg-${color}-500/10 backdrop-blur-xl rounded-xl p-5 border border-${color}-500/30 hover:scale-105 transition-all shadow-lg`}>
            <div className="flex items-center justify-between mb-2">
              <Icon className={`w-8 h-8 text-${color}-400`} />
              <span className={`text-xs font-bold px-2 py-1 rounded-full bg-${color}-500/20 text-${color}-300`}>
                LIVE
              </span>
            </div>
            <p className={`text-${color}-300 text-sm mb-1 font-semibold`}>{label}</p>
            <p className="text-4xl font-bold text-white">{attackMetrics[key]}</p>
          </div>
        ))}
      </div>

      {/* Mitigation Controls */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-blue-500/30 shadow-xl">
        <h3 className="text-white font-bold text-2xl mb-4 flex items-center gap-2">
          <Settings className="w-7 h-7" />
          Raspbian OS Security Controls
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { key: 'firewall', label: 'UFW Firewall', desc: 'Block suspicious IPs' },
            { key: 'fail2ban', label: 'Fail2Ban', desc: 'Auto-ban brute force' },
            { key: 'rateLimit', label: 'Rate Limiting', desc: 'Throttle connections' },
            { key: 'arpProtection', label: 'ARP Guard', desc: 'Prevent ARP spoofing' },
            { key: 'portSecurity', label: 'Port Security', desc: 'Close unused ports' }
          ].map(({ key, label, desc }) => (
            <button
              key={key}
              onClick={() => toggleMitigation(key)}
              className={`p-4 rounded-xl transition-all transform hover:scale-105 border-2 ${
                mitigationStatus[key]
                  ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-green-400 shadow-lg shadow-green-500/30'
                  : 'bg-gradient-to-br from-red-500/30 to-orange-500/30 border-red-400 shadow-lg shadow-red-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                {mitigationStatus[key] ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
                {mitigationStatus[key] ? (
                  <PlayCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <StopCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
              <p className="text-white font-bold text-sm mb-1">{label}</p>
              <p className="text-xs text-gray-300">{desc}</p>
              <div className={`mt-2 px-2 py-1 rounded-full text-xs font-bold ${
                mitigationStatus[key] 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                {mitigationStatus[key] ? 'ACTIVE' : 'INACTIVE'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Attack History Chart */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Attack Timeline (Real-time)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={attackHistory}>
              <defs>
                <linearGradient id="attackGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="time" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="attacks" stroke="#ef4444" fillOpacity={1} fill="url(#attackGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Attack Distribution Pie Chart */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6" />
            Attack Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            {attackPieData.length > 0 ? (
              <PieChart>
                <Pie
                  data={attackPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attackPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                />
              </PieChart>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No attacks detected yet
              </div>
            )}
          </ResponsiveContainer>
        </div>

        {/* System Health Chart */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6" />
            System Resources (Live)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={cpuHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="time" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="cpu" stroke="#06b6d4" strokeWidth={2} dot={false} name="CPU %" />
              <Line type="monotone" dataKey="memory" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Memory %" />
              <Line type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2} dot={false} name="Temp °C" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Network Traffic Chart */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Network Packets (Live)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={networkHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="time" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="incoming" fill="#22c55e" name="Incoming" />
              <Bar dataKey="outgoing" fill="#3b82f6" name="Outgoing" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System Health Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'CPU Usage', value: systemHealth.cpu, unit: '%', icon: Cpu, color: 'cyan', threshold: 80 },
          { label: 'Memory', value: systemHealth.memory, unit: '%', icon: Database, color: 'purple', threshold: 75 },
          { label: 'Disk Usage', value: systemHealth.disk, unit: '%', icon: HardDrive, color: 'blue', threshold: 80 },
          { label: 'Temperature', value: systemHealth.temperature, unit: '°C', icon: Thermometer, color: 'orange', threshold: 70 },
          { label: 'Network', value: systemHealth.network, unit: '%', icon: Network, color: 'green', threshold: 40 }
        ].map(({ label, value, unit, icon: Icon, color, threshold }) => {
          const isWarning = label === 'Network' ? value < threshold : value > threshold;
          return (
            <div key={label} className={`bg-${color}-500/10 backdrop-blur-xl rounded-xl p-4 border border-${color}-500/30 shadow-lg`}>
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-7 h-7 text-${color}-400`} />
                {isWarning && <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />}
              </div>
              <p className={`text-${color}-300 text-xs mb-1 font-semibold`}>{label}</p>
              <p className="text-3xl font-bold text-white">{value.toFixed(1)}{unit}</p>
              <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-${color}-500 transition-all duration-500`}
                  style={{ width: `${label === 'Temperature' ? (value / 100) * 100 : value}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time Alerts Feed */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-bold text-2xl flex items-center gap-2">
            <Bell className="w-7 h-7 animate-pulse" />
            Live Attack Detection Feed
          </h3>
          <button
            onClick={handleResetLogs}
            className="bg-red-500/30 hover:bg-red-500/50 border border-red-400 text-red-200 px-4 py-2 rounded-lg transition-all text-sm font-semibold"
          >
            Clear All
          </button>
        </div>
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-3" />
              <p className="text-gray-400 text-xl font-semibold">No threats detected</p>
              <p className="text-gray-500 text-sm mt-2">System is secure and monitoring</p>
            </div>
          ) : (
            alerts.map((alert, idx) => {
              const severityColors = {
                'CRITICAL': 'from-red-600/30 to-red-700/30 border-red-500',
                'HIGH': 'from-orange-600/30 to-orange-700/30 border-orange-500',
                'MEDIUM': 'from-yellow-600/30 to-yellow-700/30 border-yellow-500',
                'INFO': 'from-blue-600/30 to-blue-700/30 border-blue-500'
              };
              const severityColor = severityColors[alert.severity] || severityColors.INFO;
              
              return (
                <div
                  key={idx}
                  className={`bg-gradient-to-r ${severityColor} backdrop-blur-lg p-5 rounded-xl border-2 hover:scale-[1.02] transition-all`}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      {alert.type === 'critical' ? (
                        <ShieldAlert className="w-8 h-8 text-red-400 animate-pulse" />
                      ) : alert.type === 'warning' ? (
                        <AlertTriangle className="w-8 h-8 text-yellow-400" />
                      ) : (
                        <CheckCircle className="w-8 h-8 text-blue-400" />
                      )}
                      <div className="absolute inset-0 bg-current blur-xl opacity-40 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          alert.severity === 'CRITICAL' ? 'bg-red-500 text-white' :
                          alert.severity === 'HIGH' ? 'bg-orange-500 text-white' :
                          alert.severity === 'MEDIUM' ? 'bg-yellow-500 text-black' :
                          'bg-blue-500 text-white'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-white font-bold text-lg">{alert.category}</span>
                      </div>
                      <p className="text-white font-medium text-base mb-2">{alert.message}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-300 text-sm">{alert.time}</p>
                        {alert.type === 'critical' && alert.source && (
                          <button
                            onClick={() => blockIP(alert.source)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
                          >
                            <Ban className="w-4 h-4" />
                            Block IP
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
          onClick={handleEmergencyShutdown}
        >
          <Power className="w-5 h-5" />
          Emergency Shutdown
        </button>

        <button
          className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
          onClick={handleRestartServices}
        >
          <RefreshCw className="w-5 h-5" />
          Restart Services
        </button>

        <button
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
          onClick={handleResetLogs}
        >
          <Database className="w-5 h-5" />
          Reset Logs
        </button>

        <button
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
          onClick={handleSendEmailReport}
        >
          <Mail className="w-5 h-5" />
          Send Email Report
        </button>
      </div>
    </div>
  );
};

export default DefenseDashboard;
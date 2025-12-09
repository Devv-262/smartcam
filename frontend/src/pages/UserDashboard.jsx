import React, { useState, useEffect } from 'react';
import { Shield, Activity, Wifi, Lock, Building, Thermometer } from 'lucide-react';
import SectorCard from '../components/SectorCard';
import { apiService, socket } from '../services/api';

const UserDashboard = ({ onNavigate }) => {
  const [selectedSector, setSelectedSector] = useState('all');
  const [sectors, setSectors] = useState({
    buildingA: {
      name: 'Building A',
      ip: '192.168.1.101',
      status: 'online',
      esp32: 'ESP32-Node-01',
      sensors: {
        motion: { active: false, value: 0, unit: '', lastUpdate: '2s ago' },
        light: { active: true, value: 75, unit: '%', lastUpdate: '1s ago' },
        temperature: { active: true, value: 24, unit: '°C', lastUpdate: '3s ago' },
        smoke: { active: false, value: 0, unit: 'ppm', lastUpdate: '2s ago' }
      }
    },
    buildingB: {
      name: 'Building B',
      ip: '192.168.1.102',
      status: 'online',
      esp32: 'ESP32-Node-02',
      sensors: {
        motion: { active: true, value: 1, unit: '', lastUpdate: '1s ago' },
        light: { active: false, value: 0, unit: '%', lastUpdate: '4s ago' },
        temperature: { active: true, value: 22, unit: '°C', lastUpdate: '2s ago' },
        smoke: { active: false, value: 0, unit: 'ppm', lastUpdate: '5s ago' }
      }
    },
    parking: {
      name: 'Parking Area',
      ip: '192.168.1.103',
      status: 'online',
      esp32: 'ESP32-Node-03',
      sensors: {
        ultrasonic: { active: true, value: 45, unit: 'cm', lastUpdate: '1s ago' },
        ir: { active: true, value: 1, unit: '', lastUpdate: '2s ago' },
        light: { active: true, value: 80, unit: '%', lastUpdate: '1s ago' },
        gate: { active: false, value: 0, unit: '', lastUpdate: '3s ago' }
      }
    },
    park: {
      name: 'Park Zone',
      ip: '192.168.1.104',
      status: 'online',
      esp32: 'ESP32-Node-04',
      sensors: {
        soilMoisture: { active: true, value: 65, unit: '%', lastUpdate: '2s ago' },
        light: { active: true, value: 100, unit: '%', lastUpdate: '1s ago' },
        sound: { active: false, value: 35, unit: 'dB', lastUpdate: '4s ago' },
        temperature: { active: true, value: 26, unit: '°C', lastUpdate: '2s ago' }
      }
    }
  });

  const sectorColors = {
    buildingA: 'from-blue-500 to-cyan-500',
    buildingB: 'from-purple-500 to-pink-500',
    parking: 'from-orange-500 to-yellow-500',
    park: 'from-green-500 to-emerald-500'
  };

  useEffect(() => {
    // Fetch initial sensor data
    apiService.getSensors()
      .then(response => {
        if (response.data.success) {
          // Update sectors with real data
        }
      })
      .catch(error => console.error('Error fetching sensors:', error));

    // Listen for sensor updates
    socket.on('sensor_update', (data) => {
      setSectors(prev => ({
        ...prev,
        [data.sector]: {
          ...prev[data.sector],
          sensors: {
            ...prev[data.sector].sensors,
            [data.sensor]: data.data
          }
        }
      }));
    });

    return () => {
      socket.off('sensor_update');
    };
  }, []);

  const toggleSensor = async (sectorKey, sensorKey) => {
    const currentState = sectors[sectorKey].sensors[sensorKey].active;
    const action = currentState ? 'off' : 'on';

    try {
      await apiService.controlSensor(sectorKey, sensorKey, action);
      
      setSectors(prev => ({
        ...prev,
        [sectorKey]: {
          ...prev[sectorKey],
          sensors: {
            ...prev[sectorKey].sensors,
            [sensorKey]: {
              ...prev[sectorKey].sensors[sensorKey],
              active: !currentState
            }
          }
        }
      }));
    } catch (error) {
      console.error('Error toggling sensor:', error);
    }
  };

  const filteredSectors = selectedSector === 'all' 
    ? Object.entries(sectors) 
    : [[selectedSector, sectors[selectedSector]]];

  const activeSensors = Object.values(sectors).reduce((acc, sector) => 
    acc + Object.values(sector.sensors).filter(s => s.active).length, 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl p-8 mb-6 border border-cyan-400/30 shadow-2xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Shield className="w-16 h-16 text-cyan-300" />
              <div className="absolute inset-0 bg-cyan-400/30 blur-xl rounded-full"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">Smart Campus Simulation Project</h1>
              <p className="text-cyan-200 text-lg">User Control Dashboard - Real-time IoT Management</p>
              <p className="text-cyan-300 text-sm mt-1">RNS Institute of Technology | Raspberry Pi Control Center</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('login')}
            className="bg-red-500/30 hover:bg-red-500/50 border border-red-400 text-red-200 px-6 py-3 rounded-xl transition-all hover:scale-105 font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* System Status Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-xl p-4 border border-green-400/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-sm mb-1">Active Sensors</p>
              <p className="text-3xl font-bold text-white">{activeSensors}</p>
            </div>
            <Activity className="w-10 h-10 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-xl p-4 border border-blue-400/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm mb-1">Online Nodes</p>
              <p className="text-3xl font-bold text-white">4/4</p>
            </div>
            <Wifi className="w-10 h-10 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl p-4 border border-purple-400/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm mb-1">Network Status</p>
              <p className="text-2xl font-bold text-white">Secured</p>
            </div>
            <Lock className="w-10 h-10 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-xl rounded-xl p-4 border border-orange-400/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-300 text-sm mb-1">Pi Temperature</p>
              <p className="text-3xl font-bold text-white">52°C</p>
            </div>
            <Thermometer className="w-10 h-10 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Sector Filter */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-cyan-400/30">
        <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
          <Building className="w-6 h-6" />
          Select Campus Sector
        </h3>
        <div className="grid grid-cols-5 gap-4">
          <button
            onClick={() => setSelectedSector('all')}
            className={`py-4 px-6 rounded-xl transition-all transform hover:scale-105 font-semibold ${
              selectedSector === 'all'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                : 'bg-white/10 text-cyan-300 hover:bg-white/20 border border-cyan-400/30'
            }`}
          >
            All Sectors
          </button>
          {Object.entries(sectors).map(([key, sector]) => (
            <button
              key={key}
              onClick={() => setSelectedSector(key)}
              className={`py-4 px-6 rounded-xl transition-all transform hover:scale-105 font-semibold ${
                selectedSector === key
                  ? `bg-gradient-to-r ${sectorColors[key]} text-white shadow-lg`
                  : 'bg-white/10 text-cyan-300 hover:bg-white/20 border border-cyan-400/30'
              }`}
            >
              {sector.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sectors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSectors.map(([key, sector]) => (
          <SectorCard
            key={key}
            sectorKey={key}
            sector={sector}
            onToggleSensor={toggleSensor}
            sectorColor={sectorColors[key]}
          />
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
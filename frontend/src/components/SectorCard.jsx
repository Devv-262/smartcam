import React from 'react';
import { Car, Trees, Building, Wifi, Lock, Unlock, Lightbulb, Thermometer, Droplet, Wind, Activity } from 'lucide-react';

const SensorIcon = ({ sensorKey, active }) => {
  const iconClass = active ? 'text-yellow-300' : 'text-gray-500';
  
  if (sensorKey.includes('light')) return <Lightbulb className={`w-8 h-8 ${iconClass}`} />;
  if (sensorKey.includes('temperature')) return <Thermometer className={`w-8 h-8 ${active ? 'text-orange-300' : 'text-gray-500'}`} />;
  if (sensorKey.includes('moisture') || sensorKey.includes('Moisture')) return <Droplet className={`w-8 h-8 ${active ? 'text-blue-300' : 'text-gray-500'}`} />;
  if (sensorKey.includes('smoke')) return <Wind className={`w-8 h-8 ${active ? 'text-red-300' : 'text-gray-500'}`} />;
  return <Activity className={`w-8 h-8 ${active ? 'text-purple-300' : 'text-gray-500'}`} />;
};

const SectorCard = ({ sectorKey, sector, onToggleSensor, sectorColor }) => {
  const getSectorIcon = () => {
    if (sectorKey === 'parking') return <Car className="w-12 h-12 text-orange-300" />;
    if (sectorKey === 'park') return <Trees className="w-12 h-12 text-green-300" />;
    return <Building className="w-12 h-12 text-blue-300" />;
  };

  return (
    <div className={`bg-gradient-to-br ${sectorColor}/20 backdrop-blur-xl rounded-2xl p-6 border ${sectorColor.replace('from-', 'border-').split(' ')[0]}/30 shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02]`}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            {getSectorIcon()}
            <div className="absolute inset-0 bg-current blur-lg opacity-30 rounded-full"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{sector.name}</h2>
            <p className="text-sm text-cyan-200 mt-1">{sector.esp32}</p>
            <p className="text-xs text-cyan-300">{sector.ip}</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
          sector.status === 'online' 
            ? 'bg-green-500/30 border border-green-400 text-green-200' 
            : 'bg-red-500/30 border border-red-400 text-red-200'
        }`}>
          <Wifi className="w-5 h-5" />
          <span className="text-sm font-bold uppercase">{sector.status}</span>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(sector.sensors).map(([sensorKey, sensor]) => (
          <div key={sensorKey} className="bg-black/20 rounded-xl p-5 border border-white/10 hover:border-white/30 transition-all">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative">
                  <SensorIcon sensorKey={sensorKey} active={sensor.active} />
                  {sensor.active && <div className="absolute inset-0 bg-current blur-lg opacity-40 rounded-full"></div>}
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-lg capitalize">
                    {sensorKey.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-2xl font-bold ${sensor.active ? 'text-cyan-300' : 'text-gray-500'}`}>
                      {sensor.value}{sensor.unit}
                    </span>
                    <span className="text-xs text-gray-400">{sensor.lastUpdate}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onToggleSensor(sectorKey, sensorKey)}
                className={`px-6 py-3 rounded-xl transition-all transform hover:scale-110 font-bold flex items-center gap-2 ${
                  sensor.active
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/50'
                    : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-gray-300'
                }`}
              >
                {sensor.active ? (
                  <>
                    <Unlock className="w-5 h-5" />
                    ON
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    OFF
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectorCard;
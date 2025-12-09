import React from 'react';
import { Cpu, Database, HardDrive, Thermometer, Network, AlertTriangle } from 'lucide-react';

const SystemHealth = ({ systemHealth }) => {
  const healthMetrics = [
    { 
      label: 'CPU Usage', 
      value: systemHealth.cpu, 
      unit: '%', 
      icon: Cpu, 
      color: 'cyan', 
      threshold: 80,
      checkType: 'above'
    },
    { 
      label: 'Memory', 
      value: systemHealth.memory, 
      unit: '%', 
      icon: Database, 
      color: 'purple', 
      threshold: 75,
      checkType: 'above'
    },
    { 
      label: 'Disk Usage', 
      value: systemHealth.disk, 
      unit: '%', 
      icon: HardDrive, 
      color: 'blue', 
      threshold: 80,
      checkType: 'above'
    },
    { 
      label: 'Temperature', 
      value: systemHealth.temperature, 
      unit: '°C', 
      icon: Thermometer, 
      color: 'orange', 
      threshold: 70,
      checkType: 'above'
    },
    { 
      label: 'Network', 
      value: systemHealth.network, 
      unit: '%', 
      icon: Network, 
      color: 'green', 
      threshold: 40,
      checkType: 'below'
    }
  ];

  const isWarning = (value, threshold, checkType) => {
    return checkType === 'above' ? value > threshold : value < threshold;
  };

  const getStatusColor = (value, threshold, checkType) => {
    if (isWarning(value, threshold, checkType)) {
      return 'text-red-400 animate-pulse';
    }
    return 'text-green-400';
  };

  const getProgressBarColor = (color, value, threshold, checkType) => {
    if (isWarning(value, threshold, checkType)) {
      return 'bg-red-500';
    }
    return `bg-${color}-500`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {healthMetrics.map(({ label, value, unit, icon: Icon, color, threshold, checkType }) => {
        const warning = isWarning(value, threshold, checkType);
        
        return (
          <div 
            key={label} 
            className={`bg-${color}-500/10 backdrop-blur-xl rounded-xl p-4 border border-${color}-500/30 shadow-lg hover:scale-105 transition-all`}
          >
            {/* Header with Icon and Warning */}
            <div className="flex items-center justify-between mb-2">
              <Icon className={`w-7 h-7 text-${color}-400`} />
              {warning && (
                <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
              )}
            </div>

            {/* Label */}
            <p className={`text-${color}-300 text-xs mb-1 font-semibold`}>
              {label}
            </p>

            {/* Value */}
            <p className={`text-3xl font-bold ${getStatusColor(value, threshold, checkType)}`}>
              {value.toFixed(1)}{unit}
            </p>

            {/* Progress Bar */}
            <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getProgressBarColor(color, value, threshold, checkType)} transition-all duration-500`}
                style={{ 
                  width: `${label === 'Temperature' ? (value / 100) * 100 : value}%` 
                }}
              ></div>
            </div>

            {/* Warning Message */}
            {warning && (
              <p className="text-red-400 text-xs mt-2 font-semibold">
                {checkType === 'above' ? '⚠️ High' : '⚠️ Low'}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SystemHealth;
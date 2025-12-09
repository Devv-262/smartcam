import React from 'react';
import { Zap, Terminal, Lock, AlertTriangle, Network, ShieldAlert } from 'lucide-react';

const AttackMetrics = ({ attackMetrics }) => {
  const metrics = [
    { 
      key: 'dos', 
      label: 'DoS Attacks', 
      color: 'red', 
      icon: Zap,
      gradient: 'from-red-500 to-red-600'
    },
    { 
      key: 'sql_injection', 
      label: 'SQL Injection', 
      color: 'orange', 
      icon: Terminal,
      gradient: 'from-orange-500 to-orange-600'
    },
    { 
      key: 'brute_force', 
      label: 'Brute Force', 
      color: 'yellow', 
      icon: Lock,
      gradient: 'from-yellow-500 to-yellow-600'
    },
    { 
      key: 'arp_spoofing', 
      label: 'ARP Spoofing', 
      color: 'purple', 
      icon: AlertTriangle,
      gradient: 'from-purple-500 to-purple-600'
    },
    { 
      key: 'port_scan', 
      label: 'Port Scans', 
      color: 'cyan', 
      icon: Network,
      gradient: 'from-cyan-500 to-cyan-600'
    },
    { 
      key: 'mitm', 
      label: 'MITM Attacks', 
      color: 'pink', 
      icon: ShieldAlert,
      gradient: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {metrics.map(({ key, label, color, icon: Icon, gradient }) => {
        const count = attackMetrics[key] || 0;
        const isActive = count > 0;
        
        return (
          <div 
            key={key} 
            className={`bg-${color}-500/10 backdrop-blur-xl rounded-xl p-5 border border-${color}-500/30 hover:scale-105 transition-all shadow-lg ${
              isActive ? 'animate-pulse-slow' : ''
            }`}
          >
            {/* Header with Icon and Badge */}
            <div className="flex items-center justify-between mb-2">
              <div className="relative">
                <Icon className={`w-8 h-8 text-${color}-400`} />
                {isActive && (
                  <div className="absolute inset-0 bg-current blur-lg opacity-30 rounded-full animate-pulse"></div>
                )}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full bg-${color}-500/20 text-${color}-300`}>
                LIVE
              </span>
            </div>

            {/* Label */}
            <p className={`text-${color}-300 text-sm mb-1 font-semibold`}>
              {label}
            </p>

            {/* Count */}
            <div className="flex items-baseline gap-1">
              <p className={`text-4xl font-bold text-white ${isActive ? 'animate-pulse' : ''}`}>
                {count}
              </p>
              {isActive && (
                <span className="text-red-400 text-xs font-bold animate-bounce">
                  🔴
                </span>
              )}
            </div>

            {/* Status Bar */}
            <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${gradient} transition-all duration-500 ${
                  isActive ? 'animate-pulse' : ''
                }`}
                style={{ 
                  width: isActive ? '100%' : '0%',
                  transition: 'width 0.5s ease-in-out'
                }}
              ></div>
            </div>

            {/* Threat Level Indicator */}
            {count > 10 && (
              <div className="mt-2 flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                <span className="text-red-400 text-xs font-bold">HIGH ALERT</span>
              </div>
            )}
          </div>
        );
      })}

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default AttackMetrics;
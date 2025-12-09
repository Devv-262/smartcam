import React from 'react';
import { Settings, CheckCircle, XCircle, PlayCircle, StopCircle } from 'lucide-react';

const MitigationControls = ({ mitigationStatus, onToggleMitigation }) => {
  const mitigationOptions = [
    { 
      key: 'firewall', 
      label: 'UFW Firewall', 
      desc: 'Block suspicious IPs',
      icon: '🛡️'
    },
    { 
      key: 'fail2ban', 
      label: 'Fail2Ban', 
      desc: 'Auto-ban brute force',
      icon: '🔒'
    },
    { 
      key: 'rateLimit', 
      label: 'Rate Limiting', 
      desc: 'Throttle connections',
      icon: '⏱️'
    },
    { 
      key: 'arpProtection', 
      label: 'ARP Guard', 
      desc: 'Prevent ARP spoofing',
      icon: '🔐'
    },
    { 
      key: 'portSecurity', 
      label: 'Port Security', 
      desc: 'Close unused ports',
      icon: '🚪'
    }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-blue-500/30 shadow-xl">
      <h3 className="text-white font-bold text-2xl mb-4 flex items-center gap-2">
        <Settings className="w-7 h-7" />
        Raspbian OS Security Controls
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {mitigationOptions.map(({ key, label, desc, icon }) => {
          const isActive = mitigationStatus[key];
          
          return (
            <button
              key={key}
              onClick={() => onToggleMitigation(key)}
              className={`p-4 rounded-xl transition-all transform hover:scale-105 border-2 ${
                isActive
                  ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-green-400 shadow-lg shadow-green-500/30'
                  : 'bg-gradient-to-br from-red-500/30 to-orange-500/30 border-red-400 shadow-lg shadow-red-500/30'
              }`}
            >
              {/* Icon and Status Row */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{icon}</span>
                <div className="flex items-center gap-1">
                  {isActive ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <PlayCircle className="w-5 h-5 text-green-400" />
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-red-400" />
                      <StopCircle className="w-5 h-5 text-red-400" />
                    </>
                  )}
                </div>
              </div>

              {/* Label */}
              <p className="text-white font-bold text-sm mb-1">{label}</p>
              
              {/* Description */}
              <p className="text-xs text-gray-300 mb-3">{desc}</p>
              
              {/* Status Badge */}
              <div className={`mt-2 px-2 py-1 rounded-full text-xs font-bold ${
                isActive 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                {isActive ? 'ACTIVE' : 'INACTIVE'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Info Panel */}
      <div className="mt-4 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
        <p className="text-blue-200 text-sm flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <span className="font-semibold">Tip:</span> 
          Enable all security controls for maximum protection. UFW Firewall and Fail2Ban are recommended for production.
        </p>
      </div>
    </div>
  );
};

export default MitigationControls;
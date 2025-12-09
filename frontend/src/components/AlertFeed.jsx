import React from 'react';
import { Bell, ShieldAlert, AlertTriangle, CheckCircle, Ban } from 'lucide-react';

const AlertFeed = ({ alerts, onClearAll, onBlockIP }) => {
  const severityColors = {
    'CRITICAL': 'from-red-600/30 to-red-700/30 border-red-500',
    'HIGH': 'from-orange-600/30 to-orange-700/30 border-orange-500',
    'MEDIUM': 'from-yellow-600/30 to-yellow-700/30 border-yellow-500',
    'INFO': 'from-blue-600/30 to-blue-700/30 border-blue-500'
  };

  const getAlertIcon = (type) => {
    switch(type) {
      case 'critical':
        return <ShieldAlert className="w-8 h-8 text-red-400 animate-pulse" />;
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-yellow-400" />;
      default:
        return <CheckCircle className="w-8 h-8 text-blue-400" />;
    }
  };

  const getSeverityBadgeColor = (severity) => {
    switch(severity) {
      case 'CRITICAL':
        return 'bg-red-500 text-white';
      case 'HIGH':
        return 'bg-orange-500 text-white';
      case 'MEDIUM':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold text-2xl flex items-center gap-2">
          <Bell className="w-7 h-7 animate-pulse" />
          Live Attack Detection Feed
        </h3>
        <button
          onClick={onClearAll}
          className="bg-red-500/30 hover:bg-red-500/50 border border-red-400 text-red-200 px-4 py-2 rounded-lg transition-all text-sm font-semibold"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-3" />
            <p className="text-gray-400 text-xl font-semibold">No threats detected</p>
            <p className="text-gray-500 text-sm mt-2">System is secure and monitoring</p>
          </div>
        ) : (
          alerts.map((alert, idx) => {
            const severityColor = severityColors[alert.severity] || severityColors.INFO;
            
            return (
              <div
                key={idx}
                className={`bg-gradient-to-r ${severityColor} backdrop-blur-lg p-5 rounded-xl border-2 hover:scale-[1.02] transition-all`}
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    {getAlertIcon(alert.type)}
                    <div className="absolute inset-0 bg-current blur-xl opacity-40 rounded-full"></div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityBadgeColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className="text-white font-bold text-lg">{alert.category}</span>
                    </div>

                    <p className="text-white font-medium text-base mb-2">{alert.message}</p>

                    <div className="flex items-center justify-between">
                      <p className="text-gray-300 text-sm">{alert.time}</p>
                      
                      {alert.type === 'critical' && alert.source && (
                        <button
                          onClick={() => onBlockIP(alert.source)}
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

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default AlertFeed;
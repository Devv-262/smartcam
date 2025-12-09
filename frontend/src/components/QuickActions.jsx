import React from 'react';
import { Power, RefreshCw, Database, Mail } from 'lucide-react';

const QuickActions = ({ 
  onEmergencyShutdown, 
  onRestartServices, 
  onResetLogs, 
  onSendEmailReport 
}) => {
  const actions = [
    {
      label: 'Emergency Shutdown',
      icon: Power,
      onClick: onEmergencyShutdown,
      gradient: 'from-red-600 to-red-700',
      hoverGradient: 'hover:from-red-700 hover:to-red-800',
      description: 'Terminate all connections'
    },
    {
      label: 'Restart Services',
      icon: RefreshCw,
      onClick: onRestartServices,
      gradient: 'from-orange-600 to-orange-700',
      hoverGradient: 'hover:from-orange-700 hover:to-orange-800',
      description: 'Refresh network services'
    },
    {
      label: 'Reset Logs',
      icon: Database,
      onClick: onResetLogs,
      gradient: 'from-purple-600 to-purple-700',
      hoverGradient: 'hover:from-purple-700 hover:to-purple-800',
      description: 'Clear all attack logs'
    },
    {
      label: 'Send Email Report',
      icon: Mail,
      onClick: onSendEmailReport,
      gradient: 'from-green-600 to-green-700',
      hoverGradient: 'hover:from-green-700 hover:to-green-800',
      description: 'Email security summary'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map(({ label, icon: Icon, onClick, gradient, hoverGradient, description }) => (
        <button
          key={label}
          onClick={onClick}
          className={`bg-gradient-to-r ${gradient} ${hoverGradient} text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 flex flex-col items-center justify-center gap-2 shadow-lg hover:shadow-2xl group`}
        >
          <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="text-sm">{label}</span>
          <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">
            {description}
          </span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
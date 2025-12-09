import React from 'react';
import { Shield, Eye, ShieldAlert, Activity, Server, Wifi } from 'lucide-react';

const Login = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.8),rgba(0,0,0,0.9))]"></div>
      
      <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-12 max-w-2xl w-full border border-gray-700 shadow-2xl">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Shield className="w-24 h-24 text-cyan-400 animate-pulse" />
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full"></div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-3">
            Smart Campus
          </h1>
          <h2 className="text-2xl text-gray-300 mb-2">Simulation Project</h2>
          <p className="text-cyan-400 text-sm">Advanced IoT Security Control System</p>
          
          <div className="mt-4 text-gray-500 text-xs">
            <p>RNS Institute of Technology</p>
            <p className="mt-1">Raspberry Pi 4 Control Center</p>
          </div>
        </div>
        
        <div className="space-y-5">
          <button
            onClick={() => onNavigate('user')}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-5 rounded-xl transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50 flex items-center justify-center gap-3 text-lg"
          >
            <Eye className="w-6 h-6" />
            User Control Dashboard
            <Activity className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => onNavigate('defense')}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-5 rounded-xl transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/50 flex items-center justify-center gap-3 text-lg"
          >
            <Shield className="w-6 h-6" />
            Defense & Security Dashboard
            <ShieldAlert className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-700 flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            <span>192.168.1.1</span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-green-400">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
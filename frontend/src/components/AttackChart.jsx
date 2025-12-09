import React from 'react';
import { BarChart3, Activity, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const AttackCharts = ({ attackHistory, attackPieData, cpuHistory, networkHistory }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Attack Timeline Chart */}
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
            <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 12 }} />
            <YAxis stroke="#888" tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151', 
                borderRadius: '8px',
                color: '#fff'
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Area 
              type="monotone" 
              dataKey="attacks" 
              stroke="#ef4444" 
              fillOpacity={1} 
              fill="url(#attackGradient)"
              name="Attacks"
            />
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
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </PieChart>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Activity className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400">No attacks detected yet</p>
              </div>
            </div>
          )}
        </ResponsiveContainer>
      </div>

      {/* System Resources Chart */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
        <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
          <Activity className="w-6 h-6" />
          System Resources (Live)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={cpuHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 12 }} />
            <YAxis stroke="#888" tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151', 
                borderRadius: '8px',
                color: '#fff'
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="cpu" 
              stroke="#06b6d4" 
              strokeWidth={2} 
              dot={false} 
              name="CPU %"
            />
            <Line 
              type="monotone" 
              dataKey="memory" 
              stroke="#8b5cf6" 
              strokeWidth={2} 
              dot={false} 
              name="Memory %"
            />
            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke="#f97316" 
              strokeWidth={2} 
              dot={false} 
              name="Temp °C"
            />
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
            <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 12 }} />
            <YAxis stroke="#888" tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151', 
                borderRadius: '8px',
                color: '#fff'
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Bar dataKey="incoming" fill="#22c55e" name="Incoming" />
            <Bar dataKey="outgoing" fill="#3b82f6" name="Outgoing" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttackCharts;
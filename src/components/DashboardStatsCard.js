import React from 'react';

const DashboardStatsCard = ({ title, value, icon, trend, color }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md border-t-4 ${color}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm ${trend.isUp ? 'text-green-500' : 'text-red-500'}`}>
            {trend.value} {trend.isUp ? '↑' : '↓'}
          </span>
          <span className="text-gray-500 text-sm ml-2">vs último mes</span>
        </div>
      )}
    </div>
  );
};

export default DashboardStatsCard;
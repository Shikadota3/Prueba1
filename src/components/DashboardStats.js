import React from 'react';
import { patientsData } from '../mock/patients';
import { appointmentsData } from '../mock/appointments';

const DashboardStats = () => {
  const stats = [
    {
      title: 'Niños Registrados',
      value: patientsData.length,
      icon: '👶',
      color: 'border-blue-500'
    },
    {
      title: 'Próximas Citas',
      value: appointmentsData.filter(a => a.status === 'pending').length,
      icon: '📅',
      color: 'border-yellow-500'
    },
    {
      title: 'Casos Anemia',
      value: patientsData.filter(p => p.hemoglobin < 11).length,
      icon: '🩸',
      color: 'border-red-500'
    },
    {
      title: 'Controles Realizados',
      value: patientsData.length * 3, // Ejemplo
      icon: '📝',
      color: 'border-green-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className={`bg-white p-6 rounded-lg shadow-md border-t-4 ${stat.color}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
            </div>
            <div className="text-3xl">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;

// DONE
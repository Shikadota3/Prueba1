import React, { useState, useEffect } from 'react';
import { getFromLocalStorage } from '../utils/storage';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    upcomingAppointments: 0,
    anemiaCases: 0,
    completedControls: 0
  });

  useEffect(() => {
    const storedUsers = getFromLocalStorage('users') || [];
    const storedPatients = getFromLocalStorage('patients') || [];
    const storedAppointments = getFromLocalStorage('appointments') || [];
    
    setUsers(storedUsers);
    setStats({
      totalPatients: storedPatients.length,
      upcomingAppointments: storedAppointments.filter(a => a.status === 'pending').length,
      anemiaCases: storedPatients.filter(p => p.hemoglobin < 11).length,
      completedControls: storedPatients.filter(p => p.hemoglobin).length
    });
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Gestión de Usuarios</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-sm text-blue-800">Niños Registrados</h3>
          <p className="text-2xl font-bold">{stats.totalPatients}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <h3 className="text-sm text-yellow-800">Próximas Citas</h3>
          <p className="text-2xl font-bold">{stats.upcomingAppointments}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <h3 className="text-sm text-red-800">Casos Anemia</h3>
          <p className="text-2xl font-bold">{stats.anemiaCases}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="text-sm text-green-800">Controles Realizados</h3>
          <p className="text-2xl font-bold">{stats.completedControls}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.email}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(user.registeredAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
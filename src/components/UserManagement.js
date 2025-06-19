import React, { useState, useEffect } from 'react';
import { getPacientes, getCitas } from '../utils/database';

const UserManagement = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    upcomingAppointments: 0,
    anemiaCases: 0,
    completedControls: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [pacientes, citas] = await Promise.all([
          getPacientes(),
          getCitas()
        ]);

        setStats({
          totalPatients: pacientes.length,
          upcomingAppointments: citas.filter(c => c.estado === 'pendiente').length,
          anemiaCases: pacientes.filter(p => p.hemoglobina < 11 || p.diagnostico?.toLowerCase().includes('anemia')).length,
          completedControls: pacientes.filter(p => p.diagnostico).length
        });
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Estadísticas de Salud</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-sm text-blue-800 font-medium">Niños Registrados</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalPatients}</p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <h3 className="text-sm text-yellow-800 font-medium">Próximas Citas</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.upcomingAppointments}</p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <h3 className="text-sm text-red-800 font-medium">Casos de Anemia</h3>
          <p className="text-2xl font-bold text-red-600">{stats.anemiaCases}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="text-sm text-green-800 font-medium">Controles Realizados</h3>
          <p className="text-2xl font-bold text-green-600">{stats.completedControls}</p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-3">Indicadores Clave</h3>
        <div className="space-y-2">
          <div>
            <span className="text-sm text-gray-600">Tasa de anemia: </span>
            <span className="font-medium">
              {stats.totalPatients > 0 
                ? ((stats.anemiaCases / stats.totalPatients) * 100).toFixed(1) 
                : 0}%
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-600">Citas pendientes: </span>
            <span className="font-medium">{stats.upcomingAppointments}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
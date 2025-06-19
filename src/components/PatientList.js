import React, { useState, useEffect } from 'react';
import { getPacientes } from '../utils/database';

const PatientList = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getPacientes();
        setPacientes(data);
      } catch (error) {
        console.error('Error cargando pacientes:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="p-4 text-center">Cargando...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Lista de Pacientes</h2>
      <div className="space-y-2">
        {pacientes.length === 0 ? (
          <p className="text-gray-500">No hay pacientes registrados</p>
        ) : (
          pacientes.map((paciente) => (
            <div key={paciente.id} className="p-3 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold">{paciente.nombre}</h3>
              <p className="text-sm">Edad: {paciente.edad} años</p>
              {paciente.diagnostico && (
                <p className="text-sm text-gray-600">Diagnóstico: {paciente.diagnostico}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientList;
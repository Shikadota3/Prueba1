import React, { useState } from 'react';
import { addPaciente } from '../utils/database';

const PatientRecordForm = () => {
  const [form, setForm] = useState({
    nombre: '',
    edad: '',
    hemoglobina: '',
    diagnostico: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.nombre || !form.edad) {
        alert('Nombre y edad son obligatorios');
        return;
      }

      await addPaciente({
        nombre: form.nombre,
        edad: parseInt(form.edad),
        hemoglobina: parseFloat(form.hemoglobina) || null,
        diagnostico: form.diagnostico
      });

      alert('Paciente registrado exitosamente');
      setForm({
        nombre: '',
        edad: '',
        hemoglobina: '',
        diagnostico: ''
      });
    } catch (error) {
      console.error('Error registrando paciente:', error);
      alert('Error al registrar paciente');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Registro de Paciente</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Nombre Completo *</label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => setForm({...form, nombre: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Edad (años) *</label>
            <input
              type="number"
              min="0"
              max="18"
              value={form.edad}
              onChange={(e) => setForm({...form, edad: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Nivel de Hemoglobina (g/dL)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={form.hemoglobina}
              onChange={(e) => setForm({...form, hemoglobina: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Diagnóstico Inicial</label>
          <textarea
            value={form.diagnostico}
            onChange={(e) => setForm({...form, diagnostico: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Ej: Anemia leve, control de crecimiento..."
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
          >
            Registrar Paciente
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientRecordForm;
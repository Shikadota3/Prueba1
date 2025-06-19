import React, { useState, useEffect } from 'react';
import { getPacientes, addCita, getCitas } from '../utils/database';

const AppointmentManagement = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    date: '',
    time: '10:00',
    reason: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pacientes, citas] = await Promise.all([
          getPacientes(),
          getCitas()
        ]);
        setPatients(pacientes);
        setAppointments(citas);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    loadData();
  }, []);

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      if (!newAppointment.patientId || !newAppointment.date) {
        alert('Debe seleccionar paciente y fecha');
        return;
      }

      await addCita(newAppointment);
      const updatedAppointments = await getCitas();
      setAppointments(updatedAppointments);
      setNewAppointment({
        patientId: '',
        date: '',
        time: '10:00',
        reason: ''
      });
      alert('Cita registrada exitosamente');
    } catch (error) {
      console.error('Error agregando cita:', error);
      alert('Error al registrar cita');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Gestión de Citas</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Agendar Nueva Cita</h3>
        <form onSubmit={handleAddAppointment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Paciente *</label>
            <select
              value={newAppointment.patientId}
              onChange={(e) => setNewAppointment({...newAppointment, patientId: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccionar paciente</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.nombre} ({patient.edad} años)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Fecha *</label>
            <input
              type="date"
              value={newAppointment.date}
              onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Hora *</label>
            <input
              type="time"
              value={newAppointment.time}
              onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Motivo</label>
            <input
              type="text"
              value={newAppointment.reason}
              onChange={(e) => setNewAppointment({...newAppointment, reason: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Control de anemia"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              Agendar Cita
            </button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Citas Programadas</h3>
        {appointments.length === 0 ? (
          <p className="text-gray-500">No hay citas programadas</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map(appointment => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{appointment.paciente_nombre || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(appointment.fecha).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{appointment.hora}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{appointment.motivo || 'Control'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentManagement;
import React, { useState, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/storage';

const AppointmentManagement = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    patientName: '',
    document: '',
    date: '',
    time: '10:00',
    reason: ''
  });

  useEffect(() => {
    const storedPatients = getFromLocalStorage('patients') || [];
    const storedAppointments = getFromLocalStorage('appointments') || [];
    setPatients(storedPatients);
    setAppointments(storedAppointments);
  }, []);

  const handlePatientSelect = (patientId) => {
    const selectedPatient = patients.find(p => p.id === patientId);
    if (selectedPatient) {
      setNewAppointment({
        ...newAppointment,
        patientId: selectedPatient.id,
        patientName: selectedPatient.fullName,
        document: selectedPatient.document
      });
    }
  };

  const handleAddAppointment = (e) => {
    e.preventDefault();
    const newId = Math.max(...appointments.map(a => a.id), 0) + 1;
    const updatedAppointments = [
      ...appointments,
      {
        ...newAppointment,
        id: newId,
        status: 'pending',
        createdBy: getFromLocalStorage('currentUser')?.email || 'Sistema'
      }
    ];
    
    saveToLocalStorage('appointments', updatedAppointments);
    setAppointments(updatedAppointments);
    setNewAppointment({
      patientId: '',
      patientName: '',
      document: '',
      date: '',
      time: '10:00',
      reason: ''
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Gestión de Citas</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Agendar Nueva Cita</h3>
        <form onSubmit={handleAddAppointment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Paciente</label>
            <select
              value={newAppointment.patientId}
              onChange={(e) => handlePatientSelect(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccionar paciente</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.fullName} ({patient.document})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Documento</label>
            <input
              type="text"
              name="document"
              value={newAppointment.document}
              readOnly
              className="w-full px-4 py-2 border rounded-lg bg-gray-100"
            />
          </div>
          {/* ... (resto del formulario se mantiene igual) ... */}
        </form>
      </div>

      {/* ... (resto del componente se mantiene igual) ... */}
    </div>
  );
};

export default AppointmentManagement;
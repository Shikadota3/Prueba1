import React, { useState, useEffect } from 'react';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/storage';

const PatientRecordForm = ({ patient = {} }) => {
  const [patients, setPatients] = useState(getFromLocalStorage('patients') || []);
  const [formData, setFormData] = useState({
    id: patient.id || Date.now(),
    fullName: patient.fullName || '',
    document: patient.document || '',
    weight: '',
    height: '',
    hemoglobin: '',
    date: new Date().toISOString().split('T')[0],
    observations: '',
    registeredBy: getFromLocalStorage('currentUser')?.email || 'Sistema'
  });

  useEffect(() => {
    const storedPatients = getFromLocalStorage('patients') || [];
    setPatients(storedPatients);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedPatients = patients.some(p => p.id === formData.id)
      ? patients.map(p => p.id === formData.id ? formData : p)
      : [...patients, formData];
    
    saveToLocalStorage('patients', updatedPatients);
    setPatients(updatedPatients);
    alert('Paciente guardado exitosamente');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* ... (resto del formulario se mantiene igual) ... */}
    </div>
  );
};

export default PatientRecordForm;
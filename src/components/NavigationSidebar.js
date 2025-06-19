import React from 'react';

const NavigationSidebar = ({ currentView, setCurrentView, userRole, onLogout }) => {
  const menuItems = [
    { view: 'dashboard', label: 'Dashboard', roles: ['administracion', 'doctor', 'cuidador'] },
    { view: 'patients', label: 'Pacientes', roles: ['administracion', 'doctor', 'cuidador'] },
    { view: 'records', label: 'Registros', roles: ['administracion', 'doctor'] },
    { view: 'appointments', label: 'Citas', roles: ['administracion', 'doctor'] },
    { view: 'education', label: 'Material Educativo', roles: ['administracion', 'doctor', 'cuidador'] },
    { view: 'users', label: 'Usuarios', roles: ['administracion'] },
  ];

  return (
    <div className="w-64 bg-blue-800 text-white p-4 min-h-screen">
      <div className="mb-8 p-2 border-b border-blue-700">
        <h2 className="text-xl font-bold">Vidawasi</h2>
        <p className="text-sm text-blue-200">Gestión de Salud Infantil</p>
      </div>

      <nav className="space-y-1">
        {menuItems
          .filter(item => item.roles.includes(userRole))
          .map(item => (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                currentView === item.view
                  ? 'bg-blue-600 font-medium'
                  : 'hover:bg-blue-700'
              }`}
            >
              {item.label}
            </button>
          ))}
      </nav>

      <div className="mt-8 pt-4 border-t border-blue-700">
        <button
          onClick={onLogout}
          className="w-full text-left px-4 py-2 text-red-300 hover:bg-blue-700 rounded-lg transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default NavigationSidebar;
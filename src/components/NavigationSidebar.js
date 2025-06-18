import React from 'react';

const NavigationSidebar = ({ currentView, setCurrentView, userRole, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', roles: ['admin', 'professional', 'caregiver'] },
    { id: 'patients', label: 'Pacientes', icon: '👶', roles: ['admin', 'professional'] },
    { id: 'records', label: 'Registros', icon: '📝', roles: ['admin', 'professional'] },
    { id: 'appointments', label: 'Citas', icon: '📅', roles: ['admin', 'professional'] },
    { id: 'education', label: 'Educación', icon: '📚', roles: ['admin', 'professional', 'caregiver'] },
    { id: 'reports', label: 'Reportes', icon: '📈', roles: ['admin'] },
    { id: 'users', label: 'Usuarios', icon: '👥', roles: ['admin'] },
  ];

  return (
    <div className="w-64 bg-white shadow-md h-screen sticky top-0">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">GSI</h2>
        <p className="text-sm text-gray-500">Gestor de Salud Infantil</p>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems
            .filter(item => item.roles.includes(userRole))
            .map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${currentView === item.id ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
        </ul>
      </nav>
      <div className="p-4 border-t absolute bottom-0 w-full">
        <button
          onClick={onLogout}
          className="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 text-red-500"
        >
          <span className="mr-3 text-lg">🚪</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default NavigationSidebar;
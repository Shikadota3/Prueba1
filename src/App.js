import React, { useState, useEffect } from 'react';
import { saveToLocalStorage, getFromLocalStorage } from './utils/storage';
import AuthLoginForm from './components/AuthLoginForm';
import AuthRegisterForm from './components/AuthRegisterForm';
import PatientList from './components/PatientList';
import PatientRecordForm from './components/PatientRecordForm';
import AppointmentManagement from './components/AppointmentManagement';
import EducationalMaterials from './components/EducationalMaterials';
import NavigationSidebar from './components/NavigationSidebar';
import DashboardStats from './components/DashboardStats';
import UserManagement from './components/UserManagement';

const App = () => {
  const [currentView, setCurrentView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Inicializar datos demo si no existen
    if (!getFromLocalStorage('users')) {
      const initialUsers = [
        {
          name: 'Admin Principal',
          email: 'admin@gsi.com',
          password: 'admin123',
          role: 'admin',
          registeredAt: new Date().toISOString()
        },
        {
          name: 'Dra. María López',
          email: 'maria@gsi.com',
          password: 'doctor123',
          role: 'professional',
          registeredAt: new Date().toISOString()
        }
      ];
      saveToLocalStorage('users', initialUsers);
    }

    // Verificar si hay usuario logueado
    const loggedUser = getFromLocalStorage('currentUser');
    if (loggedUser) {
      setIsAuthenticated(true);
      setUserRole(loggedUser.role);
      setCurrentUser(loggedUser);
      setCurrentView('dashboard');
    }
  }, []);

  const handleLogin = (email, password) => {
    const users = getFromLocalStorage('users') || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setIsAuthenticated(true);
      setUserRole(user.role);
      setCurrentUser(user);
      saveToLocalStorage('currentUser', user);
      setCurrentView('dashboard');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const handleRegister = (userData) => {
    const users = getFromLocalStorage('users') || [];
    const userExists = users.some(u => u.email === userData.email);
    
    if (userExists) {
      alert('El usuario ya existe');
      return;
    }

    const newUser = {
      ...userData,
      registeredAt: new Date().toISOString()
    };
    
    const updatedUsers = [...users, newUser];
    saveToLocalStorage('users', updatedUsers);
    
    // Autologin después de registro
    handleLogin(newUser.email, newUser.password);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentView('login');
  };

  const renderView = () => {
    switch(currentView) {
      case 'patients': return <PatientList />;
      case 'records': return <PatientRecordForm />;
      case 'appointments': return <AppointmentManagement />;
      case 'education': return <EducationalMaterials />;
      case 'users': return <UserManagement />;
      case 'dashboard': 
      default: return <DashboardStats />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!isAuthenticated ? (
        <div className="flex items-center justify-center min-h-screen p-4">
          {showRegister ? (
            <AuthRegisterForm 
              onRegister={handleRegister} 
              onShowLogin={() => setShowRegister(false)} 
            />
          ) : (
            <AuthLoginForm 
              onLogin={handleLogin} 
              onShowRegister={() => setShowRegister(true)} 
            />
          )}
        </div>
      ) : (
        <div className="flex">
          <NavigationSidebar 
            currentView={currentView}
            setCurrentView={setCurrentView}
            userRole={userRole}
            onLogout={handleLogout}
          />
          <div className="flex-1 p-6">
            {renderView()}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
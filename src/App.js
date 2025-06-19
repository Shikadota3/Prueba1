import React, { useState, useEffect } from 'react';
import { initDB, loginUser, registerUser, getCurrentUser, logoutUser } from './utils/database';
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
  const [appInitialized, setAppInitialized] = useState(false);

  // Inicialización de la aplicación
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initDB();
        const user = await getCurrentUser();
        
        if (user) {
          setIsAuthenticated(true);
          setUserRole(user.rol);
          setCurrentUser(user);
          setCurrentView('dashboard');
        }
        
        setAppInitialized(true);
      } catch (error) {
        console.error('Error inicializando app:', error);
        alert('Error al iniciar la aplicación');
      }
    };
    
    initializeApp();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const user = await loginUser(email, password);
      if (user) {
        setIsAuthenticated(true);
        setUserRole(user.rol);
        setCurrentUser(user);
        setCurrentView('dashboard');
      } else {
        throw new Error('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const handleRegister = async (userData) => {
    try {
      await registerUser(userData);
      alert('¡Registro exitoso! Por favor inicia sesión');
      setShowRegister(false);
      return true;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsAuthenticated(false);
      setUserRole(null);
      setCurrentUser(null);
      setCurrentView('login');
      setShowRegister(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const renderView = () => {
    switch(currentView) {
      case 'patients':
        return <PatientList mode={userRole === 'cuidador' ? 'view' : 'edit'} />;
      case 'records':
        return <PatientRecordForm />;
      case 'appointments':
        return <AppointmentManagement userRole={userRole} />;
      case 'education':
        return <EducationalMaterials />;
      case 'users':
        return userRole === 'administracion' ? <UserManagement /> : 
          <div className="p-4 text-red-500">Acceso no autorizado</div>;
      case 'dashboard':
      default:
        return <DashboardStats userRole={userRole} />;
    }
  };

  if (!appInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {!isAuthenticated ? (
        <div className="flex items-center justify-center min-h-screen p-4">
          {showRegister ? (
            <AuthRegisterForm 
              onRegister={handleRegister} 
              onSwitchToLogin={() => setShowRegister(false)} 
            />
          ) : (
            <AuthLoginForm 
              onLogin={handleLogin} 
              onSwitchToRegister={() => setShowRegister(true)} 
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
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {currentView === 'dashboard' && 'Dashboard'}
                  {currentView === 'patients' && 'Pacientes'}
                  {currentView === 'records' && 'Registros'}
                  {currentView === 'appointments' && 'Citas'}
                  {currentView === 'education' && 'Material Educativo'}
                  {currentView === 'users' && 'Usuarios'}
                </h2>
                <span className="text-sm text-gray-500">
                  {currentUser?.nombre} ({currentUser?.rol})
                </span>
              </div>
              {renderView()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
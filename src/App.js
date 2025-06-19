import React, { useState, useEffect } from 'react';
import { 
  initDB, 
  loginUser, 
  registerUser, 
  getCurrentUser, 
  logoutUser,
  getPacientes,
  addPaciente,
  getCitas,
  addCita,
  resetDB
} from './utils/database';
import { Capacitor } from '@capacitor/core';
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
  const [state, setState] = useState({
    currentView: 'login',
    isAuthenticated: false,
    userRole: null,
    showRegister: false,
    currentUser: null,
    appInitialized: false,
    error: null,
    isWeb: !Capacitor.isNativePlatform()
  });

  // Inicialización
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log(`Iniciando en modo ${state.isWeb ? 'web' : 'nativo'}`);
        await initDB();
        
        const user = await getCurrentUser();
        if (user) {
          updateState({
            isAuthenticated: true,
            userRole: user.rol,
            currentUser: user,
            currentView: 'dashboard'
          });
        } else if (state.isWeb) {
          // Autologin para desarrollo web
          updateState({
            isAuthenticated: true,
            userRole: 'administracion',
            currentUser: {
              nombre: 'Usuario Demo',
              email: 'demo@vidawasi.com',
              rol: 'administracion'
            },
            currentView: 'dashboard'
          });
        }
      } catch (error) {
        handleError(error);
      } finally {
        updateState({ appInitialized: true });
      }
    };

    initializeApp();
  }, []);

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleError = (error) => {
    console.error('Error:', error);
    updateState({ 
      error: state.isWeb 
        ? 'Usando datos de demostración' 
        : error.message 
    });
  };

  const handleAuth = async (action, ...args) => {
    try {
      updateState({ error: null });
      const result = await {
        login: loginUser,
        register: registerUser,
        logout: logoutUser
      }[action](...args);

      if (action === 'login' && result) {
        updateState({
          isAuthenticated: true,
          userRole: result.rol,
          currentUser: result,
          currentView: 'dashboard'
        });
      }
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const renderView = () => {
    const views = {
      patients: <PatientList 
                  mode={state.userRole === 'cuidador' ? 'view' : 'edit'} 
                  getPacientes={getPacientes}
                />,
      records: <PatientRecordForm addPaciente={addPaciente} />,
      appointments: <AppointmentManagement 
                     userRole={state.userRole}
                     getPacientes={getPacientes}
                     getCitas={getCitas}
                     addCita={addCita}
                   />,
      education: <EducationalMaterials />,
      users: state.userRole === 'administracion' 
        ? <UserManagement 
            getPacientes={getPacientes}
            getCitas={getCitas}
          /> 
        : <div className="p-4 text-red-500">Acceso no autorizado</div>,
      dashboard: <DashboardStats userRole={state.userRole} />
    };
    return views[state.currentView] || views.dashboard;
  };

  if (!state.appInitialized) {
    return <LoadingScreen isWeb={state.isWeb} />;
  }

  if (state.error && !state.isWeb) {
    return <ErrorScreen error={state.error} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {!state.isAuthenticated ? (
        <AuthScreen 
          showRegister={state.showRegister}
          onLogin={(email, pass) => handleAuth('login', email, pass)}
          onRegister={(data) => handleAuth('register', data)}
          onToggleRegister={() => updateState({ showRegister: !state.showRegister })}
          error={state.error}
        />
      ) : (
        <MainLayout
          currentView={state.currentView}
          userRole={state.userRole}
          currentUser={state.currentUser}
          isWeb={state.isWeb}
          onLogout={() => handleAuth('logout')}
          onChangeView={(view) => updateState({ currentView: view })}
        >
          {renderView()}
        </MainLayout>
      )}
    </div>
  );
};

// Componentes auxiliares
const LoadingScreen = ({ isWeb }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      <p className="mt-2">Inicializando aplicación...</p>
      {isWeb && <p className="text-sm text-gray-500 mt-2">Modo local activado</p>}
    </div>
  </div>
);

const ErrorScreen = ({ error }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md mx-4">
      <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
      <p className="mb-4 text-gray-700">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Recargar
      </button>
    </div>
  </div>
);

const AuthScreen = ({ showRegister, onLogin, onRegister, onToggleRegister, error }) => (
  <div className="flex items-center justify-center min-h-screen p-4">
    {showRegister ? (
      <AuthRegisterForm 
        onRegister={onRegister} 
        onSwitchToLogin={onToggleRegister} 
        error={error}
      />
    ) : (
      <AuthLoginForm 
        onLogin={onLogin} 
        onSwitchToRegister={onToggleRegister} 
        error={error}
      />
    )}
  </div>
);

const MainLayout = ({ children, currentView, userRole, currentUser, isWeb, onLogout, onChangeView }) => (
  <div className="flex">
    <NavigationSidebar 
      currentView={currentView}
      setCurrentView={onChangeView}
      userRole={userRole}
      onLogout={onLogout}
    />
    
    <main className="flex-1 p-4 md:p-6">
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <h2 className="text-xl font-semibold">
            {{
              dashboard: 'Dashboard',
              patients: 'Pacientes',
              records: 'Registros',
              appointments: 'Citas',
              education: 'Material Educativo',
              users: 'Usuarios'
            }[currentView]}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {currentUser?.nombre} ({currentUser?.rol})
            </span>
            {isWeb && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Modo local
              </span>
            )}
          </div>
        </div>
        <div className="mt-4">
          {children}
        </div>
      </div>
    </main>
  </div>
);

export default App;
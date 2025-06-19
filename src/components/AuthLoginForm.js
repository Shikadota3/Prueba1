import React, { useState } from 'react';

const AuthLoginForm = ({ onLogin, onSwitchToRegister }) => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onLogin(form.email, form.password);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
      
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Contraseña *</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Iniciando sesión...' : 'Ingresar'}
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-blue-500 hover:underline"
          >
            ¿No tienes cuenta? Regístrate
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthLoginForm;
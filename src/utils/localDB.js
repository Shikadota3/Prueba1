import localforage from 'localforage';

// Configuración para datos locales
localforage.config({
  name: 'VidaWasiDB',
  storeName: 'app_data'
});

export const initDB = async () => {
  console.log('Usando almacenamiento local');
  return {
    query: async (sql, params) => {
      // Implementa según tus necesidades
      const data = await localforage.getItem('usuarios') || [];
      return { values: data };
    },
    run: async (sql, params) => {
      // Lógica para insertar/actualizar
      return { lastId: Date.now() };
    }
  };
};
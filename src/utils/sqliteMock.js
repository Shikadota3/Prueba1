export const initDB = async () => {
    console.warn('SQLite no está disponible en navegador - usando mock');
    return {
      execute: () => console.log('Mock execute'),
      query: () => ({ values: [] }),
      run: () => ({ lastId: 1 }),
      close: () => {}
    };
  };
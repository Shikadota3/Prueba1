import { initDB, devTools } from '../utils/database';

export const loadInitialData = async () => {
  const db = await initDB();
  // Carga inicial de datos
};

export const backupData = async () => {
  return await devTools.exportData();
};
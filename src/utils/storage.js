import { Preferences } from '@capacitor/preferences';

// Para preferencias simples (configuración de la app)
export const saveToLocal = async (key, value) => {
  await Preferences.set({ key, value: JSON.stringify(value) });
};

export const getFromLocal = async (key) => {
  const { value } = await Preferences.get({ key });
  return value ? JSON.parse(value) : null;
};
import { initDB } from './database';

export const initAuthDB = async () => {
  const db = await initDB();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      registered_at TEXT NOT NULL,
      is_logged_in INTEGER DEFAULT 0
    );
  `);
  return db;
};

export const loginUser = async (email, password) => {
  const db = await initAuthDB();
  const result = await db.query(
    'SELECT * FROM users WHERE email = ? AND password = ? LIMIT 1',
    [email, password]
  );
  
  if (result.values.length > 0) {
    // Cerrar otras sesiones
    await db.run('UPDATE users SET is_logged_in = 0');
    // Activar nueva sesión
    await db.run('UPDATE users SET is_logged_in = 1 WHERE id = ?', [result.values[0].id]);
    return result.values[0];
  }
  return null;
};

export const getCurrentUser = async () => {
  const db = await initAuthDB();
  const result = await db.query('SELECT * FROM users WHERE is_logged_in = 1 LIMIT 1');
  return result.values.length > 0 ? result.values[0] : null;
};
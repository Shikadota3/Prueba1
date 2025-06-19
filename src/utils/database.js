import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

const sqlite = new SQLiteConnection(CapacitorSQLite);
let dbInstance;

// Inicialización de la base de datos
export const initDB = async () => {
  if (!dbInstance) {
    dbInstance = await sqlite.createConnection(
      'vidawasi_db',
      false,
      'no-encryption',
      1,
      false
    );
    await dbInstance.open();

    // Tablas esenciales
    await dbInstance.execute(`
      CREATE TABLE IF NOT EXISTS pacientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        edad INTEGER,
        diagnostico TEXT,
        hemoglobina REAL,
        fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dbInstance.execute(`
      CREATE TABLE IF NOT EXISTS citas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        paciente_id INTEGER,
        fecha TEXT NOT NULL,
        hora TEXT NOT NULL,
        motivo TEXT,
        estado TEXT DEFAULT 'pendiente',
        FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
      );
    `);

    await dbInstance.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        rol TEXT CHECK(rol IN ('administracion', 'doctor', 'cuidador')) NOT NULL,
        registrado_en TEXT NOT NULL,
        is_logged_in BOOLEAN DEFAULT 0
      );
    `);

    // Datos iniciales de administrador
    const adminExists = await dbInstance.query(
      'SELECT 1 FROM usuarios WHERE email = ?',
      ['admin@vidawasi.com']
    );
    if (adminExists.values.length === 0) {
      await dbInstance.run(
        `INSERT INTO usuarios (nombre, email, password, rol, registrado_en)
         VALUES (?, ?, ?, ?, ?)`,
        ['Administrador', 'admin@vidawasi.com', 'admin123', 'administracion', new Date().toISOString()]
      );
    }
  }
  return dbInstance;
};

// Operaciones de autenticación
export const loginUser = async (email, password) => {
  const db = await initDB();
  const result = await db.query(
    'SELECT * FROM usuarios WHERE email = ? AND password = ? LIMIT 1',
    [email, password]
  );
  
  if (result.values.length > 0) {
    await db.run('UPDATE usuarios SET is_logged_in = 0');
    await db.run('UPDATE usuarios SET is_logged_in = 1 WHERE id = ?', [result.values[0].id]);
    return result.values[0];
  }
  return null;
};

export const registerUser = async (userData) => {
  const db = await initDB();
  const existing = await db.query('SELECT 1 FROM usuarios WHERE email = ?', [userData.email]);
  
  if (existing.values.length > 0) {
    throw new Error('El email ya está registrado');
  }

  const result = await db.run(
    `INSERT INTO usuarios (nombre, email, password, rol, registrado_en)
     VALUES (?, ?, ?, ?, ?)`,
    [userData.nombre, userData.email, userData.password, userData.rol, new Date().toISOString()]
  );
  return result.lastId;
};

export const getCurrentUser = async () => {
  const db = await initDB();
  const result = await db.query('SELECT * FROM usuarios WHERE is_logged_in = 1 LIMIT 1');
  return result.values.length > 0 ? result.values[0] : null;
};

export const logoutUser = async () => {
  const db = await initDB();
  await db.run('UPDATE usuarios SET is_logged_in = 0');
};

// Operaciones para pacientes
export const getPacientes = async () => {
  const db = await initDB();
  const result = await db.query('SELECT * FROM pacientes');
  return result.values || [];
};

export const addPaciente = async (paciente) => {
  const db = await initDB();
  const result = await db.run(
    'INSERT INTO pacientes (nombre, edad, diagnostico, hemoglobina) VALUES (?, ?, ?, ?)',
    [paciente.nombre, paciente.edad, paciente.diagnostico, paciente.hemoglobina]
  );
  return result.lastId;
};

// Operaciones para citas
export const getCitas = async () => {
  const db = await initDB();
  const result = await db.query(`
    SELECT c.*, p.nombre as paciente_nombre 
    FROM citas c
    LEFT JOIN pacientes p ON c.paciente_id = p.id
  `);
  return result.values || [];
};

export const addCita = async (cita) => {
  const db = await initDB();
  const result = await db.run(
    `INSERT INTO citas (paciente_id, fecha, hora, motivo)
     VALUES (?, ?, ?, ?)`,
    [cita.patientId, cita.date, cita.time, cita.reason]
  );
  return result.lastId;
};
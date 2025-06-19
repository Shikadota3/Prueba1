import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

// Configuración común
const DB_CONFIG = {
  name: 'vidawasi_db',
  version: 1,
  encryption: false,
  mode: 'no-encryption'
};

const sqlite = new SQLiteConnection(CapacitorSQLite);
let dbInstance;

// ==================== IMPLEMENTACIÓN WEB ====================
const createWebDB = () => {
  console.log('Inicializando base de datos virtual para navegador');
  
  let data = {
    usuarios: [
      {
        id: 1,
        nombre: 'Admin Local',
        email: 'admin@vidawasi.com',
        password: 'admin123',
        rol: 'administracion',
        registrado_en: new Date().toISOString(),
        is_logged_in: 1
      }
    ],
    pacientes: [],
    citas: []
  };

  const webDB = {
    execute: async () => {},
    
    query: async (sql, params = []) => {
      if (sql.includes('SELECT * FROM usuarios WHERE email')) {
        return { 
          values: data.usuarios.filter(u => 
            u.email === params[0] && u.password === params[1]
          ) 
        };
      }
      if (sql.includes('SELECT * FROM usuarios WHERE is_logged_in = 1')) {
        return { values: data.usuarios.filter(u => u.is_logged_in) };
      }
      if (sql.includes('SELECT 1 FROM usuarios WHERE email')) {
        return { values: data.usuarios.some(u => u.email === params[0]) ? [1] : [] };
      }
      if (sql.includes('FROM pacientes')) {
        return { values: data.pacientes };
      }
      if (sql.includes('FROM citas')) {
        return { values: data.citas };
      }
      return { values: [] };
    },

    run: async (sql, params = []) => {
      if (sql.includes('INSERT INTO usuarios')) {
        const newUser = {
          id: Date.now(),
          ...params,
          registrado_en: new Date().toISOString(),
          is_logged_in: 0
        };
        data.usuarios.push(newUser);
        return { lastId: newUser.id, changes: 1 };
      }
      if (sql.includes('UPDATE usuarios SET is_logged_in')) {
        data.usuarios.forEach(u => u.is_logged_in = params[0]);
        if (params[1]) {
          const user = data.usuarios.find(u => u.id === params[1]);
          if (user) user.is_logged_in = 1;
        }
        return { changes: 1 };
      }
      return { changes: 0, lastId: -1 };
    },

    close: async () => {},
    isConnected: async () => ({ connected: true }),

    // Herramientas de desarrollo
    _getData: () => data,
    _resetData: () => {
      data = { 
        usuarios: [], 
        pacientes: [], 
        citas: [] 
      };
    }
  };

  return webDB;
};

// ==================== IMPLEMENTACIÓN NATIVA ====================
const initializeNativeDB = async () => {
  dbInstance = await sqlite.createConnection(DB_CONFIG);
  await dbInstance.open();

  if (!(await dbInstance.isConnected()).connected) {
    throw new Error('Conexión fallida');
  }

  // Creación de tablas
  await dbInstance.executeTransaction([
    {
      statement: `CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        rol TEXT CHECK(rol IN ('administracion', 'doctor', 'cuidador')) NOT NULL,
        registrado_en TEXT NOT NULL,
        is_logged_in BOOLEAN DEFAULT 0
      )`
    },
    {
      statement: `CREATE TABLE IF NOT EXISTS pacientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        edad INTEGER,
        diagnostico TEXT,
        hemoglobina REAL,
        fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP
      )`
    },
    {
      statement: `CREATE TABLE IF NOT EXISTS citas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        paciente_id INTEGER,
        fecha TEXT NOT NULL,
        hora TEXT NOT NULL,
        motivo TEXT,
        estado TEXT DEFAULT 'pendiente',
        FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
      )`
    }
  ]);

  // Datos iniciales
  const adminExists = await dbInstance.query(
    'SELECT 1 FROM usuarios WHERE email = ?',
    ['admin@vidawasi.com']
  );
  
  if (!adminExists.values?.length) {
    await dbInstance.run(
      `INSERT INTO usuarios (nombre, email, password, rol, registrado_en)
       VALUES (?, ?, ?, ?, ?)`,
      ['Administrador', 'admin@vidawasi.com', 'admin123', 'administracion', new Date().toISOString()]
    );
  }

  return dbInstance;
};

// ==================== FUNCIÓN WRAPPER ====================
const withDB = async (operation) => {
  const db = await initDB();
  try {
    return await operation(db);
  } catch (error) {
    console.error('Error en operación DB:', error);
    throw error;
  }
};

// ==================== OPERACIONES CRUD ====================
export const initDB = async () => {
  if (dbInstance) return dbInstance;

  try {
    dbInstance = Capacitor.isNativePlatform() 
      ? await initializeNativeDB() 
      : createWebDB();

    console.log(`Base de datos ${Capacitor.isNativePlatform() ? 'nativa' : 'web'} inicializada`);
    return dbInstance;
  } catch (error) {
    console.error('Error al inicializar DB:', error);
    throw new Error(`Error de conexión: ${error.message}`);
  }
};

export const loginUser = async (email, password) => {
  return withDB(async (db) => {
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
  });
};

export const registerUser = async (userData) => {
  return withDB(async (db) => {
    const existing = await db.query(
      'SELECT 1 FROM usuarios WHERE email = ?', 
      [userData.email]
    );
    
    if (existing.values.length > 0) {
      throw new Error('El email ya está registrado');
    }

    const result = await db.run(
      `INSERT INTO usuarios (nombre, email, password, rol, registrado_en)
       VALUES (?, ?, ?, ?, ?)`,
      [
        userData.nombre, 
        userData.email, 
        userData.password, 
        userData.rol, 
        new Date().toISOString()
      ]
    );
    return result.lastId;
  });
};

export const getCurrentUser = async () => {
  return withDB(async (db) => {
    const result = await db.query(
      'SELECT * FROM usuarios WHERE is_logged_in = 1 LIMIT 1'
    );
    return result.values.length > 0 ? result.values[0] : null;
  });
};

export const logoutUser = async () => {
  return withDB(async (db) => {
    await db.run('UPDATE usuarios SET is_logged_in = 0');
  });
};

export const getPacientes = async () => {
  return withDB(async (db) => {
    const result = await db.query('SELECT * FROM pacientes');
    return result.values || [];
  });
};

export const addPaciente = async (paciente) => {
  return withDB(async (db) => {
    const result = await db.run(
      'INSERT INTO pacientes (nombre, edad, diagnostico, hemoglobina) VALUES (?, ?, ?, ?)',
      [paciente.nombre, paciente.edad, paciente.diagnostico, paciente.hemoglobina]
    );
    return result.lastId;
  });
};

export const getCitas = async () => {
  return withDB(async (db) => {
    const result = await db.query(`
      SELECT c.*, p.nombre as paciente_nombre 
      FROM citas c
      LEFT JOIN pacientes p ON c.paciente_id = p.id
    `);
    return result.values || [];
  });
};

export const addCita = async (cita) => {
  return withDB(async (db) => {
    const result = await db.run(
      `INSERT INTO citas (paciente_id, fecha, hora, motivo)
       VALUES (?, ?, ?, ?)`,
      [cita.patientId, cita.date, cita.time, cita.reason]
    );
    return result.lastId;
  });
};

export const resetDB = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.warn('Reset DB solo disponible en modo nativo');
    return;
  }
  
  try {
    await sqlite.deleteDatabase({ database: 'vidawasi_db' });
    dbInstance = null;
    console.log('Base de datos reiniciada');
  } catch (error) {
    console.error('Error al resetear DB:', error);
    throw error;
  }
};

export const devTools = {
  exportData: async () => {
    const db = await initDB();
    if (Capacitor.isNativePlatform()) {
      const [usuarios, pacientes, citas] = await Promise.all([
        db.query('SELECT * FROM usuarios'),
        db.query('SELECT * FROM pacientes'),
        db.query('SELECT * FROM citas')
      ]);
      return {
        usuarios: usuarios.values,
        pacientes: pacientes.values,
        citas: citas.values
      };
    } else {
      return db._getData();
    }
  },
  importData: async (data) => {
    const db = await initDB();
    if (Capacitor.isNativePlatform()) {
      await db.execute('DELETE FROM usuarios');
      await db.execute('DELETE FROM pacientes');
      await db.execute('DELETE FROM citas');
      
      for (const user of data.usuarios) {
        await db.run(
          `INSERT INTO usuarios (nombre, email, password, rol, registrado_en)
           VALUES (?, ?, ?, ?, ?)`,
          [user.nombre, user.email, user.password, user.rol, user.registrado_en]
        );
      }
      // Similar para pacientes y citas
    } else {
      db._resetData();
      Object.assign(db._getData(), data);
    }
  }
};
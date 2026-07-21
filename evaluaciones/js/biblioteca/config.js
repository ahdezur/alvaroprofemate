/**
 * Configuración centralizada de la Biblioteca de Evaluaciones
 */
export const CONFIG = {
  // Almacenamiento
  STORAGE_KEY: 'profemate_library_state_v2',
  
  // Tiempos y Autosave
  AUTOSAVE_INTERVAL_MS: 10000, // 10 segundos
  
  // Modos de Uso
  MODOS: {
    ESTUDIO: 'estudio',
    EVALUACION: 'evaluacion'
  },
  DEFAULT_MODE: 'estudio',
  
  // Rutas de datos
  DATA_PATHS: {
    PREGUNTAS: '/evaluaciones/data/preguntas.json',
    EVALUACIONES: '/evaluaciones/data/evaluaciones.json'
  },
  
  // UI y Presentación
  UI: {
    THEME_COLORS: {
      PRIMARY: 'var(--primary)',
      ACCENT: 'var(--accent)',
      DANGER: '#ef4444',
      SUCCESS: '#10b981',
      WARNING: '#f59e0b'
    },
    ESTADOS: {
      PENDIENTE: 'pendiente',
      INICIADO: 'iniciado',
      FINALIZADO: 'finalizado'
    }
  }
};

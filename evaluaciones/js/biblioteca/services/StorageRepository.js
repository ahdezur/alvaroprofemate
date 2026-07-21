import { CONFIG } from '../config.js';

/**
 * StorageRepository
 * 
 * Único punto de acceso a la persistencia (localStorage).
 * Si en el futuro se migra a una API, los métodos de esta clase
 * cambiarán, pero las interfaces de UI seguirán intactas.
 */
class StorageRepository {
  constructor() {
    this.storageKey = CONFIG.STORAGE_KEY;
  }

  /**
   * Obtiene el estado global de todas las evaluaciones.
   * @private
   */
  _getAll() {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('StorageRepository: Error parseando JSON:', e);
      }
    }
    return {};
  }

  /**
   * Guarda el estado global.
   * @private
   */
  _saveAll(dataObj) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(dataObj));
    } catch (e) {
      console.error('StorageRepository: Límite de cuota excedido o error de escritura:', e);
    }
  }

  /**
   * Obtiene el progreso de una evaluación particular.
   * Si no existe, devuelve una plantilla por defecto.
   */
  getEvaluationProgress(evalId) {
    const all = this._getAll();
    if (all[evalId]) {
      return all[evalId];
    }
    
    // Plantilla inicial
    return {
      estado: CONFIG.UI.ESTADOS.PENDIENTE,
      modo: CONFIG.DEFAULT_MODE,
      preguntaActualIndex: 0,
      tiempoAcumuladoSegundos: 0,
      preguntasVisitadas: [],
      preguntasMarcadas: [],
      pistasAbiertas: {}, // { 'q1': 1, 'q2': 2 }
      solucionesAbiertas: [],
      criteriosSeleccionados: {} // { 'q1': [0, 2] }
    };
  }

  /**
   * Guarda/actualiza el progreso de una evaluación.
   */
  saveEvaluationProgress(evalId, progressObj) {
    const all = this._getAll();
    all[evalId] = progressObj;
    this._saveAll(all);
  }

  /**
   * Borra el progreso de una evaluación.
   */
  resetEvaluationProgress(evalId) {
    const all = this._getAll();
    if (all[evalId]) {
      delete all[evalId];
      this._saveAll(all);
    }
  }
}

export const storage = new StorageRepository();

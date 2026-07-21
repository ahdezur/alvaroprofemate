import { CONFIG } from '../config.js';
import { validator } from './ValidationService.js';
import { storage } from './StorageRepository.js';

/**
 * LibraryService
 * 
 * Orquestador central. Une la carga de datos (fetch),
 * las validaciones y el progreso local.
 * Reemplaza al monolítico DataService.js de la Fase 1.
 */
class LibraryService {
  constructor() {
    this._preguntasCache = null;
    this._evaluacionesCache = null;
  }

  // ==========================================
  // LECTURA Y VALIDACIÓN (FETCH)
  // ==========================================

  async getPreguntas(forceRefresh = false) {
    if (this._preguntasCache && !forceRefresh) return this._preguntasCache;

    try {
      const url = `${CONFIG.DATA_PATHS.PREGUNTAS}?t=${Date.now()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al cargar preguntas.');
      
      const data = await response.json();
      
      // Validación estricta
      const validation = validator.validateQuestions(data);
      if (!validation.isValid) {
        console.error("Errores críticos de integridad en preguntas:", validation.errores);
      }
      
      this._preguntasCache = data;
      return data;
    } catch (error) {
      console.error('LibraryService - Error:', error);
      throw error;
    }
  }

  async getEvaluaciones(forceRefresh = false) {
    if (this._evaluacionesCache && !forceRefresh) return this._evaluacionesCache;

    try {
      const url = `${CONFIG.DATA_PATHS.EVALUACIONES}?t=${Date.now()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al cargar evaluaciones.');
      
      const evalData = await response.json();
      const qData = await this.getPreguntas();
      
      // Validar referencias rotas
      const validation = validator.validateEvaluations(evalData, qData);
      if (!validation.isValid) {
        console.error("Errores críticos de integridad en evaluaciones:", validation.errores);
      }

      this._evaluacionesCache = evalData;
      return evalData;
    } catch (error) {
      console.error('LibraryService - Error:', error);
      throw error;
    }
  }

  async getEvaluacionById(id) {
    const evals = await this.getEvaluaciones();
    const ev = evals.find(e => e.id === id);
    if (!ev) throw new Error(`Evaluación no encontrada: '${id}'`);
    return ev;
  }

  async getPreguntasForEvaluacion(evaluacion) {
    const allQs = await this.getPreguntas();
    return (evaluacion.preguntas || []).map(pId => {
      const q = allQs.find(q => q.id === pId);
      if (!q) throw new Error(`Referencia Rota Crítica: Pregunta ${pId} no encontrada.`);
      return q;
    });
  }

  // ==========================================
  // DELEGACIÓN A STORAGE (PROGRESO)
  // ==========================================

  getProgress(evalId) {
    return storage.getEvaluationProgress(evalId);
  }

  saveProgress(evalId, progressObj) {
    storage.saveEvaluationProgress(evalId, progressObj);
  }

  resetProgress(evalId) {
    storage.resetEvaluationProgress(evalId);
  }
}

export const libraryService = new LibraryService();

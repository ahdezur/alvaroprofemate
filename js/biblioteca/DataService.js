export class DataService {
  constructor() {
    this.storageKey = 'profemate_progress';
  }

  // --- MÉTODOS PARA DATOS ESTÁTICOS (JSON) ---

  /**
   * Carga todas las preguntas desde el JSON
   * @returns {Promise<Array>}
   */
  async getPreguntas() {
    try {
      // Usamos ruta relativa a la raíz para asegurar que funcione desde cualquier página
      const response = await fetch('/data/preguntas.json');
      if (!response.ok) throw new Error('Error al cargar preguntas');
      return await response.json();
    } catch (error) {
      console.error('DataService Error:', error);
      return [];
    }
  }

  /**
   * Carga todas las evaluaciones desde el JSON
   * @returns {Promise<Array>}
   */
  async getEvaluaciones() {
    try {
      const response = await fetch('/data/evaluaciones.json');
      if (!response.ok) throw new Error('Error al cargar evaluaciones');
      return await response.json();
    } catch (error) {
      console.error('DataService Error:', error);
      return [];
    }
  }

  /**
   * Obtiene una evaluación específica por su ID
   */
  async getEvaluacionById(id) {
    const evaluaciones = await this.getEvaluaciones();
    return evaluaciones.find(e => e.id === id) || null;
  }

  /**
   * Obtiene una pregunta específica por su ID
   */
  async getPreguntaById(id) {
    const preguntas = await this.getPreguntas();
    return preguntas.find(p => p.id === id) || null;
  }

  // --- MÉTODOS PARA LOCALSTORAGE (PROGRESO DINÁMICO) ---

  /**
   * Obtiene todo el estado guardado del estudiante
   */
  getProgreso() {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      try {
        return JSON.parse(data);
      } catch(e) {
        console.error('Error al parsear progreso', e);
      }
    }
    // Estado inicial por defecto
    return {
      versiones_esquema: 1,
      evaluaciones_iniciadas: {},
      respuestas: {},
      preguntas_marcadas: {},
      notas_personales: {}
    };
  }

  /**
   * Guarda el estado completo del estudiante
   */
  saveProgreso(progreso) {
    localStorage.setItem(this.storageKey, JSON.stringify(progreso));
  }

  /**
   * Guarda la respuesta a una pregunta en una evaluación
   */
  guardarRespuesta(evaluacionId, preguntaId, alternativaId) {
    const progreso = this.getProgreso();
    if (!progreso.respuestas[evaluacionId]) {
      progreso.respuestas[evaluacionId] = {};
    }
    progreso.respuestas[evaluacionId][preguntaId] = alternativaId;
    this.saveProgreso(progreso);
  }
}

// Exportamos una instancia única (Singleton) para ser usada por toda la app
export const dataService = new DataService();

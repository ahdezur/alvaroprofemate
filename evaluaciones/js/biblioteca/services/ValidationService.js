/**
 * ValidationService
 * 
 * Se encarga de comprobar la integridad de los datos estáticos (JSON).
 * Verifica identificadores duplicados, referencias rotas y consistencia matemática.
 */
class ValidationService {
  
  /**
   * Valida la integridad del banco de datos de preguntas.
   */
  validateQuestions(questions) {
    if (!Array.isArray(questions)) throw new Error("El archivo de preguntas no es un arreglo válido.");
    
    const ids = new Set();
    const errores = [];

    questions.forEach((q, index) => {
      // 1. Identificadores duplicados
      if (!q.id) {
        errores.push(`Pregunta en el índice ${index} no tiene un ID válido.`);
      } else if (ids.has(q.id)) {
        errores.push(`Identificador de pregunta duplicado: '${q.id}'.`);
      }
      ids.add(q.id);

      // 2. Consistencia de puntaje en pauta
      if (q.criterios_correccion && Array.isArray(q.criterios_correccion)) {
        const sum = q.criterios_correccion.reduce((acc, curr) => acc + (curr.puntaje || 0), 0);
        if (sum !== q.puntaje) {
          errores.push(`Inconsistencia en '${q.id}': La suma de la pauta (${sum}) no coincide con el puntaje total (${q.puntaje}).`);
        }
      }
    });

    if (errores.length > 0) {
      console.warn("ValidationService (Preguntas): Se encontraron problemas.", errores);
    }
    
    return {
      isValid: errores.length === 0,
      errores
    };
  }

  /**
   * Valida la integridad de las evaluaciones contra el banco de preguntas.
   */
  validateEvaluations(evaluations, questions) {
    if (!Array.isArray(evaluations)) throw new Error("El archivo de evaluaciones no es un arreglo válido.");
    
    const evalIds = new Set();
    const qIds = new Set(questions.map(q => q.id));
    const errores = [];

    evaluations.forEach((ev, index) => {
      if (!ev.id) {
        errores.push(`Evaluación en el índice ${index} no tiene un ID válido.`);
      } else if (evalIds.has(ev.id)) {
        errores.push(`Identificador de evaluación duplicado: '${ev.id}'.`);
      }
      evalIds.add(ev.id);

      if (ev.preguntas && Array.isArray(ev.preguntas)) {
        ev.preguntas.forEach(refId => {
          if (!qIds.has(refId)) {
            errores.push(`Referencia Rota en '${ev.id}': La pregunta referenciada '${refId}' no existe en el banco.`);
          }
        });
      }
    });

    if (errores.length > 0) {
      console.warn("ValidationService (Evaluaciones): Se encontraron problemas.", errores);
    }

    return {
      isValid: errores.length === 0,
      errores
    };
  }
}

export const validator = new ValidationService();

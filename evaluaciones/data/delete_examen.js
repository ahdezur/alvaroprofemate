const fs = require('fs');

const pathPreguntas = '/Users/alvaro/Documents/Web/evaluaciones/data/preguntas.json';
const pathEvaluaciones = '/Users/alvaro/Documents/Web/evaluaciones/data/evaluaciones.json';

const preguntasData = JSON.parse(fs.readFileSync(pathPreguntas, 'utf8'));
let evaluacionesData = JSON.parse(fs.readFileSync(pathEvaluaciones, 'utf8'));

const examenId = 'ID';
const examen = evaluacionesData.find(e => e.id === examenId);

if (examen) {
  const preguntasToRemove = examen.preguntas;
  
  // Filtrar preguntas
  const nuevasPreguntas = preguntasData.filter(q => !preguntasToRemove.includes(q.id));
  fs.writeFileSync(pathPreguntas, JSON.stringify(nuevasPreguntas, null, 2));
  
  // Filtrar evaluaciones
  evaluacionesData = evaluacionesData.filter(e => e.id !== examenId);
  fs.writeFileSync(pathEvaluaciones, JSON.stringify(evaluacionesData, null, 2));
  
  console.log('Examen y sus preguntas eliminados correctamente.');
} else {
  console.log('El examen no fue encontrado.');
}

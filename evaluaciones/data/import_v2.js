const fs = require('fs');
const path = require('path');

const texFile = process.argv[2] || '/Users/alvaro/Documents/Evaluaciones/Control_4_MA1101_2026_Otono_plantilla.tex';
const preguntasFile = '/Users/alvaro/Documents/Web/evaluaciones/data/preguntas.json';
const evaluacionesFile = '/Users/alvaro/Documents/Web/evaluaciones/data/evaluaciones.json';

const contentRaw = fs.readFileSync(texFile, 'utf8');
// Remover comentarios LaTeX (ignorando \%)
const content = contentRaw.replace(/(?<!\\)%.*/g, '');

const metaMatch = content.match(/\\evalMeta\s*\{([^}]*)\}\s*\{([^}]*)\}\s*\{([^}]*)\}\s*\{([^}]*)\}\s*\{([^}]*)\}\s*\{([^}]*)\}\s*\{([^}]*)\}\s*\{([^}]*)\}\s*\{([^}]*)\}/);
if (!metaMatch) throw new Error("No se encontró evalMeta");

const evaluacion = {
  id: metaMatch[1].trim(),
  titulo: metaMatch[2].trim(),
  descripcion: metaMatch[3].trim(),
  curso: metaMatch[4].trim(),
  universidad: metaMatch[5].trim(),
  ano: parseInt(metaMatch[6].trim()),
  semestre: metaMatch[7].trim(),
  tipo: metaMatch[8].trim(),
  tiempo_limite_minutos: parseInt(metaMatch[9].trim()),
  etiquetas: [],
  preguntas: []
};

const tagsMatch = content.match(/\\evalTags\{([^}]*)\}/);
if (tagsMatch) {
  evaluacion.etiquetas = tagsMatch[1].split(',').map(t => t.trim());
}

const preguntas = [];

// Helper robusto para extraer comandos con N argumentos y llaves anidadas
function extractCommandArgs(text, commandName, numArgs) {
  const results = [];
  let currentText = text;
  
  while (true) {
    const idx = currentText.indexOf(commandName + '{');
    if (idx === -1) break;
    
    let args = [];
    let searchStart = idx + commandName.length;
    let endOfCommand = searchStart;
    
    for (let i = 0; i < numArgs; i++) {
      // Ignorar espacios en blanco entre argumentos si los hay
      while (currentText[searchStart] === ' ' || currentText[searchStart] === '\n' || currentText[searchStart] === '\r') {
        searchStart++;
      }
      
      let openBraceIdx = currentText.indexOf('{', searchStart);
      if (openBraceIdx !== searchStart) break; // formato invalido
      
      let braceCount = 1;
      let closeBraceIdx = -1;
      for (let j = openBraceIdx + 1; j < currentText.length; j++) {
        if (currentText[j] === '{') braceCount++;
        else if (currentText[j] === '}') braceCount--;
        
        if (braceCount === 0) {
          closeBraceIdx = j;
          break;
        }
      }
      
      if (closeBraceIdx !== -1) {
        args.push(currentText.substring(openBraceIdx + 1, closeBraceIdx));
        searchStart = closeBraceIdx + 1;
        endOfCommand = closeBraceIdx + 1;
      } else {
        break; // Llave de cierre no encontrada
      }
    }
    
    if (args.length === numArgs) {
      results.push(args);
      currentText = currentText.substring(0, idx) + currentText.substring(endOfCommand);
    } else {
      // Evitar bucle infinito si el comando está malformado
      currentText = currentText.substring(0, idx) + '___MALFORMED___' + currentText.substring(idx + commandName.length);
    }
  }
  
  return { modifiedText: currentText, extracted: results };
}

function procesarTextoPreguntas(texto, contextoGlobal) {
  const partesPregunta = texto.split('\\begin{pregunta}');
  for (let p = 1; p < partesPregunta.length; p++) {
    let rawP = partesPregunta[p];
    
    const qArgsMatch = rawP.match(/^\s*\{([^}]*)\}\s*\{([^}]*)\}\s*\{([^}]*)\}\s*\{([^}]*)\}/);
    if (!qArgsMatch) continue;
    
    const q = {
      id: qArgsMatch[1].trim(),
      puntaje: parseInt(qArgsMatch[2].trim()),
      dificultad: qArgsMatch[3].trim(),
      temas: qArgsMatch[4].split(',').map(x=>x.trim()),
      contexto: contextoGlobal,
      pistas: [],
      errores_frecuentes: []
    };
    evaluacion.preguntas.push(q.id);

    rawP = rawP.substring(qArgsMatch[0].length);
    let bodyEnd = rawP.indexOf('\\end{pregunta}');
    let body = rawP.substring(0, bodyEnd);
    
    // Extraer numeracion
    let extNum = extractCommandArgs(body, '\\numeracion', 1);
    body = extNum.modifiedText;
    if (extNum.extracted.length > 0) {
      q.numeracion_personalizada = extNum.extracted[0][0].trim();
    }

    // Extraer pistas
    let extPista = extractCommandArgs(body, '\\pista', 1);
    body = extPista.modifiedText;
    extPista.extracted.forEach(args => q.pistas.push(args[0].trim()));

    // Extraer solucion (manteniendo el regex simple porque no usa argumentos entre llaves sino entorno)
    const solRegex = /\\begin\{solucion\}([\s\S]*?)\\end\{solucion\}/;
    const solMatch = body.match(solRegex);
    if (solMatch) {
      let solText = solMatch[1].trim();
      // Reemplazos de formato de texto básico
      solText = solText.replace(/\\textbf\{([^{}]+)\}/g, '<b>$1</b>');
      solText = solText.replace(/\\textit\{([^{}]+)\}/g, '<i>$1</i>');
      solText = solText.replace(/\\vspace\{[^}]+\}/g, '<br>');
      solText = solText.replace(/\\medskip/g, '<br>');
      
      q.solucion = solText.replace(/\n\s*\n/g, '<br><br>');
      body = body.replace(solRegex, '');
    }

    // Extraer métodos y criterios
    let methodParts = body.split('\\metodo');
    let metodos_resolucion = [];
    
    // Si no hay métodos explícitos, todo pertenece al método por defecto
    if (methodParts.length === 1) {
      let extCrit = extractCommandArgs(methodParts[0], '\\criterio', 2);
      body = extCrit.modifiedText;
      let crits = extCrit.extracted.map(args => ({
        descripcion: args[0].trim(),
        puntaje: parseFloat(args[1].trim())
      }));
      if (crits.length > 0) {
        metodos_resolucion.push({ nombre: "Única Forma", criterios: crits });
      }
    } else {
      // Si hay métodos, la parte 0 es antes del primer \metodo (asumimos sin criterios o los guardamos como base)
      let extCrit0 = extractCommandArgs(methodParts[0], '\\criterio', 2);
      body = extCrit0.modifiedText;
      
      for(let m = 1; m < methodParts.length; m++) {
        let fakePart = '\\metodo' + methodParts[m];
        let extMet = extractCommandArgs(fakePart, '\\metodo', 1);
        let mNombre = extMet.extracted[0] ? extMet.extracted[0][0].trim() : `Método ${m}`;
        let mBody = extMet.modifiedText;
        
        let extCrit = extractCommandArgs(mBody, '\\criterio', 2);
        // Lo que sobre del bloque del método (que no son criterios) se devuelve al body principal
        body += "\n" + extCrit.modifiedText;
        
        let crits = extCrit.extracted.map(args => ({
          descripcion: args[0].trim(),
          puntaje: parseFloat(args[1].trim())
        }));
        
        metodos_resolucion.push({ nombre: mNombre, criterios: crits });
      }
    }
    
    q.metodos_resolucion = metodos_resolucion;

    // Extraer errores
    let extErr = extractCommandArgs(body, '\\errorfrecuente', 1);
    body = extErr.modifiedText;
    extErr.extracted.forEach(args => q.errores_frecuentes.push(args[0].trim()));
    
    body = body.replace(/\\imagensegura\[.*?\]\{(.*?)\}/g, '<br><br><div style="text-align:center;"><img src="$1" alt="Imagen" style="max-width: 50%;"></div><br><br>');
    body = body.replace(/\\textbf\{([^{}]+)\}/g, '<b>$1</b>');
    body = body.replace(/\\textit\{([^{}]+)\}/g, '<i>$1</i>');
    body = body.replace(/\\vspace\{[^}]+\}/g, '<br>');
    body = body.replace(/\\medskip/g, '<br>');

    q.enunciado = body.trim().replace(/\n\s*\n/g, '<br><br>');
    preguntas.push(q);
  }
}

const bloquesContexto = content.split('\\begin{bloqueContexto}');

procesarTextoPreguntas(bloquesContexto[0], null);

for (let i = 1; i < bloquesContexto.length; i++) {
  let text = bloquesContexto[i];
  
  const parts = text.split('\\end{bloqueContexto}');
  const insideText = parts[0];
  const outsideText = parts.length > 1 ? parts[1] : '';
  
  const firstBrace = insideText.indexOf('{');
  let braceCount = 1;
  let endBrace = -1;
  for (let j = firstBrace + 1; j < insideText.length; j++) {
    if (insideText[j] === '{') braceCount++;
    if (insideText[j] === '}') braceCount--;
    if (braceCount === 0) {
      endBrace = j;
      break;
    }
  }
  
  let contextoGlobal = insideText.substring(firstBrace + 1, endBrace).trim();
  contextoGlobal = contextoGlobal.replace(/\\imagensegura\[.*?\]\{(.*?)\}/g, '<br><br><div style="text-align:center;"><img src="$1" alt="Imagen" style="max-width: 50%;"></div><br><br>');
  contextoGlobal = contextoGlobal.replace(/\n\s*\n/g, '<br><br>');

  procesarTextoPreguntas(insideText, contextoGlobal);
  if (outsideText) {
    procesarTextoPreguntas(outsideText, null);
  }
}

let allQ = JSON.parse(fs.readFileSync(preguntasFile, 'utf8'));
allQ = allQ.filter(q => !evaluacion.preguntas.includes(q.id));
allQ = [...allQ, ...preguntas];
fs.writeFileSync(preguntasFile, JSON.stringify(allQ, null, 2));

let allE = JSON.parse(fs.readFileSync(evaluacionesFile, 'utf8'));
allE = allE.filter(e => e.id !== evaluacion.id);
allE.push(evaluacion);
fs.writeFileSync(evaluacionesFile, JSON.stringify(allE, null, 2));

console.log("Importación exitosa y sin errores de llaves");

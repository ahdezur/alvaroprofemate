const fs = require('fs');

function replaceLatexInlineFormat(text) {
  if (!text) return '';
  const macros = ['textbf', 'textit', 'underline'];
  let result = text;

  macros.forEach(macro => {
    const tag = macro === 'textbf' ? 'strong' : (macro === 'textit' ? 'em' : 'u');
    const target = `\\${macro}{`;
    let idx;
    while ((idx = result.indexOf(target)) !== -1) {
      let depth = 1;
      let i = idx + target.length;
      let start = i;
      while (i < result.length && depth > 0) {
        if (result[i] === '{') depth++;
        else if (result[i] === '}') depth--;
        i++;
      }
      if (depth === 0) {
        const inner = result.substring(start, i - 1);
        result = result.substring(0, idx) + `<${tag}>${inner}</${tag}>` + result.substring(i);
      } else {
        break;
      }
    }
  });

  return result;
}

function getEnvContent(latexText, envName) {
  const startTag = '\\begin{' + envName + '}';
  const endTag = '\\end{' + envName + '}';
  const startIdx = latexText.lastIndexOf(startTag);
  const endIdx = latexText.indexOf(endTag, startIdx);
  if (startIdx !== -1 && endIdx !== -1) {
    let inner = latexText.substring(startIdx + startTag.length, endIdx);
    inner = inner.replace(/^\{[^}]*\}/, '');
    return inner.trim();
  }
  return '';
}

function stripLatexComments(str) {
  if (!str) return '';
  let clean = str.replace(/^[ \t]*%[^\r\n]*/gm, '');
  clean = clean.replace(/(^|[^\\])%[^\r\n]*/g, '$1');
  clean = clean.replace(/\\%/g, '%');
  return clean;
}

function extractMacroCalls(text, macroName, argCount) {
  const results = [];
  const regex = new RegExp(`\\\\${macroName}\\s*\\{`, 'gi');
  let match;
  while ((match = regex.exec(text)) !== null) {
    const startIndex = match.index;
    let i = match.index + match[0].length - 1;
    const args = [];

    while (i < text.length && args.length < argCount) {
      if (text[i] === '{') {
        let depth = 1;
        let start = i + 1;
        i++;
        while (i < text.length && depth > 0) {
          if (text[i] === '{') depth++;
          else if (text[i] === '}') depth--;
          i++;
        }
        args.push(text.substring(start, i - 1));
      } else if (/\s/.test(text[i])) {
        i++;
      } else {
        break;
      }
    }

    if (args.length === argCount) {
      results.push({
        startIndex: startIndex,
        endIndex: i,
        fullMatch: text.substring(startIndex, i),
        args: args
      });
    }
  }
  return results;
}

function cleanInlineLatex(str) {
  if (!str) return '';
  let clean = stripLatexComments(str).trim();
  clean = replaceLatexInlineFormat(clean);
  return clean;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function parseColumnItems(colText) {
  if (!colText) return [];
  const rawItems = colText.split(/\\item\b/).map(s => s.trim()).filter(Boolean);
  return rawItems.map(item => {
    let clean = item.replace(/^\[[^\]]+\]\s*/, '');
    return cleanInlineLatex(clean);
  });
}

function parseInteractiveQuestions(rawText) {
  if (!rawText) return { cleanText: '', blocks: [] };

  let html = rawText;
  const blocks = [];

  function saveBlock(h) {
    const idx = blocks.length;
    blocks.push(h);
    return `___BLOCK_${idx}___`;
  }

  // Handle \html{...} calls
  const htmlCalls = extractMacroCalls(html, 'html', 1);
  htmlCalls.forEach(call => {
    const token = saveBlock(call.args[0]);
    html = html.replace(call.fullMatch, token);
  });

  // 1. Pregunta Alternativas
  html = html.replace(/\\begin\{preguntaalternativas\}\{([^}]+)\}([\s\S]*?)\\end\{preguntaalternativas\}/gi, (m, questionTitle, body) => {
    const opCalls = extractMacroCalls(body, 'opcion', 3);
    const statementText = opCalls.length > 0 ? cleanInlineLatex(body.substring(0, opCalls[0].startIndex)) : '';
    const groupName = `quiz-alt-${Date.now()}-${Math.random().toString(36).substring(2,6)}`;
    const optionsHtml = opCalls.map((call, idx) => {
      const optionText = cleanInlineLatex(call.args[0]);
      const optionType = call.args[1].trim();
      const optionFeedback = cleanInlineLatex(call.args[2]);
      const isCorrect = optionType.toLowerCase().includes('correcto') && !optionType.toLowerCase().includes('incorrecto');
      return `
        <label class="quiz-option" data-correct="${isCorrect}" data-feedback="${escapeHtml(optionFeedback)}" style="display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;">
          <input type="radio" name="${groupName}" value="${isCorrect ? '1' : '0'}" data-correct="${isCorrect}" data-feedback="${escapeHtml(optionFeedback)}" style="accent-color:var(--accent-color);">
          <span style="font-size:14px; color:var(--text-primary);">${optionText}</span>
        </label>
      `;
    }).join('');

    return saveBlock(`
      <div class="quiz-block quiz-alternativas" style="margin:24px 0; padding:20px; background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px;">
        <h4 style="margin:0 0 12px 0; font-size:16px; color:var(--text-primary);"><i class="fa-solid fa-circle-question" style="color:var(--accent-color);"></i> ${cleanInlineLatex(questionTitle)}</h4>
        ${statementText ? `<p style="font-size:14px; color:var(--text-secondary); margin-bottom:12px;">${statementText}</p>` : ''}
        <div class="quiz-options">${optionsHtml}</div>
        <button type="button" class="btn btn-verify-quiz" onclick="verifyQuizAlternatives(this)" style="margin-top:12px; padding:8px 18px; background:var(--accent-color); color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;">Verificar Respuesta</button>
        <div class="quiz-feedback" style="display:none; margin-top:12px; padding:12px; border-radius:8px;"></div>
      </div>
    `);
  });

  // 2. Pregunta Verdadero / Falso
  html = html.replace(/\\begin\{preguntaverdaderofalso\}\{([^}]+)\}([\s\S]*?)\\end\{preguntaverdaderofalso\}/gi, (m, questionTitle, body) => {
    const vfCalls = extractMacroCalls(body, 'verdaderofalso', 3);
    if (vfCalls.length === 0) return m;

    const correctAns = vfCalls[0].args[0].trim().toUpperCase();
    const fbIfFalse = cleanInlineLatex(vfCalls[0].args[1]);
    const fbIfTrue = cleanInlineLatex(vfCalls[0].args[2]);

    const statementText = cleanInlineLatex(body.substring(0, vfCalls[0].startIndex));
    const groupName = `quiz-vf-${Date.now()}-${Math.random().toString(36).substring(2,6)}`;

    return saveBlock(`
      <div class="quiz-block quiz-vf" data-correct="${correctAns}" data-feedback-true="${escapeHtml(fbIfTrue)}" data-feedback-false="${escapeHtml(fbIfFalse)}" style="margin:24px 0; padding:20px; background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px;">
        <h4 style="margin:0 0 8px 0; font-size:16px; color:var(--text-primary);"><i class="fa-solid fa-toggle-on" style="color:var(--accent-color);"></i> V/F: ${cleanInlineLatex(questionTitle)}</h4>
        <p style="font-size:14px; color:var(--text-secondary); margin-bottom:12px;">${statementText}</p>
        <div style="display:flex; gap:16px; margin:12px 0;">
          <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
            <input type="radio" name="${groupName}" value="V" style="accent-color:var(--accent-color);"> <strong>Verdadero (V)</strong>
          </label>
          <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
            <input type="radio" name="${groupName}" value="F" style="accent-color:var(--accent-color);"> <strong>Falso (F)</strong>
          </label>
        </div>
        <button type="button" class="btn btn-verify-vf" onclick="verifyQuizVF(this)" style="margin-top:8px; padding:8px 18px; background:var(--accent-color); color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;">Verificar</button>
        <div class="quiz-feedback" style="display:none; margin-top:12px; padding:12px; border-radius:8px;"></div>
      </div>
    `);
  });

  // 3. Pregunta Casillas
  html = html.replace(/\\begin\{preguntacasillas\}\{([^}]+)\}([\s\S]*?)\\end\{preguntacasillas\}/gi, (m, questionTitle, body) => {
    const casCalls = extractMacroCalls(body, 'casilla', 3);
    const statementText = casCalls.length > 0 ? cleanInlineLatex(body.substring(0, casCalls[0].startIndex)) : '';
    const optionsHtml = casCalls.map((call, idx) => {
      const optionText = cleanInlineLatex(call.args[0]);
      const optionType = call.args[1].trim();
      const optionFeedback = cleanInlineLatex(call.args[2]);
      const isCorrect = optionType.toLowerCase().includes('correcto') && !optionType.toLowerCase().includes('incorrecto');
      return `
        <label class="quiz-casilla-option" data-correct="${isCorrect}" data-feedback="${escapeHtml(optionFeedback)}" style="display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;">
          <input type="checkbox" value="${idx}" data-correct="${isCorrect ? '1' : '0'}" data-feedback="${escapeHtml(optionFeedback)}" style="accent-color:var(--accent-color);">
          <span style="font-size:14px; color:var(--text-primary);">${optionText}</span>
        </label>
      `;
    }).join('');

    return saveBlock(`
      <div class="quiz-block quiz-casillas" style="margin:24px 0; padding:20px; background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px;">
        <h4 style="margin:0 0 12px 0; font-size:16px; color:var(--text-primary);"><i class="fa-solid fa-list-check" style="color:var(--accent-color);"></i> Selección Múltiple: ${cleanInlineLatex(questionTitle)}</h4>
        ${statementText ? `<p style="font-size:14px; color:var(--text-secondary); margin-bottom:12px;">${statementText}</p>` : ''}
        <div class="quiz-casillas-options">${optionsHtml}</div>
        <button type="button" class="btn btn-verify-casillas" onclick="verifyQuizCasillas(this)" style="margin-top:12px; padding:8px 18px; background:var(--accent-color); color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;">Verificar Selecciones</button>
        <div class="quiz-feedback" style="display:none; margin-top:12px; padding:12px; border-radius:8px;"></div>
      </div>
    `);
  });

  // 4. Términos Pareados 3 Columnas
  html = html.replace(/\\begin\{pareadostrescolumnas\}\{([^}]+)\}([\s\S]*?)\\end\{pareadostrescolumnas\}/gi, (m, title, body) => {
    let col1Text = '';
    let col2Text = '';
    let col3Text = '';
    const col1Calls = extractMacroCalls(body, 'columnaI', 1);
    if (col1Calls.length > 0) col1Text = col1Calls[0].args[0];

    const col2Calls = extractMacroCalls(body, 'columnaII', 1);
    if (col2Calls.length > 0) col2Text = col2Calls[0].args[0];

    const col3Calls = extractMacroCalls(body, 'columnaIII', 1);
    if (col3Calls.length > 0) col3Text = col3Calls[0].args[0];

    const pareoCalls = extractMacroCalls(body, 'pareotres', 2);
    const solutionMap = {};
    pareoCalls.forEach(call => {
      const pair = call.args[0].trim();
      const fb = cleanInlineLatex(call.args[1]);
      const parts = pair.split('-');
      if (parts.length === 3) {
        solutionMap[parts[0]] = { letter: parts[1].toUpperCase(), roman: parts[2].toUpperCase(), feedback: fb };
      }
    });

    const itemsCol1 = parseColumnItems(col1Text);
    const itemsCol2 = parseColumnItems(col2Text);
    const itemsCol3 = parseColumnItems(col3Text);

    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const romans = ['I', 'II', 'III', 'IV', 'V', 'VI'];

    let col1Html = itemsCol1.map((it, idx) => `<div style="padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);"><strong>${idx + 1}.</strong> ${it}</div>`).join('');
    let col2Html = itemsCol2.map((it, idx) => `<div style="padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);"><strong>${letters[idx] || (idx+1)}.</strong> ${it}</div>`).join('');
    let col3Html = itemsCol3.map((it, idx) => `<div style="padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);"><strong>${romans[idx] || (idx+1)}.</strong> ${it}</div>`).join('');

    let rowsHtml = itemsCol1.map((it, idx) => {
      const numKey = (idx + 1).toString();
      const sol = solutionMap[numKey] || { letter: '', roman: '', feedback: '' };

      const letterOpts = itemsCol2.map((_, i) => `<option value="${letters[i]}">${letters[i]}</option>`).join('');
      const romanOpts = itemsCol3.map((_, i) => `<option value="${romans[i]}">${romans[i]}</option>`).join('');

      return `
        <div class="pareo-row-item" data-num="${numKey}" data-correct-letter="${sol.letter}" data-correct-roman="${sol.roman}" data-feedback="${escapeHtml(sol.feedback)}" style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;">
          <span style="font-weight: bold; width: 70px;">Ítem ${numKey}:</span>
          <span style="font-size: 13px; color: var(--text-muted);">Letra:</span>
          <select class="pareo-select-col2" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;">
            <option value="">-- Elegir --</option>
            ${letterOpts}
          </select>
          <span style="font-size: 13px; color: var(--text-muted); margin-left: 8px;">Romano:</span>
          <select class="pareo-select-col3" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;">
            <option value="">-- Elegir --</option>
            ${romanOpts}
          </select>
        </div>
      `;
    }).join('');

    const isCurvas = title.toLowerCase().includes('curva') || title.toLowerCase().includes('geometría');
    const col2Header = isCurvas ? 'Columna 2: Curvas de nivel' : 'Columna 2: Dominios';
    const col3Header = isCurvas ? 'Columna 3: Valores de $k$ tal que $C_k\\neq\\emptyset$' : 'Columna 3: Imágenes';

    return saveBlock(`
      <div class="quiz-block quiz-pareados-3col" style="margin: 24px 0; padding: 20px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px;">
        <h4 style="margin: 0 0 16px 0; font-size: 16px; color: var(--text-primary);">
          <i class="fa-solid fa-network-wired" style="color: var(--accent-color);"></i> ${cleanInlineLatex(title)}
        </h4>

        <!-- TRES COLUMNAS LATERALES -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 20px;">
          <div>
            <h5 style="margin: 0 0 8px 0; color: var(--accent-color); font-size: 14px;">Columna 1: Funciones</h5>
            <div style="display: flex; flex-direction: column; gap: 8px;">${col1Html}</div>
          </div>
          <div>
            <h5 style="margin: 0 0 8px 0; color: var(--accent-color); font-size: 14px;">${col2Header}</h5>
            <div style="display: flex; flex-direction: column; gap: 8px;">${col2Html}</div>
          </div>
          <div>
            <h5 style="margin: 0 0 8px 0; color: var(--accent-color); font-size: 14px;">${col3Header}</h5>
            <div style="display: flex; flex-direction: column; gap: 8px;">${col3Html}</div>
          </div>
        </div>

        <!-- FILAS DE SELECCIÓN DE ASOCIACIÓN -->
        <h5 style="margin: 16px 0 10px 0; font-size: 14px; color: var(--text-primary);">Asocia cada Ítem de la Columna 1 con su Letra (Col 2) y Romano (Col 3):</h5>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${rowsHtml}
        </div>

        <button type="button" class="btn btn-verify-pareados" onclick="verifyQuizPareados3Col(this)" style="margin-top: 16px; padding: 10px 22px; background: var(--accent-color); color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-circle-check"></i> Verificar Asociaciones
        </button>

        <div class="quiz-feedback" style="display:none; margin-top:16px; padding:14px; border-radius:8px;"></div>
      </div>
    `);
  });

  return { cleanText: html, blocks: blocks };
}

function latexToHtml(raw) {
  if (!raw) return '';
  let text = stripLatexComments(raw).trim();
  if (!text) return '';

  text = replaceLatexInlineFormat(text);

  const { cleanText, blocks } = parseInteractiveQuestions(text);
  text = cleanText;

  function saveBlock(htmlStr) {
    const idx = blocks.length;
    blocks.push(htmlStr);
    return `___BLOCK_${idx}___`;
  }

  // 1. Parse environments that may contain nested latex FIRST
  text = text.replace(/\\begin\{definicion\}\{([^}]+)\}([\s\S]*?)\\end\{definicion\}/gi, (m, title, body) => {
    return saveBlock(`<div class="caja-ram caja-definicion"><div class="caja-ram-title"><i class="fa-solid fa-book-bookmark"></i> Definición: ${title}</div><div class="caja-ram-body">${latexToHtml(body)}</div></div>`);
  });

  text = text.replace(/\\begin\{alerta\}\{([^}]+)\}([\s\S]*?)\\end\{alerta\}/gi, (m, title, body) => {
    return saveBlock(`<div class="caja-ram error-comun"><div class="caja-ram-title"><i class="fa-solid fa-triangle-exclamation"></i> ${title}</div><div class="caja-ram-body">${latexToHtml(body)}</div></div>`);
  });

  text = text.replace(/\\begin\{procesamiento\}\{([^}]+)\}([\s\S]*?)\\end\{procesamiento\}/gi, (m, title, body) => {
    return saveBlock(`<div class="caja-ram caja-motivacion"><div class="caja-ram-title"><i class="fa-solid fa-gears"></i> ${title}</div><div class="caja-ram-body">${latexToHtml(body)}</div></div>`);
  });

  text = text.replace(/\\begin\{preguntaguia\}([\s\S]*?)\\end\{preguntaguia\}/gi, (m, body) => {
    return saveBlock(`<div class="caja-ram caja-motivacion"><div class="caja-ram-title">💡 Pregunta Guía</div><div class="caja-ram-body">${latexToHtml(body)}</div></div>`);
  });

  text = text.replace(/\\begin\{ejemplo\}\{([^}]+)\}([\s\S]*?)\\end\{ejemplo\}/gi, (m, title, body) => {
    return saveBlock(`<div class="caja-ram caja-definicion"><div class="caja-ram-title">💡 Ejemplo: ${title}</div><div class="caja-ram-body">${latexToHtml(body)}</div></div>`);
  });

  // 2. Lists
  text = text.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/gi, (m, body) => {
    let listItems = body.replace(/\\item\[([^\]]+)\]\s*([\s\S]*?)(?=(?:\\item|$))/gi, '<li><strong>$1</strong> $2</li>');
    listItems = listItems.replace(/\\item\s+([\s\S]*?)(?=(?:\\item|$))/gi, '<li>$1</li>');
    return saveBlock(`<ul style="margin: 8px 0; padding-left: 20px;">${listItems}</ul>`);
  });

  text = text.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/gi, (m, body) => {
    let listItems = body.replace(/\\item\[([^\]]+)\]\s*([\s\S]*?)(?=(?:\\item|$))/gi, '<li><strong>$1</strong> $2</li>');
    listItems = listItems.replace(/\\item\s+([\s\S]*?)(?=(?:\\item|$))/gi, '<li>$1</li>');
    return saveBlock(`<ol style="margin: 8px 0; padding-left: 20px;">${listItems}</ol>`);
  });

  // 3. Display math $$...$$ or \[...\]
  text = text.replace(/(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\])/g, (match) => {
    return saveBlock(`<div class="formula-block" style="text-align:center; margin: 12px 0;">${match}</div>`);
  });

  text = text.replace(/\\section\*\{([^}]+)\}/gi, (m, title) => saveBlock(`<h3>${title}</h3>`));
  text = text.replace(/\\subsection\*\{([^}]+)\}/gi, (m, title) => saveBlock(`<h4>${title}</h4>`));

  const rawChunks = text.split(/(?:\r?\n\s*\r?\n|\\par\b)/);
  const processedChunks = rawChunks.map(chunk => {
    let c = chunk.trim();
    if (!c) return '';
    const tokenMatch = c.match(/^___BLOCK_(\d+)___$/);
    if (tokenMatch) return blocks[parseInt(tokenMatch[1], 10)];
    c = replaceLatexInlineFormat(c);
    c = c.replace(/\r?\n/g, ' ');
    return `<p>${c}</p>`;
  });

  let resultHtml = processedChunks.filter(Boolean).join('\n');
  let previousHtml = '';
  while (resultHtml !== previousHtml) {
    previousHtml = resultHtml;
    resultHtml = resultHtml.replace(/___BLOCK_(\d+)___/g, (m, idx) => blocks[parseInt(idx, 10)]);
  }
  return resultHtml;
}

// Parse Exercises
function parseExercises(raw) {
  const exercisesList = [];
  if (!raw) return exercisesList;

  const envTypes = [
    { envName: 'ejercicioresuelto', defaultLevel: 'resuelto', solMacro: 'solucion' },
    { envName: 'ejerciciodemostracion', defaultLevel: 'nivel-3', solMacro: 'demostracion' },
    { envName: 'ejerciciopropuesto', defaultLevel: 'nivel-2', solMacro: 'pista' }
  ];

  envTypes.forEach(t => {
    const regex = new RegExp(`\\\\begin\\{${t.envName}\\}\\s*\\{([^}]+)\\}\\s*\\{([^}]+)\\}([\\s\\S]*?)\\\\end\\{${t.envName}\\}`, 'gi');
    let match;
    while ((match = regex.exec(raw)) !== null) {
      const title = match[1].trim();
      const level = match[2].trim();
      const body = match[3];

      const enunCalls = extractMacroCalls(body, 'enunciado', 1);
      const solCalls = extractMacroCalls(body, t.solMacro, 1);

      exercisesList.push({
        id: `ex-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: title,
        level: level || t.defaultLevel,
        statement: enunCalls.length > 0 ? latexToHtml(enunCalls[0].args[0].trim()) : latexToHtml(body.trim()),
        solution: solCalls.length > 0 ? latexToHtml(solCalls[0].args[0].trim()) : ''
      });
    }
  });

  return exercisesList;
}

// Function to process a single chapter file
function processChapterFile(filePath) {
  const texContent = fs.readFileSync(filePath, 'utf8');
  const rawMotiv = getEnvContent(texContent, 'motivacion');
  const rawTeoria = getEnvContent(texContent, 'teoria');
  const rawAplic = getEnvContent(texContent, 'aplicacion');
  const rawExerc = stripLatexComments(getEnvContent(texContent, 'ejercicios'));
  const rawFormulas = stripLatexComments(getEnvContent(texContent, 'formulas'));

  const formulaCalls = extractMacroCalls(rawFormulas, 'formula', 3);
  const formulasList = formulaCalls.map(fc => ({
    id: `form-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: fc.args[0].trim(),
    latex: fc.args[1].trim(),
    description: cleanInlineLatex(fc.args[2].trim())
  }));

  const exList = parseExercises(rawExerc);

  return {
    contentMotivation: latexToHtml(rawMotiv),
    contentTheory: latexToHtml(rawTeoria),
    contentApplication: latexToHtml(rawAplic),
    exercisesList: exList,
    formulasList: formulasList
  };
}

const cap11Data = processChapterFile('Cálculo Multivariable/1.1 Campos escalares.tex');
const cap12Data = processChapterFile('Cálculo Multivariable/1.2 Curvas y Grafos.tex');

console.log("Cap 1.1 exercises parsed:", cap11Data.exercisesList.length);
console.log("Cap 1.2 exercises parsed:", cap12Data.exercisesList.length);

let dbJs = fs.readFileSync('js/db.js', 'utf8');

// Update dbVersion check to 5.2
dbJs = dbJs.replace(/dbVersion === "[0-9\.]+"/g, 'dbVersion === "5.2"');
dbJs = dbJs.replace(/localStorage\.setItem\("alvaro_profemate_db_version", "[0-9\.]+"\);/g, 'localStorage\.setItem("alvaro_profemate_db_version", "5.2");');

// Find insertion point in db.js for calculo-multivariable
const targetMarker = "if (c.id === 'calculo-multivariable') {";
const targetIdx = dbJs.indexOf(targetMarker);
const nextElseIdx = dbJs.indexOf("} else if (c.id === 'calculo-diferencial') {", targetIdx);

if (targetIdx !== -1 && nextElseIdx !== -1) {
  const insertPos = targetIdx + targetMarker.length;
  
  const multivariableCode = `
        const u1Id = unitIdCounter++;
        const u2Id = unitIdCounter++;

        defaultUnits.push(
          { id: u1Id, courseId: c.id, unitIndex: 1, title: 'Funciones de Varias Variables', isLocked: false },
          { id: u2Id, courseId: c.id, unitIndex: 2, title: 'Cálculo Diferencial Vectorial', isLocked: false }
        );

        defaultChapters.push({
          id: chapterIdCounter++,
          unitId: u1Id,
          chapterIndex: '1.1',
          title: 'Campos Escalares',
          isCompleted: false,
          isLocked: false,
          contentMotivation: ${JSON.stringify(cap11Data.contentMotivation)},
          contentTheory: ${JSON.stringify(cap11Data.contentTheory)},
          contentApplication: ${JSON.stringify(cap11Data.contentApplication)},
          contentExercises: ${JSON.stringify(JSON.stringify(cap11Data.exercisesList))},
          contentFormulas: ${JSON.stringify(JSON.stringify(cap11Data.formulasList))}
        }, {
          id: chapterIdCounter++,
          unitId: u1Id,
          chapterIndex: '1.2',
          title: 'Curvas de Nivel y Grafos',
          isCompleted: false,
          isLocked: false,
          contentMotivation: ${JSON.stringify(cap12Data.contentMotivation)},
          contentTheory: ${JSON.stringify(cap12Data.contentTheory)},
          contentApplication: ${JSON.stringify(cap12Data.contentApplication)},
          contentExercises: ${JSON.stringify(JSON.stringify(cap12Data.exercisesList))},
          contentFormulas: ${JSON.stringify(JSON.stringify(cap12Data.formulasList))}
        });
  `;

  dbJs = dbJs.substring(0, insertPos) + multivariableCode + dbJs.substring(nextElseIdx);
  fs.writeFileSync('js/db.js', dbJs, 'utf8');
  console.log("Successfully repopulated Chapters 1.1 and 1.2 with ALL EXERCISES AND 3D LAB into db.js (v5.2)!");
}

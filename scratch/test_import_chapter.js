const fs = require('fs');

const latexText = fs.readFileSync('Cálculo Multivariable/1.1 Campos escalares.tex', 'utf8');

// Copy EXACT parseLatexChapter from js/admin.js
function parseLatexChapter(latexText) {
  const getMeta = (tag) => {
    const re = new RegExp(`%\\s*\\\\${tag}:?\\s*(.*)`, 'i');
    const m = latexText.match(re);
    return m ? m[1].trim() : '';
  };

  const metadata = {
    courseId: getMeta('ID_CURSO'),
    chapterId: getMeta('ID_CAPITULO'),
    chapterNumber: getMeta('NUMERO_CAPITULO'),
    chapterTitle: getMeta('TITULO_CAPITULO'),
    isLocked: getMeta('ESTADO_BLOQUEADO').toLowerCase() === 'true',
    isCompleted: getMeta('ESTADO_COMPLETADO').toLowerCase() === 'true'
  };

  const getEnvContent = (envName) => {
    const re = new RegExp(`\\\\begin\\{${envName}\\}([\\s\\S]*?)\\\\end\\{${envName}\\}`, 'i');
    const m = latexText.match(re);
    return m ? m[1].trim() : '';
  };

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
            if (text[i] === '{' && text[i - 1] !== '\\') depth++;
            else if (text[i] === '}' && text[i - 1] !== '\\') depth--;
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

  function parseColumnItems(colText) {
    if (!colText) return [];
    const rawItems = colText.split(/\\item\b/).map(s => s.trim()).filter(Boolean);
    return rawItems.map(item => {
      let clean = item.replace(/^\[[^\]]+\]\s*/, '');
      return clean.trim();
    });
  }

  function processQuizBlock(body, macroName, argCount) {
    const calls = extractMacroCalls(body, macroName, argCount);
    if (calls.length === 0) {
      return { statement: body.trim(), calls: [] };
    }

    let statement = '';
    let lastIndex = 0;
    calls.forEach(c => {
      statement += body.substring(lastIndex, c.startIndex);
      lastIndex = c.endIndex;
    });
    statement += body.substring(lastIndex);

    return { statement: statement.trim(), calls };
  }

  function latexToHtml(raw) {
    if (!raw) return '';
    let text = stripLatexComments(raw).trim();
    if (!text) return '';

    const blocks = [];

    function saveBlock(htmlStr) {
      const idx = blocks.length;
      blocks.push(htmlStr);
      return `___BLOCK_${idx}___`;
    }

    text = text.replace(/(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\])/g, (match) => {
      return saveBlock(`<div class="formula-block" style="text-align:center; margin: 12px 0;">${match}</div>`);
    });

    text = text.replace(/\\section\*\{([^}]+)\}/gi, (m, title) => saveBlock(`<h3>${title}</h3>`));
    text = text.replace(/\\subsection\*\{([^}]+)\}/gi, (m, title) => saveBlock(`<h4>${title}</h4>`));

    text = text.replace(/\\begin\{definicion\}\{([^}]+)\}([\s\S]*?)\\end\{definicion\}/gi, (m, title, body) => {
      return saveBlock(`<div class="caja-ram caja-definicion"><div class="caja-ram-title"><i class="fa-solid fa-book-bookmark"></i> Definición: ${title}</div><div class="caja-ram-body">${latexToHtml(body)}</div></div>`);
    });

    text = text.replace(/\\begin\{teorema\}\{([^}]+)\}([\s\S]*?)\\end\{teorema\}/gi, (m, title, body) => {
      return saveBlock(`<div class="caja-ram caja-teorema"><div class="caja-ram-title"><i class="fa-solid fa-square-root-variable"></i> Teorema: ${title}</div><div class="caja-ram-body">${latexToHtml(body)}</div></div>`);
    });

    text = text.replace(/\\begin\{(?:proof|demostracion)\}(?:\[([^\]]+)\])?([\s\S]*?)\\end\{(?:proof|demostracion)\}/gi, (m, title, body) => {
      const label = title || 'Demostración';
      return saveBlock(`<div class="caja-ram caja-demostracion" style="border-left: 3px solid var(--accent-color); padding-left: 12px; margin: 10px 0;"><p><strong>${label}:</strong> ${latexToHtml(body)}</p></div>`);
    });

    text = text.replace(/\\begin\{alerta\}\{([^}]+)\}([\s\S]*?)\\end\{alerta\}/gi, (m, title, body) => {
      return saveBlock(`<div class="caja-ram caja-choque-cognitivo"><div class="caja-ram-title"><i class="fa-solid fa-triangle-exclamation"></i> Alerta: ${title}</div><div class="caja-ram-body">${latexToHtml(body)}</div></div>`);
    });

    text = text.replace(/\\begin\{procesamiento\}\{([^}]+)\}([\s\S]*?)\\end\{procesamiento\}/gi, (m, title, body) => {
      return saveBlock(`<div class="caja-ram caja-procesamiento"><div class="caja-ram-title"><i class="fa-solid fa-gear"></i> Procedimiento: ${title}</div><div class="caja-ram-body">${latexToHtml(body)}</div></div>`);
    });

    text = text.replace(/\\begin\{ejemplo\}\{([^}]+)\}([\s\S]*?)\\end\{ejemplo\}/gi, (m, title, body) => {
      return saveBlock(`<div class="caja-ram caja-ejemplo"><div class="caja-ram-title"><i class="fa-solid fa-chalkboard-user"></i> Ejemplo: ${title}</div><div class="caja-ram-body">${latexToHtml(body)}</div></div>`);
    });

    text = text.replace(/\\begin\{preguntaguia\}([\s\S]*?)\\end\{preguntaguia\}/gi, (m, body) => {
      return saveBlock(`<div class="caja-ram caja-pregunta-guia"><div class="caja-ram-title"><i class="fa-solid fa-circle-question"></i> Pregunta Guía</div><div class="caja-ram-body">${latexToHtml(body)}</div></div>`);
    });

    // Quizzes & Pareados
    text = text.replace(/\\begin\{preguntaalternativas\}\{([^}]+)\}([\s\S]*?)\\end\{preguntaalternativas\}/gi, (m, title, body) => {
      const { statement, calls } = processQuizBlock(body, 'opcion', 3);
      const options = calls.map(c => ({
        text: c.args[0].trim(),
        isCorrect: c.args[1].trim(),
        feedback: c.args[2].trim()
      }));

      const optionsHtml = options.map((opt) => `
        <label style="display: block; margin: 8px 0; padding: 10px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer;">
          <input type="radio" name="quiz_alt_${title.replace(/\W+/g, '')}" value="${opt.isCorrect.toLowerCase() === 'correcto' ? '1' : '0'}" data-feedback="${latexToHtml(opt.feedback).replace(/"/g, '&quot;')}" style="margin-right: 8px;">
          ${latexToHtml(opt.text)}
        </label>
      `).join('');

      return saveBlock(`
        <div class="quiz-block quiz-alternativas" style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 16px; border-radius: 8px; margin: 15px 0;">
          <h4 style="margin-top:0; color: var(--accent-color);"><i class="fa-solid fa-list-check"></i> ${title}</h4>
          ${latexToHtml(statement)}
          <div>${optionsHtml}</div>
          <button type="button" class="btn btn-verify-quiz" onclick="verifyQuizAlternatives(this)" style="margin-top: 10px; padding: 6px 14px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer;">Verificar Respuesta</button>
          <div class="quiz-feedback" style="display:none; margin-top:10px; padding:10px; border-radius:6px;"></div>
        </div>
      `);
    });

    text = text.replace(/\\begin\{preguntaverdaderofalso\}\{([^}]+)\}([\s\S]*?)\\end\{preguntaverdaderofalso\}/gi, (m, title, body) => {
      let correctVal = 'V';
      let fbV = '';
      let fbF = '';

      const { statement, calls } = processQuizBlock(body, 'verdaderofalso', 3);
      if (calls.length > 0) {
        const c = calls[0];
        correctVal = c.args[0].trim().toUpperCase();
        fbF = c.args[1].trim();
        fbV = c.args[2].trim();
      }

      return saveBlock(`
        <div class="quiz-block quiz-vf" style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 16px; border-radius: 8px; margin: 15px 0;">
          <h4 style="margin-top:0; color: var(--accent-color);"><i class="fa-solid fa-circle-half-stroke"></i> ${title}</h4>
          ${latexToHtml(statement)}
          <div style="display:flex; gap:12px; margin:10px 0;">
            <button type="button" class="btn btn-vf-option" data-val="V" data-correct="${correctVal}" data-feedback="${latexToHtml(fbV).replace(/"/g, '&quot;')}" onclick="verifyQuizVF(this)" style="padding: 8px 20px; border: 1px solid var(--border-color); background: var(--bg-primary); cursor: pointer; border-radius: 6px;">Verdadero (V)</button>
            <button type="button" class="btn btn-vf-option" data-val="F" data-correct="${correctVal}" data-feedback="${latexToHtml(fbF).replace(/"/g, '&quot;')}" onclick="verifyQuizVF(this)" style="padding: 8px 20px; border: 1px solid var(--border-color); background: var(--bg-primary); cursor: pointer; border-radius: 6px;">Falso (F)</button>
          </div>
          <div class="quiz-feedback" style="display:none; margin-top:10px; padding:10px; border-radius:6px;"></div>
        </div>
      `);
    });

    text = text.replace(/\\begin\{preguntacasillas\}\{([^}]+)\}([\s\S]*?)\\end\{preguntacasillas\}/gi, (m, title, body) => {
      const { statement, calls } = processQuizBlock(body, 'casilla', 3);
      const items = calls.map(c => ({
        text: c.args[0].trim(),
        isCorrect: c.args[1].trim().toLowerCase() === 'correcto',
        feedback: c.args[2].trim()
      }));

      const itemsHtml = items.map((opt) => `
        <label style="display: block; margin: 8px 0; padding: 10px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer;">
          <input type="checkbox" data-correct="${opt.isCorrect ? '1' : '0'}" data-feedback="${latexToHtml(opt.feedback).replace(/"/g, '&quot;')}" style="margin-right: 8px;">
          ${latexToHtml(opt.text)}
        </label>
      `).join('');

      return saveBlock(`
        <div class="quiz-block quiz-casillas" style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 16px; border-radius: 8px; margin: 15px 0;">
          <h4 style="margin-top:0; color: var(--accent-color);"><i class="fa-solid fa-square-check"></i> ${title}</h4>
          ${latexToHtml(statement)}
          <div>${itemsHtml}</div>
          <button type="button" class="btn btn-verify-casillas" onclick="verifyQuizCasillas(this)" style="margin-top: 10px; padding: 6px 14px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer;">Verificar Selección</button>
          <div class="quiz-feedback" style="display:none; margin-top:10px; padding:10px; border-radius:6px;"></div>
        </div>
      `);
    });

    // 4. Términos Pareados 2 Col
    text = text.replace(/\\begin\{pareadosdoscolumnas\}\{([^}]+)\}([\s\S]*?)\\end\{pareadosdoscolumnas\}/gi, (m, title, body) => {
      let col1Text = '';
      let col2Text = '';
      const col1Calls = extractMacroCalls(body, 'columnaI', 1);
      if (col1Calls.length > 0) col1Text = col1Calls[0].args[0];

      const col2Calls = extractMacroCalls(body, 'columnaII', 1);
      if (col2Calls.length > 0) col2Text = col2Calls[0].args[0];

      const pareoCalls = extractMacroCalls(body, 'pareo', 2);
      const pareoMap = {};
      pareoCalls.forEach(c => {
        const key = c.args[0].trim();
        const fb = c.args[1].trim();
        const parts = key.split('-');
        if (parts.length >= 2) {
          const num = parts[0].trim();
          const letCode = parts[1].trim().toUpperCase();
          pareoMap[num] = { letter: letCode, feedback: fb };
        }
      });

      let statement = body;
      col1Calls.concat(col2Calls).concat(pareoCalls).forEach(c => {
        statement = statement.replace(c.fullMatch, '');
      });

      const col1Items = parseColumnItems(col1Text);
      const col2Items = parseColumnItems(col2Text);
      const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

      const col1Html = col1Items.map((item, idx) => `
        <div style="display: flex; gap: 10px; margin: 10px 0; padding: 10px; background: var(--bg-primary); border-radius: 6px; border: 1px solid var(--border-color); align-items: center;">
          <span style="background: var(--accent-color); color: white; width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px; flex-shrink: 0;">${idx + 1}</span>
          <div style="flex: 1;">${latexToHtml(item)}</div>
        </div>
      `).join('');

      const col2Html = col2Items.map((item, idx) => `
        <div style="display: flex; gap: 10px; margin: 10px 0; padding: 10px; background: var(--bg-primary); border-radius: 6px; border: 1px solid var(--border-color); align-items: center;">
          <span style="background: #10b981; color: white; width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px; flex-shrink: 0;">${letters[idx] || (idx+1)}</span>
          <div style="flex: 1;">${latexToHtml(item)}</div>
        </div>
      `).join('');

      const availableLetters = col2Items.map((_, idx) => letters[idx] || String(idx + 1));
      const selectorsHtml = col1Items.map((_, idx) => {
        const num = idx + 1;
        const info = pareoMap[num] || pareoMap[String(num)] || { letter: '', feedback: '' };
        const optionsHtml = availableLetters.map(letCode => `<option value="${letCode}">${letCode}</option>`).join('');

        return `
          <div class="pareo-row-item" data-num="${num}" data-correct-letter="${info.letter}" data-feedback="${latexToHtml(info.feedback).replace(/"/g, '&quot;')}" style="display: flex; align-items: center; gap: 12px; margin: 8px 0; padding: 10px 14px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; flex-wrap: wrap;">
            <span style="font-weight: 700; min-width: 80px;">Ítem ${num}:</span>
            <span style="color: var(--text-muted); font-size: 13px;">asociar con Letra:</span>
            <select class="pareo-select-col2" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); font-weight: 600; cursor: pointer;">
              <option value="">-- Elegir --</option>
              ${optionsHtml}
            </select>
          </div>
        `;
      }).join('');

      return saveBlock(`
        <div class="quiz-block quiz-pareados-2col" style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4 style="margin-top:0; color: var(--accent-color); font-size: 1.1rem;"><i class="fa-solid fa-diagram-project"></i> Términos Pareados: ${title}</h4>
          ${latexToHtml(statement.trim())}
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 18px 0;">
            <div>
              <h5 style="margin-top:0; margin-bottom: 8px; color: var(--accent-color); font-size: 14px;"><i class="fa-solid fa-list-ol"></i> Columna 1 (Números)</h5>
              ${col1Html}
            </div>
            <div>
              <h5 style="margin-top:0; margin-bottom: 8px; color: #10b981; font-size: 14px;"><i class="fa-solid fa-font"></i> Columna 2 (Letras)</h5>
              ${col2Html}
            </div>
          </div>

          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed var(--border-color);">
            <h5 style="margin-top:0; margin-bottom: 12px; color: var(--text-primary); font-size: 14px;"><i class="fa-solid fa-sliders"></i> Asocia los términos según corresponda:</h5>
            ${selectorsHtml}
            <button type="button" class="btn btn-verify-pareados" onclick="verifyQuizPareados2Col(this)" style="margin-top: 12px; padding: 8px 18px; background: var(--accent-color); color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Verificar Asociaciones</button>
            <div class="quiz-feedback" style="display:none; margin-top:14px; padding:12px; border-radius:8px;"></div>
          </div>
        </div>
      `);
    });

    // 5. Términos Pareados 3 Col
    text = text.replace(/\\begin\{pareadostrescolumnas\}\{([^}]+)\}([\s\S]*?)\\end\{pareadostrescolumnas\}/gi, (m, title, body) => {
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
      const pareoMap = {};
      pareoCalls.forEach(c => {
        const key = c.args[0].trim();
        const fb = c.args[1].trim();
        const parts = key.split('-');
        if (parts.length >= 3) {
          const num = parts[0].trim();
          const letCode = parts[1].trim().toUpperCase();
          const romanCode = parts[2].trim().toUpperCase();
          pareoMap[num] = { letter: letCode, roman: romanCode, feedback: fb };
        }
      });

      let statement = body;
      col1Calls.concat(col2Calls).concat(col3Calls).concat(pareoCalls).forEach(c => {
        statement = statement.replace(c.fullMatch, '');
      });

      const col1Items = parseColumnItems(col1Text);
      const col2Items = parseColumnItems(col2Text);
      const col3Items = parseColumnItems(col3Text);
      const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

      const col1Html = col1Items.map((item, idx) => `
        <div style="display: flex; gap: 8px; margin: 8px 0; padding: 10px; background: var(--bg-primary); border-radius: 6px; border: 1px solid var(--border-color); align-items: center;">
          <span style="background: var(--accent-color); color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">${idx + 1}</span>
          <div style="flex: 1; font-size: 13px;">${latexToHtml(item)}</div>
        </div>
      `).join('');

      const col2Html = col2Items.map((item, idx) => `
        <div style="display: flex; gap: 8px; margin: 8px 0; padding: 10px; background: var(--bg-primary); border-radius: 6px; border: 1px solid var(--border-color); align-items: center;">
          <span style="background: #10b981; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">${letters[idx] || (idx+1)}</span>
          <div style="flex: 1; font-size: 13px;">${latexToHtml(item)}</div>
        </div>
      `).join('');

      const col3Html = col3Items.map((item, idx) => `
        <div style="display: flex; gap: 8px; margin: 8px 0; padding: 10px; background: var(--bg-primary); border-radius: 6px; border: 1px solid var(--border-color); align-items: center;">
          <span style="background: #a855f7; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">${romans[idx] || (idx+1)}</span>
          <div style="flex: 1; font-size: 13px;">${latexToHtml(item)}</div>
        </div>
      `).join('');

      const availableLetters = col2Items.map((_, idx) => letters[idx] || String(idx + 1));
      const availableRomans = col3Items.map((_, idx) => romans[idx] || String(idx + 1));

      const selectorsHtml = col1Items.map((_, idx) => {
        const num = idx + 1;
        const info = pareoMap[num] || pareoMap[String(num)] || { letter: '', roman: '', feedback: '' };
        const optLetters = availableLetters.map(letCode => `<option value="${letCode}">${letCode}</option>`).join('');
        const optRomans = availableRomans.map(rCode => `<option value="${rCode}">${rCode}</option>`).join('');

        return `
          <div class="pareo-row-item" data-num="${num}" data-correct-letter="${info.letter}" data-correct-roman="${info.roman}" data-feedback="${latexToHtml(info.feedback).replace(/"/g, '&quot;')}" style="display: flex; align-items: center; gap: 10px; margin: 8px 0; padding: 10px 14px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; flex-wrap: wrap;">
            <span style="font-weight: 700; min-width: 70px;">Ítem ${num}:</span>
            <span style="color: var(--text-muted); font-size: 13px;">Letra:</span>
            <select class="pareo-select-col2" style="padding: 5px 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); font-weight: 600; cursor: pointer;">
              <option value="">-- Letra --</option>
              ${optLetters}
            </select>
            <span style="color: var(--text-muted); font-size: 13px; margin-left: 6px;">Romano:</span>
            <select class="pareo-select-col3" style="padding: 5px 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); font-weight: 600; cursor: pointer;">
              <option value="">-- Romano --</option>
              ${optRomans}
            </select>
          </div>
        `;
      }).join('');

      return saveBlock(`
        <div class="quiz-block quiz-pareados-3col" style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4 style="margin-top:0; color: var(--accent-color); font-size: 1.1rem;"><i class="fa-solid fa-network-wired"></i> Términos Pareados (3 Columnas): ${title}</h4>
          ${latexToHtml(statement.trim())}
          
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin: 18px 0;">
            <div>
              <h5 style="margin-top:0; margin-bottom: 8px; color: var(--accent-color); font-size: 13px;"><i class="fa-solid fa-list-ol"></i> Columna 1 (Números)</h5>
              ${col1Html}
            </div>
            <div>
              <h5 style="margin-top:0; margin-bottom: 8px; color: #10b981; font-size: 13px;"><i class="fa-solid fa-font"></i> Columna 2 (Letras)</h5>
              ${col2Html}
            </div>
            <div>
              <h5 style="margin-top:0; margin-bottom: 8px; color: #a855f7; font-size: 13px;"><i class="fa-solid fa-kaaba"></i> Columna 3 (Romanos)</h5>
              ${col3Html}
            </div>
          </div>

          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed var(--border-color);">
            <h5 style="margin-top:0; margin-bottom: 12px; color: var(--text-primary); font-size: 14px;"><i class="fa-solid fa-sliders"></i> Asocia cada Ítem con su Letra y su Número Romano correspondiente:</h5>
            ${selectorsHtml}
            <button type="button" class="btn btn-verify-pareados" onclick="verifyQuizPareados3Col(this)" style="margin-top: 12px; padding: 8px 18px; background: var(--accent-color); color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Verificar Asociaciones</button>
            <div class="quiz-feedback" style="display:none; margin-top:14px; padding:12px; border-radius:8px;"></div>
          </div>
        </div>
      `);
    });

    // Extract Lists
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

    const rawChunks = text.split(/(?:\r?\n\s*\r?\n|\\par\b)/);
    const processedChunks = rawChunks.map(chunk => {
      let c = chunk.trim();
      if (!c) return '';

      const tokenMatch = c.match(/^___BLOCK_(\d+)___$/);
      if (tokenMatch) {
        return blocks[parseInt(tokenMatch[1], 10)];
      }

      c = c.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>');
      c = c.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>');
      c = c.replace(/\\underline\{([^}]+)\}/g, '<u>$1</u>');
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

  const rawMotiv = getEnvContent('motivacion');
  const rawTeoria = getEnvContent('teoria');
  const rawAplic = getEnvContent('aplicacion');
  const rawExerc = stripLatexComments(getEnvContent('ejercicios'));
  const rawFormulas = stripLatexComments(getEnvContent('formulas'));

  return {
    metadata,
    contentMotivation: latexToHtml(rawMotiv),
    contentTheory: latexToHtml(rawTeoria),
    contentApplication: latexToHtml(rawAplic)
  };
}

const res = parseLatexChapter(latexText);
console.log("METADATA:", res.metadata);
console.log("APPLICATION HAS PAREADOS:", res.contentApplication.includes('quiz-pareados-3col'));

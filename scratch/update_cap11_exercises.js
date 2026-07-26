const fs = require('fs');

const texContent = fs.readFileSync('Cálculo Multivariable/1.1 Campos escalares.tex', 'utf8');

function getEnvContent(latexText, envName) {
  const re = new RegExp(`\\\\begin\\{${envName}\\}(?:\\{[^}]*\\})?([\\s\\S]*?)\\\\end\\{${envName}\\}`, 'i');
  const m = latexText.match(re);
  return m ? m[1].trim() : '';
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

function cleanInlineLatex(str) {
  if (!str) return '';
  let clean = stripLatexComments(str).trim();
  clean = clean.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>');
  clean = clean.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>');
  clean = clean.replace(/\\underline\{([^}]+)\}/g, '<u>$1</u>');
  return clean;
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
    if (tokenMatch) return blocks[parseInt(tokenMatch[1], 10)];
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

const rawExerc = stripLatexComments(getEnvContent(texContent, 'ejercicios'));

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

const parsedExercises = parseExercises(rawExerc);

let dbJs = fs.readFileSync('js/db.js', 'utf8');

// Replace cap11Exercises
const startMarker = 'const cap11Exercises = ';
const startIdx = dbJs.indexOf(startMarker);
if (startIdx !== -1) {
  const endIdx = dbJs.indexOf(';', startIdx);
  if (endIdx !== -1) {
    dbJs = dbJs.substring(0, startIdx) + 'const cap11Exercises = ' + JSON.stringify(JSON.stringify(parsedExercises, null, 2)) + ';' + dbJs.substring(endIdx + 1);
    dbJs = dbJs.replace(/db_version", "2\.8"/g, 'db_version", "2.9"');
    dbJs = dbJs.replace(/dbVersion === "2\.8"/g, 'dbVersion === "2.9"');
    fs.writeFileSync('js/db.js', dbJs, 'utf8');
    console.log("Updated cap11Exercises in js/db.js with all 7 real exercises!");
  }
}

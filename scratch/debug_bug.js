const fs = require('fs');

const texSnippet = `
\\begin{definicion}{Campo Escalar}
  Un campo escalar es una función $f$.
  Matemáticamente lo expresamos como:
  $$ f \\colon D \\subseteq \\mathbb{R}^n \\to \\mathbb{R} $$
  Donde $n$ es la dimensión.
\\end{definicion}
`;

let depth = 0;

function latexToHtml(raw) {
  depth++;
  const myDepth = depth;
  console.log(`[Depth ${myDepth}] START with raw len=${raw.length}`);
  if (!raw) { depth--; return ''; }
  let text = raw.trim();
  if (!text) { depth--; return ''; }

  const blocks = [];

  function saveBlock(htmlStr) {
    const idx = blocks.length;
    blocks.push(htmlStr);
    console.log(`[Depth ${myDepth}] saveBlock idx=${idx}, total blocks=${blocks.length}`);
    return `___BLOCK_${idx}___`;
  }

  // 1. Display math
  text = text.replace(/(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\])/g, (match) => {
    return saveBlock(`<div class="formula-block" style="text-align:center; margin: 12px 0;">${match}</div>`);
  });

  // 2. Definicion
  text = text.replace(/\\begin\{definicion\}\{([^}]+)\}([\s\S]*?)\\end\{definicion\}/gi, (m, title, body) => {
    return saveBlock(`<div class="caja-ram caja-definicion"><div class="caja-ram-title">Definición: ${title}</div><div class="caja-ram-body">${latexToHtml(body)}</div></div>`);
  });

  const rawChunks = text.split(/(?:\r?\n\s*\r?\n|\\par\b)/);
  const processedChunks = rawChunks.map(chunk => {
    let c = chunk.trim();
    if (!c) return '';
    const tokenMatch = c.match(/^___BLOCK_(\d+)___$/);
    if (tokenMatch) return blocks[parseInt(tokenMatch[1], 10)];
    c = c.replace(/\r?\n/g, ' ');
    return `<p>${c}</p>`;
  });

  let resultHtml = processedChunks.filter(Boolean).join('\n');
  console.log(`[Depth ${myDepth}] resultHtml before while loop:`, resultHtml);
  console.log(`[Depth ${myDepth}] blocks array len=${blocks.length}:`, blocks);

  let previousHtml = '';
  while (resultHtml !== previousHtml) {
    previousHtml = resultHtml;
    resultHtml = resultHtml.replace(/___BLOCK_(\d+)___/g, (m, idx) => {
      const val = blocks[parseInt(idx, 10)];
      console.log(`[Depth ${myDepth}] replace ___BLOCK_${idx}___ with:`, val);
      return val;
    });
  }

  console.log(`[Depth ${myDepth}] END returning:`, resultHtml);
  depth--;
  return resultHtml;
}

latexToHtml(texSnippet);

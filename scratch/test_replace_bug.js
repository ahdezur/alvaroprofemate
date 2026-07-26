const body = `
Un campo escalar definido como $f: D \\subseteq \\mathbb{R}^3 \\to \\mathbb{R}$ toma una coordenada del espacio tridimensional como entrada y produce un vector como salida.

    \\verdaderofalso{F}
      {Incorrecto. Recuerda la palabra \`\`escalar''. La salida es siempre un único número real (como una temperatura o una altitud), no un vector.}
      {¡Correcto! Entregamos un punto o vector de entrada $(x,y,z)$, pero la función nos devuelve un escalar (un único número real).}
`;

function extractMacroCalls(text, macroName, argCount) {
  const results = [];
  const regex = new RegExp(`\\\\${macroName}\\s*\\{`, 'gi');
  let match;
  while ((match = regex.exec(text)) !== null) {
    const startIndex = match.index + match[0].length - 1;
    const args = [];
    let i = startIndex;

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
        startIndex: match.index,
        endIndex: i,
        fullMatch: text.substring(match.index, i),
        args: args
      });
    }
  }
  return results;
}

const calls = extractMacroCalls(body, 'verdaderofalso', 3);
console.log("Found calls count:", calls.length);

if (calls.length > 0) {
  const c = calls[0];
  console.log("Full match extracted:");
  console.log(JSON.stringify(c.fullMatch));
  const statement = (body.substring(0, c.startIndex) + body.substring(c.endIndex)).trim();
  console.log("\nStatement after removal by index slice:");
  console.log(statement);

  const statementByReplace = body.replace(c.fullMatch, '').trim();
  console.log("\nStatement after removal by body.replace():");
  console.log(statementByReplace);
}

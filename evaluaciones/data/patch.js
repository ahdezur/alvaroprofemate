const fs = require('fs');
const path = '/Users/alvaro/Documents/Evaluaciones/Control_4_MA1101_2026_Otono_plantilla.tex';

let text = fs.readFileSync(path, 'utf8');

// Restaurar a textcolor que es más robusto en MathJax 3 cuando el paquete color está cargado
text = text.replace(/\\color\{([^}]+)\}\{([^}]+)\}/g, '\\textcolor{$1}{$2}');

// Asegurar que \require{color} tenga un espacio o salto de línea antes de \begin{array}
text = text.replace(/\\require\{color\}\\begin\{array\}/g, '\\require{color}\n\\begin{array}');

fs.writeFileSync(path, text);
console.log('Parche de colores aplicado.');

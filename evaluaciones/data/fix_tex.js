const fs = require('fs');
const path = '/Users/alvaro/Documents/Evaluaciones/Control_4_MA1101_2026_Otono_plantilla.tex';

let text = fs.readFileSync(path, 'utf8');

// Eliminar los newcommand para no dejar basura inválida
text = text.replace(/\\newcommand\{\\RR\}\{\\mathbb\{R\}\}\n?/g, '');
text = text.replace(/\\newcommand\{\\C\}\{\\mathbb\{C\}\}\n?/g, '');
text = text.replace(/\\newcommand\{\\Z\}\{\\mathbb\{Z\}\}\n?/g, '');
text = text.replace(/\\newcommand\{\\N\}\{\\mathbb\{N\}\}\n?/g, '');
text = text.replace(/\\newcommand\{\\sen\}\{\\operatorname\{sen\}\}\n?/g, '');

// Reemplazar macros por sus equivalentes en todo el texto, usando lookahead negativo para evitar romper macros más largas
text = text.replace(/\\RR(?![a-zA-Z])/g, '\\mathbb{R}');
text = text.replace(/\\Z(?![a-zA-Z])/g, '\\mathbb{Z}');
text = text.replace(/\\C(?![a-zA-Z])/g, '\\mathbb{C}');
text = text.replace(/\\N(?![a-zA-Z])/g, '\\mathbb{N}');
text = text.replace(/\\sen(?![a-zA-Z])/g, '\\sin');

// Reemplazar textbf e Indicación
text = text.replace(/\\textbf\{Indicación:\}/g, '<b>Indicación:</b>');

// Reemplazar medskip y textit (ej: \medskip \textit{...})
text = text.replace(/\\medskip\s*\\textit\{([^}]+)\}/g, '<br><br><i>$1</i>');

// Para los colores, MathJax necesita \require{color} si no está cargado por defecto.
// Lo más seguro es mantener \textcolor y asegurar que MathJax lo procese, 
// o inyectar \require{color} al principio.
// Cambiemos \textcolor por \color pero inyectando \require{color}
text = text.replace(/\\begin\{array\}/g, '\\require{color}\\begin{array}');
text = text.replace(/\\textcolor\{([^}]+)\}\{([^}]+)\}/g, '\\color{$1}{$2}');

fs.writeFileSync(path, text);
console.log('Fichero LaTeX corregido.');

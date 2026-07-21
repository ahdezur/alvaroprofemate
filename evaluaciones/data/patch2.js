const fs = require('fs');
const path = '/Users/alvaro/Documents/Evaluaciones/Control_4_MA1101_2026_Otono_plantilla.tex';
let text = fs.readFileSync(path, 'utf8');

// Fix broken <i> tags
text = text.replace(/<br><br><i>Veamos que \$\\cdot\$ es una ley de composición interna en \$A\^\{\\times<\/i>\$:\}/g, '<br><br><i>Veamos que $\\cdot$ es una ley de composición interna en $A^{\\times}$:</i>');
text = text.replace(/<br><br><i>\$\\cdot\$ es asociativa en \$A\^\{\\times<\/i>\$:\}/g, '<br><br><i>$\\cdot$ es asociativa en $A^{\\times}$:</i>');
text = text.replace(/<br><br><i>\$\\cdot\$ tiene neutro en \$A\^\{\\times<\/i>\$:\}/g, '<br><br><i>$\\cdot$ tiene neutro en $A^{\\times}$:</i>');
text = text.replace(/<br><br><i>Cada \$a\\in A\^\{\\times<\/i>\$ tiene inverso para \$\\cdot\$ en \$A\^\{\\times\}\$:\}/g, '<br><br><i>Cada $a\\in A^{\\times}$ tiene inverso para $\\cdot$ en $A^{\\times}$:</i>');

// Fallback robusto para colores de MathJax
text = text.replace(/\\textcolor\{red\}\{1\}/g, '\\mathbf{1}');
text = text.replace(/\\textcolor\{blue\}\{5\}/g, '\\mathbf{5}');
text = text.replace(/\\textcolor\{blue\}\{1\}/g, '\\mathbf{1}');

// También quitar \require{color} si está
text = text.replace(/\\require\{color\}\n/g, '');

fs.writeFileSync(path, text);
console.log('Parche 2 aplicado.');

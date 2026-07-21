const fs = require('fs');
const path = '/Users/alvaro/Documents/Web/evaluaciones/data/preguntas.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const contexto1a = `Respecto de la función<br>$$f(x,y)=\\begin{cases}\\displaystyle \\frac{x^2y}{x^2+y^2}, & (x,y)\\neq(0,0)\\\\[0.2cm]0, & (x,y)=(0,0)\\end{cases}$$`;

data.forEach(q => {
  if (q.id === 'p1-a-i-derivadas-parciales') {
    q.numeracion_personalizada = '1a-i';
    q.contexto = contexto1a;
    q.enunciado = "calcule, si existen, $\\displaystyle \\frac{\\partial f}{\\partial x}(x,y)$ y $\\displaystyle \\frac{\\partial f}{\\partial y}(x,y)$ para $(x,y)\\in\\mathbb R^2$.";
  }
  if (q.id === 'p1-a-ii-diferenciabilidad') {
    q.numeracion_personalizada = '1a-ii';
    q.contexto = contexto1a;
    q.enunciado = "Decida si la función es diferenciable en el origen.";
  }
  if (q.id === 'p1-b-identidad-derivadas') {
    q.numeracion_personalizada = '1b';
    q.contexto = null; // Sin contexto
  }
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log("Q1 actualizada con contexto y numeración.");

const fs = require('fs');
const path = '/Users/alvaro/Documents/Web/evaluaciones/data/preguntas.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Contexto común para P3
const contextoP3 = `El empuje total que ejerce un fluido de densidad $\\rho$ sobre una superficie cerrada $S$, con normal apuntando al exterior, está dado por<br>$$E=-\\int_S\\vec F\\cdot\\overrightarrow{dA}$$<br>donde<br>$$\\vec F(x,y,z)=\\bigl(0,0,\\rho g(H-z)\\bigr)$$<br>Aquí $g$ es la constante de gravedad y $H$ es la altura del nivel del fluido. Se sumergen completamente una esfera de radio $R$ y un cilindro tapado de radio $R$ y altura $2R$.<br><br><div style="text-align:center;"><img src="Examenfig2.jpg" alt="Imagen de apoyo" style="max-width: 50%;"></div><br><br>Se recuerda que<br>$$V_{\\mathrm{esfera}}=\\frac43\\pi R^3, \\qquad A_{\\mathrm{esfera}}=4\\pi R^2$$<br>y, para un cilindro tapado de radio $R$ y altura $h$,<br>$$V_{\\mathrm{cilindro}}=\\pi R^2h, \\qquad A_{\\mathrm{cilindro}}=2\\pi R^2+2\\pi Rh$$<br>La esfera de radio $R$ centrada en $(0,0,h)$ puede parametrizarse mediante<br>$$\\vec r(\\phi,\\theta)=\\bigl(R\\sin\\phi\\cos\\theta,\\,R\\sin\\phi\\sin\\theta,\\,h+R\\cos\\phi\\bigr)$$<br>con $0\\leq\\phi\\leq\\pi$ y $0\\leq\\theta\\leq2\\pi$.`;

const prefixToRemove = `\\noindent\\textbf{Contexto para las preguntas 3(a), 3(b) y 3(c).}<br><br>El empuje total que ejerce un fluido de densidad $\\rho$ sobre una superficie cerrada $S$, con normal apuntando al exterior, está dado por<br>$$E=-\\int_S\\vec F\\cdot\\overrightarrow{dA}$$<br>donde<br>$$\\vec F(x,y,z)=\\bigl(0,0,\\rho g(H-z)\\bigr)$$<br>Aquí $g$ es la constante de gravedad y $H$ es la altura del nivel del fluido. Se sumergen completamente una esfera de radio $R$ y un cilindro tapado de radio $R$ y altura $2R$.<br><br><div style="text-align:center;"><img src="Examenfig2.jpg" alt="Imagen de apoyo" style="max-width: 50%;"></div><br><br>Se recuerda que<br>$$V_{\\mathrm{esfera}}=\\frac43\\pi R^3, \\qquad A_{\\mathrm{esfera}}=4\\pi R^2$$<br>y, para un cilindro tapado de radio $R$ y altura $h$,<br>$$V_{\\mathrm{cilindro}}=\\pi R^2h, \\qquad A_{\\mathrm{cilindro}}=2\\pi R^2+2\\pi Rh$$<br>La esfera de radio $R$ centrada en $(0,0,h)$ puede parametrizarse mediante<br>$$\\vec r(\\phi,\\theta)=\\bigl(R\\sin\\phi\\cos\\theta,\\,R\\sin\\phi\\sin\\theta,\\,h+R\\cos\\phi\\bigr)$$<br>con $0\\leq\\phi\\leq\\pi$ y $0\\leq\\theta\\leq2\\pi$.<br><hr><br>`;

data.forEach(q => {
  if (q.id === 'p1-a-i-derivadas-parciales') q.numeracion_personalizada = '1a-i';
  if (q.id === 'p1-a-ii-diferenciabilidad') q.numeracion_personalizada = '1a-ii';
  if (q.id === 'p1-b-identidad-derivadas') q.numeracion_personalizada = '1b';
  if (q.id === 'p2-a-cambio-orden') q.numeracion_personalizada = '2a';
  if (q.id === 'p2-b-polares') q.numeracion_personalizada = '2b';

  if (q.id === 'p3-a-empuje-esfera') {
    q.numeracion_personalizada = '3a';
    q.contexto = contextoP3;
    q.enunciado = q.enunciado.replace(prefixToRemove, '');
  }
  if (q.id === 'p3-b-empuje-cilindro') {
    q.numeracion_personalizada = '3b';
    q.contexto = contextoP3;
    q.enunciado = q.enunciado.replace(prefixToRemove, '');
  }
  if (q.id === 'p3-c-comparacion-arquimedes') {
    q.numeracion_personalizada = '3c';
    q.contexto = contextoP3;
    q.enunciado = q.enunciado.replace(prefixToRemove, '');
  }
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));

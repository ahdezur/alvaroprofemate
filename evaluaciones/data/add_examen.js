const fs = require('fs');

const pathPreguntas = '/Users/alvaro/Documents/Web/evaluaciones/data/preguntas.json';
const pathEvaluaciones = '/Users/alvaro/Documents/Web/evaluaciones/data/evaluaciones.json';

const preguntasData = JSON.parse(fs.readFileSync(pathPreguntas, 'utf8'));
const evaluacionesData = JSON.parse(fs.readFileSync(pathEvaluaciones, 'utf8'));

// Contexto común para P3
const contextoP3 = `\\noindent\\textbf{Contexto para las preguntas 3(a), 3(b) y 3(c).}<br><br>El empuje total que ejerce un fluido de densidad $\\rho$ sobre una superficie cerrada $S$, con normal apuntando al exterior, está dado por<br>$$E=-\\int_S\\vec F\\cdot\\overrightarrow{dA}$$<br>donde<br>$$\\vec F(x,y,z)=\\bigl(0,0,\\rho g(H-z)\\bigr)$$<br>Aquí $g$ es la constante de gravedad y $H$ es la altura del nivel del fluido. Se sumergen completamente una esfera de radio $R$ y un cilindro tapado de radio $R$ y altura $2R$.<br><br><div style="text-align:center;"><img src="Examenfig2.jpg" alt="Imagen de apoyo" style="max-width: 50%;"></div><br><br>Se recuerda que<br>$$V_{\\mathrm{esfera}}=\\frac43\\pi R^3, \\qquad A_{\\mathrm{esfera}}=4\\pi R^2$$<br>y, para un cilindro tapado de radio $R$ y altura $h$,<br>$$V_{\\mathrm{cilindro}}=\\pi R^2h, \\qquad A_{\\mathrm{cilindro}}=2\\pi R^2+2\\pi Rh$$<br>La esfera de radio $R$ centrada en $(0,0,h)$ puede parametrizarse mediante<br>$$\\vec r(\\phi,\\theta)=\\bigl(R\\sin\\phi\\cos\\theta,\\,R\\sin\\phi\\sin\\theta,\\,h+R\\cos\\phi\\bigr)$$<br>con $0\\leq\\phi\\leq\\pi$ y $0\\leq\\theta\\leq2\\pi$.<br><hr><br>`;

const nuevasPreguntas = [
  {
    "id": "p1-a-i-derivadas-parciales",
    "puntaje": 5,
    "dificultad": "Media",
    "temas": ["Derivadas parciales", "funciones definidas por partes"],
    "enunciado": "Respecto de la función<br>$$f(x,y)=\\begin{cases}\\displaystyle \\frac{x^2y}{x^2+y^2}, & (x,y)\\neq(0,0)\\\\[0.2cm]0, & (x,y)=(0,0)\\end{cases}$$<br>calcule, si existen, $\\displaystyle \\frac{\\partial f}{\\partial x}(x,y)$ y $\\displaystyle \\frac{\\partial f}{\\partial y}(x,y)$ para $(x,y)\\in\\mathbb R^2$.",
    "pistas": [
      "Para $(x,y)\\neq(0,0)$ utilice la regla del cociente. En el origen debe emplear directamente la definición de derivada parcial."
    ],
    "solucion": "Para $(x,y)\\neq(0,0)$, aplicando la regla del cociente,<br>$$\\frac{\\partial f}{\\partial x}(x,y)=\\frac{2xy(x^2+y^2)-2x(x^2y)}{(x^2+y^2)^2}=\\frac{2xy^3}{(x^2+y^2)^2}$$<br>y<br>$$\\frac{\\partial f}{\\partial y}(x,y)=\\frac{x^2(x^2+y^2)-2y(x^2y)}{(x^2+y^2)^2}=\\frac{x^2(x^2-y^2)}{(x^2+y^2)^2}$$<br><br>En el origen, por definición,<br>$$\\frac{\\partial f}{\\partial x}(0,0)=\\lim_{h\\to0}\\frac{f(h,0)-f(0,0)}{h}=\\lim_{h\\to0}\\frac{0}{h}=0$$<br>y<br>$$\\frac{\\partial f}{\\partial y}(0,0)=\\lim_{h\\to0}\\frac{f(0,h)-f(0,0)}{h}=\\lim_{h\\to0}\\frac{0}{h}=0$$<br>Por lo tanto,<br>$$\\frac{\\partial f}{\\partial x}(x,y)=\\begin{cases}\\displaystyle\\frac{2xy^3}{(x^2+y^2)^2},&(x,y)\\neq(0,0)\\\\[0.2cm]0,&(x,y)=(0,0)\\end{cases}$$<br>y<br>$$\\frac{\\partial f}{\\partial y}(x,y)=\\begin{cases}\\displaystyle\\frac{x^2(x^2-y^2)}{(x^2+y^2)^2},&(x,y)\\neq(0,0)\\\\[0.2cm]0,&(x,y)=(0,0)\\end{cases}$$",
    "criterios_correccion": [
      { "descripcion": "Calcula correctamente $\\frac{\\partial f}{\\partial x}$ para $(x,y)\\neq(0,0)$", "puntaje": 1 },
      { "descripcion": "Calcula correctamente $\\frac{\\partial f}{\\partial y}$ para $(x,y)\\neq(0,0)$", "puntaje": 1 },
      { "descripcion": "Usa la definición para calcular $\\frac{\\partial f}{\\partial x}(0,0)$", "puntaje": 1 },
      { "descripcion": "Usa la definición para calcular $\\frac{\\partial f}{\\partial y}(0,0)$", "puntaje": 1 },
      { "descripcion": "Presenta ambas derivadas parciales mediante expresiones definidas por partes", "puntaje": 1 }
    ],
    "errores_frecuentes": [
      "Sustituir $(0,0)$ en las fórmulas obtenidas mediante la regla del cociente, aunque esas fórmulas solo son válidas fuera del origen.",
      "Concluir que una derivada parcial no existe solo porque la fórmula del cociente produce una indeterminación en el origen."
    ]
  },
  {
    "id": "p1-a-ii-diferenciabilidad",
    "puntaje": 5,
    "dificultad": "Media",
    "temas": ["Diferenciabilidad", "aproximación lineal", "límites en varias variables"],
    "enunciado": "Decida si la función<br>$$f(x,y)=\\begin{cases}\\displaystyle \\frac{x^2y}{x^2+y^2}, & (x,y)\\neq(0,0)\\\\[0.2cm]0, & (x,y)=(0,0)\\end{cases}$$<br>es diferenciable en el origen.",
    "pistas": [
      "Como las derivadas parciales en el origen son nulas, si $f$ fuera diferenciable en $(0,0)$ su aplicación lineal candidata sería la aplicación nula.",
      "Examine el cociente de diferenciabilidad a lo largo de la recta $y=x$."
    ],
    "solucion": "De la pregunta anterior,<br>$$\\frac{\\partial f}{\\partial x}(0,0)=0,\\qquad\\frac{\\partial f}{\\partial y}(0,0)=0$$<br>Por lo tanto, si $f$ fuera diferenciable en $(0,0)$, debería cumplirse<br>$$\\lim_{(x,y)\\to(0,0)}\\frac{f(x,y)-f(0,0)-0x-0y}{\\sqrt{x^2+y^2}}=0$$<br>Es decir,<br>$$\\lim_{(x,y)\\to(0,0)}\\frac{f(x,y)}{\\sqrt{x^2+y^2}}=0$$<br>Sin embargo, tomando la trayectoria $y=x$, con $x\\neq0$,<br>$$f(x,x)=\\frac{x^3}{2x^2}=\\frac{x}{2}$$<br>y entonces<br>$$\\frac{f(x,x)}{\\sqrt{x^2+x^2}}=\\frac{x/2}{\\sqrt{2}\\,|x|}=\\frac{1}{2\\sqrt{2}}\\frac{x}{|x|}$$<br>Este cociente vale $\\frac{1}{2\\sqrt{2}}$ cuando $x>0$ y $-\\frac{1}{2\\sqrt{2}}$ cuando $x<0$, por lo que no tiende a cero.<br><br>En consecuencia, $f$ no es diferenciable en $(0,0)$.",
    "criterios_correccion": [
      { "descripcion": "Identifica correctamente que la aplicación lineal candidata es la aplicación nula", "puntaje": 1 },
      { "descripcion": "Plantea el cociente que caracteriza la diferenciabilidad en el origen", "puntaje": 1 },
      { "descripcion": "Escoge una trayectoria adecuada, por ejemplo $y=x$", "puntaje": 1 },
      { "descripcion": "Calcula correctamente el cociente sobre la trayectoria elegida", "puntaje": 1 },
      { "descripcion": "Concluye justificadamente que $f$ no es diferenciable en el origen", "puntaje": 1 }
    ],
    "errores_frecuentes": [
      "Afirmar que la existencia de las derivadas parciales en el origen implica diferenciabilidad.",
      "Estudiar únicamente la continuidad de $f$; la continuidad es necesaria, pero no basta para demostrar diferenciabilidad."
    ]
  },
  {
    "id": "p1-b-identidad-derivadas",
    "puntaje": 10,
    "dificultad": "Media",
    "temas": ["Derivadas parciales de segundo orden", "regla de la cadena"],
    "enunciado": "Suponga que $f,g:\\mathbb R\\to\\mathbb R$ son funciones dos veces diferenciables. Defina $h:\\mathbb R^2\\to\\mathbb R$ mediante<br>$$h(x,y)=xf(x+y)+yg(x+y)$$<br>Muestre que<br>$$\\frac{\\partial^2h}{\\partial x^2}-2\\frac{\\partial^2h}{\\partial y\\partial x}+\\frac{\\partial^2h}{\\partial y^2}=0$$",
    "pistas": [
      "Introduzca la variable auxiliar $s=x+y$ y calcule cuidadosamente las derivadas de primer y segundo orden.",
      "También puede reconocer el operador $(\\partial_x-\\partial_y)^2$."
    ],
    "solucion": "Sea $s=x+y$. Entonces<br>$$h(x,y)=xf(s)+yg(s)$$<br>Calculamos primero<br>$$h_x=f(s)+xf'(s)+yg'(s)$$<br>y<br>$$h_y=xf'(s)+g(s)+yg'(s)$$<br>Luego,<br>$$h_{xx}=2f'(s)+xf''(s)+yg''(s)$$<br>$$h_{yx}=f'(s)+xf''(s)+g'(s)+yg''(s)$$<br>y<br>$$h_{yy}=xf''(s)+2g'(s)+yg''(s)$$<br>Por consiguiente,<br>\\begin{align*}h_{xx}-2h_{yx}+h_{yy}&=2f'(s)+xf''(s)+yg''(s)\\\\&\\quad-2\\bigl(f'(s)+xf''(s)+g'(s)+yg''(s)\\bigr)\\\\&\\quad+xf''(s)+2g'(s)+yg''(s)\\\\&=0\\end{align*}<br>como se quería demostrar.",
    "criterios_correccion": [
      { "descripcion": "Introduce correctamente $s=x+y$ o aplica de manera equivalente la regla de la cadena", "puntaje": 1 },
      { "descripcion": "Calcula correctamente $h_x$", "puntaje": 1 },
      { "descripcion": "Calcula correctamente $h_y$", "puntaje": 1 },
      { "descripcion": "Calcula correctamente $h_{xx}$", "puntaje": 2 },
      { "descripcion": "Calcula correctamente $h_{yx}$", "puntaje": 2 },
      { "descripcion": "Calcula correctamente $h_{yy}$", "puntaje": 2 },
      { "descripcion": "Sustituye, simplifica y obtiene la identidad igual a cero", "puntaje": 1 }
    ],
    "errores_frecuentes": [
      "Olvidar que al derivar $f(x+y)$ o $g(x+y)$ aparece la derivada de la función compuesta.",
      "Confundir $h_{yx}$ con la derivación de $h_y$ respecto de $y$ en lugar de respecto de $x$."
    ]
  },
  {
    "id": "p2-a-cambio-orden",
    "puntaje": 10,
    "dificultad": "Alta",
    "temas": ["Integrales triples", "cambio del orden de integración", "descripción de regiones"],
    "enunciado": "Considere la integral triple<br>$$\\int_{-1}^{1}\\int_{-x^3}^{1}\\int_{0}^{x^3+y}e^{z^2}\\,dz\\,dy\\,dx$$<br>Reescriba la integral en el orden de integración $dx\\,dz\\,dy$. No es necesario calcular su valor.<br><br><div style=\"text-align:center;\"><img src=\"Examenfig1.jpg\" alt=\"Imagen de apoyo\" style=\"max-width: 47%;\"></div>",
    "pistas": [
      "La región está determinada por $-1\\leq x\\leq1$, $-x^3\\leq y\\leq1$ y $0\\leq z\\leq x^3+y$.",
      "Despeje $x$ desde la desigualdad $z\\leq x^3+y$, usando la raíz cúbica real."
    ],
    "solucion": "La región de integración es<br>$$D=\\left\\{(x,y,z):-1\\leq x\\leq1,\\ -x^3\\leq y\\leq1,\\ 0\\leq z\\leq x^3+y\\right\\}$$<br>La desigualdad<br>$$z\\leq x^3+y$$<br>equivale a<br>$$x^3\\geq z-y$$<br>y, como la función cúbica es creciente,<br>$$x\\geq\\sqrt[3]{z-y}$$<br>Además, $x\\leq1$. Para que exista un valor de $x$ en ese intervalo se requiere<br>$$\\sqrt[3]{z-y}\\leq1$$<br>lo que equivale a<br>$$z\\leq y+1$$<br>Como $z\\geq0$, necesariamente $y\\geq-1$. Por otra parte, del enunciado original se tiene $y\\leq1$. Así,<br>$$-1\\leq y\\leq1,\\qquad 0\\leq z\\leq y+1,\\qquad \\sqrt[3]{z-y}\\leq x\\leq1$$<br>Por lo tanto, la integral en el orden solicitado es<br>$$\\int_{-1}^{1}\\int_{0}^{y+1}\\int_{\\sqrt[3]{z-y}}^{1}e^{z^2}\\,dx\\,dz\\,dy$$",
    "criterios_correccion": [
      { "descripcion": "Describe correctamente la región a partir de los límites originales", "puntaje": 2 },
      { "descripcion": "Despeja correctamente $x\\geq\\sqrt[3]{z-y}$", "puntaje": 2 },
      { "descripcion": "Determina el intervalo global $-1\\leq y\\leq1$", "puntaje": 2 },
      { "descripcion": "Determina correctamente $0\\leq z\\leq y+1$", "puntaje": 2 },
      { "descripcion": "Escribe la integral completa en el orden $dx\\,dz\\,dy$", "puntaje": 2 }
    ],
    "errores_frecuentes": [
      "Usar una raíz cúbica con signo $\\pm$; la función $x\\mapsto x^3$ es biyectiva en $\\mathbb R$.",
      "Mantener límites que dependan de una variable que se integra antes."
    ]
  },
  {
    "id": "p2-b-polares",
    "puntaje": 10,
    "dificultad": "Alta",
    "temas": ["Cambio a coordenadas polares", "integrales dobles"],
    "enunciado": "Calcule<br>$$\\int_R \\frac{y^2}{x^2}\\sin\\left(\\frac{x^2+y^2}{x}\\right)\\,dA$$<br>donde<br>$$R=\\left\\{(x,y)\\in\\mathbb R^2:\\pi x\\leq x^2+y^2\\leq2\\pi x,\\ -x\\leq y\\leq x\\right\\}$$<br><br><div style=\"text-align:center;\"><img src=\"Examenfig3.jpg\" alt=\"Imagen de apoyo\" style=\"max-width: 47%;\"></div>",
    "pistas": [
      "En coordenadas polares, $x=r\\cos\\theta$, $y=r\\sin\\theta$ y $dA=r\\,dr\\,d\\theta$.",
      "Después de pasar a polares, utilice el cambio $u=r\\sec\\theta$."
    ],
    "solucion": "En coordenadas polares,<br>$$x=r\\cos\\theta,\\qquad y=r\\sin\\theta$$<br>Las desigualdades radiales quedan<br>$$\\pi r\\cos\\theta\\leq r^2\\leq2\\pi r\\cos\\theta$$<br>y, para $r>0$,<br>$$\\pi\\cos\\theta\\leq r\\leq2\\pi\\cos\\theta$$<br>Las desigualdades $-x\\leq y\\leq x$ determinan<br>$$-\\frac{\\pi}{4}\\leq\\theta\\leq\\frac{\\pi}{4}$$<br>Por otra parte,<br>$$\\frac{y^2}{x^2}=\\tan^2\\theta,\\qquad \\frac{x^2+y^2}{x}=\\frac{r}{\\cos\\theta}=r\\sec\\theta$$<br>Así,<br>$$I=\\int_{-\\pi/4}^{\\pi/4}\\int_{\\pi\\cos\\theta}^{2\\pi\\cos\\theta}\\tan^2\\theta\\,\\sin(r\\sec\\theta)\\,r\\,dr\\,d\\theta$$<br>Hacemos el cambio<br>$$u=r\\sec\\theta$$<br>Entonces<br>$$r=u\\cos\\theta,\\qquad dr=\\cos\\theta\\,du$$<br>y los nuevos límites son $\\pi\\leq u\\leq2\\pi$. Además,<br>$$\\tan^2\\theta\\,r\\,dr=\\tan^2\\theta\\,u\\cos^2\\theta\\,du=u\\sin^2\\theta\\,du$$<br>Por tanto,<br>$$I=\\left(\\int_{-\\pi/4}^{\\pi/4}\\sin^2\\theta\\,d\\theta\\right)\\left(\\int_{\\pi}^{2\\pi}u\\sin u\\,du\\right)$$<br>Calculamos<br>$$\\int_{-\\pi/4}^{\\pi/4}\\sin^2\\theta\\,d\\theta=\\frac{\\pi}{4}-\\frac12$$<br>y, por integración por partes,<br>$$\\int_{\\pi}^{2\\pi}u\\sin u\\,du=\\left[-u\\cos u+\\sin u\\right]_{\\pi}^{2\\pi}=-3\\pi$$<br>En consecuencia,<br>$$I=-3\\pi\\left(\\frac{\\pi}{4}-\\frac12\\right)=\\frac{3\\pi}{4}(2-\\pi)$$",
    "criterios_correccion": [
      { "descripcion": "Transforma correctamente la región y obtiene $-\\pi/4\\leq\\theta\\leq\\pi/4$", "puntaje": 2 },
      { "descripcion": "Obtiene los límites radiales $\\pi\\cos\\theta\\leq r\\leq2\\pi\\cos\\theta$", "puntaje": 2 },
      { "descripcion": "Transforma correctamente el integrando y el elemento de área", "puntaje": 2 },
      { "descripcion": "Realiza correctamente el cambio $u=r\\sec\\theta$ y separa las integrales", "puntaje": 2 },
      { "descripcion": "Calcula ambas integrales y obtiene $\\frac{3\\pi}{4}(2-\\pi)$", "puntaje": 2 }
    ],
    "errores_frecuentes": [
      "Olvidar el factor jacobiano $r$ de las coordenadas polares.",
      "Usar $0\\leq\\theta\\leq2\\pi$ sin imponer las restricciones angulares determinadas por $-x\\leq y\\leq x$."
    ]
  },
  {
    "id": "p3-a-empuje-esfera",
    "puntaje": 7,
    "dificultad": "Alta",
    "temas": ["Integral de superficie de flujo", "parametrización de la esfera"],
    "enunciado": contextoP3 + "Encuentre el valor del empuje $E$ sobre la esfera usando directamente la definición<br>$$E=-\\int_S\\vec F\\cdot\\overrightarrow{dA}$$",
    "pistas": [
      "Use la parametrización esférica dada y una normal exterior.",
      "La componente vertical del vector área orientado es $R^2\\sin\\phi\\cos\\phi\\,d\\phi\\,d\\theta$."
    ],
    "solucion": "Para la parametrización dada, el vector área orientado hacia el exterior es<br>$$\\overrightarrow{dA}=R^2\\sin\\phi\\bigl(\\sin\\phi\\cos\\theta,\\sin\\phi\\sin\\theta,\\cos\\phi\\bigr)\\,d\\phi\\,d\\theta$$<br>Sobre la esfera,<br>$$z=h+R\\cos\\phi$$<br>y, por tanto,<br>$$\\vec F\\bigl(\\vec r(\\phi,\\theta)\\bigr)=\\bigl(0,0,\\rho g(H-h-R\\cos\\phi)\\bigr)$$<br>Entonces<br>\\begin{align*}\\int_S\\vec F\\cdot\\overrightarrow{dA}&=\\rho gR^2\\int_0^{2\\pi}\\int_0^\\pi(H-h-R\\cos\\phi)\\sin\\phi\\cos\\phi\\,d\\phi\\,d\\theta\\end{align*}<br>El término que contiene $H-h$ se anula porque<br>$$\\int_0^\\pi\\sin\\phi\\cos\\phi\\,d\\phi=0$$<br>Además,<br>$$\\int_0^\\pi\\sin\\phi\\cos^2\\phi\\,d\\phi=\\frac23$$<br>Así,<br>$$\\int_S\\vec F\\cdot\\overrightarrow{dA}=-\\rho gR^3(2\\pi)\\frac23=-\\frac43\\pi\\rho gR^3$$<br>Finalmente,<br>$$E=-\\int_S\\vec F\\cdot\\overrightarrow{dA}=\\frac43\\pi\\rho gR^3$$",
    "criterios_correccion": [
      { "descripcion": "Obtiene correctamente el vector área orientado hacia el exterior", "puntaje": 2 },
      { "descripcion": "Evalúa correctamente el campo sobre la parametrización de la esfera", "puntaje": 1 },
      { "descripcion": "Plantea la integral de flujo con los límites adecuados", "puntaje": 2 },
      { "descripcion": "Calcula el flujo y obtiene $-\\frac43\\pi\\rho gR^3$", "puntaje": 1 },
      { "descripcion": "Aplica el signo de la definición y obtiene $E=\\frac43\\pi\\rho gR^3$", "puntaje": 1 }
    ],
    "errores_frecuentes": [
      "Usar la normal interior o perder el signo negativo presente en la definición de $E$.",
      "Suponer que la profundidad del centro cambia el empuje final; el término dependiente de $h$ se anula al integrar sobre la superficie cerrada."
    ]
  },
  {
    "id": "p3-b-empuje-cilindro",
    "puntaje": 7,
    "dificultad": "Media",
    "temas": ["Teorema de Gauss", "divergencia", "superficies cerradas"],
    "enunciado": contextoP3 + "Encuentre el valor del empuje $E$ sobre el cilindro tapado, de radio $R$ y altura $2R$, utilizando el Teorema de Gauss o el Teorema de Stokes. Indique cuál de los dos teoremas utiliza.",
    "pistas": [
      "El Teorema de Gauss es el adecuado porque se integra el flujo de un campo a través de una superficie cerrada."
    ],
    "solucion": "Utilizamos el Teorema de Gauss. La divergencia del campo es<br>$$\\operatorname{div}\\vec F=\\frac{\\partial}{\\partial z}\\bigl(\\rho g(H-z)\\bigr)=-\\rho g$$<br>Si $V$ es el sólido encerrado por el cilindro, entonces<br>$$\\int_S\\vec F\\cdot\\overrightarrow{dA}=\\iiint_V\\operatorname{div}\\vec F\\,dV=-\\rho g\\iiint_VdV=-\\rho g\\,\\operatorname{Vol}(V)$$<br>Como el cilindro tiene radio $R$ y altura $2R$,<br>$$\\operatorname{Vol}(V)=\\pi R^2(2R)=2\\pi R^3$$<br>Luego,<br>$$\\int_S\\vec F\\cdot\\overrightarrow{dA}=-2\\pi\\rho gR^3$$<br>y, por la definición del empuje,<br>$$E=-\\int_S\\vec F\\cdot\\overrightarrow{dA}=2\\pi\\rho gR^3$$<br>El Teorema de Stokes no es el instrumento natural en este caso, pues relaciona la circulación sobre una curva cerrada con el flujo del rotor a través de una superficie cuyo borde es esa curva.",
    "criterios_correccion": [
      { "descripcion": "Selecciona y enuncia el uso del Teorema de Gauss", "puntaje": 1 },
      { "descripcion": "Calcula correctamente $\\operatorname{div}\\vec F=-\\rho g$", "puntaje": 2 },
      { "descripcion": "Aplica correctamente el Teorema de Gauss a la superficie cerrada", "puntaje": 1 },
      { "descripcion": "Calcula el volumen del cilindro como $2\\pi R^3$", "puntaje": 1 },
      { "descripcion": "Obtiene el flujo $-2\\pi\\rho gR^3$", "puntaje": 1 },
      { "descripcion": "Aplica el signo de la definición y obtiene $E=2\\pi\\rho gR^3$", "puntaje": 1 }
    ],
    "errores_frecuentes": [
      "Aplicar el Teorema de Stokes directamente a una superficie cerrada sin identificar una curva borde.",
      "Usar únicamente el área del cilindro en vez de su volumen al aplicar el Teorema de Gauss."
    ]
  },
  {
    "id": "p3-c-comparacion-arquimedes",
    "puntaje": 6,
    "dificultad": "Baja",
    "temas": ["Comparación de volúmenes", "Principio de Arquímedes"],
    "enunciado": contextoP3 + "Determine sobre cuál objeto se produce un mayor empuje. Muestre además que se verifica el Principio de Arquímedes: el empuje corresponde al peso del volumen del fluido desplazado.",
    "pistas": [
      "Compare los valores obtenidos en las dos preguntas anteriores y relaciónelos con los respectivos volúmenes."
    ],
    "solucion": "Para la esfera se obtuvo<br>$$E_{\\mathrm{esfera}}=\\frac43\\pi\\rho gR^3$$<br>y para el cilindro<br>$$E_{\\mathrm{cilindro}}=2\\pi\\rho gR^3$$<br>Como<br>$$2>\\frac43$$<br>se concluye que<br>$$E_{\\mathrm{cilindro}}>E_{\\mathrm{esfera}}$$<br><br>Además,<br>$$\\rho gV_{\\mathrm{esfera}}=\\rho g\\left(\\frac43\\pi R^3\\right)=\\frac43\\pi\\rho gR^3=E_{\\mathrm{esfera}}$$<br>y<br>$$\\rho gV_{\\mathrm{cilindro}}=\\rho g(\\pi R^2\\cdot2R)=2\\pi\\rho gR^3=E_{\\mathrm{cilindro}}$$<br>Por lo tanto, en ambos casos el empuje coincide con el peso $\\rho gV$ del volumen del fluido desplazado, verificándose el Principio de Arquímedes.",
    "criterios_correccion": [
      { "descripcion": "Compara correctamente los dos valores de empuje", "puntaje": 2 },
      { "descripcion": "Concluye que el cilindro experimenta un mayor empuje", "puntaje": 1 },
      { "descripcion": "Verifica $E=\\rho gV$ para la esfera", "puntaje": 1 },
      { "descripcion": "Verifica $E=\\rho gV$ para el cilindro", "puntaje": 1 },
      { "descripcion": "Formula correctamente la conclusión asociada al Principio de Arquímedes", "puntaje": 1 }
    ],
    "errores_frecuentes": [
      "Comparar las áreas superficiales de los objetos en lugar de sus volúmenes desplazados.",
      "Concluir que el objeto situado a mayor profundidad experimenta necesariamente mayor empuje cuando el fluido tiene densidad constante y el objeto está completamente sumergido."
    ]
  }
];

// Agregar preguntas si no existen
nuevasPreguntas.forEach(nq => {
  if (!preguntasData.find(q => q.id === nq.id)) {
    preguntasData.push(nq);
  }
});
fs.writeFileSync(pathPreguntas, JSON.stringify(preguntasData, null, 2));

// Agregar la evaluación
const nuevaEvaluacion = {
  "id": "examen-calculo-ii-uan-2026-1",
  "titulo": "Examen de Cálculo II",
  "descripcion": "Evaluación sumativa sobre diferenciabilidad en varias variables, derivadas parciales, cambio del orden de integración, cambio de variables e integrales de superficie.",
  "curso": "Cálculo II",
  "universidad": "Universidad de los Andes",
  "año": 2026,
  "semestre": "Otoño",
  "tipo": "Examen",
  "tiempo_limite_minutos": 120,
  "etiquetas": ["Derivadas parciales", "Diferenciabilidad", "Regla de la cadena", "Integrales triples", "Cambio de orden", "Coordenadas polares", "Integrales de superficie", "Teorema de Gauss", "Principio de Arquímedes"],
  "preguntas": nuevasPreguntas.map(q => q.id)
};

if (!evaluacionesData.find(e => e.id === nuevaEvaluacion.id)) {
  evaluacionesData.push(nuevaEvaluacion);
  fs.writeFileSync(pathEvaluaciones, JSON.stringify(evaluacionesData, null, 2));
}

console.log("Examen importado exitosamente!");

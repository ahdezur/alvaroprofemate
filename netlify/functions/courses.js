const { Client } = require('pg');

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Content-Type": "application/json"
};

// Instanciar cliente Postgres
function getPgClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("La variable de entorno DATABASE_URL no está configurada.");
  }
  return new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

// Validar credenciales de administración (Basic Auth)
function isAuthorized(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader) return false;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'basic') return false;

  const credentials = Buffer.from(parts[1], 'base64').toString('ascii').split(':');
  if (credentials.length !== 2) return false;

  const username = credentials[0];
  const password = credentials[1];

  const expectedUser = process.env.ADMIN_USER || 'admin';
  const expectedPass = process.env.ADMIN_PASS || 'admin123';

  return username === expectedUser && password === expectedPass;
}

// Inicializar base de datos y sembrar curso de Cálculo Vectorial
async function initDatabase(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS courses (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      icon VARCHAR(50) NOT NULL DEFAULT 'fa-graduation-cap'
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS units (
      id SERIAL PRIMARY KEY,
      course_id VARCHAR(50) REFERENCES courses(id) ON DELETE CASCADE,
      unit_index INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      is_locked BOOLEAN NOT NULL DEFAULT FALSE,
      UNIQUE(course_id, unit_index)
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS chapters (
      id SERIAL PRIMARY KEY,
      unit_id INT REFERENCES units(id) ON DELETE CASCADE,
      chapter_index VARCHAR(20) NOT NULL,
      title VARCHAR(255) NOT NULL,
      is_completed BOOLEAN NOT NULL DEFAULT FALSE,
      is_locked BOOLEAN NOT NULL DEFAULT FALSE,
      content_motivation TEXT DEFAULT '',
      content_theory TEXT DEFAULT '',
      content_application TEXT DEFAULT '',
      content_exercises TEXT DEFAULT '',
      content_formulas TEXT DEFAULT '',
      UNIQUE(unit_id, chapter_index)
    );
  `);

  // Verificar si calculo-multivariable, Series de Potencias, Algoritmo de la división y Radio e intervalo de potencias están sembrados
  const checkRes = await client.query("SELECT COUNT(*) FROM courses WHERE id = 'calculo-multivariable' AND title = 'Cálculo Multivariable'");
  const checkSeries = await client.query("SELECT COUNT(*) FROM chapters WHERE title = 'Series de Potencias'");
  const checkPolinomios = await client.query("SELECT COUNT(*) FROM chapters WHERE title = 'Algoritmo de la división'");
  const checkRadio = await client.query("SELECT content_formulas, content_exercises FROM chapters WHERE title = 'Radio e intervalo de potencias' LIMIT 1");
  const checkOperaciones = await client.query("SELECT COUNT(*) FROM chapters WHERE title = 'Operaciones con series de potencias'");
  const checkIntuicion = await client.query("SELECT COUNT(*) FROM chapters WHERE title = 'Domina la intuición visual'");
  const checkFormal = await client.query("SELECT COUNT(*) FROM chapters WHERE title = 'Enfréntate al límite formal'");
  const checkLocked = await client.query("SELECT COUNT(*) FROM chapters WHERE is_locked = true");

  const hasMultivariable = parseInt(checkRes.rows[0].count, 10) > 0;
  const hasSeries = parseInt(checkSeries.rows[0].count, 10) > 0;
  const hasPolinomios = parseInt(checkPolinomios.rows[0].count, 10) > 0;
  const hasRadio = checkRadio.rows.length > 0 
    && !checkRadio.rows[0].content_formulas.trim().startsWith("[")
    && !checkRadio.rows[0].content_exercises.includes("Maclaurin de un monomio cuadrático");
  const hasOperaciones = parseInt(checkOperaciones.rows[0].count, 10) > 0;
  const hasIntuicion = parseInt(checkIntuicion.rows[0].count, 10) > 0;
  const hasFormal = parseInt(checkFormal.rows[0].count, 10) > 0;
  const hasLocked = parseInt(checkLocked.rows[0].count, 10) > 0;

  if (!hasMultivariable || !hasSeries || !hasPolinomios || !hasRadio || !hasOperaciones || !hasIntuicion || !hasFormal || hasLocked) {
    console.log("Renombrando y sembrando todos los cursos de la página principal...");
    
    // Limpiar base de datos
    await client.query("DELETE FROM chapters");
    await client.query("DELETE FROM units");
    await client.query("DELETE FROM courses");

    // Estructura de cursos a sembrar
    const coursesToSeed = [
      { id: 'introduccion-calculo', title: 'Introducción al Cálculo', desc: 'Conceptos de precálculo, funciones, ecuaciones, desigualdades y fundamentos matemáticos.', icon: 'fa-calculator' },
      { id: 'introduccion-algebra', title: 'Introducción al Álgebra', desc: 'Fundamentos de álgebra, polinomios, sistemas de ecuaciones lineales y operaciones algebraicas básicas.', icon: 'fa-arrow-up-right-dots' },
      { id: 'calculo-diferencial', title: 'Cálculo Diferencial', desc: 'Límites, continuidad, derivadas y sus aplicaciones prácticas en optimización y tasas de cambio.', icon: 'fa-calculator' },
      { id: 'calculo-integral', title: 'Cálculo Integral', desc: 'La integral definida, técnicas de integración, áreas, volúmenes de revolución e integrales impropias.', icon: 'fa-calculator' },
      { id: 'algebra-lineal', title: 'Álgebra Lineal', desc: 'Matrices, determinantes, sistemas lineales, espacios vectoriales, transformaciones y valores propios.', icon: 'fa-border-all' },
      { id: 'calculo-multivariable', title: 'Cálculo Multivariable', desc: 'Cálculo en varias variables: límites, derivadas parciales, integrales dobles y triples, y teoremas vectoriales.', icon: 'fa-layer-group' },
      { id: 'ecuaciones-diferenciales', title: 'Ecuaciones Diferenciales Ordinarias', desc: 'EDO de primer y segundo orden, transformada de Laplace, sistemas lineales y modelación matemática.', icon: 'fa-bezier-curve' },
      { id: 'calculo-avanzado', title: 'Cálculo Avanzado', desc: 'Series de Fourier, variables complejas, funciones analíticas e integración en el plano complejo.', icon: 'fa-infinity' }
    ];

    for (const c of coursesToSeed) {
      await client.query(`
        INSERT INTO courses (id, title, description, icon)
        VALUES ($1, $2, $3, $4)
      `, [c.id, c.title, c.desc, c.icon]);

      // Si es el curso de Cálculo Multivariable, inyectar el contenido original interactivo
      if (c.id === 'calculo-multivariable') {
        const u1Res = await client.query(`
          INSERT INTO units (course_id, unit_index, title, is_locked)
          VALUES ($1, $2, $3, $4) RETURNING id
        `, [c.id, 1, 'Funciones Multivariables y Geometría', false]);
        const u1Id = u1Res.rows[0].id;

        await client.query(`
          INSERT INTO units (course_id, unit_index, title, is_locked)
          VALUES ($1, $2, $3, $4)
        `, [c.id, 2, 'Cálculo Diferencial Vectorial', false]);

        // Cap 1.0
        await client.query(`
          INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked, content_motivation, content_theory, content_application, content_exercises, content_formulas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          u1Id, '1.0', 'Geometría Analítica del Espacio', true, false,
          '<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación geométrica</div><p>Para entender las funciones de varias variables, primero debemos dominar las tres dimensiones espaciales y cómo representamos planos, cilindros y esferas.</p></div></div>',
          '<h3>Conceptos de R3</h3><p>Definimos el espacio tridimensional R3 como el conjunto de todas las ternas ordenadas (x,y,z) de números reales.</p>',
          '<h3>Aplicaciones</h3><p>Modelado de piezas en CAD/CAM e ingeniería aeronáutica.</p>',
          '<p>Ejercicios sobre distancia entre puntos en R3 y ecuaciones de planos.</p>',
          '<h4>Fórmulas de apoyo</h4><p>Distancia: d = &radic;((x2-x1)&sup2; + (y2-y1)&sup2; + (z2-z1)&sup2;)</p>'
        ]);

        // Cap 1.1 (Con Maqueta)
        const cap11Motivation = `
          <section id="motivacion">
            <div class="caja-ram caja-motivacion">
              <div class="caja-ram-icon">💡</div>
              <div class="caja-ram-body">
                <div class="caja-ram-title">Motivación: ¿Cómo modelamos el espacio?</div>
                <p>
                  Imagina que estás en tu habitación en este instante. Si quisiéramos registrar la <strong>temperatura</strong> en cada rincón, no nos basta con un único número. La temperatura varía si te acercas a la ventana, si subes al techo o si te sientas en el suelo.
                </p>
                <p>
                  Para describir esto matemáticamente, debemos asignar a cada coordenada espacial $(x, y, z)$ un único valor térmico $T$. Así, la temperatura es una función $T(x,y,z)$. ¿Cómo cambia el cálculo cuando una función depende de más de una variable?
                </p>
              </div>
            </div>
          </section>
        `;

        const cap11Theory = `
          <section id="teoria-matematica">
            <h2>Definiciones y Teoría</h2>
            
            <div class="caja-ram caja-teoria">
              <div class="caja-ram-icon">📐</div>
              <div class="caja-ram-body">
                <div class="caja-ram-title">Definición: Campo Escalar Real</div>
                <p>
                  Un <strong>campo escalar</strong> (o función multivariable de valores reales) es una regla de correspondencia $f$ que asocia a cada punto $\\mathbf{x} = (x_1, x_2, \\dots, x_n)$ en un subconjunto $D \\subseteq \\mathbb{R}^n$ un único número real $f(\\mathbf{x}) \\in \\mathbb{R}$.
                </p>
                <p>
                  Escribimos esto formalmente como:
                  $$f: D \\subset \\mathbb{R}^n \\to \\mathbb{R}$$
                  En este capítulo, centraremos nuestros esfuerzos de visualización principalmente en funciones con dos variables independientes, es decir:
                  $$f: D \\subset \\mathbb{R}^2 \\to \\mathbb{R}$$
                </p>
              </div>
            </div>

            <p>
              El **Dominio** ($D$) es el conjunto de partida de la función. En una variable, el dominio se representa en una recta numérica. En cambio, para una función $f(x,y)$, el dominio es una <strong>región geométrica</strong> (sombreada, abierta, cerrada o acotada) en el plano de dos dimensiones $XY$.
            </p>

            <div class="evaluacion-formativa" data-eval-id="eval-dominio">
              <div class="eval-pregunta">
                <span>🤔</span>
                <div>¿Cuál es el dominio de la función $f(x,y) = \\sqrt{9 - x^2 - y^2}$ expresado geométricamente?</div>
              </div>
              <div class="eval-opciones">
                <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. La desigualdad $x^2 + y^2 \\geq 9$ describe los puntos que están FUERA del disco de radio 3. Si tomamos un punto allí, como $(4,0)$, la expresión dentro del radical sería $9 - 16 = -7$, lo cual no es real.">
                  A) El plano XY excluyendo un círculo de radio 3.
                </button>
                <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Para que la raíz cuadrada esté definida en los reales, el radicando debe ser no negativo: $9 - x^2 - y^2 \\geq 0$, lo que equivale a $x^2 + y^2 \\leq 9$. Esto corresponde geométricamente a un disco cerrado de radio 3 con centro en el origen $(0,0)$.">
                  B) Un disco cerrado de radio 3 con centro en el origen.
                </button>
                <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. La desigualdad estricta $x^2 + y^2 &lt; 9$ representa un disco abierto (sin incluir la frontera). Dado que la raíz cuadrada admite el valor cero, los puntos de la frontera ($x^2 + y^2 = 9$) sí forman parte del dominio.">
                  C) Un disco abierto de radio 3 con centro en el origen.
                </button>
              </div>
              <div class="feedback-contenedor hidden">
                <div class="feedback-icon"></div>
                <div class="feedback-texto"></div>
              </div>
            </div>
          </section>
        `;

        const cap11Application = `
          <section id="aplicacion-visualizacion">
            <h2>Aplicación y Visualización: Curvas de Nivel</h2>
            
            <div class="caja-ram caja-choque-cognitivo">
              <div class="caja-ram-icon">⚠️</div>
              <div class="caja-ram-body">
                <div class="caja-ram-title">Choque Cognitivo: La dificultad de la tercera dimensión</div>
                <p>
                  Graficar funciones en tres dimensiones a mano alzada es sumamente difícil e impreciso. Intentar plasmar la superficie completa de una montaña sobre papel plano resulta frustrante.
                </p>
                <p>
                  ¿Cómo resuelven los topógrafos y cartógrafos esta limitación? <strong>"Aplastando la montaña"</strong>. En lugar de dibujar el relieve tridimensional, proyectan cortes horizontales de altura constante $f(x,y) = k$. A esto lo llamamos <strong>Curvas de Nivel</strong>.
                </p>
              </div>
            </div>

            <div class="caja-ram caja-aplicacion">
              <div class="caja-ram-icon">🚀</div>
              <div class="caja-ram-body">
                <div class="caja-ram-title">Aplicación en la Ingeniería: Cartografía y Clima</div>
                <p>
                  Las curvas de nivel se ven diariamente en mapas topográficos (donde las líneas unen puntos de igual altitud) y en meteorología como <strong>isobaras</strong> o <strong>isotermas</strong>. En ingeniería, permiten evaluar pendientes del terreno para trazar carreteras o predecir flujos de agua.
                </p>
              </div>
            </div>

            <div class="video-placeholder">
              <div class="video-play-btn" aria-label="Reproducir video">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
              <div class="video-title">Visualización Dinámica de Superficies 3D</div>
              <div class="video-meta">Video Tutorial • 4:15 min</div>
            </div>

            <div id="laboratorio-visualizacion">
              <div class="lab-grid-bg"></div>
              <svg class="lab-vector-art" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <ellipse cx="50" cy="30" rx="35" ry="12" />
                <ellipse cx="50" cy="50" rx="25" ry="8" />
                <ellipse cx="50" cy="70" rx="15" ry="5" />
                <path d="M15 30 C15 65 35 85 50 85 C65 85 85 65 85 30" />
                <line x1="50" y1="10" x2="50" y2="90" stroke-dasharray="3 3" />
              </svg>
              <h3 class="lab-title">Laboratorio Interactivo de Curvas de Nivel</h3>
              <p class="lab-desc">
                Manipula en tiempo real la constante $k$ de la función $f(x,y) = x^2 + y^2$ y observa cómo se intersecta el plano con el paraboloide y se proyecta en el plano XY.
              </p>
              <p style="text-align: center; width: 100%; margin-top: 10px;">
                <button class="btn-launch-lab">
                  <span>🎮</span> Iniciar Laboratorio 3D (Próximamente)
                </button>
              </p>
            </div>
          </section>
        `;

        const cap11Exercises = `
          <div class="ejercicio-propuesto" data-ejercicio-id="res-1">
            <div class="ejercicio-header">
              <h4 class="ejercicio-titulo-prop">1. Curvas de nivel elípticas</h4>
              <span class="badge-nivel" style="background-color: var(--accent-bg); color: var(--accent-color); font-weight: bold;">Ejercicio Resuelto</span>
            </div>
            <p class="ejercicio-enunciado">
              Determine la forma de las curvas de nivel para el campo escalar $f(x,y) = x^2 + 4y^2$ para los valores de altura $k = 0, 1, 4$.
            </p>
            <button class="btn-pista" aria-expanded="false">
              <span>💡</span> Ver Indicación / Pauta
            </button>
            <div class="pista-contenido hidden">
              <strong>Solución paso a paso:</strong>
              <ol style="margin-left: 20px; margin-top: 8px; margin-bottom: 12px; color: var(--text-secondary);">
                <li>Igualamos la función a la constante de altura: $x^2 + 4y^2 = k$.</li>
                <li>Para $k = 0$, la ecuación es $x^2 + 4y^2 = 0$. Como ambos términos están al cuadrado y son no negativos, la única solución es el punto $(0,0)$.</li>
                <li>Para $k = 1$, obtenemos $x^2 + 4y^2 = 1$, que es la ecuación de una <strong>elipse</strong> centrada en el origen con semieje mayor $a = 1$ en el eje X y semieje menor $b = 1/2$ en el eje Y.</li>
                <li>Para $k = 4$, la ecuación es $x^2 + 4y^2 = 4$. Si dividimos todo por 4 para llevarla a su forma canónica:
                $$\\frac{x^2}{4} + y^2 = 1$$
                Esto corresponde a una elipse centrada en el origen con semiejes $a = 2$ y $b = 1$.</li>
              </ol>
              <p><em>Conclusión:</em> Las curvas de nivel son una familia de elipses concéntricas que crecen en tamaño a medida que aumenta la altura $k$.</p>
            </div>
          </div>
          
          <div class="ejercicio-propuesto" data-ejercicio-id="prop-1">
            <div class="ejercicio-header">
              <h4 class="ejercicio-titulo-prop">2. Evaluación de campos escalares</h4>
              <span class="badge-nivel nivel-1">Nivel 1: Mecánico</span>
            </div>
            <p class="ejercicio-enunciado">
              Sea el campo escalar de temperatura dado por $T(x,y) = 50 - 3x^2 - 5y^2$. Calcule el valor de temperatura exacto en el punto $P(2, -1)$.
            </p>
            <button class="btn-pista" aria-expanded="false">
              <span>💡</span> Ver Indicación / Pauta
            </button>
            <div class="pista-contenido hidden">
              <strong>Respuesta / Pauta:</strong> Sustituye los valores en la función:
              $$T(2,-1) = 50 - 3(2)^2 - 5(-1)^2$$
              $$T(2,-1) = 50 - 12 - 5 = 33$$
              La temperatura en ese punto es $33$.
            </div>
          </div>

          <div class="ejercicio-propuesto" data-ejercicio-id="prop-2">
            <div class="ejercicio-header">
              <h4 class="ejercicio-titulo-prop">3. Identificación geométrica de curvas de nivel</h4>
              <span class="badge-nivel nivel-2">Nivel 2: Analítico</span>
            </div>
            <p class="ejercicio-enunciado">
              Describa analíticamente las curvas de nivel del campo $g(x,y) = y - x^2$. ¿Qué tipo de curvas geométricas son y hacia dónde se desplazan al aumentar la constante $k$?
            </p>
            <button class="btn-pista" aria-expanded="false">
              <span>💡</span> Ver Indicación / Pauta
            </button>
            <div class="pista-contenido hidden">
              <strong>Respuesta / Pauta:</strong> La ecuación de las curvas de nivel es $y - x^2 = k$, lo cual se puede escribir como $y = x^2 + k$.
              Esto representa una familia de <strong>parábolas</strong> con vértice en $(0,k)$ que se abren hacia arriba. A medida que $k$ aumenta, las parábolas se desplazan verticalmente hacia arriba a lo largo del eje Y.
            </div>
          </div>

          <div class="ejercicio-propuesto" data-ejercicio-id="prop-3">
            <div class="ejercicio-header">
              <h4 class="ejercicio-titulo-prop">4. Diseño de rutas de topografía</h4>
              <span class="badge-nivel nivel-3">Nivel 3: Ingeniería</span>
            </div>
            <p class="ejercicio-enunciado">
              El mapa topográfico de una colina está descrito por la función de altura $h(x,y) = 200 - 0.01x^2 - 0.02y^2$. Si un topógrafo desea subir la colina manteniendo exactamente la misma altura (para no fatigarse), describa la trayectoria que debe seguir en el plano XY si parte desde el punto $(100, 50)$.
            </p>
            <button class="btn-pista" aria-expanded="false">
              <span>💡</span> Ver Indicación / Pauta
            </button>
            <div class="pista-contenido hidden">
              <strong>Respuesta / Pauta:</strong> 
              Para mantener la misma altura, el topógrafo debe caminar exactamente sobre la curva de nivel correspondiente a su punto de partida.
              Primero, calculamos la altura inicial $h(100, 50)$:
              $$h(100, 50) = 200 - 0.01(100)^2 - 0.02(50)^2 = 200 - 100 - 50 = 50\\text{ metros}.$$
              Por lo tanto, debe seguir la curva de nivel $h(x,y) = 50$, que es la elipse:
              $$200 - 0.01x^2 - 0.02y^2 = 50 \\implies 0.01x^2 + 0.02y^2 = 150$$
              Dividiendo entre 150:
              $$\\frac{x^2}{15000} + \\frac{y^2}{7500} = 1$$
              El topógrafo debe caminar describiendo una trayectoria elíptica en el plano XY con semieje mayor $\\approx 122.47$ y semieje menor $\\approx 86.6$.
            </div>
          </div>
        `;

        const cap11Formulas = `
          <h3 style="margin: 0 0 12px 0; color: var(--accent-color); font-size: 1.15rem; font-weight: 700; font-family: var(--font-display);">
            📐 Fórmulas de Apoyo
          </h3>
          
          <div class="formula-card">
            <h4>Campos Escalares y Dominio</h4>
            <div class="formula-card-latex">
              \\( f: D \\subset \\mathbb{R}^2 \\to \\mathbb{R} \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              El dominio $D$ es una región bidimensional en el plano XY.
            </p>
          </div>
          
          <div class="formula-card">
            <h4>Curvas de Nivel</h4>
            <div class="formula-card-latex">
              \\( f(x,y) = k \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              Proyección de la intersección de la superficie con el plano horizontal $z = k$.
            </p>
          </div>
          
          <div class="formula-card">
            <h4>Ecuación de la Elipse</h4>
            <div class="formula-card-latex">
              \\( \\frac{(x-h)^2}{a^2} + \\frac{(y-k)^2}{b^2} = 1 \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              Centro en $(h,k)$, semiejes $a$ (horizontal) y $b$ (vertical).
            </p>
          </div>
          
          <div class="formula-card">
            <h4>Ecuación de la Parábola</h4>
            <div class="formula-card-latex">
              \\( (y-k)^2 = 4p(x-h) \\)
            </div>
            <div class="formula-card-latex" style="margin-top: 4px;">
              \\( (x-h)^2 = 4p(y-k) \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              Vértice en $(h,k)$ y distancia focal $p$.
            </p>
          </div>
        `;

        await client.query(`
          INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked, content_motivation, content_theory, content_application, content_exercises, content_formulas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [u1Id, '1.1', 'Campos Escalares y Topografía', false, false, cap11Motivation, cap11Theory, cap11Application, cap11Exercises, cap11Formulas]);

        // Cap 1.2
        await client.query(`
          INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked, content_motivation, content_theory, content_application, content_exercises, content_formulas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          u1Id, '1.2', 'Límites y Continuidad en 3D', false, false,
          '<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación</div><p>¿Qué significa acercarse a un punto en 2D? A diferencia de una sola variable (donde solo te acercas por izquierda y derecha), en dos variables hay infinitas trayectorias de aproximación.</p></div></div>',
          '<h3>Definición formal del límite</h3><p>Decimos que el límite de f(x,y) cuando (x,y) tiende a (a,b) es L si para todo &epsilon; &gt; 0 existe &delta; &gt; 0 tal que...</p>',
          '<h3>Aplicaciones</h3><p>Cálculo de tensiones continuas en puentes y estructuras de soporte.</p>',
          '<p>Demuestre que el límite no existe evaluando por diferentes parábolas.</p>',
          '<h4>Fórmulas</h4><p>Límite: lim_{(x,y)&rarr;(a,b)} f(x,y) = L</p>'
        ]);
      } else if (c.id === 'calculo-diferencial') {
        const u1Res = await client.query(`
          INSERT INTO units (course_id, unit_index, title, is_locked)
          VALUES ($1, $2, $3, $4) RETURNING id
        `, [c.id, 1, 'Fundamentos y Conceptos Básicos', false]);
        const u1Id = u1Res.rows[0].id;

        const u2Res = await client.query(`
          INSERT INTO units (course_id, unit_index, title, is_locked)
          VALUES ($1, $2, $3, $4) RETURNING id
        `, [c.id, 2, 'Aplicaciones y Métodos Avanzados', false]);
        const u2Id = u2Res.rows[0].id;

        // Cap 1.1
        await client.query(`
          INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked, content_motivation, content_theory, content_application, content_exercises, content_formulas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          u1Id, '1.1', 'Introducción y Definición Primaria', false, false,
          `<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación de ${c.title}</div><p>Este capítulo introduce las bases conceptuales indispensables para comprender la asignatura de ${c.title}.</p></div></div>`,
          `<h3>Bases Teóricas</h3><p>Definiciones fundamentales y terminología general del área.</p>`,
          '<h3>Campos de Aplicación</h3><p>Ejemplos reales en física, ingeniería o ciencias sociales.</p>',
          JSON.stringify([
            {
              title: "Ejercicio de Introducción",
              level: "nivel-1",
              statement: `Resuelva el problema básico planteado para evaluar su comprensión en ${c.title}.`,
              solution: "<strong>Pauta:</strong> Desarrolle paso a paso aplicando la definición inicial."
            }
          ]),
          JSON.stringify([
            {
              title: "Fórmula de Partida",
              latex: "y = f(x)",
              description: "Ecuación básica de definición de variables."
            }
          ])
        ]);

        // Cap 1.2
        await client.query(`
          INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked, content_motivation, content_theory, content_application, content_exercises, content_formulas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          u1Id, '1.2', 'Propiedades Fundamentales', false, false,
          '<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación</div><p>Aquí analizaremos cómo interactúan los conceptos primarios para construir el cuerpo de la asignatura.</p></div></div>',
          '<h3>Propiedades Matemáticas</h3><p>Lista de postulados y teoremas principales del tema.</p>',
          '<h3>Casos de Estudio</h3><p>Resolución práctica de problemas típicos de certamen.</p>',
          JSON.stringify([
            {
              title: "Aplicación de Propiedades",
              level: "nivel-2",
              statement: "Demuestre la validez de la relación fundamental utilizando las propiedades listadas.",
              solution: "<strong>Solución:</strong> Desarrolle aplicando el álgebra correspondiente."
            }
          ]),
          JSON.stringify([
            {
              title: "Identidad Fundamental",
              latex: "\\cos^2(x) + \\sin^2(x) = 1",
              description: "Propiedad trigonométrica de gran utilidad."
            }
          ])
        ]);

        // Cap 2.1
        await client.query(`
          INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked, content_motivation, content_theory, content_application, content_exercises, content_formulas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          u2Id, '2.1', 'Derivación y Razones de Cambio', false, false,
          '<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación</div><p>Analizaremos cómo calcular pendientes de tangentes instantáneas.</p></div></div>',
          '<h3>Derivación Básica</h3><p>Definiciones de derivadas clásicas.</p>',
          '<h3>Casos de Estudio</h3><p>Resolución de problemas de derivadas.</p>',
          JSON.stringify([{ title: "Cálculo de Derivada", level: "nivel-1", statement: "Derive f(x) = x^3 + 2x.", solution: "f\'(x) = 3x^2 + 2." }]),
          JSON.stringify([{ title: "Regla de la Potencia", latex: "(x^n)\' = n x^{n-1}", description: "Derivada de potencias básicas." }])
        ]);

        // Cap 2.2
        await client.query(`
          INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked, content_motivation, content_theory, content_application, content_exercises, content_formulas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          u2Id, '2.2', 'Optimización y Extremos locales', false, false,
          '<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación</div><p>Aprenderemos a maximizar ganancias y minimizar costos usando derivadas.</p></div></div>',
          '<h3>Optimización</h3><p>Teorema del primer y segundo criterio de derivadas.</p>',
          '<h3>Casos de Estudio</h3><p>Problemas clásicos de cajas, áreas y volúmenes máximos.</p>',
          JSON.stringify([{ title: "Caja de Volumen Máximo", level: "nivel-2", statement: "Optimice el área de un terreno rectangular con 100m de cerca.", solution: "Dimensiones óptimas son 25m x 25m." }]),
          JSON.stringify([{ title: "Criterio de Primera Derivada", latex: "f\'(c) = 0", description: "Encontrar puntos críticos." }])
        ]);

        // Cap 2.3: Series de Potencias (Del archivo Series_de_Potencias.tex)
        const capPotMotivation = `
          <div class="caja-ram caja-motivacion">
            <div class="caja-ram-icon">💡</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Motivación: El misterio de la calculadora</div>
              <p>
                ¿Cómo sabe una calculadora cuánto vale $\\sin(2)$ o $e^{1.5}$? La realidad es que el procesador de tu computadora o calculadora es "tonto"; solo sabe hacer cuatro cosas: sumar, restar, multiplicar y dividir. No tiene idea de lo que es un seno, un coseno o un logaritmo.
              </p>
              <p>
                ¿Cómo lo logra entonces? Aquí entra la magia: <strong>podemos disfrazar funciones complejas como polinomios infinitos</strong>. Una Serie de Potencias es exactamente eso: un polinomio infinitamente largo que nos permite calcular funciones imposibles utilizando únicamente sumas y multiplicaciones. Es el puente definitivo entre el álgebra básica y el cálculo avanzado.
              </p>
            </div>
          </div>
        `;

        const capPotTheory = `
          <h3>Definición Formal</h3>
          <div class="caja-ram caja-definicion">
            <div class="caja-ram-icon">📐</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Serie de Potencias</div>
              <p>
                Una serie de potencias centrada en $x = a$ es una serie infinita de la forma:
                $$f(x) = \\sum_{n=0}^{\\infty} c_n (x - a)^n = c_0 + c_1(x-a) + c_2(x-a)^2 + c_3(x-a)^3 + \\dots$$
                Donde $x$ es una variable y los $c_n$ son constantes llamadas coeficientes de la serie.
              </p>
            </div>
          </div>

          <h3>Conceptos y Propiedades Claves</h3>
          <div class="caja-ram caja-propiedades">
            <div class="caja-ram-icon">📋</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Radio e Intervalo de Convergencia</div>
              <p>
                <ul style="margin-left: 20px;">
                  <li><strong>Radio de Convergencia ($R$):</strong> Es la distancia desde el centro $a$ hasta donde la serie converge (donde funciona y no se va al infinito).</li>
                  <li><strong>Intervalo de Convergencia:</strong> Es el conjunto de todos los valores de $x$ para los cuales la serie converge. Siempre tiene la forma $(a-R, a+R)$, pero ¡atención!, los extremos pueden o no estar incluidos.</li>
                </ul>
              </p>
            </div>
          </div>

          <div class="caja-ram caja-pregunta-guia">
            <div class="caja-ram-icon">💡</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Idea Clave</div>
              <p>
                Una serie de potencias es, en esencia, una función $f(x)$ cuyo dominio es exactamente su intervalo de convergencia. Fuera de ese intervalo, la serie "explota" (diverge).
              </p>
            </div>
          </div>

          <h3>Teorema Fundamental</h3>
          <div class="caja-ram caja-teorema">
            <div class="caja-ram-icon">🧠</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Criterio de la Razón para el Radio</div>
              <p>
                Para encontrar el radio de convergencia $R$, utilizamos el Criterio de la Razón (o D\'Alembert). Exigimos que para el término general $u_n = c_n(x-a)^n$:
                $$\\lim_{n \\to \\infty} \\left| \\frac{u_{n+1}}{u_n} \\right| < 1$$
              </p>
            </div>
          </div>

          <div class="caja-ram error-comun">
            <div class="caja-ram-icon">🚨</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Error Común (¡Trampa Cognitiva!)</div>
              <p>
                <strong>Olvidar los bordes:</strong> Muchos estudiantes encuentran el radio $R$, arman el intervalo abierto $(a-R, a+R)$ y terminan el ejercicio. Esto es un error. El Criterio de la Razón no entrega información cuando el límite es exactamente $1$. Siempre, sin excepción, <strong>debes evaluar los extremos del intervalo por separado</strong> reemplazando esos valores de $x$ en la serie original.
              </p>
            </div>
          </div>
        `;

        const capPotApplication = `
          <h3>Aplicación y Práctica</h3>
          <p>
            Pon a prueba tu rigor matemático respondiendo los siguientes enunciados críticos y preguntas rápidas:
          </p>

          <div class="evaluacion-formativa" data-eval-id="eval-vf-potencias-1" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>🤔 Enunciado 1</span>
              <div>Si una serie de potencias centrada en $x=0$ converge en $x=4$, entonces está garantizado que converge en $x=-3$.</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Si converge en $4$, su radio es al menos $R=4$. Como el centro es $0$, el intervalo seguro cubre desde $(-4, 4)$. Como $-3$ está dentro de este intervalo, la convergencia está totalmente garantizada.">
                A) Verdadero
              </button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Como la convergencia ocurre en $x=4$ con centro en $0$, el radio de convergencia es mayor o igual a $4$. El intervalo $(-4,4)$ es seguro, y $-3$ cae dentro de él.">
                B) Falso
              </button>
            </div>
            <div class="feedback-contenedor hidden">
              <div class="feedback-icon"></div>
              <div class="feedback-texto"></div>
            </div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-vf-potencias-2" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>🤔 Enunciado 2</span>
              <div>El intervalo de convergencia siempre es abierto en ambos extremos.</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Dependiendo de la serie, puede incluir uno, ambos o ninguno de los extremos. Hay que probarlos siempre de forma manual.">
                A) Verdadero
              </button>
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! El intervalo no tiene por qué ser abierto. Dependiendo del comportamiento particular de la serie en sus extremos, puede ser cerrado en un extremo, en ambos o en ninguno. Hay que evaluarlos uno a uno.">
                B) Falso
              </button>
            </div>
            <div class="feedback-contenedor hidden">
              <div class="feedback-icon"></div>
              <div class="feedback-texto"></div>
            </div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-sm-potencias" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>✏️ Selección Múltiple</span>
              <div>¿Cuál es el centro de la serie de potencias $\\sum_{n=1}^{\\infty} \\frac{(-1)^n (x+5)^n}{n!}$?</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. El binomio es $(x+5)$, lo que se reescribe en la forma canónica como $(x - (-5))$.">
                A) $x = 1$
              </button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. El centro es la constante $a$ en $(x-a)^n$.">
                B) $x = 0$
              </button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Recuerda el signo: $(x+5)^n = (x - (-5))^n$, por lo que el centro es negativo.">
                C) $x = 5$
              </button>
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! La forma general de un término de la serie es $(x-a)^n$. Así, $(x+5)^n = (x - (-5))^n$, lo que significa que el centro de la serie es $a = -5$.">
                D) $x = -5$
              </button>
            </div>
            <div class="feedback-contenedor hidden">
              <div class="feedback-icon"></div>
              <div class="feedback-texto"></div>
            </div>
          </div>
        `;

        const capPotExercises = `
          <div class="ejercicio-propuesto" data-ejercicio-id="res-potencias-1">
            <div class="ejercicio-header">
              <h4 class="ejercicio-titulo-prop">1. Serie Armónica y Alternada (Resuelto)</h4>
              <span class="badge-nivel" style="background-color: var(--accent-bg); color: var(--accent-color); font-weight: bold;">Ejercicio Resuelto</span>
            </div>
            <p class="ejercicio-enunciado">
              Determine el radio y el intervalo de convergencia de la serie:
              $$\\sum_{n=1}^{\\infty} \\frac{x^n}{n}$$
            </p>
            <button class="btn-pista" aria-expanded="false">
              <span>💡</span> Ver Indicación / Pauta
            </button>
            <div class="pista-contenido hidden">
              <strong>Solución paso a paso:</strong>
              <ol style="margin-left: 20px; margin-top: 8px; margin-bottom: 12px; color: var(--text-secondary);">
                <li>Aplicamos el Criterio de la Razón para el término general:
                $$\\lim_{n \\to \\infty} \\left| \\frac{x^{n+1}/(n+1)}{x^n/n} \\right| = \\lim_{n \\to \\infty} \\left| x \\frac{n}{n+1} \\right| = |x|$$</li>
                <li>Para asegurar la convergencia absoluta, exigimos que este límite sea menor que 1: $|x| < 1$. Por lo tanto, el Radio de Convergencia es $R = 1$.</li>
                <li>El intervalo preliminar es $(-1, 1)$. Evaluamos ahora los extremos de forma manual:
                  <ul style="margin-left: 20px; margin-top: 4px;">
                    <li><strong>Si $x = 1$:</strong> Obtenemos la serie $\\sum_{n=1}^{\\infty} \\frac{1}{n}$, la cual es la Serie Armónica Simple, conocida por ser divergente.</li>
                    <li><strong>Si $x = -1$:</strong> Obtenemos la serie $\\sum_{n=1}^{\\infty} \\frac{(-1)^n}{n}$, que es la Serie Armónica Alternada. Ésta converge por el Criterio de Leibniz (su término general decrece y tiende a cero).</li>
                  </ul>
                </li>
              </ol>
              <p><strong>Respuesta Final:</strong> El intervalo de convergencia es $[-1, 1)$ con radio de convergencia $R = 1$.</p>
            </div>
          </div>

          <div class="ejercicio-propuesto" data-ejercicio-id="prop-potencias-1">
            <div class="ejercicio-header">
              <h4 class="ejercicio-titulo-prop">2. Serie con centro desplazado</h4>
              <span class="badge-nivel nivel-2">Nivel 2: Analítico</span>
            </div>
            <p class="ejercicio-enunciado">
              Encuentre el radio y el intervalo de convergencia para la serie de potencias:
              $$\\sum_{n=0}^{\\infty} \\frac{(x-3)^n}{2^n (n+1)}$$
            </p>
            <button class="btn-pista" aria-expanded="false">
              <span>💡</span> Ver Indicación / Pauta
            </button>
            <div class="pista-contenido hidden">
              <strong>Respuesta / Pauta:</strong>
              <p>
                El centro de la serie es $a = 3$. Aplicando el Criterio de la Razón:
                $$\\lim_{n \\to \\infty} \\left| \\frac{(x-3)^{n+1}}{2^{n+1}(n+2)} \\cdot \\frac{2^n(n+1)}{(x-3)^n} \\right| = \\lim_{n \\to \\infty} \\left| \\frac{x-3}{2} \\cdot \\frac{n+1}{n+2} \\right| = \\frac{|x-3|}{2}$$
                Exigimos $\\frac{|x-3|}{2} < 1 \\implies |x-3| < 2$. Esto da un radio de convergencia $R = 2$.
              </p>
              <p>
                El intervalo preliminar centrado en $3$ es $(3-2, 3+2) = (1, 5)$. Evaluando los extremos:
                <ul style="margin-left: 20px;">
                  <li>Para $x = 5$: Obtenemos la serie armónica $\\sum \\frac{1}{n+1}$ (Diverge).</li>
                  <li>Para $x = 1$: Obtenemos la serie alternada $\\sum \\frac{(-1)^n}{n+1}$ (Converge por Leibniz).</li>
                </ul>
                <strong>Resultado:</strong> El intervalo es $[1, 5)$ con $R = 2$.
              </p>
            </div>
          </div>

          <div class="ejercicio-propuesto" data-ejercicio-id="res-potencias-2">
            <div class="ejercicio-header">
              <h4 class="ejercicio-titulo-prop">3. Modelamiento Geométrico (Resuelto)</h4>
              <span class="badge-nivel" style="background-color: var(--accent-bg); color: var(--accent-color); font-weight: bold;">Ejercicio Resuelto</span>
            </div>
            <p class="ejercicio-enunciado">
              Encuentre una representación en serie de potencias para la función $f(x) = \\frac{1}{1+x^2}$ y determine su intervalo de convergencia.
            </p>
            <button class="btn-pista" aria-expanded="false">
              <span>💡</span> Ver Indicación / Pauta
            </button>
            <div class="pista-contenido hidden">
              <strong>Solución paso a paso:</strong>
              <ol style="margin-left: 20px; margin-top: 8px; margin-bottom: 12px; color: var(--text-secondary);">
                <li>Utilizamos la serie geométrica fundamental como molde:
                $$\\frac{1}{1-r} = \\sum_{n=0}^{\\infty} r^n \\quad \\text{para } |r| < 1$$</li>
                <li>Reescribimos $f(x)$ para hacer coincidir los signos:
                $$f(x) = \\frac{1}{1 - (-x^2)}$$</li>
                <li>Reemplazamos $r = -x^2$ en la serie geométrica:
                $$\\sum_{n=0}^{\\infty} (-x^2)^n = \\sum_{n=0}^{\\infty} (-1)^n x^{2n}$$</li>
                <li>Esta representación es válida si y sólo si $|-x^2| < 1$, lo que equivale a $|x| < 1$.</li>
              </ol>
              <p><strong>Respuesta Final:</strong> La representación es $f(x) = \\sum_{n=0}^{\\infty} (-1)^n x^{2n}$ con intervalo de convergencia $(-1, 1)$.</p>
            </div>
          </div>
        `;

        const capPotFormulas = `
          <h3 style="margin: 0 0 12px 0; color: var(--accent-color); font-size: 1.15rem; font-weight: 700; font-family: var(--font-display);">
            📐 Fórmulas Claves
          </h3>

          <div class="formula-card">
            <h4>Forma General de la Serie</h4>
            <div class="formula-card-latex">
              \\( \\sum_{n=0}^{\\infty} c_n (x-a)^n \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              Serie infinita centrada en $x = a$ con coeficientes $c_n$.
            </p>
          </div>

          <div class="formula-card">
            <h4>Cálculo del Radio de Convergencia</h4>
            <div class="formula-card-latex">
              \\( R = \\lim_{n \\to \\infty} \\left| \\frac{c_n}{c_{n+1}} \\right| \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              Relación inversa de los coeficientes para el límite del Criterio de la Razón.
            </p>
          </div>

          <div class="formula-card">
            <h4>La Piedra Rosetta (Serie Geométrica Clave)</h4>
            <div class="formula-card-latex">
              \\( \\frac{1}{1-x} = \\sum_{n=0}^{\\infty} x^n \\quad \\text{para } |x| < 1 \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              Base para obtener series de potencias de otras funciones mediante sustitución o diferenciación.
            </p>
          </div>
        `;

        await client.query(`
          INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked, content_motivation, content_theory, content_application, content_exercises, content_formulas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [u2Id, '2.3', 'Series de Potencias', false, false, capPotMotivation, capPotTheory, capPotApplication, capPotExercises, capPotFormulas]);

      } else if (c.id === 'calculo-integral') {
        const u1Res = await client.query(`
          INSERT INTO units (course_id, unit_index, title, is_locked)
          VALUES ($1, $2, $3, $4) RETURNING id
        `, [c.id, 1, 'Series de Potencias', false]);
        const u1Id = u1Res.rows[0].id;

        const capIntPotMotivation = `
          <div class="caja-ram caja-motivacion">
            <div class="caja-ram-icon">💡</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Motivación: Más allá de los polinomios</div>
              <p>
                Hasta ahora hemos estudiado principalmente <strong>polinomios</strong>, funciones de la forma:
                $$P(x)=a_0+a_1x+a_2x^2+\\cdots+a_nx^n,$$
                cuyo número de términos es finito.
              </p>
              <p>
                Muchas funciones importantes, como $e^x$, $\\sin x$, $\\cos x$ y $\\ln(1+x)$, no son polinomios. Surge entonces una pregunta natural:
              </p>
              <p style="text-align: center; font-weight: bold; margin: 16px 0;">
                ¿Es posible representar estas funciones mediante expresiones semejantes a un polinomio?
              </p>
              <p>
                La idea consiste en permitir que el número de términos sea infinito, obteniendo expresiones de la forma:
                $$a_0+a_1x+a_2x^2+\\cdots.$$
                Estas expresiones se denominan <strong>series de potencias</strong>.
              </p>
              <p>
                Sin embargo, aparece una nueva dificultad: una suma infinita no siempre converge. Por ello, una de las primeras preguntas que deberemos responder es:
              </p>
              <p style="text-align: center; font-weight: bold; margin: 16px 0;">
                ¿Para qué valores de $x$ converge una serie de potencias?
              </p>
              <p>
                Más adelante veremos que estas series permiten representar muchas funciones importantes y constituyen una herramienta fundamental para aproximar funciones, calcular límites y resolver diversos problemas de cálculo.
              </p>
            </div>
          </div>
        `;

        const capIntPotTheory = `
          <h3>1. Serie de Potencias</h3>
          <div class="caja-ram caja-definicion">
            <div class="caja-ram-icon">📐</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Definición: Serie de Potencias</div>
              <p>
                Sea $\\{a_n\\}_{n\\ge 0}$ una sucesión de números reales y sea $a\\in\\mathbb{R}$. Una <strong>serie de potencias centrada en $a$</strong> es una expresión de la forma:
                $$\\sum_{n=0}^{\\infty}a_n(x-a)^n$$
                Los números $a_n$ se llaman <strong>coeficientes</strong> y el número $a$ recibe el nombre de <strong>centro</strong> de la serie.
              </p>
              <p>
                Cuando $a=0$, la serie toma la forma $\\sum_{n=0}^{\\infty}a_nx^n$, y se dice que está centrada en el origen.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-ejemplo">
            <div class="caja-ram-icon">📝</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Ejemplo de Centros</div>
              <p>
                La serie $\\sum_{n=0}^{\\infty}\\frac{x^n}{n!}$ está centrada en $0$, mientras que $\\sum_{n=0}^{\\infty}\\frac{(-1)^n}{2^n}(x-3)^n$ está centrada en $3$.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-idea">
            <div class="caja-ram-icon">💡</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Idea Clave</div>
              <p>
                Una serie de potencias es una generalización de los polinomios: en lugar de tener un número finito de términos, posee infinitos términos.
              </p>
            </div>
          </div>

          <div class="caja-ram error-comun">
            <div class="caja-ram-icon">🚨</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Error Común (¡Trampa Cognitiva!)</div>
              <p>
                Confundir el <strong>centro</strong> con el primer coeficiente. En:
                $$4+2(x-5)-7(x-5)^2+\\cdots$$
                el centro es $5$, mientras que el primer coeficiente es $4$.
              </p>
            </div>
          </div>

          <p>
            Hasta ahora hemos definido qué es una serie de potencias, pero aún no sabemos dos cosas fundamentales:
          </p>
          <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li>¿Para qué valores de $x$ converge?</li>
            <li>Si conocemos una función, ¿cómo encontrar la serie que la representa?</li>
          </ul>
          <p>Comenzaremos respondiendo la primera pregunta.</p>

          <h3>2. Radio e Intervalo de Convergencia</h3>
          <p>
            Una serie de potencias no necesariamente converge para todo valor de $x$. Por ejemplo, la serie geométrica $\\sum_{n=0}^{\\infty}x^n$ converge cuando $|x|&lt;1$, pero diverge cuando $|x|\\ge 1$. Esto motiva los conceptos de <strong>radio</strong> e <strong>intervalo de convergencia</strong>.
          </p>

          <div class="caja-ram caja-teorema">
            <div class="caja-ram-icon">🧠</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Teorema de Convergencia</div>
              <p>
                Toda serie de potencias $\\sum_{n=0}^{\\infty}a_n(x-a)^n$ posee un número $R\\in[0,\\infty]$, llamado <strong>radio de convergencia</strong>, que satisface:
              </p>
              <ul style="margin-left: 20px; margin-top: 8px;">
                <li>Si $|x-a|&lt;R$, la serie converge absolutamente.</li>
                <li>Si $|x-a|&gt;R$, la serie diverge.</li>
                <li>Si $|x-a|=R$, el teorema no permite concluir (los extremos deben estudiarse por separado).</li>
              </ul>
            </div>
          </div>

          <div class="caja-ram caja-definicion">
            <div class="caja-ram-icon">📐</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Definición: Radio de Convergencia</div>
              <p>
                El número $R$ del teorema anterior se denomina <strong>radio de convergencia</strong>. Representa la distancia desde el centro hasta los puntos donde el comportamiento de la serie deja de estar garantizado.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-definicion">
            <div class="caja-ram-icon">📐</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Definición: Intervalo de Convergencia</div>
              <p>
                El <strong>intervalo de convergencia</strong> es el conjunto de todos los valores de $x$ para los cuales la serie converge.
              </p>
              <p>
                Una vez conocido el radio, el intervalo abierto $(a-R,a+R)$ siempre pertenece al intervalo de convergencia. Para determinar el intervalo definitivo es necesario estudiar ambos extremos por separado.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-ejemplo">
            <div class="caja-ram-icon">📝</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Ejemplo: Serie Geométrica</div>
              <p>
                La serie geométrica $\\sum_{n=0}^{\\infty}x^n$ tiene $R=1$, y su intervalo de convergencia es $(-1,1)$, ya que la serie diverge tanto en $x=-1$ como en $x=1$.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-idea">
            <div class="caja-ram-icon">💡</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Idea Clave</div>
              <p>
                El radio de convergencia determina el comportamiento de la serie en todos los puntos, excepto en los extremos.
              </p>
            </div>
          </div>

          <div class="caja-ram error-comun">
            <div class="caja-ram-icon">🚨</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Error Común (¡Trampa Cognitiva!)</div>
              <p>
                Confundir el radio con el intervalo de convergencia. Por ejemplo, $R=2$ es un número, mientras que $[-2,2)$ es un conjunto.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-procedimiento">
            <div class="caja-ram-icon">⚙️</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Procedimiento: Encontrar el Intervalo de Convergencia</div>
              <ol style="margin-left: 20px; margin-top: 8px;">
                <li>Determinar el radio de convergencia.</li>
                <li>Estudiar los extremos.</li>
                <li>Escribir el intervalo de convergencia.</li>
              </ol>
            </div>
          </div>

          <h3>3. Criterio de la Razón de D'Alembert</h3>
          <p>
            ¿Cómo se calcula el radio de convergencia? La herramienta más utilizada es el <strong>criterio de la razón</strong>, también conocido como <strong>criterio de D'Alembert</strong>.
          </p>

          <div class="caja-ram caja-teorema">
            <div class="caja-ram-icon">🧠</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Teorema: Criterio de D'Alembert</div>
              <p>
                Sea $\\sum_{n=0}^{\\infty}a_n(x-a)^n$ una serie de potencias y suponga que existe el límite:
                $$L = \\lim_{n\\to\\infty} \\left| \\frac{a_{n+1}}{a_n} \\right|$$
                Entonces:
              </p>
              <ul style="margin-left: 20px; margin-top: 8px;">
                <li>Si $L=0$, entonces $R=\\infty$.</li>
                <li>Si $0&lt;L&lt;\\infty$, entonces $R=\\frac{1}{L}$.</li>
                <li>Si $L=\\infty$, entonces $R=0$.</li>
              </ul>
            </div>
          </div>

          <div class="caja-ram caja-procedimiento">
            <div class="caja-ram-icon">⚙️</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Esquema Operativo Completo</div>
              <ol style="margin-left: 20px; margin-top: 8px;">
                <li>Aplicar el criterio de D'Alembert para obtener $R$.</li>
                <li>Escribir el intervalo abierto $(a-R,a+R)$.</li>
                <li>Estudiar los extremos.</li>
                <li>Escribir el intervalo definitivo.</li>
              </ol>
            </div>
          </div>

          <div class="caja-ram caja-ejemplo">
            <div class="caja-ram-icon">📝</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Ejemplo: Radio de Serie Armónica</div>
              <p>
                Determine el radio de convergencia de $\\sum_{n=1}^{\\infty}\\frac{x^n}{n}$.
              </p>
              <p>
                Como $a_n=\\frac{1}{n}$, se obtiene:
                $$\\left| \\frac{a_{n+1}}{a_n} \\right| = \\frac{n}{n+1}$$
                Por tanto:
                $$L = \\lim_{n\\to\\infty} \\frac{n}{n+1} = 1$$
                Luego, $R=1$. Para determinar el intervalo de convergencia todavía es necesario estudiar los extremos.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-idea">
            <div class="caja-ram-icon">💡</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Idea Clave</div>
              <p>
                El criterio de D'Alembert permite encontrar el <strong>radio de convergencia</strong>, pero no determina el comportamiento de la serie en los extremos.
              </p>
            </div>
          </div>

          <div class="caja-ram error-comun">
            <div class="caja-ram-icon">🚨</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Error Común</div>
              <p>
                Una vez obtenido el radio de convergencia, muchos estudiantes escriben inmediatamente el intervalo de convergencia. Antes de hacerlo, siempre deben estudiarse los extremos.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-idea">
            <div class="caja-ram-icon">💡</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Idea clave del capítulo</div>
              <p>
                En este capítulo aparecen dos tipos de problemas completamente distintos:
              </p>
              <p>
                <strong>Problema A.</strong> Dada una serie de potencias, determinar su radio e intervalo de convergencia.
              </p>
              <p>
                <strong>Problema B.</strong> Dada una función, construir su serie de Taylor o de Maclaurin.
              </p>
              <p>
                Identificar correctamente el tipo de problema es el primer paso para elegir la herramienta adecuada.
              </p>
            </div>
          </div>

          <h3>4. De una Función a una Serie de Potencias</h3>
          <p>
            Hasta ahora hemos estudiado series de potencias cuyos coeficientes son conocidos. Sin embargo, en la práctica suele ocurrir lo contrario: conocemos una función y queremos encontrar una serie de potencias que la represente (por ejemplo para $e^x$, $\\sin x$ o $\\ln(1+x)$). Esta pregunta conduce naturalmente al concepto de <strong>serie de Taylor</strong>.
          </p>

          <h3>5. Serie de Taylor y de Maclaurin</h3>
          <p>
            Para aproximar una función cerca de un punto $a$ es natural utilizar un polinomio. Mientras mayor sea el grado del polinomio, mejor será la aproximación local. La idea de la serie de Taylor consiste en extender este proceso al límite, obteniendo una serie de potencias asociada a la función.
          </p>

          <div class="caja-ram caja-definicion">
            <div class="caja-ram-icon">📐</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Definición: Serie de Taylor</div>
              <p>
                Sea $f$ una función infinitamente derivable en un entorno de un punto $a$. La <strong>serie de Taylor</strong> de $f$, centrada en $a$, es:
                $$\\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n$$
              </p>
            </div>
          </div>

          <div class="caja-ram caja-definicion">
            <div class="caja-ram-icon">📐</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Definición: Serie de Maclaurin</div>
              <p>
                Cuando el centro es el origen ($a=0$), la serie de Taylor recibe el nombre de <strong>serie de Maclaurin</strong> y toma la forma:
                $$\\sum_{n=0}^{\\infty} \\frac{f^{(n)}(0)}{n!}x^n$$
              </p>
            </div>
          </div>

          <div class="caja-ram caja-ejemplo">
            <div class="caja-ram-icon">📝</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Ejemplo: Serie de Maclaurin de la Exponencial</div>
              <p>
                La serie de Maclaurin de la función exponencial es:
                $$e^x = 1+x+\\frac{x^2}{2!}+\\frac{x^3}{3!}+\\cdots$$
              </p>
            </div>
          </div>

          <div class="caja-ram caja-idea">
            <div class="caja-ram-icon">💡</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Idea Clave</div>
              <p>
                Toda serie de Maclaurin es una serie de Taylor cuyo centro es el origen.
              </p>
            </div>
          </div>

          <div class="caja-ram error-comun">
            <div class="caja-ram-icon">🚨</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Error Común</div>
              <p>
                Confundir la serie de Taylor con la función. La serie de Taylor siempre puede construirse si existen las derivadas necesarias, pero no siempre representa a la función. Inyectamos principalmente funciones para las cuales sí ocurre esta igualdad.
              </p>
            </div>
          </div>

          <h3>6. Fórmula de los Coeficientes</h3>
          <p>
            La definición de Taylor plantea una pregunta inmediata: ¿Por qué los coeficientes tienen precisamente esa forma? La respuesta se obtiene derivando sucesivamente la serie de potencias.
          </p>

          <div class="caja-ram caja-teorema">
            <div class="caja-ram-icon">🧠</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Teorema de los Coeficientes</div>
              <p>
                Si $f(x) = \\sum_{n=0}^{\\infty} a_n(x-a)^n$, entonces los coeficientes cumplen:
                $$a_n = \\frac{f^{(n)}(a)}{n!}, \\qquad n=0,1,2,\\ldots$$
              </p>
            </div>
          </div>

          <div class="caja-ram caja-ejemplo">
            <div class="caja-ram-icon">📝</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Justificación de la Fórmula</div>
              <p>
                Al evaluar la serie y sus derivadas en el centro se obtiene:
                $$f(a)=a_0,$$
                $$f'(a)=a_1,$$
                $$f''(a)=2!a_2,$$
                $$f^{(3)}(a)=3!a_3.$$
                El mismo patrón continúa para cualquier orden de derivación, obteniéndose $f^{(n)}(a)=n!a_n$, de donde se deduce la fórmula $a_n=\\frac{f^{(n)}(a)}{n!}$.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-procedimiento">
            <div class="caja-ram-icon">⚙️</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Procedimiento: Construir una Serie de Taylor</div>
              <ol style="margin-left: 20px; margin-top: 8px;">
                <li>Elegir el centro $a$.</li>
                <li>Calcular las derivadas de la función.</li>
                <li>Evaluarlas en $a$.</li>
                <li>Aplicar la fórmula $a_n=\\frac{f^{(n)}(a)}{n!}$.</li>
                <li>Escribir la serie.</li>
              </ol>
            </div>
          </div>

          <div class="caja-ram caja-ejemplo">
            <div class="caja-ram-icon">📝</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Ejemplo: Serie de un Binomio Lineal</div>
              <p>
                Obtenga la serie de Maclaurin de $f(x)=1+x$.
              </p>
              <p>
                Como $f(0)=1, f'(0)=1$, y $f^{(n)}(0)=0$ para $n\\ge2$, se obtiene la serie finita: $1+x$.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-idea">
            <div class="caja-ram-icon">💡</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Idea Clave</div>
              <p>
                Las derivadas de una función en un punto determinan completamente los coeficientes de su serie de Taylor.
              </p>
            </div>
          </div>

          <div class="caja-ram error-comun">
            <div class="caja-ram-icon">🚨</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Error Común</div>
              <p>
                Olvidar dividir por $n!$ o evaluar las derivadas en un punto distinto del centro de desarrollo.
              </p>
            </div>
          </div>
        `;

        const capIntPotApplication = `
          <h3>Evaluación Formativa Rápida</h3>
          <p>Comprueba tu comprensión respondiendo las siguientes preguntas interactivas:</p>

          <h4 style="color: var(--accent-color); margin-top: 20px; margin-bottom: 12px;">✏️ Verdadero o Falso</h4>

          <div class="evaluacion-formativa" data-eval-id="eval-vf-pot-1" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>🤔 Enunciado 1</span>
              <div>Toda serie de potencias converge para todo número real.</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. La serie geométrica $\\sum x^n$, por ejemplo, diverge para $|x|\\ge 1$. En general, una serie de potencias sólo está garantizada de converger en su centro $x=a$.">A) Verdadero</button>
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Es falso. Existen series de potencias que sólo convergen en su centro (donde $R=0$) o en un intervalo acotado.">B) Falso</button>
            </div>
            <div class="feedback-contenedor hidden"><div class="feedback-icon"></div><div class="feedback-texto"></div></div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-vf-pot-2" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>🤔 Enunciado 2</span>
              <div>Si una serie de potencias tiene radio de convergencia $R=2$, entonces converge para todo $x$ tal que $|x-a|&lt;2$.</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Por definición del radio de convergencia, la serie converge absolutamente para todo punto en el intervalo abierto $(a-2, a+2)$.">A) Verdadero</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Es verdadero. El radio de convergencia nos garantiza la convergencia absoluta de la serie para todos los puntos que disten del centro menos de $R=2$.">B) Falso</button>
            </div>
            <div class="feedback-contenedor hidden"><div class="feedback-icon"></div><div class="feedback-texto"></div></div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-vf-pot-3" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>🤔 Enunciado 3</span>
              <div>El criterio de D'Alembert permite determinar el intervalo de convergencia de forma directa.</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. El criterio de D'Alembert sólo determina el valor del radio $R$. Para conocer el intervalo de convergencia, siempre se requiere estudiar por separado los extremos del intervalo.">A) Verdadero</button>
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Es falso. El criterio entrega el radio de convergencia, pero no entrega información en los extremos (donde el límite da exactamente 1). Los extremos deben evaluarse por separado.">B) Falso</button>
            </div>
            <div class="feedback-contenedor hidden"><div class="feedback-icon"></div><div class="feedback-texto"></div></div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-vf-pot-4" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>🤔 Enunciado 4</span>
              <div>Toda serie de Maclaurin es una serie de Taylor.</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Una serie de Maclaurin es un caso particular de la serie de Taylor donde el centro está fijado exactamente en el origen ($a=0$).">A) Verdadero</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Es verdadero, pues la serie de Maclaurin es por definición una serie de Taylor con centro en el origen.">B) Falso</button>
            </div>
            <div class="feedback-contenedor hidden"><div class="feedback-icon"></div><div class="feedback-texto"></div></div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-vf-pot-5" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>🤔 Enunciado 5</span>
              <div>Toda serie de Taylor es una serie de Maclaurin.</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Una serie de Taylor puede estar centrada en cualquier valor de $a$. Sólo se denomina serie de Maclaurin si el centro es exactamente $0$.">A) Verdadero</button>
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Es falso. Las series de Taylor pueden centrarse en valores distintos de cero (por ejemplo, $a=3$).">B) Falso</button>
            </div>
            <div class="feedback-contenedor hidden"><div class="feedback-icon"></div><div class="feedback-texto"></div></div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-vf-pot-6" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>🤔 Enunciado 6</span>
              <div>Los coeficientes de una serie de Taylor dependen de las derivadas de la función en el centro.</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Los coeficientes se calculan como $a_n = \\frac{f^{(n)}(a)}{n!}$, dependiendo directamente del comportamiento de la función y sus derivadas en el centro.">A) Verdadero</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Es verdadero, ya que la fórmula matemática para determinar cada coeficiente $a_n$ se define en base a la derivada de orden $n$ de la función evaluada en el centro $a$.">B) Falso</button>
            </div>
            <div class="feedback-contenedor hidden"><div class="feedback-icon"></div><div class="feedback-texto"></div></div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-vf-pot-7" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>🤔 Enunciado 7</span>
              <div>Si el radio de convergencia es infinito, entonces la serie converge para todo número real.</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Un radio $R=\\infty$ significa que no hay límites en la distancia de convergencia desde el centro, por lo que converge para cualquier valor de $x$ real.">A) Verdadero</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Es verdadero. Si $R=\\infty$, el conjunto de convergencia abarca todo la recta real $\\mathbb{R}$.">B) Falso</button>
            </div>
            <div class="feedback-contenedor hidden"><div class="feedback-icon"></div><div class="feedback-texto"></div></div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-vf-pot-8" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>🤔 Enunciado 8</span>
              <div>El radio de convergencia y el intervalo de convergencia representan el mismo concepto.</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. El radio $R$ es un número real o infinito. El intervalo es el conjunto geométrico de puntos (incluyendo o excluyendo los extremos). No son lo mismo.">A) Verdadero</button>
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Es falso. El radio de convergencia es un valor numérico, mientras que el intervalo es un conjunto de puntos.">B) Falso</button>
            </div>
            <div class="feedback-contenedor hidden"><div class="feedback-icon"></div><div class="feedback-texto"></div></div>
          </div>


          <h4 style="color: var(--accent-color); margin-top: 30px; margin-bottom: 12px;">✏️ Selección Múltiple</h4>

          <div class="evaluacion-formativa" data-eval-id="eval-sm-pot-1" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>✏️ Pregunta 1</span>
              <div>La serie $\\sum_{n=0}^{\\infty}a_n(x-2)^n$ está centrada en:</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. La forma general es $(x-a)^n$ con centro en $a$. Aquí $a \\neq 0$.">A) 0</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. El centro se identifica a partir de $(x-a)$, no es 1.">B) 1</button>
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! La expresión de la potencia es $(x-2)^n$, lo cual indica que la serie está centrada en $a=2$.">C) 2</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. El centro es una constante fija estructural de las potencias de la serie y es visible de forma directa.">D) Depende de los coeficientes</button>
            </div>
            <div class="feedback-contenedor hidden"><div class="feedback-icon"></div><div class="feedback-texto"></div></div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-sm-pot-2" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>✏️ Pregunta 2</span>
              <div>El criterio de D'Alembert se utiliza principalmente para:</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Para encontrar la serie se requieren derivadas sucesivas, no el criterio de D'Alembert.">A) Encontrar la serie de Taylor</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Los coeficientes se obtienen mediante la fórmula de Taylor $a_n = \\frac{f^{(n)}(a)}{n!}$.">B) Calcular los coeficientes</button>
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Permite calcular el valor de $L = \\lim |a_{n+1}/a_n|$ para obtener el radio de convergencia como $R = 1/L$.">C) Determinar el radio de convergencia</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Para estudiar los extremos se debe sustituir directamente cada extremo en la serie de potencias y analizar la convergencia de la serie numérica resultante.">D) Estudiar los extremos</button>
            </div>
            <div class="feedback-contenedor hidden"><div class="feedback-icon"></div><div class="feedback-texto"></div></div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-sm-pot-3" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>✏️ Pregunta 3</span>
              <div>La serie de Maclaurin corresponde a una serie de Taylor centrada en:</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. El centro de una serie de Maclaurin es un punto específico.">A) -1</button>
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Una serie de Maclaurin es por definición una serie de Taylor donde el centro de desarrollo es el origen $a=0$.">B) 0</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Maclaurin se enfoca exactamente en el origen.">C) 1</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. La serie de Maclaurin está fijada estructuralmente en un centro particular.">D) Un punto cualquiera</button>
            </div>
            <div class="feedback-contenedor hidden"><div class="feedback-icon"></div><div class="feedback-texto"></div></div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-sm-pot-4" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>✏️ Pregunta 4</span>
              <div>Si $f(x)=\\sum_{n=0}^{\\infty}a_n(x-a)^n$, entonces el coeficiente $a_3$ es:</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Falta dividir por el factorial del índice de la derivada.">A) $f^{(3)}(a)$</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Se debe dividir por el factorial correspondiente al orden del término (3), es decir, $3! = 6$.">B) $\\frac{f^{(3)}(a)}{2!}$</button>
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Por el Teorema de Taylor, los coeficientes satisfacen la fórmula general $a_n = \\frac{f^{(n)}(a)}{n!}$. Para $n=3$, se tiene $a_3 = \\frac{f^{(3)}(a)}{3!}$.">C) $\\frac{f^{(3)}(a)}{3!}$</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. La derivada se divide por $3!$, no se multiplica por ella.">D) $3!f^{(3)}(a)$</button>
            </div>
            <div class="feedback-contenedor hidden"><div class="feedback-icon"></div><div class="feedback-texto"></div></div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-sm-pot-5" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>✏️ Pregunta 5</span>
              <div>Después de encontrar el radio de convergencia $R$, el siguiente paso fundamental es:</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Escribir el intervalo de inmediato asume que los extremos están abiertos, lo cual no es necesariamente cierto.">A) Escribir inmediatamente el intervalo de convergencia</button>
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! El radio $R$ define los puntos interiores, pero el comportamiento en los extremos $x=a-R$ y $x=a+R$ es indeterminado y debe ser analizado por separado para cada caso.">B) Estudiar los extremos</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Las derivadas se calculan previamente para construir series, no tras hallar el radio.">C) Calcular las derivadas</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. El criterio de D'Alembert ya se ejecutó en la primera etapa y no se requiere nuevamente.">D) Aplicar nuevamente el criterio de D'Alembert</button>
            </div>
            <div class="feedback-contenedor hidden"><div class="feedback-icon"></div><div class="feedback-texto"></div></div>
          </div>
        `;

        const capIntPotExercises = JSON.stringify([
          {
            "title": "Cálculo de Radio e Intervalo Base",
            "level": "resuelto",
            "statement": "Determine el radio y el intervalo de convergencia de la serie: $$\\sum_{n=1}^{\\infty}\\frac{x^n}{n}$$",
            "solution": "<strong>Solución paso a paso:</strong><ol><li>Aplicamos el Criterio de la Razón de D\\'Alembert con $a_n = \\frac{1}{n}$:<br>$$L = \\lim_{n\\to\\infty} \\left| \\frac{a_{n+1}}{a_n} \\right| = \\lim_{n\\to\\infty} \\left| \\frac{1/(n+1)}{1/n} \\right| = \\lim_{n\\to\\infty} \\frac{n}{n+1} = 1$$</li><li>El radio de convergencia es $R = \\frac{1}{L} = 1$.</li><li>Establecemos el intervalo preliminar centrado en $a=0$: $(-1, 1)$. Evaluamos ahora los extremos de forma manual:<br><ul><li><strong>Si $x = 1$:</strong> Obtenemos la serie armónica $\\sum_{n=1}^{\\infty} \\frac{1}{n}$, la cual diverge.</li><li><strong>Si $x = -1$:</strong> Obtenemos la serie armónica alternada $\\sum_{n=1}^{\\infty} \\frac{(-1)^n}{n}$, la cual converge por el Criterio de Leibniz.</li></ul></li></ol><p><strong>Resultado final:</strong> El radio de convergencia es $R = 1$ y el intervalo de convergencia es $[-1, 1)$.</p>"
          },
          {
            "title": "Maclaurin de una Función Lineal",
            "level": "resuelto",
            "statement": "Obtenga la serie de Maclaurin de la función: $$f(x)=1+x$$",
            "solution": "<strong>Solución paso a paso:</strong><ol><li>Evaluamos la función en el centro $a = 0$: $f(0) = 1 + 0 = 1$.</li><li>Calculamos la primera derivada: $f'(x) = 1$. Evaluamos en el centro: $f'(0) = 1$.</li><li>Calculamos la segunda derivada: $f''(x) = 0$. Evaluamos en el centro: $f''(0) = 0$.</li><li>Cualquier derivada de orden superior a 1 es cero: $f^{(n)}(0) = 0$ para todo $n \\ge 2$.</li><li>Aplicamos la fórmula de Maclaurin:<br>$$f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(0)}{n!}x^n = \\frac{f(0)}{0!}x^0 + \\frac{f'(0)}{1!}x^1 + 0 + 0 + \\dots = 1 + x$$</li></ol><p><strong>Resultado final:</strong> La serie de Maclaurin es la suma finita $1 + x$.</p>"
          },
          {
            "title": "Cálculo de Límite mediante Maclaurin",
            "level": "resuelto",
            "statement": "Calcule el siguiente límite utilizando la serie de Maclaurin de la función exponencial: $$\\lim_{x\\to0} \\frac{e^x-1}{x}$$",
            "solution": "<strong>Solución paso a paso:</strong><ol><li>Recordamos la serie de Maclaurin para la función exponencial:<br>$$e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\dots$$</li><li>Restamos 1 a la serie de potencias:<br>$$e^x - 1 = x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\dots$$</li><li>Dividimos toda la expresión por $x$ (para $x \\neq 0$):<br>$$\\frac{e^x - 1}{x} = 1 + \\frac{x}{2!} + \\frac{x^2}{3!} + \\dots$$</li><li>Aplicamos el límite cuando $x \\to 0$:<br>$$\\lim_{x\\to0} \\frac{e^x-1}{x} = \\lim_{x\\to0} \\left( 1 + \\frac{x}{2!} + \\frac{x^2}{3!} + \\dots \\right) = 1 + 0 + 0 + \\dots = 1$$</li></ol><p><strong>Resultado final:</strong> El valor del límite es $1$.</p>"
          },
          {
            "title": "Convergencia de serie corrida",
            "level": "nivel-2",
            "statement": "Determine el radio y el intervalo de convergencia de la serie: $$\\sum_{n=1}^{\\infty}\\frac{(x-1)^n}{n\\,2^n}$$",
            "solution": "<strong>Pauta de control:</strong><p>Aplicando D\\'Alembert con $a_n = \\frac{1}{n 2^n}$, obtenemos $L = \\lim \\frac{n 2^n}{(n+1) 2^{n+1}} = \\frac{1}{2}$, por lo que el radio es $R = 2$. El intervalo abierto es $(1-2, 1+2) = (-1, 3)$. Evaluando los extremos:</p><ul><li>Si $x=3$: Obtenemos la serie armónica simple (Diverge).</li><li>Si $x=-1$: Obtenemos la serie alternada (Converge).</li></ul><strong>Resultado:</strong> $R=2$, Intervalo: $[-1, 3)$."
          },
          {
            "title": "Serie lineal ponderada",
            "level": "nivel-2",
            "statement": "Determine el radio y el intervalo de convergencia de la serie: $$\\sum_{n=1}^{\\infty}\\frac{n(x+2)^n}{3^n}$$",
            "solution": "<strong>Pauta de control:</strong><p>Aplicando D\\'Alembert, obtenemos $L = \\frac{1}{3}$, lo que da $R = 3$. El intervalo abierto es $(-2-3, -2+3) = (-5, 1)$. Evaluando extremos:</p><ul><li>Si $x=1$: Obtenemos la serie de término general $n$, divergente.</li><li>Si $x=-5$: Obtenemos la serie alternada de término general $(-1)^n n$, divergente.</li></ul><strong>Resultado:</strong> $R=3$, Intervalo: $(-5, 1)$."
          },
          {
            "title": "Serie con factoriales dobles",
            "level": "nivel-3",
            "statement": "Determine el radio y el intervalo de convergencia de la serie: $$\\sum_{n=1}^{\\infty}\\frac{(n!)^2}{(2n)!}(x-3)^n$$",
            "solution": "<strong>Pauta de control:</strong><p>Aplicando D\\'Alembert con $a_n = \\frac{(n!)^2}{(2n)!}$:</p>$$L = \\lim_{n\\to\\infty} \\frac{((n+1)!)^2}{(2n+2)!} \\cdot \\frac{(2n)!}{(n!)^2} = \\lim_{n\\to\\infty} \\frac{(n+1)^2}{(2n+2)(2n+1)} = \\lim_{n\\to\\infty} \\frac{n+1}{4n+2} = \\frac{1}{4}$$<p>Esto resulta en un radio de convergencia $R = 4$. El intervalo abierto es $(-1, 7)$. El estudio de extremos en este nivel requiere criterios avanzados y ambos extremos resultan divergentes.</p><strong>Resultado:</strong> $R=4$, Intervalo: $(-1, 7)$."
          },
          {
            "title": "Serie con potencias de Euler",
            "level": "nivel-3",
            "statement": "Determine el radio y el intervalo de convergance de la serie: $$\\sum_{n=1}^{\\infty}\\frac{n!}{n^n}(x-2)^n$$",
            "solution": "<strong>Pauta de control:</strong><p>Aplicando D\\'Alembert, usamos el límite notable de Euler:</p>$$L = \\lim_{n\\to\\infty} \\frac{(n+1)!}{(n+1)^{n+1}} \\cdot \\frac{n^n}{n!} = \\lim_{n\\to\\infty} \\left( \\frac{n}{n+1} \\right)^n = \\lim_{n\\to\\infty} \\frac{1}{(1 + 1/n)^n} = \\frac{1}{e}$$<p>Por lo tanto, el radio de convergencia es $R = e$. El intervalo abierto es $(2-e, 2+e)$.</p><strong>Resultado:</strong> $R=e$, Intervalo: $(2-e, 2+e)$."
          },
          {
            "title": "Taylor de monomio en centro desplazado",
            "level": "nivel-2",
            "statement": "Obtenga la serie de Taylor de la función $f(x)=x^2$, centrada en $a=1$.",
            "solution": "<strong>Pauta de control:</strong><p>El centro es $a=1$. Derivadas evaluadas: $f(1)=1$, $f'(x)=2x \\implies f'(1)=2$, $f''(x)=2 \\implies f''(1)=2$. Derivadas de orden $\\ge 3$ son nulas. Coeficientes: $a_0 = 1/0! = 1$, $a_1 = 2/1! = 2$, $a_2 = 2/2! = 1$.</p><strong>Resultado:</strong> La serie de Taylor es la suma finita $1 + 2(x-1) + (x-1)^2$."
          },
          {
            "title": "Cálculo de límite con la serie del Seno",
            "level": "nivel-2",
            "statement": "Calcule el siguiente límite utilizando series de potencias: $$\\lim_{x\\to0} \\frac{\\sin x-x}{x^3}$$",
            "solution": "<strong>Pauta de control:</strong><p>Sustituimos la serie del seno $\\sin x = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\dots$ en el límite:</p>$$\\lim_{x\\to0} \\frac{(x - \\frac{x^3}{6} + \\frac{x^5}{120} - \\dots) - x}{x^3} = \\lim_{x\\to0} \\left( -\\frac{1}{6} + \\frac{x^2}{120} - \\dots \\right) = -\\frac{1}{6}$$<strong>Resultado:</strong> $-\\frac{1}{6}$."
          },
          {
            "title": "Límite del Logaritmo por Maclaurin",
            "level": "nivel-2",
            "statement": "Calcule el siguiente límite utilizando la serie de Maclaurin de $\\ln(1+x)$: $$\\lim_{x\\to0} \\frac{\\ln(1+x)-x+\\frac{x^2}{2}}{x^3}$$",
            "solution": "<strong>Pauta de control:</strong><p>Sustituimos la serie del logaritmo $\\ln(1+x) = x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\frac{x^4}{4} + \\dots$ en el límite:</p>$$\\lim_{x\\to0} \\frac{(x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\frac{x^4}{4} + \\dots) - x + \\frac{x^2}{2}}{x^3} = \\lim_{x\\to0} \\left( \\frac{1}{3} - \\frac{x}{4} + \\dots \\right) = \\frac{1}{3}$$<strong>Resultado:</strong> $\\frac{1}{3}$."
          }
        ]);

        const capIntPotFormulas = `
          <h3 style="margin: 0 0 12px 0; color: var(--accent-color); font-size: 1.15rem; font-weight: 700; font-family: var(--font-display);">
            📐 Fórmulas de Apoyo
          </h3>
          
          <div class="formula-card">
            <h4>Serie de Potencias centrada en $a$</h4>
            <div class="formula-card-latex">
              \\( \\displaystyle \\sum_{n=0}^{\\infty}a_n(x-a)^n \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              Forma general de una serie de potencias centrada en el punto $a$.
            </p>
          </div>

          <div class="formula-card">
            <h4>Serie de Taylor</h4>
            <div class="formula-card-latex">
              \\( \\displaystyle \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              Representación de una función infinitamente derivable en torno al centro $a$.
            </p>
          </div>

          <div class="formula-card">
            <h4>Serie de Maclaurin</h4>
            <div class="formula-card-latex">
              \\( \\displaystyle \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(0)}{n!}x^n \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              Serie de Taylor particular con centro en el origen ($a = 0$).
            </p>
          </div>

          <div class="formula-card">
            <h4>Criterio de la Razón de D'Alembert</h4>
            <div class="formula-card-latex" style="padding: 10px 6px;">
              \\( \\displaystyle R = \\frac{1}{L} \\)
              <div style="font-size: 0.8rem; color: var(--text-muted); margin: 4px 0;">donde</div>
              \\( \\displaystyle L = \\lim_{n\\to\\infty} \\left| \\frac{a_{n+1}}{a_n} \\right| \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              Método para encontrar el radio de convergencia $R$ de una serie.
            </p>
          </div>

          <div class="formula-card">
            <h4>Serie Geométrica Fundamental</h4>
            <div class="formula-card-latex" style="padding: 10px 6px;">
              \\( \\displaystyle \\frac{1}{1-x} = \\sum_{n=0}^{\\infty} x^n \\)
              <div style="font-size: 0.8rem; color: var(--text-muted); margin: 4px 0;">para</div>
              \\( \\displaystyle |x| < 1 \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              Serie base con radio de convergencia $R = 1$.
            </p>
          </div>

          <div class="formula-card">
            <h4>Desarrollo Exponencial</h4>
            <div class="formula-card-latex" style="padding: 10px 6px;">
              \\( \\displaystyle e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} \\)
              <div style="font-size: 0.8rem; color: var(--text-muted); margin: 4px 0;">para</div>
              \\( \\displaystyle x \\in \\mathbb{R} \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              Serie de Maclaurin de la función exponencial válida para todo $x \\in \\mathbb{R}$.
            </p>
          </div>

          <div class="formula-card">
            <h4>Desarrollo del Logaritmo Natural</h4>
            <div class="formula-card-latex" style="padding: 10px 6px;">
              \\( \\displaystyle \\ln(1+x) = \\sum_{n=1}^{\\infty} (-1)^{n+1} \\frac{x^n}{n} \\)
              <div style="font-size: 0.8rem; color: var(--text-muted); margin: 4px 0;">para</div>
              \\( \\displaystyle -1 < x \\le 1 \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              Desarrollo con intervalo de convergencia semiabierto para $-1 < x \\le 1$.
            </p>
          </div>

          <div class="formula-card">
            <h4>Desarrollo de la Función Seno</h4>
            <div class="formula-card-latex" style="padding: 10px 6px;">
              \\( \\displaystyle \\sin x = \\sum_{n=0}^{\\infty} (-1)^n \\frac{x^{2n+1}}{(2n+1)!} \\)
              <div style="font-size: 0.8rem; color: var(--text-muted); margin: 4px 0;">para</div>
              \\( \\displaystyle x \\in \\mathbb{R} \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              Desarrollo de Maclaurin para la función impar seno válida para todo $x \\in \\mathbb{R}$.
            </p>
          </div>

          <div class="formula-card">
            <h4>Desarrollo de la Función Coseno</h4>
            <div class="formula-card-latex" style="padding: 10px 6px;">
              \\( \\displaystyle \\cos x = \\sum_{n=0}^{\\infty} (-1)^n \\frac{x^{2n}}{(2n)!} \\)
              <div style="font-size: 0.8rem; color: var(--text-muted); margin: 4px 0;">para</div>
              \\( \\displaystyle x \\in \\mathbb{R} \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              Desarrollo de Maclaurin para la función par coseno válida para todo $x \\in \\mathbb{R}$.
            </p>
          </div>
        `;

         await client.query(`
          INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked, content_motivation, content_theory, content_application, content_exercises, content_formulas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [u1Id, '1.1', 'Radio e intervalo de potencias', false, false, capIntPotMotivation, capIntPotTheory, capIntPotApplication, capIntPotExercises, capIntPotFormulas]);

        const capIntPot2Motivation = `
          <div class="caja-ram caja-motivacion">
            <div class="caja-ram-icon">💡</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Motivación: Operando con el infinito</div>
              <p>
                En la primera parte estudiamos cómo determinar el radio y el intervalo de convergencia de una serie de potencias y cómo construir la serie de Taylor de una función.
              </p>
              <p>
                En esta segunda parte aprenderemos a utilizar esas series para obtener nuevas representaciones de funciones mediante operaciones sencillas como derivar, integrar, sustituir la variable o multiplicar por un polinomio.
              </p>
              <p>
                La idea fundamental es que, si conocemos la serie de una función, muchas veces podemos deducir la serie de otra sin necesidad de calcular nuevamente todas sus derivadas.
              </p>
              <p>
                Por ejemplo, a partir de la serie geométrica:
                $$ \\frac{1}{1-x} = \\sum_{n=0}^{\\infty}x^n, \\qquad |x|<1, $$
                podremos obtener con facilidad las series de:
                $$ \\frac{1}{(1-x)^2}, \\qquad -\\ln(1-x), \\qquad \\frac{1}{1+x}, \\qquad \\frac{1}{1-x^2}, $$
                y muchas otras funciones. Estas técnicas constituyen una de las herramientas más importantes del cálculo y permiten construir rápidamente nuevas series de potencias.
              </p>
            </div>
          </div>
        `;

        const capIntPot2Theory = `
          <h3>1. Derivación término a término</h3>
          <p>
            Una de las propiedades más importantes de las series de potencias es que pueden derivarse término a término sin modificar su radio de convergencia.
          </p>

          <div class="caja-ram caja-teorema">
            <div class="caja-ram-icon">🧠</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Teorema: Derivación término a término</div>
              <p>
                Sea $f(x)= \\sum_{n=0}^{\\infty} a_n(x-a)^n$ una serie de potencias con radio de convergencia $R>0$. Entonces $f$ es derivable en $(a-R,a+R)$, y:
                $$f'(x) = \\sum_{n=1}^{\\infty} na_n(x-a)^{n-1}.$$
                Además, la serie derivada es nuevamente una serie de potencias centrada en $a$ y posee el mismo radio de convergencia $R$.
              </p>
              <p>
                <strong>Nota:</strong> Los extremos del intervalo de convergencia deben estudiarse nuevamente.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-ejemplo">
            <div class="caja-ram-icon">📝</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Ejemplo: Serie para $\\frac{1}{(1-x)^2}$</div>
              <p>
                Partimos de la serie geométrica:
                $$ \\frac{1}{1-x} = \\sum_{n=0}^{\\infty}x^n, \\qquad |x|<1. $$
                Derivando ambos lados con respecto a $x$:
                $$ \\frac{1}{(1-x)^2} = \\sum_{n=1}^{\\infty} nx^{n-1}, \\qquad |x|<1. $$
                El radio de convergencia permanece igual a $R=1$.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-idea">
            <div class="caja-ram-icon">💡</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Idea Clave</div>
              <p>
                Derivar una serie de potencias produce otra serie de potencias con el mismo radio de convergencia.
              </p>
            </div>
          </div>

          <div class="caja-ram error-comun">
            <div class="caja-ram-icon">🚨</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Error Común (¡Trampa Cognitiva!)</div>
              <p>
                Pensar que el intervalo de convergencia también permanece inalterado. Aunque el radio $R$ no cambia, el comportamiento en los extremos debe verificarse nuevamente.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-procedimiento">
            <div class="caja-ram-icon">⚙️</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Procedimiento: Derivar una Serie de Potencias</div>
              <ol style="margin-left: 20px; margin-top: 8px;">
                <li>Derivar cada término de la serie.</li>
                <li>Simplificar la expresión obtenida.</li>
                <li>Conservar el mismo radio de convergencia $R$.</li>
                <li>Estudiar nuevamente los extremos.</li>
              </ol>
            </div>
          </div>

          <h3>2. Integración término a término</h3>
          <p>
            Las series de potencias también pueden integrarse término a término.
          </p>

          <div class="caja-ram caja-teorema">
            <div class="caja-ram-icon">🧠</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Teorema: Integración término a término</div>
              <p>
                Sea $f(x)= \\sum_{n=0}^{\\infty} a_n(x-a)^n$ una serie de potencias con radio de convergencia $R>0$. Entonces:
                $$ \\int f(x)\\,dx = C+ \\sum_{n=0}^{\\infty} \\frac{a_n}{n+1}(x-a)^{n+1}. $$
                Además, la serie integrada también es una serie de potencias centrada en $a$ y posee el mismo radio de convergencia $R$.
              </p>
              <p>
                <strong>Nota:</strong> Los extremos del intervalo de convergencia deben estudiarse nuevamente.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-ejemplo">
            <div class="caja-ram-icon">📝</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Ejemplo: Serie para $-\\ln(1-x)$</div>
              <p>
                Partimos de la serie geométrica:
                $$ \\frac{1}{1-x} = \\sum_{n=0}^{\\infty}x^n, \\qquad |x|<1. $$
                Integrando desde $0$ hasta $x$ ambos lados:
                $$ -\\ln(1-x) = \\sum_{n=0}^{\\infty} \\frac{x^{n+1}}{n+1}, \\qquad |x|<1. $$
                Equivalentemente, haciendo un cambio de índice ($k = n+1$):
                $$ -\\ln(1-x) = \\sum_{n=1}^{\\infty} \\frac{x^n}{n}. $$
              </p>
            </div>
          </div>

          <div class="caja-ram caja-idea">
            <div class="caja-ram-icon">💡</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Idea Clave</div>
              <p>
                Integrar una serie de potencias produce otra serie de potencias con el mismo radio de convergencia.
              </p>
            </div>
          </div>

          <div class="caja-ram error-comun">
            <div class="caja-ram-icon">🚨</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Error Común</div>
              <p>
                Olvidar la constante de integración $C$ cuando se calcula una integral indefinida.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-procedimiento">
            <div class="caja-ram-icon">⚙️</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Procedimiento: Integrar una Serie de Potencias</div>
              <ol style="margin-left: 20px; margin-top: 8px;">
                <li>Integrar cada término de la serie.</li>
                <li>Agregar la constante de integración $C$ si corresponde.</li>
                <li>Conservar el mismo radio de convergencia $R$.</li>
                <li>Estudiar nuevamente los extremos.</li>
              </ol>
            </div>
          </div>

          <h3>3. Sustitución</h3>
          <p>
            Otra forma de construir nuevas series consiste en reemplazar la variable por otra expresión.
          </p>

          <div class="caja-ram caja-teorema">
            <div class="caja-ram-icon">🧠</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Teorema: Sustitución de variable</div>
              <p>
                Sea $f(x) = \\sum_{n=0}^{\\infty} a_n(x-c)^n$ una serie de potencias con radio de convergencia $R$. Si una función $g(x)$ satisface $|g(x)-c|<R$, entonces:
                $$ f(g(x)) = \\sum_{n=0}^{\\infty} a_n(g(x)-c)^n. $$
                Para determinar el conjunto de convergencia de la nueva serie debe resolverse la desigualdad $|g(x)-c|<R$.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-ejemplo">
            <div class="caja-ram-icon">📝</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Ejemplo: Serie para $\\frac{1}{1+x}$</div>
              <p>
                A partir de la serie geométrica, sustituimos $x \\longmapsto -x$:
                $$ \\frac{1}{1+x} = \\sum_{n=0}^{\\infty} (-1)^nx^n, \\qquad |x|<1. $$
              </p>
            </div>
          </div>

          <div class="caja-ram caja-ejemplo">
            <div class="caja-ram-icon">📝</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Ejemplo: Serie para $\\frac{1}{1-2x}$</div>
              <p>
                Sustituyendo $x \\longmapsto 2x$ en la serie geométrica:
                $$ \\frac{1}{1-2x} = \\sum_{n=0}^{\\infty} 2^nx^n. $$
                La condición de convergencia pasa a ser $|2x|<1$, es decir, $|x|<\\frac{1}{2}$. Por tanto, el nuevo radio de convergencia es $R=\\frac{1}{2}$.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-idea">
            <div class="caja-ram-icon">💡</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Idea Clave</div>
              <p>
                A diferencia de la derivación y de la integración, la sustitución puede modificar el radio y el intervalo de convergencia.
              </p>
            </div>
          </div>

          <div class="caja-ram error-comun">
            <div class="caja-ram-icon">🚨</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Error Común</div>
              <p>
                Mantener el mismo intervalo de convergencia después de sustituir la variable. Siempre debe resolverse nuevamente la condición $|g(x)-c|<R$.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-procedimiento">
            <div class="caja-ram-icon">⚙️</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Procedimiento: Sustitución en una Serie de Potencias</div>
              <ol style="margin-left: 20px; margin-top: 8px;">
                <li>Escribir una serie conocida.</li>
                <li>Sustituir la variable por la expresión deseada $g(x)$.</li>
                <li>Simplificar la serie obtenida.</li>
                <li>Determinar nuevamente el intervalo de convergencia resolviendo la desigualdad correspondiente.</li>
              </ol>
            </div>
          </div>

          <h3>4. Multiplicación por un polinomio</h3>
          <p>
            Otra forma sencilla de obtener nuevas series consiste en multiplicar una serie conocida por un polinomio.
          </p>

          <div class="caja-ram caja-teorema">
            <div class="caja-ram-icon">🧠</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Teorema: Multiplicación por un polinomio</div>
              <p>
                Sea $f(x)= \\sum_{n=0}^{\\infty} a_n(x-a)^n$ una serie de potencias con radio de convergencia $R$, y sea $P(x)$ un polinomio. Entonces $P(x)f(x)$ también puede escribirse como una serie de potencias centrada en $a$. Además, la nueva serie tiene el mismo radio de convergencia $R$.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-ejemplo">
            <div class="caja-ram-icon">📝</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Ejemplo: Serie para $x^2e^x$</div>
              <p>
                Como $e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!}$, basta multiplicar ambos lados por $x^2$:
                $$ x^2e^x = \\sum_{n=0}^{\\infty} \\frac{x^{n+2}}{n!}. $$
                Dado que la serie de la exponencial converge para todo número real, el radio de convergencia sigue siendo $R=\\infty$.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-idea">
            <div class="caja-ram-icon">💡</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Idea Clave</div>
              <p>
                Multiplicar una serie de potencias por un polinomio modifica únicamente sus coeficientes y exponentes; el radio de convergencia permanece inalterado.
              </p>
            </div>
          </div>

          <div class="caja-ram error-comun">
            <div class="caja-ram-icon">🚨</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Error Común</div>
              <p>
                Modificar el radio de convergencia después de multiplicar por un polinomio. Esta operación nunca cambia el radio de convergencia.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-procedimiento">
            <div class="caja-ram-icon">⚙️</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Procedimiento: Multiplicación por Polinomio</div>
              <ol style="margin-left: 20px; margin-top: 8px;">
                <li>Escribir la serie conocida.</li>
                <li>Multiplicar cada término por el polinomio.</li>
                <li>Reordenar la serie si es necesario.</li>
                <li>Conservar el mismo radio de convergencia $R$.</li>
              </ol>
            </div>
          </div>

          <div class="caja-ram caja-idea">
            <div class="caja-ram-icon">💡</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Idea clave del capítulo</div>
              <p>
                Una vez conocida la serie de una función, es posible construir muchas otras utilizando únicamente cuatro operaciones básicas:
              </p>
              <ul style="margin-left: 20px; margin-bottom: 16px;">
                <li>Derivación término a término.</li>
                <li>Integración término a término.</li>
                <li>Sustitución de variable.</li>
                <li>Multiplicación por un polinomio.</li>
              </ul>
              <p>
                Antes de comenzar un ejercicio, conviene preguntarse cuál de estas herramientas permite obtener la función buscada a partir de una serie conocida.
              </p>
            </div>
          </div>
        `;

        const capIntPot2Application = `
          <h3>Evaluación Formativa Rápida</h3>
          <p>Comprueba tu comprensión respondiendo las siguientes preguntas interactivas:</p>

          <h4 style="color: var(--accent-color); margin-top: 20px; margin-bottom: 12px;">✏️ Verdadero o Falso</h4>

          <div class="evaluacion-formativa" data-eval-id="eval-vf-pot2-1" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>🤔 Enunciado 1</span>
              <div>La derivada de una serie de potencias siempre es otra serie de potencias.</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Por el teorema de derivación término a término, al derivar la serie obtenemos otra expresión de la forma $\\sum na_n(x-a)^{n-1}$, la cual sigue siendo una serie de potencias.">A) Verdadero</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Es verdadero. La derivada conserva la estructura de suma infinita de potencias de $(x-a)$.">B) Falso</button>
            </div>
            <div class="feedback-contenedor hidden"><div class="feedback-icon"></div><div class="feedback-texto"></div></div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-vf-pot2-2" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>🤔 Enunciado 2</span>
              <div>Después de derivar una serie de potencias es necesario volver a estudiar los extremos del intervalo de convergencia.</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! El radio de convergencia $R$ no cambia, pero la serie derivada puede perder convergencia en los extremos (o ganarla). Por ende, siempre es obligatorio reanalizar los extremos.">A) Verdadero</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Es verdadero. El teorema de derivación no garantiza el comportamiento en la frontera del intervalo, por lo que el análisis de extremos es mandatorio.">B) Falso</button>
            </div>
            <div class="feedback-contenedor hidden"><div class="feedback-icon"></div><div class="feedback-texto"></div></div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-vf-pot2-3" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>🤔 Enunciado 3</span>
              <div>La integral de una serie de potencias tiene el mismo radio de convergencia que la serie original.</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Al integrar término a término, el radio de convergencia $R$ se mantiene inalterado.">A) Verdadero</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Es verdadero. El teorema de integración término a término establece que la serie integrada comparte exactamente el mismo radio $R$.">B) Falso</button>
            </div>
            <div class="feedback-contenedor hidden"><div class="feedback-icon"></div><div class="feedback-texto"></div></div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-vf-pot2-4" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>🤔 Enunciado 4</span>
              <div>Al integrar una serie de potencias debe agregarse una constante de integración cuando se trata de una integral indefinida.</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Como en cualquier integración indefinida, la serie resultante representa una familia de funciones y debe incluir la constante de integración $C$.">A) Verdadero</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Es verdadero. La constante $C$ es indispensable para reflejar todos los posibles valores de la integral indefinida.">B) Falso</button>
            </div>
            <div class="feedback-contenedor hidden"><div class="feedback-icon"></div><div class="feedback-texto"></div></div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-vf-pot2-5" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>🤔 Enunciado 5</span>
              <div>Después de realizar una sustitución siempre se conserva el radio de convergencia.</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. La sustitución es la única de las operaciones básicas que puede alterar el radio de convergencia, dependiendo de la función sustituida $g(x)$.">A) Verdadero</button>
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Es falso. Si sustituyes $x \\longmapsto 2x$, el intervalo se reduce a la mitad ($R = 1/2$), por lo que el radio cambia.">B) Falso</button>
            </div>
            <div class="feedback-contenedor hidden"><div class="feedback-icon"></div><div class="feedback-texto"></div></div>
          </div>


          <h4 style="color: var(--accent-color); margin-top: 30px; margin-bottom: 12px;">✏️ Selección Múltiple</h4>

          <div class="evaluacion-formativa" data-eval-id="eval-sm-pot2-1" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>✏️ Pregunta 1</span>
              <div>¿Cuál de las siguientes operaciones puede modificar el radio de convergencia?</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. La derivación conserva el mismo radio de convergencia.">A) Derivación término a término</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. La integración comparte el mismo radio de convergencia original.">B) Integración término a término</button>
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! La sustitución $x \\longmapsto g(x)$ requiere resolver $|g(x)-c| < R$, lo que puede comprimir, dilatar o cambiar la forma del intervalo de convergencia.">C) Sustitución de variable</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. La multiplicación por un polinomio no altera el radio de convergencia de la serie.">D) Multiplicación por un polinomio</button>
            </div>
            <div class="feedback-contenedor hidden"><div class="feedback-icon"></div><div class="feedback-texto"></div></div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-sm-pot2-2" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>✏️ Pregunta 2</span>
              <div>A partir de la serie geométrica $\\frac{1}{1-x} = \\sum_{n=0}^{\\infty}x^n$, ¿qué operación permite obtener directamente la serie de $\\frac{1}{(1-x)^2}$?</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. La integración de $\\frac{1}{1-x}$ daría $-\\ln(1-x)$, no $\\frac{1}{(1-x)^2}$.">A) Integración</button>
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Dado que la derivada de $\\frac{1}{1-x}$ es exactamente $\\frac{1}{(1-x)^2}$, al derivar término a término la serie obtenemos la representación buscada.">B) Derivación</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Ninguna sustitución directa transforma la función racional simple en una cuadrática en el denominador de forma lineal.">C) Sustitución</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Multiplicar por un polinomio no eleva la potencia del denominador.">D) Multiplicación por un polinomio</button>
            </div>
            <div class="feedback-contenedor hidden"><div class="feedback-icon"></div><div class="feedback-texto"></div></div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-sm-pot2-3" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>✏️ Pregunta 3</span>
              <div>Después de sustituir $x \\longmapsto 3x$ en una serie con radio de convergencia $R=1$, la condición de convergencia pasa a ser:</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Esta es la condición de convergencia de la serie original antes del cambio.">A) $|x| < 1$</button>
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Reemplazamos la variable $x$ por $3x$ en la desigualdad $|x| < 1$, resultando en $|3x| < 1$, lo que equivale a $|x| < \\frac{1}{3}$.">B) $|3x| < 1$</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. El intervalo se reduce por un factor de 3, no se expande.">C) $|x| < 3$</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Esta es la simplificación final, pero la pregunta solicita expresar la condición intermedia directa.">D) $|x| < \\frac{1}{3}$</button>
            </div>
            <div class="feedback-contenedor hidden"><div class="feedback-icon"></div><div class="feedback-texto"></div></div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-sm-pot2-4" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>✏️ Pregunta 4</span>
              <div>¿Cuál es la herramienta más adecuada para obtener la serie de $\\frac{1}{1+x^2}$ a partir de la serie geométrica?</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. La derivada eleva el exponente en el denominador en forma de factor, no de sustitución cuadrática.">A) Derivación</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Integrar introduce términos logarítmicos o arcotangente.">B) Integración</button>
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Sustituimos $x \\longmapsto -x^2$ en la serie geométrica original para obtener $\\frac{1}{1-(-x^2)} = \\frac{1}{1+x^2}$.">C) Sustitución</button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Multiplicar por un polinomio no altera la estructura interna del denominador.">D) Multiplicación por un polinomio</button>
            </div>
            <div class="feedback-contenedor hidden"><div class="feedback-icon"></div><div class="feedback-texto"></div></div>
          </div>

          <h4 style="color: var(--accent-color); margin-top: 30px; margin-bottom: 12px;">✏️ Identificación de Estrategias</h4>
          <p>Para cada función, identifica qué operación permite obtener su serie a partir de una serie conocida:</p>
          
          <ul style="margin-left: 20px; margin-bottom: 20px; line-height: 1.6;">
            <li><strong>1) $\\frac{1}{(1-x)^2}$ :</strong> Derivación (A)</li>
            <li><strong>2) $-\\ln(1-x)$ :</strong> Integración (B)</li>
            <li><strong>3) $\\frac{1}{1+x}$ :</strong> Sustitución (C)</li>
            <li><strong>4) $\\frac{1}{1+x^2}$ :</strong> Sustitución (C)</li>
            <li><strong>5) $x^2e^x$ :</strong> Multiplicación por un polinomio (D)</li>
            <li><strong>6) $x\\sin x$ :</strong> Multiplicación por un polinomio (D)</li>
          </ul>
        `;

        const capIntPot2Exercises = JSON.stringify([
          {
            "title": "Derivación Básica término a término",
            "level": "resuelto",
            "statement": "Obtenga la serie de potencias y determine su intervalo de convergencia para $f(x) = \\frac{1}{(1-x)^2}$ a partir de la serie geométrica.",
            "solution": "<strong>Solución paso a paso:</strong><ol><li>Partimos de la serie geométrica conocida:<br>$$\\frac{1}{1-x} = \\sum_{n=0}^{\\infty}x^n, \\quad |x|<1$$</li><li>Derivamos ambos lados con respecto a $x$. La derivada del lado izquierdo es:<br>$$\\left(\\frac{1}{1-x}\\right)' = \\frac{1}{(1-x)^2}$$</li><li>Derivamos el lado derecho término a término (el primer término para $n=0$ es una constante, por lo que su derivada es $0$ y el índice comienza ahora en $n=1$):<br>$$\\sum_{n=0}^{\\infty} (x^n)' = \\sum_{n=1}^{\\infty} nx^{n-1}$$</li><li>Por lo tanto, obtenemos la serie:<br>$$\\frac{1}{(1-x)^2} = \\sum_{n=1}^{\\infty} nx^{n-1}$$</li><li>Por el teorema de derivación, el radio de convergencia sigue siendo $R = 1$. Estudiamos los extremos $x=1$ y $x=-1$ de forma manual:<br><ul><li>Si $x = 1$: Obtenemos $\\sum_{n=1}^{\\infty} n$, que diverge por el criterio del término general (el límite del término general no es cero).</li><li>Si $x = -1$: Obtenemos la serie alternada $\\sum_{n=1}^{\\infty} (-1)^{n-1}n$, que diverge por la misma razón.</li></ul></li></ol><p><strong>Resultado final:</strong> La serie de potencias es $\\sum_{n=1}^{\\infty} nx^{n-1}$ con intervalo de convergencia $(-1, 1)$.</p>"
          },
          {
            "title": "Combinación: Derivación y Multiplicación",
            "level": "resuelto",
            "statement": "Obtenga la serie de potencias y determine su intervalo de convergencia para $f(x) = \\frac{x}{(1-x)^2}$ a partir de la serie geométrica.",
            "solution": "<strong>Solución paso a paso:</strong><ol><li>Recordamos la serie obtenida por derivación término a término para $\\frac{1}{(1-x)^2}$ en el ejercicio anterior:<br>$$\\frac{1}{(1-x)^2} = \\sum_{n=1}^{\\infty} nx^{n-1}, \\quad |x| < 1$$</li><li>Multiplicamos ambos lados de la igualdad por el polinomio monomial $P(x) = x$:<br>$$\\frac{x}{(1-x)^2} = x \\sum_{n=1}^{\\infty} nx^{n-1} = \\sum_{n=1}^{\\infty} nx^n$$</li><li>Por el teorema correspondiente, multiplicar por un polinomio no altera el radio de convergencia, por lo que $R=1$.</li><li>Los extremos del intervalo abierto $(-1, 1)$ se estudian de la siguiente manera:<br><ul><li>Si $x=1$: Obtenemos la serie $\\sum_{n=1}^{\\infty} n$, divergente.</li><li>Si $x=-1$: Obtenemos la serie alternada $\\sum_{n=1}^{\\infty} (-1)^n n$, divergente.</li></ul></li></ol><p><strong>Resultado final:</strong> La serie es $\\sum_{n=1}^{\\infty} nx^n$ con intervalo de convergencia $(-1, 1)$.</p>"
          },
          {
            "title": "Integración básica: Logaritmo",
            "level": "nivel-1",
            "statement": "Obtenga la serie de potencias y determine el intervalo de convergencia de: $$f(x) = -\\ln(1-x)$$",
            "solution": "<strong>Pauta de control:</strong><p>Integrando la serie geométrica $\\frac{1}{1-x} = \\sum_{n=0}^{\\infty} x^n$ término a término:</p>$$-\\ln(1-x) = \\int \\frac{1}{1-x}\\,dx = C + \\sum_{n=0}^{\\infty} \\frac{x^{n+1}}{n+1}$$<p>Evaluando en $x=0$, vemos que $-\\ln(1) = 0 \\implies C = 0$. Haciendo un desfase de índice, la serie es $\\sum_{n=1}^{\\infty} \\frac{x^n}{n}$. El radio de convergencia es $R=1$. Evaluando los extremos:</p><ul><li>Si $x=1$: Serie armónica (Diverge).</li><li>Si $x=-1$: Serie armónica alternada (Para la cual converge por Leibniz).</li></ul><strong>Resultado:</strong> Serie: $\\sum_{n=1}^{\\infty} \\frac{x^n}{n}$, Intervalo: $[-1, 1).$"
          },
          {
            "title": "Sustitución lineal simple",
            "level": "nivel-1",
            "statement": "Obtenga la serie de potencias y determine el intervalo de convergencia de: $$f(x) = \\frac{1}{1+x}$$",
            "solution": "<strong>Pauta de control:</strong><p>Sustituyendo $x \\longmapsto -x$ en la serie geométrica $\\frac{1}{1-x} = \\sum_{n=0}^{\\infty} x^n$, obtenemos:</p>$$\\frac{1}{1+x} = \\sum_{n=0}^{\\infty} (-x)^n = \\sum_{n=0}^{\\infty} (-1)^n x^n$$<p>La condición de convergencia es $|-x| < 1 \\implies |x| < 1$, lo que da $R=1$. Evaluando extremos:</p><ul><li>Si $x=1$: Obtenemos $\\sum (-1)^n$ (Diverge).</li><li>Si $x=-1$: Obtenemos $\\sum 1$ (Diverge).</li></ul><strong>Resultado:</strong> Serie: $\\sum_{n=0}^{\\infty} (-1)^n x^n$, Intervalo: $(-1, 1)$."
          },
          {
            "title": "Sustitución cuadrática",
            "level": "nivel-2",
            "statement": "Obtenga la serie de potencias y determine el intervalo de convergencia de: $$f(x) = \\frac{1}{1-x^2}$$",
            "solution": "<strong>Pauta de control:</strong><p>Sustituyendo $x \\longmapsto x^2$ en la serie geométrica:</p>$$\\frac{1}{1-x^2} = \\sum_{n=0}^{\\infty} (x^2)^n = \\sum_{n=0}^{\\infty} x^{2n}$$<p>La condición de convergencia es $|x^2| < 1 \\implies |x| < 1$, por lo que $R=1$. Los extremos $x=\\pm 1$ dan términos generales constantes e iguales a 1, por lo que la serie diverge en ambos extremos.</p><strong>Resultado:</strong> Serie: $\\sum_{n=0}^{\\infty} x^{2n}$, Intervalo: $(-1, 1)$."
          },
          {
            "title": "Multiplicación de la Exponencial",
            "level": "nivel-2",
            "statement": "Obtenga la serie de potencias y determine el intervalo de convergencia de: $$f(x) = x^2e^x$$",
            "solution": "<strong>Pauta de control:</strong><p>Multiplicamos la serie de la exponencial $e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!}$ por el polinomio $x^2$:</p>$$x^2e^x = x^2 \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = \\sum_{n=0}^{\\infty} \\frac{x^{n+2}}{n!}$$<p>Dado que el radio de la exponencial es infinito ($R=\\infty$), el radio de la serie resultante sigue siendo infinito y el intervalo de convergencia abarca todos los números reales.</p><strong>Resultado:</strong> Serie: $\\sum_{n=0}^{\\infty} \\frac{x^{n+2}}{n!}$, Intervalo: $(-\\infty, \\infty)$."
          },
          {
            "title": "Combinación: Sustitución y Derivación",
            "level": "nivel-2",
            "statement": "Obtenga la serie de potencias e intervalo de convergencia de: $$f(x) = \\frac{1}{(1-x^2)^2}$$",
            "solution": "<strong>Pauta de control:</strong><p>A partir de la serie de $\\frac{1}{(1-t)^2} = \\sum_{n=1}^{\\infty} n t^{n-1}$ con $|t| < 1$, sustituimos $t \\longmapsto x^2$:</p>$$\\frac{1}{(1-x^2)^2} = \\sum_{n=1}^{\\infty} n (x^2)^{n-1} = \\sum_{n=1}^{\\infty} n x^{2n-2}$$<p>La condición de convergencia es $|x^2| < 1 \\implies |x| < 1$, lo que da $R=1$. Evaluando los extremos $x=\\pm 1$, en ambos casos obtenemos la serie divergente $\\sum n$.</p><strong>Resultado:</strong> Serie: $\\sum_{n=1}^{\\infty} n x^{2n-2}$, Intervalo: $(-1, 1)$."
          },
          {
            "title": "Combinación: Propiedades de Logaritmos",
            "level": "nivel-3",
            "statement": "Obtenga la serie de potencias e intervalo de convergencia de: $$f(x) = \\ln((1-x)^{1-x})$$",
            "solution": "<strong>Pauta de control:</strong><p>Aplicando propiedades de logaritmos, tenemos $f(x) = (1-x)\\ln(1-x)$. Como conocemos la serie para $-\\ln(1-x) = \\sum_{n=1}^{\\infty} \\frac{x^n}{n}$, podemos escribir:</p>$$\\ln(1-x) = -\\sum_{n=1}^{\\infty} \\frac{x^n}{n}$$<p>Multiplicamos ahora por $(1-x)$:</p>$$(1-x)\\ln(1-x) = -(1-x)\\sum_{n=1}^{\\infty} \\frac{x^n}{n} = -\\sum_{n=1}^{\\infty} \\frac{x^n}{n} + \\sum_{n=1}^{\\infty} \\frac{x^{n+1}}{n}$$<p>Desfasando índices en la segunda suma, combinamos los términos para $x^n$. El radio de convergencia es $R=1$, y el análisis de extremos revela convergencia en $x=-1$ y $x=1$ (evaluando los límites correspondientes).</p><strong>Resultado:</strong> Intervalo: $[-1, 1]$."
          },
          {
            "title": "Multiplicación de la función Seno",
            "level": "nivel-2",
            "statement": "Obtenga la serie de potencias de: $$f(x) = x\\sin x$$",
            "solution": "<strong>Pauta de control:</strong><p>Multiplicamos la serie de la función seno $\\sin x = \\sum_{n=0}^{\\infty} (-1)^n \\frac{x^{2n+1}}{(2n+1)!}$ por el monomio $x$:</p>$$x\\sin x = x \\sum_{n=0}^{\\infty} (-1)^n \\frac{x^{2n+1}}{(2n+1)!} = \\sum_{n=0}^{\\infty} (-1)^n \\frac{x^{2n+2}}{(2n+1)!}$$<p>Dado que el radio de convergencia del seno es infinito, el nuevo radio también lo es.</p><strong>Resultado:</strong> Serie: $\\sum_{n=0}^{\\infty} (-1)^n \\frac{x^{2n+2}}{(2n+1)!}$, Intervalo: $(-\\infty, \\infty)$."
          },
          {
            "title": "Combinación: Operaciones algebraicas complejas",
            "level": "nivel-3",
            "statement": "Obtenga la serie de potencias de: $$f(x) = \\frac{x(2-x)}{(1-x)^2}$$",
            "solution": "<strong>Pauta de control:</strong><p>Podemos reescribir de forma algebraica la función:</p>$$\\frac{x(2-x)}{(1-x)^2} = \\frac{2x-x^2}{(1-x)^2} = \\frac{1 - (1-2x+x^2)}{(1-x)^2} = \\frac{1 - (1-x)^2}{(1-x)^2} = \\frac{1}{(1-x)^2} - 1$$<p>Sustituyendo la serie de $\\frac{1}{(1-x)^2} = \\sum_{n=1}^{\\infty} n x^{n-1} = 1 + 2x + 3x^2 + \\dots$:</p>$$\\frac{x(2-x)}{(1-x)^2} = \\left(1 + \\sum_{n=2}^{\\infty} n x^{n-1}\\right) - 1 = \\sum_{n=2}^{\\infty} n x^{n-1}$$<p>Haciendo un cambio de índice, esto se reduce a $\\sum_{n=1}^{\\infty} (n+1)x^n$ con radio de convergencia $R=1$ e intervalo $(-1, 1)$.</p><strong>Resultado:</strong> Serie: $\\sum_{n=1}^{\\infty} (n+1)x^n$, Intervalo: $(-1, 1)$."
          },
          {
            "title": "Desafío: Integración con series",
            "level": "nivel-3",
            "statement": "Calcule la siguiente integral indefinida utilizando series de potencias centradadas en el origen: $$\\int_0^x \\frac{t}{1+t^2}\\,dt$$",
            "solution": "<strong>Pauta de control:</strong><p>Primero, determinamos la serie de $\\frac{t}{1+t^2}$ sustituyendo $u \\longmapsto -t^2$ en la serie geométrica:</p>$$\\frac{1}{1+t^2} = \\sum_{n=0}^{\\infty} (-1)^n t^{2n} \\implies \\frac{t}{1+t^2} = \\sum_{n=0}^{\\infty} (-1)^n t^{2n+1}$$<p>Ahora, integramos término a término de 0 a $x$:</p>$$\\int_0^x \\left(\\sum_{n=0}^{\\infty} (-1)^n t^{2n+1}\\right)\\,dt = \\sum_{n=0}^{\\infty} (-1)^n \\left[ \\frac{t^{2n+2}}{2n+2} \\right]_0^x = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n+2}}{2n+2}$$<p>El radio de convergencia es $R=1$.</p><strong>Resultado:</strong> $\\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n+2}}{2n+2}$ con intervalo $(-1, 1]$."
          },
          {
            "title": "Desafío: Identidad de coeficientes",
            "level": "nivel-3",
            "statement": "Suponga que $\\sum_{n=0}^{\\infty}a_nx^n = \\sum_{n=0}^{\\infty}b_nx^n$ para todo $x$ en un intervalo abierto que contiene al origen. Demuestre que $a_n=b_n$ para todo $n\\ge0$.",
            "solution": "<strong>Pauta de control:</strong><p>Definimos $f(x) = \\sum_{n=0}^{\\infty} (a_n - b_n)x^n = 0$. Evaluando en $x=0$, obtenemos $a_0 - b_0 = 0 \\implies a_0 = b_0$. Derivando sucesivamente $f^{(k)}(x)$ y evaluando en $0$, obtenemos $k!(a_k - b_k) = 0$, de donde se concluye que $a_k = b_k$ para todo $k \\ge 0$.</p>"
          },
          {
            "title": "Desafío: Resolución de EDO lineal básica",
            "level": "nivel-3",
            "statement": "Sea $f(x)= \\sum_{n=0}^{\\infty}a_nx^n$ tal que $(1-x)f'(x)=f(x)$ con la condición inicial $f(0)=1$. Determine los coeficientes $a_n$.",
            "solution": "<strong>Pauta de control:</strong><p>Derivamos $f'(x) = \\sum_{n=1}^{\\infty} n a_n x^{n-1}$. Sustituyendo en la EDO:</p>$$(1-x)\\sum_{n=1}^{\\infty} n a_n x^{n-1} = \\sum_{n=0}^{\\infty} a_n x^n \\implies \\sum_{n=1}^{\\infty} n a_n x^{n-1} - \\sum_{n=1}^{\\infty} n a_n x^n = \\sum_{n=0}^{\\infty} a_n x^n$$<p>Agrupando términos e igualando coeficientes de $x^n$, se obtiene la relación de recurrencia $a_{n+1} = a_n$. Dado que $f(0)=a_0=1$, por inducción todos los coeficientes cumplen $a_n = 1$.</p><strong>Resultado:</strong> $a_n = 1$ para todo $n \\ge 0$ (la función es $\\frac{1}{1-x}$)."
          },
          {
            "title": "Desafío: Ecuación Integral",
            "level": "nivel-3",
            "statement": "Sea $f(x)= \\sum_{n=0}^{\\infty}a_nx^n$ tal que $f(x) = 1 + \\int_0^x f(t)\\,dt$. Determine los coeficientes $a_n$.",
            "solution": "<strong>Pauta de control:</strong><p>Sustituyendo la serie en la ecuación integral:</p>$$\\sum_{n=0}^{\\infty} a_n x^n = 1 + \\int_0^x \\left(\\sum_{n=0}^{\\infty} a_n t^n\\right)\\,dt = 1 + \\sum_{n=0}^{\\infty} \\frac{a_n}{n+1} x^{n+1}$$<p>Igualando términos de igual potencia:</p><ul><li>Para $n=0$: $a_0 = 1$.</li><li>Para potencias $x^{n+1}$: $a_{n+1} = \\frac{a_n}{n+1}$.</li></ul><p>Esto resulta en $a_n = \\frac{1}{n!}$, que corresponde al desarrollo de Maclaurin de $e^x$.</p><strong>Resultado:</strong> $a_n = \\frac{1}{n!}$ para todo $n \\ge 0$."
          },
          {
            "title": "Desafío: Inversa de una serie de potencias",
            "level": "nivel-3",
            "statement": "Sean $f(x)= \\sum_{n=0}^{\\infty}a_nx^n$ y $g(x)= \\sum_{n=0}^{\\infty}b_nx^n$, y suponga que $f(x)g(x)=1$. Demuestre que $a_0b_0=1$ y que $\\sum_{k=0}^{n} a_kb_{n-k}=0$ para todo $n\\ge1$.",
            "solution": "<strong>Pauta de control:</strong><p>Al multiplicar las series obtenemos el producto de Cauchy:</p>$$f(x)g(x) = \\sum_{n=0}^{\\infty} c_n x^n = 1 \\quad \\text{donde } c_n = \\sum_{k=0}^{n} a_k b_{n-k}$$<p>Por identidad de coeficientes, el término constante $c_0 = a_0b_0 = 1$, y todos los coeficientes de potencias de $x^n$ (para $n \\ge 1$) son nulos, es decir, $c_n = \\sum_{k=0}^{n} a_k b_{n-k} = 0$.</p>"
          }
        ]);

        const capIntPot2Formulas = `
          <h3 style="margin: 0 0 12px 0; color: var(--accent-color); font-size: 1.15rem; font-weight: 700; font-family: var(--font-display);">
            📐 Fórmulas de Apoyo
          </h3>
          
          <div class="formula-card">
            <h4>Derivación término a término</h4>
            <div class="formula-card-latex" style="padding: 10px 6px;">
              \\( \\displaystyle f'(x) = \\sum_{n=1}^{\\infty} na_n(x-a)^{n-1} \\)
              <div style="font-size: 0.8rem; color: var(--text-muted); margin: 4px 0;">para la serie original</div>
              \\( \\displaystyle f(x) = \\sum_{n=0}^{\\infty} a_n(x-a)^n \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              El radio de convergencia $R$ es idéntico al original. Los extremos deben reevaluarse.
            </p>
          </div>

          <div class="formula-card">
            <h4>Integración término a término</h4>
            <div class="formula-card-latex" style="padding: 10px 6px;">
              \\( \\displaystyle \\int f(x)\\,dx = C + \\sum_{n=0}^{\\infty} \\frac{a_n}{n+1}(x-a)^{n+1} \\)
              <div style="font-size: 0.8rem; color: var(--text-muted); margin: 4px 0;">para la serie original</div>
              \\( \\displaystyle f(x) = \\sum_{n=0}^{\\infty} a_n(x-a)^n \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              El radio de convergencia $R$ se conserva. Recuerda siempre agregar la constante de integración $C$.
            </p>
          </div>

          <div class="formula-card">
            <h4>Sustitución de variable</h4>
            <div class="formula-card-latex" style="padding: 10px 6px;">
              \\( \\displaystyle f(g(x)) = \\sum_{n=0}^{\\infty} a_n(g(x)-c)^n \\)
              <div style="font-size: 0.8rem; color: var(--text-muted); margin: 4px 0;">siempre que se cumpla</div>
              \\( \\displaystyle |g(x)-c| < R \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              Esta operación puede alterar el radio de convergencia original. Resuelve la desigualdad para hallar el nuevo intervalo.
            </p>
          </div>

          <div class="formula-card">
            <h4>Multiplicación por un polinomio</h4>
            <div class="formula-card-latex" style="padding: 10px 6px;">
              \\( \\displaystyle P(x)f(x) = P(x) \\sum_{n=0}^{\\infty} a_n(x-a)^n \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              Multiplicar por $P(x)$ no cambia el radio de convergencia $R$.
            </p>
          </div>

          <div class="formula-card">
            <h4>Series fundamentales</h4>
            <div class="formula-card-latex" style="padding: 10px 6px; text-align: left;">
              <div style="font-weight: bold; margin-bottom: 2px;">Serie geométrica:</div>
              \\( \\displaystyle \\frac{1}{1-x} = \\sum_{n=0}^{\\infty} x^n \\)
              <div style="font-size: 0.8rem; color: var(--text-muted); margin: 2px 0 4px 0;">para \\( |x| < 1 \\)</div>
              
              <div style="font-weight: bold; margin-top: 8px; margin-bottom: 2px;">Exponencial:</div>
              \\( \\displaystyle e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} \\)
              <div style="font-size: 0.8rem; color: var(--text-muted); margin: 2px 0 4px 0;">para \\( x \\in \\mathbb{R} \\)</div>

              <div style="font-weight: bold; margin-top: 8px; margin-bottom: 2px;">Logaritmo natural:</div>
              \\( \\displaystyle \\ln(1+x) = \\sum_{n=1}^{\\infty} (-1)^{n+1} \\frac{x^n}{n} \\)
              <div style="font-size: 0.8rem; color: var(--text-muted); margin: 2px 0 4px 0;">para \\( -1 < x \\le 1 \\)</div>

              <div style="font-weight: bold; margin-top: 8px; margin-bottom: 2px;">Seno:</div>
              \\( \\displaystyle \\sin x = \\sum_{n=0}^{\\infty} (-1)^n \\frac{x^{2n+1}}{(2n+1)!} \\)
              <div style="font-size: 0.8rem; color: var(--text-muted); margin: 2px 0 4px 0;">para \\( x \\in \\mathbb{R} \\)</div>

              <div style="font-weight: bold; margin-top: 8px; margin-bottom: 2px;">Coseno:</div>
              \\( \\displaystyle \\cos x = \\sum_{n=0}^{\\infty} (-1)^n \\frac{x^{2n}}{(2n)!} \\)
              <div style="font-size: 0.8rem; color: var(--text-muted); margin: 2px 0 4px 0;">para \\( x \\in \\mathbb{R} \\)</div>
            </div>
          </div>
        `;

        await client.query(`
          INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked, content_motivation, content_theory, content_application, content_exercises, content_formulas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [u1Id, '1.2', 'Operaciones con series de potencias', false, false, capIntPot2Motivation, capIntPot2Theory, capIntPot2Application, capIntPot2Exercises, capIntPot2Formulas]);

      } else if (c.id === 'introduccion-algebra') {
        const u1Res = await client.query(`
          INSERT INTO units (course_id, unit_index, title, is_locked)
          VALUES ($1, $2, $3, $4) RETURNING id
        `, [c.id, 1, 'Fundamentos y Conceptos Básicos', false]);
        const u1Id = u1Res.rows[0].id;

        const u2Res = await client.query(`
          INSERT INTO units (course_id, unit_index, title, is_locked)
          VALUES ($1, $2, $3, $4) RETURNING id
        `, [c.id, 2, 'Aplicaciones y Métodos Avanzados', false]);
        const u2Id = u2Res.rows[0].id;

        const u3Res = await client.query(`
          INSERT INTO units (course_id, unit_index, title, is_locked)
          VALUES ($1, $2, $3, $4) RETURNING id
        `, [c.id, 3, 'Polinomios', false]);
        const u3Id = u3Res.rows[0].id;

        // Cap 1.1
        await client.query(`
          INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked, content_motivation, content_theory, content_application, content_exercises, content_formulas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          u1Id, '1.1', 'Introducción y Definición Primaria', false, false,
          `<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación de ${c.title}</div><p>Este capítulo introduce las bases del ${c.title}.</p></div></div>`,
          `<h3>Bases Teóricas</h3><p>Definiciones fundamentales.</p>`,
          '<h3>Campos de Aplicación</h3><p>Ejemplos reales.</p>',
          JSON.stringify([{ title: "Básico", level: "nivel-1", statement: "Resuelva el problema básico.", solution: "Pauta básica." }]),
          JSON.stringify([{ title: "Fórmula", latex: "y=f(x)", description: "Definición." }])
        ]);

        // Cap 2.1
        await client.query(`
          INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked, content_motivation, content_theory, content_application, content_exercises, content_formulas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          u2Id, '2.1', 'Métodos de Resolución Estándar', false, false,
          '<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación</div><p>Métodos de resolución.</p></div></div>',
          '<h3>Métodos</h3><p>Algoritmos de álgebra.</p>',
          '<h3>Aplicaciones</h3><p>Casos prácticos.</p>',
          JSON.stringify([{ title: "Resolución", level: "nivel-2", statement: "Resuelva la ecuación lineal.", solution: "x = 2." }]),
          JSON.stringify([{ title: "Ecuación", latex: "ax + b = 0", description: "Lineal." }])
        ]);

        // Cap 3.1: Polinomios
        const capPolMotivation = `
          <div class="caja-ram caja-motivacion">
            <div class="caja-ram-icon">💡</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Motivación: Simplificar para Vencer</div>
              <p>
                La división de polinomios puede parecer, a primera vista, un proceso puramente mecánico y abstracto. Sin embargo, es la herramienta matemática que nos permite simplificar expresiones extremadamente complejas y transformarlas en elementos manejables.
              </p>
              <p>
                Así como en la aritmética elemental dividimos números grandes para entender cuántas veces cabe una cantidad en otra o para hallar sus componentes primos, en el álgebra superior dividimos polinomios para reducir el grado de una función y analizar su comportamiento. Dominar este algoritmo te proporcionará la destreza necesaria para simplificar fracciones algebraicas pesadas, resolver integrales por fracciones parciales en cálculo y abrir el camino hacia el descubrimiento de soluciones de ecuaciones de alto grado.
              </p>
            </div>
          </div>
        `;

        const capPolTheory = `
          <h3>1. Estructura Base de un Polinomio</h3>
          <div class="caja-ram caja-definicion">
            <div class="caja-ram-icon">📐</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Definición Formal</div>
              <p>
                Un polinomio de variable $x$ y grado $n$ (donde $n \\in \\mathbb{N}$) es una expresión algebraica formalizada como:
                $$p(x) = a_{0} + a_{1}x + a_{2}x^{2} + \\dots + a_{n}x^{n} = \\sum_{k=0}^{n} a_{k}x^{k}$$
                Donde se exige estrictamente que el coeficiente principal cumpla con $a_{n} \\neq 0$.
              </p>
              <p>
                Dentro de esta estructura identificamos:
                <ul style="margin-left: 20px; margin-top: 8px;">
                  <li><strong>$a_{k}$</strong>: Coeficientes del polinomio.</li>
                  <li><strong>$a_{0}$</strong>: Término libre o independiente.</li>
                  <li><strong>$a_{1}x$</strong>: Término lineal.</li>
                  <li><strong>$a_{n}x^{n}$</strong>: Término líder (y $a_{n}$ es el coeficiente líder).</li>
                  <li><strong>Polinomio Mónico</strong>: Un polinomio es <strong>mónico</strong> si su coeficiente líder es exactamente igual a uno ($a_{n} = 1$).</li>
                </ul>
              </p>
            </div>
          </div>

          <h3>2. Teoremas Fundamentales de la División</h3>
          <div class="caja-ram caja-teorema">
            <div class="caja-ram-icon">🧠</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Teorema de la División (Algoritmo de la División)</div>
              <p>
                Sean $D(x)$ (polinomio dividendo) y $d(x)$ (polinomio divisor), donde $d(x)$ es distinto del polinomio nulo. Entonces, existen <strong>únicos</strong> polinomios $q(x)$ (cociente) y $r(x)$ (resto o residuo) que satisfacen simultáneamente la igualdad:
                $$D(x) = d(x) \\cdot q(x) + r(x)$$
                Donde se cumple rigurosamente que el resto es el polinomio nulo ($r(x) = 0$) o que el grado del resto es estrictamente menor que el grado del divisor ($\\text{gr}(r) < \\text{gr}(d)$).
              </p>
            </div>
          </div>

          <div class="caja-ram caja-teorema">
            <div class="caja-ram-icon">🧠</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Teorema del Resto</div>
              <p>
                Al efectuar la división de un polinomio dividendo $D(x)$ entre un binomio lineal de la forma $(x - c)$, el resto obtenido de forma analítica es una constante igual al valor numérico del polinomio dividendo evaluado en la constante $c$:
                $$\\text{Resto} = D(c)$$
              </p>
            </div>
          </div>

          <div class="caja-ram caja-ejemplo">
            <div class="caja-ram-icon">📝</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Ejemplo: Uso del Teorema del Resto</div>
              <p>
                Supongamos que deseamos encontrar el resto de dividir el polinomio $D(x) = x^3 - 2x^2 + 5$ por el binomio $(x - 2)$ de forma directa.
              </p>
              <p>
                De acuerdo con el teorema, identificamos $c = 2$. Luego, evaluamos $D(2)$:
                $$D(2) = (2)^3 - 2(2)^2 + 5 = 8 - 8 + 5 = 5$$
              </p>
              <p>
                Por lo tanto, sin necesidad de hacer toda la división larga, sabemos que el resto es exactamente $5$.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-pregunta-guia">
            <div class="caja-ram-icon">💡</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Idea Clave / Pregunta Guía</div>
              <p><strong>¿Cómo reduce la división el grado de un problema?</strong></p>
              <p>
                Cada vez que ejecutas una división exacta, estás logrando romper un polinomio de grado alto en partes más pequeñas. La pregunta guía que debes hacerte siempre es: <em>¿Cuáles son las restricciones de grado que me impone el divisor?</em> Si divides por un polinomio cuadrático (grado 2), tu resto como máximo puede ser lineal (grado 1). Mantener el control sobre los grados es lo que garantiza la unicidad del cociente y del resto.
              </p>
            </div>
          </div>

          <h3>3. Métodos Operativos: División Larga Paso a Paso</h3>
          
          <!-- ANIMACIÓN DEL ALGORITMO DE LA DIVISIÓN -->
          <div class="division-player-card" style="margin: 20px 0; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-md);">
            <h4 style="margin: 0 0 16px 0; color: var(--accent-color); display: flex; align-items: center; gap: 8px;">
              🎬 Animación Interactiva: Algoritmo de la División Larga
            </h4>
            
            <div class="player-controls" style="display: flex; gap: 12px; align-items: center; margin-bottom: 20px; flex-wrap: wrap;">
              <button id="div-play-btn" class="opcion-btn" style="width: auto; padding: 8px 16px; margin: 0; display: flex; align-items: center; gap: 6px;">
                <span id="play-icon">▶</span> <span id="play-text">Reproducir</span>
              </button>
              <button id="div-prev-btn" class="opcion-btn" style="width: auto; padding: 8px 16px; margin: 0;">
                ◀ Anterior
              </button>
              <button id="div-next-btn" class="opcion-btn" style="width: auto; padding: 8px 16px; margin: 0;">
                Siguiente ▶
              </button>
              <div style="flex-grow: 1; text-align: right; font-family: var(--font-display); font-weight: 600; color: var(--text-muted); font-size: 0.88rem;">
                <span id="div-step-indicator">Paso 0 de 5</span>
              </div>
            </div>

            <div class="player-progress-bar" style="height: 6px; background: var(--bg-primary); border-radius: 3px; margin-bottom: 20px; overflow: hidden; position: relative;">
              <div id="player-progress-fill" style="height: 100%; width: 0%; background: var(--accent-color); transition: width 0.3s ease;"></div>
            </div>

            <div id="player-explanation-box" style="margin-top: 16px; margin-bottom: 16px; background: var(--accent-bg); border-left: 4px solid var(--accent-color); padding: 14px 16px; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 1.05rem; color: var(--text-secondary); transition: all 0.3s ease;">
              <strong>Paso 0:</strong> El dividendo es $D(x) = 2x^3 - 3x^2 + 4x - 5$ y el divisor es $d(x) = x^2 - x + 1$. Presiona "Siguiente" o "Reproducir" para comenzar.
            </div>

            <div class="division-board" style="font-family: var(--font-code); font-size: 1.05rem; background: var(--bg-primary); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-color); overflow-x: auto; position: relative;">
              <div style="display: inline-block;">
                <div style="display: flex; align-items: flex-start;">
                  <div style="width: 140px; color: var(--text-muted); margin: 0; padding: 2px 0; line-height: 1.2;" id="board-divisor">\\(x^2 - x + 1\\)</div>
                  <div style="border-left: 2px solid var(--text-muted); padding-left: 12px; position: relative;">
                    <div style="height: 30px; font-weight: bold; color: var(--accent-color); margin: 0; padding: 2px 0; line-height: 1.2;" id="board-cociente"></div>
                    <div style="border-top: 2px solid var(--text-muted); width: 260px; margin-top: 2px;"></div>
                    
                    <div style="position: relative; margin-top: 8px; line-height: 1.2;" id="board-body">
                      <div id="term-dividend" style="color: var(--text-primary); margin: 0; padding: 2px 0;">\\(2x^3 - 3x^2 + 4x - 5\\)</div>
                      
                      <div id="term-subtract-1" style="color: var(--error); opacity: 0; transition: opacity 0.5s ease; margin: 0; padding: 2px 0;">\\(-(2x^3 - 2x^2 + 2x)\\)</div>
                      <div id="term-line-1" style="border-top: 1px solid var(--border-color); width: 180px; margin: 4px 0; opacity: 0; transition: opacity 0.5s ease;"></div>
                      
                      <div id="term-residue-1" style="color: var(--text-primary); margin: 0 0 0 55px; padding: 2px 0; opacity: 0; transition: opacity 0.5s ease;">\\(-x^2 + 2x - 5\\)</div>
                      
                      <div id="term-subtract-2" style="color: var(--error); margin: 0 0 0 55px; padding: 2px 0; opacity: 0; transition: opacity 0.5s ease;">\\(-(-x^2 + x - 1)\\)</div>
                      <div id="term-line-2" style="border-top: 1px solid var(--border-color); width: 140px; margin: 4px 0; margin-left: 55px; opacity: 0; transition: opacity 0.5s ease;"></div>
                      
                      <div id="term-remainder" style="color: var(--success); font-weight: bold; margin: 0 0 0 110px; padding: 2px 0; opacity: 0; transition: opacity 0.5s ease;">\\(x - 4\\)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h3>4. Regla de Ruffini (División Sintética)</h3>
          <p>
            Para dividir un polinomio $D(x)$ por un divisor de primer grado $d(x) = x - c$, podemos usar el esquema abreviado:
          </p>
          
          <!-- ANIMACIÓN DE LA REGLA DE RUFFINI -->
          <div class="ruffini-player-card" style="margin: 30px 0; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-md);">
            <h4 style="margin: 0 0 16px 0; color: var(--accent-color); display: flex; align-items: center; gap: 8px;">
              🎬 Animación Interactiva: Regla de Ruffini
            </h4>
            
            <div class="player-controls" style="display: flex; gap: 12px; align-items: center; margin-bottom: 20px; flex-wrap: wrap;">
              <button id="ruf-play-btn" class="opcion-btn" style="width: auto; padding: 8px 16px; margin: 0; display: flex; align-items: center; gap: 6px;">
                <span id="ruf-play-icon">▶</span> <span id="ruf-play-text">Reproducir</span>
              </button>
              <button id="ruf-prev-btn" class="opcion-btn" style="width: auto; padding: 8px 16px; margin: 0;">
                ◀ Anterior
              </button>
              <button id="ruf-next-btn" class="opcion-btn" style="width: auto; padding: 8px 16px; margin: 0;">
                Siguiente ▶
              </button>
              <div style="flex-grow: 1; text-align: right; font-family: var(--font-display); font-weight: 600; color: var(--text-muted); font-size: 0.88rem;">
                <span id="ruf-step-indicator">Paso 0 de 6</span>
              </div>
            </div>

            <div class="player-progress-bar" style="height: 6px; background: var(--bg-primary); border-radius: 3px; margin-bottom: 20px; overflow: hidden; position: relative;">
              <div id="ruf-progress-fill" style="height: 100%; width: 0%; background: var(--accent-color); transition: width 0.3s ease;"></div>
            </div>

            <div id="ruf-explanation-box" style="margin-top: 16px; margin-bottom: 16px; background: var(--accent-bg); border-left: 4px solid var(--accent-color); padding: 14px 16px; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 1.05rem; color: var(--text-secondary); transition: all 0.3s ease;">
              <!-- Explicación -->
            </div>

            <div class="ruffini-board" style="background: var(--bg-primary); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-color); overflow-x: auto; display: flex; justify-content: center; align-items: center; min-height: 160px;">
              <div id="ruffini-latex-container" style="font-size: 1.05rem; color: var(--text-primary); transition: all 0.3s ease;">
                <!-- Se inyectará dinámicamente -->
              </div>
            </div>
          </div>

          <div class="caja-ram error-comun">
            <div class="caja-ram-icon">🚨</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Error Común / Advertencia</div>
              <p>
                El error más catastrófico al utilizar la Regla de Ruffini o la división larga es olvidar ordenar el polinomio dividendo e introducir el coeficiente cero ($0$) en todas las potencias ausentes de la variable $x$. Omitir estos ceros colapsará por completo las columnas del algoritmo y arruinará el cálculo.
              </p>
            </div>
          </div>
        `;

        const capPolApplication = `
          <h3>Evaluación Formativa Rápida</h3>
          <p>
            Comprueba tu comprensión respondiendo las siguientes preguntas interactivas:
          </p>

          <div class="evaluacion-formativa" data-eval-id="eval-vf-div-1" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>🤔 Enunciado 1</span>
              <div>Al dividir un polinomio de grado 5 por un polinomio de grado 2, el grado máximo que puede llegar a tener el resto es 2.</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Por el Teorema de la División, el grado del resto r(x) debe ser estrictamente menor que el grado del divisor d(x). Como el divisor tiene grado 2, el grado del resto como máximo puede ser 1 (lineal).">
                A) Verdadero
              </button>
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Es falso. Si el divisor es de grado 2, el resto debe tener un grado estrictamente menor, es decir, a lo más grado 1.">
                B) Falso
              </button>
            </div>
            <div class="feedback-contenedor hidden">
              <div class="feedback-icon"></div>
              <div class="feedback-texto"></div>
            </div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-vf-div-2" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>🤔 Enunciado 2</span>
              <div>Si la evaluación numérica de un polinomio resulta en $p(-3) = 7$, significa que al dividir $p(x)$ por $(x + 3)$ el residuo de la operación será exactamente 7.</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Por el Teorema del Resto, al dividir p(x) por un binomio lineal (x - c), el resto es p(c). Para el divisor (x + 3), c = -3, por lo que el resto es efectivamente p(-3) = 7.">
                A) Verdadero
              </button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. El Teorema del Resto nos dice que dividir por (x - c) da un resto de p(c). En este caso, dividir por (x + 3) es equivalente a evaluar en c = -3, por lo tanto el resto es efectivamente 7.">
                B) Falso
              </button>
            </div>
            <div class="feedback-contenedor hidden">
              <div class="feedback-icon"></div>
              <div class="feedback-texto"></div>
            </div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-sm-div-1" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>✏️ Completar la ley de grados</span>
              <div>Según el Teorema de la División, el algoritmo se detiene si y solo si el resto es igual al polinomio nulo o si el grado del resto es estrictamente _________ que el grado del divisor.</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! El resto r(x) debe cumplir que gr(r) &lt; gr(d).">
                A) menor
              </button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Si es mayor o igual, la división puede continuar.">
                B) mayor
              </button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. El grado debe ser estrictamente menor.">
                C) igual
              </button>
            </div>
            <div class="feedback-contenedor hidden">
              <div class="feedback-icon"></div>
              <div class="feedback-texto"></div>
            </div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-sm-div-2" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>✏️ Completar Ruffini</span>
              <div>Si un polinomio dividendo no contiene el término cuadrático ($x^2$), al plantear la Regla de Ruffini se debe rellenar dicha posición vacía utilizando el coeficiente _________.</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. El número 1 alteraría el valor algebraico de la expresión.">
                A) uno (1)
              </button>
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Para conservar el valor matemático y alinear las columnas del algoritmo, cualquier término ausente se rellena con coeficiente 0.">
                B) cero (0)
              </button>
            </div>
            <div class="feedback-contenedor hidden">
              <div class="feedback-icon"></div>
              <div class="feedback-texto"></div>
            </div>
          </div>
        `;

        const capPolExercises = JSON.stringify([
          {
            "title": "Demostración de Divisibilidad (Resuelto)",
            "level": "resuelto",
            "statement": "Demostrar de forma analítica que el polinomio $p(x) = 32x^{10} - 33x^{5} + 1$ es divisible de manera exacta por el binomio $(x - 1)$.",
            "solution": "<strong>Solución paso a paso:</strong><p>Por definición, $p(x)$ es divisible de forma exacta por $(x - 1)$ si el residuo de la división es cero. Aplicando el Teorema del Resto, el residuo es el valor numérico del polinomio evaluado en $c = 1$, es decir, $p(1)$:</p>$$p(1) = 32(1)^{10} - 33(1)^{5} + 1$$$$p(1) = 32(1) - 33(1) + 1 = 32 - 33 + 1 = 0$$<p>Dado que el resto $p(1) = 0$, el residuo es exactamente cero y queda rigurosamente demostrado que $p(x)$ es divisible de manera exacta por $(x - 1)$.</p>"
          },
          {
            "title": "Determinación de Coeficientes (Resuelto)",
            "level": "resuelto",
            "statement": "Encuentre los valores de $a$ y $b$ de modo tal que el resto de la división de $p(x) = ax^{4} + bx^{3} + 6x^{2} - 12x + 4$ por $d(x) = x^{2} - 1$ sea el binomio $2x + 1$.",
            "solution": "<strong>Solución paso a paso:</strong><ol><li>Por el Teorema de la División: $p(x) = (x^2 - 1)q(x) + (2x + 1)$.</li><li>Factorizamos el divisor de segundo grado: $x^2 - 1 = (x - 1)(x + 1)$. Sus raíces son $x = 1$ y $x = -1$.</li><li>Evaluamos en $x = 1$: $p(1) = (1 - 1)q(1) + 2(1) + 1 = 3$.<br>Sustituyendo en la expresión del polinomio:<br>$$a(1)^4 + b(1)^3 + 6(1)^2 - 12(1) + 4 = 3 \\implies a + b + 6 - 12 + 4 = 3 \\implies a + b = 5 \\quad \\text{(Eq. 1)}$$</li><li>Evaluamos en $x = -1$: $p(-1) = (-1 - 1)q(-1) + 2(-1) + 1 = -1$.<br>Sustituyendo en la expresión del polinomio:<br>$$a(-1)^4 + b(-1)^3 + 6(-1)^2 - 12(-1) + 4 = -1 \\implies a - b + 6 + 12 + 4 = -1 \\implies a - b = -23 \\quad \\text{(Eq. 2)}$$</li><li>Sumamos Eq. 1 y Eq. 2:<br>$$(a+b) + (a-b) = 5 - 23 \\implies 2a = -18 \\implies a = -9$$</li><li>Reemplazamos en Eq. 1:<br>$$-9 + b = 5 \\implies b = 14$$</li></ol><p><strong>Resultado final:</strong> Los coeficientes buscados son $a = -9$ y $b = 14$.</p>"
          },
          {
            "title": "División Larga de Polinomios",
            "level": "nivel-1",
            "statement": "Obtenga el cociente $q(x)$ y el resto $r(x)$ de la división del polinomio $D(x) = 3x^{4} - 2x^{3} + 4x - 7$ por el binomio $d(x) = x + 3$ utilizando división larga.",
            "solution": "<strong>Pauta de control:</strong><p>Alinea los términos colocando coeficiente 0 en el término cuadrático ($0x^2$). Realiza la división término a término:</p><p><strong>Resultado:</strong> Cociente $q(x) = 3x^3 - 11x^2 + 33x - 95$ y Resto constante $r(x) = 278$.</p>"
          },
          {
            "title": "Parámetro Divisional",
            "level": "nivel-2",
            "statement": "Determine el valor de la constante $k$ para que el polinomio $p(x) = 2x^{3} - 3x^{2} + kx - 4$ genere un resto de valor $10$ al ser dividido por el binomio $(x - 2)$.",
            "solution": "<strong>Pauta de control:</strong><p>Aplicando el Teorema del Resto, sabemos que dividir por $(x-2)$ da un resto de $p(2)$. Por lo tanto, exigimos que $p(2) = 10$:</p>$$p(2) = 2(2)^3 - 3(2)^2 + k(2) - 4 = 10$$$$2(8) - 3(4) + 2k - 4 = 10$$$$16 - 12 + 2k - 4 = 10 \\implies 2k = 10 \\implies k = 5$$<p><strong>Resultado:</strong> La constante es $k = 5$.</p>"
          }
        ]);

        const capPolFormulas = JSON.stringify([
          {
            "title": "Estructura Base de un Polinomio",
            "latex": "p(x) = \\sum_{k=0}^{n} a_k x^k",
            "description": "Forma formal de un polinomio de grado n con a_n \\neq 0."
          },
          {
            "title": "Teorema de la División",
            "latex": "D(x) = d(x)q(x) + r(x)",
            "description": "Igualdad fundamental donde gr(r) < gr(d) o r(x) = 0."
          },
          {
            "title": "Teorema del Resto",
            "latex": "\\text{Resto} = D(c)",
            "description": "El resto de dividir D(x) por (x - c) equivale a evaluar D(c)."
          }
        ]);

        await client.query(`
          INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked, content_motivation, content_theory, content_application, content_exercises, content_formulas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [u3Id, '3.1', 'Algoritmo de la división', false, false, capPolMotivation, capPolTheory, capPolApplication, capPolExercises, capPolFormulas]);

      } else if (c.id === 'introduccion-calculo') {
        const u1Res = await client.query(`
          INSERT INTO units (course_id, unit_index, title, is_locked)
          VALUES ($1, $2, $3, $4) RETURNING id
        `, [c.id, 1, 'Fundamentos y Conceptos Básicos', false]);
        const u1Id = u1Res.rows[0].id;

        const u2Res = await client.query(`
          INSERT INTO units (course_id, unit_index, title, is_locked)
          VALUES ($1, $2, $3, $4) RETURNING id
        `, [c.id, 2, 'Aplicaciones y Métodos Avanzados', false]);
        const u2Id = u2Res.rows[0].id;

        const u3Res = await client.query(`
          INSERT INTO units (course_id, unit_index, title, is_locked)
          VALUES ($1, $2, $3, $4) RETURNING id
        `, [c.id, 3, 'Sucesiones', false]);
        const u3Id = u3Res.rows[0].id;

        // Capítulos de Unidad 1
        await client.query(`
          INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked, content_motivation, content_theory, content_application, content_exercises, content_formulas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          u1Id, '1.1', 'Introducción y Definición Primaria', false, false,
          `<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación de ${c.title}</div><p>Este capítulo introduce las bases conceptuales indispensables para comprender la asignatura de ${c.title}.</p></div></div>`,
          `<h3>Bases Teóricas de ${c.title}</h3><p>Definiciones fundamentales y terminología general del área.</p>`,
          '<h3>Campos de Aplicación</h3><p>Ejemplos reales en física, ingeniería o ciencias sociales.</p>',
          JSON.stringify([{ title: "Ejercicio de Introducción", level: "nivel-1", statement: "Resuelva el problema básico del área.", solution: "Procedimiento y resultado final." }]),
          JSON.stringify([{ title: "Fórmula de Entrada", latex: "y = f(x)", description: "Representación estándar de una función real." }])
        ]);

        // Capítulos de Unidad 2
        await client.query(`
          INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked, content_motivation, content_theory, content_application, content_exercises, content_formulas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          u2Id, '2.1', 'Introducción y Definición Primaria', false, false,
          `<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación de ${c.title}</div><p>Este capítulo introduce las bases conceptuales indispensables para comprender la asignatura de ${c.title}.</p></div></div>`,
          `<h3>Bases Teóricas de ${c.title}</h3><p>Definiciones fundamentales y terminología general del área.</p>`,
          '<h3>Campos de Aplicación</h3><p>Ejemplos reales en física, ingeniería o ciencias sociales.</p>',
          JSON.stringify([{ title: "Ejercicio de Introducción", level: "nivel-1", statement: "Resuelva el problema básico del área.", solution: "Procedimiento y resultado final." }]),
          JSON.stringify([{ title: "Fórmula de Entrada", latex: "y = f(x)", description: "Representación estándar de una función real." }])
        ]);

        // Capítulo 3.1: Sucesiones - Nivel 1
        const capSuc1Motivation = `
          <section id="motivacion">
            <div class="caja-ram caja-motivacion">
              <div class="caja-ram-icon">💡</div>
              <div class="caja-ram-body">
                <div class="caja-ram-title">Motivación: La discreción del infinito</div>
                <p>
                  En el cálculo continuo, las funciones como $f(x) = \\frac{1}{x}$ nos permiten evaluar cualquier número real $x$ (como $x = 1.5$ o $x = \\pi$). Sin embargo, en el mundo real y en la computación, los procesos ocurren paso a paso, de manera discreta.
                </p>
                <p>
                  Las <strong>sucesiones numéricas</strong> representan este enfoque discreto. Al evaluar una función únicamente en los números naturales ($n = 1, 2, 3, \\dots$), entrenamos nuestra mente para observar tendencias y comportamientos a largo plazo. Aprender a <em>ver</em> hacia dónde se dirigen estos infinitos puntos es el primer paso antes de formalizar el análisis matemático.
                </p>
              </div>
            </div>

            <div class="caja-ram caja-pregunta-guia">
              <div class="caja-ram-icon">💡</div>
              <div class="caja-ram-body">
                <div class="caja-ram-title">Pregunta guía</div>
                <p style="font-style: italic; font-weight: 500;">
                  Si una sucesión de puntos parece acercarse a un valor específico al graficarla, ¿es suficiente esta observación para asegurar que se mantendrá allí por el resto de la eternidad?
                </p>
              </div>
            </div>
          </section>
        `;

        const capSuc1Theory = `
          <section id="teoria-matematica">
            <h2>Definición y Clasificación Visual</h2>

            <div class="caja-ram caja-teoria">
              <div class="caja-ram-icon">📐</div>
              <div class="caja-ram-body">
                <div class="caja-ram-title">Definición: Sucesión Real</div>
                <p>
                  Una <strong>sucesión real</strong> es una función cuyo dominio es el conjunto de los números naturales $\\mathbb{N}$ (es decir, $1, 2, 3, \\dots$) y su codominio es el conjunto de los números reales $\\mathbb{R}$.
                </p>
                <p style="text-align: center; margin: 1.5rem 0;">
                  $$\\displaystyle f: \\mathbb{N} \\to \\mathbb{R}$$
                </p>
                <p>
                  Para denotar el valor de la función en un número natural $n$, en lugar de escribir la notación clásica de funciones $f(n)$, utilizamos subíndices: <strong>$a_n$</strong>. A esta fórmula se le conoce como el <strong>término general</strong> de la sucesión.
                </p>
              </div>
            </div>

            <h3 class="section-title" style="margin-top: 2rem;">Clasificación de Comportamientos Intuitivos</h3>
            <p>
              Cuando analizamos el límite de $a_n$ cuando $n \\to \\infty$, la sucesión se clasifica en una de las siguientes tres familias:
            </p>

            <div class="caja-ram caja-teorema" style="margin-top: 1rem;">
              <div class="caja-ram-icon">🟢</div>
              <div class="caja-ram-body">
                <div class="caja-ram-title">1. Sucesiones Convergentes</div>
                <p>
                  Son aquellas cuyos términos se van <strong>estabilizando</strong> y aproximando cada vez más a un único valor real finito $L$ a medida que $n$ crece.
                </p>
                <p style="font-style: italic; color: var(--text-muted);">
                  Ejemplo: $a_n = \\frac{1}{n}$. A medida que $n$ toma valores grandes ($10, 100, 1000$), los términos se aproximan a $0$.
                </p>
              </div>
            </div>

            <div class="caja-ram caja-alerta" style="margin-top: 1rem;">
              <div class="caja-ram-icon">🟡</div>
              <div class="caja-ram-body">
                <div class="caja-ram-title">2. Sucesiones Divergentes</div>
                <p>
                  Son aquellas cuyos términos <strong>escapan</strong> sin cota alguna. Los valores crecen o decrecen infinitamente hacia $+\\infty$ o $-\\infty$.
                </p>
                <p style="font-style: italic; color: var(--text-muted);">
                  Ejemplo: $a_n = n^2$. Los términos crecen sin límite: $1, 4, 9, 16, 25, \\dots$
                </p>
              </div>
            </div>

            <div class="caja-ram caja-ejemplo" style="margin-top: 1rem;">
              <div class="caja-ram-icon">🔴</div>
              <div class="caja-ram-body">
                <div class="caja-ram-title">3. Sucesiones Oscilantes</div>
                <p>
                  Son aquellas cuyos términos <strong>rebotan</strong> o fluctúan indefinidamente sin estabilizarse en un único valor, pero tampoco escapan al infinito.
                </p>
                <p style="font-style: italic; color: var(--text-muted);">
                  Ejemplo: $a_n = (-1)^n$. Los términos rebotan alternadamente entre $-1$ y $1$: $-1, 1, -1, 1, -1, \\dots$
                </p>
              </div>
            </div>

            <div class="caja-ram caja-procedamiento" style="margin-top: 2rem;">
              <div class="caja-ram-icon">⚠️</div>
              <div class="caja-ram-body">
                <div class="caja-ram-title">Nota pedagógica importante</div>
                <p>
                  Estas definiciones de "estabilizarse", "escapar" y "rebotar" son conceptuales y de carácter netamente <strong>visual e intuitivo</strong> para construir una base sólida. En el siguiente capítulo (Nivel 2), abordaremos la definición matemática estricta ($\\epsilon-N$) para demostrar formalmente estas tendencias.
                </p>
              </div>
            </div>
          </section>
        `;

        const capSuc1Application = `
          <section id="aplicacion-y-practica">
            <h2>Laboratorio de Visualización y Reto de Clasificación</h2>
            <p>
              Utiliza el visualizador interactivo a continuación para observar la tendencia de distintas sucesiones $a_n$ cuando aumentamos la cantidad de términos visibles $N$ y ajustamos la banda de tolerancia $\\varepsilon$.
            </p>

            <div class="interactive-plotter" style="margin-top: 20px;">
              <div class="plotter-title" style="font-family: var(--font-display); font-weight: 700; font-size: 1.15rem; color: var(--accent-color); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                <span>📊</span> Visualizador de Convergencia
              </div>
              
              <div class="plotter-controls" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 16px; background: var(--bg-primary); border-radius: 8px; margin-bottom: 16px;">
                <div class="control-group" style="display: flex; flex-direction: column; gap: 6px;">
                  <label class="control-label" style="font-weight: 600; font-size: 0.9rem;">Sucesión $a_n$</label>
                  
                  <div class="custom-select-wrapper" style="position: relative; cursor: pointer; user-select: none;">
                    <div class="custom-select-trigger" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; font-family: var(--font-display); font-weight: 600;">
                      <span class="custom-select-value">$a_n = \\frac{1}{n}$</span>
                      <span style="font-size: 0.8rem; color: var(--text-muted);">▼</span>
                    </div>
                    <div class="custom-options-container" style="display: none; position: absolute; top: 100%; left: 0; right: 0; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; z-index: 10; box-shadow: var(--shadow-md); margin-top: 4px;">
                      <div class="custom-option selected" data-value="1/n" style="padding: 8px 12px; border-bottom: 1px solid var(--border-color); font-weight: 600;">$a_n = \\frac{1}{n}$</div>
                      <div class="custom-option" data-value="n/n+1" style="padding: 8px 12px; border-bottom: 1px solid var(--border-color); font-weight: 600;">$a_n = \\frac{n}{n+1}$</div>
                      <div class="custom-option" data-value="alt" style="padding: 8px 12px; border-bottom: 1px solid var(--border-color); font-weight: 600;">$a_n = \\frac{(-1)^n}{n}$</div>
                      <div class="custom-option" data-value="osc" style="padding: 8px 12px; border-bottom: 1px solid var(--border-color); font-weight: 600;">$a_n = (-1)^n$</div>
                      <div class="custom-option" data-value="div" style="padding: 8px 12px; font-weight: 600;">$a_n = \\frac{n}{15}$</div>
                    </div>
                  </div>

                  <select id="plotter-preset" class="control-select" style="display: none;">
                    <option value="1/n">1/n</option>
                    <option value="n/n+1">n/n+1</option>
                    <option value="alt">alt</option>
                    <option value="osc">osc</option>
                    <option value="div">div</option>
                  </select>
                </div>

                <div class="control-group" style="display: flex; flex-direction: column; gap: 6px;">
                  <label class="control-label" for="plotter-eps" style="font-weight: 600; font-size: 0.9rem;">Banda de tolerancia ($\\varepsilon$)</label>
                  <div class="slider-container" style="display: flex; align-items: center; gap: 10px;">
                    <input type="range" id="plotter-eps" min="0.05" max="0.50" step="0.01" value="0.20" style="flex: 1; accent-color: var(--accent-color);">
                    <span id="eps-val" class="slider-val" style="font-weight: 700; min-width: 35px;">0.20</span>
                  </div>
                </div>
              </div>

              <div class="plotter-controls" style="margin-bottom: 16px; padding: 0 16px;">
                <div class="control-group" style="display: flex; flex-direction: column; gap: 6px;">
                  <label class="control-label" for="plotter-n" style="font-weight: 600; font-size: 0.9rem;">Términos visibles ($N$)</label>
                  <div class="slider-container" style="display: flex; align-items: center; gap: 10px;">
                    <input type="range" id="plotter-n" min="10" max="40" step="1" value="25" style="flex: 1; accent-color: var(--accent-color);">
                    <span id="n-val" class="slider-val" style="font-weight: 700; min-width: 35px;">25</span>
                  </div>
                </div>
              </div>
              
              <div class="plotter-svg-wrapper" style="width: 100%; height: 200px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; position: relative; margin-bottom: 16px;">
                <svg class="plotter-svg" id="plotter-svg" style="width: 100%; height: 100%;">
                  <g id="plot-grid"></g>
                  <rect id="eps-rect" fill="rgba(6, 182, 212, 0.12)"></rect>
                  <line id="eps-upper-line" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="3,3"></line>
                  <line id="eps-lower-line" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="3,3"></line>
                  <line id="limit-line" stroke="#10b981" stroke-width="1.5"></line>
                  <g id="plot-dots"></g>
                </svg>
              </div>
              
              <div class="plotter-readout" id="plotter-readout" style="padding: 12px; background: var(--bg-primary); border-radius: 8px; font-weight: 500; text-align: center; font-size: 0.95rem; margin-bottom: 24px; border: 1px solid var(--border-color);">
                Cargando visualizador matemático...
              </div>

              <!-- Reto de Clasificación -->
              <div class="challenge-box" style="border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; background: var(--bg-card); margin-top: 24px;">
                <div class="challenge-title" style="font-family: var(--font-display); font-weight: 700; font-size: 1.15rem; color: var(--accent-color); margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                  <span>🏆</span> Reto de Clasificación
                </div>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 16px;">
                  Usa el visualizador de arriba para seleccionar cada una de las sucesiones y clasifícalas según su comportamiento cuando $n \\to \\infty$.
                </p>

                <div class="challenge-list" style="display: flex; flex-direction: column; gap: 16px;">
                  <!-- Item 1: 1/n -->
                  <div class="challenge-item" data-seq="1/n" data-answer="conv" style="display: flex; flex-direction: column; gap: 10px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                      <div style="font-weight: 700; font-size: 1.1rem; min-width: 100px;">$a_n = \\frac{1}{n}$</div>
                      <div class="challenge-buttons" style="display: flex; gap: 8px;">
                        <button type="button" class="btn-choice option-btn" data-val="conv" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); cursor: pointer; font-size: 0.85rem; font-weight: 600;">Convergente</button>
                        <button type="button" class="btn-choice option-btn" data-val="div" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); cursor: pointer; font-size: 0.85rem; font-weight: 600;">Divergente</button>
                        <button type="button" class="btn-choice option-btn" data-val="osc" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); cursor: pointer; font-size: 0.85rem; font-weight: 600;">Oscilante</button>
                      </div>
                    </div>
                    <div class="challenge-feedback" style="font-size: 0.85rem; font-weight: 500; display: none;"></div>
                  </div>

                  <!-- Item 2: n/n+1 -->
                  <div class="challenge-item" data-seq="n/n+1" data-answer="conv" style="display: none; flex-direction: column; gap: 10px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                      <div style="font-weight: 700; font-size: 1.1rem; min-width: 100px;">$a_n = \\frac{n}{n+1}$</div>
                      <div class="challenge-buttons" style="display: flex; gap: 8px;">
                        <button type="button" class="btn-choice option-btn" data-val="conv" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); cursor: pointer; font-size: 0.85rem; font-weight: 600;">Convergente</button>
                        <button type="button" class="btn-choice option-btn" data-val="div" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); cursor: pointer; font-size: 0.85rem; font-weight: 600;">Divergente</button>
                        <button type="button" class="btn-choice option-btn" data-val="osc" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); cursor: pointer; font-size: 0.85rem; font-weight: 600;">Oscilante</button>
                      </div>
                    </div>
                    <div class="challenge-feedback" style="font-size: 0.85rem; font-weight: 500; display: none;"></div>
                  </div>

                  <!-- Item 3: (-1)^n/n -->
                  <div class="challenge-item" data-seq="alt" data-answer="conv" style="display: none; flex-direction: column; gap: 10px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                      <div style="font-weight: 700; font-size: 1.1rem; min-width: 100px;">$a_n = \\frac{(-1)^n}{n}$</div>
                      <div class="challenge-buttons" style="display: flex; gap: 8px;">
                        <button type="button" class="btn-choice option-btn" data-val="conv" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); cursor: pointer; font-size: 0.85rem; font-weight: 600;">Convergente</button>
                        <button type="button" class="btn-choice option-btn" data-val="div" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); cursor: pointer; font-size: 0.85rem; font-weight: 600;">Divergente</button>
                        <button type="button" class="btn-choice option-btn" data-val="osc" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); cursor: pointer; font-size: 0.85rem; font-weight: 600;">Oscilante</button>
                      </div>
                    </div>
                    <div class="challenge-feedback" style="font-size: 0.85rem; font-weight: 500; display: none;"></div>
                  </div>

                  <!-- Item 4: (-1)^n -->
                  <div class="challenge-item" data-seq="osc" data-answer="osc" style="display: none; flex-direction: column; gap: 10px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                      <div style="font-weight: 700; font-size: 1.1rem; min-width: 100px;">$a_n = (-1)^n$</div>
                      <div class="challenge-buttons" style="display: flex; gap: 8px;">
                        <button type="button" class="btn-choice option-btn" data-val="conv" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); cursor: pointer; font-size: 0.85rem; font-weight: 600;">Convergente</button>
                        <button type="button" class="btn-choice option-btn" data-val="div" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); cursor: pointer; font-size: 0.85rem; font-weight: 600;">Divergente</button>
                        <button type="button" class="btn-choice option-btn" data-val="osc" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); cursor: pointer; font-size: 0.85rem; font-weight: 600;">Oscilante</button>
                      </div>
                    </div>
                    <div class="challenge-feedback" style="font-size: 0.85rem; font-weight: 500; display: none;"></div>
                  </div>

                  <!-- Item 5: n/15 -->
                  <div class="challenge-item" data-seq="div" data-answer="div" style="display: none; flex-direction: column; gap: 10px; padding-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                      <div style="font-weight: 700; font-size: 1.1rem; min-width: 100px;">$a_n = \\frac{n}{15}$</div>
                      <div class="challenge-buttons" style="display: flex; gap: 8px;">
                        <button type="button" class="btn-choice option-btn" data-val="conv" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); cursor: pointer; font-size: 0.85rem; font-weight: 600;">Convergente</button>
                        <button type="button" class="btn-choice option-btn" data-val="div" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); cursor: pointer; font-size: 0.85rem; font-weight: 600;">Divergente</button>
                        <button type="button" class="btn-choice option-btn" data-val="osc" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); cursor: pointer; font-size: 0.85rem; font-weight: 600;">Oscilante</button>
                      </div>
                    </div>
                    <div class="challenge-feedback" style="font-size: 0.85rem; font-weight: 500; display: none;"></div>
                  </div>
                </div>

                <div style="margin-top: 20px; text-align: right;">
                  <button type="button" id="btn-verify-challenge" style="padding: 10px 20px; border-radius: 8px; border: none; background: var(--accent-color); color: white; font-weight: 700; cursor: pointer; font-family: var(--font-display);">Verificar respuestas</button>
                </div>
              </div>
            </div>
          </section>
        `;

        const capSuc1Exercises = JSON.stringify([
          {
            title: "Cálculo de términos y tendencia intuitiva",
            level: "nivel-1",
            statement: "Dada la sucesión $a_n = \\frac{2n-1}{n+2}$, calcule sus primeros 5 términos, descríbalos gráficamente de forma cualitativa, y deduzca intuitivamente si converge, diverge u oscila.",
            solution: "1. <strong>Cálculo de términos:</strong> Evaluando en $n=1, 2, 3, 4, 5$:<br>· $a_1 = \\frac{2(1)-1}{1+2} = \\frac{1}{3} \\approx 0.333$<br>· $a_2 = \\frac{2(2)-1}{2+2} = \\frac{3}{4} = 0.75$<br>· $a_3 = \\frac{2(3)-1}{3+2} = \\frac{5}{5} = 1.0$<br>· $a_4 = \\frac{2(4)-1}{4+2} = \\frac{7}{6} \\approx 1.167$<br>· $a_5 = \\frac{2(5)-1}{5+2} = \\frac{9}{7} \\approx 1.286$<br><br>2. <strong>Análisis cualitativo:</strong> Los términos son positivos y van creciendo paso a paso: $0.333 \\to 0.75 \\to 1.0 \\to 1.167 \\to 1.286$.<br>Sin embargo, observemos qué pasa para un natural muy grande, por ejemplo $n = 1000$:<br>$a_{1000} = \\frac{2000-1}{1000+2} = \\frac{1999}{1002} \\approx 1.995$.<br><br>3. <strong>Conclusión intuitiva:</strong> A medida que $n \\to \\infty$, la sucesión se estabiliza aproximándose cada vez más a $2$. Por lo tanto, la sucesión es <strong>convergente</strong> y su límite intuitivo es $2$."
          },
          {
            title: "Encontrar el término general",
            level: "nivel-1",
            statement: "Determine la fórmula del término general $a_n$ (con $n \\ge 1$) para la siguiente sucesión de números:<br>$$\\frac{1}{2}, -\\frac{2}{3}, \\frac{3}{4}, -\\frac{4}{5}, \\frac{5}{6}, \\dots$$",
            solution: "1. <strong>Análisis del signo:</strong> Los signos se alternan: positivo, negativo, positivo, negativo...<br>· Para $n=1$: positivo (+)<br>· Para $n=2$: negativo (-)<br>· Para $n=3$: positivo (+)<br>Para lograr esto, multiplicamos por $(-1)^{n+1}$ (o $(-1)^{n-1}$). Evaluando:<br>$n=1 \\implies (-1)^2 = 1$; $n=2 \\implies (-1)^3 = -1$. Funciona.<br><br>2. <strong>Análisis de los valores (Numerador y Denominador):</strong><br>· Numerador: $1, 2, 3, 4, 5, \\dots \\implies$ corresponde exactamente a $n$.<br>· Denominador: $2, 3, 4, 5, 6, \\dots \\implies$ es un número mayor que el numerador, por lo tanto corresponde a $n+1$.<br><br>3. <strong>Fórmula final:</strong> Uniendo ambas partes, obtenemos el término general:<br>$$a_n = (-1)^{n+1} \\frac{n}{n+1}$$"
          },
          {
            title: "Clasificación de sucesiones racionales",
            level: "nivel-1",
            statement: "Determine si la sucesión de término general $a_n = \\frac{3n^2 + 1}{n}$ es convergente, divergente u oscilante a partir del análisis del comportamiento de sus términos.",
            solution: "1. <strong>Cálculo de términos iniciales:</strong><br>· $a_1 = \\frac{3(1)^2+1}{1} = 4$<br>· $a_2 = \\frac{3(4)+1}{2} = 6.5$<br>· $a_3 = \\frac{27+1}{3} \\approx 9.33$<br>· $a_4 = \\frac{48+1}{4} = 12.25$<br><br>2. <strong>Simplificación algebraica:</strong> Reescribiendo el término general:<br>$$a_n = \\frac{3n^2}{n} + \\frac{1}{n} = 3n + \\frac{1}{n}$$<br>· Cuando $n \\to \\infty$, el término $3n$ crece indefinidamente hacia $+\\infty$.<br>· El término $\\frac{1}{n}$ se acerca a $0$.<br>· Sumando ambos comportamientos, toda la expresión crece sin límite hacia $+\\infty$.<br><br>3. <strong>Conclusión:</strong> La sucesión es <strong>divergente</strong>."
          }
        ]);

        const capSuc1Formulas = JSON.stringify([
          {
            title: "Definición y Notación",
            latex: "a_n = f(n) \\quad \\text{con } f: \\mathbb{N} \\to \\mathbb{R}",
            description: "Una sucesión asocia a cada número natural n un valor real."
          },
          {
            title: "Término de alternancia de signos",
            latex: "(-1)^n \\text{ o } (-1)^{n+1}",
            description: "(-1)^n genera signos comenzando con negativo (-1, 1, -1, 1). (-1)^{n+1} comienza con positivo (1, -1, 1, -1)."
          },
          {
            title: "Patrones numéricos comunes",
            latex: "\\begin{array}{ll} \\text{Pares:} & 2n \\\\ \\text{Impares:} & 2n - 1 \\\\ \\text{Múltiplos de } c: & c \\cdot n \\end{array}",
            description: "Fórmulas elementales para representar secuencias ordenadas de enteros."
          },
          {
            title: "Definición de Factorial",
            latex: "n! = n \\cdot (n - 1) \\cdot (n - 2) \\cdots 2 \\cdot 1 \\quad (0! = 1)",
            description: "El producto de los enteros positivos desde 1 hasta n."
          }
        ]);

        // Push Capítulo 3.1
        await client.query(`
          INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked, content_motivation, content_theory, content_application, content_exercises, content_formulas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [u3Id, '3.1', 'Domina la intuición visual', false, false, capSuc1Motivation, capSuc1Theory, capSuc1Application, capSuc1Exercises, capSuc1Formulas]);

        // Capítulo 3.2: Sucesiones - Nivel 2
        const capSuc2Motivation = `
          <section id="motivacion">
            <div class="caja-ram caja-motivacion">
              <div class="caja-ram-icon">💡</div>
              <div class="caja-ram-body">
                <div class="caja-ram-title">Motivación: El juego del infinito</div>
                <p>
                  Ya aprendimos a observar visualmente hacia dónde se dirigen los términos de una sucesión. Pero en matemática superior, los ojos nos pueden engañar. Necesitamos un método riguroso que certifique el comportamiento a largo plazo sin depender de un gráfico.
                </p>
                <p>
                  Imagina que jugamos a un juego. Tú me exiges un margen de error $\\varepsilon$, tan pequeño como quieras (por ejemplo, $\\varepsilon = 0.001$). Yo gano si encuentro un instante en el tiempo (un paso $N$) a partir del cual todos los términos siguientes se quedan atrapados dentro de ese margen de error alrededor de un límite $L$. Si yo puedo ganar este juego siempre, sin importar cuán microscópico sea el margen $\\varepsilon$ que elijas, entonces la sucesión converge a $L$.
                </p>
              </div>
            </div>

            <div class="caja-ram caja-pregunta-guia">
              <div class="caja-ram-icon">💡</div>
              <div class="caja-ram-body">
                <div class="caja-ram-title">Pregunta guía</div>
                <p style="font-style: italic; font-weight: 500;">
                  Si una sucesión de puntos fluctúa infinitamente cerca de un valor, pero rebota sin cesar, ¿podemos decir con seguridad matemática que posee un límite?
                </p>
              </div>
            </div>
          </section>
        `;

        const capSuc2Theory = `
          <section id="teoria-matematica">
            <h2>Definición Rigurosa y Propiedades</h2>

            <div class="caja-ram caja-teoria">
              <div class="caja-ram-icon">📐</div>
              <div class="caja-ram-body">
                <div class="caja-ram-title">Definición: Límite Formal ($\\varepsilon - N$)</div>
                <p>
                  Decimos que el límite de una sucesión $a_n$ cuando $n \\to \\infty$ es $L$ si y solo si para todo margen de error $\\varepsilon > 0$, existe un número natural $N \\in \\mathbb{N}$ tal que para cualquier término posterior $n \\ge N$, la distancia entre $a_n$ y $L$ es menor que $\\varepsilon$:
                </p>
                <p style="text-align: center; margin: 1.5rem 0;">
                  $$\\displaystyle \\lim_{n \\to \\infty} a_n = L \\iff \\forall \\varepsilon > 0, \\exists N \\in \\mathbb{N} \\text{ tal que } \\forall n \\ge N, |a_n - L| < \\varepsilon$$
                </p>
              </div>
            </div>

            <h3 class="section-title" style="margin-top: 2rem;">La Propiedad Arquimediana</h3>
            <p>
              Para garantizar que siempre podremos encontrar el índice $N$ por muy pequeño que sea $\\varepsilon$, dependemos de una propiedad fundamental de los números reales:
            </p>

            <div class="caja-ram caja-teorema" style="margin-top: 1rem;">
              <div class="caja-ram-icon">🟢</div>
              <div class="caja-ram-body">
                <div class="caja-ram-title">Teorema: Propiedad Arquimediana</div>
                <p>
                  Para cualquier número real positivo $x > 0$ y cualquier número real $y$, existe un número natural $n \\in \\mathbb{N}$ tal que $n \\cdot x > y$.
                </p>
                <p style="font-style: italic; color: var(--text-muted); margin-top: 0.5rem;">
                  <strong>Corolario clave:</strong> Si tomamos $x = 1$, la propiedad nos asegura que para cualquier número real $y$, siempre existe un natural $n$ mayor que él ($n > y$). En términos simples: ¡los números naturales no se acaban ni están acotados superiormente!
                </p>
              </div>
            </div>

            <h3 class="section-title" style="margin-top: 2rem;">Definición Rigurosa de Divergencia ($M - N$)</h3>
            <p>
              Para probar que una sucesión crece infinitamente sin límite, usamos una barrera gigantesca $M$:
            </p>

            <div class="caja-ram caja-alerta" style="margin-top: 1rem;">
              <div class="caja-ram-icon">🟡</div>
              <div class="caja-ram-body">
                <div class="caja-ram-title">Definición: Divergencia a $+\\infty$</div>
                <p>
                  $$\\displaystyle \\lim_{n \\to \\infty} a_n = +\\infty \\iff \\forall M > 0, \\exists N \\in \\mathbb{N} \\text{ tal que } \\forall n \\ge N, a_n > M$$
                </p>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.5rem;">
                  De igual forma, diverge a $-\\infty$ si para toda cota inferior $M < 0$, existe un $N$ tal que para todo $n \\ge N$, $a_n < M$.
                </p>
              </div>
            </div>

            <div class="caja-ram caja-procedamiento" style="margin-top: 2rem;">
              <div class="caja-ram-icon">⚠️</div>
              <div class="caja-ram-body">
                <div class="caja-ram-title">Trampa Cognitiva: La Negación del Límite</div>
                <p>
                  Si una sucesión no es convergente, no significa obligatoriamente que diverge a $\\pm\\infty$. Puede ser <strong>oscilante</strong> (como $a_n = (-1)^n$), donde los términos fluctúan indefinidamente sin estabilizarse ni escapar de forma ilimitada. Negar la convergencia solo significa falta de estabilización.
                </p>
              </div>
            </div>
          </section>
        `;

        const capSuc2Application = `
          <section id="aplicacion-y-practica">
            <h2>Simulador del Juego Épsilon-N ($\\varepsilon - N$)</h2>
            <p>
              Ajusta la tolerancia $\\varepsilon$ con el primer slider y propón un momento de corte $N$ con el segundo slider. El simulador te indicará en tiempo real si el $N$ elegido atrapa completamente la sucesión o si quedan puntos fugitivos.
            </p>

            <div class="interactive-plotter" style="margin-top: 20px;">
              <div class="plotter-title" style="font-family: var(--font-display); font-weight: 700; font-size: 1.15rem; color: var(--accent-color); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                <span>🎮</span> Simulador de Atrapado
              </div>
              
              <div class="plotter-controls" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 16px; background: var(--bg-primary); border-radius: 8px; margin-bottom: 16px;">
                <div class="control-group" style="display: flex; flex-direction: column; gap: 6px;">
                  <label class="control-label" style="font-weight: 600; font-size: 0.9rem;">Sucesión $a_n$</label>
                  
                  <div class="custom-select-wrapper-l2" style="position: relative; cursor: pointer; user-select: none;">
                    <div class="custom-select-trigger-l2" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; font-family: var(--font-display); font-weight: 600;">
                      <span class="custom-select-value-l2">$a_n = \\frac{1}{n}$</span>
                      <span style="font-size: 0.8rem; color: var(--text-muted);">▼</span>
                    </div>
                    <div class="custom-options-container-l2" style="display: none; position: absolute; top: 100%; left: 0; right: 0; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; z-index: 10; box-shadow: var(--shadow-md); margin-top: 4px;">
                      <div class="custom-option-l2 selected" data-value="1/n" style="padding: 8px 12px; border-bottom: 1px solid var(--border-color); font-weight: 600;">$a_n = \\frac{1}{n}$</div>
                      <div class="custom-option-l2" data-value="n/n+1" style="padding: 8px 12px; border-bottom: 1px solid var(--border-color); font-weight: 600;">$a_n = \\frac{n}{n+1}$</div>
                      <div class="custom-option-l2" data-value="alt" style="padding: 8px 12px; font-weight: 600;">$a_n = \\frac{(-1)^n}{n}$</div>
                    </div>
                  </div>

                  <select id="game-preset" class="control-select" style="display: none;">
                    <option value="1/n">1/n</option>
                    <option value="n/n+1">n/n+1</option>
                    <option value="alt">alt</option>
                  </select>
                </div>

                <div class="control-group" style="display: flex; flex-direction: column; gap: 6px;">
                  <label class="control-label" for="game-eps" style="font-weight: 600; font-size: 0.9rem;">Margen de error ($\\varepsilon$)</label>
                  <div class="slider-container" style="display: flex; align-items: center; gap: 10px;">
                    <input type="range" id="game-eps" min="0.05" max="0.25" step="0.01" value="0.15" style="flex: 1; accent-color: var(--accent-color);">
                    <span id="game-eps-val" class="slider-val" style="font-weight: 700; min-width: 35px;">0.15</span>
                  </div>
                </div>
              </div>

              <div class="plotter-controls" style="margin-bottom: 16px; padding: 0 16px;">
                <div class="control-group" style="display: flex; flex-direction: column; gap: 6px;">
                  <label class="control-label" for="game-n" style="font-weight: 600; font-size: 0.9rem;">Tu propuesta de paso ($N$)</label>
                  <div class="slider-container" style="display: flex; align-items: center; gap: 10px;">
                    <input type="range" id="game-n" min="1" max="40" step="1" value="5" style="flex: 1; accent-color: var(--accent-color);">
                    <span id="game-n-val" class="slider-val" style="font-weight: 700; min-width: 35px;">5</span>
                  </div>
                </div>
              </div>
              
              <div class="plotter-svg-wrapper" style="width: 100%; height: 200px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; position: relative; margin-bottom: 16px;">
                <svg class="plotter-svg" id="game-svg" style="width: 100%; height: 100%;">
                  <g id="game-grid"></g>
                  <rect id="game-eps-rect" fill="rgba(6, 182, 212, 0.08)"></rect>
                  <line id="game-eps-upper-line" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="3,3"></line>
                  <line id="game-eps-lower-line" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="3,3"></line>
                  <line id="game-limit-line" stroke="#10b981" stroke-width="1.5"></line>
                  <line id="game-n-cutoff-line" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,4"></line>
                  <g id="game-dots"></g>
                </svg>
              </div>
              
              <div class="plotter-readout" id="game-readout" style="padding: 14px; background: var(--bg-primary); border-radius: 8px; font-weight: 600; text-align: center; font-size: 0.95rem; margin-bottom: 24px; border: 1px solid var(--border-color);">
                Cargando el juego...
              </div>

              <!-- Reto de Cálculo Analítico -->
              <div class="challenge-box" style="border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; background: var(--bg-card); margin-top: 24px;">
                <div class="challenge-title" style="font-family: var(--font-display); font-weight: 700; font-size: 1.15rem; color: var(--accent-color); margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                  <span>🎯</span> Desafío Analítico de Épsilon
                </div>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 16px;">
                  Dada la sucesión $a_n = \\frac{1}{n}$ con límite $L = 0$. Si nos exigen un error exacto de $\\varepsilon = 0.08$: ¿cuál es el mínimo número natural $N$ que debemos elegir para garantizar que todos los términos siguientes queden dentro de la tolerancia?
                </p>

                <div style="display: flex; gap: 10px; margin-bottom: 16px; align-items: center; flex-wrap: wrap;">
                  <button type="button" class="btn-choice option-btn-l2" data-val="10" style="padding: 8px 16px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); cursor: pointer; font-size: 0.9rem; font-weight: 600;">N = 10</button>
                  <button type="button" class="btn-choice option-btn-l2" data-val="12" style="padding: 8px 16px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); cursor: pointer; font-size: 0.9rem; font-weight: 600;">N = 12</button>
                  <button type="button" class="btn-choice option-btn-l2" data-val="13" style="padding: 8px 16px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); cursor: pointer; font-size: 0.9rem; font-weight: 600;">N = 13</button>
                  <button type="button" class="btn-choice option-btn-l2" data-val="15" style="padding: 8px 16px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); cursor: pointer; font-size: 0.9rem; font-weight: 600;">N = 15</button>
                </div>
                
                <div id="game-challenge-feedback" style="font-size: 0.9rem; font-weight: 500; display: none; padding: 12px; border-radius: 6px; margin-top: 10px;"></div>
                
                <div style="margin-top: 12px; text-align: right;">
                  <button type="button" id="btn-verify-challenge-l2" style="padding: 10px 20px; border-radius: 8px; border: none; background: var(--accent-color); color: white; font-weight: 700; cursor: pointer; font-family: var(--font-display);">Verificar Desafío</button>
                </div>
              </div>
            </div>
          </section>
        `;

        const capSuc2Exercises = JSON.stringify([
          {
            title: "Demostración formal de límite lineal",
            level: "nivel-2",
            statement: "Demuestre formalmente, mediante la definición $\\varepsilon - N$, que la sucesión de término general $a_n = \\frac{2n}{n+1}$ converge a $L = 2$.",
            solution: "1. <strong>Borrador de análisis (despeje):</strong> Queremos encontrar un natural $N \\in \\mathbb{N}$ tal que para todo $n \\ge N$:<br>$$\\left| \\frac{2n}{n+1} - 2 \\right| < \\varepsilon$$<br>Efectuando la suma de fracciones dentro del valor absoluto:<br>$$\\left| \\frac{2n - 2(n+1)}{n+1} \\right| = \\left| \\frac{-2}{n+1} \\right| = \\frac{2}{n+1}$$<br>Queremos forzar a que:<br>$$\\frac{2}{n+1} < \\varepsilon \\iff n+1 > \\frac{2}{\\varepsilon} \\iff n > \\frac{2}{\\varepsilon} - 1$$<br><br>2. <strong>Demostración formal (Redacción):</strong><br>Sea $\\varepsilon > 0$. Por la propiedad arquimediana de los reales, existe un número natural $N \\in \\mathbb{N}$ tal que $N > \\frac{2}{\\varepsilon} - 1$.<br>Luego, para cualquier número natural $n \\ge N$, se cumple que:<br>$$n \\ge N > \\frac{2}{\\varepsilon} - 1 \\implies n > \\frac{2}{\\varepsilon} - 1 \\implies n+1 > \\frac{2}{\\varepsilon} \\implies \\frac{2}{n+1} < \\varepsilon$$<br>Dado que $\\left| \\frac{2n}{n+1} - 2 \\right| = \\frac{2}{n+1}$, concluimos que para todo $n \\ge N$, $\\left| \\frac{2n}{n+1} - 2 \\right| < \\varepsilon$. Q.E.D."
          },
          {
            title: "Demostración de divergencia a infinito",
            level: "nivel-2",
            statement: "Demuestre formalmente utilizando la definición $M-N$ que la sucesión $a_n = n^2 + 1$ diverge a $+\\infty$.",
            solution: "1. <strong>Análisis previo:</strong> Dado una barrera real $M > 0$, queremos hallar un natural $N$ tal que para todo $n \\ge N$:<br>$$n^2 + 1 > M \\iff n^2 > M - 1$$<br>Si $M > 1$, esto equivale a $n > \\sqrt{M - 1}$. Si $M \\le 1$, cualquier natural $n \\ge 1$ cumple la desigualdad.<br><br>2. <strong>Demostración formal:</strong><br>Sea $M > 0$. Definimos la cota real $K = \\sqrt{\\max(0, M-1)}$. Por la propiedad arquimediana, siempre existe un número natural $N \\in \\mathbb{N}$ tal que $N > K$.<br>Entonces, para todo natural $n \\ge N$, se tiene:<br>$$n \\ge N > \\sqrt{\\max(0, M-1)} \\implies n^2 > M - 1 \\implies n^2 + 1 > M$$<br>Como para todo $n \\ge N$ se cumple $a_n > M$, demostramos formalmente que $\\lim_{n \\to \\infty} (n^2 + 1) = +\\infty$. $\\blacksquare$"
          },
          {
            title: "Demostración formal con acotación",
            level: "nivel-2",
            statement: "Demuestre formalmente que $\\lim_{n \\to \\infty} \\frac{1}{3^n} = 0$, utilizando la desigualdad $3^n > n$ válida para todo natural $n \\ge 1$.",
            solution: "1. <strong>Análisis previo:</strong> Queremos forzar que $\\left| \\frac{1}{3^n} - 0 \\right| < \\varepsilon \\iff \\frac{1}{3^n} < \\varepsilon$.<br>Dado que la base crece exponencialmente, sabemos que para todo $n \\ge 1$ se cumple $3^n > n$. Tomando los recíprocos (que invierte el sentido de la desigualdad):<br>$$\\frac{1}{3^n} < \\frac{1}{n}$$<br>Si logramos que $\\frac{1}{n} < \\varepsilon$, por transitividad se cumplirá la desigualdad original.<br><br>2. <strong>Demostración formal:</strong><br>Sea $\\varepsilon > 0$. Por propiedad arquimediana, elegimos un natural $N \\in \\mathbb{N}$ tal que $N > \\frac{1}{\\varepsilon}$.<br>Para todo natural $n \\ge N$, se cumple:<br>$$\\frac{1}{3^n} < \\frac{1}{n} \\le \\frac{1}{N} < \\varepsilon$$<br>De esta forma, demostramos que para todo $n \\ge N$, $\\left| \\frac{1}{3^n} - 0 \\right| < \\varepsilon$. $\\blacksquare$"
          }
        ]);

        const capSuc2Formulas = JSON.stringify([
          {
            title: "Límite formal de convergencia",
            latex: "\\lim_{n \\to \\infty} a_n = L \\iff \\forall \\varepsilon > 0, \\exists N \\in \\mathbb{N} : \\forall n \\ge N, |a_n - L| < \\varepsilon",
            description: "Condición estricta de estabilidad de términos reales en una banda de error."
          },
          {
            title: "Límite de divergencia positiva",
            latex: "\\lim_{n \\to \\infty} a_n = +\\infty \\iff \\forall M > 0, \\exists N \\in \\mathbb{N} : \\forall n \\ge N, a_n > M",
            description: "Condición formal de crecimiento sin cota superior."
          },
          {
            title: "Propiedad Arquimediana",
            latex: "\\forall x > 0, \\forall y \\in \\mathbb{R}, \\exists n \\in \\mathbb{N} : n \\cdot x > y",
            description: "Propiedad de los reales que asegura que los naturales no están acotados."
          },
          {
            title: "Desigualdad de Bernoulli",
            latex: "(1 + x)^n \\ge 1 + n \\cdot x \\quad \\forall x \\ge -1, n \\in \\mathbb{N}",
            description: "Herramienta analítica de acotación para sucesiones de base exponencial."
          }
        ]);

        // Push Capítulo 3.2
        await client.query(`
          INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked, content_motivation, content_theory, content_application, content_exercises, content_formulas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [u3Id, '3.2', 'Enfréntate al límite formal', false, false, capSuc2Motivation, capSuc2Theory, capSuc2Application, capSuc2Exercises, capSuc2Formulas]);

        // Placeholders de Capítulos 3.3 a 3.6 (Nivel 3 a 6)
        const placeholders = [
          { index: '3.3', title: 'Domina el álgebra de límites' },
          { index: '3.4', title: 'Compara y acota sucesiones' },
          { index: '3.5', title: 'Demuestra la existencia del límite' },
          { index: '3.6', title: 'Profundiza en la topología' }
        ];

        for (const ph of placeholders) {
          await client.query(`
            INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked, content_motivation, content_theory, content_application, content_exercises, content_formulas)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          `, [u3Id, ph.index, ph.title, false, false, 
              `<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Sucesiones: ${ph.title}</div><p>Este capítulo profundiza en la teoría y práctica de ${ph.title}.</p></div></div>`,
              '<h3>Próximamente</h3><p>Contenido en desarrollo.</p>',
              '<h3>Próximamente</h3><p>Contenido en desarrollo.</p>',
              JSON.stringify([]),
              JSON.stringify([])
          ]);
        }

      } else {
        // Para todos los demás cursos, generar unidades y capítulos de prueba
        const u1Res = await client.query(`
          INSERT INTO units (course_id, unit_index, title, is_locked)
          VALUES ($1, $2, $3, $4) RETURNING id
        `, [c.id, 1, 'Fundamentos y Conceptos Básicos', false]);
        const u1Id = u1Res.rows[0].id;

        const u2Res = await client.query(`
          INSERT INTO units (course_id, unit_index, title, is_locked)
          VALUES ($1, $2, $3, $4) RETURNING id
        `, [c.id, 2, 'Aplicaciones y Métodos Avanzados', false]);
        const u2Id = u2Res.rows[0].id;

        // Capítulos de Unidad 1
        await client.query(`
          INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked, content_motivation, content_theory, content_application, content_exercises, content_formulas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          u1Id, '1.1', 'Introducción y Definición Primaria', false, false,
          `<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación de ${c.title}</div><p>Este capítulo introduce las bases conceptuales indispensables para comprender la asignatura de ${c.title}.</p></div></div>`,
          '<h3>Bases Teóricas</h3><p>Definiciones fundamentales y terminología general del área.</p>',
          '<h3>Campos de Aplicación</h3><p>Ejemplos reales en física, ingeniería o ciencias sociales.</p>',
          '<p>Ejercicios propuestos de autoevaluación para practicar en casa.</p>',
          '<h4>Fórmula Clave</h4><p>Ecuación: A = B + C</p>'
        ]);

        await client.query(`
          INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked, content_motivation, content_theory, content_application, content_exercises, content_formulas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          u1Id, '1.2', 'Propiedades Fundamentales', false, false,
          '<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación</div><p>Exploramos las propiedades que rigen los operadores de esta asignatura.</p></div></div>',
          '<h3>Propiedades de Operación</h3><p>Teoremas y axiomas algebraicos básicos.</p>',
          '<h3>Aplicaciones</h3><p>Simplificación de expresiones matemáticas complejas.</p>',
          '<p>Resuelva simplificando las expresiones dadas.</p>',
          '<h4>Leyes</h4><p>Ley asociativa y distributiva aplicadas.</p>'
        ]);

        // Capítulos de Unidad 2
        await client.query(`
          INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked, content_motivation, content_theory, content_application, content_exercises, content_formulas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          u2Id, '2.1', 'Métodos de Resolución Estándar', false, false,
          '<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación</div><p>Aprenderemos algoritmos paso a paso para resolver problemas tipo examen.</p></div></div>',
          '<h3>Métodos Algorítmicos</h3><p>Pasos secuenciales y pautas estructuradas de resolución.</p>',
          '<h3>Aplicaciones</h3><p>Resolución práctica de problemas típicos de certamen.</p>',
          '<p>Ejercicios mecánicos y analíticos resueltos.</p>',
          '<h4>Algoritmo</h4><p>Paso 1: Identificar variables. Paso 2: Despejar la incógnita.</p>'
        ]);

        await client.query(`
          INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked, content_motivation, content_theory, content_application, content_exercises, content_formulas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          u2Id, '2.2', 'Problemas Aplicados en Ingeniería', false, false,
          '<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación de Ingeniería</div><p>Analizaremos cómo se usa esta herramienta matemática en el diseño y simulación de ingeniería.</p></div></div>',
          '<h3>Modelamiento Matemático</h3><p>Representación de sistemas físicos mediante ecuaciones.</p>',
          '<h3>Aplicación</h3><p>Análisis de fatiga de materiales y optimización de recursos.</p>',
          '<p>Plantee el modelo matemático para la viga sometida a carga uniforme.</p>',
          '<h4>Fórmula física</h4><p>Esfuerzo = Fuerza / Área</p>'
        ]);
      }
    }

    console.log("Base de datos de Cursos completa sembrada correctamente.");
  }
}

exports.handler = async (event, context) => {
  // CORS Preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: ""
    };
  }

  let client;
  try {
    client = getPgClient();
    await client.connect();

    // Ejecutar inicialización automática de BD
    await initDatabase(client);

    const httpMethod = event.httpMethod;
    const queryParams = event.queryStringParameters || {};
    const courseId = queryParams.courseId;
    const chapterIndex = queryParams.chapterIndex;
    const type = queryParams.type;

    if (httpMethod === "GET") {
      // 1. Obtener listado de cursos generales
      if (!courseId) {
        const res = await client.query("SELECT * FROM courses ORDER BY title");
        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify(res.rows)
        };
      }

      // 2. Obtener un capítulo específico de un curso
      if (chapterIndex) {
        const res = await client.query(`
          SELECT ch.* 
          FROM chapters ch
          JOIN units u ON ch.unit_id = u.id
          WHERE u.course_id = $1 AND ch.chapter_index = $2
        `, [courseId, chapterIndex]);

        if (res.rows.length === 0) {
          return {
            statusCode: 404,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: "Capítulo no encontrado" })
          };
        }

        const ch = res.rows[0];
        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            id: ch.id,
            chapterIndex: ch.chapter_index,
            title: ch.title,
            isCompleted: ch.is_completed,
            isLocked: ch.is_locked,
            contentMotivation: ch.content_motivation,
            contentTheory: ch.content_theory,
            contentApplication: ch.content_application,
            contentExercises: ch.content_exercises,
            contentFormulas: ch.content_formulas
          })
        };
      }

      // 3. Obtener la estructura jerárquica del curso (Unidades y Capítulos)
      const courseRes = await client.query("SELECT * FROM courses WHERE id = $1", [courseId]);
      if (courseRes.rows.length === 0) {
        return {
          statusCode: 404,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: "Curso no encontrado" })
        };
      }

      const unitsRes = await client.query("SELECT * FROM units WHERE course_id = $1 ORDER BY unit_index", [courseId]);
      
      const structure = [];
      for (const unit of unitsRes.rows) {
        const chaptersRes = await client.query("SELECT id, chapter_index, title, is_completed, is_locked FROM chapters WHERE unit_id = $1 ORDER BY chapter_index", [unit.id]);
        structure.push({
          id: unit.id,
          unitIndex: unit.unit_index,
          title: unit.title,
          isLocked: unit.is_locked,
          chapters: chaptersRes.rows.map(ch => ({
            id: ch.id,
            chapterIndex: ch.chapter_index,
            title: ch.title,
            isCompleted: ch.is_completed,
            isLocked: ch.is_locked
          }))
        });
      }

      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          course: courseRes.rows[0],
          units: structure
        })
      };
    }

    if (httpMethod === "POST") {
      // Validar autenticación básica para escrituras
      if (!isAuthorized(event)) {
        return {
          statusCode: 401,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: "No autorizado" })
        };
      }

      const body = JSON.parse(event.body);

      if (type === "chapter") {
        // Guardar o actualizar un capítulo
        if (body.id) {
          // UPDATE
          await client.query(`
            UPDATE chapters 
            SET title = $1, is_completed = $2, is_locked = $3,
                content_motivation = $4, content_theory = $5, content_application = $6,
                content_exercises = $7, content_formulas = $8, chapter_index = $9
            WHERE id = $10
          `, [
            body.title, body.isCompleted, body.isLocked,
            body.contentMotivation, body.contentTheory, body.contentApplication,
            body.contentExercises, body.contentFormulas, body.chapterIndex,
            body.id
          ]);
          return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ success: true, message: "Capítulo actualizado" })
          };
        } else {
          // INSERT
          const insertRes = await client.query(`
            INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked,
                                  content_motivation, content_theory, content_application, content_exercises, content_formulas)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id
          `, [
            body.unitId, body.chapterIndex, body.title, body.isCompleted || false, body.isLocked || false,
            body.contentMotivation || '', body.contentTheory || '', body.contentApplication || '',
            body.contentExercises || '', body.contentFormulas || ''
          ]);
          return {
            statusCode: 201,
            headers: CORS_HEADERS,
            body: JSON.stringify({ success: true, id: insertRes.rows[0].id, message: "Capítulo creado" })
          };
        }
      }

      if (type === "unit") {
        if (body.id) {
          // UPDATE
          await client.query(`
            UPDATE units 
            SET title = $1, is_locked = $2, unit_index = $3
            WHERE id = $4
          `, [body.title, body.isLocked, body.unitIndex, body.id]);
          return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ success: true, message: "Unidad actualizada" })
          };
        } else {
          // INSERT
          const insertRes = await client.query(`
            INSERT INTO units (course_id, unit_index, title, is_locked)
            VALUES ($1, $2, $3, $4) RETURNING id
          `, [body.courseId, body.unitIndex, body.title, body.isLocked || false]);
          return {
            statusCode: 201,
            headers: CORS_HEADERS,
            body: JSON.stringify({ success: true, id: insertRes.rows[0].id, message: "Unidad creada" })
          };
        }
      }

      if (type === "course") {
        if (body.idExists) {
          // UPDATE
          await client.query(`
            UPDATE courses 
            SET title = $1, description = $2, icon = $3
            WHERE id = $4
          `, [body.title, body.description, body.icon, body.id]);
          return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ success: true, message: "Curso actualizado" })
          };
        } else {
          // INSERT
          await client.query(`
            INSERT INTO courses (id, title, description, icon)
            VALUES ($1, $2, $3, $4)
          `, [body.id, body.title, body.description, body.icon || 'fa-graduation-cap']);
          return {
            statusCode: 201,
            headers: CORS_HEADERS,
            body: JSON.stringify({ success: true, id: body.id, message: "Curso creado" })
          };
        }
      }
    }

    if (httpMethod === "DELETE") {
      if (!isAuthorized(event)) {
        return {
          statusCode: 401,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: "No autorizado" })
        };
      }

      const idVal = queryParams.id;
      if (type === "chapter") {
        await client.query("DELETE FROM chapters WHERE id = $1", [idVal]);
        return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ success: true, message: "Capítulo eliminado" }) };
      }
      if (type === "unit") {
        await client.query("DELETE FROM units WHERE id = $1", [idVal]);
        return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ success: true, message: "Unidad eliminada" }) };
      }
      if (type === "course") {
        await client.query("DELETE FROM courses WHERE id = $1", [idVal]);
        return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ success: true, message: "Curso eliminado" }) };
      }
    }

    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Método no permitido" })
    };

  } catch (error) {
    console.error("Error en serverless courses:", error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    if (client) {
      await client.end();
    }
  }
};

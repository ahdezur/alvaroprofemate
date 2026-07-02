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

  // Verificar si calculo-multivariable está sembrado (o si no hay cursos sembrados)
  const checkRes = await client.query("SELECT COUNT(*) FROM courses WHERE id = 'calculo-multivariable'");
  const hasMultivariable = parseInt(checkRes.rows[0].count, 10) > 0;

  if (!hasMultivariable) {
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
      { id: 'calculo-multivariable', title: 'Calculo Multivariable', desc: 'Cálculo en varias variables: límites, derivadas parciales, integrales dobles y triples, y teoremas vectoriales.', icon: 'fa-layer-group' },
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
        `, [c.id, 2, 'Cálculo Diferencial Vectorial', true]);

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
          u1Id, '1.2', 'Límites y Continuidad en 3D', false, true,
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
              <div class="caja-ram-title">Motivación: El ADN de las funciones</div>
              <p>
                Los polinomios son los bloques de construcción fundamentales del álgebra y el análisis matemático. Piensa en ellos como el "lenguaje universal" con el que podemos modelar desde la trayectoria de un proyectil en física, hasta los algoritmos de compresión de datos en ciencias de la computación.
              </p>
              <p>
                Comprender cómo descomponerlos (factorizarlos) y encontrar sus raíces es similar a descubrir el ADN de una función matemática. Al dominar los polinomios, te preparas para entender conceptos mucho más avanzados como el cálculo y la teoría de números.
              </p>
            </div>
          </div>
        `;

        const capPolTheory = `
          <h3>Definición de Polinomio</h3>
          <div class="caja-ram caja-definicion">
            <div class="caja-ram-icon">📐</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Definición Formal</div>
              <p>
                Un polinomio de variable $x$ y grado $n \\in \\mathbb{N}$ es una expresión algebraica que denotaremos por $p(x)$ y cuya forma matemática formal es:
                $$p(x)=a_{0}+a_{1}x+\\cdots+a_{n}x^{n}=\\sum_{k=0}^{n}a_{k}x^{k}$$
                donde el coeficiente líder cumple que $a_{n} \\neq 0$.
              </p>
              <p>
                Dentro de esta estructura fundamental, identificamos los siguientes componentes:
                <ul style="margin-left: 20px; margin-top: 8px;">
                  <li>$a_{k}$ se denominan <strong>coeficientes</strong> del polinomio.</li>
                  <li>$a_{0}$ se conoce como el <strong>término libre</strong>.</li>
                  <li>$a_{1}x$ corresponde al <strong>término lineal</strong>.</li>
                  <li>$a_{n}x^{n}$ es el <strong>término líder</strong>.</li>
                  <li>Si $a_{k} \\in \\mathbb{C}$, diremos que $p(x)$ es un <strong>polinomio a coeficientes complejos</strong>.</li>
                  <li>Si $a_{k} \\in \\mathbb{R}$, diremos que $p(x)$ es un <strong>polinomio a coeficientes reales</strong>.</li>
                </ul>
              </p>
            </div>
          </div>

          <h3>Glosario Técnico y Terminología Clave</h3>
          <div class="caja-ram caja-teoria">
            <div class="caja-ram-icon">📐</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Raíz o Cero de un Polinomio</div>
              <p>
                Diremos que $c \\in \\mathbb{C}$ es un cero o una raíz de $p(x)$ si al evaluar algebraicamente el polinomio en la asignación $x=c$ se obtiene cero, es decir, $p(c)=0$.
              </p>
              <p>
                Geométricamente (en $\\mathbb{R}$), representa el punto de intersección de la gráfica de la función con el eje $x$.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-propiedades">
            <div class="caja-ram-icon">📋</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Divisibilidad de Polinomios</div>
              <p>
                Sean $D(x)$ y $d(x)$ dos polinomios, con $d(x)$ distinto del polinomio nulo. Decimos que $d(x)$ <strong>divide</strong> a $D(x)$ si la división es exacta, es decir, el resto $r(x)$ es cero. Esto permite expresar el dividendo como:
                $$D(x) = d(x)q(x)$$
              </p>
            </div>
          </div>

          <h3>Teoremas Principales</h3>
          <div class="caja-ram caja-teorema">
            <div class="caja-ram-icon">🧠</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Teorema del Resto</div>
              <p>Al dividir $D$ entre $x-c$ se obtiene como resto $D(c)$.</p>
            </div>
          </div>

          <div class="caja-ram caja-teorema">
            <div class="caja-ram-icon">🧠</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Teorema de la Raíz Racional</div>
              <p>
                Sea $p(x)$ un polinomio con coeficientes enteros. Supongamos que $c=\\frac{u}{v} \\in \\mathbb{Q}$ es una raíz racional irreducible. Entonces $u$ divide a $a_{0}$ y $v$ divide a $a_{n}$.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-teorema">
            <div class="caja-ram-icon">🧠</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Teorema de la Raíz Conjugada</div>
              <p>
                Sea $p(x)$ un polinomio con coeficientes reales. Si $z \\in \\mathbb{C}$ es una raíz de $p(x)$, entonces $\\overline{z}$ también es raíz de $p(x)$.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-teorema">
            <div class="caja-ram-icon">🧠</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Teorema Fundamental del Álgebra</div>
              <p>
                Todo polinomio no constante a coeficientes complejos tiene una raíz compleja.
              </p>
            </div>
          </div>

          <h3>Propiedades Fundamentales</h3>
          <div class="caja-ram caja-propiedades">
            <div class="caja-ram-icon">📋</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Algoritmo de la División</div>
              <p>
                Existen únicos polinomios $q(x)$ y $r(x)$ tales que $D(x)=d(x)q(x)+r(x)$, donde $\\text{gr}(r) < \\text{gr}(d)$.
              </p>
            </div>
          </div>

          <div class="caja-ram caja-propiedades">
            <div class="caja-ram-icon">📋</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Relación Factor-Raíz y Multiplicidad</div>
              <p>
                <ul style="margin-left: 20px;">
                  <li><strong>Relación Factor-Raíz:</strong> $x-c$ es un factor de $D$ si y sólo si $x=c$ es una raíz de $D$.</li>
                  <li><strong>Multiplicidad:</strong> Diremos que $m$ es la multiplicidad de la raíz $x=c$ si $(x-c)^{m}$ es un factor de $p(x)$, pero el término $(x-c)^{m+1}$ no es factor de $p(x)$.</li>
                </ul>
              </p>
            </div>
          </div>

          <div class="caja-ram caja-pregunta-guia">
            <div class="caja-ram-icon">💡</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Idea Clave: Conexión de conceptos</div>
              <p>
                ¿Cómo se conectan la divisibilidad, los factores y las raíces? Son tres formas de describir lo mismo: si $x-c$ divide a $p(x)$, entonces $x-c$ es un factor, lo que ocurre únicamente porque $c$ es raíz ($p(c)=0$).
              </p>
            </div>
          </div>

          <div class="caja-ram error-comun">
            <div class="caja-ram-icon">🚨</div>
            <div class="caja-ram-body">
              <div class="caja-ram-title">Error Común (¡Trampa Cognitiva!)</div>
              <p>
                <strong>Confundir divisibilidad:</strong> Confundir "es divisible por" con una división ordinaria. La palabra "divisible" decreta que el resto es estrictamente cero.
              </p>
              <p>
                <strong>Ruffini incompleto:</strong> Al usar la regla de Ruffini, jamás olvides rellenar con ceros los coeficientes de las potencias faltantes en el dividendo.
              </p>
            </div>
          </div>
        `;

        const capPolApplication = `
          <h3>Evaluación Formativa Rápida</h3>
          <p>
            Comprueba tu comprensión resolviendo las siguientes preguntas interactivas:
          </p>

          <div class="evaluacion-formativa" data-eval-id="eval-vf-polinomios-1" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>🤔 Enunciado 1</span>
              <div>Si al evaluar un polinomio a coeficientes reales obtenemos que $p(2+3i)=0$, podemos asegurar que $x=2-3i$ también es una raíz.</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! Por el Teorema de la Raíz Conjugada, en polinomios con coeficientes reales, las raíces complejas siempre vienen en pares conjugados.">
                A) Verdadero
              </button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Dado que los coeficientes son reales, si z es raíz, el conjugado de z también es raíz.">
                B) Falso
              </button>
            </div>
            <div class="feedback-contenedor hidden">
              <div class="feedback-icon"></div>
              <div class="feedback-texto"></div>
            </div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-vf-polinomios-2" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>🤔 Enunciado 2</span>
              <div>Al dividir $D(x)$ por un divisor $d(x)$, el grado del resto puede ser igual al grado del divisor.</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Por el Algoritmo de la División, el grado del resto r(x) debe ser estrictamente menor que el grado del divisor d(x).">
                A) Verdadero
              </button>
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! El grado del resto debe ser estrictamente menor que el del divisor.">
                B) Falso
              </button>
            </div>
            <div class="feedback-contenedor hidden">
              <div class="feedback-icon"></div>
              <div class="feedback-texto"></div>
            </div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-sm-polinomios-1" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>✏️ Completar la definición</span>
              <div>Diremos que $c \\in \\mathbb{C}$ es un cero o una _________ de $p(x)$ si al evaluar $p(x)$ en $x=c$ se obtiene cero.</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! 'Cero' y 'raíz' de un polinomio son sinónimos.">
                A) raíz
              </button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. El término correcto es raíz.">
                B) variable
              </button>
            </div>
            <div class="feedback-contenedor hidden">
              <div class="feedback-icon"></div>
              <div class="feedback-texto"></div>
            </div>
          </div>

          <div class="evaluacion-formativa" data-eval-id="eval-sm-polinomios-2" style="margin-bottom: 20px;">
            <div class="eval-pregunta">
              <span>✏️ Completar el método</span>
              <div>Para aplicar el esquema de división corta o _________, el grado del divisor $d(x)$ debe ser 1.</div>
            </div>
            <div class="eval-opciones">
              <button class="opcion-btn" data-correct="true" data-explicacion="¡Correcto! La regla de Ruffini (o división sintética) se aplica cuando el divisor es de la forma x-c (grado 1).">
                A) Regla de Ruffini
              </button>
              <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. Ruffini es el esquema de división corta para grado 1.">
                B) Algoritmo clásico
              </button>
            </div>
            <div class="feedback-contenedor hidden">
              <div class="feedback-icon"></div>
              <div class="feedback-texto"></div>
            </div>
          </div>
        `;

        const capPolExercises = `
          <div class="ejercicio-propuesto" data-ejercicio-id="res-polinomios-1">
            <div class="ejercicio-header">
              <h4 class="ejercicio-titulo-prop">1. Divisibilidad y Teorema del Resto (Resuelto)</h4>
              <span class="badge-nivel" style="background-color: var(--accent-bg); color: var(--accent-color); font-weight: bold;">Ejercicio Resuelto</span>
            </div>
            <p class="ejercicio-enunciado">
              Demostrar que $p(x)=32x^{10}-33x^{5}+1$ es divisible por $x-1$.
            </p>
            <button class="btn-pista" aria-expanded="false">
              <span>💡</span> Ver Indicación / Pauta
            </button>
            <div class="pista-contenido hidden">
              <strong>Solución paso a paso:</strong>
              <p>
                Si $p(x)$ es divisible por $x-1$, gracias al Teorema del Resto se tiene entonces que $p(1)=0$.
              </p>
              <p>
                Sustituyendo $x=1$ en $p(x)$:
                $$p(1)=32(1)^{10}-33(1)^{5}+1=32-33+1=0$$
              </p>
              <p>
                Por lo tanto, $p(x)$ es divisible por $x-1$.
              </p>
            </div>
          </div>

          <div class="ejercicio-propuesto" data-ejercicio-id="res-polinomios-2">
            <div class="ejercicio-header">
              <h4 class="ejercicio-titulo-prop">2. Coeficientes reales y raíces conjugadas (Resuelto)</h4>
              <span class="badge-nivel" style="background-color: var(--accent-bg); color: var(--accent-color); font-weight: bold;">Ejercicio Resuelto</span>
            </div>
            <p class="ejercicio-enunciado">
              Dada la ecuación $x^{3}+ax^{2}+bx+a=0$ con $a,b \\in \\mathbb{R}$ determine $a$ y $b$ tales que $x=2+i$ sea una raíz. Encuentre las otras raíces.
            </p>
            <button class="btn-pista" aria-expanded="false">
              <span>💡</span> Ver Indicación / Pauta
            </button>
            <div class="pista-contenido hidden">
              <strong>Solución paso a paso:</strong>
              <ol style="margin-left: 20px;">
                <li>Si $x=2+i$ es raíz, dado que los coeficientes son reales, también $x=2-i$ será raíz. La tercera raíz es real, denotada como $r$.</li>
                <li>La suma de las raíces es: $(2+i)+(2-i)+r = -a \\implies 4+r = -a \\implies r = -a-4$.</li>
                <li>El producto de las raíces es: $(2+i)(2-i)r = -a \\implies 5r = -a$.</li>
                <li>Sustituyendo $r = -a-4$ en $5r = -a$: $5(-a-4) = -a \\implies -5a-20 = -a \\implies -4a = 20 \\implies a = -5$.</li>
                <li>Por tanto, la raíz real es $r = 1$.</li>
                <li>El valor de $b$ se obtiene de la suma de productos de dos en dos:
                  $$b = (2+i)(2-i) + (2+i)(1) + (2-i)(1) = 5 + 2 + i + 2 - i = 9$$
                </li>
              </ol>
              <p><strong>Resultado:</strong> $a=-5$ y $b=9$. Las raíces son $x=2\\pm i$, y $x=1$.</p>
            </div>
          </div>

          <div class="ejercicio-propuesto" data-ejercicio-id="res-polinomios-3">
            <div class="ejercicio-header">
              <h4 class="ejercicio-titulo-prop">3. Construcción con raíces múltiples (Resuelto)</h4>
              <span class="badge-nivel" style="background-color: var(--accent-bg); color: var(--accent-color); font-weight: bold;">Ejercicio Resuelto</span>
            </div>
            <p class="ejercicio-enunciado">
              Sea $p(x)=x^{4}+12x^{3}+ax^{2}+bx+c$, determine $a, b$ y $c$ de modo tal que $p$ admita a $x=1$ como raíz de multiplicidad 3.
            </p>
            <button class="btn-pista" aria-expanded="false">
              <span>💡</span> Ver Indicación / Pauta
            </button>
            <div class="pista-contenido hidden">
              <strong>Solución paso a paso:</strong>
              <p>Por hipótesis, $p(x)=(x-1)^{3}(x-r)$.</p>
              <p>Expandiendo el producto $(x-1)^{3} = x^{3}-3x^{2}+3x-1$.</p>
              <p>Entonces: $p(x) = (x^{3}-3x^{2}+3x-1)(x-r) = x^{4}+(-r-3)x^{3}+(3r+3)x^{2}+(-3r-1)x+r$.</p>
              <p>Igualando coeficientes con $x^{4}+12x^{3}+ax^{2}+bx+c$:</p>
              <ul style="margin-left: 20px;">
                <li>Término $x^3$: $-r-3=12 \\implies r=-15$.</li>
                <li>Término $x^2$: $3r+3=a \\implies a=3(-15)+3=-42$.</li>
                <li>Término $x$: $-3r-1=b \\implies b=-3(-15)-1=44$.</li>
                <li>Término libre: $r=c \\implies c=-15$.</li>
              </ul>
              <p><strong>Resultado:</strong> $a=-42$, $b=44$, $c=-15$.</p>
            </div>
          </div>

          <div class="ejercicio-propuesto" data-ejercicio-id="prop-polinomios-1">
            <div class="ejercicio-header">
              <h4 class="ejercicio-titulo-prop">4. División Larga (Propuesto)</h4>
              <span class="badge-nivel nivel-1">Nivel 1: Mecánico</span>
            </div>
            <p class="ejercicio-enunciado">
              Encuentre el cociente $q(x)$ y el resto $r(x)$ de dividir el polinomio $p(x)=3x^{4}-2x^{3}+4x-7$ entre $q(x)=x+3$.
            </p>
            <button class="btn-pista" aria-expanded="false">
              <span>💡</span> Ver Indicación / Pauta
            </button>
            <div class="pista-contenido hidden">
              <strong>Pauta de control:</strong>
              <p>Puedes aplicar división sintética (Ruffini) con $c = -3$, recordando colocar un 0 para el término $x^2$.</p>
              <p><strong>Resultado:</strong> Cociente $q(x) = 3x^3 - 11x^2 + 33x - 95$, Resto $r = 278$.</p>
            </div>
          </div>

          <div class="ejercicio-propuesto" data-ejercicio-id="prop-polinomios-2">
            <div class="ejercicio-header">
              <h4 class="ejercicio-titulo-prop">5. Condiciones de Divisibilidad (Propuesto)</h4>
              <span class="badge-nivel nivel-2">Nivel 2: Analítico</span>
            </div>
            <p class="ejercicio-enunciado">
              Hallar la relación entre los coeficientes $a$ y $b$ para que el polinomio $p(x)=2x^{4}-7x^{3}+ax+b$ sea divisible por $x-3$.
            </p>
            <button class="btn-pista" aria-expanded="false">
              <span>💡</span> Ver Indicación / Pauta
            </button>
            <div class="pista-contenido hidden">
              <strong>Pauta de control:</strong>
              <p>Para que sea divisible, el resto al evaluar en $x=3$ debe ser exactamente cero: $p(3) = 0$.</p>
              <p>Sustituyendo: $2(3)^4 - 7(3)^3 + 3a + b = 0 \\implies 162 - 189 + 3a + b = 0 \\implies 3a + b = 27$.</p>
              <p><strong>Resultado:</strong> La relación buscada es $3a + b = 27$.</p>
            </div>
          </div>

          <div class="ejercicio-propuesto" data-ejercicio-id="prop-polinomios-3">
            <div class="ejercicio-header">
              <h4 class="ejercicio-titulo-prop">6. Resto determinado (Propuesto)</h4>
              <span class="badge-nivel nivel-3">Nivel 3: Certamen</span>
            </div>
            <p class="ejercicio-enunciado">
              Encontrar $a$ y $b$ de modo tal que el resto de la división de $p(x)=ax^{4}+bx^{3}+6x^{2}-12x+4$ por $x^{2}-1$ sea exactamente el binomio $2x+1$.
            </p>
            <button class="btn-pista" aria-expanded="false">
              <span>💡</span> Ver Indicación / Pauta
            </button>
            <div class="pista-contenido hidden">
              <strong>Pauta de control:</strong>
              <p>Escribe $p(x) = (x^2-1)q(x) + 2x + 1 = (x-1)(x+1)q(x) + 2x + 1$. Evalúa en $x=1$ y en $x=-1$ para armar un sistema lineal de dos variables:</p>
              <ul>
                <li>$p(1) = 3 \\implies a + b - 2 = 3 \\implies a + b = 5$.</li>
                <li>$p(-1) = -1 \\implies a - b + 22 = -1 \\implies a - b = -23$.</li>
              </ul>
              <p><strong>Resultado:</strong> Resolviendo el sistema se obtiene $a = -9$ y $b = 14$.</p>
            </div>
          </div>
        `;

        const capPolFormulas = `
          <h3 style="margin: 0 0 12px 0; color: var(--accent-color); font-size: 1.15rem; font-weight: 700; font-family: var(--font-display);">
            📐 Fórmulas Claves
          </h3>

          <div class="formula-card">
            <h4>Estructura General</h4>
            <div class="formula-card-latex">
              \\( p(x) = \\sum_{k=0}^{n} a_k x^k \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              Polinomio de grado $n$ con $a_n \\neq 0$.
            </p>
          </div>

          <div class="formula-card">
            <h4>Algoritmo de la División</h4>
            <div class="formula-card-latex">
              \\( D(x) = d(x)q(x) + r(x) \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              Relación fundamental de división con $\\text{gr}(r) < \\text{gr}(d)$.
            </p>
          </div>

          <div class="formula-card">
            <h4>Cardano-Vieta: Suma de raíces</h4>
            <div class="formula-card-latex">
              \\( \\sum_{k=1}^{n} r_k = -\\frac{a_{n-1}}{a_n} \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              Suma de las raíces de un polinomio de grado $n$.
            </p>
          </div>

          <div class="formula-card">
            <h4>Cardano-Vieta: Producto de raíces</h4>
            <div class="formula-card-latex">
              \\( \\prod_{k=1}^{n} r_k = (-1)^n \\frac{a_0}{a_n} \\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              Producto de las raíces de un polinomio de grado $n$.
            </p>
          </div>
        `;

        await client.query(`
          INSERT INTO chapters (unit_id, chapter_index, title, is_completed, is_locked, content_motivation, content_theory, content_application, content_exercises, content_formulas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [u3Id, '3.1', 'Polinomios', false, false, capPolMotivation, capPolTheory, capPolApplication, capPolExercises, capPolFormulas]);

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
          u2Id, '2.2', 'Problemas Aplicados en Ingeniería', false, true,
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

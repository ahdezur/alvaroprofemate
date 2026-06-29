const { Client } = require('pg');
const nodemailer = require('nodemailer');

// Publicaciones por defecto para poblar la base de datos al inicio
const DEFAULT_POSTS = [
  {
    id: "1",
    title: "El Teorema Fundamental del Cálculo: Un Puente entre Derivadas e Integrales",
    excerpt: "Descubre la conexión profunda y la intuición geométrica detrás de uno de los pilares más importantes de la matemática moderna.",
    content: `
      <p>El Cálculo es, sin duda, uno de los mayores logros del intelecto humano. Pero durante siglos, sus dos ramas principales, el <strong>Cálculo Diferencial</strong> (la búsqueda de tangentes y razones de cambio) y el <strong>Cálculo Integral</strong> (el cálculo de áreas bajo curvas), se desarrollaron de manera independiente.</p>
      
      <h3>La Gran Conexión</h3>
      <p>Fue el trabajo independiente de Isaac Newton e Isaac Barrow (y de forma paralela Gottfried Leibniz) el que consolidó el <strong>Teorema Fundamental del Cálculo</strong>. Este teorema establece formalmente que la derivación y la integración son operaciones inversas.</p>
      
      <blockquote style="border-left: 4px solid var(--accent); padding-left: 15px; margin: 20px 0; color: var(--text-muted); font-style: italic;">
        Si una función continua f(x) se integra para obtener F(x), entonces al derivar F(x) regresamos exactamente a f(x).
      </blockquote>

      <h3>Visualización Geométrica</h3>
      <p>Imagina que estás acumulando área bajo la curva de una función. La velocidad a la que esta área acumulada cambia en cualquier punto es exactamente la altura de la curva original en ese punto. Esto es lo que nos dice el teorema y es lo que hace que calcular integrales difíciles sea tan simple como encontrar una función antiderivada.</p>

      <div style="background: rgba(6, 182, 212, 0.05); border: 1px solid rgba(6, 182, 212, 0.2); padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: var(--accent);">Ecuación Clave:</h4>
        <code style="display: block; font-family: 'Courier New', Courier, monospace; background: rgba(0,0,0,0.1); padding: 10px; border-radius: 4px; overflow-x: auto;">
          &int;<sub>a</sub><sup>b</sup> f(x) dx = F(b) - F(a), donde F'(x) = f(x)
        </code>
      </div>

      <h3>¿Por qué es importante para un estudiante?</h3>
      <p>Entender esta conexión en lugar de solo memorizar fórmulas te permite resolver problemas físicos complejos, como calcular distancias recorridas a partir de velocidades variables, o predecir el comportamiento de sistemas dinámicos en ingeniería. En mis clases de <strong>Cálculo Diferencial e Integral</strong>, nos enfocamos en que veas y sientas esta geometría antes de pasar al desarrollo algebraico duro.</p>
    `,
    category: "Cálculo",
    date: "2026-05-28",
    readTime: "4 min"
  },
  {
    id: "2",
    title: "¿Por qué el Álgebra Lineal es el motor detrás de la Inteligencia Artificial?",
    excerpt: "Desde redes neuronales hasta el procesamiento de imágenes, las matrices y vectores son las herramientas matemáticas que cambian el mundo actual.",
    content: `
      <p>Hoy en día escuchamos hablar de Inteligencia Artificial (IA) en todos lados, pero ¿qué hay realmente detrás de los algoritmos de ChatGPT, la conducción autónoma o los filtros de fotos? La respuesta no es magia: es <strong>Álgebra Lineal</strong>.</p>
      
      <h3>Matrices y Vectores: Los bloques de construcción</h3>
      <p>Una computadora no entiende conceptos como "una foto de un gato". Entiende números. Una imagen digital es en realidad una gran cuadrícula de píxeles, que matemáticamente modelamos como una <strong>matriz</strong>. Cada color e intensidad se representa por valores numéricos.</p>
      
      <p>Cuando una red neuronal procesa esta información, realiza millones de multiplicaciones de matrices por vectores para detectar bordes, texturas y finalmente patrones que identifican al gato. El entrenamiento de estas redes es, en esencia, encontrar los valores de una matriz gigante que minimicen el error.</p>

      <div style="text-align: center; margin: 25px 0;">
        <svg width="200" height="200" viewBox="0 0 200 200" style="background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
          <grid>
            <line x1="0" y1="100" x2="200" y2="100" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
            <line x1="100" y1="0" x2="100" y2="200" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
            <line x1="100" y1="100" x2="150" y2="50" stroke="#06b6d4" stroke-width="3" marker-end="url(#arrow)"/>
            <text x="155" y="45" fill="#06b6d4" font-family="Outfit" font-size="12">v</text>
            <line x1="100" y1="100" x2="180" y2="120" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow)"/>
            <text x="185" y="130" fill="#3b82f6" font-family="Outfit" font-size="12">Av</text>
          </grid>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" />
            </marker>
          </defs>
        </svg>
        <p style="font-size: 12px; color: var(--text-muted); margin-top: 5px;">Transformación Lineal: T(v) = Av</p>
      </div>

      <h3>Espacios Vectoriales y Dimensiones</h3>
      <p>En el procesamiento de lenguaje natural, las palabras se convierten en vectores en espacios de alta dimensionalidad (cientos o miles de dimensiones). Palabras con significados similares, como "cálculo" y "álgebra", terminan muy juntas en este espacio. Esto se calcula midiendo el ángulo entre sus vectores (similitud del coseno).</p>
      
      <p>Dominar operaciones con matrices, autovalores (eigenvalues) y autovectores (eigenvectors) no es solo para pasar un ramo universitario; es la base para entender y crear las tecnologías del mañana.</p>
    `,
    category: "Álgebra Lineal",
    date: "2026-05-15",
    readTime: "6 min"
  },
  {
    id: "3",
    title: "Ecuaciones Diferenciales: Modelando el Comportamiento del Universo",
    excerpt: "Desde el crecimiento poblacional hasta la propagación del calor, descubre cómo las derivadas nos ayudan a predecir el futuro de sistemas complejos.",
    content: `
      <p>¿Cómo sabemos a qué velocidad se enfriará una taza de café? ¿Cómo se calcula la curva de contagio de una pandemia o la trayectoria de un cohete? Todo se reduce a ecuaciones que relacionan una función con sus derivadas: las <strong>Ecuaciones Diferenciales Ordinarias (EDO)</strong>.</p>
      
      <h3>¿Qué es una Ecuación Diferencial?</h3>
      <p>A diferencia del álgebra tradicional donde la incógnita es un número, en una ecuación diferencial la incógnita es una <strong>función</strong>. La ecuación describe cómo cambia la función en el tiempo o espacio en base a su estado actual.</p>

      <h3>La Ley de Enfriamiento de Newton</h3>
      <p>Un ejemplo clásico que vemos en clases es la Ley de Enfriamiento de Newton, expresada como:</p>
      <code style="display: block; font-family: monospace; background: rgba(0,0,0,0.1); padding: 10px; border-radius: 4px; margin: 15px 0;">
        dT/dt = -k(T - T<sub>m</sub>)
      </code>
      <p>Donde la velocidad a la que cambia la temperatura de un objeto (dT/dt) es proporcional a la diferencia de temperatura entre el objeto (T) y el medio ambiente (T<sub>m</sub>). Al resolver esta ecuación, obtenemos una función exponencial que describe exactamente la caída de temperatura con el tiempo.</p>

      <h3>Modelando Sistemas Complejos</h3>
      <p>En mi tesis doctoral y trabajos de modelación matemática, utilizamos sistemas de ecuaciones diferenciales mucho más complejos para simular fenómenos físicos y biológicos. Las EDO son la lengua materna de la ingeniería, la física y las finanzas cuantitativas. Estudiarlas a fondo te dota de una capacidad inmensa para estructurar, modelar y resolver problemas reales.</p>
    `,
    category: "Ecuaciones Diferenciales",
    date: "2026-04-30",
    readTime: "5 min"
  }
];

// Cabeceras CORS por defecto
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
      rejectUnauthorized: false // Requerido para conexiones seguras en Neon/Postgres
    }
  });
}

// Inicializar la base de datos (Crear tablas y sembrar datos si es necesario)
async function initDatabase(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      category VARCHAR(100) NOT NULL,
      read_time VARCHAR(50),
      date VARCHAR(50) NOT NULL
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS availability (
      day_of_week INT PRIMARY KEY,
      is_active BOOLEAN NOT NULL DEFAULT FALSE,
      start_time VARCHAR(5) NOT NULL DEFAULT '09:00',
      end_time VARCHAR(5) NOT NULL DEFAULT '18:00',
      slot_duration INT NOT NULL DEFAULT 60
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id VARCHAR(50) PRIMARY KEY,
      date VARCHAR(10) NOT NULL,
      time VARCHAR(5) NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      message TEXT,
      status VARCHAR(50) NOT NULL DEFAULT 'pendiente'
    );
  `);

  await client.query(`
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT FALSE;
  `);

  await client.query(`
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS university VARCHAR(255);
  `);

  const res = await client.query("SELECT COUNT(*) FROM posts");
  const count = parseInt(res.rows[0].count, 10);

  if (count === 0) {
    const insertQuery = `
      INSERT INTO posts (id, title, excerpt, content, category, read_time, date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    for (const post of DEFAULT_POSTS) {
      await client.query(insertQuery, [
        post.id,
        post.title,
        post.excerpt,
        post.content,
        post.category,
        post.readTime,
        post.date
      ]);
    }
    console.log("Base de datos sembrada con los artículos iniciales.");
  }

  const availRes = await client.query("SELECT COUNT(*) FROM availability");
  const availCount = parseInt(availRes.rows[0].count, 10);
  if (availCount === 0) {
    const insertAvail = `
      INSERT INTO availability (day_of_week, is_active, start_time, end_time, slot_duration)
      VALUES ($1, $2, $3, $4, $5)
    `;
    for (let i = 0; i < 7; i++) {
      const isActive = i >= 1 && i <= 5; // Activo de Lunes (1) a Viernes (5)
      await client.query(insertAvail, [i, isActive, '09:00', '18:00', 60]);
    }
    console.log("Disponibilidad por defecto sembrada.");
  }
}

// Función para enviar correos usando Nodemailer SMTP
async function sendEmail(to, subject, html) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("SMTP no configurado en variables de entorno. Las variables SMTP_HOST, SMTP_USER, SMTP_PASS no están definidas.");
    console.log(`[SIMULACIÓN SMTP] Para: ${to}\nAsunto: ${subject}\nContenido HTML:\n${html}`);
    return { simulated: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port: parseInt(port, 10),
    secure: parseInt(port, 10) === 465,
    auth: {
      user,
      pass
    }
  });

  const mailOptions = {
    from: `"Álvaro Hernández - ProfeMate" <${user}>`,
    to,
    subject,
    html
  };

  return await transporter.sendMail(mailOptions);
}

// Plantilla HTML para correo de confirmación
function getConfirmationEmailTemplate(name, date, time, subject, university) {
  // Traducir formato de fecha YYYY-MM-DD a un formato en español legible
  let readableDate = date;
  try {
    const parts = date.split('-');
    if (parts.length === 3) {
      const dObj = new Date(parts[0], parts[1] - 1, parts[2]);
      readableDate = dObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }
  } catch (e) {
    console.warn("Error formateando fecha del correo:", e);
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1e293b;">
      <div style="background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%); padding: 25px; border-radius: 6px 6px 0 0; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 700;">¡Consulta Reservada con Éxito!</h1>
      </div>
      <div style="padding: 25px; line-height: 1.6;">
        <p>Hola <strong>${name}</strong>,</p>
        <p>Tu solicitud de reserva para coordinar una sesión de consulta ha sido recibida correctamente en nuestro sistema.</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #6366f1; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0;">
          <h3 style="margin-top: 0; color: #6366f1; font-size: 16px;">Detalles de la Reserva:</h3>
          <p style="margin: 5px 0;"><strong>Asignatura:</strong> ${subject}</p>
          ${university ? `<p style="margin: 5px 0;"><strong>Universidad:</strong> ${university}</p>` : ''}
          <p style="margin: 5px 0;"><strong>Fecha:</strong> ${readableDate}</p>
          <p style="margin: 5px 0;"><strong>Hora:</strong> ${time} hrs</p>
        </div>

        <p>Próximamente me pondré en contacto contigo a través de este correo para coordinar los detalles de pago y enviarte las instrucciones con el enlace de conexión (Zoom/Teams).</p>
        
        <p style="margin-top: 30px; font-size: 13px; color: #64748b;">
          Si tienes alguna duda antes de la consulta, puedes responder directamente a este correo (contacto@alvaroprofemate.cl).
        </p>
      </div>
      <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b; border-radius: 0 0 8px 8px;">
        © 2026 Álvaro Hernández Profemate. Todos los derechos reservados.
      </div>
    </div>
  `;
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

exports.handler = async (event, context) => {
  // Manejar preflight CORS
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
    
    // Auto-migración al inicio
    await initDatabase(client);

    const httpMethod = event.httpMethod;
    const queryParams = event.queryStringParameters || {};
    const id = queryParams.id;
    const type = queryParams.type;

    if (type === "availability") {
      switch (httpMethod) {
        case "GET":
          const res = await client.query("SELECT * FROM availability ORDER BY day_of_week");
          const availability = res.rows.map(row => ({
            dayOfWeek: row.day_of_week,
            isActive: row.is_active,
            startTime: row.start_time,
            endTime: row.end_time,
            slotDuration: row.slot_duration
          }));
          return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify(availability)
          };
        case "POST":
        case "PATCH":
          if (!isAuthorized(event)) {
            return {
              statusCode: 401,
              headers: CORS_HEADERS,
              body: JSON.stringify({ error: "No autorizado" })
            };
          }
          const bodyAvail = JSON.parse(event.body);
          const availList = Array.isArray(bodyAvail) ? bodyAvail : [bodyAvail];
          for (const day of availList) {
            await client.query(
              "UPDATE availability SET is_active = $1, start_time = $2, end_time = $3, slot_duration = $4 WHERE day_of_week = $5",
              [day.isActive, day.startTime, day.endTime, day.slotDuration, day.dayOfWeek]
            );
          }
          return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ success: true, message: "Disponibilidad actualizada" })
          };
        default:
          return {
            statusCode: 405,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: `Método ${httpMethod} no permitido para availability` })
          };
      }
    }

    if (type === "bookings") {
      switch (httpMethod) {
        case "GET":
          const dateParam = queryParams.date;
          let query = "SELECT * FROM bookings ORDER BY date DESC, time DESC";
          let values = [];
          if (dateParam) {
            query = "SELECT * FROM bookings WHERE date = $1 AND status != 'cancelada' ORDER BY time ASC";
            values = [dateParam];
          }
          const res = await client.query(query, values);
          const bookings = res.rows.map(row => ({
            id: row.id,
            date: row.date,
            time: row.time,
            name: row.name,
            email: row.email,
            subject: row.subject,
            message: row.message,
            status: row.status
          }));
          return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify(bookings)
          };
        case "POST":
          const bodyBooking = JSON.parse(event.body);
          const bookingId = bodyBooking.id || Date.now().toString();
          const bookingStatus = bodyBooking.status || 'pendiente';
          const insertQuery = `
            INSERT INTO bookings (id, date, time, name, email, subject, message, status, university)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
          `;
          const insertRes = await client.query(insertQuery, [
            bookingId,
            bodyBooking.date,
            bodyBooking.time,
            bodyBooking.name,
            bodyBooking.email,
            bodyBooking.subject,
            bodyBooking.message || '',
            bookingStatus,
            bodyBooking.university || ''
          ]);
          const inserted = insertRes.rows[0];

          // Enviar correo de confirmación de forma asíncrona
          try {
            const emailHtml = getConfirmationEmailTemplate(inserted.name, inserted.date, inserted.time, inserted.subject, inserted.university);
            await sendEmail(inserted.email, "¡Tu horario de consulta ha sido reservado! - AlvaroProfeMate", emailHtml);
          } catch (emailErr) {
            console.error("Error al enviar el correo de confirmación:", emailErr);
          }

          return {
            statusCode: 201,
            headers: CORS_HEADERS,
            body: JSON.stringify({
              id: inserted.id,
              date: inserted.date,
              time: inserted.time,
              name: inserted.name,
              email: inserted.email,
              subject: inserted.subject,
              message: inserted.message,
              status: inserted.status,
              university: inserted.university
            })
          };
        case "PATCH":
          if (!isAuthorized(event)) {
            return {
              statusCode: 401,
              headers: CORS_HEADERS,
              body: JSON.stringify({ error: "No autorizado" })
            };
          }
          if (!id) {
            return {
              statusCode: 400,
              headers: CORS_HEADERS,
              body: JSON.stringify({ error: "Falta el ID de la reserva" })
            };
          }
          const patchBooking = JSON.parse(event.body);
          const updateRes = await client.query(
            "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
            [patchBooking.status, id]
          );
          if (updateRes.rows.length === 0) {
            return {
              statusCode: 404,
              headers: CORS_HEADERS,
              body: JSON.stringify({ error: "Reserva no encontrada" })
            };
          }
          const updated = updateRes.rows[0];
          return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({
              id: updated.id,
              date: updated.date,
              time: updated.time,
              name: updated.name,
              email: updated.email,
              subject: updated.subject,
              message: updated.message,
              status: updated.status,
              university: updated.university
            })
          };
        case "DELETE":
          if (!isAuthorized(event)) {
            return {
              statusCode: 401,
              headers: CORS_HEADERS,
              body: JSON.stringify({ error: "No autorizado" })
            };
          }
          if (!id) {
            return {
              statusCode: 400,
              headers: CORS_HEADERS,
              body: JSON.stringify({ error: "Falta el ID de la reserva" })
            };
          }
          await client.query("DELETE FROM bookings WHERE id = $1", [id]);
          return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ success: true, message: "Reserva eliminada" })
          };
        default:
          return {
            statusCode: 405,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: `Método ${httpMethod} no permitido para bookings` })
          };
      }
    }
    
    if (type === "contact") {
      if (httpMethod !== "POST") {
        return {
          statusCode: 405,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: "Método no permitido. Use POST." })
        };
      }

      const bodyContact = JSON.parse(event.body);
      const { name, email, university, subject, message } = bodyContact;

      if (!name || !email || !subject || !message) {
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: "Faltan campos obligatorios" })
        };
      }

      const emailHtmlDocente = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1e293b;">
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); padding: 25px; border-radius: 6px 6px 0 0; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Nuevo Mensaje de Contacto</h1>
          </div>
          <div style="padding: 25px; line-height: 1.6;">
            <p>Has recibido un nuevo mensaje desde el formulario de tu sitio web:</p>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0;">
              <p style="margin: 5px 0;"><strong>Nombre:</strong> ${name}</p>
              <p style="margin: 5px 0;"><strong>Correo:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Universidad:</strong> ${university || 'No especificada'}</p>
              <p style="margin: 5px 0;"><strong>Asignatura:</strong> ${subject}</p>
            </div>
            
            <p><strong>Mensaje:</strong></p>
            <p style="background-color: #f1f5f9; padding: 15px; border-radius: 4px; font-style: italic;">${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `;

      const emailHtmlEstudiante = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1e293b;">
          <div style="background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%); padding: 25px; border-radius: 6px 6px 0 0; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">¡Recibimos tu Consulta!</h1>
          </div>
          <div style="padding: 25px; line-height: 1.6;">
            <p>Hola <strong>${name}</strong>,</p>
            <p>He recibido correctamente tu mensaje de consulta sobre <strong>${subject}</strong> desde el sitio web.</p>
            <p>Me pondré en contacto contigo a este correo a la brevedad posible para responder tus dudas y coordinar apoyo.</p>
            <p>¡Gracias por escribir!</p>
            
            <p style="margin-top: 30px; font-size: 13px; color: #64748b;">
              Atentamente,<br>
              <strong>Álvaro Hernández, PhD</strong><br>
              Álvaro Hernández ProfeMate (contacto@alvaroprofemate.cl)
            </p>
          </div>
          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b; border-radius: 0 0 8px 8px;">
            © 2026 Álvaro Hernández Profemate. Todos los derechos reservados.
          </div>
        </div>
      `;

      try {
        const recipient = process.env.SMTP_USER || "contacto@alvaroprofemate.cl";
        await sendEmail(recipient, `[Contacto Web] Mensaje de ${name} - ${subject}`, emailHtmlDocente);
        await sendEmail(email, `Hemos recibido tu consulta: ${subject} - AlvaroProfeMate`, emailHtmlEstudiante);
      } catch (emailErr) {
        console.error("Error al enviar correos de contacto:", emailErr);
      }

      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ success: true, message: "Mensaje procesado con éxito" })
      };
    }

    switch (httpMethod) {
      case "GET":
        if (queryParams.checkAuth === "true") {
          if (isAuthorized(event)) {
            return {
              statusCode: 200,
              headers: CORS_HEADERS,
              body: JSON.stringify({ authorized: true })
            };
          } else {
            return {
              statusCode: 401,
              headers: CORS_HEADERS,
              body: JSON.stringify({ error: "No autorizado" })
            };
          }
        }

        if (id) {
          // Obtener un post por ID
          const res = await client.query("SELECT * FROM posts WHERE id = $1", [id]);
          if (res.rows.length === 0) {
            return {
              statusCode: 404,
              headers: CORS_HEADERS,
              body: JSON.stringify({ error: "Lectura no encontrada" })
            };
          }
          // Mapear read_time a la estructura camelCase del cliente
          const post = res.rows[0];
          return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({
              id: post.id,
              title: post.title,
              excerpt: post.excerpt,
              content: post.content,
              category: post.category,
              readTime: post.read_time,
              date: post.date
            })
          };
        } else {
          // Obtener todos los posts
          const res = await client.query("SELECT * FROM posts ORDER BY date DESC");
          const posts = res.rows.map(post => ({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            category: post.category,
            readTime: post.read_time,
            date: post.date
          }));
          return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify(posts)
          };
        }

      case "POST":
        // Validar token de admin
        if (!isAuthorized(event)) {
          return {
            statusCode: 401,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: "No autorizado. Credenciales inválidas." })
          };
        }

        const bodyPost = JSON.parse(event.body);
        const newId = bodyPost.id || Date.now().toString();
        const newDate = bodyPost.date || new Date().toISOString().split('T')[0];

        const insertQuery = `
          INSERT INTO posts (id, title, excerpt, content, category, read_time, date)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
        `;
        const insertRes = await client.query(insertQuery, [
          newId,
          bodyPost.title,
          bodyPost.excerpt,
          bodyPost.content,
          bodyPost.category,
          bodyPost.readTime || '5 min',
          newDate
        ]);

        const inserted = insertRes.rows[0];
        return {
          statusCode: 201,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            id: inserted.id,
            title: inserted.title,
            excerpt: inserted.excerpt,
            content: inserted.content,
            category: inserted.category,
            readTime: inserted.read_time,
            date: inserted.date
          })
        };

      case "PATCH":
        if (!isAuthorized(event)) {
          return {
            statusCode: 401,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: "No autorizado." })
          };
        }
        if (!id) {
          return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: "Falta el ID del elemento a modificar" })
          };
        }

        const patchPost = JSON.parse(event.body);
        const fields = [];
        const values = [];
        let index = 1;

        if (patchPost.title !== undefined) { fields.push(`title = $${index++}`); values.push(patchPost.title); }
        if (patchPost.excerpt !== undefined) { fields.push(`excerpt = $${index++}`); values.push(patchPost.excerpt); }
        if (patchPost.content !== undefined) { fields.push(`content = $${index++}`); values.push(patchPost.content); }
        if (patchPost.category !== undefined) { fields.push(`category = $${index++}`); values.push(patchPost.category); }
        if (patchPost.readTime !== undefined) { fields.push(`read_time = $${index++}`); values.push(patchPost.readTime); }

        if (fields.length === 0) {
          return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: "No hay campos para actualizar" })
          };
        }

        values.push(id);
        const updateQuery = `UPDATE posts SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
        const updateRes = await client.query(updateQuery, values);
        
        if (updateRes.rows.length === 0) {
          return {
            statusCode: 404,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: "Lectura no encontrada" })
          };
        }

        const updated = updateRes.rows[0];
        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            id: updated.id,
            title: updated.title,
            excerpt: updated.excerpt,
            content: updated.content,
            category: updated.category,
            readTime: updated.read_time,
            date: updated.date
          })
        };

      case "DELETE":
        if (!isAuthorized(event)) {
          return {
            statusCode: 401,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: "No autorizado." })
          };
        }
        if (!id) {
          return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: "Falta el ID del elemento a eliminar" })
          };
        }

        await client.query("DELETE FROM posts WHERE id = $1", [id]);
        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({ success: true, message: "Lectura eliminada exitosamente" })
        };

      default:
        return {
          statusCode: 405,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: `Método ${httpMethod} no permitido` })
        };
    }

  } catch (error) {
    console.error("Error en la ejecución de la función posts:", error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Error interno del servidor", details: error.message })
    };
  } finally {
    if (client) {
      await client.end();
    }
  }
};

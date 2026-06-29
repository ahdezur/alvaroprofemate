const { schedule } = require('@netlify/functions');
const { Client } = require('pg');
const nodemailer = require('nodemailer');

function getPgClient() {
  return new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

async function sendEmail(to, subject, html) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("SMTP no configurado en variables de entorno para reminders.");
    console.log(`[SIMULACIÓN RECORDATORIO SMTP] Para: ${to}\nAsunto: ${subject}\nContenido HTML:\n${html}`);
    return { simulated: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port: parseInt(port, 10),
    secure: parseInt(port, 10) === 465,
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: false
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

function getReminderEmailTemplate(name, date, time, subject) {
  let readableDate = date;
  try {
    const parts = date.split('-');
    if (parts.length === 3) {
      const dObj = new Date(parts[0], parts[1] - 1, parts[2]);
      readableDate = dObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }
  } catch (e) {
    console.warn(e);
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1e293b;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); padding: 25px; border-radius: 6px 6px 0 0; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Recordatorio de Consulta</h1>
      </div>
      <div style="padding: 25px; line-height: 1.6;">
        <p>Hola <strong>${name}</strong>,</p>
        <p>Te escribo para recordarte que tu sesión de consulta personalizada está programada para comenzar en <strong>10 minutos</strong>.</p>
        
        <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0;">
          <h3 style="margin-top: 0; color: #d97706; font-size: 16px;">Detalles de la Reunión:</h3>
          <p style="margin: 5px 0;"><strong>Asignatura:</strong> ${subject}</p>
          <p style="margin: 5px 0;"><strong>Fecha:</strong> ${readableDate}</p>
          <p style="margin: 5px 0;"><strong>Hora de Inicio:</strong> ${time} hrs</p>
        </div>

        <p>Por favor, ten listos tus apuntes, lápiz, y conéctate puntualmente utilizando el enlace (Zoom/Teams) acordado.</p>
        
        <p style="margin-top: 30px; font-size: 13px; color: #64748b;">
          Si tienes algún inconveniente de última hora, contáctame respondiendo directamente a este correo o al número de contacto de Álvaro ProfeMate.
        </p>
      </div>
      <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b; border-radius: 0 0 8px 8px;">
        © 2026 Álvaro Hernández Profemate. Todos los derechos reservados.
      </div>
    </div>
  `;
}

const handler = async (event, context) => {
  console.log("Iniciando cron de recordatorios de agendamiento...");
  
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL no configurada. Saltando verificación de base de datos Postgres.");
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Saltado, DATABASE_URL no definida." })
    };
  }

  const client = getPgClient();
  try {
    await client.connect();
    
    // Obtener fecha actual en formato local Santiago de Chile (America/Santiago)
    const formatterDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit' });
    const todayStr = formatterDate.format(new Date()); // Retorna "YYYY-MM-DD"
    
    // Obtener la hora actual en minutos
    const formatterTime = new Intl.DateTimeFormat('es-CL', { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit', hour12: false });
    const timeStr = formatterTime.format(new Date()); // Retorna "HH:MM"
    const [nowH, nowM] = timeStr.split(':').map(Number);
    const nowInMinutes = nowH * 60 + nowM;

    console.log(`Buscando consultas hoy (${todayStr}) a partir de la hora local actual ${timeStr} (minutos: ${nowInMinutes})`);

    // Consultamos todas las reservas confirmadas del día de hoy que no hayan recibido recordatorio
    const res = await client.query(
      "SELECT * FROM bookings WHERE date = $1 AND status = 'confirmada' AND reminder_sent = FALSE",
      [todayStr]
    );

    const bookingsToRemind = [];
    
    for (const row of res.rows) {
      const [bH, bM] = row.time.split(':').map(Number);
      const bookingInMinutes = bH * 60 + bM;
      
      // Si la consulta empieza en los próximos 15 minutos (y no está en el pasado lejano, ej. margen de -5 mins por si el cron se retrasa)
      const diff = bookingInMinutes - nowInMinutes;
      if (diff >= -5 && diff <= 15) {
        bookingsToRemind.push(row);
      }
    }

    console.log(`Encontradas ${bookingsToRemind.length} consultas por recordar en los próximos 15 minutos.`);

    for (const booking of bookingsToRemind) {
      console.log(`Enviando recordatorio a ${booking.name} (${booking.email}) para la consulta de las ${booking.time}`);
      
      const emailHtml = getReminderEmailTemplate(booking.name, booking.date, booking.time, booking.subject);
      await sendEmail(booking.email, "Recordatorio: Tu consulta comienza en 10 minutos 🚀", emailHtml);
      
      // Marcar recordatorio como enviado en la base de datos
      await client.query("UPDATE bookings SET reminder_sent = TRUE WHERE id = $1", [booking.id]);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, remindedCount: bookingsToRemind.length })
    };

  } catch (error) {
    console.error("Error en cron de recordatorios:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    try {
      await client.end();
    } catch (e) {}
  }
};

exports.handler = schedule("*/10 * * * *", handler);

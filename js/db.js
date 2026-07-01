// Manejo de Datos (Híbrido: LocalStorage / Netlify Postgres API)
// Se conecta a la base de datos central en producción, y usa LocalStorage como fallback local.

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

const DB = {
  _apiAvailable: null,

  // Comprobar dinámicamente si la API Serverless está en ejecución y disponible
  async isApiAvailable() {
    if (this._apiAvailable !== null) return this._apiAvailable;
    
    // Evitar llamadas fetch relativas si la página se abre mediante file://
    if (window.location.protocol === "file:" || window.location.href.startsWith("file:")) {
      this._apiAvailable = false;
      return false;
    }

    try {
      const response = await fetch(CONFIG.API_URL, { method: "GET" });
      // Si retorna 404 significa que la URL no existe (servidor estático sin funciones de Netlify)
      this._apiAvailable = response.status !== 404;
      return this._apiAvailable;
    } catch (error) {
      this._apiAvailable = false;
      return false;
    }
  },

  // Generar cabeceras con autenticación Basic
  _getAuthHeaders(customUser = null, customPass = null) {
    const user = customUser || sessionStorage.getItem("admin_user") || CONFIG.ADMIN_USER;
    const pass = customPass || sessionStorage.getItem("admin_pass") || CONFIG.ADMIN_PASS;
    const base64Creds = btoa(`${user}:${pass}`);
    return {
      "Authorization": `Basic ${base64Creds}`,
      "Content-Type": "application/json"
    };
  },

  // Validar credenciales contra la API o LocalStorage
  async verifyCredentials(username, password) {
    const apiActive = await this.isApiAvailable();
    if (apiActive) {
      try {
        const response = await fetch(`${CONFIG.API_URL}?checkAuth=true`, {
          method: "GET",
          headers: this._getAuthHeaders(username, password)
        });
        return response.status === 200;
      } catch (error) {
        console.error("Error verificando credenciales en la API:", error);
        return false;
      }
    } else {
      // Fallback local
      return username === CONFIG.ADMIN_USER && password === CONFIG.ADMIN_PASS;
    }
  },

  // Obtener todos las lecturas
  async getAllPosts() {
    const apiActive = await this.isApiAvailable();
    if (apiActive) {
      try {
        const response = await fetch(CONFIG.API_URL, { method: "GET" });
        if (!response.ok) throw new Error("Error en API de Netlify");
        return await response.json();
      } catch (error) {
        console.warn("Fallo de conexión a la API, usando LocalStorage:", error);
        return this._getLocalPosts();
      }
    } else {
      return this._getLocalPosts();
    }
  },

  // Obtener una lectura por su ID
  async getPostById(id) {
    const apiActive = await this.isApiAvailable();
    if (apiActive) {
      try {
        const response = await fetch(`${CONFIG.API_URL}?id=${id}`, { method: "GET" });
        if (!response.ok) throw new Error("Error en API de Netlify");
        return await response.json();
      } catch (error) {
        console.warn("Fallo de conexión a la API, usando LocalStorage:", error);
        return this._getLocalPosts().find(p => p.id === id) || null;
      }
    } else {
      return this._getLocalPosts().find(p => p.id === id) || null;
    }
  },

  // Crear una nueva lectura
  async createPost(post) {
    const apiActive = await this.isApiAvailable();
    if (apiActive) {
      try {
        const response = await fetch(CONFIG.API_URL, {
          method: "POST",
          headers: this._getAuthHeaders(),
          body: JSON.stringify(post)
        });
        if (!response.ok) throw new Error("Error creando post en la API");
        return await response.json();
      } catch (error) {
        console.warn("Fallo de conexión a la API, creando en LocalStorage:", error);
        return this._createLocalPost({
          ...post,
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0]
        });
      }
    } else {
      return this._createLocalPost({
        ...post,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0]
      });
    }
  },

  // Actualizar una lectura existente
  async updatePost(id, updatedFields) {
    const apiActive = await this.isApiAvailable();
    if (apiActive) {
      try {
        const response = await fetch(`${CONFIG.API_URL}?id=${id}`, {
          method: "PATCH",
          headers: this._getAuthHeaders(),
          body: JSON.stringify(updatedFields)
        });
        if (!response.ok) throw new Error("Error actualizando post en la API");
        return await response.json();
      } catch (error) {
        console.warn("Fallo de conexión a la API, editando en LocalStorage:", error);
        return this._updateLocalPost(id, updatedFields);
      }
    } else {
      return this._updateLocalPost(id, updatedFields);
    }
  },

  // Eliminar una lectura
  async deletePost(id) {
    const apiActive = await this.isApiAvailable();
    if (apiActive) {
      try {
        const response = await fetch(`${CONFIG.API_URL}?id=${id}`, {
          method: "DELETE",
          headers: this._getAuthHeaders()
        });
        if (!response.ok) throw new Error("Error eliminando post en la API");
        return true;
      } catch (error) {
        console.warn("Fallo de conexión a la API, eliminando en LocalStorage:", error);
        return this._deleteLocalPost(id);
      }
    } else {
      return this._deleteLocalPost(id);
    }
  },

  // --- MÉTODOS PRIVADOS PARA LOCALSTORAGE FALLBACK ---

  _getLocalPosts() {
    let posts = localStorage.getItem("alvaro_profemate_posts");
    if (!posts) {
      localStorage.setItem("alvaro_profemate_posts", JSON.stringify(DEFAULT_POSTS));
      return DEFAULT_POSTS;
    }
    return JSON.parse(posts);
  },

  _createLocalPost(post) {
    const posts = this._getLocalPosts();
    posts.unshift(post);
    localStorage.setItem("alvaro_profemate_posts", JSON.stringify(posts));
    return post;
  },

  _updateLocalPost(id, fields) {
    const posts = this._getLocalPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return null;

    posts[index] = { ...posts[index], ...fields };
    localStorage.setItem("alvaro_profemate_posts", JSON.stringify(posts));
    return posts[index];
  },

  _deleteLocalPost(id) {
    const posts = this._getLocalPosts();
    const filtered = posts.filter(p => p.id !== id);
    localStorage.setItem("alvaro_profemate_posts", JSON.stringify(filtered));
    return true;
  },

  // --- MÉTODOS DE DISPONIBILIDAD ---
  async getAvailability() {
    const apiActive = await this.isApiAvailable();
    if (apiActive) {
      try {
        const response = await fetch(`${CONFIG.API_URL}?type=availability`, { method: "GET" });
        if (!response.ok) throw new Error("Error en API al obtener disponibilidad");
        return await response.json();
      } catch (error) {
        console.warn("Fallo de conexión a la API, usando LocalStorage para disponibilidad:", error);
        return this._getLocalAvailability();
      }
    } else {
      return this._getLocalAvailability();
    }
  },

  async updateAvailability(availabilityData) {
    const apiActive = await this.isApiAvailable();
    if (apiActive) {
      try {
        const response = await fetch(`${CONFIG.API_URL}?type=availability`, {
          method: "POST",
          headers: this._getAuthHeaders(),
          body: JSON.stringify(availabilityData)
        });
        if (!response.ok) throw new Error("Error en API al actualizar disponibilidad");
        return await response.json();
      } catch (error) {
        console.warn("Fallo de conexión a la API, usando LocalStorage para disponibilidad:", error);
        return this._updateLocalAvailability(availabilityData);
      }
    } else {
      return this._updateLocalAvailability(availabilityData);
    }
  },

  // --- MÉTODOS DE RESERVAS (BOOKINGS) ---
  async getBookings(dateParam = null) {
    const apiActive = await this.isApiAvailable();
    let url = `${CONFIG.API_URL}?type=bookings`;
    if (dateParam) {
      url += `&date=${dateParam}`;
    }
    if (apiActive) {
      try {
        const response = await fetch(url, { method: "GET" });
        if (!response.ok) throw new Error("Error en API al obtener reservas");
        return await response.json();
      } catch (error) {
        console.warn("Fallo de conexión a la API, usando LocalStorage para reservas:", error);
        return this._getLocalBookings(dateParam);
      }
    } else {
      return this._getLocalBookings(dateParam);
    }
  },

  async createBooking(bookingData) {
    const apiActive = await this.isApiAvailable();
    const newBooking = {
      ...bookingData,
      id: bookingData.id || Date.now().toString(),
      status: bookingData.status || "pendiente"
    };
    if (apiActive) {
      try {
        const response = await fetch(`${CONFIG.API_URL}?type=bookings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newBooking)
        });
        if (!response.ok) throw new Error("Error en API al guardar reserva");
        return await response.json();
      } catch (error) {
        console.warn("Fallo de conexión a la API, guardando reserva en LocalStorage:", error);
        return this._createLocalBooking(newBooking);
      }
    } else {
      return this._createLocalBooking(newBooking);
    }
  },

  async updateBookingStatus(id, status) {
    const apiActive = await this.isApiAvailable();
    if (apiActive) {
      try {
        const response = await fetch(`${CONFIG.API_URL}?type=bookings&id=${id}`, {
          method: "PATCH",
          headers: this._getAuthHeaders(),
          body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error("Error en API al actualizar reserva");
        return await response.json();
      } catch (error) {
        console.warn("Fallo de conexión a la API, actualizando reserva en LocalStorage:", error);
        return this._updateLocalBookingStatus(id, status);
      }
    } else {
      return this._updateLocalBookingStatus(id, status);
    }
  },

  async deleteBooking(id) {
    const apiActive = await this.isApiAvailable();
    if (apiActive) {
      try {
        const response = await fetch(`${CONFIG.API_URL}?type=bookings&id=${id}`, {
          method: "DELETE",
          headers: this._getAuthHeaders()
        });
        if (!response.ok) throw new Error("Error en API al eliminar reserva");
        return await response.json();
      } catch (error) {
        console.warn("Fallo de conexión a la API, eliminando reserva en LocalStorage:", error);
        return this._deleteLocalBooking(id);
      }
    } else {
      return this._deleteLocalBooking(id);
    }
  },

  // --- MÉTODOS PRIVADOS LOCALSTORAGE ---
  _getLocalAvailability() {
    let avail = localStorage.getItem("alvaro_profemate_availability");
    if (!avail) {
      const defaultAvail = [
        { dayOfWeek: 0, isActive: false, startTime: '09:00', endTime: '13:00', slotDuration: 60, isActive2: false, startTime2: '14:00', endTime2: '18:00' },
        { dayOfWeek: 1, isActive: true, startTime: '09:00', endTime: '13:00', slotDuration: 60, isActive2: true, startTime2: '14:00', endTime2: '18:00' },
        { dayOfWeek: 2, isActive: true, startTime: '09:00', endTime: '13:00', slotDuration: 60, isActive2: true, startTime2: '14:00', endTime2: '18:00' },
        { dayOfWeek: 3, isActive: true, startTime: '09:00', endTime: '13:00', slotDuration: 60, isActive2: true, startTime2: '14:00', endTime2: '18:00' },
        { dayOfWeek: 4, isActive: true, startTime: '09:00', endTime: '13:00', slotDuration: 60, isActive2: true, startTime2: '14:00', endTime2: '18:00' },
        { dayOfWeek: 5, isActive: true, startTime: '09:00', endTime: '13:00', slotDuration: 60, isActive2: true, startTime2: '14:00', endTime2: '18:00' },
        { dayOfWeek: 6, isActive: false, startTime: '09:00', endTime: '13:00', slotDuration: 60, isActive2: false, startTime2: '14:00', endTime2: '18:00' }
      ];
      localStorage.setItem("alvaro_profemate_availability", JSON.stringify(defaultAvail));
      return defaultAvail;
    }
    return JSON.parse(avail);
  },

  _updateLocalAvailability(data) {
    const list = Array.isArray(data) ? data : [data];
    const current = this._getLocalAvailability();
    for (const item of list) {
      const idx = current.findIndex(d => d.dayOfWeek === item.dayOfWeek);
      if (idx !== -1) {
        current[idx] = { ...current[idx], ...item };
      }
    }
    localStorage.setItem("alvaro_profemate_availability", JSON.stringify(current));
    return current;
  },

  _getLocalBookings(dateParam = null) {
    let bookings = localStorage.getItem("alvaro_profemate_bookings");
    if (!bookings) {
      localStorage.setItem("alvaro_profemate_bookings", JSON.stringify([]));
      return [];
    }
    const list = JSON.parse(bookings);
    if (dateParam) {
      return list.filter(b => b.date === dateParam && b.status !== 'cancelada').sort((a, b) => a.time.localeCompare(b.time));
    }
    return list.sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
  },

  _createLocalBooking(booking) {
    const list = this._getLocalBookings();
    const newBooking = { ...booking, reminder_sent: false, reminderSent: false };
    list.push(newBooking);
    localStorage.setItem("alvaro_profemate_bookings", JSON.stringify(list));
    
    console.log("%c[SIMULACIÓN CORREO - CONFIRMACIÓN ALUMNO]", "background: #6366f1; color: white; padding: 3px 6px; border-radius: 3px; font-weight: bold;");
    console.log(`Para: ${newBooking.email}\nAsunto: ¡Tu clase ha sido reservada! - AlvaroProfeMate\nDetalles: Estudiante: ${newBooking.name}, Asignatura: ${newBooking.subject}, Fecha: ${newBooking.date}, Hora: ${newBooking.time} hrs`);
    
    console.log("%c[SIMULACIÓN CORREO - AVISO PROFESOR]", "background: #4f46e5; color: white; padding: 3px 6px; border-radius: 3px; font-weight: bold;");
    console.log(`Para: contacto@alvaroprofemate.cl\nAsunto: Nueva Solicitud de Consulta: ${newBooking.name} (${newBooking.subject})\nDetalles: Estudiante: ${newBooking.name}, Universidad: ${newBooking.university || 'No especificada'}, Asignatura: ${newBooking.subject}, Fecha: ${newBooking.date}, Hora: ${newBooking.time} hrs`);
    
    return newBooking;
  },

  _updateLocalBookingStatus(id, status) {
    const list = this._getLocalBookings();
    const idx = list.findIndex(b => b.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      localStorage.setItem("alvaro_profemate_bookings", JSON.stringify(list));
      return list[idx];
    }
    return null;
  },

  _deleteLocalBooking(id) {
    const list = this._getLocalBookings();
    const filtered = list.filter(b => b.id !== id);
    localStorage.setItem("alvaro_profemate_bookings", JSON.stringify(filtered));
    return true;
  },

  // --- MÉTODOS DE CURSOS ---
  async getCourses() {
    this._seedLocalCourses();
    const apiActive = await this.isApiAvailable();
    if (apiActive) {
      try {
        const response = await fetch(`${CONFIG.API_URL.replace('posts', 'courses')}`, { method: "GET" });
        if (!response.ok) throw new Error("Error en API al obtener cursos");
        return await response.json();
      } catch (error) {
        console.warn("Fallo de conexión a la API, usando LocalStorage:", error);
        return JSON.parse(localStorage.getItem("alvaro_profemate_courses") || "[]");
      }
    } else {
      return JSON.parse(localStorage.getItem("alvaro_profemate_courses") || "[]");
    }
  },

  async getCourseStructure(courseId) {
    this._seedLocalCourses();
    const apiActive = await this.isApiAvailable();
    if (apiActive) {
      try {
        const response = await fetch(`${CONFIG.API_URL.replace('posts', 'courses')}?courseId=${courseId}`, { method: "GET" });
        if (!response.ok) throw new Error("Error en API al obtener estructura del curso");
        return await response.json();
      } catch (error) {
        console.warn("Fallo de conexión a la API, usando LocalStorage:", error);
        return this._getLocalCourseStructure(courseId);
      }
    } else {
      return this._getLocalCourseStructure(courseId);
    }
  },

  async getChapterContent(courseId, chapterIndex) {
    this._seedLocalCourses();
    const apiActive = await this.isApiAvailable();
    if (apiActive) {
      try {
        const response = await fetch(`${CONFIG.API_URL.replace('posts', 'courses')}?courseId=${courseId}&chapterIndex=${chapterIndex}`, { method: "GET" });
        if (!response.ok) throw new Error("Error en API al obtener contenido del capítulo");
        return await response.json();
      } catch (error) {
        console.warn("Fallo de conexión a la API, usando LocalStorage:", error);
        return this._getLocalChapterContent(courseId, chapterIndex);
      }
    } else {
      return this._getLocalChapterContent(courseId, chapterIndex);
    }
  },

  async saveCourse(course) {
    this._seedLocalCourses();
    const apiActive = await this.isApiAvailable();
    if (apiActive) {
      try {
        const token = sessionStorage.getItem("admin_token") || "";
        const response = await fetch(`${CONFIG.API_URL.replace('posts', 'courses')}?type=course`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${token}`
          },
          body: JSON.stringify(course)
        });
        if (!response.ok) throw new Error("Error al guardar curso en API");
        return await response.json();
      } catch (error) {
        console.warn("Fallo en API, usando LocalStorage:", error);
        return this._saveLocalCourse(course);
      }
    } else {
      return this._saveLocalCourse(course);
    }
  },

  async saveUnit(unit) {
    this._seedLocalCourses();
    const apiActive = await this.isApiAvailable();
    if (apiActive) {
      try {
        const token = sessionStorage.getItem("admin_token") || "";
        const response = await fetch(`${CONFIG.API_URL.replace('posts', 'courses')}?type=unit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${token}`
          },
          body: JSON.stringify(unit)
        });
        if (!response.ok) throw new Error("Error al guardar unidad en API");
        return await response.json();
      } catch (error) {
        console.warn("Fallo en API, usando LocalStorage:", error);
        return this._saveLocalUnit(unit);
      }
    } else {
      return this._saveLocalUnit(unit);
    }
  },

  async saveChapter(chapter) {
    this._seedLocalCourses();
    const apiActive = await this.isApiAvailable();
    if (apiActive) {
      try {
        const token = sessionStorage.getItem("admin_token") || "";
        const response = await fetch(`${CONFIG.API_URL.replace('posts', 'courses')}?type=chapter`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${token}`
          },
          body: JSON.stringify(chapter)
        });
        if (!response.ok) throw new Error("Error al guardar capítulo en API");
        return await response.json();
      } catch (error) {
        console.warn("Fallo en API, usando LocalStorage:", error);
        return this._saveLocalChapter(chapter);
      }
    } else {
      return this._saveLocalChapter(chapter);
    }
  },

  async deleteCourse(courseId) {
    const apiActive = await this.isApiAvailable();
    if (apiActive) {
      try {
        const token = sessionStorage.getItem("admin_token") || "";
        const response = await fetch(`${CONFIG.API_URL.replace('posts', 'courses')}?type=course&id=${courseId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Basic ${token}`
          }
        });
        if (!response.ok) throw new Error("Error al eliminar curso");
        return await response.json();
      } catch (error) {
        console.warn("Error en API, usando LocalStorage:", error);
        return this._deleteLocalCourse(courseId);
      }
    } else {
      return this._deleteLocalCourse(courseId);
    }
  },

  async deleteUnit(unitId) {
    const apiActive = await this.isApiAvailable();
    if (apiActive) {
      try {
        const token = sessionStorage.getItem("admin_token") || "";
        const response = await fetch(`${CONFIG.API_URL.replace('posts', 'courses')}?type=unit&id=${unitId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Basic ${token}`
          }
        });
        if (!response.ok) throw new Error("Error al eliminar unidad");
        return await response.json();
      } catch (error) {
        console.warn("Error en API, usando LocalStorage:", error);
        return this._deleteLocalUnit(unitId);
      }
    } else {
      return this._deleteLocalUnit(unitId);
    }
  },

  async deleteChapter(chapterId) {
    const apiActive = await this.isApiAvailable();
    if (apiActive) {
      try {
        const token = sessionStorage.getItem("admin_token") || "";
        const response = await fetch(`${CONFIG.API_URL.replace('posts', 'courses')}?type=chapter&id=${chapterId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Basic ${token}`
          }
        });
        if (!response.ok) throw new Error("Error al eliminar capítulo");
        return await response.json();
      } catch (error) {
        console.warn("Error en API, usando LocalStorage:", error);
        return this._deleteLocalChapter(chapterId);
      }
    } else {
      return this._deleteLocalChapter(chapterId);
    }
  },

  _getLocalCourseStructure(courseId) {
    const courses = JSON.parse(localStorage.getItem("alvaro_profemate_courses") || "[]");
    const units = JSON.parse(localStorage.getItem("alvaro_profemate_units") || "[]");
    const chapters = JSON.parse(localStorage.getItem("alvaro_profemate_chapters") || "[]");

    const course = courses.find(c => c.id === courseId);
    if (!course) return { error: "Curso no encontrado" };

    const courseUnits = units
      .filter(u => u.courseId === courseId || u.course_id === courseId)
      .sort((a, b) => (a.unitIndex || 0) - (b.unitIndex || 0));

    const structuredUnits = courseUnits.map(u => {
      const unitChapters = chapters
        .filter(ch => ch.unitId === u.id || ch.unit_id === u.id)
        .sort((a, b) => parseFloat(a.chapterIndex) - parseFloat(b.chapterIndex));
      return { ...u, chapters: unitChapters };
    });

    return { course, units: structuredUnits };
  },

  _getLocalChapterContent(courseId, chapterIndex) {
    const struct = this._getLocalCourseStructure(courseId);
    if (struct.error) return struct;

    for (const u of struct.units) {
      const ch = u.chapters.find(c => c.chapterIndex === chapterIndex);
      if (ch) return ch;
    }
    return { error: "Capítulo no encontrado" };
  },

  _saveLocalCourse(course) {
    const list = JSON.parse(localStorage.getItem("alvaro_profemate_courses") || "[]");
    const idx = list.findIndex(c => c.id === course.id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...course };
    } else {
      list.push(course);
    }
    localStorage.setItem("alvaro_profemate_courses", JSON.stringify(list));
    return { success: true };
  },

  _saveLocalUnit(unit) {
    const list = JSON.parse(localStorage.getItem("alvaro_profemate_units") || "[]");
    if (unit.id) {
      const idx = list.findIndex(u => u.id === unit.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...unit };
      }
    } else {
      unit.id = Date.now();
      list.push(unit);
    }
    localStorage.setItem("alvaro_profemate_units", JSON.stringify(list));
    return { success: true, id: unit.id };
  },

  _saveLocalChapter(chapter) {
    const list = JSON.parse(localStorage.getItem("alvaro_profemate_chapters") || "[]");
    if (chapter.id) {
      const idx = list.findIndex(c => c.id === chapter.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...chapter };
      }
    } else {
      chapter.id = Date.now();
      list.push(chapter);
    }
    localStorage.setItem("alvaro_profemate_chapters", JSON.stringify(list));
    return { success: true, id: chapter.id };
  },

  _deleteLocalCourse(courseId) {
    const list = JSON.parse(localStorage.getItem("alvaro_profemate_courses") || "[]");
    const filtered = list.filter(c => c.id !== courseId);
    localStorage.setItem("alvaro_profemate_courses", JSON.stringify(filtered));
    return { success: true };
  },

  _deleteLocalUnit(unitId) {
    const list = JSON.parse(localStorage.getItem("alvaro_profemate_units") || "[]");
    const filtered = list.filter(u => u.id !== unitId);
    localStorage.setItem("alvaro_profemate_units", JSON.stringify(filtered));
    return { success: true };
  },

  _deleteLocalChapter(chapterId) {
    const list = JSON.parse(localStorage.getItem("alvaro_profemate_chapters") || "[]");
    const filtered = list.filter(c => c.id !== chapterId);
    localStorage.setItem("alvaro_profemate_chapters", JSON.stringify(filtered));
    return { success: true };
  },

  _seedLocalCourses() {
    let courses = localStorage.getItem("alvaro_profemate_courses");
    let units = localStorage.getItem("alvaro_profemate_units");
    let chapters = localStorage.getItem("alvaro_profemate_chapters");

    // Si ya existe calculo-multivariable y Series de Potencias, no re-sembramos para no sobreescribir datos
    if (courses && courses.includes("calculo-multivariable") && chapters && chapters.includes("Series de Potencias")) {
      return;
    }

    console.log("Sembrando base de datos LocalStorage de cursos...");

    const defaultCourses = [
      { id: 'introduccion-calculo', title: 'Introducción al Cálculo', description: 'Conceptos de precálculo, funciones, ecuaciones, desigualdades y fundamentos matemáticos.', icon: 'fa-calculator' },
      { id: 'introduccion-algebra', title: 'Introducción al Álgebra', description: 'Fundamentos de álgebra, polinomios, sistemas de ecuaciones lineales y operaciones algebraicas básicas.', icon: 'fa-arrow-up-right-dots' },
      { id: 'calculo-diferencial', title: 'Cálculo Diferencial', description: 'Límites, continuidad, derivadas y sus aplicaciones prácticas en optimización y tasas de cambio.', icon: 'fa-calculator' },
      { id: 'calculo-integral', title: 'Cálculo Integral', description: 'La integral definida, técnicas de integración, áreas, volúmenes de revolución e integrales impropias.', icon: 'fa-calculator' },
      { id: 'algebra-lineal', title: 'Álgebra Lineal', description: 'Matrices, determinantes, sistemas lineales, espacios vectoriales, transformaciones y valores propios.', icon: 'fa-border-all' },
      { id: 'calculo-multivariable', title: 'Calculo Multivariable', description: 'Cálculo en varias variables: límites, derivadas parciales, integrales dobles y triples, y teoremas vectoriales.', icon: 'fa-layer-group' },
      { id: 'ecuaciones-diferenciales', title: 'Ecuaciones Diferenciales Ordinarias', description: 'EDO de primer y segundo orden, transformada de Laplace, sistemas lineales y modelación matemática.', icon: 'fa-bezier-curve' },
      { id: 'calculo-avanzado', title: 'Cálculo Avanzado', description: 'Series de Fourier, variables complejas, funciones analíticas e integración en el plano complejo.', icon: 'fa-infinity' }
    ];

    let unitIdCounter = 1;
    let chapterIdCounter = 1;

    const defaultUnits = [];
    const defaultChapters = [];

    // Seeding logic for calculo-multivariable with visual/interactive templates
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

        <div class="caja-ram caja-pregunta-guia">
          <div class="caja-ram-icon">💡</div>
          <div class="caja-ram-body">
            <div class="caja-ram-title">Pregunta guía</div>
            <p style="font-style: italic; font-weight: 500;">
              ¿Cómo podemos definir formalmente la cercanía entre dos puntos en el espacio tridimensional y de qué forma se extiende la idea del intervalo de tolerancia de una variable?
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

        <!-- Caja de Teorema -->
        <div class="caja-ram caja-teorema">
          <div class="caja-ram-icon">🧠</div>
          <div class="caja-ram-body">
            <div class="caja-ram-title">Teorema: Existencia del Límite Multivariable</div>
            <p>
              El límite de una función $f(x,y)$ cuando $(x,y) \\to (a,b)$ existe y es igual a $L$ si y sólo si para cualquier trayectoria continua que pase por $(a,b)$, el límite unidimensional a lo largo de dicha trayectoria es siempre $L$.
            </p>
          </div>
        </div>

        <p>
          El **Dominio** ($D$) es el conjunto de partida de la función. En una variable, el dominio se representa en una recta numérica. En cambio, para una función $f(x,y)$, el dominio es una <strong>región geométrica</strong> (sombreada, abierta, cerrada o acotada) en el plano de dos dimensiones $XY$.
        </p>

        <!-- Caja de Propiedades -->
        <div class="caja-ram caja-propiedades">
          <div class="caja-ram-icon">📋</div>
          <div class="caja-ram-body">
            <div class="caja-ram-title">Propiedades de Límites Multivariables</div>
            <p>
              Si $\\lim_{(x,y)\\to(a,b)} f(x,y) = L$ y $\\lim_{(x,y)\\to(a,b)} g(x,y) = M$, entonces:
              <ul style="margin-left: 20px; margin-top: 5px;">
                <li>Suma: $\\lim (f(x,y) + g(x,y)) = L + M$</li>
                <li>Producto: $\\lim (f(x,y) \\cdot g(x,y)) = L \\cdot M$</li>
              </ul>
            </p>
          </div>
        </div>

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
            <button class="opcion-btn" data-correct="false" data-explicacion="Incorrecto. La desigualdad estricta $x^2 + y^2 < 9$ representa un disco abierto (sin incluir la frontera). Dado que la raíz cuadrada admite el valor cero, los puntos de la frontera ($x^2 + y^2 = 9$) sí forman parte del dominio.">
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

      <!-- Caja de Error Común -->
      <div class="caja-ram error-comun" style="margin-top: 24px;">
        <div class="caja-ram-icon">🚨</div>
        <div class="caja-ram-body">
          <div class="caja-ram-title">Error Común: Probar trayectorias finitas</div>
          <p>
            Evaluar el límite por rectas del tipo $y = mx$ o parábolas $y = kx^2$ y obtener el mismo valor <strong>no demuestra</strong> que el límite existe. Existen funciones con comportamientos patológicos donde el límite es diferente por trayectorias no polinomiales.
          </p>
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
          \\( (x-h)^2 = 4p(y-k) \\)
        </div>
        <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
          Vértice en $(h,k)$ y distancia focal $p$.
        </p>
      </div>
    `;

    // Populate units
    defaultCourses.forEach(c => {
      if (c.id === 'calculo-multivariable') {
        const u1Id = unitIdCounter++;
        const u2Id = unitIdCounter++;

        defaultUnits.push(
          { id: u1Id, courseId: c.id, unitIndex: 1, title: 'Funciones Multivariables y Geometría', isLocked: false },
          { id: u2Id, courseId: c.id, unitIndex: 2, title: 'Cálculo Diferencial Vectorial', isLocked: true }
        );

        // Cap 1.0
        defaultChapters.push({
          id: chapterIdCounter++,
          unitId: u1Id,
          chapterIndex: '1.0',
          title: 'Geometría Analítica del Espacio',
          isCompleted: true,
          isLocked: false,
          contentMotivation: '<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación geométrica</div><p>Para entender las funciones de varias variables, primero debemos dominar las tres dimensiones espaciales y cómo representamos planos, cilindros y esferas.</p></div></div>',
          contentTheory: '<h3>Conceptos de R3</h3><p>Definimos el espacio tridimensional R3 como el conjunto de todas las ternas ordenadas (x,y,z) de números reales.</p>',
          contentApplication: '<h3>Aplicaciones</h3><p>Modelado de piezas en CAD/CAM e ingeniería aeronáutica.</p>',
          contentExercises: JSON.stringify([{ title: "Distancia en R3", level: "nivel-1", statement: "Calcule la distancia entre los puntos A(1, 2, 3) y B(4, 6, 8).", solution: "Distancia d = \\sqrt{3^2 + 4^2 + 5^2} = \\sqrt{50} = 5\\sqrt{2}." }]),
          contentFormulas: JSON.stringify([{ title: "Distancia Espacial", latex: "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}", description: "Fórmula de la distancia euclidiana en el espacio tridimensional." }])
        });

        // Cap 1.1
        defaultChapters.push({
          id: chapterIdCounter++,
          unitId: u1Id,
          chapterIndex: '1.1',
          title: 'Campos Escalares y Topografía',
          isCompleted: false,
          isLocked: false,
          contentMotivation: cap11Motivation,
          contentTheory: cap11Theory,
          contentApplication: cap11Application,
          contentExercises: cap11Exercises,
          contentFormulas: cap11Formulas
        });

        // Cap 1.2
        defaultChapters.push({
          id: chapterIdCounter++,
          unitId: u1Id,
          chapterIndex: '1.2',
          title: 'Límites y Continuidad en 3D',
          isCompleted: false,
          isLocked: true,
          contentMotivation: '<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación</div><p>¿Qué significa acercarse a un punto en 2D? A diferencia de una sola variable (donde solo te acercas por izquierda y derecha), en dos variables hay infinitas trayectorias de aproximación.</p></div></div>',
          contentTheory: '<h3>Definición formal del límite</h3><p>Decimos que el límite de f(x,y) cuando (x,y) tiende a (a,b) es L si para todo &epsilon; > 0 existe &delta; > 0 tal que...</p>',
          contentApplication: '<h3>Aplicaciones</h3><p>Cálculo de tensiones continuas en puentes y estructuras de soporte.</p>',
          contentExercises: JSON.stringify([{ title: "Inexistencia de Límite", level: "nivel-2", statement: "Demuestre que el límite no existe evaluando por diferentes parábolas.", solution: "Evalúe sobre las trayectorias y = mx^2 y compare los límites obtenidos." }]),
          contentFormulas: JSON.stringify([{ title: "Límite Multivariable", latex: "\\lim_{(x,y)\\to(a,b)} f(x,y) = L", description: "Límite formal en R2." }])
        });
      } else if (c.id === 'calculo-diferencial') {
        const u1Id = unitIdCounter++;
        const u2Id = unitIdCounter++;

        defaultUnits.push(
          { id: u1Id, courseId: c.id, unitIndex: 1, title: 'Fundamentos y Conceptos Básicos', isLocked: false },
          { id: u2Id, courseId: c.id, unitIndex: 2, title: 'Aplicaciones y Métodos Avanzados', isLocked: false }
        );

        // Cap 1.1
        defaultChapters.push({
          id: chapterIdCounter++,
          unitId: u1Id,
          chapterIndex: '1.1',
          title: 'Introducción y Definición Primaria',
          isCompleted: false,
          isLocked: false,
          contentMotivation: `<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación de ${c.title}</div><p>Este capítulo introduce las bases conceptuales indispensables para comprender la asignatura de ${c.title}.</p></div></div>`,
          contentTheory: `<h3>Bases Teóricas de ${c.title}</h3><p>Definiciones fundamentales y terminología general del área.</p>`,
          contentApplication: '<h3>Campos de Aplicación</h3><p>Ejemplos reales en física, ingeniería o ciencias sociales.</p>',
          contentExercises: JSON.stringify([
            {
              title: "Ejercicio de Introducción",
              level: "nivel-1",
              statement: `Resuelva el problema básico planteado para evaluar su comprensión en ${c.title}.`,
              solution: "<strong>Pauta:</strong> Desarrolle paso a paso aplicando la definición inicial."
            }
          ]),
          contentFormulas: JSON.stringify([
            {
              title: "Fórmula de Partida",
              latex: "y = f(x)",
              description: "Ecuación básica de definición de variables."
            }
          ])
        });

        // Cap 1.2
        defaultChapters.push({
          id: chapterIdCounter++,
          unitId: u1Id,
          chapterIndex: '1.2',
          title: 'Propiedades Fundamentales',
          isCompleted: false,
          isLocked: false,
          contentMotivation: `<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación y propiedades</div><p>Aquí analizaremos cómo interactúan los conceptos primarios para construir el cuerpo de la asignatura.</p></div></div>`,
          contentTheory: '<h3>Propiedades Matemáticas</h3><p>Lista de postulados y teoremas principales del tema.</p>',
          contentApplication: '<h3>Casos de Estudio</h3><p>Resolución práctica de problemas típicos de certamen.</p>',
          contentExercises: JSON.stringify([
            {
              title: "Aplicación de Propiedades",
              level: "nivel-2",
              statement: "Demuestre la validez de la relación fundamental utilizando las propiedades listadas.",
              solution: "<strong>Solución:</strong> Desarrolle aplicando el álgebra correspondiente."
            }
          ]),
          contentFormulas: JSON.stringify([
            {
              title: "Identidad Fundamental",
              latex: "\\cos^2(x) + \\sin^2(x) = 1",
              description: "Propiedad trigonométrica de gran utilidad."
            }
          ])
        });

        // Cap 2.1
        defaultChapters.push({
          id: chapterIdCounter++,
          unitId: u2Id,
          chapterIndex: '2.1',
          title: 'Derivación y Razones de Cambio',
          isCompleted: false,
          isLocked: false,
          contentMotivation: '<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación</div><p>Analizaremos cómo calcular pendientes de tangentes instantáneas.</p></div></div>',
          contentTheory: '<h3>Derivación Básica</h3><p>Definiciones de derivadas clásicas.</p>',
          contentApplication: '<h3>Casos de Estudio</h3><p>Resolución de problemas de derivadas.</p>',
          contentExercises: JSON.stringify([{ title: "Cálculo de Derivada", level: "nivel-1", statement: "Derive f(x) = x^3 + 2x.", solution: "f\'(x) = 3x^2 + 2." }]),
          contentFormulas: JSON.stringify([{ title: "Regla de la Potencia", latex: "(x^n)\' = n x^{n-1}", description: "Derivada de potencias básicas." }])
        });

        // Cap 2.2
        defaultChapters.push({
          id: chapterIdCounter++,
          unitId: u2Id,
          chapterIndex: '2.2',
          title: 'Optimización y Extremos locales',
          isCompleted: false,
          isLocked: false,
          contentMotivation: '<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación</div><p>Aprenderemos a maximizar ganancias y minimizar costos usando derivadas.</p></div></div>',
          contentTheory: '<h3>Optimización</h3><p>Teorema del primer y segundo criterio de derivadas.</p>',
          contentApplication: '<h3>Casos de Estudio</h3><p>Problemas clásicos de cajas, áreas y volúmenes máximos.</p>',
          contentExercises: JSON.stringify([{ title: "Caja de Volumen Máximo", level: "nivel-2", statement: "Optimice el área de un terreno rectangular con 100m de cerca.", solution: "Dimensiones óptimas son 25m x 25m." }]),
          contentFormulas: JSON.stringify([{ title: "Criterio de Primera Derivada", latex: "f\'(c) = 0", description: "Encontrar puntos críticos." }])
        });

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

        defaultChapters.push({
          id: chapterIdCounter++,
          unitId: u2Id,
          chapterIndex: '2.3',
          title: 'Series de Potencias',
          isCompleted: false,
          isLocked: false,
          contentMotivation: capPotMotivation,
          contentTheory: capPotTheory,
          contentApplication: capPotApplication,
          contentExercises: capPotExercises,
          contentFormulas: capPotFormulas
        });
      } else {
        const u1Id = unitIdCounter++;
        const u2Id = unitIdCounter++;

        defaultUnits.push(
          { id: u1Id, courseId: c.id, unitIndex: 1, title: 'Fundamentos y Conceptos Básicos', isLocked: false },
          { id: u2Id, courseId: c.id, unitIndex: 2, title: 'Aplicaciones y Métodos Avanzados', isLocked: false }
        );

        // Cap 1.1
        defaultChapters.push({
          id: chapterIdCounter++,
          unitId: u1Id,
          chapterIndex: '1.1',
          title: 'Introducción y Definición Primaria',
          isCompleted: false,
          isLocked: false,
          contentMotivation: `<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación de ${c.title}</div><p>Este capítulo introduce las bases conceptuales indispensables para comprender la asignatura de ${c.title}.</p></div></div>`,
          contentTheory: `<h3>Bases Teóricas de ${c.title}</h3><p>Definiciones fundamentales y terminología general del área.</p>`,
          contentApplication: '<h3>Campos de Aplicación</h3><p>Ejemplos reales en física, ingeniería o ciencias sociales.</p>',
          contentExercises: JSON.stringify([
            {
              title: "Ejercicio de Introducción",
              level: "nivel-1",
              statement: `Resuelva el problema básico planteado para evaluar su comprensión en ${c.title}.`,
              solution: "<strong>Pauta:</strong> Desarrolle paso a paso aplicando la definición inicial."
            }
          ]),
          contentFormulas: JSON.stringify([
            {
              title: "Fórmula de Partida",
              latex: "y = f(x)",
              description: "Ecuación básica de definición de variables."
            }
          ])
        });

        // Cap 1.2
        defaultChapters.push({
          id: chapterIdCounter++,
          unitId: u1Id,
          chapterIndex: '1.2',
          title: 'Propiedades Fundamentales',
          isCompleted: false,
          isLocked: false,
          contentMotivation: `<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación y propiedades</div><p>Aquí analizaremos cómo interactúan los conceptos primarios para construir el cuerpo de la asignatura.</p></div></div>`,
          contentTheory: '<h3>Propiedades Matemáticas</h3><p>Lista de postulados y teoremas principales del tema.</p>',
          contentApplication: '<h3>Casos de Estudio</h3><p>Resolución práctica de problemas típicos de certamen.</p>',
          contentExercises: JSON.stringify([
            {
              title: "Aplicación de Propiedades",
              level: "nivel-2",
              statement: "Demuestre la validez de la relación fundamental utilizando las propiedades listadas.",
              solution: "<strong>Solución:</strong> Desarrolle aplicando el álgebra correspondiente."
            }
          ]),
          contentFormulas: JSON.stringify([
            {
              title: "Identidad Fundamental",
              latex: "\\cos^2(x) + \\sin^2(x) = 1",
              description: "Propiedad trigonométrica de gran utilidad."
            }
          ])
        });
      }
    });

    localStorage.setItem("alvaro_profemate_courses", JSON.stringify(defaultCourses));
    localStorage.setItem("alvaro_profemate_units", JSON.stringify(defaultUnits));
    localStorage.setItem("alvaro_profemate_chapters", JSON.stringify(defaultChapters));
  }
};

window.DB = DB;

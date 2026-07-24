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

    let dbVersion = localStorage.getItem("alvaro_profemate_db_version");
    if (dbVersion === "15.0" && courses && courses.includes("calculo-multivariable") && chapters && chapters.includes("Determinación de Dominio con Múltiples Restricciones")) {
      return;
    }
    localStorage.setItem("alvaro_profemate_db_version", "15.0");

    console.log("Sembrando base de datos LocalStorage de cursos...");

    const defaultCourses = [
      { id: 'introduccion-calculo', title: 'Introducción al Cálculo', description: 'Conceptos de precálculo, funciones, ecuaciones, desigualdades y fundamentos matemáticos.', icon: 'fa-calculator' },
      { id: 'introduccion-algebra', title: 'Introducción al Álgebra', description: 'Fundamentos de álgebra, polinomios, sistemas de ecuaciones lineales y operaciones algebraicas básicas.', icon: 'fa-arrow-up-right-dots' },
      { id: 'calculo-diferencial', title: 'Cálculo Diferencial', description: 'Límites, continuidad, derivadas y sus aplicaciones prácticas en optimización y tasas de cambio.', icon: 'fa-calculator' },
      { id: 'calculo-integral', title: 'Cálculo Integral', description: 'La integral definida, técnicas de integración, áreas, volúmenes de revolución e integrales impropias.', icon: 'fa-calculator' },
      { id: 'algebra-lineal', title: 'Álgebra Lineal', description: 'Matrices, determinantes, sistemas lineales, espacios vectoriales, transformaciones y valores propios.', icon: 'fa-border-all' },
      { id: 'calculo-multivariable', title: 'Cálculo Multivariable', description: 'Cálculo en varias variables: límites, derivadas parciales, integrales dobles y triples, y teoremas vectoriales.', icon: 'fa-layer-group' },
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
    
    <div class="caja-ram caja-choque-cognitivo" style="margin-bottom: 20px;">
      <div class="caja-ram-title"><i class="fa-solid fa-triangle-exclamation"></i> Choque Cognitivo: La dificultad de la tercera dimensión</div>
      <div class="caja-ram-body">
        <p>Graficar funciones en tres dimensiones a mano alzada es sumamente difícil e impreciso. Intentar plasmar la superficie completa de una montaña sobre papel plano resulta frustrante.</p>
        <p>¿Cómo resuelven los topógrafos y cartógrafos esta limitación? <strong>"Aplastando la montaña"</strong>. En lugar de dibujar el relieve tridimensional, proyectan cortes horizontales de altura constante $f(x,y) = k$. A esto lo llamamos <strong>Curvas de Nivel</strong>.</p>
      </div>
    </div>

    <!-- ACTIVIDAD DE PRUEBA: TÉRMINOS PAREADOS DE 3 COLUMNAS -->
    <div class="quiz-block quiz-pareados-3col" style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 24px; border-radius: 12px; margin: 25px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <h3 style="margin-top:0; color: var(--accent-color); font-size: 1.2rem; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-network-wired"></i> Actividad de Prueba: Términos Pareados (3 Columnas)
      </h3>
      <p style="color: var(--text-secondary); margin-bottom: 20px; font-size: 14px;">
        Relaciona cada función matemática de la <strong>Columna 1</strong> con su geometría de dominio en la <strong>Columna 2</strong> y el tipo de superficie o recorrido en la <strong>Columna 3</strong>.
      </p>

      <!-- PRESENTACIÓN DE COLUMNAS -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 24px;">
        
        <!-- COLUMNA 1 -->
        <div style="background: var(--bg-primary); padding: 14px; border-radius: 8px; border: 1px solid var(--border-color);">
          <div style="margin-bottom: 12px;">
            <span style="background: #2563eb; color: white; padding: 4px 10px; border-radius: 20px; font-weight: 600; font-size: 12px;">Columna 1: Funciones</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; border: 1px solid var(--border-color);">
              <span style="background: #2563eb; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">1</span>
              <span style="font-size: 14px;">$f(x,y) = \\sqrt{4 - x^2 - y^2}$</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; border: 1px solid var(--border-color);">
              <span style="background: #2563eb; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">2</span>
              <span style="font-size: 14px;">$f(x,y) = \\ln(y - x^2)$</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; border: 1px solid var(--border-color);">
              <span style="background: #2563eb; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">3</span>
              <span style="font-size: 14px;">$f(x,y) = x^2 + y^2$</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; border: 1px solid var(--border-color);">
              <span style="background: #2563eb; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">4</span>
              <span style="font-size: 14px;">$f(x,y) = \\frac{1}{x^2 + y^2}$</span>
            </div>
          </div>
        </div>

        <!-- COLUMNA 2 -->
        <div style="background: var(--bg-primary); padding: 14px; border-radius: 8px; border: 1px solid var(--border-color);">
          <div style="margin-bottom: 12px;">
            <span style="background: #10b981; color: white; padding: 4px 10px; border-radius: 20px; font-weight: 600; font-size: 12px;">Columna 2: Dominios</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; border: 1px solid var(--border-color);">
              <span style="background: #10b981; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">A</span>
              <span style="font-size: 13px;">Puntos sobre parábola $y > x^2$</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; border: 1px solid var(--border-color);">
              <span style="background: #10b981; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">B</span>
              <span style="font-size: 13px;">Plano $\\mathbb{R}^2 \\setminus \\{(0,0)\\}$</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; border: 1px solid var(--border-color);">
              <span style="background: #10b981; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">C</span>
              <span style="font-size: 13px;">Disco cerrado $x^2 + y^2 \\le 4$</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; border: 1px solid var(--border-color);">
              <span style="background: #10b981; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">D</span>
              <span style="font-size: 13px;">Plano $\\mathbb{R}^2$ completo</span>
            </div>
          </div>
        </div>

        <!-- COLUMNA 3 -->
        <div style="background: var(--bg-primary); padding: 14px; border-radius: 8px; border: 1px solid var(--border-color);">
          <div style="margin-bottom: 12px;">
            <span style="background: #8b5cf6; color: white; padding: 4px 10px; border-radius: 20px; font-weight: 600; font-size: 12px;">Columna 3: Superficies</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; border: 1px solid var(--border-color);">
              <span style="background: #8b5cf6; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">I</span>
              <span style="font-size: 13px;">Paraboloide circular ($\\text{Im} \\ge 0$)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; border: 1px solid var(--border-color);">
              <span style="background: #8b5cf6; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">II</span>
              <span style="font-size: 13px;">Hemisferio ($\\text{Im} = [0,2]$)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; border: 1px solid var(--border-color);">
              <span style="background: #8b5cf6; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">III</span>
              <span style="font-size: 13px;">Superficie asintótica ($\\text{Im} > 0$)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; border: 1px solid var(--border-color);">
              <span style="background: #8b5cf6; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">IV</span>
              <span style="font-size: 13px;">Superficie logarítmica ($\\text{Im} = \\mathbb{R}$)</span>
            </div>
          </div>
        </div>

      </div>

      <!-- PANEL DE SELECCIÓN E INTERACTIVIDAD -->
      <div style="background: var(--bg-primary); padding: 18px; border-radius: 10px; border: 1px solid var(--border-color);">
        <h4 style="margin-top:0; margin-bottom: 14px; font-size: 15px; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-sliders"></i> Panel de Selección: Asocia cada Ítem de la Columna 1
        </h4>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <!-- FILA ÍTEM 1 -->
          <div class="pareo-row-item" data-num="1" data-correct-letter="C" data-correct-roman="II" data-feedback="¡Correcto! El interior de la raíz exige $4 - x^2 - y^2 \\ge 0 \\implies x^2 + y^2 \\le 4$ (disco de radio 2). Su gráfico es una semiesfera de radio 2 con alturas entre 0 y 2." style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;">
            <span style="font-weight: bold; width: 70px;">Ítem 1:</span>
            <span style="font-size: 13px; color: var(--text-muted);">Letra:</span>
            <select class="pareo-select-col2" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;">
              <option value="">-- Elegir --</option>
              <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
            </select>
            <span style="font-size: 13px; color: var(--text-muted); margin-left: 8px;">Romano:</span>
            <select class="pareo-select-col3" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;">
              <option value="">-- Elegir --</option>
              <option value="I">I</option><option value="II">II</option><option value="III">III</option><option value="IV">IV</option>
            </select>
          </div>

          <!-- FILA ÍTEM 2 -->
          <div class="pareo-row-item" data-num="2" data-correct-letter="A" data-correct-roman="IV" data-feedback="¡Excelente! El logaritmo requiere argumento positivo $y - x^2 > 0 \\implies y > x^2$. Al no estar acotada, la imagen cubre todo el conjunto real $\\mathbb{R}$." style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;">
            <span style="font-weight: bold; width: 70px;">Ítem 2:</span>
            <span style="font-size: 13px; color: var(--text-muted);">Letra:</span>
            <select class="pareo-select-col2" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;">
              <option value="">-- Elegir --</option>
              <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
            </select>
            <span style="font-size: 13px; color: var(--text-muted); margin-left: 8px;">Romano:</span>
            <select class="pareo-select-col3" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;">
              <option value="">-- Elegir --</option>
              <option value="I">I</option><option value="II">II</option><option value="III">III</option><option value="IV">IV</option>
            </select>
          </div>

          <!-- FILA ÍTEM 3 -->
          <div class="pareo-row-item" data-num="3" data-correct-letter="D" data-correct-roman="I" data-feedback="¡Muy bien! $x^2 + y^2$ está definida en todo el plano real $\\mathbb{R}^2$ sin restricciones. Su gráfica es un paraboloide circular cuya altura va desde 0 hasta $+\\infty$." style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;">
            <span style="font-weight: bold; width: 70px;">Ítem 3:</span>
            <span style="font-size: 13px; color: var(--text-muted);">Letra:</span>
            <select class="pareo-select-col2" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;">
              <option value="">-- Elegir --</option>
              <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
            </select>
            <span style="font-size: 13px; color: var(--text-muted); margin-left: 8px;">Romano:</span>
            <select class="pareo-select-col3" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;">
              <option value="">-- Elegir --</option>
              <option value="I">I</option><option value="II">II</option><option value="III">III</option><option value="IV">IV</option>
            </select>
          </div>

          <!-- FILA ÍTEM 4 -->
          <div class="pareo-row-item" data-num="4" data-correct-letter="B" data-correct-roman="III" data-feedback="¡Perfecto! La fracción solo falla cuando el denominador es 0 (origen $(0,0)$). Como los cuadrados son estrictamente positivos fuera del origen, la función nunca es 0 ni negativa." style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;">
            <span style="font-weight: bold; width: 70px;">Ítem 4:</span>
            <span style="font-size: 13px; color: var(--text-muted);">Letra:</span>
            <select class="pareo-select-col2" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;">
              <option value="">-- Elegir --</option>
              <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
            </select>
            <span style="font-size: 13px; color: var(--text-muted); margin-left: 8px;">Romano:</span>
            <select class="pareo-select-col3" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;">
              <option value="">-- Elegir --</option>
              <option value="I">I</option><option value="II">II</option><option value="III">III</option><option value="IV">IV</option>
            </select>
          </div>
        </div>

        <button type="button" class="btn btn-verify-pareados" onclick="verifyQuizPareados3Col(this)" style="margin-top: 16px; padding: 10px 22px; background: var(--accent-color); color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-circle-check"></i> Verificar Asociaciones
        </button>

        <div class="quiz-feedback" style="display:none; margin-top:16px; padding:14px; border-radius:8px;"></div>
      </div>
    </div>
  </section>
`;

    const cap11Exercises = "[\n  {\n    \"id\": \"ex-1784739116294-9ks8\",\n    \"title\": \"Determinación de Dominio con Múltiples Restricciones\",\n    \"level\": \"nivel-2\",\n    \"statement\": \"<p>Determine analíticamente y describa geométricamente el dominio natural del campo escalar dado por la expresión:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$f(x,y) = \\\\frac{\\\\sqrt{9 - x^2 - y^2}}{\\\\ln(y - x)}$$</div></p>\",\n    \"solution\": \"<p>Para que la función entregue un valor real bien definido, debemos plantear y resolver simultáneamente tres restricciones algebraicas:</p>\\n<p><strong>Restricción 1 (Raíz cuadrada):</strong> El radicando del numerador no puede ser negativo:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ 9 - x^2 - y^2 \\\\geq 0 \\\\implies x^2 + y^2 \\\\leq 9 $$</div>       Geométricamente, esto representa un disco cerrado de radio $3$ centrado en el origen $(0,0)$.</p>\\n<p><strong>Restricción 2 (Logaritmo natural):</strong> El argumento del logaritmo en el denominador debe ser estrictamente positivo:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ y - x > 0 \\\\implies y > x $$</div>       Esto corresponde al semiplano abierto ubicado estrictamente por encima de la recta identidad $y = x$.</p>\\n<p><strong>Restricción 3 (Denominador no nulo):</strong> El denominador completo no puede anularse:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\ln(y - x) \\\\neq 0 \\\\implies y - x \\\\neq e^0 \\\\implies y - x \\\\neq 1 \\\\implies y \\\\neq x + 1 $$</div>       Esto significa que debemos excluir todos los puntos que pertenecen a la recta transladada $y = x + 1$.</p>\\n<p><strong>Conclusión y Descripción del Dominio:</strong>       El dominio natural del campo escalar es la intersección de estas tres regiones:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\text{Dom}(f) = \\\\left\\\\{ (x,y) \\\\in \\\\mathbb{R}^2 \\\\;\\\\middle|\\\\; x^2 + y^2 \\\\leq 9 \\\\;\\\\land\\\\; y > x \\\\;\\\\land\\\\; y \\\\neq x + 1 \\\\right\\\\} $$</div>       Geométricamente, corresponde a la mitad superior-izquierda del círculo de radio 3 (cortado por la recta $y=x$), excluyendo los puntos de la frontera sobre dicha recta y quitando completamente el segmento de la recta $y = x + 1$ que cruza por dentro de la figura.</p>\"\n  },\n  {\n    \"id\": \"ex-1784739116299-23o2\",\n    \"title\": \"Invarianza por Simetría Radial\",\n    \"level\": \"nivel-3\",\n    \"statement\": \"<p>Un campo escalar $f: \\\\mathbb{R}^2 \\\\to \\\\mathbb{R}$ posee <em>simetría radial</em> si su valor depende únicamente de la distancia del punto al origen. Es decir, si existe una función de una variable $g: [0, \\\\infty) \\\\to \\\\mathbb{R}$ tal que $f(x,y) = g(\\\\sqrt{x^2+y^2})$.</p>\\n<p>Demuestre rigurosamente que el campo escalar $f(x,y) = \\\\ln(1 + x^2 + y^2)$ posee simetría radial, determine explícitamente la función $g(t)$ asociada, y pruebe analíticamente que la imagen del campo es $\\\\text{Im}(f) = [0, \\\\infty)$.</p>\",\n    \"solution\": \"<p><strong>Parte 1: Demostración de Simetría Radial</strong>       Definamos la variable $t = \\\\sqrt{x^2 + y^2}$, la cual representa la distancia euclidiana de cualquier punto $(x,y)$ al origen $(0,0)$. Dado que las variables están en los números reales, al elevar al cuadrado obtenemos $t^2 = x^2 + y^2$.</p>\\n<p>Sustituyendo directamente en la regla de correspondencia de nuestro campo escalar:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ f(x,y) = \\\\ln(1 + (x^2 + y^2)) = \\\\ln(1 + t^2) $$</div>       Como la expresión resultante depende única y exclusivamente del parámetro de distancia $t$, queda demostrado que $f$ posee simetría radial. La función unidimensional asociada es:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ g(t) = \\\\ln(1 + t^2) \\\\quad \\\\text{con } t \\\\in [0, \\\\infty) $$</div></p>\\n<p><strong>Parte 2: Determinación Rigurosa de la Imagen</strong>       Para hallar la imagen, analizamos el comportamiento de $g(t)$ en su dominio restringido $[0, \\\\infty)$:       <ol style=\\\"margin: 8px 0; padding-left: 20px;\\\">\\n        <li>Dado que $t \\\\geq 0$, entonces $t^2 \\\\geq 0$, lo que implica que $1 + t^2 \\\\geq 1$.\\n        </li><li>Aplicando la función logaritmo natural (que es estrictamente creciente en todo su dominio) a la desigualdad anterior, obtenemos:\\n        <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\ln(1 + t^2) \\\\geq \\\\ln(1) \\\\implies g(t) \\\\geq 0 $$</div>\\n        </li><li>El valor mínimo absoluto es $0$ y se alcanza únicamente en $t=0$ (es decir, en el origen $f(0,0) = 0$).\\n        </li><li>Como $\\\\lim_{t \\\\to \\\\infty} \\\\ln(1 + t^2) = \\\\infty$ y la función es continua, por el Teorema del Valor Intermedio el recorrido toma todos los valores intermedios.\\n      </li></ol>       Por lo tanto, la imagen del campo escalar es, formalmente, $\\\\text{Im}(f) = [0, \\\\infty)$.</p>\"\n  },\n  {\n    \"id\": \"ex-1784739116300-aa3m\",\n    \"title\": \"Restricciones Hiperbólicas en el Plano\",\n    \"level\": \"nivel-2\",\n    \"statement\": \"<p>Considere el campo escalar definido por la regla de correspondencia:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ h(x,y) = \\\\ln(x \\\\cdot y - 1) $$</div>       Determine su dominio natural y describa las fronteras que delimitan esta región matemática en el plano cartesiano.</p>\",\n    \"solution\": \"<p><strong>Pista metodológica:</strong> La restricción del logaritmo exige que el producto de las variables cumpla $x \\\\cdot y > 1$. Analiza este comportamiento separando el análisis para cuando $x > 0$ y cuando $x < 0$. Recuerda que la frontera matemática está dada por las dos ramas de la hipérbola equilátera $y = \\\\frac{1}{x}$, y que el dominio consta de dos regiones disjuntas en el primer y tercer cuadrante.</p>\"\n  },\n  {\n    \"id\": \"ex-1784739116301-3s2o\",\n    \"title\": \"Restricción Logarítmica e Hiperbólica\",\n    \"level\": \"nivel-2\",\n    \"statement\": \"<p>Determine analíticamente el dominio natural y la imagen del campo escalar dado por la expresión:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ f(x,y) = \\\\ln(x^2 - y^2) $$</div>       Describa cualitativamente la geometría de la región del plano obtenida.</p>\",\n    \"solution\": \"<p><strong>Dominio:</strong> El argumento del logaritmo debe ser estrictamente positivo ($x^2 - y^2 > 0$). Esto equivale a $x^2 > y^2 \\\\implies |x| > |y|$. Geométricamente, representa el interior de los dos conos abiertos opuestos que contienen al eje $X$, delimitados por las rectas asíntotas $y = x$ e $y = -x$ (sin incluir las rectas). \\\\\\\\       <strong>Imagen:</strong> Como la expresión $x^2 - y^2$ puede tomar cualquier valor dentro del intervalo $(0, \\\\infty)$ bajo las condiciones del dominio, el logaritmo natural recorre todo su espectro. Por lo tanto, $\\\\text{Im}(f) = \\\\mathbb{R}$.</p>\"\n  },\n  {\n    \"id\": \"ex-1784739116301-7shp\",\n    \"title\": \"Regiones Cónicas y Fronteras Cerradas\",\n    \"level\": \"nivel-2\",\n    \"statement\": \"<p>Considere el campo escalar:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ f(x,y) = \\\\sqrt{-x^2 + y^2} $$</div>       Halle analíticamente su dominio natural e imagen, y establezca la diferencia geométrica respecto al ejercicio anterior.</p>\",\n    \"solution\": \"<p><strong>Dominio:</strong> El radicando exige que $y^2 - x^2 \\\\geq 0 \\\\implies y^2 \\\\geq x^2$, lo cual se traduce en la desigualdad de valores absolutos $|y| \\\\geq |x|$. Geométricamente, esto corresponde a las regiones (superior e inferior) que contienen al eje $Y$. A diferencia del problema anterior, esta región es <em>cerrada</em>, lo que significa que sí incluye a las rectas fronteras $y = x$ e $y = -x$. \\\\\\\\       <strong>Imagen:</strong> Al tratarse de una raíz cuadrada estándar cuyo radicando puede crecer indefinidamente conforme nos alejamos en el eje $Y$, el conjunto imagen corresponde a los reales no negativos: $\\\\text{Im}(f) = [0, \\\\infty)$.</p>\"\n  },\n  {\n    \"id\": \"ex-1784739116301-2xhz\",\n    \"title\": \"Periodicidad y Acotación Multivariable\",\n    \"level\": \"nivel-1\",\n    \"statement\": \"<p>Para el campo escalar definido por la regla de correspondencia:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ f(x,y) = \\\\sin(x+y) $$</div>       Determine su dominio natural y su conjunto imagen.</p>\",\n    \"solution\": \"<p><strong>Dominio:</strong> La función trigonométrica seno no impone ninguna restricción matemática sobre el comportamiento de sus argumentos, por lo que su dominio natural es todo el plano bidimensional, $\\\\text{Dom}(f) = \\\\mathbb{R}^2$. \\\\\\\\       <strong>Imagen:</strong> Dado que la combinación lineal $x+y$ puede tomar cualquier valor real en el intervalo $(-\\\\infty, \\\\infty)$, y sabiendo que la función seno oscila de forma periódica, la imagen queda confinada de manera idéntica al caso unidimensional: $\\\\text{Im}(f) = [-1, 1]$.</p>\"\n  },\n  {\n    \"id\": \"ex-1784739116301-gajc\",\n    \"title\": \"Fronteras Parabólicas en el Plano\",\n    \"level\": \"nivel-2\",\n    \"statement\": \"<p>Determine analíticamente el dominio natural y el conjunto imagen de la función:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ f(x,y) = \\\\sqrt{x^2 - y} $$</div></p>\",\n    \"solution\": \"<p><strong>Dominio:</strong> La restricción de la raíz cuadrada de índice par exige que $x^2 - y \\\\geq 0$, lo que equivale analíticamente a la inecuación $y \\\\leq x^2$. En el plano cartesiano, esto representa geométricamente a todos los puntos que se encuentran sobre y por debajo de la parábola estándar $y = x^2$. \\\\\\\\       <strong>Imagen:</strong> Debido a que la raíz cuadrada entrega exclusivamente valores no negativos y la diferencia $x^2 - y$ puede ser arbitrariamente grande (por ejemplo, fijando $x=0$ y haciendo que $y \\\\to -\\\\infty$), la imagen es $\\\\text{Im}(f) = [0, \\\\infty)$.</p>\"\n  }\n]";

    const cap11Formulas = "[\n  {\n    \"id\": \"form-1784740884171-fbrd\",\n    \"title\": \"Dominio de un Campo Escalar\",\n    \"latex\": \"\\\\text{Dom}(f) = \\\\{ (x,y) \\\\in \\\\mathbb{R}^2 \\\\mid f(x,y) \\\\in \\\\mathbb{R} \\\\}\",\n    \"description\": \"El conjunto de todos los puntos en el plano para los cuales la regla de correspondencia de la función produce un valor real bien definido.\"\n  },\n  {\n    \"id\": \"form-1784740884171-dxr5\",\n    \"title\": \"Imagen o Recorrido\",\n    \"latex\": \"\\\\text{Im}(f) = \\\\{ z \\\\in \\\\mathbb{R} \\\\mid z = f(x,y) \\\\text{ para algún } (x,y) \\\\in \\\\text{Dom}(f) \\\\}\",\n    \"description\": \"El conjunto de todos los valores numéricos (alturas, temperaturas, presiones) que la función efectivamente toma en el eje Z.\"\n  },\n  {\n    \"id\": \"form-1784740884171-7lgn\",\n    \"title\": \"Restricciones de Dominio\",\n    \"latex\": \"\\\\begin{aligned}\\n      \\\\text{Fracción: } \\\\frac{1}{g} &\\\\implies g \\\\neq 0 \\\\\\\\[0.5em]\\n      \\\\text{Logaritmo: } \\\\ln(g) &\\\\implies g > 0 \\\\\\\\[0.5em]\\n      \\\\text{Raíz Par: } \\\\sqrt{g} &\\\\implies g \\\\geq 0\\n    \\\\end{aligned}\",\n    \"description\": \"Condiciones algebraicas obligatorias e indispensables para plantear el dominio natural: se debe recordar repasar hacia abajo las restricciones analíticas de denominadores no nulos, argumentos estrictamente positivos y radicandos no negativos.\"\n  },\n  {\n    \"id\": \"form-1784740884171-yd2i\",\n    \"title\": \"Imágenes Elementales\",\n    \"latex\": \"\\\\begin{aligned}\\n      \\\\text{Im}(e^u) &= (0, \\\\infty) \\\\\\\\[0.5em]\\n      \\\\text{Im}(\\\\ln(u)) &= \\\\mathbb{R} \\\\\\\\[0.5em]\\n      \\\\text{Im}(\\\\sqrt{u}) &= [0, \\\\infty)\\n    \\\\end{aligned}\",\n    \"description\": \"Comportamiento analítico y recorridos canónicos verticales de las funciones base de una variable. Recordar de memoria estos intervalos es clave para construir la imagen final de campos escalares complejos.\"\n  },\n  {\n    \"id\": \"form-1784740884171-qjco\",\n    \"title\": \"Frontera Circular Típica\",\n    \"latex\": \"x^2 + y^2 = r^2\",\n    \"description\": \"Ecuación de la circunferencia de radio $r$ centrada en el origen, la cual suele aparecer como la frontera geométrica al despejar restricciones de raíces o logaritmos radiales.\"\n  }\n]";

    // Populate units
    defaultCourses.forEach(c => {
      if (c.id === 'calculo-multivariable') {
        const u1Id = unitIdCounter++;
        const u2Id = unitIdCounter++;

        defaultUnits.push(
          { id: u1Id, courseId: c.id, unitIndex: 1, title: 'Funciones de Varias Variables', isLocked: false },
          { id: u2Id, courseId: c.id, unitIndex: 2, title: 'Continuidad', isLocked: false }
        );

        defaultChapters.push({
          id: chapterIdCounter++,
          unitId: u1Id,
          chapterIndex: '1.1',
          title: 'Campos Escalares',
          isCompleted: false,
          isLocked: false,
          contentMotivation: "<p><strong>¿Cómo modelamos el espacio?</strong></p>\n<p>Imagina que estás en tu habitación en este instante. Si quisiéramos registrar la temperatura en cada rincón, no nos basta con un único número. La temperatura varía si te acercas a la ventana, si subes al techo o si te sientas en el suelo.</p>\n<p>Para describir esto matemáticamente, debemos asignar a cada coordenada espacial $(x, y, z)$ un único valor térmico $T$. Así, la temperatura es una función $T(x,y,z)$.</p>\n<p><strong>Concepto clave:</strong> Un campo escalar es simplemente una regla que le asigna un único número real (temperatura, presión, altitud, densidad) a cada punto del espacio.</p>\n<div class=\"caja-ram caja-motivacion\"><div class=\"caja-ram-title\">💡 Pregunta Guía</div><div class=\"caja-ram-body\"><p>¿Cómo cambia el cálculo cuando una función depende de más de una variable?</p></div></div>",
          contentTheory: "<p>Para transitar del cálculo en una variable al cálculo multivariable, debemos formalizar matemáticamente la noción de asignar valores numéricos a puntos en el espacio. A continuación, estableceremos los pilares algebraicos de los campos escalares.</p>\n<div class=\"caja-ram caja-definicion\"><div class=\"caja-ram-title\"><i class=\"fa-solid fa-book-bookmark\"></i> Definición: Campo Escalar</div><div class=\"caja-ram-body\"><p>Un <strong>campo escalar</strong> (o función de varias variables) es una función $f$ que asigna a cada elemento o punto $\\vec{x} = (x_1, x_2, \\dots, x_n)$ de un subconjunto $D \\subseteq \\mathbb{R}^n$ un único número real denotado por $f(\\vec{x})$ o $f(x_1, x_2, \\dots, x_n)$.</p>\n<p>Matemáticamente lo expresamos como:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ f \\colon D \\subseteq \\mathbb{R}^n \\to \\mathbb{R} $$</div>     Donde $n$ representa la dimensión del espacio de entrada (habitualmente $n=2$ o $n=3$).</p></div></div>\n<div class=\"caja-ram caja-definicion\"><div class=\"caja-ram-title\"><i class=\"fa-solid fa-book-bookmark\"></i> Definición: Dominio de un Campo Escalar</div><div class=\"caja-ram-body\"><p>El <strong>dominio</strong> de un campo escalar $f$, denotado por $\\operatorname{dom}(f)$, es el conjunto de todos los puntos en $\\mathbb{R}^n$ para los cuales la regla de correspondencia de la función produce un número real bien definido.</p>\n<p>Formalmente se define como:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\operatorname{dom}(f) = \\{ \\vec{x} \\in \\mathbb{R}^n \\colon f(\\vec{x}) \\in \\mathbb{R} \\} $$</div>     Si el dominio no se especifica explícitamente, se asume que es el <em>dominio natural</em>, es decir, el conjunto más grande posible de puntos donde la expresión matemática es válida.</p></div></div>\n<div class=\"caja-ram error-comun\"><div class=\"caja-ram-title\"><i class=\"fa-solid fa-triangle-exclamation\"></i> Visualización del Dominio</div><div class=\"caja-ram-body\"><p>¡Cuidado con la geometría! A diferencia de Cálculo I donde el dominio es un intervalo o unión de intervalos en la recta real ($\\mathbb{R}$), en Cálculo Multivariable el dominio es una <strong>región geométrica</strong> en el plano XY ($\\mathbb{R}^2$), en el espacio XYZ ($\\mathbb{R}^3$) o en hiperespacios de mayor dimensión.</p></div></div>\n<div class=\"caja-ram caja-definicion\"><div class=\"caja-ram-title\"><i class=\"fa-solid fa-book-bookmark\"></i> Definición: Imagen o Recorrido</div><div class=\"caja-ram-body\"><p>La <strong>imagen</strong> (o recorrido) de un campo escalar $f$, denotada por $\\operatorname{im}(f)$ o $\\text{Rec}(f)$, es el conjunto de todos los valores reales que la función efectivamente toma a medida que evaluamos todos los puntos pertenecientes al dominio.</p>\n<p>Formalmente se define como:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\operatorname{im}(f) = \\{ y \\in \\mathbb{R} \\colon y = f(\\vec{x}) \\text{ para algún } \\vec{x} \\in \\operatorname{dom}(f) \\} $$</div></p></div></div>\n<div class=\"caja-ram caja-motivacion\"><div class=\"caja-ram-title\"><i class=\"fa-solid fa-gears\"></i> Restricciones Clásicas de Dominio</div><div class=\"caja-ram-body\"><p>Para determinar analíticamente el dominio natural de un campo escalar, debes buscar y plantear las mismas restricciones algebraicas que conoces de funciones reales: <ul style=\"margin: 8px 0; padding-left: 20px;\">\n      <li>Denominadores: Deben ser distintos de cero ($g(\\vec{x}) \\neq 0$).\n      </li><li>Raíces de índice par: El radicando debe ser no negativo ($g(\\vec{x}) \\geq 0$).\n      </li><li>Logaritmos: El argumento debe ser estrictamente positivo ($g(\\vec{x}) > 0$).\n    </li></ul>     La resolución de estas inecuaciones vectoriales definirá las fronteras de tu región matemática en el espacio.</p></div></div>",
          contentApplication: "<p>Ahora que entendemos qué es un campo escalar y su dominio, veamos cómo se comporta esto en la práctica con una función de dos variables y pongamos a prueba tus habilidades de análisis geométrico.</p>\n<div class=\"caja-ram caja-definicion\"><div class=\"caja-ram-title\">💡 Ejemplo: Evaluando un Campo Escalar y su Dominio</div><div class=\"caja-ram-body\"><p>Consideremos el campo escalar dado por la función:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ f(x,y) = \\sqrt{9 - x^2 - y^2} $$</div></p>\n<p><strong>1. Evaluando un punto:</strong>     Si evaluamos la función en las coordenadas $(1, 2)$, obtenemos:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ f(1,2) = \\sqrt{9 - (1)^2 - (2)^2} = \\sqrt{9 - 1 - 4} = \\sqrt{4} = 2 $$</div>     Esto significa que en el punto $(1,2)$ del plano, nuestro campo escalar (que podría representar, por ejemplo, la altura de una superficie o domo hemisférico) tiene un valor de 2.</p>\n<p><strong>2. Determinando el Dominio natural:</strong>     Siguiendo nuestra trampa cognitiva sobre las restricciones, sabemos que el interior de una raíz cuadrada de índice par debe ser mayor o igual a cero:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ 9 - x^2 - y^2 \\geq 0 \\implies x^2 + y^2 \\leq 9 $$</div>     Por lo tanto, el dominio de $f$ es el conjunto de todos los puntos $(x,y)$ geométricamente ubicados dentro y sobre la frontera de una circunferencia de radio 3 centrada en el origen. ¡Cualquier punto fuera de ese círculo anulará nuestra función en los números reales!</p></div></div>\n\n      <div class=\"quiz-block quiz-alternativas\" style=\"margin:24px 0; padding:20px; background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px;\">\n        <h4 style=\"margin:0 0 12px 0; font-size:16px; color:var(--text-primary);\"><i class=\"fa-solid fa-circle-question\" style=\"color:var(--accent-color);\"></i> Dominio con Logaritmos</h4>\n        <p style=\"font-size:14px; color:var(--text-secondary); margin-bottom:12px;\">¿Cuál es el dominio natural del campo escalar $f(x,y) = \\ln(y - x^2)$?</p>\n        <div class=\"quiz-options\">\n        <label class=\"quiz-option\" data-correct=\"true\" data-feedback=\"¡Excelente! El argumento de un logaritmo natural debe ser estrictamente positivo. Geométricamente, esto representa todos los puntos estrictamente por encima de la parábola $y = x^2$.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"radio\" name=\"quiz-alt-1784912129552-a3xm\" value=\"1\" data-correct=\"true\" data-feedback=\"¡Excelente! El argumento de un logaritmo natural debe ser estrictamente positivo. Geométricamente, esto representa todos los puntos estrictamente por encima de la parábola $y = x^2$.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">Todos los puntos $(x,y)$ tales que $y > x^2$.</span>\n        </label>\n      \n        <label class=\"quiz-option\" data-correct=\"false\" data-feedback=\"¡Cuidado! El logaritmo natural no está definido para el valor cero. La desigualdad debe ser estricta.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"radio\" name=\"quiz-alt-1784912129552-a3xm\" value=\"0\" data-correct=\"false\" data-feedback=\"¡Cuidado! El logaritmo natural no está definido para el valor cero. La desigualdad debe ser estricta.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">Todos los puntos $(x,y)$ tales que $y \\geq x^2$.</span>\n        </label>\n      \n        <label class=\"quiz-option\" data-correct=\"false\" data-feedback=\"Esa sería la restricción si el término estuviera en un denominador. Recuerda que un logaritmo tampoco admite valores negativos en su argumento.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"radio\" name=\"quiz-alt-1784912129552-a3xm\" value=\"0\" data-correct=\"false\" data-feedback=\"Esa sería la restricción si el término estuviera en un denominador. Recuerda que un logaritmo tampoco admite valores negativos en su argumento.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">Todos los puntos $(x,y)$ tales que $y \\neq x^2$.</span>\n        </label>\n      </div>\n        <button type=\"button\" class=\"btn btn-verify-quiz\" onclick=\"verifyQuizAlternatives(this)\" style=\"margin-top:12px; padding:8px 18px; background:var(--accent-color); color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;\">Verificar Respuesta</button>\n        <div class=\"quiz-feedback\" style=\"display:none; margin-top:12px; padding:12px; border-radius:8px;\"></div>\n      </div>\n    \n\n      <div class=\"quiz-block quiz-vf\" data-correct=\"F\" data-feedback-true=\"¡Correcto! Entregamos un punto o vector de entrada $(x,y,z)$, pero la función nos devuelve un escalar (un único número real).\" data-feedback-false=\"Incorrecto. Recuerda la palabra &#039;escalar&#039;. La salida es siempre un único número real (como una temperatura o una altitud), no un vector.\" style=\"margin:24px 0; padding:20px; background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px;\">\n        <h4 style=\"margin:0 0 8px 0; font-size:16px; color:var(--text-primary);\"><i class=\"fa-solid fa-toggle-on\" style=\"color:var(--accent-color);\"></i> V/F: Naturaleza del Campo Escalar</h4>\n        <p style=\"font-size:14px; color:var(--text-secondary); margin-bottom:12px;\">Un campo escalar definido como $f: \\mathbb{R}^3 \\to \\mathbb{R}$ toma una coordenada del espacio tridimensional como entrada y produce un vector como salida.</p>\n        <div style=\"display:flex; gap:16px; margin:12px 0;\">\n          <label style=\"display:flex; align-items:center; gap:6px; cursor:pointer;\">\n            <input type=\"radio\" name=\"quiz-vf-1784912129552-h5pm\" value=\"V\" style=\"accent-color:var(--accent-color);\"> <strong>Verdadero (V)</strong>\n          </label>\n          <label style=\"display:flex; align-items:center; gap:6px; cursor:pointer;\">\n            <input type=\"radio\" name=\"quiz-vf-1784912129552-h5pm\" value=\"F\" style=\"accent-color:var(--accent-color);\"> <strong>Falso (F)</strong>\n          </label>\n        </div>\n        <button type=\"button\" class=\"btn btn-verify-vf\" onclick=\"verifyQuizVF(this)\" style=\"margin-top:8px; padding:8px 18px; background:var(--accent-color); color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;\">Verificar</button>\n        <div class=\"quiz-feedback\" style=\"display:none; margin-top:12px; padding:12px; border-radius:8px;\"></div>\n      </div>\n    \n\n      <div class=\"quiz-block quiz-casillas\" style=\"margin:24px 0; padding:20px; background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px;\">\n        <h4 style=\"margin:0 0 12px 0; font-size:16px; color:var(--text-primary);\"><i class=\"fa-solid fa-list-check\" style=\"color:var(--accent-color);\"></i> Selección Múltiple: Múltiples Restricciones</h4>\n        <p style=\"font-size:14px; color:var(--text-secondary); margin-bottom:12px;\">Considera la función $h(x,y) = \\frac{\\sqrt{x+y}}{x-1}$. Selecciona <strong>todas</strong> las condiciones matemáticas que deben cumplirse simultáneamente para que un punto $(x,y)$ pertenezca a su dominio natural:</p>\n        <div class=\"quiz-casillas-options\">\n        <label class=\"quiz-casilla-option\" data-correct=\"true\" data-feedback=\"Correcto. Al ser una raíz cuadrada en el numerador, su interior no puede ser negativo, pero sí puede ser cero.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"checkbox\" value=\"0\" data-correct=\"1\" data-feedback=\"Correcto. Al ser una raíz cuadrada en el numerador, su interior no puede ser negativo, pero sí puede ser cero.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">$x + y \\geq 0$</span>\n        </label>\n      \n        <label class=\"quiz-casilla-option\" data-correct=\"true\" data-feedback=\"Correcto. El denominador completo debe ser distinto de cero para evitar la división por cero.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"checkbox\" value=\"1\" data-correct=\"1\" data-feedback=\"Correcto. El denominador completo debe ser distinto de cero para evitar la división por cero.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">$x \\neq 1$</span>\n        </label>\n      \n        <label class=\"quiz-casilla-option\" data-correct=\"false\" data-feedback=\"Incorrecto. Si bien el interior no puede ser negativo, en este caso sí está permitido que sea cero porque la raíz está en el numerador.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"checkbox\" value=\"2\" data-correct=\"0\" data-feedback=\"Incorrecto. Si bien el interior no puede ser negativo, en este caso sí está permitido que sea cero porque la raíz está en el numerador.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">$x + y > 0$</span>\n        </label>\n      \n        <label class=\"quiz-casilla-option\" data-correct=\"false\" data-feedback=\"Incorrecto. La variable $y$ puede tomar el valor 1 sin problemas, siempre y cuando no se infrinja la condición de la raíz.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"checkbox\" value=\"3\" data-correct=\"0\" data-feedback=\"Incorrecto. La variable $y$ puede tomar el valor 1 sin problemas, siempre y cuando no se infrinja la condición de la raíz.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">$y \\neq 1$</span>\n        </label>\n      </div>\n        <button type=\"button\" class=\"btn btn-verify-casillas\" onclick=\"verifyQuizCasillas(this)\" style=\"margin-top:12px; padding:8px 18px; background:var(--accent-color); color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;\">Verificar Selecciones</button>\n        <div class=\"quiz-feedback\" style=\"display:none; margin-top:12px; padding:12px; border-radius:8px;\"></div>\n      </div>\n    \n\n      <div class=\"quiz-block quiz-pareados-3col\" style=\"margin: 24px 0; padding: 20px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px;\">\n        <h4 style=\"margin: 0 0 16px 0; font-size: 16px; color: var(--text-primary);\">\n          <i class=\"fa-solid fa-network-wired\" style=\"color: var(--accent-color);\"></i> Asociación Avanzada: Función, Dominio e Imagen\n        </h4>\n\n        <!-- TRES COLUMNAS LATERALES -->\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 20px;\">\n          <div>\n            <h5 style=\"margin: 0 0 8px 0; color: var(--accent-color); font-size: 14px;\">Columna 1: Expresiones</h5>\n            <div style=\"display: flex; flex-direction: column; gap: 8px;\"><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>1.</strong> $f(x,y) = \\sqrt{1 - x^2 - y^2}$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>2.</strong> $f(x,y) = \\ln(x + y)$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>3.</strong> $f(x,y) = e^{-x^2 - y^2}$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>4.</strong> $f(x,y) = \\frac{1}{x^2 + y^2}$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>5.</strong> $f(x,y) = \\sqrt{x^2 + y^2 - 1}$</div></div>\n          </div>\n          <div>\n            <h5 style=\"margin: 0 0 8px 0; color: var(--accent-color); font-size: 14px;\">Columna 2: Técnicas / Dominios</h5>\n            <div style=\"display: flex; flex-direction: column; gap: 8px;\"><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>A.</strong> $D = \\{(x,y) \\in \\mathbb{R}^2: x^2 + y^2 \\geq 1\\}$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>B.</strong> $D = \\mathbb{R}^2 \\setminus \\{(0,0)\\}$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>C.</strong> $D = \\{(x,y) \\in \\mathbb{R}^2: y > -x\\}$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>D.</strong> $D = \\{(x,y) \\in \\mathbb{R}^2: x^2 + y^2 \\leq 1\\}$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>E.</strong> $D = \\mathbb{R}^2$</div></div>\n          </div>\n          <div>\n            <h5 style=\"margin: 0 0 8px 0; color: var(--accent-color); font-size: 14px;\">Columna 3: Resultados / Imágenes</h5>\n            <div style=\"display: flex; flex-direction: column; gap: 8px;\"><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>I.</strong> $\\operatorname{im}(f) = \\mathbb{R}$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>II.</strong> $\\operatorname{im}(f) = [0, 1]$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>III.</strong> $\\operatorname{im}(f) = [0, \\infty)$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>IV.</strong> $\\operatorname{im}(f) = (0, 1]$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>V.</strong> $\\operatorname{im}(f) = (0, \\infty)$</div></div>\n          </div>\n        </div>\n\n        <!-- FILAS DE SELECCIÓN DE ASOCIACIÓN -->\n        <h5 style=\"margin: 16px 0 10px 0; font-size: 14px; color: var(--text-primary);\">Asocia cada Ítem de la Columna 1 con su Letra (Col 2) y Romano (Col 3):</h5>\n        <div style=\"display: flex; flex-direction: column; gap: 10px;\">\n          \n        <div class=\"pareo-row-item\" data-num=\"1\" data-correct-letter=\"D\" data-correct-roman=\"II\" data-feedback=\"¡Correcto! La raíz exige $1 - (x^2+y^2) \\geq 0$, un disco cerrado de radio 1. Su máximo es 1 (en el origen) y su mínimo es 0 (en la frontera).\" style=\"display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;\">\n          <span style=\"font-weight: bold; width: 70px;\">Ítem 1:</span>\n          <span style=\"font-size: 13px; color: var(--text-muted);\">Letra:</span>\n          <select class=\"pareo-select-col2\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option><option value=\"D\">D</option><option value=\"E\">E</option>\n          </select>\n          <span style=\"font-size: 13px; color: var(--text-muted); margin-left: 8px;\">Romano:</span>\n          <select class=\"pareo-select-col3\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"I\">I</option><option value=\"II\">II</option><option value=\"III\">III</option><option value=\"IV\">IV</option><option value=\"V\">V</option>\n          </select>\n        </div>\n      \n        <div class=\"pareo-row-item\" data-num=\"2\" data-correct-letter=\"C\" data-correct-roman=\"I\" data-feedback=\"¡Excelente! El argumento $x+y&gt;0$ define un semiplano abierto. Al no estar acotado, el logaritmo recorre todos los números reales.\" style=\"display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;\">\n          <span style=\"font-weight: bold; width: 70px;\">Ítem 2:</span>\n          <span style=\"font-size: 13px; color: var(--text-muted);\">Letra:</span>\n          <select class=\"pareo-select-col2\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option><option value=\"D\">D</option><option value=\"E\">E</option>\n          </select>\n          <span style=\"font-size: 13px; color: var(--text-muted); margin-left: 8px;\">Romano:</span>\n          <select class=\"pareo-select-col3\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"I\">I</option><option value=\"II\">II</option><option value=\"III\">III</option><option value=\"IV\">IV</option><option value=\"V\">V</option>\n          </select>\n        </div>\n      \n        <div class=\"pareo-row-item\" data-num=\"3\" data-correct-letter=\"E\" data-correct-roman=\"IV\" data-feedback=\"¡Muy bien! No hay restricciones en el exponente, el dominio es todo $\\mathbb{R}^2$. Su máximo valor es $e^0 = 1$, y decae hacia 0 sin tocarlo.\" style=\"display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;\">\n          <span style=\"font-weight: bold; width: 70px;\">Ítem 3:</span>\n          <span style=\"font-size: 13px; color: var(--text-muted);\">Letra:</span>\n          <select class=\"pareo-select-col2\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option><option value=\"D\">D</option><option value=\"E\">E</option>\n          </select>\n          <span style=\"font-size: 13px; color: var(--text-muted); margin-left: 8px;\">Romano:</span>\n          <select class=\"pareo-select-col3\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"I\">I</option><option value=\"II\">II</option><option value=\"III\">III</option><option value=\"IV\">IV</option><option value=\"V\">V</option>\n          </select>\n        </div>\n      \n        <div class=\"pareo-row-item\" data-num=\"4\" data-correct-letter=\"B\" data-correct-roman=\"V\" data-feedback=\"¡Perfecto! El único problema ocurre si el denominador es cero, por lo que excluimos solo el origen $(0,0)$. Como la suma de cuadrados siempre es positiva, la fracción crece hacia infinito y nunca toma el valor cero ni negativos.\" style=\"display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;\">\n          <span style=\"font-weight: bold; width: 70px;\">Ítem 4:</span>\n          <span style=\"font-size: 13px; color: var(--text-muted);\">Letra:</span>\n          <select class=\"pareo-select-col2\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option><option value=\"D\">D</option><option value=\"E\">E</option>\n          </select>\n          <span style=\"font-size: 13px; color: var(--text-muted); margin-left: 8px;\">Romano:</span>\n          <select class=\"pareo-select-col3\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"I\">I</option><option value=\"II\">II</option><option value=\"III\">III</option><option value=\"IV\">IV</option><option value=\"V\">V</option>\n          </select>\n        </div>\n      \n        <div class=\"pareo-row-item\" data-num=\"5\" data-correct-letter=\"A\" data-correct-roman=\"III\" data-feedback=\"¡Correcto! A diferencia de la función 1, aquí necesitamos que $x^2 + y^2 - 1 \\geq 0$, lo que geométricamente es el exterior de un disco de radio 1 (incluyendo la frontera). Como las variables pueden crecer indefinidamente, la raíz va desde 0 hasta infinito.\" style=\"display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;\">\n          <span style=\"font-weight: bold; width: 70px;\">Ítem 5:</span>\n          <span style=\"font-size: 13px; color: var(--text-muted);\">Letra:</span>\n          <select class=\"pareo-select-col2\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option><option value=\"D\">D</option><option value=\"E\">E</option>\n          </select>\n          <span style=\"font-size: 13px; color: var(--text-muted); margin-left: 8px;\">Romano:</span>\n          <select class=\"pareo-select-col3\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"I\">I</option><option value=\"II\">II</option><option value=\"III\">III</option><option value=\"IV\">IV</option><option value=\"V\">V</option>\n          </select>\n        </div>\n      \n        </div>\n\n        <button type=\"button\" class=\"btn btn-verify-pareados\" onclick=\"verifyQuizPareados3Col(this)\" style=\"margin-top: 16px; padding: 10px 22px; background: var(--accent-color); color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px;\">\n          <i class=\"fa-solid fa-circle-check\"></i> Verificar Asociaciones\n        </button>\n\n        <div class=\"quiz-feedback\" style=\"display:none; margin-top:16px; padding:14px; border-radius:8px;\"></div>\n      </div>\n    ",
          contentExercises: "[{\"id\":\"ex-1784912129538-0r8j\",\"title\":\"Determinación de Dominio con Múltiples Restricciones\",\"level\":\"resuelto\",\"statement\":\"<p>Determine analíticamente y describa geométricamente el dominio natural del campo escalar dado por la expresión:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$f(x,y) = \\\\frac{\\\\sqrt{9 - x^2 - y^2}}{\\\\ln(y - x)}$$</div></p>\",\"solution\":\"<p>Para que la función entregue un valor real bien definido, debemos plantear y resolver simultáneamente tres restricciones algebraicas: <strong>Restricción 1 (Raíz cuadrada):</strong> El radicando del numerador no puede ser negativo:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ 9 - x^2 - y^2 \\\\geq 0 \\\\implies x^2 + y^2 \\\\leq 9 $$</div>       Geométricamente, esto representa un disco cerrado de radio $3$ centrado en el origen $(0,0)$.</p>\\n<p><strong>Restricción 2 (Logaritmo natural):</strong> El argumento del logaritmo en el denominador debe ser estrictamente positivo:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ y - x > 0 \\\\implies y > x $$</div>       Esto corresponde al semiplano abierto ubicado estrictamente por encima de la recta identidad $y = x$.</p>\\n<p><strong>Restricción 3 (Denominador no nulo):</strong> El denominador completo no puede anularse:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\ln(y - x) \\\\neq 0 \\\\implies y - x \\\\neq e^0 \\\\implies y - x \\\\neq 1 \\\\implies y \\\\neq x + 1 $$</div>       Esto significa que debemos excluir todos los puntos que pertenecen a la recta transladada $y = x + 1$.</p>\\n<p><strong>Conclusión y Descripción del Dominio:</strong>       El dominio natural del campo escalar es la intersección de estas tres regiones:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\operatorname{dom}(f) = \\\\left\\\\{ (x,y) \\\\in \\\\mathbb{R}^2 \\\\;\\\\colon\\\\; x^2 + y^2 \\\\leq 9 \\\\;\\\\land\\\\; y > x \\\\;\\\\land\\\\; y \\\\neq x + 1 \\\\right\\\\} $$</div>       Geométricamente, corresponde a la mitad superior-izquierda del círculo de radio 3 (cortado por la recta $y=x$), excluyendo los puntos de la frontera sobre dicha recta y quitando completamente el segmento de la recta $y = x + 1$ que cruza por dentro de la figura.</p>\"},{\"id\":\"ex-1784912129547-3gqe\",\"title\":\"Invarianza por Simetría Radial\",\"level\":\"nivel-3\",\"statement\":\"<p>Un campo escalar $f: \\\\mathbb{R}^2 \\\\to \\\\mathbb{R}$ posee <em>simetría radial</em> si su valor depende únicamente de la distancia del punto al origen. Es decir, si existe una función de una variable $g: [0, \\\\infty) \\\\to \\\\mathbb{R}$ tal que $f(x,y) = g(\\\\sqrt{x^2+y^2})$.</p>\\n<p>Demuestre rigurosamente que el campo escalar $f(x,y) = \\\\ln(1 + x^2 + y^2)$ posee simetría radial, determine explícitamente la función $g(t)$ asociada, y pruebe analíticamente que la imagen del campo es $\\\\operatorname{im}(f) = [0, \\\\infty)$.</p>\",\"solution\":\"<p><strong>Parte 1: Demostración de Simetría Radial</strong>       Definamos la variable $t = \\\\sqrt{x^2 + y^2}$, la cual representa la distancia euclidiana de cualquier punto $(x,y)$ al origen $(0,0)$. Dado que las variables están en los números reales, al elevar al cuadrado obtenemos $t^2 = x^2 + y^2$.</p>\\n<p>Sustituyendo directamente en la regla de correspondencia de nuestro campo escalar:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ f(x,y) = \\\\ln(1 + (x^2 + y^2)) = \\\\ln(1 + t^2) $$</div>       Como la expresión resultante depende única y exclusivamente del parámetro de distancia $t$, queda demostrado que $f$ posee simetría radial. La función unidimensional asociada es:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ g(t) = \\\\ln(1 + t^2) \\\\quad \\\\text{con } t \\\\in [0, \\\\infty) $$</div></p>\\n<p><strong>Parte 2: Determinación Rigurosa de la Imagen</strong>       Para hallar la imagen, analizamos el comportamiento de $g(t)$ en su dominio restringido $[0, \\\\infty)$:       <ol style=\\\"margin: 8px 0; padding-left: 20px;\\\">\\n        <li>Dado que $t \\\\geq 0$, entonces $t^2 \\\\geq 0$, lo que implica que $1 + t^2 \\\\geq 1$.\\n        </li><li>Aplicando la función logaritmo natural (que es estrictamente creciente en todo su dominio) a la desigualdad anterior, obtenemos:\\n        $$ \\\\ln(1 + t^2) \\\\geq \\\\ln(1) \\\\implies g(t) \\\\geq 0 $$\\n        </li><li>El valor mínimo absoluto es $0$ y se alcanza únicamente en $t=0$ (es decir, en el origen $f(0,0) = 0$).\\n        </li><li>Como $\\\\lim_{t \\\\to \\\\infty} \\\\ln(1 + t^2) = \\\\infty$ y la función es continua, por el Teorema del Valor Intermedio el recorrido toma todos los valores intermedios.\\n      </li></ol>       Por lo tanto, la imagen del campo escalar es, formalmente, $\\\\operatorname{im}(f) = [0, \\\\infty)$.</p>\"},{\"id\":\"ex-1784912129549-mdou\",\"title\":\"Restricciones Hiperbólicas en el Plano\",\"level\":\"nivel-2\",\"statement\":\"<p>Considere el campo escalar definido por la regla de correspondencia:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ h(x,y) = \\\\ln(x \\\\cdot y - 1) $$</div>       Determine su dominio natural y describa las fronteras que delimitan esta región matemática en el plano cartesiano.</p>\",\"solution\":\"<p><strong>Pista metodológica:</strong> La restricción del logaritmo exige que el producto de las variables cumpla $x \\\\cdot y > 1$. Analiza este comportamiento separando el análisis para cuando $x > 0$ y cuando $x < 0$. Recuerda que la frontera matemática está dada por las dos ramas de la hipérbola equilátera $y = \\\\frac{1}{x}$, y que el dominio consta de dos regiones disjuntas en el primer y tercer cuadrante.</p>\"},{\"id\":\"ex-1784912129550-7gvh\",\"title\":\"Restricción Logarítmica e Hiperbólica\",\"level\":\"nivel-2\",\"statement\":\"<p>Determine analíticamente el dominio natural y la imagen del campo escalar dado por la expresión:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ f(x,y) = \\\\ln(x^2 - y^2) $$</div>       Describa cualitativamente la geometría de la región del plano obtenida.</p>\",\"solution\":\"<p><strong>Dominio:</strong> El argumento del logaritmo debe ser estrictamente positivo ($x^2 - y^2 > 0$). Esto equivale a $x^2 > y^2 \\\\implies |x| > |y|$. Geométricamente, representa el interior de los dos conos abiertos opuestos que contienen al eje $X$, delimitados por las rectas asíntotas $y = x$ e $y = -x$ (sin incluir las rectas). \\\\\\\\       <strong>Imagen:</strong> Como la expresión $x^2 - y^2$ puede tomar cualquier valor dentro del intervalo $(0, \\\\infty)$ bajo las condiciones del dominio, el logaritmo natural recorre todo su espectro. Por lo tanto, $\\\\operatorname{im}(f) = \\\\mathbb{R}$.</p>\"},{\"id\":\"ex-1784912129550-5yvk\",\"title\":\"Regiones Cónicas y Fronteras Cerradas\",\"level\":\"nivel-2\",\"statement\":\"<p>Considere el campo escalar:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ f(x,y) = \\\\sqrt{-x^2 + y^2} $$</div>       Halle analíticamente su dominio natural e imagen, y establezca la diferencia geométrica respecto al ejercicio anterior.</p>\",\"solution\":\"<p><strong>Dominio:</strong> El radicando exige que $y^2 - x^2 \\\\geq 0 \\\\implies y^2 \\\\geq x^2$, lo cual se traduce en la desigualdad de valores absolutos $|y| \\\\geq |x|$. Geométricamente, esto corresponde a las regiones (superior e inferior) que contienen al eje $Y$. A diferencia del problema anterior, esta región es <em>cerrada</em>, lo que significa que sí incluye a las rectas fronteras $y = x$ e $y = -x$. \\\\\\\\       <strong>Imagen:</strong> Al tratarse de una raíz cuadrada estándar cuyo radicando puede crecer indefinidamente conforme nos alejamos en el eje $Y$, el conjunto imagen corresponde a los reales no negativos: $\\\\operatorname{im}(f) = [0, \\\\infty)$.</p>\"},{\"id\":\"ex-1784912129550-ly6b\",\"title\":\"Periodicidad y Acotación Multivariable\",\"level\":\"nivel-2\",\"statement\":\"<p>Para el campo escalar definido por la regla de correspondencia:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ f(x,y) = \\\\sin(x+y) $$</div>       Determine su dominio natural y su conjunto imagen.</p>\",\"solution\":\"<p><strong>Dominio:</strong> La función trigonométrica seno no impone ninguna restricción matemática sobre el comportamiento de sus argumentos, por lo que su dominio natural es todo el plano bidimensional, $\\\\operatorname{dom}(f) = \\\\mathbb{R}^2$. \\\\\\\\       <strong>Imagen:</strong> Dado que la combinación lineal $x+y$ puede tomar cualquier valor real en el intervalo $(-\\\\infty, \\\\infty)$, y sabiendo que la función seno oscila de forma periódica, la imagen queda confinada de manera idéntica al caso unidimensional: $\\\\operatorname{im}(f) = [-1, 1]$.</p>\"},{\"id\":\"ex-1784912129550-buio\",\"title\":\"Fronteras Parabólicas en el Plano\",\"level\":\"nivel-2\",\"statement\":\"<p>Determine analíticamente el dominio natural y el conjunto imagen de la función:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ f(x,y) = \\\\sqrt{x^2 - y} $$</div></p>\",\"solution\":\"<p><strong>Dominio:</strong> La restricción de la raíz cuadrada de índice par exige que $x^2 - y \\\\geq 0$, lo que equivale analíticamente a la inecuación $y \\\\leq x^2$. En el plano cartesiano, esto representa geométricamente a todos los puntos que se encuentran sobre y por debajo de la parábola estándar $y = x^2$. \\\\\\\\       <strong>Imagen:</strong> Debido a que la raíz cuadrada entrega exclusivamente valores no negativos y la diferencia $x^2 - y$ puede ser arbitrariamente grande (por ejemplo, fijando $x=0$ y haciendo que $y \\\\to -\\\\infty$), la imagen es $\\\\operatorname{im}(f) = [0, \\\\infty)$.</p>\"}]",
          contentFormulas: "[{\"id\":\"form-1784912129533-qyzq\",\"title\":\"Dominio de un Campo Escalar\",\"latex\":\"\\\\operatorname{dom}(f) = \\\\{ (x,y) \\\\in \\\\mathbb{R}^2 \\\\colon f(x,y) \\\\in \\\\mathbb{R} \\\\}\",\"description\":\"El conjunto de todos los puntos en el plano para los cuales la regla de correspondencia de la función produce un valor real bien definido.\"},{\"id\":\"form-1784912129536-nsld\",\"title\":\"Imagen o Recorrido\",\"latex\":\"\\\\operatorname{im}(f) = \\\\{ z \\\\in \\\\mathbb{R} \\\\colon z = f(x,y) \\\\text{ para algún } (x,y) \\\\in \\\\operatorname{dom}(f) \\\\}\",\"description\":\"El conjunto de todos los valores numéricos (alturas, temperaturas, presiones) que la función efectivamente toma en el eje Z.\"},{\"id\":\"form-1784912129536-av7i\",\"title\":\"Restricciones de Dominio\",\"latex\":\"\\\\begin{aligned}\\n      \\\\text{Fracción: } \\\\frac{1}{g} &\\\\implies g \\\\neq 0 \\\\\\\\[0.5em]\\n      \\\\text{Logaritmo: } \\\\ln(g) &\\\\implies g > 0 \\\\\\\\[0.5em]\\n      \\\\text{Raíz Par: } \\\\sqrt{g} &\\\\implies g \\\\geq 0\\n    \\\\end{aligned}\",\"description\":\"Condiciones algebraicas obligatorias e indispensables para plantear el dominio natural: se debe recordar repasar hacia abajo las restricciones analíticas de denominadores no nulos, argumentos estrictamente positivos y radicandos no negativos.\"},{\"id\":\"form-1784912129536-j5oq\",\"title\":\"Imágenes Elementales\",\"latex\":\"\\\\begin{aligned}\\n      \\\\operatorname{im}(e^u) &= (0, \\\\infty) \\\\\\\\[0.5em]\\n      \\\\operatorname{im}(\\\\ln(u)) &= \\\\mathbb{R} \\\\\\\\[0.5em]\\n      \\\\operatorname{im}(\\\\sqrt{u}) &= [0, \\\\infty)\\n    \\\\end{aligned}\",\"description\":\"Comportamiento analítico y recorridos canónicos verticales de las funciones base de una variable. Recordar de memoria estos intervalos es clave para construir la imagen final de campos escalares complejos.\"},{\"id\":\"form-1784912129536-e4ji\",\"title\":\"Frontera Circular Típica\",\"latex\":\"x^2 + y^2 = r^2\",\"description\":\"Ecuación de la circunferencia de radio $r$ centrada en el origen, la cual suele aparecer como la frontera geométrica al despejar restricciones de raíces o logaritmos radiales.\"}]"
        }, {
          id: chapterIdCounter++,
          unitId: u1Id,
          chapterIndex: '1.2',
          title: 'Curvas de Nivel y Grafos',
          isCompleted: false,
          isLocked: false,
          contentMotivation: "<p><strong>¿Cómo dibujamos una montaña en una hoja de papel?</strong></p>\n<p>Imagina que estás planeando una expedición a la cordillera. Tienes un mapa impreso completamente plano, pero necesitas saber dónde están los acantilados más empinados y dónde se encuentran las llanuras seguras para caminar. ¿Cómo puede un simple trozo de papel de dos dimensiones mostrarte el relieve tridimensional?</p>\n<p>La respuesta que encontraron los topógrafos hace siglos son las <strong>líneas de contorno</strong>. Cada línea en el mapa conecta todos los puntos que están exactamente a la misma altitud. Si caminaras físicamente siguiendo esa línea, no subirías ni bajarías; te mantendrías al mismo \"nivel\".</p>\n<p>En matemáticas, hacemos exactamente lo mismo. Tomamos un grafo tridimensional (una superficie $z = f(x,y)$) y lo \"rebanamos\" con planos horizontales a distintas alturas constantes ($z = k$). Al proyectar esos cortes hacia el suelo bidimensional, obtenemos un mapa de curvas de nivel que nos revela los secretos del espacio.</p>\n<div class=\"caja-ram caja-motivacion\"><div class=\"caja-ram-title\">💡 Pregunta Guía</div><div class=\"caja-ram-body\"><p>Si miras un mapa topográfico, ¿qué significa geométricamente que dos curvas de nivel estén dibujadas muy juntas en comparación a cuando están muy separadas?</p></div></div>",
          contentTheory: "<p>Para entender el comportamiento de un campo escalar de dos variables $f(x,y)$, necesitamos visualizarlo. Sin embargo, dibujar directamente en tres dimensiones puede ser complejo, por lo que recurrimos a dos herramientas geométricas fundamentales: el grafo y las curvas de nivel.</p>\n<div class=\"caja-ram caja-definicion\"><div class=\"caja-ram-title\"><i class=\"fa-solid fa-book-bookmark\"></i> Definición: Grafo de un Campo Escalar (Superficie)</div><div class=\"caja-ram-body\"><p>El <strong>grafo</strong> de una función de dos variables $f(x,y)$ es el conjunto de todos los puntos $(x,y,z)$ en el espacio tridimensional $\\mathbb{R}^3$ para los cuales la altura $z$ es igual al valor de la función evaluada en $(x,y)$.</p>\n<p>Formalmente:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\text{Gr}(f) = \\{ (x,y,z) \\in \\mathbb{R}^3 \\colon z = f(x,y) \\wedge (x,y) \\in \\operatorname{dom}(f) \\} $$</div>     En gran parte de los ejemplos que veremos, este conjunto de puntos forma una <strong>superficie</strong> en el espacio.</p></div></div>\n<div class=\"caja-ram caja-definicion\"><div class=\"caja-ram-title\"><i class=\"fa-solid fa-book-bookmark\"></i> Definición: Curvas de Nivel</div><div class=\"caja-ram-body\"><p>Una <strong>curva de nivel</strong> de un campo escalar $f(x,y)$ es el conjunto de todos los puntos en el dominio (plano XY) que devuelven exactamente el mismo valor constante $k$.</p>\n<p>Formalmente, la curva de nivel para una constante $k$ se define como:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ C_k = \\{ (x,y) \\in \\operatorname{dom}(f) \\colon f(x,y) = k \\} $$</div>     El valor $k$ debe pertenecer obligatoriamente a la imagen $\\operatorname{im}(f)$ de la función. Al dibujar varias curvas de nivel para distintos valores de $k$ en un mismo plano cartesiano, obtenemos lo que se conoce como un <strong>mapa de contorno</strong>.</p></div></div>\n<div class=\"caja-ram error-comun\"><div class=\"caja-ram-title\"><i class=\"fa-solid fa-triangle-exclamation\"></i> Curva de Nivel vs. Traza</div><div class=\"caja-ram-body\"><p>¡No confundas la dimensión! Una <strong>traza</strong> horizontal es la intersección física de la superficie con el plano $z = k$, es decir, es un corte que vive en el espacio <strong>3D</strong>.</p>\n<p>En cambio, una <strong>curva de nivel</strong> es la proyección de ese corte hacia abajo, aplastado contra el piso. Por lo tanto, las curvas de nivel se dibujan <strong>siempre en el plano 2D</strong> (el plano $XY$).</p></div></div>\n<div class=\"caja-ram caja-motivacion\"><div class=\"caja-ram-title\"><i class=\"fa-solid fa-gears\"></i> ¿Cómo construir un Mapa de Contorno?</div><div class=\"caja-ram-body\"><p>Para graficar analíticamente la familia de curvas de nivel de $f(x,y)$:     <ol style=\"margin: 8px 0; padding-left: 20px;\">\n      <li><strong>Verifica la imagen:</strong> Asegúrate de elegir valores de $k \\in \\operatorname{im}(f)$ que la función efectivamente pueda alcanzar.\n      </li><li><strong>Iguala a la constante:</strong> Plantea la ecuación algebraica $f(x,y) = k$.\n      </li><li><strong>Identifica la cónica:</strong> Manipula algebraicamente la ecuación hasta reconocer una figura geométrica conocida en 2D (rectas, parábolas, circunferencias, elipses, hipérbolas).\n      </li><li><strong>Grafica en el plano:</strong> Dibuja la curva en el plano $XY$ y etiquétala explícitamente con su valor de $k$ correspondiente. Repite para distintos valores de $k$ uniformemente espaciados.\n    </li></ol></p></div></div>",
          contentApplication: "<p>A continuación, aplicaremos los conceptos de curvas de nivel y grafos mediante un ejemplo guiado, un laboratorio 3D interactivo y una serie de ejercicios interactivos diseñados para poner a prueba tu interpretación geométrica y algebraica.</p>\n<div class=\"caja-ram caja-motivacion\"><div class=\"caja-ram-title\"><i class=\"fa-solid fa-gears\"></i> Laboratorio 3D Interactivo: Planos de Corte y Curvas de Nivel</div><div class=\"caja-ram-body\"><p>Manipula la superficie 3D en tiempo real, desplaza el plano de corte $z=k$ y observa cómo se generan las curvas de nivel proyectadas en el plano $XY$. Puedes seleccionar diferentes superficies (dos colinas, paraboloide, silla de montar, sombrero radial):</p>\n<div style=\"position:relative; width:100\n      <iframe src=\"animaciones/curvas_nivel/index.html\" style=\"width:100\n    </div>\n    <div style=\"margin-top:10px; text-align:right;\">\n      <a href=\"animaciones/curvas_nivel/index.html\" target=\"_blank\" style=\"padding:6px 14px; background:var(--accent-color); color:white; border-radius:6px; font-weight:600; text-decoration:none; font-size:13px; display:inline-flex; align-items:center; gap:6px;\">\n        🔍 Abrir Laboratorio 3D en Pantalla Completa\n      </a>\n    </div></div></div>\n<div class=\"caja-ram caja-definicion\"><div class=\"caja-ram-title\">💡 Ejemplo: Construcción de Curvas de Nivel para un Paraboloide</div><div class=\"caja-ram-body\"><p>Consideremos el campo escalar dado por la función:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ f(x,y) = 4 - x^2 - y^2 $$</div></p>\n<p><strong>1. Determinación de Dominio e Imagen:</strong>     Como la expresión es polinómica, no posee restricciones algebraicas, por lo que $\\operatorname{dom}(f) = \\mathbb{R}^2$. Dado que $x^2 + y^2 \\geq 0$, el valor máximo de la función es $4$ (alcanzado en el origen), de modo que $\\operatorname{im}(f) = (-\\infty, 4]$.</p>\n<p><strong>2. Obtención de las Curvas de Nivel:</strong>     Para un valor $k \\in \\operatorname{im}(f)$, igualamos la función a la constante $k$:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ 4 - x^2 - y^2 = k \\implies x^2 + y^2 = 4 - k $$</div></p>\n<p><strong>3. Análisis Geométrico según el valor de $k$:</strong>     <ul style=\"margin: 8px 0; padding-left: 20px;\">\n      <li><strong>Para $k = 4$:</strong> Obtenemos $x^2 + y^2 = 0$, lo que representa un único punto en el origen $(0,0)$.\n      </li><li><strong>Para $k = 3$:</strong> Obtenemos $x^2 + y^2 = 1$, una circunferencia de radio $1$ centrada en el origen.\n      </li><li><strong>Para $k = 0$:</strong> Obtenemos $x^2 + y^2 = 4$, una circunferencia de radio $2$ centrada en el origen.\n      </li><li><strong>Para $k > 4$:</strong> La ecuación $x^2 + y^2 = 4 - k$ carece de solución en los números reales, por lo que $C_k = \\emptyset$.\n    </li></ul>     Geométricamente, la familia de curvas de nivel corresponde a una serie de <strong>circunferencias concéntricas</strong> en el plano $XY$ que se expanden a medida que el valor de altura $k$ disminuye.</p></div></div>\n\n      <div class=\"quiz-block quiz-alternativas\" style=\"margin:24px 0; padding:20px; background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px;\">\n        <h4 style=\"margin:0 0 12px 0; font-size:16px; color:var(--text-primary);\"><i class=\"fa-solid fa-circle-question\" style=\"color:var(--accent-color);\"></i> Identificación de Geometría de Contorno</h4>\n        <p style=\"font-size:14px; color:var(--text-secondary); margin-bottom:12px;\">¿Qué figura geométrica representan las curvas de nivel del campo escalar $f(x,y) = y - x^2$?</p>\n        <div class=\"quiz-options\">\n        <label class=\"quiz-option\" data-correct=\"true\" data-feedback=\"¡Excelente! Al plantear $y - x^2 = k \\implies y = x^2 + k$, vemos que cada curva de nivel es la parábola canónica $y = x^2$ trasladada verticalmente en $k$ unidades.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"radio\" name=\"quiz-alt-1784912129570-l76k\" value=\"1\" data-correct=\"true\" data-feedback=\"¡Excelente! Al plantear $y - x^2 = k \\implies y = x^2 + k$, vemos que cada curva de nivel es la parábola canónica $y = x^2$ trasladada verticalmente en $k$ unidades.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">Una familia de parábolas verticales desplazadas en el eje $Y$.</span>\n        </label>\n      \n        <label class=\"quiz-option\" data-correct=\"false\" data-feedback=\"Recuerda que para obtener circunferencias ambas variables deben estar elevadas al cuadrado con el mismo signo ($x^2 + y^2 = r^2$).\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"radio\" name=\"quiz-alt-1784912129570-l76k\" value=\"0\" data-correct=\"false\" data-feedback=\"Recuerda que para obtener circunferencias ambas variables deben estar elevadas al cuadrado con el mismo signo ($x^2 + y^2 = r^2$).\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">Una familia de circunferencias concéntricas centradas en el origen.</span>\n        </label>\n      \n        <label class=\"quiz-option\" data-correct=\"false\" data-feedback=\"La presencia del término cuadrático $x^2$ impide que la relación sea lineal.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"radio\" name=\"quiz-alt-1784912129570-l76k\" value=\"0\" data-correct=\"false\" data-feedback=\"La presencia del término cuadrático $x^2$ impide que la relación sea lineal.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">Una familia de rectas paralelas con pendiente positiva.</span>\n        </label>\n      </div>\n        <button type=\"button\" class=\"btn btn-verify-quiz\" onclick=\"verifyQuizAlternatives(this)\" style=\"margin-top:12px; padding:8px 18px; background:var(--accent-color); color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;\">Verificar Respuesta</button>\n        <div class=\"quiz-feedback\" style=\"display:none; margin-top:12px; padding:12px; border-radius:8px;\"></div>\n      </div>\n    \n\n      <div class=\"quiz-block quiz-vf\" data-correct=\"V\" data-feedback-true=\"Incorrecto. Piensa en la definición de función: a cada punto del dominio le corresponde una y solo una salida escalar. Si se cruzaran, habría dos alturas distintas para un mismo punto $(x_0,y_0)$.\" data-feedback-false=\"¡Correcto! Si dos curvas de nivel se cruzaran en un punto $(x_0, y_0)$, la función tendría que tomar dos valores distintos $f(x_0, y_0) = k_1 \\wedge f(x_0, y_0) = k_2$ simultáneamente, lo cual contradice la definición formal de función.\" style=\"margin:24px 0; padding:20px; background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px;\">\n        <h4 style=\"margin:0 0 8px 0; font-size:16px; color:var(--text-primary);\"><i class=\"fa-solid fa-toggle-on\" style=\"color:var(--accent-color);\"></i> V/F: Intersección de Curvas de Nivel</h4>\n        <p style=\"font-size:14px; color:var(--text-secondary); margin-bottom:12px;\">Dos curvas de nivel $C_{k_1}$ y $C_{k_2}$ correspondientes a valores distintos $k_1 \\neq k_2$ de un mismo campo escalar $f(x,y)$ nunca pueden cruzarse ni intersectarse en el plano.</p>\n        <div style=\"display:flex; gap:16px; margin:12px 0;\">\n          <label style=\"display:flex; align-items:center; gap:6px; cursor:pointer;\">\n            <input type=\"radio\" name=\"quiz-vf-1784912129570-38ce\" value=\"V\" style=\"accent-color:var(--accent-color);\"> <strong>Verdadero (V)</strong>\n          </label>\n          <label style=\"display:flex; align-items:center; gap:6px; cursor:pointer;\">\n            <input type=\"radio\" name=\"quiz-vf-1784912129570-38ce\" value=\"F\" style=\"accent-color:var(--accent-color);\"> <strong>Falso (F)</strong>\n          </label>\n        </div>\n        <button type=\"button\" class=\"btn btn-verify-vf\" onclick=\"verifyQuizVF(this)\" style=\"margin-top:8px; padding:8px 18px; background:var(--accent-color); color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;\">Verificar</button>\n        <div class=\"quiz-feedback\" style=\"display:none; margin-top:12px; padding:12px; border-radius:8px;\"></div>\n      </div>\n    \n\n      <div class=\"quiz-block quiz-casillas\" style=\"margin:24px 0; padding:20px; background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px;\">\n        <h4 style=\"margin:0 0 12px 0; font-size:16px; color:var(--text-primary);\"><i class=\"fa-solid fa-list-check\" style=\"color:var(--accent-color);\"></i> Selección Múltiple: Propiedades de Campos Racionales</h4>\n        <p style=\"font-size:14px; color:var(--text-secondary); margin-bottom:12px;\">Considera la función $f(x,y) = \\frac{y}{x}$. Selecciona <strong>todas</strong> las afirmaciones matemáticamente correctas respecto a su dominio y curvas de nivel:</p>\n        <div class=\"quiz-casillas-options\">\n        <label class=\"quiz-casilla-option\" data-correct=\"true\" data-feedback=\"Correcto. La única restricción algebraica es la división por cero, por lo que debemos excluir todo el eje $Y$.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"checkbox\" value=\"0\" data-correct=\"1\" data-feedback=\"Correcto. La única restricción algebraica es la división por cero, por lo que debemos excluir todo el eje $Y$.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">El dominio natural de la función es $\\operatorname{dom}(f) = \\{ (x,y) \\in \\mathbb{R}^2: x \\neq 0 \\}$.</span>\n        </label>\n      \n        <label class=\"quiz-casilla-option\" data-correct=\"true\" data-feedback=\"Correcto. La ecuación $\\frac{y}{x} = k \\implies y = kx$ representa rectas de pendiente $k$, pero como $x \\neq 0$, el origen no pertenece al dominio.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"checkbox\" value=\"1\" data-correct=\"1\" data-feedback=\"Correcto. La ecuación $\\frac{y}{x} = k \\implies y = kx$ representa rectas de pendiente $k$, pero como $x \\neq 0$, el origen no pertenece al dominio.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">Las curvas de nivel $f(x,y) = k$ corresponden a rectas que pasan por el origen (excluyendo el punto $(0,0)$).</span>\n        </label>\n      \n        <label class=\"quiz-casilla-option\" data-correct=\"false\" data-feedback=\"¡Cuidado! Aunque $y = 0 \\cdot x \\implies y = 0$ (el eje $X$), el punto $(0,0)$ debe ser excluido porque no pertenece al dominio.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"checkbox\" value=\"2\" data-correct=\"0\" data-feedback=\"¡Cuidado! Aunque $y = 0 \\cdot x \\implies y = 0$ (el eje $X$), el punto $(0,0)$ debe ser excluido porque no pertenece al dominio.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">La curva de nivel para $k = 0$ es todo el eje $X$.</span>\n        </label>\n      \n        <label class=\"quiz-casilla-option\" data-correct=\"false\" data-feedback=\"Incorrecto. La constante $k$ puede tomar cualquier número real (positivo, negativo o cero), por lo que $\\operatorname{im}(f) = \\mathbb{R}$.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"checkbox\" value=\"3\" data-correct=\"0\" data-feedback=\"Incorrecto. La constante $k$ puede tomar cualquier número real (positivo, negativo o cero), por lo que $\\operatorname{im}(f) = \\mathbb{R}$.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">El recorrido de la función es únicamente $\\operatorname{im}(f) = [0, \\infty)$.</span>\n        </label>\n      </div>\n        <button type=\"button\" class=\"btn btn-verify-casillas\" onclick=\"verifyQuizCasillas(this)\" style=\"margin-top:12px; padding:8px 18px; background:var(--accent-color); color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;\">Verificar Selecciones</button>\n        <div class=\"quiz-feedback\" style=\"display:none; margin-top:12px; padding:12px; border-radius:8px;\"></div>\n      </div>\n    \n\n      <div class=\"quiz-block quiz-pareados-3col\" style=\"margin: 24px 0; padding: 20px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px;\">\n        <h4 style=\"margin: 0 0 16px 0; font-size: 16px; color: var(--text-primary);\">\n          <i class=\"fa-solid fa-network-wired\" style=\"color: var(--accent-color);\"></i> Asociación Avanzada: Función, Geometría de $C_k$ y Restricción de $k$\n        </h4>\n\n        <!-- TRES COLUMNAS LATERALES -->\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 20px;\">\n          <div>\n            <h5 style=\"margin: 0 0 8px 0; color: var(--accent-color); font-size: 14px;\">Columna 1: Expresiones</h5>\n            <div style=\"display: flex; flex-direction: column; gap: 8px;\"><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>1.</strong> $f(x,y) = x^2 - y^2$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>2.</strong> $f(x,y) = \\sin(x - y)$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>3.</strong> $f(x,y) = \\sqrt{4x^2 + y^2}$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>4.</strong> $f(x,y) = e^{y - x^2}$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>5.</strong> $f(x,y) = \\frac{-1}{x^2 + y^2}$</div></div>\n          </div>\n          <div>\n            <h5 style=\"margin: 0 0 8px 0; color: var(--accent-color); font-size: 14px;\">Columna 2: Curvas de nivel</h5>\n            <div style=\"display: flex; flex-direction: column; gap: 8px;\"><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>A.</strong> Parábolas cóncavas hacia arriba</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>B.</strong> Hipérbolas (o par de rectas secantes si $k=0$)</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>C.</strong> Circunferencias concéntricas centradas en el origen</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>D.</strong> Elipses concéntricas centradas en el origen</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>E.</strong> Rectas paralelas de pendiente $m=1$</div></div>\n          </div>\n          <div>\n            <h5 style=\"margin: 0 0 8px 0; color: var(--accent-color); font-size: 14px;\">Columna 3: Valores de $k$ tal que $C_k\\neq\\emptyset$</h5>\n            <div style=\"display: flex; flex-direction: column; gap: 8px;\"><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>I.</strong> $k \\in [-1, 1]$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>II.</strong> $k > 0$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>III.</strong> $k \\in \\mathbb{R}$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>IV.</strong> $k < 0$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>V.</strong> $k \\geq 0$</div></div>\n          </div>\n        </div>\n\n        <!-- FILAS DE SELECCIÓN DE ASOCIACIÓN -->\n        <h5 style=\"margin: 16px 0 10px 0; font-size: 14px; color: var(--text-primary);\">Asocia cada Ítem de la Columna 1 con su Letra (Col 2) y Romano (Col 3):</h5>\n        <div style=\"display: flex; flex-direction: column; gap: 10px;\">\n          \n        <div class=\"pareo-row-item\" data-num=\"1\" data-correct-letter=\"B\" data-correct-roman=\"III\" data-feedback=\"¡Correcto! La ecuación $x^2 - y^2 = k$ representa una familia de hipérbolas con asíntotas $y = \\pm x$ (las cuales forman la curva de nivel degenerada para $k=0$). Como la diferencia de cuadrados puede tomar cualquier valor real, $k \\in \\mathbb{R}$.\" style=\"display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;\">\n          <span style=\"font-weight: bold; width: 70px;\">Ítem 1:</span>\n          <span style=\"font-size: 13px; color: var(--text-muted);\">Letra:</span>\n          <select class=\"pareo-select-col2\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option><option value=\"D\">D</option><option value=\"E\">E</option>\n          </select>\n          <span style=\"font-size: 13px; color: var(--text-muted); margin-left: 8px;\">Romano:</span>\n          <select class=\"pareo-select-col3\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"I\">I</option><option value=\"II\">II</option><option value=\"III\">III</option><option value=\"IV\">IV</option><option value=\"V\">V</option>\n          </select>\n        </div>\n      \n        <div class=\"pareo-row-item\" data-num=\"2\" data-correct-letter=\"E\" data-correct-roman=\"I\" data-feedback=\"¡Excelente! Al igualar $\\sin(x-y) = k$, obtenemos $x-y = \\arcsin(k) \\implies y = x - \\arcsin(k)$, lo que define una familia de rectas paralelas con pendiente $1$. Dado el comportamiento de la función seno, esto solo es válido si $k \\in [-1, 1]$.\" style=\"display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;\">\n          <span style=\"font-weight: bold; width: 70px;\">Ítem 2:</span>\n          <span style=\"font-size: 13px; color: var(--text-muted);\">Letra:</span>\n          <select class=\"pareo-select-col2\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option><option value=\"D\">D</option><option value=\"E\">E</option>\n          </select>\n          <span style=\"font-size: 13px; color: var(--text-muted); margin-left: 8px;\">Romano:</span>\n          <select class=\"pareo-select-col3\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"I\">I</option><option value=\"II\">II</option><option value=\"III\">III</option><option value=\"IV\">IV</option><option value=\"V\">V</option>\n          </select>\n        </div>\n      \n        <div class=\"pareo-row-item\" data-num=\"3\" data-correct-letter=\"D\" data-correct-roman=\"V\" data-feedback=\"¡Muy bien! Elevando al cuadrado $\\sqrt{4x^2 + y^2} = k \\implies 4x^2 + y^2 = k^2$, obtenemos la ecuación canónica de elipses centradas en el origen. Debido a la raíz cuadrada de índice par, $k$ debe ser obligatoriamente no negativo ($k \\geq 0$).\" style=\"display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;\">\n          <span style=\"font-weight: bold; width: 70px;\">Ítem 3:</span>\n          <span style=\"font-size: 13px; color: var(--text-muted);\">Letra:</span>\n          <select class=\"pareo-select-col2\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option><option value=\"D\">D</option><option value=\"E\">E</option>\n          </select>\n          <span style=\"font-size: 13px; color: var(--text-muted); margin-left: 8px;\">Romano:</span>\n          <select class=\"pareo-select-col3\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"I\">I</option><option value=\"II\">II</option><option value=\"III\">III</option><option value=\"IV\">IV</option><option value=\"V\">V</option>\n          </select>\n        </div>\n      \n        <div class=\"pareo-row-item\" data-num=\"4\" data-correct-letter=\"A\" data-correct-roman=\"II\" data-feedback=\"¡Perfecto! Aplicando logaritmo natural a $e^{y - x^2} = k$, obtenemos $y - x^2 = \\ln(k) \\implies y = x^2 + \\ln(k)$, lo que corresponde a parábolas trasladadas verticalmente. Como la función exponencial siempre es positiva, $k &gt; 0$.\" style=\"display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;\">\n          <span style=\"font-weight: bold; width: 70px;\">Ítem 4:</span>\n          <span style=\"font-size: 13px; color: var(--text-muted);\">Letra:</span>\n          <select class=\"pareo-select-col2\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option><option value=\"D\">D</option><option value=\"E\">E</option>\n          </select>\n          <span style=\"font-size: 13px; color: var(--text-muted); margin-left: 8px;\">Romano:</span>\n          <select class=\"pareo-select-col3\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"I\">I</option><option value=\"II\">II</option><option value=\"III\">III</option><option value=\"IV\">IV</option><option value=\"V\">V</option>\n          </select>\n        </div>\n      \n        <div class=\"pareo-row-item\" data-num=\"5\" data-correct-letter=\"C\" data-correct-roman=\"IV\" data-feedback=\"¡Magistral! Al igualar $\\frac{-1}{x^2 + y^2} = k \\implies x^2 + y^2 = -\\frac{1}{k}$, obtenemos circunferencias. Como $x^2 + y^2$ es estrictamente positivo en su dominio (excluyendo el origen), la fracción completa es estrictamente negativa, por lo que $k &lt; 0$.\" style=\"display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;\">\n          <span style=\"font-weight: bold; width: 70px;\">Ítem 5:</span>\n          <span style=\"font-size: 13px; color: var(--text-muted);\">Letra:</span>\n          <select class=\"pareo-select-col2\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option><option value=\"D\">D</option><option value=\"E\">E</option>\n          </select>\n          <span style=\"font-size: 13px; color: var(--text-muted); margin-left: 8px;\">Romano:</span>\n          <select class=\"pareo-select-col3\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"I\">I</option><option value=\"II\">II</option><option value=\"III\">III</option><option value=\"IV\">IV</option><option value=\"V\">V</option>\n          </select>\n        </div>\n      \n        </div>\n\n        <button type=\"button\" class=\"btn btn-verify-pareados\" onclick=\"verifyQuizPareados3Col(this)\" style=\"margin-top: 16px; padding: 10px 22px; background: var(--accent-color); color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px;\">\n          <i class=\"fa-solid fa-circle-check\"></i> Verificar Asociaciones\n        </button>\n\n        <div class=\"quiz-feedback\" style=\"display:none; margin-top:16px; padding:14px; border-radius:8px;\"></div>\n      </div>\n    ",
          contentExercises: "[{\"id\":\"ex-1784912129566-vxqj\",\"title\":\"Círculos Tangentes y Completación de Cuadrados\",\"level\":\"resuelto\",\"statement\":\"<p>Determine el dominio natural, el recorrido y describa analíticamente la familia de curvas de nivel del campo escalar definido por:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ f(x,y) = \\\\frac{2y}{x^2 + y^2} $$</div></p>\",\"solution\":\"<p><strong>1. Dominio e Imagen:</strong>       La única restricción es que el denominador sea distinto de cero. Como la suma de cuadrados solo es cero en el origen, el dominio es todo el plano menos ese punto:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\operatorname{dom}(f) = \\\\{ (x,y) \\\\in \\\\mathbb{R}^2 \\\\colon x^2 + y^2 \\\\neq 0 \\\\} = \\\\mathbb{R}^2 \\\\setminus \\\\{(0,0)\\\\} $$</div>       Al evaluar a lo largo del eje Y (donde $x=0$), la función se reduce a $f(0,y) = \\\\frac{2y}{y^2} = \\\\frac{2}{y}$. Como $y$ puede ser cualquier valor real distinto de cero, la fracción $\\\\frac{2}{y}$ puede tomar cualquier valor real, por lo tanto, $\\\\operatorname{im}(f) = \\\\mathbb{R}$.</p>\\n<p><strong>2. Curvas de Nivel ($C_k$):</strong>       Planteamos la ecuación $f(x,y) = k$ para cualquier $k \\\\in \\\\operatorname{im}(f)$:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\frac{2y}{x^2 + y^2} = k $$</div></p>\\n<p>Debemos separar el análisis en dos casos:</p>\\n<p><em>Caso A ($k = 0$):</em>       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\frac{2y}{x^2 + y^2} = 0 \\\\implies 2y = 0 \\\\implies y = 0 $$</div>       La curva de nivel $C_0$ es el eje X ($y=0$), pero recordando la restricción del dominio, debemos excluir el origen. Así, $C_0$ corresponde a todo el eje X perforado en $(0,0)$.</p>\\n<p><em>Caso B ($k \\\\neq 0$):</em>       Multiplicamos por el denominador y reordenamos los términos para completar cuadrados respecto a la variable $y$:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">\\\\[\\n      \\\\begin{aligned}\\n        k(x^2 + y^2) &= 2y \\\\\\\\\\n        x^2 + y^2 - \\\\frac{2}{k}y &= 0 \\\\\\\\\\n        x^2 + \\\\left( y^2 - \\\\frac{2}{k}y + \\\\frac{1}{k^2} \\\\right) &= \\\\frac{1}{k^2} \\\\\\\\\\n        x^2 + \\\\left( y - \\\\frac{1}{k} \\\\right)^2 &= \\\\left( \\\\frac{1}{k} \\\\right)^2\\n      \\\\end{aligned}\\n      \\\\]</div></p>\\n<p><strong>Conclusión:</strong>       Para cada $k \\\\neq 0$, la curva de nivel $C_k$ es una <strong>circunferencia</strong> de radio $R = \\\\frac{1}{|k|}$, centrada en el punto $(0, \\\\frac{1}{k})$. Notemos que todas estas circunferencias pasan por el origen (ya que $0^2 + (0 - 1/k)^2 = 1/k^2$), pero el origen $(0,0) \\\\notin \\\\operatorname{dom}(f)$, por lo que es un punto excluido (\\\"agujero\\\") en cada una de ellas.</p>\"},{\"id\":\"ex-1784912129567-q9pr\",\"title\":\"Curvas de Nivel de Campos Radiales\",\"level\":\"nivel-3\",\"statement\":\"<p>Sea $f: \\\\mathbb{R}^2 \\\\to \\\\mathbb{R}$ un campo escalar con simetría radial, definido como $f(x,y) = g(x^2 + y^2)$, donde $g: [0, \\\\infty) \\\\to \\\\mathbb{R}$ es una función estrictamente creciente. Demuestre formalmente que cualquier curva de nivel no vacía $C_k$ de $f$ es una circunferencia centrada en el origen, y determine su radio.</p>\",\"solution\":\"<p>Por definición, la curva de nivel $C_k$ es el conjunto:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ C_k = \\\\{ (x,y) \\\\in \\\\operatorname{dom}(f) \\\\colon f(x,y) = k \\\\} $$</div>       Sustituyendo la regla de correspondencia de $f$:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ C_k = \\\\{ (x,y) \\\\in \\\\mathbb{R}^2 \\\\colon g(x^2 + y^2) = k \\\\} $$</div></p>\\n<p>Dado que la función $g$ es estrictamente creciente en su dominio, sabemos que $g$ es una función <strong>inyectiva</strong> (uno a uno). Esto garantiza que posee una función inversa bien definida $g^{-1}: \\\\operatorname{im}(g) \\\\to [0, \\\\infty)$.</p>\\n<p>Supongamos que $k \\\\in \\\\operatorname{im}(f)$. Entonces, podemos aplicar la inversa $g^{-1}$ a la ecuación de la curva de nivel:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ g(x^2 + y^2) = k \\\\implies x^2 + y^2 = g^{-1}(k) $$</div></p>\\n<p>Puesto que el dominio de $g$ (y por tanto el recorrido de $g^{-1}$) es $[0, \\\\infty)$, sabemos con certeza que $g^{-1}(k) \\\\geq 0$.       Definamos la constante $R^2 = g^{-1}(k)$. Entonces la ecuación se convierte en:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ x^2 + y^2 = R^2 $$</div>       Lo cual es exactamente la ecuación analítica de una circunferencia centrada en el origen $(0,0)$ con radio $R = \\\\sqrt{g^{-1}(k)}$. (Si $g^{-1}(k) = 0$, la curva degenera en el único punto origen). Queda así demostrado.</p>\"},{\"id\":\"ex-1784912129567-8479\",\"title\":\"Curvas de Nivel Exponenciales\",\"level\":\"nivel-2\",\"statement\":\"<p>Determine analíticamente la familia de curvas de nivel del campo escalar $f(x,y) = e^{xy}$. Identifique la geometría de las curvas dependiendo del signo de la constante $k$.</p>\",\"solution\":\"<p>Recuerda que $\\\\operatorname{im}(f) = (0, \\\\infty)$, por lo que debes igualar $e^{xy} = k$ asumiendo que $k > 0$. Al aplicar logaritmo natural, obtendrás $xy = \\\\ln(k)$.        Analiza qué sucede si $\\\\ln(k) > 0$ (es decir, $k > 1$), si $\\\\ln(k) < 0$ ($0 < k < 1$) y si $\\\\ln(k) = 0$ ($k = 1$). Deberías obtener familias de hipérbolas equiláteras y, en el caso especial, los ejes coordenados (rectas $x=0 \\\\vee y=0$).</p>\"},{\"id\":\"ex-1784912129568-ocs4\",\"title\":\"Cónicas y Combinación Lineal\",\"level\":\"nivel-2\",\"statement\":\"<p>Considere el campo escalar $h(x,y) = 4x^2 + 9y^2$. Describa detalladamente el mapa de contorno que se genera al graficar las curvas de nivel para $k \\\\in \\\\{0, 36, 144\\\\}$.</p>\",\"solution\":\"<p>Aquí $\\\\operatorname{im}(h) = [0, \\\\infty)$. Al igualar $4x^2 + 9y^2 = k$, deberás dividir toda la ecuación por $k$ para llevarla a la forma canónica $\\\\frac{x^2}{a^2} + \\\\frac{y^2}{b^2} = 1$. Verás que para $k>0$ el mapa de contorno corresponde a elipses centradas en el origen, donde su eje mayor descansa sobre el eje X y su eje menor sobre el eje Y. Para $k=0$, obtendrás un único punto.</p>\"}]",
          contentFormulas: "[{\"id\":\"form-1784912129563-tcs1\",\"title\":\"Grafo de un Campo Escalar\",\"latex\":\"\\\\operatorname{Gr}(f) = \\\\{ (x,y,z) \\\\in \\\\mathbb{R}^3 \\\\colon z = f(x,y) \\\\wedge (x,y) \\\\in \\\\operatorname{dom}(f) \\\\}\",\"description\":\"Superficie tridimensional generada por la función de dos variables en el espacio.\"},{\"id\":\"form-1784912129564-7q76\",\"title\":\"Curva de Nivel\",\"latex\":\"C_k = \\\\{ (x,y) \\\\in \\\\operatorname{dom}(f) \\\\colon f(x,y) = k \\\\}\",\"description\":\"Conjunto de puntos en el plano $XY$ donde la función toma un valor constante $k \\\\in \\\\operatorname{im}(f)$.\"},{\"id\":\"form-1784912129564-h9df\",\"title\":\"Completación de Cuadrados\",\"latex\":\"\\\\begin{aligned}\\n      x^2 + bx &= \\\\left(x + \\\\frac{b}{2}\\\\right)^2 - \\\\left(\\\\frac{b}{2}\\\\right)^2 \\\\\\\\[0.5em]\\n      ax^2 + bx &= a\\\\left(x + \\\\frac{b}{2a}\\\\right)^2 - \\\\frac{b^2}{4a}\\n    \\\\end{aligned}\",\"description\":\"Técnica algebraica indispensable para transformar expresiones cuadráticas dispersas a la forma canónica de circunferencias, elipses o parábolas desplazadas.\"},{\"id\":\"form-1784912129564-wvid\",\"title\":\"Relación Geométrica Clave\",\"latex\":\"\\\\begin{aligned}\\n      \\\\text{Pendiente pronunciada } &\\\\implies \\\\text{Curvas de nivel muy juntas} \\\\\\\\[0.5em]\\n      \\\\text{Región plana o suave } &\\\\implies \\\\text{Curvas de nivel muy separadas}\\n    \\\\end{aligned}\",\"description\":\"Interpretación visual fundamental para conectar el mapa de contorno bidimensional con la pendiente tridimensional del grafo.\"},{\"id\":\"form-1784912129564-5xbl\",\"title\":\"Invarianza por Simetría Radial\",\"latex\":\"f(x,y) = g(x^2 + y^2) \\\\implies C_k \\\\text{ son circunferencias}\",\"description\":\"Cuando el campo escalar depende exclusivamente de la distancia al origen, las curvas de nivel forman circunferencias concéntricas centradas en $(0,0)$.\"}]"
        }, {
          id: chapterIdCounter++,
          unitId: u1Id,
          chapterIndex: '1.3',
          title: 'Límites de Campos Escalares',
          isCompleted: false,
          isLocked: false,
          contentMotivation: "<p><strong>¿Cómo te aproximas a un destino cuando no hay un solo camino?</strong></p>\n<p>En Cálculo de una variable, acercarse a un punto $x = a$ era un asunto sencillo: solo podías caminar desde la izquierda ($x \\to a^-$) o desde la derecha ($x \\to a^+$). Si ambos caminos laterales te llevaban a la misma altura, el límite existía.</p>\n<p>Sin embargo, en el plano cartesiano $\\mathbb{R}^2$, estar en un punto $(x_0, y_0)$ es como estar en el centro de una plaza abierta. Puedes aproximarte a ese destino desde infinitas direcciones distintas: caminando en línea recta con cualquier pendiente, o siguiendo una parábola, una cúbica o cualquier curva imaginable.</p>\n<p>Para que el límite exista en varias variables, el campo escalar debe tender al mismo valor real $L$ **a lo largo de absolutamente todas las trayectorias posibles**. Basta con que un solo camino te entregue una altura distinta para que el límite no exista.</p>\n<div class=\"caja-ram caja-motivacion\"><div class=\"caja-ram-title\">💡 Pregunta Guía</div><div class=\"caja-ram-body\"><p>Si evaluamos un límite a lo largo de todas las rectas posibles $y = mx$ y en todas obtenemos el mismo valor $L$, ¿podemos asegurar con 100</p></div></div>",
          contentTheory: "<p>El estudio de límites en campos escalares establece las bases analíticas del cálculo multivariable. Para abordar el límite de una función en el plano, debemos formalizar primero la noción topológica del punto al cual nos aproximamos.</p>\n<div class=\"caja-ram caja-definicion\"><div class=\"caja-ram-title\"><i class=\"fa-solid fa-book-bookmark\"></i> Definición: Punto de Acumulación en $\\mathbb{R}^2$</div><div class=\"caja-ram-body\"><p>Un punto $(x_0, y_0) \\in \\mathbb{R}^2$ es un <strong>punto de acumulación</strong> de un conjunto $D \\subseteq \\mathbb{R}^2$ si para todo $\\delta > 0$, la bola abierta perforada $B_\\delta(x_0,y_0) \\setminus \\{(x_0,y_0)\\}$ contiene al menos un punto de $D$.</p>\n<p>Formalmente:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\forall \\delta > 0, \\quad \\Big( \\{ (x,y) \\in \\mathbb{R}^2 \\colon 0 < \\sqrt{(x-x_0)^2 + (y-y_0)^2} < \\delta \\} \\Big) \\cap D \\neq \\emptyset $$</div></p>\n<p><strong>Recordatorio:</strong> La expresión $\\sqrt{(x-x_0)^2 + (y-y_0)^2}$ representa la distancia euclidiana entre los puntos $(x,y)$ y $(x_0,y_0)$, la cual también se puede escribir como la norma de la diferencia $\\|(x,y) - (x_0,y_0)\\|$.</p>\n<p><strong>Ejemplos en $\\mathbb{R}^2$:</strong>     <ul style=\"margin: 8px 0; padding-left: 20px;\">\n      <li>Sea $D = \\{ (x,y) \\in \\mathbb{R}^2 \\colon x^2 + y^2 < 1 \\}$ (disco abierto de radio 1). Todos los puntos de la frontera $x^2 + y^2 = 1$ son puntos de acumulación de $D$, a pesar de no pertenecer al conjunto $D$.\n      </li><li>Sea $D = \\mathbb{R}^2 \\setminus \\{(0,0)\\}$. El origen $(0,0)$ no pertenece a $D$, pero es un punto de acumulación de $D$.\n    </li></ul></p></div></div>\n<div class=\"caja-ram caja-definicion\"><div class=\"caja-ram-title\"><i class=\"fa-solid fa-book-bookmark\"></i> Definición: Límite de un Campo Escalar ($\\varepsilon$-$\\delta$)</div><div class=\"caja-ram-body\"><p>Sea $f: D \\subseteq \\mathbb{R}^2 \\to \\mathbb{R}$ un campo escalar. Exigimos que $(a, b)$ sea punto de acumulación de $\\operatorname{dom}(f)$ porque así garantizamos que el conjunto de puntos $(x,y)$ tales que la distancia entre $(x,y)$ y $(a,b)$ es menor a $\\delta$, no es vacío, y por tanto la aproximación tiene sentido.</p>\n<p>Decimos que el <strong>límite</strong> de $f(x,y)$ cuando $(x,y)$ tiende a $(a, b)$ es $\\ell \\in \\mathbb{R}$, denotado por:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\lim_{(x,y) \\to (a, b)} f(x,y) = \\ell $$</div>     si y solo si:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\forall \\varepsilon > 0, \\; \\exists \\delta > 0 \\text{ tal que } 0 < \\overbrace{\\underbrace{\\|(x,y)-(a,b)\\|}_{\\begin{array}{l} \\text{distancia entre} \\\\ (x,y) \\text{ y } (a,b) \\end{array}}}^{=\\sqrt{(x-a)^2 + (y-b)^2}} < \\delta \\Longrightarrow \\underbrace{|f(x,y)-\\ell|}_{\\begin{array}{l} \\text{distancia entre } \\\\ f(x,y) \\text{ y } \\ell \\end{array}} < \\varepsilon $$</div></p></div></div>\n<div class=\"caja-ram caja-teorema\" style=\"border-left: 4px solid #10b981; background: var(--bg-card); padding: 16px; border-radius: 10px; margin: 16px 0;\"><div class=\"caja-ram-title\" style=\"font-weight: bold; color: #10b981; font-size: 15px; margin-bottom: 8px;\"><i class=\"fa-solid fa-square-root-variable\"></i> Teorema: Unicidad del Límite</div><div class=\"caja-ram-body\"><p>Sea $f: D \\subseteq \\mathbb{R}^2 \\to \\mathbb{R}$ un campo escalar y sea $(x_0, y_0)$ un punto de acumulación de $\\operatorname{dom}(f)$. Si el límite de $f(x,y)$ cuando $(x,y) \\to (x_0, y_0)$ existe, entonces este valor es único. Es decir, si:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\lim_{(x,y) \\to (x_0, y_0)} f(x,y) = L_1 \\quad \\wedge \\quad \\lim_{(x,y) \\to (x_0, y_0)} f(x,y) = L_2 $$</div>     entonces $L_1 = L_2$.</p></div></div>\n<div class=\"caja-ram caja-demostracion\" style=\"border-left: 3px solid var(--accent-color); background: var(--bg-secondary); padding: 14px; border-radius: 8px; margin: 12px 0;\"><p style=\"margin:0 0 8px 0;\"><strong>Demostración:</strong></p><div><p>Procederemos por contradicción. Supongamos que $L_1 \\neq L_2$, de modo que $|L_1 - L_2| > 0$. Definamos $\\varepsilon = \\frac{|L_1 - L_2|}{2} > 0$.</p>\n<p>Por la definición formal de límite:     <ul style=\"margin: 8px 0; padding-left: 20px;\">\n      <li>Para $\\lim_{(x,y) \\to (x_0,y_0)} f(x,y) = L_1$, existe $\\delta_1 > 0$ tal que si $0 < \\sqrt{(x-x_0)^2 + (y-y_0)^2} < \\delta_1$, entonces $|f(x,y) - L_1| < \\varepsilon$.\n      </li><li>Para $\\lim_{(x,y) \\to (x_0,y_0)} f(x,y) = L_2$, existe $\\delta_2 > 0$ tal que si $0 < \\sqrt{(x-x_0)^2 + (y-y_0)^2} < \\delta_2$, entonces $|f(x,y) - L_2| < \\varepsilon$.\n    </li></ul></p>\n<p>Dado que $(x_0,y_0)$ es punto de acumulación de $\\operatorname{dom}(f)$, en la bola perforada de radio $\\delta = \\min(\\delta_1, \\delta_2)$ existe al menos un punto $(x,y) \\in \\operatorname{dom}(f)$. Para dicho punto, aplicando la desigualdad triangular:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ |L_1 - L_2| = |(L_1 - f(x,y)) + (f(x,y) - L_2)| \\leq |f(x,y) - L_1| + |f(x,y) - L_2| $$</div>     Sustituyendo los acotamientos:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ |L_1 - L_2| < \\varepsilon + \\varepsilon = 2\\varepsilon = 2 \\left( \\frac{|L_1 - L_2|}{2} \\right) = |L_1 - L_2| $$</div>     Llegamos a la contradicción estricta $|L_1 - L_2| < |L_1 - L_2|$. Por lo tanto, el supuesto inicial es falso y se concluye que $L_1 = L_2$.</p></div></div>\n<div class=\"caja-ram caja-definicion\"><div class=\"caja-ram-title\">💡 Ejemplo: Cálculo de Límite por Definición $\\varepsilon$-$\\delta$</div><div class=\"caja-ram-body\"><p>Demuestre por definición que:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\lim_{(x,y) \\to (0,0)} \\frac{x^2}{\\sqrt{x^2 + y^2}} = 0 $$</div></p>\n<p><strong>Desarrollo:</strong>     Dado $\\varepsilon > 0$, debemos encontrar $\\delta > 0$ tal que si $0 < \\sqrt{x^2 + y^2} < \\delta$, entonces:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\left| \\frac{x^2}{\\sqrt{x^2 + y^2}} - 0 \\right| < \\varepsilon $$</div></p>\n<p>Como $x^2 \\leq x^2 + y^2$ para todo $(x,y) \\in \\mathbb{R}^2$, acotamos la expresión:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\left| \\frac{x^2}{\\sqrt{x^2 + y^2}} \\right| = \\frac{x^2}{\\sqrt{x^2 + y^2}} \\leq \\frac{x^2 + y^2}{\\sqrt{x^2 + y^2}} = \\sqrt{x^2 + y^2} $$</div></p>\n<p>Por lo tanto, basta elegir $\\delta = \\varepsilon$. De esta forma, si $0 < \\sqrt{x^2 + y^2} < \\delta$, se cumple directamente que:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\left| \\frac{x^2}{\\sqrt{x^2 + y^2}} - 0 \\right| \\leq \\sqrt{x^2 + y^2} < \\delta = \\varepsilon $$</div>     Quedando demostrado el límite por definición.</p></div></div>\n<p>En general, es complicado estudiar un límite usando la definición $\\varepsilon$-$\\delta$. Las siguientes herramientas analíticas nos permiten calcular límites de forma directa:</p>\n<div class=\"caja-ram caja-teorema\" style=\"border-left: 4px solid #10b981; background: var(--bg-card); padding: 16px; border-radius: 10px; margin: 16px 0;\"><div class=\"caja-ram-title\" style=\"font-weight: bold; color: #10b981; font-size: 15px; margin-bottom: 8px;\"><i class=\"fa-solid fa-square-root-variable\"></i> Teorema: Álgebra de Límites</div><div class=\"caja-ram-body\"><p>Si $\\lim_{(x,y) \\to (a,b)} f(x,y) = L$ y $\\lim_{(x,y) \\to (a,b)} g(x,y) = M$, y $c \\in \\mathbb{R}$ es una constante, entonces se cumplen las siguientes propiedades algebraicas:     <ol style=\"margin: 8px 0; padding-left: 20px;\">\n      <li><strong>Múltiplo escalar:</strong> $\\lim_{(x,y) \\to (a,b)} [c \\cdot f(x,y)] = c \\cdot L$\n      </li><li><strong>Suma y Resta:</strong> $\\lim_{(x,y) \\to (a,b)} [f(x,y) \\pm g(x,y)] = L \\pm M$\n      </li><li><strong>Producto:</strong> $\\lim_{(x,y) \\to (a,b)} [f(x,y) \\cdot g(x,y)] = L \\cdot M$\n      </li><li><strong>Cociente:</strong> $\\lim_{(x,y) \\to (a,b)} \\left[ \\frac{f(x,y)}{g(x,y)} \\right] = \\frac{L}{M}$, siempre que $M \\neq 0$.\n    </li></ol></p></div></div>\n<div class=\"caja-ram caja-motivacion\"><div class=\"caja-ram-title\"><i class=\"fa-solid fa-gears\"></i> Límites Notables</div><div class=\"caja-ram-body\"><p>Los límites notables de Cálculo de una Variable sirven para calcular límites de funciones de Varias Variables mediante sustituciones algebraicas directas.</p>\n<p><strong>Ejemplo:</strong>     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\lim_{(x,y) \\to (0,0)} \\frac{\\sin(xy)}{xy} $$</div>     Haciendo el cambio de variable $u = xy$, observamos que cuando $(x,y) \\to (0,0)$, la variable escalar $u \\to 0$. Aplicando el límite notable conocido en una variable:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\lim_{(x,y) \\to (0,0)} \\frac{\\sin(xy)}{xy} = \\lim_{u \\to 0} \\frac{\\sin(u)}{u} = 1 $$</div></p></div></div>\n<div class=\"caja-ram caja-teorema\" style=\"border-left: 4px solid #10b981; background: var(--bg-card); padding: 16px; border-radius: 10px; margin: 16px 0;\"><div class=\"caja-ram-title\" style=\"font-weight: bold; color: #10b981; font-size: 15px; margin-bottom: 8px;\"><i class=\"fa-solid fa-square-root-variable\"></i> Teorema: Teorema de Cero por Acotado</div><div class=\"caja-ram-body\"><p>Si $\\lim_{(x,y) \\to (a,b)} f(x,y) = 0$ y $g(x,y)$ es una función acotada en una vecindad perforada alrededor de $(a,b)$, entonces:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\lim_{(x,y) \\to (a,b)} [f(x,y)g(x,y)] = 0 $$</div></p></div></div>\n<div class=\"caja-ram caja-demostracion\" style=\"border-left: 3px solid var(--accent-color); background: var(--bg-secondary); padding: 14px; border-radius: 8px; margin: 12px 0;\"><p style=\"margin:0 0 8px 0;\"><strong>Demostración:</strong></p><div><p>Como $g(x,y)$ es acotada, existe una constante $M > 0$ tal que $|g(x,y)| \\leq M$ en una bola perforada de radio $\\delta_1 > 0$ centrada en $(a,b)$.</p>\n<p>Por otro lado, como $\\lim_{(x,y) \\to (a,b)} f(x,y) = 0$, para todo $\\varepsilon > 0$ existe $\\delta_2 > 0$ tal que si $0 < \\sqrt{(x-a)^2 + (y-b)^2} < \\delta_2$, entonces $|f(x,y)| < \\frac{\\varepsilon}{M}$.</p>\n<p>Eligiendo $\\delta = \\min(\\delta_1, \\delta_2)$, si $0 < \\sqrt{(x-a)^2 + (y-b)^2} < \\delta$, tenemos:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ |f(x,y)g(x,y) - 0| = |f(x,y)| \\cdot |g(x,y)| < \\frac{\\varepsilon}{M} \\cdot M = \\varepsilon $$</div>     Por lo tanto, $\\lim_{(x,y) \\to (a,b)} [f(x,y)g(x,y)] = 0$.</p></div></div>\n<div class=\"caja-ram error-comun\"><div class=\"caja-ram-title\"><i class=\"fa-solid fa-triangle-exclamation\"></i> Propiedades que dejan de ser válidas</div><div class=\"caja-ram-body\"><p>En Cálculo de varias variables <strong>no son aplicables</strong>:     <ul style=\"margin: 8px 0; padding-left: 20px;\">\n      <li><strong>Límites laterales simples:</strong> No bastan dos direcciones (izquierda/derecha). En $\\mathbb{R}^2$ la aproximación a un punto $(a,b)$ se puede realizar desde infinitas trayectorias planas.\n      </li><li><strong>Regla de L'Hôpital:</strong> No existe una extensión directa a funciones de varias variables, debido a la ausencia de un cociente de derivadas unidimensionales con sentido geométrico único.\n    </li></ul></p></div></div>",
          contentApplication: "<p>A continuación, aplicaremos la definición formal $\\varepsilon$-$\\delta$, los límites notables y los criterios de acotamiento desarrollados en la teoría para calcular rigurosamente límites multivariables.</p>\n<div class=\"caja-ram caja-definicion\"><div class=\"caja-ram-title\">💡 Ejemplo: Demostración por Definición $\\varepsilon$-$\\delta$</div><div class=\"caja-ram-body\"><p>Calcule por definición el siguiente límite:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\lim_{(x,y) \\to (0,0)} \\frac{x^2 y}{x^2 + y^2} $$</div></p>\n<p><strong>Solución y Desarrollo Riguroso:</strong></p>\n<p><strong>1. Candidato a Límite:</strong>     Evaluando formalmente a lo largo de la recta $y = x$:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\lim_{x \\to 0} \\frac{x^2 (x)}{x^2 + x^2} = \\lim_{x \\to 0} \\frac{x^3}{2x^2} = \\lim_{x \\to 0} \\frac{x}{2} = 0 $$</div>     Sospechamos fuertemente que el límite existe y su valor es $L = 0$.</p>\n<p><strong>2. Demostración mediante la definición $\\varepsilon$-$\\delta$:</strong>     Debemos probar que para todo $\\varepsilon > 0$, existe $\\delta > 0$ tal que si $0 < \\sqrt{x^2 + y^2} < \\delta$, entonces:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\left| \\frac{x^2 y}{x^2 + y^2} - 0 \\right| < \\varepsilon $$</div></p>\n<p><strong>3. Acotamiento algebraico:</strong>     Observamos que para todo $(x,y) \\neq (0,0)$, se cumple la desigualdad $x^2 \\leq x^2 + y^2$, de donde se deduce que:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\frac{x^2}{x^2 + y^2} \\leq 1 $$</div></p>\n<p>Multiplicando por $|y|$ a ambos lados:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\left| \\frac{x^2 y}{x^2 + y^2} \\right| = \\frac{x^2}{x^2 + y^2} \\cdot |y| \\leq 1 \\cdot |y| = |y| $$</div></p>\n<p>Además, sabemos que $|y| = \\sqrt{y^2} \\leq \\sqrt{x^2 + y^2}$. Por lo tanto:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\left| \\frac{x^2 y}{x^2 + y^2} - 0 \\right| \\leq \\sqrt{x^2 + y^2} $$</div></p>\n<p><strong>4. Elección del $\\delta$:</strong>     Dado $\\varepsilon > 0$, elegimos $\\delta = \\varepsilon$. Si $0 < \\sqrt{x^2 + y^2} < \\delta$, tenemos:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\left| \\frac{x^2 y}{x^2 + y^2} - 0 \\right| \\leq \\sqrt{x^2 + y^2} < \\delta = \\varepsilon $$</div></p>\n<p>Queda demostrado formalmente que:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\lim_{(x,y) \\to (0,0)} \\frac{x^2 y}{x^2 + y^2} = 0 $$</div></p></div></div>\n\n      <div class=\"quiz-block quiz-alternativas\" style=\"margin:24px 0; padding:20px; background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px;\">\n        <h4 style=\"margin:0 0 12px 0; font-size:16px; color:var(--text-primary);\"><i class=\"fa-solid fa-circle-question\" style=\"color:var(--accent-color);\"></i> Aplicación de Teoremas de Acotamiento</h4>\n        <p style=\"font-size:14px; color:var(--text-secondary); margin-bottom:12px;\">Para calcular $\\lim_{(x,y) \\to (0,0)} y^2 \\cos\\left(\\frac{1}{xy}\\right)$, ¿cuál es el argumento analítico correcto?</p>\n        <div class=\"quiz-options\">\n        <label class=\"quiz-option\" data-correct=\"false\" data-feedback=\"Aunque es cierto que el coseno oscila, estás olvidando analizar qué ocurre con el factor $y^2$ que lo multiplica.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"radio\" name=\"quiz-alt-1784912129576-85lq\" value=\"0\" data-correct=\"false\" data-feedback=\"Aunque es cierto que el coseno oscila, estás olvidando analizar qué ocurre con el factor $y^2$ que lo multiplica.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">El límite no existe porque la función coseno oscila infinitamente cuando su argumento crece sin cota.</span>\n        </label>\n      \n        <label class=\"quiz-option\" data-correct=\"false\" data-feedback=\"Recuerda la advertencia teórica: la Regla de L&#039;Hôpital no es aplicable directamente en funciones de varias variables.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"radio\" name=\"quiz-alt-1784912129576-85lq\" value=\"0\" data-correct=\"false\" data-feedback=\"Recuerda la advertencia teórica: la Regla de L&#039;Hôpital no es aplicable directamente en funciones de varias variables.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">Se debe utilizar la Regla de L'Hôpital derivando parcialmente respecto a $y$.</span>\n        </label>\n      \n        <label class=\"quiz-option\" data-correct=\"true\" data-feedback=\"¡Excelente! Tienes un término que tiende a cero ($y^2$) multiplicado por una función acotada ($|\\cos(u)| \\leq 1$). Esto garantiza que el producto tiende a cero.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"radio\" name=\"quiz-alt-1784912129576-85lq\" value=\"1\" data-correct=\"true\" data-feedback=\"¡Excelente! Tienes un término que tiende a cero ($y^2$) multiplicado por una función acotada ($|\\cos(u)| \\leq 1$). Esto garantiza que el producto tiende a cero.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">El límite es $0$ aplicando el Teorema de Cero por Acotado, ya que $\\lim_{(x,y)\\to(0,0)} y^2 = 0$ y el coseno siempre está acotado entre $-1$ y $1$.</span>\n        </label>\n      </div>\n        <button type=\"button\" class=\"btn btn-verify-quiz\" onclick=\"verifyQuizAlternatives(this)\" style=\"margin-top:12px; padding:8px 18px; background:var(--accent-color); color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;\">Verificar Respuesta</button>\n        <div class=\"quiz-feedback\" style=\"display:none; margin-top:12px; padding:12px; border-radius:8px;\"></div>\n      </div>\n    \n\n      <div class=\"quiz-block quiz-vf\" data-correct=\"F\" data-feedback-true=\"Incorrecto. Cuidado con esta trampa lógica. Evaluar dos caminos y obtener el mismo resultado no demuestra la existencia del límite general. La unicidad se aplica solo &lt;strong&gt;después&lt;/strong&gt; de haber probado que el límite existe para toda trayectoria y vecindad.\" data-feedback-false=\"¡Correcto! El Teorema de Unicidad afirma que &lt;strong&gt;si el límite general existe&lt;/strong&gt;, es único. Aproximarse por solo dos caminos no garantiza la existencia del límite general.\" style=\"margin:24px 0; padding:20px; background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px;\">\n        <h4 style=\"margin:0 0 8px 0; font-size:16px; color:var(--text-primary);\"><i class=\"fa-solid fa-toggle-on\" style=\"color:var(--accent-color);\"></i> V/F: Unicidad del Límite y Puntos de Acumulación</h4>\n        <p style=\"font-size:14px; color:var(--text-secondary); margin-bottom:12px;\">Si evaluamos un campo escalar $f(x,y)$ acercándonos al origen a lo largo de los ejes $x=0$ e $y=0$, y en ambos casos el límite es $L=5$, entonces el Teorema de Unicidad garantiza que $\\lim_{(x,y) \\to (0,0)} f(x,y) = 5$.</p>\n        <div style=\"display:flex; gap:16px; margin:12px 0;\">\n          <label style=\"display:flex; align-items:center; gap:6px; cursor:pointer;\">\n            <input type=\"radio\" name=\"quiz-vf-1784912129576-bknw\" value=\"V\" style=\"accent-color:var(--accent-color);\"> <strong>Verdadero (V)</strong>\n          </label>\n          <label style=\"display:flex; align-items:center; gap:6px; cursor:pointer;\">\n            <input type=\"radio\" name=\"quiz-vf-1784912129576-bknw\" value=\"F\" style=\"accent-color:var(--accent-color);\"> <strong>Falso (F)</strong>\n          </label>\n        </div>\n        <button type=\"button\" class=\"btn btn-verify-vf\" onclick=\"verifyQuizVF(this)\" style=\"margin-top:8px; padding:8px 18px; background:var(--accent-color); color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;\">Verificar</button>\n        <div class=\"quiz-feedback\" style=\"display:none; margin-top:12px; padding:12px; border-radius:8px;\"></div>\n      </div>\n    \n\n      <div class=\"quiz-block quiz-casillas\" style=\"margin:24px 0; padding:20px; background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px;\">\n        <h4 style=\"margin:0 0 12px 0; font-size:16px; color:var(--text-primary);\"><i class=\"fa-solid fa-list-check\" style=\"color:var(--accent-color);\"></i> Selección Múltiple: Elementos de la Definición Formal</h4>\n        <p style=\"font-size:14px; color:var(--text-secondary); margin-bottom:12px;\">Respecto a la definición formal de límite $\\varepsilon$-$\\delta$ en $\\mathbb{R}^2$, selecciona <strong>todas</strong> las afirmaciones que sean matemáticamente correctas:</p>\n        <div class=\"quiz-casillas-options\">\n        <label class=\"quiz-casilla-option\" data-correct=\"false\" data-feedback=\"Falso. Solo se exige que $(a,b)$ sea un punto de acumulación de $\\operatorname{dom}(f)$, no que pertenezca a él.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"checkbox\" value=\"0\" data-correct=\"0\" data-feedback=\"Falso. Solo se exige que $(a,b)$ sea un punto de acumulación de $\\operatorname{dom}(f)$, no que pertenezca a él.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">El punto $(a, b)$ debe pertenecer obligatoriamente a $\\operatorname{dom}(f)$.</span>\n        </label>\n      \n        <label class=\"quiz-casilla-option\" data-correct=\"true\" data-feedback=\"¡Correcto! En la demostración, construimos $\\delta$ en función de $\\varepsilon$ (por ejemplo, $\\delta = \\varepsilon$) para forzar el acotamiento.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"checkbox\" value=\"1\" data-correct=\"1\" data-feedback=\"¡Correcto! En la demostración, construimos $\\delta$ en función de $\\varepsilon$ (por ejemplo, $\\delta = \\varepsilon$) para forzar el acotamiento.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">El valor de $\\delta$ generalmente depende de la tolerancia $\\varepsilon$ elegida o entregada.</span>\n        </label>\n      \n        <label class=\"quiz-casilla-option\" data-correct=\"true\" data-feedback=\"¡Exacto! Esa es la definición de distancia euclidiana delimitando una región circular en $\\mathbb{R}^2$.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"checkbox\" value=\"2\" data-correct=\"1\" data-feedback=\"¡Exacto! Esa es la definición de distancia euclidiana delimitando una región circular en $\\mathbb{R}^2$.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">La inecuación $\\sqrt{(x-a)^2 + (y-b)^2} < \\delta$ describe geométricamente una bola abierta (disco) en el plano.</span>\n        </label>\n      \n        <label class=\"quiz-casilla-option\" data-correct=\"true\" data-feedback=\"¡Muy bien! Acotar la función entre $-g(x,y)$ y $g(x,y)$ es justamente lo que hacemos en el álgebra de desigualdades para forzar que el resultado sea menor a $\\varepsilon$.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"checkbox\" value=\"3\" data-correct=\"1\" data-feedback=\"¡Muy bien! Acotar la función entre $-g(x,y)$ y $g(x,y)$ es justamente lo que hacemos en el álgebra de desigualdades para forzar que el resultado sea menor a $\\varepsilon$.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">El Teorema del Sándwich (Acotamiento) es una consecuencia directa de esta definición.</span>\n        </label>\n      </div>\n        <button type=\"button\" class=\"btn btn-verify-casillas\" onclick=\"verifyQuizCasillas(this)\" style=\"margin-top:12px; padding:8px 18px; background:var(--accent-color); color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;\">Verificar Selecciones</button>\n        <div class=\"quiz-feedback\" style=\"display:none; margin-top:12px; padding:12px; border-radius:8px;\"></div>\n      </div>\n    \n\n      <div class=\"quiz-block quiz-pareados-3col\" style=\"margin: 24px 0; padding: 20px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px;\">\n        <h4 style=\"margin: 0 0 16px 0; font-size: 16px; color: var(--text-primary);\">\n          <i class=\"fa-solid fa-network-wired\" style=\"color: var(--accent-color);\"></i> Asociación: Límite, Técnica Analítica y Resultado\n        </h4>\n\n        <!-- TRES COLUMNAS LATERALES -->\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 20px;\">\n          <div>\n            <h5 style=\"margin: 0 0 8px 0; color: var(--accent-color); font-size: 14px;\">Columna 1: Expresiones</h5>\n            <div style=\"display: flex; flex-direction: column; gap: 8px;\"><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>1.</strong> $\\lim_{(x,y)\\to(0,0)} \\frac{\\sin(x^2+y^2)}{x^2+y^2}$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>2.</strong> $\\lim_{(x,y)\\to(1,2)} (3xy - y^2)$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>3.</strong> $\\lim_{(x,y)\\to(0,0)} x^2 \\arctan\\left(\\frac{1}{y}\\right)$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>4.</strong> $\\lim_{(x,y)\\to(3,3)} \\frac{x^2-y^2}{x-y}$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>5.</strong> $\\lim_{(x,y)\\to(0,0)} \\frac{1-\\cos(x^2+y^2)}{(x^2+y^2)^2}$</div></div>\n          </div>\n          <div>\n            <h5 style=\"margin: 0 0 8px 0; color: var(--accent-color); font-size: 14px;\">Columna 2: Técnicas Analíticas</h5>\n            <div style=\"display: flex; flex-direction: column; gap: 8px;\"><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>A.</strong> Simplificación algebraica (Factorización)</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>B.</strong> Teorema de Cero por Acotado</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>C.</strong> Límite Notable con coseno</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>D.</strong> Evaluación directa (Álgebra de límites)</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>E.</strong> Límite Notable trigonométrico (Seno)</div></div>\n          </div>\n          <div>\n            <h5 style=\"margin: 0 0 8px 0; color: var(--accent-color); font-size: 14px;\">Columna 3: Resultados</h5>\n            <div style=\"display: flex; flex-direction: column; gap: 8px;\"><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>I.</strong> $2$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>II.</strong> $6$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>III.</strong> $0$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>IV.</strong> $1$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>V.</strong> $1/2$</div></div>\n          </div>\n        </div>\n\n        <!-- FILAS DE SELECCIÓN DE ASOCIACIÓN -->\n        <h5 style=\"margin: 16px 0 10px 0; font-size: 14px; color: var(--text-primary);\">Asocia cada Ítem de la Columna 1 con su Letra (Col 2) y Romano (Col 3):</h5>\n        <div style=\"display: flex; flex-direction: column; gap: 10px;\">\n          \n        <div class=\"pareo-row-item\" data-num=\"1\" data-correct-letter=\"E\" data-correct-roman=\"IV\" data-feedback=\"¡Correcto! Usando la sustitución $u = x^2+y^2$, el límite se transforma en el notable $\\lim_{u\\to0} \\frac{\\sin(u)}{u} = 1$.\" style=\"display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;\">\n          <span style=\"font-weight: bold; width: 70px;\">Ítem 1:</span>\n          <span style=\"font-size: 13px; color: var(--text-muted);\">Letra:</span>\n          <select class=\"pareo-select-col2\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option><option value=\"D\">D</option><option value=\"E\">E</option>\n          </select>\n          <span style=\"font-size: 13px; color: var(--text-muted); margin-left: 8px;\">Romano:</span>\n          <select class=\"pareo-select-col3\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"I\">I</option><option value=\"II\">II</option><option value=\"III\">III</option><option value=\"IV\">IV</option><option value=\"V\">V</option>\n          </select>\n        </div>\n      \n        <div class=\"pareo-row-item\" data-num=\"2\" data-correct-letter=\"D\" data-correct-roman=\"I\" data-feedback=\"¡Excelente! Al ser un polinomio y $(1,2)$ pertenecer al dominio, evaluamos directamente: $3(1)(2) - 2^2 = 6 - 4 = 2$.\" style=\"display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;\">\n          <span style=\"font-weight: bold; width: 70px;\">Ítem 2:</span>\n          <span style=\"font-size: 13px; color: var(--text-muted);\">Letra:</span>\n          <select class=\"pareo-select-col2\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option><option value=\"D\">D</option><option value=\"E\">E</option>\n          </select>\n          <span style=\"font-size: 13px; color: var(--text-muted); margin-left: 8px;\">Romano:</span>\n          <select class=\"pareo-select-col3\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"I\">I</option><option value=\"II\">II</option><option value=\"III\">III</option><option value=\"IV\">IV</option><option value=\"V\">V</option>\n          </select>\n        </div>\n      \n        <div class=\"pareo-row-item\" data-num=\"3\" data-correct-letter=\"B\" data-correct-roman=\"III\" data-feedback=\"¡Perfecto! El término $x^2 \\to 0$ y la función arco tangente está estrictamente acotada entre $-\\pi/2$ y $\\pi/2$. Por el Teorema de Cero por Acotado, el límite es $0$.\" style=\"display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;\">\n          <span style=\"font-weight: bold; width: 70px;\">Ítem 3:</span>\n          <span style=\"font-size: 13px; color: var(--text-muted);\">Letra:</span>\n          <select class=\"pareo-select-col2\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option><option value=\"D\">D</option><option value=\"E\">E</option>\n          </select>\n          <span style=\"font-size: 13px; color: var(--text-muted); margin-left: 8px;\">Romano:</span>\n          <select class=\"pareo-select-col3\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"I\">I</option><option value=\"II\">II</option><option value=\"III\">III</option><option value=\"IV\">IV</option><option value=\"V\">V</option>\n          </select>\n        </div>\n      \n        <div class=\"pareo-row-item\" data-num=\"4\" data-correct-letter=\"A\" data-correct-roman=\"II\" data-feedback=\"¡Muy bien! Se factoriza la diferencia de cuadrados en el numerador como $(x-y)(x+y)$. Al simplificar $(x-y)$, nos queda $\\lim (x+y) = 3+3 = 6$.\" style=\"display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;\">\n          <span style=\"font-weight: bold; width: 70px;\">Ítem 4:</span>\n          <span style=\"font-size: 13px; color: var(--text-muted);\">Letra:</span>\n          <select class=\"pareo-select-col2\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option><option value=\"D\">D</option><option value=\"E\">E</option>\n          </select>\n          <span style=\"font-size: 13px; color: var(--text-muted); margin-left: 8px;\">Romano:</span>\n          <select class=\"pareo-select-col3\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"I\">I</option><option value=\"II\">II</option><option value=\"III\">III</option><option value=\"IV\">IV</option><option value=\"V\">V</option>\n          </select>\n        </div>\n      \n        <div class=\"pareo-row-item\" data-num=\"5\" data-correct-letter=\"C\" data-correct-roman=\"V\" data-feedback=\"¡Magistral! Haciendo el cambio $u = x^2+y^2$, obtenemos el límite notable canónico $\\lim_{u\\to0} \\frac{1-\\cos(u)}{u^2} = \\frac{1}{2}$.\" style=\"display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;\">\n          <span style=\"font-weight: bold; width: 70px;\">Ítem 5:</span>\n          <span style=\"font-size: 13px; color: var(--text-muted);\">Letra:</span>\n          <select class=\"pareo-select-col2\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option><option value=\"D\">D</option><option value=\"E\">E</option>\n          </select>\n          <span style=\"font-size: 13px; color: var(--text-muted); margin-left: 8px;\">Romano:</span>\n          <select class=\"pareo-select-col3\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"I\">I</option><option value=\"II\">II</option><option value=\"III\">III</option><option value=\"IV\">IV</option><option value=\"V\">V</option>\n          </select>\n        </div>\n      \n        </div>\n\n        <button type=\"button\" class=\"btn btn-verify-pareados\" onclick=\"verifyQuizPareados3Col(this)\" style=\"margin-top: 16px; padding: 10px 22px; background: var(--accent-color); color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px;\">\n          <i class=\"fa-solid fa-circle-check\"></i> Verificar Asociaciones\n        </button>\n\n        <div class=\"quiz-feedback\" style=\"display:none; margin-top:16px; padding:14px; border-radius:8px;\"></div>\n      </div>\n    ",
          contentExercises: "[{\"id\":\"ex-1784912129573-fwj9\",\"title\":\"Límite vía Separación y Resultados Conocidos\",\"level\":\"resuelto\",\"statement\":\"<p>A partir de los resultados analíticos previamente calculados, determine el valor de:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\lim_{(x,y) \\\\to (0,0)} \\\\frac{x^2 y + x y^2}{x^2 + y^2} $$</div></p>\",\"solution\":\"<p><strong>1. Descomposición por Aditividad:</strong>       Aprovechando la estructura del numerador, separamos la fracción en la suma de dos términos racionales:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\frac{x^2 y + x y^2}{x^2 + y^2} = \\\\frac{x^2 y}{x^2 + y^2} + \\\\frac{x y^2}{x^2 + y^2} $$</div></p>\\n<p><strong>2. Aplicación de Resultados Previos:</strong>       En la Pestaña 3 de Aplicación demostramos por definición $\\\\varepsilon$-$\\\\delta$ que:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\lim_{(x,y) \\\\to (0,0)} \\\\frac{x^2 y}{x^2 + y^2} = 0 $$</div></p>\\n<p>Por simetría algebraica de las variables $x$ e $y$ (o bien aplicando un acotamiento idéntico $\\\\left|\\\\frac{x y^2}{x^2 + y^2}\\\\right| \\\\leq |x| \\\\leq \\\\sqrt{x^2+y^2}$), se verifica directamente que:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\lim_{(x,y) \\\\to (0,0)} \\\\frac{x y^2}{x^2 + y^2} = 0 $$</div></p>\\n<p><strong>3. Conclusión por el Álgebra de Límites:</strong>       Dado que ambos límites individuales existen y son finitos, aplicamos la propiedad de la suma del Álgebra de Límites:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">\\\\[\\\\begin{aligned}\\n        \\\\lim_{(x,y) \\\\to (0,0)} \\\\frac{x^2 y + x y^2}{x^2 + y^2} &= \\\\lim_{(x,y) \\\\to (0,0)} \\\\frac{x^2 y}{x^2 + y^2} + \\\\lim_{(x,y) \\\\to (0,0)} \\\\frac{x y^2}{x^2 + y^2} \\\\\\\\[0.5em]\\n        &= 0 + 0 = 0\\n      \\\\end{aligned}\\\\]</div></p>\"},{\"id\":\"ex-1784912129574-svwb\",\"title\":\"Invarianza por Unicidad y Construcción $\\\\varepsilon$-$\\\\delta$\",\"level\":\"nivel-3\",\"statement\":\"<p>Demuestre formalmente que si $\\\\lim_{(x,y) \\\\to (a,b)} f(x,y) = L$, entonces $\\\\lim_{(x,y) \\\\to (a,b)} |f(x,y)| = |L|$.</p>\",\"solution\":\"<p>Sea $\\\\varepsilon > 0$ arbitrario. Dado que $\\\\lim_{(x,y) \\\\to (a,b)} f(x,y) = L$, existe un $\\\\delta > 0$ tal que si $0 < \\\\sqrt{(x-a)^2 + (y-b)^2} < \\\\delta$, entonces:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ |f(x,y) - L| < \\\\varepsilon $$</div></p>\\n<p>Por la propiedad de la desigualdad triangular en su forma reversa para números reales, sabemos que para cualesquiera $A, B \\\\in \\\\mathbb{R}$:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ ||A| - |B|| \\\\leq |A - B| $$</div></p>\\n<p>Haciendo $A = f(x,y)$ y $B = L$, tenemos:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ ||f(x,y)| - |L|| \\\\leq |f(x,y) - L| $$</div></p>\\n<p>Por lo tanto, para el mismo $\\\\delta > 0$, si $0 < \\\\sqrt{(x-a)^2 + (y-b)^2} < \\\\delta$, se cumple encadenadamente que:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ ||f(x,y)| - |L|| \\\\leq |f(x,y) - L| < \\\\varepsilon $$</div></p>\\n<p>Quedando demostrado por definición que $\\\\lim_{(x,y) \\\\to (a,b)} |f(x,y)| = |L|$.</p>\"},{\"id\":\"ex-1784912129574-p817\",\"title\":\"Límite Combinado de Seno y Raíz\",\"level\":\"nivel-2\",\"statement\":\"<p>Evalúe analíticamente el siguiente límite demostrando su convergencia:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\lim_{(x,y) \\\\to (0,0)} \\\\frac{x^2 \\\\sin(x^2 + y^2)}{\\\\sqrt{x^2 + y^2}} $$</div></p>\",\"solution\":\"<p>Puedes reescribir la expresión reordenando sus términos como $x^2 \\\\cdot \\\\frac{\\\\sin(x^2 + y^2)}{x^2 + y^2} \\\\cdot \\\\sqrt{x^2 + y^2}$. Utiliza el límite notable $\\\\lim_{u \\\\to 0} \\\\frac{\\\\sin(u)}{u} = 1$ haciendo $u = x^2 + y^2$ junto con el Álgebra de Límites, o bien acota utilizando que $|\\\\sin(u)| \\\\leq 1$ para aplicar Cero por Acotado.</p>\"},{\"id\":\"ex-1784912129574-04k4\",\"title\":\"Resolución de Indeterminaciones por Factorización\",\"level\":\"nivel-2\",\"statement\":\"<p>Evalúe el siguiente límite analítico determinando la factorización adecuada:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\lim_{(x,y) \\\\to (3,3)} \\\\frac{x^3 - y^3}{x - y} $$</div></p>\",\"solution\":\"<p>Aplica la diferencia de cubos $A^3 - B^3 = (A - B)(A^2 + AB + B^2)$ en el numerador y simplifica el factor $(x-y)$.</p>\"},{\"id\":\"ex-1784912129574-uwl2\",\"title\":\"Funciones Oscilantes Acotadas\",\"level\":\"nivel-2\",\"statement\":\"<p>Demuestre la existencia y calcule el valor del límite:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\lim_{(x,y) \\\\to (0,0)} x^2 \\\\sin\\\\left(\\\\frac{1}{xy}\\\\right) $$</div></p>\",\"solution\":\"<p>Aplica el Teorema de Cero por Acotado notando que $x^2 \\\\to 0$ y que $\\\\left|\\\\sin\\\\left(\\\\frac{1}{xy}\\\\right)\\\\right| \\\\leq 1$.</p>\"}]",
          contentFormulas: "[{\"id\":\"form-1784912129573-axb0\",\"title\":\"Definición Formal de Límite ($\\\\varepsilon$-$\\\\delta$)\",\"latex\":\"\\\\forall \\\\varepsilon > 0, \\\\; \\\\exists \\\\delta > 0 \\\\colon 0 < \\\\sqrt{(x-a)^2 + (y-b)^2} < \\\\delta \\\\implies |f(x,y) - \\\\ell| < \\\\varepsilon\",\"description\":\"Condición topológica estricta que garantiza que, para cualquier margen de error $\\\\varepsilon$ en la salida $Z$, existe un disco de radio $\\\\delta$ en el plano $XY$ donde todas las imágenes están atrapadas.\"},{\"id\":\"form-1784912129573-wuef\",\"title\":\"Distancia Euclidiana en $\\\\mathbb{R}^2$\",\"latex\":\"d((x,y), (a,b)) = \\\\sqrt{(x-a)^2 + (y-b)^2} = \\\\|(x,y) - (a,b)\\\\|\",\"description\":\"Medida de la separación entre dos puntos en el plano. Es el núcleo de la inecuación que define el radio $\\\\delta$ en la aproximación al punto de acumulación.\"},{\"id\":\"form-1784912129573-bare\",\"title\":\"Álgebra de Límites\",\"latex\":\"\\\\begin{aligned}\\n      \\\\lim [f(x,y) \\\\pm g(x,y)] &= L \\\\pm M \\\\\\\\[0.5em]\\n      \\\\lim [f(x,y) \\\\cdot g(x,y)] &= L \\\\cdot M \\\\\\\\[0.5em]\\n      \\\\lim \\\\left[ \\\\frac{f(x,y)}{g(x,y)} \\\\right] &= \\\\frac{L}{M} \\\\quad (M \\\\neq 0)\\n    \\\\end{aligned}\",\"description\":\"Propiedades operativas que permiten separar y evaluar límites complejos por partes, siempre y cuando los límites individuales $L$ y $M$ existan y sean finitos.\"},{\"id\":\"form-1784912129573-wpop\",\"title\":\"Teorema de Cero por Acotado\",\"latex\":\"\\\\lim_{(x,y) \\\\to (a,b)} f(x,y) = 0 \\\\quad \\\\wedge \\\\quad |g(x,y)| \\\\leq M \\\\implies \\\\lim_{(x,y) \\\\to (a,b)} [f(x,y)g(x,y)] = 0\",\"description\":\"Herramienta analítica para resolver indeterminaciones. Si un término se anula y el otro permanece acotado, el producto tiende indefectiblemente a cero.\"},{\"id\":\"form-1784912129573-mnkr\",\"title\":\"Límite Notable Clásico\",\"latex\":\"\\\\lim_{u \\\\to 0} \\\\frac{\\\\sin(u)}{u} = 1 \\\\implies \\\\lim_{(x,y) \\\\to (0,0)} \\\\frac{\\\\sin(xy)}{xy} = 1\",\"description\":\"Sustitución directa ($u = xy$ o $u = x^2+y^2$) que permite importar resultados conocidos de Cálculo de una variable al plano bidimensional.\"}]"
        }, {
          id: chapterIdCounter++,
          unitId: u1Id,
          chapterIndex: '1.4',
          title: 'Criterios de Límites',
          isCompleted: false,
          isLocked: false,
          contentMotivation: "<p><strong>El laberinto de las infinitas dimensiones</strong></p>\n<p>En el capítulo anterior, vimos que para que un límite exista en $\\mathbb{R}^2$, el valor al cual nos aproximamos debe ser exactamente el mismo sin importar el camino que elijamos para llegar al punto de destino.</p>\n<p>Esto presenta un desafío monumental: no podemos evaluar <em>infinitas</em> trayectorias manualmente para demostrar que un límite existe. Sin embargo, esta misma dificultad se convierte en nuestra mejor arma cuando queremos demostrar que un límite <strong>no existe</strong>.</p>\n<p>Basta con encontrar dos simples caminos (ya sean rectas, parábolas o iteraciones en los ejes) que nos lleven a destinos diferentes para afirmar con total seguridad matemática que el límite global es una ilusión. Además, introduciremos las coordenadas polares, una herramienta poderosa que \"agrupa\" todas esas infinitas trayectorias lineales en un solo radio y nos facilita la vida en los casos más complejos.</p>\n<div class=\"caja-ram caja-motivacion\"><div class=\"caja-ram-title\">💡 Pregunta Guía</div><div class=\"caja-ram-body\"><p>Si evalúas un límite acercándote al origen por el eje $X$ y obtienes un valor de $1$, pero al acercarte por el eje $Y$ obtienes un valor de $0$, ¿qué puedes concluir sobre el comportamiento global de esa función en el origen?</p></div></div>",
          contentTheory: "<p>En este capítulo estudiaremos los criterios analíticos fundamentales para demostrar la <strong>inexistencia</strong> de límites de campos escalares, así como la técnica de transformación a <strong>coordenadas polares</strong> para abordar el estudio de límites en el origen.</p>\n<h4>1. Criterio de Límites por Caminos (Trayectorias)</h4>\n<div class=\"caja-ram caja-teorema\" style=\"border-left: 4px solid #10b981; background: var(--bg-card); padding: 16px; border-radius: 10px; margin: 16px 0;\"><div class=\"caja-ram-title\" style=\"font-weight: bold; color: #10b981; font-size: 15px; margin-bottom: 8px;\"><i class=\"fa-solid fa-square-root-variable\"></i> Teorema: Inexistencia por Caminos</div><div class=\"caja-ram-body\"><p>Sean $f: D \\subseteq \\mathbb{R}^2 \\to \\mathbb{R}$ y $(a,b)$ un punto de acumulación de $\\operatorname{dom}(f)$. Si existen dos trayectorias continuas $\\vec{r}_1, \\vec{r}_2: [t_0, t_1] \\to D \\setminus \\{(a,b)\\}$ tales que:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\displaystyle\\lim_{t \\to t_0^+} \\vec{r}_1(t) = (a,b) \\quad \\wedge \\quad \\displaystyle\\lim_{t \\to t_0^+} \\vec{r}_2(t) = (a,b) $$</div>     y se cumple que:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\displaystyle\\lim_{t \\to t_0^+} f(\\vec{r}_1(t)) = L_1 \\quad \\wedge \\quad \\displaystyle\\lim_{t \\to t_0^+} f(\\vec{r}_2(t)) = L_2 $$</div>     con $L_1 \\neq L_2$, entonces el límite doble $\\displaystyle\\lim_{(x,y) \\to (a,b)} f(x,y)$ <strong>no existe</strong>.</p></div></div>\n<div class=\"caja-ram caja-demostracion\" style=\"border-left: 3px solid var(--accent-color); background: var(--bg-secondary); padding: 14px; border-radius: 8px; margin: 12px 0;\"><p style=\"margin:0 0 8px 0;\"><strong>Demostración:</strong></p><div><p>Procederemos por contradicción. Supongamos que el límite doble existe y es igual a $L \\in \\mathbb{R}$, es decir:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\displaystyle\\lim_{(x,y) \\to (a,b)} f(x,y) = L $$</div>     Por la definición formal $\\varepsilon$-$\\delta$, para todo $\\varepsilon > 0$ existe un $\\delta > 0$ tal que si $(x,y) \\in \\operatorname{dom}(f) \\wedge 0 < \\|(x,y) - (a,b)\\| < \\delta$, entonces:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ |f(x,y) - L| < \\varepsilon $$</div></p>\n<p>Sea $\\vec{r}_1(t)$ la primera trayectoria continua en $\\operatorname{dom}(f)$ tal que $\\displaystyle\\lim_{t \\to t_0^+} \\vec{r}_1(t) = (a,b)$. Dado el mismo $\\delta > 0$, por continuidad de la curva existe un $\\eta > 0$ tal que si $t_0 < t < t_0 + \\eta$, entonces:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ 0 < \\|\\vec{r}_1(t) - (a,b)\\| < \\delta $$</div></p>\n<p>En consecuencia, para todo $t \\in (t_0, t_0 + \\eta)$, se satisface la desigualdad:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ |f(\\vec{r}_1(t)) - L| < \\varepsilon $$</div>     Lo que por definición de límite de una variable real implica que:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\displaystyle\\lim_{t \\to t_0^+} f(\\vec{r}_1(t)) = L \\implies L_1 = L $$</div></p>\n<p>Repitiendo exactamente el mismo argumento para la trayectoria $\\vec{r}_2(t)$, deducimos que $L_2 = L$. Por lo tanto, $L_1 = L_2 = L$, lo cual contradice el supuesto inicial de que $L_1 \\neq L_2$.     Se concluye que el límite doble $\\displaystyle\\lim_{(x,y) \\to (a,b)} f(x,y)$ no existe.</p></div></div>\n<div class=\"caja-ram error-comun\"><div class=\"caja-ram-title\"><i class=\"fa-solid fa-triangle-exclamation\"></i> Observación Fundamental sobre Caminos</div><div class=\"caja-ram-body\"><p>Si evalúas el límite por dos caminos distintos $A_1$ y $A_2$ y obtienes el mismo resultado ($L_1 = L_2$), <strong>no se puede concluir nada</strong> sobre la existencia del límite original. La coincidencia sobre un conjunto infinito de caminos no demuestra la existencia; sin embargo, un solo desacuerdo la refuta.</p></div></div>\n<div class=\"caja-ram caja-motivacion\"><div class=\"caja-ram-title\"><i class=\"fa-solid fa-gears\"></i> Caminos Usuales de Aproximación al {$(0,0)$}</div><div class=\"caja-ram-body\"><p>Para evaluar límites en el origen, las familias de curvas más utilizadas son:     <ul style=\"margin: 8px 0; padding-left: 20px;\">\n      <li><strong>Ejes coordenados:</strong> $A_1 = \\{ (x,y) \\in \\mathbb{R}^2 \\colon y = 0 \\}$ (Eje X) $\\wedge$ $A_2 = \\{ (x,y) \\in \\mathbb{R}^2 \\colon x = 0 \\}$ (Eje Y).\n      </li><li><strong>Familia de rectas oblicuas:</strong> $A_m = \\{ (x,y) \\in \\mathbb{R}^2 \\colon y = mx \\}$, con $m \\in \\mathbb{R}$.\n      </li><li><strong>Familia de parábolas:</strong> $A_a = \\{ (x,y) \\in \\mathbb{R}^2 \\colon y = ax^2 \\}$ $\\vee$ $A_a = \\{ (x,y) \\in \\mathbb{R}^2 \\colon x = ay^2 \\}$, con $a \\neq 0$.\n    </li></ul></p></div></div>\n<h4>2. Límites Iterados</h4>\n<div class=\"caja-ram caja-teorema\" style=\"border-left: 4px solid #10b981; background: var(--bg-card); padding: 16px; border-radius: 10px; margin: 16px 0;\"><div class=\"caja-ram-title\" style=\"font-weight: bold; color: #10b981; font-size: 15px; margin-bottom: 8px;\"><i class=\"fa-solid fa-square-root-variable\"></i> Teorema: Criterio de Inexistencia por Límites Iterados</div><div class=\"caja-ram-body\"><p>Sea $f: D \\subseteq \\mathbb{R}^2 \\to \\mathbb{R}$ un campo escalar y sea $(a,b)$ un punto de acumulación de $\\operatorname{dom}(f)$. Definimos los dos límites iterados mediante:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ L_1 = \\displaystyle\\lim_{x \\to a} \\left( \\displaystyle\\lim_{y \\to b} f(x,y) \\right) \\quad \\wedge \\quad L_2 = \\displaystyle\\lim_{y \\to b} \\left( \\displaystyle\\lim_{x \\to a} f(x,y) \\right) $$</div>     Si ambos límites iterados existen y son <strong>distintos</strong> ($L_1 \\neq L_2$), entonces el límite doble $\\displaystyle\\lim_{(x,y) \\to (a,b)} f(x,y)$ <strong>no existe</strong>.</p></div></div>\n<div class=\"caja-ram caja-demostracion\" style=\"border-left: 3px solid var(--accent-color); background: var(--bg-secondary); padding: 14px; border-radius: 8px; margin: 12px 0;\"><p style=\"margin:0 0 8px 0;\"><strong>Demostración:</strong></p><div><p>Supongamos por contradicción que el límite doble existe y vale $L \\in \\mathbb{R}$, es decir, $\\displaystyle\\lim_{(x,y) \\to (a,b)} f(x,y) = L$, y asumamos que existe el límite interno $g(x) = \\displaystyle\\lim_{y \\to b} f(x,y)$ para todo $x \\neq a$ en un entorno de $a$.</p>\n<p>Dado $\\varepsilon > 0$, existe $\\delta > 0$ tal que si $0 < \\sqrt{(x-a)^2 + (y-b)^2} < \\delta$, entonces:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ |f(x,y) - L| < \\frac{\\varepsilon}{2} $$</div></p>\n<p>Para cualquier $x$ fijo que cumpla $0 < |x - a| < \\frac{\\delta}{\\sqrt{2}}$, consideramos los valores de $y$ que satisfacen $0 < |y - b| < \\frac{\\delta}{\\sqrt{2}}$. Para dichos puntos, la distancia euclidiana satisface $\\sqrt{(x-a)^2 + (y-b)^2} < \\delta$, por lo que la desigualdad del límite se sostiene.</p>\n<p>Tomando el límite cuando $y \\to b$ en la desigualdad $|f(x,y) - L| < \\frac{\\varepsilon}{2}$, y aprovechando que $\\displaystyle\\lim_{y \\to b} f(x,y) = g(x)$, obtenemos por propiedades de desigualdades en límites:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ |g(x) - L| \\leq \\frac{\\varepsilon}{2} < \\varepsilon $$</div></p>\n<p>Como esto es válido para todo $x$ tal que $0 < |x - a| < \\frac{\\delta}{\\sqrt{2}}$, por definición formal tenemos que:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\displaystyle\\lim_{x \\to a} g(x) = L \\implies \\displaystyle\\lim_{x \\to a} \\left( \\displaystyle\\lim_{y \\to b} f(x,y) \\right) = L $$</div></p>\n<p>De manera totalmente análoga, si el límite interno $h(y) = \\displaystyle\\lim_{x \\to a} f(x,y)$ existe, se demuestra que $\\displaystyle\\lim_{y \\to b} \\left( \\displaystyle\\lim_{x \\to a} f(x,y) \\right) = L$.     Por ende, $L_1 = L$ y $L_2 = L$, lo cual implica $L_1 = L_2$. Esto contradice el hecho de que $L_1 \\neq L_2$.     En consecuencia, el límite doble $\\displaystyle\\lim_{(x,y) \\to (a,b)} f(x,y)$ no existe.</p></div></div>\n<div class=\"caja-ram error-comun\"><div class=\"caja-ram-title\"><i class=\"fa-solid fa-triangle-exclamation\"></i> Observación sobre Iterados</div><div class=\"caja-ram-body\"><p>Si los límites iterados son iguales ($L_1 = L_2$), o si alguno de los límites internos no existe, <strong>no es posible concluir nada</strong> respecto a la existencia del límite doble original.</p></div></div>\n<h4>3. Cambio a Coordenadas Polares</h4>\n<div class=\"caja-ram caja-definicion\"><div class=\"caja-ram-title\"><i class=\"fa-solid fa-book-bookmark\"></i> Definición: Transformación Polar y Equivalencia de Límite</div><div class=\"caja-ram-body\"><p>Consideremos la transformación a coordenadas polares en el plano:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ x = r\\cos(\\theta) \\quad \\wedge \\quad y = r\\sin(\\theta) $$</div>     donde $r = \\sqrt{x^2+y^2} \\ge 0$ e $\\theta \\in [0, 2\\pi)$.</p>\n<p>El límite $\\displaystyle\\lim_{(x,y) \\to (0,0)} f(x,y)$ existe y es igual a $L \\in \\mathbb{R}$ <strong>si y solo si</strong> el límite en coordenadas polares se satisface de manera <strong>uniforme</strong> con respecto al ángulo $\\theta$, es decir:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\displaystyle\\lim_{r \\to 0^+} \\Big( \\sup_{\\theta \\in [0, 2\\pi)} |f(r\\cos\\theta, r\\sin\\theta) - L| \\Big) = 0 $$</div></p></div></div>\n<div class=\"caja-ram caja-demostracion\" style=\"border-left: 3px solid var(--accent-color); background: var(--bg-secondary); padding: 14px; border-radius: 8px; margin: 12px 0;\"><p style=\"margin:0 0 8px 0;\"><strong>Demostración:</strong></p><div><p>$(\\Rightarrow)$ Asumamos que $\\displaystyle\\lim_{(x,y) \\to (0,0)} f(x,y) = L$.     Dado $\\varepsilon > 0$, existe $\\delta > 0$ tal que para todo $(x,y) \\in \\operatorname{dom}(f)$, si $0 < \\sqrt{x^2+y^2} < \\delta$, entonces:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ |f(x,y) - L| < \\varepsilon $$</div>     Sustituyendo $x = r\\cos\\theta$ e $y = r\\sin\\theta$, notamos que $\\sqrt{x^2+y^2} = r$. Por ende, si $0 < r < \\delta$, se cumple que:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ |f(r\\cos\\theta, r\\sin\\theta) - L| < \\varepsilon $$</div>     para todo $\\theta \\in [0, 2\\pi)$ simultáneamente. Tomando el supremo sobre $\\theta$, mantenemos la cota:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\sup_{\\theta \\in [0, 2\\pi)} |f(r\\cos\\theta, r\\sin\\theta) - L| \\leq \\varepsilon $$</div>     Lo que demuestra que $\\displaystyle\\lim_{r \\to 0^+} \\sup_{\\theta \\in [0, 2\\pi)} |f(r\\cos\\theta, r\\sin\\theta) - L| = 0$.</p>\n<p>$(\\Leftarrow)$ Supongamos ahora que $\\displaystyle\\lim_{r \\to 0^+} \\sup_{\\theta \\in [0, 2\\pi)} |f(r\\cos\\theta, r\\sin\\theta) - L| = 0$.     Entonces, para todo $\\varepsilon > 0$, existe $\\delta > 0$ tal que si $0 < r < \\delta$, entonces:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ |f(r\\cos\\theta, r\\sin\\theta) - L| \\leq \\sup_{\\theta \\in [0, 2\\pi)} |f(r\\cos\\theta, r\\sin\\theta) - L| < \\varepsilon $$</div>     Dado cualquier punto $(x,y) \\neq (0,0)$ tal que $\\|(x,y) - (0,0)\\| = \\sqrt{x^2+y^2} < \\delta$, podemos expresarlo en polares con $r = \\sqrt{x^2+y^2} < \\delta$ y algún ángulo $\\theta$. De lo anterior se deduce que:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ |f(x,y) - L| = |f(r\\cos\\theta, r\\sin\\theta) - L| < \\varepsilon $$</div>     Quedando demostrado por definición $\\varepsilon$-$\\delta$ que $\\displaystyle\\lim_{(x,y) \\to (0,0)} f(x,y) = L$.</p></div></div>",
          contentApplication: "<p>A continuación, pondremos en práctica los tres criterios desarrollados en la teoría. Observa detenidamente cómo la elección de la herramienta correcta nos permite concluir si un límite existe o, en la mayoría de los casos, demostrar su inexistencia.</p>\n<div class=\"caja-ram caja-definicion\"><div class=\"caja-ram-title\">💡 Ejemplo: Criterio 1: Inexistencia por Caminos (Rectas)</div><div class=\"caja-ram-body\"><p>Estudie la existencia del límite: $\\displaystyle \\displaystyle\\lim_{(x,y) \\to (0,0)} \\frac{x^2}{x^2 + y^2}$</p>\n<p><strong>Desarrollo:</strong>     Tomemos la recta $y = x$, que viene a ser nuestra trayectoria $A_1$:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\displaystyle\\lim_{x \\to 0} \\frac{x^2}{x^2 + x^2} = \\displaystyle\\lim_{x \\to 0} \\frac{x^2}{2x^2} = \\frac{1}{2} $$</div></p>\n<p>Tomemos otra recta, digamos el eje X ($y = 0$), la cual viene a ser nuestra trayectoria $A_2$:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\displaystyle\\lim_{x \\to 0} \\frac{x^2}{x^2 + 0} = \\displaystyle\\lim_{x \\to 0} \\frac{x^2}{x^2} = 1 $$</div></p>\n<p>Notamos que los límites por caminos existen y son distintos ($1/2 \\neq 1$). Por lo tanto, el límite doble <strong>no existe</strong>.</p></div></div>\n<div class=\"caja-ram caja-definicion\"><div class=\"caja-ram-title\">💡 Ejemplo: Criterio 2: Inexistencia por Límites Iterados</div><div class=\"caja-ram-body\"><p>Estudie la existencia del límite: $\\displaystyle \\displaystyle\\lim_{(x,y) \\to (0,0)} \\frac{y}{y + x^2}$</p>\n<p><strong>Desarrollo:</strong>     Calculamos el primer límite iterado (evaluando primero $y \\to 0$ y luego $x \\to 0$):     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\displaystyle\\lim_{x \\to 0} \\left( \\displaystyle\\lim_{y \\to 0} \\frac{y}{y + x^2} \\right) = \\displaystyle\\lim_{x \\to 0} \\left( \\frac{0}{0 + x^2} \\right) = \\displaystyle\\lim_{x \\to 0} (0) = 0 $$</div></p>\n<p>Calculamos el segundo límite iterado (evaluando primero $x \\to 0$ y luego $y \\to 0$):     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\displaystyle\\lim_{y \\to 0} \\left( \\displaystyle\\lim_{x \\to 0} \\frac{y}{y + x^2} \\right) = \\displaystyle\\lim_{y \\to 0} \\left( \\frac{y}{y + 0} \\right) = \\displaystyle\\lim_{y \\to 0} (1) = 1 $$</div></p>\n<p>Como los límites iterados arrojan valores distintos ($0 \\neq 1$), el límite doble <strong>no existe</strong>.</p></div></div>\n<div class=\"caja-ram caja-definicion\"><div class=\"caja-ram-title\">💡 Ejemplo: Criterio 3: Existencia vía Coordenadas Polares</div><div class=\"caja-ram-body\"><p>Estudie la existencia del límite: $\\displaystyle \\displaystyle\\lim_{(x,y) \\to (0,0)} \\frac{x^4 + 3(x^2 + y^2)}{x^2 + y^2}$</p>\n<p><strong>Desarrollo:</strong>     Aplicamos el cambio a coordenadas polares: $x = r\\cos\\theta$, $y = r\\sin\\theta$, sabiendo que $x^2 + y^2 = r^2$.     Sustituimos en la expresión:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\displaystyle\\lim_{r \\to 0^+} \\frac{(r\\cos\\theta)^4 + 3r^2}{r^2} = \\displaystyle\\lim_{r \\to 0^+} \\frac{r^4\\cos^4\\theta + 3r^2}{r^2} $$</div>     Factorizando y simplificando $r^2$ (ya que $r \\neq 0$ en la aproximación):     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\displaystyle\\lim_{r \\to 0^+} (r^2\\cos^4\\theta + 3) = 0 \\cdot \\cos^4\\theta + 3 = 3 $$</div>     Dado que el resultado es una constante numérica exacta ($L=3$), absolutamente independiente del ángulo de aproximación $\\theta$, el límite doble <strong>existe y es igual a 3</strong>.</p></div></div>\n\n      <div class=\"quiz-block quiz-alternativas\" style=\"margin:24px 0; padding:20px; background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px;\">\n        <h4 style=\"margin:0 0 12px 0; font-size:16px; color:var(--text-primary);\"><i class=\"fa-solid fa-circle-question\" style=\"color:var(--accent-color);\"></i> La Elección del Camino Adecuado</h4>\n        <p style=\"font-size:14px; color:var(--text-secondary); margin-bottom:12px;\">¿Cuál es el argumento correcto respecto al límite $\\displaystyle \\displaystyle\\lim_{(x,y) \\to (0,0)} \\frac{xy^2}{x^2 + y^4}$?</p>\n        <div class=\"quiz-options\">\n        <label class=\"quiz-option\" data-correct=\"false\" data-feedback=\"Cuidado. Aunque todas las rectas $y=mx$ arrojan 0, las rectas no son las únicas trayectorias posibles. Debes probar curvas de mayor grado.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"radio\" name=\"quiz-alt-1784912129586-o9ts\" value=\"0\" data-correct=\"false\" data-feedback=\"Cuidado. Aunque todas las rectas $y=mx$ arrojan 0, las rectas no son las únicas trayectorias posibles. Debes probar curvas de mayor grado.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">El límite es $0$, porque al evaluarlo por cualquier recta de la familia $y = mx$, el resultado tiende a cero.</span>\n        </label>\n      \n        <label class=\"quiz-option\" data-correct=\"false\" data-feedback=\"Si calculas los límites iterados para esta función, verás que $\\displaystyle\\lim_{x\\to 0}(\\displaystyle\\lim_{y\\to 0}) = 0$ y $\\displaystyle\\lim_{y\\to 0}(\\displaystyle\\lim_{x\\to 0}) = 0$. Son iguales, lo que hace al criterio no concluyente.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"radio\" name=\"quiz-alt-1784912129586-o9ts\" value=\"0\" data-correct=\"false\" data-feedback=\"Si calculas los límites iterados para esta función, verás que $\\displaystyle\\lim_{x\\to 0}(\\displaystyle\\lim_{y\\to 0}) = 0$ y $\\displaystyle\\lim_{y\\to 0}(\\displaystyle\\lim_{x\\to 0}) = 0$. Son iguales, lo que hace al criterio no concluyente.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">El límite no existe, porque los límites iterados son distintos.</span>\n        </label>\n      \n        <label class=\"quiz-option\" data-correct=\"true\" data-feedback=\"¡Brillante! Al sustituir la parábola horizontal $x = y^2$, el límite se convierte en $\\displaystyle\\lim_{y \\to 0} \\frac{y^2 \\cdot y^2}{(y^2)^2 + y^4} = \\frac{y^4}{2y^4} = \\frac{1}{2}$. Como $1/2 \\neq 0$, el límite se destruye.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"radio\" name=\"quiz-alt-1784912129586-o9ts\" value=\"1\" data-correct=\"true\" data-feedback=\"¡Brillante! Al sustituir la parábola horizontal $x = y^2$, el límite se convierte en $\\displaystyle\\lim_{y \\to 0} \\frac{y^2 \\cdot y^2}{(y^2)^2 + y^4} = \\frac{y^4}{2y^4} = \\frac{1}{2}$. Como $1/2 \\neq 0$, el límite se destruye.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">El límite no existe, porque al aproximarse por la curva $x = y^2$ se obtiene $1/2$, mientras que por el eje X ($y=0$) se obtiene $0$.</span>\n        </label>\n      </div>\n        <button type=\"button\" class=\"btn btn-verify-quiz\" onclick=\"verifyQuizAlternatives(this)\" style=\"margin-top:12px; padding:8px 18px; background:var(--accent-color); color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;\">Verificar Respuesta</button>\n        <div class=\"quiz-feedback\" style=\"display:none; margin-top:12px; padding:12px; border-radius:8px;\"></div>\n      </div>\n    \n\n      <div class=\"quiz-block quiz-vf\" data-correct=\"F\" data-feedback-true=\"Incorrecto. Caíste en la trampa más común. Que los límites iterados coincidan significa únicamente que acercarse por el eje X o por el eje Y da el mismo resultado. No te garantiza lo que ocurre si te acercas por una diagonal como $y=x$ (donde el límite da $1/2$).\" data-feedback-false=\"¡Excelente! Recordaste la alerta teórica: si los límites iterados son iguales, &lt;strong&gt;no se puede concluir nada&lt;/strong&gt;. De hecho, si evalúas este límite por rectas $y = mx$, el resultado es $\\frac{m}{1+m^2}$, lo que demuestra que depende de la pendiente $m$ y, por ende, el límite no existe.\" style=\"margin:24px 0; padding:20px; background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px;\">\n        <h4 style=\"margin:0 0 8px 0; font-size:16px; color:var(--text-primary);\"><i class=\"fa-solid fa-toggle-on\" style=\"color:var(--accent-color);\"></i> V/F: Conclusión sobre Límites Iterados</h4>\n        <p style=\"font-size:14px; color:var(--text-secondary); margin-bottom:12px;\">Considere la función $f(x,y) = \\frac{xy}{x^2 + y^2}$. Dado que ambos límites iterados son iguales a cero (es decir, $\\displaystyle\\lim_{x \\to 0} (\\displaystyle\\lim_{y \\to 0} f(x,y)) = 0$ y $\\displaystyle\\lim_{y \\to 0} (\\displaystyle\\lim_{x \\to 0} f(x,y)) = 0$), podemos concluir matemáticamente que el límite doble existe y vale cero.</p>\n        <div style=\"display:flex; gap:16px; margin:12px 0;\">\n          <label style=\"display:flex; align-items:center; gap:6px; cursor:pointer;\">\n            <input type=\"radio\" name=\"quiz-vf-1784912129586-sbok\" value=\"V\" style=\"accent-color:var(--accent-color);\"> <strong>Verdadero (V)</strong>\n          </label>\n          <label style=\"display:flex; align-items:center; gap:6px; cursor:pointer;\">\n            <input type=\"radio\" name=\"quiz-vf-1784912129586-sbok\" value=\"F\" style=\"accent-color:var(--accent-color);\"> <strong>Falso (F)</strong>\n          </label>\n        </div>\n        <button type=\"button\" class=\"btn btn-verify-vf\" onclick=\"verifyQuizVF(this)\" style=\"margin-top:8px; padding:8px 18px; background:var(--accent-color); color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;\">Verificar</button>\n        <div class=\"quiz-feedback\" style=\"display:none; margin-top:12px; padding:12px; border-radius:8px;\"></div>\n      </div>\n    \n\n      <div class=\"quiz-block quiz-casillas\" style=\"margin:24px 0; padding:20px; background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px;\">\n        <h4 style=\"margin:0 0 12px 0; font-size:16px; color:var(--text-primary);\"><i class=\"fa-solid fa-list-check\" style=\"color:var(--accent-color);\"></i> Selección Múltiple: Dependencia Angular en Polares</h4>\n        <p style=\"font-size:14px; color:var(--text-secondary); margin-bottom:12px;\">Se requiere evaluar el límite $\\displaystyle \\displaystyle\\lim_{(x,y) \\to (0,0)} \\arccos\\left(\\frac{x}{\\sqrt{x^2 + y^2}}\\right)$. Al realizar el cambio a coordenadas polares, selecciona <strong>todas</strong> las afirmaciones correctas:</p>\n        <div class=\"quiz-casillas-options\">\n        <label class=\"quiz-casilla-option\" data-correct=\"true\" data-feedback=\"¡Correcto! Sustituyendo $x = r\\cos\\theta$ y $\\sqrt{x^2+y^2} = r$, nos queda $\\arccos(\\frac{r\\cos\\theta}{r}) = \\arccos(\\cos\\theta)$.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"checkbox\" value=\"0\" data-correct=\"1\" data-feedback=\"¡Correcto! Sustituyendo $x = r\\cos\\theta$ y $\\sqrt{x^2+y^2} = r$, nos queda $\\arccos(\\frac{r\\cos\\theta}{r}) = \\arccos(\\cos\\theta)$.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">La expresión se reduce algebraicamente a $\\arccos(\\cos\\theta)$.</span>\n        </label>\n      \n        <label class=\"quiz-casilla-option\" data-correct=\"true\" data-feedback=\"¡Exacto! El resultado es directamente el ángulo de aproximación. Acercarse por distintos ángulos da distintos resultados.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"checkbox\" value=\"1\" data-correct=\"1\" data-feedback=\"¡Exacto! El resultado es directamente el ángulo de aproximación. Acercarse por distintos ángulos da distintos resultados.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">Como $\\arccos(\\cos\\theta) = \\theta$ en el intervalo principal, el límite no existe porque depende exclusivamente de $\\theta$.</span>\n        </label>\n      \n        <label class=\"quiz-casilla-option\" data-correct=\"false\" data-feedback=\"Falso. El concepto de acotamiento se usa en multiplicaciones con términos que tienden a cero (Teorema de Cero por Acotado), aquí la función completa depende del ángulo.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"checkbox\" value=\"2\" data-correct=\"0\" data-feedback=\"Falso. El concepto de acotamiento se usa en multiplicaciones con términos que tienden a cero (Teorema de Cero por Acotado), aquí la función completa depende del ángulo.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">El límite existe y vale $1$, porque las funciones trigonométricas están acotadas.</span>\n        </label>\n      \n        <label class=\"quiz-casilla-option\" data-correct=\"true\" data-feedback=\"¡Correcto! Esto confirma explícitamente mediante caminos que el límite no puede existir.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"checkbox\" value=\"3\" data-correct=\"1\" data-feedback=\"¡Correcto! Esto confirma explícitamente mediante caminos que el límite no puede existir.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">Geométricamente, acercarse por el eje X positivo ($\\theta=0$) da como límite $0$, pero por el eje Y positivo ($\\theta=\\pi/2$) da $\\pi/2$.</span>\n        </label>\n      </div>\n        <button type=\"button\" class=\"btn btn-verify-casillas\" onclick=\"verifyQuizCasillas(this)\" style=\"margin-top:12px; padding:8px 18px; background:var(--accent-color); color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;\">Verificar Selecciones</button>\n        <div class=\"quiz-feedback\" style=\"display:none; margin-top:12px; padding:12px; border-radius:8px;\"></div>\n      </div>\n    \n\n      <div class=\"quiz-block quiz-pareados-2col\" style=\"margin: 24px 0; padding: 20px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px;\">\n        <h4 style=\"margin: 0 0 16px 0; font-size: 16px; color: var(--text-primary);\">\n          <i class=\"fa-solid fa-network-wired\" style=\"color: var(--accent-color);\"></i> Asociación: Límite y Herramienta de Análisis\n        </h4>\n\n        <!-- DOS COLUMNAS LATERALES -->\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 20px;\">\n          <div>\n            <h5 style=\"margin: 0 0 8px 0; color: var(--accent-color); font-size: 14px;\">Columna 1: Expresiones</h5>\n            <div style=\"display: flex; flex-direction: column; gap: 8px;\"><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>1.</strong> $\\displaystyle \\displaystyle\\lim_{(x,y)\\to(0,0)} \\frac{x^2y}{x^2+y^2}$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>2.</strong> $\\displaystyle \\displaystyle\\lim_{(x,y)\\to(0,0)} \\frac{xy^2}{x^2+y^4}$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>3.</strong> $\\displaystyle \\displaystyle\\lim_{(x,y)\\to(0,0)} \\frac{y}{y+x^2}$</div></div>\n          </div>\n          <div>\n            <h5 style=\"margin: 0 0 8px 0; color: var(--accent-color); font-size: 14px;\">Columna 2: Clasificación</h5>\n            <div style=\"display: flex; flex-direction: column; gap: 8px;\"><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>A.</strong> No existe el límite, demostrado al probar Límites Iterados (uno da 0, otro da 1).</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>B.</strong> No existe el límite, demostrado al evaluar caminos parabólicos ($x=y^2$).</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>C.</strong> El límite existe y es $0$, comprobado mediante cambio a Coordenadas Polares y acotamiento.</div></div>\n          </div>\n        </div>\n\n        <!-- FILAS DE SELECCIÓN DE ASOCIACIÓN -->\n        <h5 style=\"margin: 16px 0 10px 0; font-size: 14px; color: var(--text-primary);\">Asocia cada Ítem de la Columna 1 con su Letra (Col 2):</h5>\n        <div style=\"display: flex; flex-direction: column; gap: 10px;\">\n          \n        <div class=\"pareo-row-item\" data-num=\"1\" data-correct-letter=\"C\" data-feedback=\"¡Excelente! Al usar polares obtienes $\\displaystyle\\lim_{r \\to 0^+} r\\cos^2\\theta \\sin\\theta$. Como $r \\to 0$ y la parte trigonométrica está acotada, el límite es firmemente 0.\" style=\"display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;\">\n          <span style=\"font-weight: bold; width: 70px;\">Ítem 1:</span>\n          <span style=\"font-size: 13px; color: var(--text-muted);\">Letra:</span>\n          <select class=\"pareo-select-col2\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option>\n          </select>\n        </div>\n      \n        <div class=\"pareo-row-item\" data-num=\"2\" data-correct-letter=\"B\" data-feedback=\"¡Correcto! Las rectas engañan en esta función dando siempre 0. La única forma de revelar que no existe es usar la parábola $x=y^2$, lo que arroja 1/2.\" style=\"display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;\">\n          <span style=\"font-weight: bold; width: 70px;\">Ítem 2:</span>\n          <span style=\"font-size: 13px; color: var(--text-muted);\">Letra:</span>\n          <select class=\"pareo-select-col2\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option>\n          </select>\n        </div>\n      \n        <div class=\"pareo-row-item\" data-num=\"3\" data-correct-letter=\"A\" data-feedback=\"¡Perfecto! Esta función es el clásico ejemplo donde los iterados fallan de manera asimétrica ($0 \\neq 1$), lo que destruye el límite doble inmediatamente.\" style=\"display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;\">\n          <span style=\"font-weight: bold; width: 70px;\">Ítem 3:</span>\n          <span style=\"font-size: 13px; color: var(--text-muted);\">Letra:</span>\n          <select class=\"pareo-select-col2\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option>\n          </select>\n        </div>\n      \n        </div>\n\n        <button type=\"button\" class=\"btn btn-verify-pareados\" onclick=\"verifyQuizPareados2Col(this)\" style=\"margin-top: 16px; padding: 10px 22px; background: var(--accent-color); color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px;\">\n          <i class=\"fa-solid fa-circle-check\"></i> Verificar Asociaciones\n        </button>\n\n        <div class=\"quiz-feedback\" style=\"display:none; margin-top:16px; padding:14px; border-radius:8px;\"></div>\n      </div>\n    ",
          contentExercises: "[{\"id\":\"ex-1784912129585-6p7v\",\"title\":\"Inexistencia por Trayectorias no Lineales\",\"level\":\"resuelto\",\"statement\":\"<p>Estudie la existencia del siguiente límite utilizando el criterio de caminos:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\displaystyle\\\\lim_{(x,y) \\\\to (0,0)} \\\\frac{x^6 y^3}{x^{12} + y^6} $$</div></p>\",\"solution\":\"<p><strong>1. Prueba con rectas oblicuas ($y = mx$):</strong>       Si nos aproximamos por cualquier recta que pase por el origen, sustituimos $y = mx$:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\displaystyle\\\\lim_{x \\\\to 0} \\\\frac{x^6 (mx)^3}{x^{12} + (mx)^6} = \\\\displaystyle\\\\lim_{x \\\\to 0} \\\\frac{m^3 x^9}{x^{12} + m^6 x^6} = \\\\displaystyle\\\\lim_{x \\\\to 0} \\\\frac{m^3 x^3}{x^6 + m^6} $$</div>       Evaluando cuando $x \\\\to 0$, el numerador se anula y el denominador tiende a $m^6 \\\\neq 0$ (si $m \\\\neq 0$). Por lo tanto, el límite por cualquier recta es $0$. Si nos confiáramos, diríamos que el límite es $0$.</p>\\n<p><strong>2. Elección de una trayectoria óptima:</strong>       Observamos los exponentes en el denominador: $x^{12}$ y $y^6$. Para lograr que ambos términos tengan el mismo grado algebraico y puedan sumarse, necesitamos una trayectoria donde $y^6$ se comporte como $x^{12}$. Esto se logra si $y^3 = x^6$, es decir, la parábola cúbica $y = x^2$.</p>\\n<p>Evaluamos el límite a lo largo de la trayectoria $A = \\\\{ (x,y) \\\\in \\\\mathbb{R}^2: y = x^2 \\\\}$:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\displaystyle\\\\lim_{x \\\\to 0} \\\\frac{x^6 (x^2)^3}{x^{12} + (x^2)^6} = \\\\displaystyle\\\\lim_{x \\\\to 0} \\\\frac{x^6 \\\\cdot x^6}{x^{12} + x^{12}} = \\\\displaystyle\\\\lim_{x \\\\to 0} \\\\frac{x^{12}}{2x^{12}} = \\\\frac{1}{2} $$</div></p>\\n<p><strong>3. Conclusión:</strong>       Como el límite a lo largo de las rectas es $0$, pero a lo largo de la curva $y = x^2$ es $1/2$, hemos encontrado dos caminos continuos que arrojan valores distintos ($0 \\\\neq 1/2$). Por lo tanto, el límite doble <strong>no existe</strong>.</p>\"},{\"id\":\"ex-1784912129585-qisk\",\"title\":\"Existencia vía Coordenadas Polares\",\"level\":\"resuelto\",\"statement\":\"<p>Estudie la existencia del límite y determine su valor si es posible:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\displaystyle\\\\lim_{(x,y) \\\\to (0,0)} \\\\frac{x^3}{x^2 + y^2} $$</div></p>\",\"solution\":\"<p><strong>1. Transformación al Sistema Polar:</strong>       Sea $x = r\\\\cos\\\\theta$ e $y = r\\\\sin\\\\theta$. Sabemos que el límite en $(x,y) \\\\to (0,0)$ es equivalente a evaluar el comportamiento cuando $r \\\\to 0^+$.       Sustituyendo en la función:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ f(r\\\\cos\\\\theta, r\\\\sin\\\\theta) = \\\\frac{(r\\\\cos\\\\theta)^3}{(r\\\\cos\\\\theta)^2 + (r\\\\sin\\\\theta)^2} = \\\\frac{r^3\\\\cos^3\\\\theta}{r^2(\\\\cos^2\\\\theta + \\\\sin^2\\\\theta)} = r\\\\cos^3\\\\theta $$</div></p>\\n<p><strong>2. Análisis de Acotamiento:</strong>       Debemos verificar si la expresión resultante tiende a un valor constante de manera independiente al ángulo $\\\\theta$.       Tomamos el valor absoluto y acotamos:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ |r\\\\cos^3\\\\theta - 0| = r|\\\\cos^3\\\\theta| \\\\leq r \\\\cdot 1 = r $$</div></p>\\n<p><strong>3. Conclusión:</strong>       Puesto que $\\\\displaystyle\\\\lim_{r \\\\to 0^+} r = 0$, el Teorema de Cero por Acotado garantiza que el límite en coordenadas polares tiende a $0$ de manera uniforme para todo $\\\\theta \\\\in [0, 2\\\\pi)$. En consecuencia, el límite doble <strong>existe y es igual a 0</strong>.</p>\"},{\"id\":\"ex-1784912129585-bgiy\",\"title\":\"Criterio de Límites Iterados\",\"level\":\"nivel-2\",\"statement\":\"<p>Analice los siguientes límites intentando aplicar el criterio de límites iterados. Determine si el criterio le permite concluir la inexistencia del límite o si resulta no concluyente.       <ol style=\\\"margin: 8px 0; padding-left: 20px;\\\">\\n        <li>$\\\\displaystyle \\\\displaystyle\\\\lim_{(x,y) \\\\to (0,0)} \\\\frac{x^2}{x^2 + y^2}$\\n        </li><li>$\\\\displaystyle \\\\displaystyle\\\\lim_{(x,y) \\\\to (0,0)} x\\\\sin\\\\left(\\\\frac{1}{x}\\\\right)\\\\sin\\\\left(\\\\frac{1}{y}\\\\right)$\\n      </li></ol></p>\",\"solution\":\"<p><strong>Para (1):</strong> Evalúa $\\\\displaystyle\\\\lim_{x\\\\to 0}(\\\\displaystyle\\\\lim_{y\\\\to 0} f(x,y))$ y luego invierte el orden. Obtendrás $1$ y $0$. Como son distintos, <strong>el límite no existe</strong>. \\\\\\\\       <strong>Para (2):</strong> Al intentar calcular el límite interno $\\\\displaystyle\\\\lim_{y\\\\to 0} \\\\sin(1/y)$, descubrirás que este no existe por su infinita oscilación. Dado que los iterados no pueden ser calculados, <strong>el criterio de iterados no es concluyente</strong>. (Nota: el límite doble general sí existe y es $0$ aplicando el Teorema del Sándwich / Cero por Acotado).</p>\"},{\"id\":\"ex-1784912129585-io10\",\"title\":\"Inexistencia en Coordenadas Polares\",\"level\":\"nivel-2\",\"statement\":\"<p>Estudie la existencia del límite mediante el cambio a coordenadas polares:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\displaystyle\\\\lim_{(x,y) \\\\to (0,0)} \\\\frac{(x-y)^2}{x^2 + y^2} $$</div></p>\",\"solution\":\"<p>Al sustituir $x = r\\\\cos\\\\theta$ e $y = r\\\\sin\\\\theta$, el denominador $r^2$ se simplificará completamente con el $r^2$ factorizado del numerador. Te quedará la expresión matemática $L(\\\\theta) = (\\\\cos\\\\theta - \\\\sin\\\\theta)^2$. Como el resultado depende estrictamente del ángulo $\\\\theta$ (por ejemplo, vale $1$ si $\\\\theta = 0$, pero vale $0$ si $\\\\theta = \\\\pi/4$), <strong>el límite no existe</strong>.</p>\"},{\"id\":\"ex-1784912129585-zcwr\",\"title\":\"Resolución por Inspección Directa (Factorización)\",\"level\":\"nivel-2\",\"statement\":\"<p>Utilice herramientas de factorización algebraica para demostrar rigurosamente la existencia de los siguientes límites:       <ol style=\\\"margin: 8px 0; padding-left: 20px;\\\">\\n        <li>$\\\\displaystyle \\\\displaystyle\\\\lim_{(x,y) \\\\to (0,0)} \\\\frac{x^4 - y^4}{x^2 + y^2}$\\n        </li><li>$\\\\displaystyle \\\\displaystyle\\\\lim_{(x,y) \\\\to (0,0)} \\\\frac{x^3 - y^3}{x^2 + xy + y^2}$\\n      </li></ol></p>\",\"solution\":\"<p>En ambos casos es un error complicarse con caminos o iterados. \\\\\\\\       <strong>Para (1):</strong> Factoriza el numerador como diferencia de cuadrados $(x^2-y^2)(x^2+y^2)$. Al simplificar, te quedará $\\\\displaystyle\\\\lim (x^2-y^2)$, cuyo valor es <strong>0</strong>. \\\\\\\\       <strong>Para (2):</strong> Factoriza el numerador como diferencia de cubos $(x-y)(x^2+xy+y^2)$. Al simplificar, evaluarás $\\\\displaystyle\\\\lim (x-y)$, cuyo valor también es <strong>0</strong>.</p>\"},{\"id\":\"ex-1784912129585-rywe\",\"title\":\"Inexistencia por Caminos Simples (Ejes)\",\"level\":\"nivel-2\",\"statement\":\"<p>Demuestre que el siguiente límite no existe evaluándolo a lo largo de los ejes coordenados:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\displaystyle\\\\lim_{(x,y) \\\\to (0,0)} \\\\frac{x^2 - y^2}{x^2 + y^2} $$</div></p>\",\"solution\":\"<p>Toma la trayectoria $A_1$ como el eje X (es decir, fija $y=0$ y evalúa el límite sobre $x$). El resultado será $1$. Luego toma la trayectoria $A_2$ como el eje Y (fija $x=0$ y evalúa sobre $y$). El resultado será $-1$. Al ser diferentes, <strong>el límite no existe</strong>.</p>\"}]",
          contentFormulas: "[{\"id\":\"form-1784912129584-30en\",\"title\":\"Criterio de Inexistencia por Caminos\",\"latex\":\"\\\\displaystyle\\\\lim_{\\\\substack{(x,y) \\\\to (a,b) \\\\\\\\ (x,y) \\\\in A_1}} f(x,y) = L_1 \\\\;\\\\wedge\\\\; \\\\displaystyle\\\\lim_{\\\\substack{(x,y) \\\\to (a,b) \\\\\\\\ (x,y) \\\\in A_2}} f(x,y) = L_2 \\\\;\\\\wedge\\\\; L_1 \\\\neq L_2 \\\\implies \\\\nexists \\\\displaystyle\\\\lim_{(x,y) \\\\to (a,b)} f(x,y)\",\"description\":\"Si el campo escalar tiende a valores distintos a lo largo de dos trayectorias continuas $A_1$ y $A_2$, el límite doble no existe.\"},{\"id\":\"form-1784912129584-pkcd\",\"title\":\"Criterio de Inexistencia por Límites Iterados\",\"latex\":\"\\\\displaystyle\\\\lim_{x \\\\to a} \\\\left( \\\\displaystyle\\\\lim_{y \\\\to b} f(x,y) \\\\right) \\\\neq \\\\displaystyle\\\\lim_{y \\\\to b} \\\\left( \\\\displaystyle\\\\lim_{x \\\\to a} f(x,y) \\\\right) \\\\implies \\\\nexists \\\\displaystyle\\\\lim_{(x,y) \\\\to (a,b)} f(x,y)\",\"description\":\"Si los dos límites direccionales ordenados secuencialmente a lo largo de los ejes existen pero difieren entre sí, el límite global no existe.\"},{\"id\":\"form-1784912129584-2wa0\",\"title\":\"Sustitución en Coordenadas Polares\",\"latex\":\"\\\\begin{aligned}\\n      x &= r\\\\cos(\\\\theta) \\\\\\\\[0.3em]\\n      y &= r\\\\sin(\\\\theta)\\n    \\\\end{aligned} \\\\implies x^2 + y^2 = r^2\",\"description\":\"Transformación analítica que reduce la aproximación multidireccional al origen $(0,0)$ a un único límite de variable escalar $r \\\\to 0^+$.\"},{\"id\":\"form-1784912129584-awqm\",\"title\":\"Condición de Existencia Uniforme en Polares\",\"latex\":\"\\\\displaystyle\\\\lim_{(x,y) \\\\to (0,0)} f(x,y) = L \\\\iff \\\\displaystyle\\\\lim_{r \\\\to 0^+} \\\\Big( \\\\sup_{\\\\theta \\\\in [0, 2\\\\pi)} |f(r\\\\cos\\\\theta, r\\\\sin\\\\theta) - L| \\\\Big) = 0\",\"description\":\"Garantiza que la aproximación al valor $L$ en coordenadas polares sea válida para todas las direcciones posibles simultáneamente, de forma independiente de $\\\\theta$.\"}]"
        }, {
          id: chapterIdCounter++,
          unitId: u2Id,
          chapterIndex: '2.1',
          title: 'Continuidad: Definiciones y Tipos de Discontinuidad',
          isCompleted: false,
          isLocked: false,
          contentMotivation: "<p><strong>¿Es posible reparar un \"agujero\" en el espacio?</strong></p>\n<p>En Cálculo de una variable, la continuidad evocaba la idea intuitiva de \"trazar una curva sin levantar el lápiz del papel\". Al pasar a campos escalares $f(x,y)$, la continuidad significa que la superficie $z = f(x,y)$ no presenta rupturas abruptas, grietas o acantilados infranqueables: pequeños cambios en la posición $(x,y)$ en el dominio deben producir pequeños cambios en la altura $z$.</p>\n<p>Sin embargo, en el plano bidimensional surgen comportamientos fascinantes. A veces, una superficie es perfectamente suave en todas partes salvo en un único punto $(x_0, y_0)$, donde hay una \"perforación\" puntual. Si el comportamiento de la superficie alrededor de ese agujero tiende a una altura bien definida $L$, podemos simplemente \"tapar\" el agujero asignándole dicho valor: estamos ante una <strong>discontinuidad reparable</strong>.</p>\n<p>Por el contrario, si la superficie se fractura y genera un acantilado donde acercarse por distintos caminos nos lleva a alturas completamente diferentes, la grieta es estructural y el límite no existe: estamos frente a una <strong>discontinuidad irreparable</strong>.</p>\n<div class=\"caja-ram caja-motivacion\"><div class=\"caja-ram-title\">💡 Pregunta Guía</div><div class=\"caja-ram-body\"><p>Si un campo escalar $f(x,y)$ no está definido en el origen $(0,0)$, pero sabemos que el límite $\\lim_{(x,y)\\to(0,0)} f(x,y) = 5$, ¿qué valor exacto debemos asignarle a $f(0,0)$ para transformarla en una función continua en todo el plano?</p></div></div>",
          contentTheory: "<p>La continuidad es la propiedad que garantiza la \"suavidad\" de una superficie sin saltos ni interrupciones abruptas. Analíticamente, vincula el valor real que toma la función en un punto con la tendencia del campo escalar a su alrededor.</p>\n<div class=\"caja-ram caja-definicion\"><div class=\"caja-ram-title\"><i class=\"fa-solid fa-book-bookmark\"></i> Definición: Continuidad de un Campo Escalar en un Punto</div><div class=\"caja-ram-body\"><p>Sea $f: D \\subseteq \\mathbb{R}^2 \\to \\mathbb{R}$ un campo escalar y sea $(x_0, y_0) \\in \\operatorname{dom}(f)$ un punto de acumulación de $\\operatorname{dom}(f)$. Decimos que $f$ es <strong>continua</strong> en $(x_0, y_0)$ si y solo si:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\lim_{(x,y) \\to (x_0, y_0)} f(x,y) = f(x_0, y_0) $$</div></p>\n<p>Esta igualdad implica necesariamente el cumplimiento simultáneo de tres condiciones:     <ol style=\"margin: 8px 0; padding-left: 20px;\">\n      <li>$(x_0, y_0) \\in \\operatorname{dom}(f)$ \\quad (El punto está bien definido en la función).\n      </li><li>Existe el límite $\\lim_{(x,y) \\to (x_0, y_0)} f(x,y) = L \\in \\mathbb{R}$.\n      </li><li>$L = f(x_0, y_0)$ \\quad (El límite coincide con el valor evaluado).\n    </li></ol></p></div></div>\n<div class=\"caja-ram caja-teorema\" style=\"border-left: 4px solid #10b981; background: var(--bg-card); padding: 16px; border-radius: 10px; margin: 16px 0;\"><div class=\"caja-ram-title\" style=\"font-weight: bold; color: #10b981; font-size: 15px; margin-bottom: 8px;\"><i class=\"fa-solid fa-square-root-variable\"></i> Teorema: Caracterización Secuencial de la Continuidad</div><div class=\"caja-ram-body\"><p>Un campo escalar $f$ es continuo en el punto $(x_0, y_0)$ <strong>si y solo si</strong> para toda sucesión de puntos $(x_n, y_n) \\in \\operatorname{dom}(f)$ que converja a $(x_0, y_0)$, la sucesión de valores reales correspondientes $f(x_n, y_n)$ converge a $f(x_0, y_0)$. Es decir:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\lim_{n \\to \\infty} (x_n, y_n) = (x_0, y_0) \\implies \\lim_{n \\to \\infty} f(x_n, y_n) = f(x_0, y_0) $$</div></p></div></div>\n<div class=\"caja-ram caja-definicion\"><div class=\"caja-ram-title\">💡 Ejemplo: Uso de Sucesiones para Descartar Continuidad</div><div class=\"caja-ram-body\"><p>Estudie la continuidad en el origen de la función:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ f(x,y) = \\begin{cases} \\frac{xy}{x^2+y^2} & \\text{si } (x,y) \\neq (0,0) \\\\[0.5em] 0 & \\text{si } (x,y) = (0,0) \\end{cases} $$</div></p>\n<p><strong>Desarrollo por caracterización secuencial:</strong>     Consideremos la sucesión de puntos $(x_n, y_n) = \\left(\\frac{1}{n}, \\frac{1}{n}\\right)$.     Es evidente que cuando $n \\to \\infty$, la sucesión converge al origen: $\\lim_{n \\to \\infty} \\left(\\frac{1}{n}, \\frac{1}{n}\\right) = (0,0)$.</p>\n<p>Evaluamos la función en los términos de la sucesión:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ f\\left(\\frac{1}{n}, \\frac{1}{n}\\right) = \\frac{\\left(\\frac{1}{n}\\right)\\left(\\frac{1}{n}\\right)}{\\left(\\frac{1}{n}\\right)^2 + \\left(\\frac{1}{n}\\right)^2} = \\frac{\\frac{1}{n^2}}{\\frac{2}{n^2}} = \\frac{1}{2} $$</div></p>\n<p>Tomando el límite cuando $n \\to \\infty$, obtenemos:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\lim_{n \\to \\infty} f\\left(\\frac{1}{n}, \\frac{1}{n}\\right) = \\frac{1}{2} $$</div></p>\n<p>Como $\\frac{1}{2} \\neq f(0,0) = 0$, la sucesión de imágenes no converge al valor de la función en el punto. Por lo tanto, el campo escalar $f$ <strong>no es continuo</strong> en $(0,0)$.</p></div></div>\n<div class=\"caja-ram caja-definicion\"><div class=\"caja-ram-title\"><i class=\"fa-solid fa-book-bookmark\"></i> Definición: Tipos de Discontinuidad</div><div class=\"caja-ram-body\"><p>Si una función $f$ no es continua en un punto de acumulación $(x_0, y_0)$, decimos que presenta una <strong>discontinuidad</strong> en dicho punto:     <ul style=\"margin: 8px 0; padding-left: 20px;\">\n      <li><strong>Discontinuidad Reparable (o Evitable):</strong> Ocurre cuando el límite existe ($\\lim_{(x,y) \\to (x_0, y_0)} f(x,y) = L \\in \\mathbb{R}$), pero se cumple que:\n      $$ (x_0, y_0) \\notin \\operatorname{dom}(f) \\quad \\vee \\quad \\lim_{(x,y) \\to (x_0, y_0)} f(x,y) \\neq f(x_0, y_0) $$\n      </li><li><strong>Discontinuidad Irreparable (o Esencial):</strong> Ocurre cuando el límite no existe:\n      $$ \\nexists \\lim_{(x,y) \\to (x_0, y_0)} f(x,y) $$\n    </li></ul></p></div></div>\n<div class=\"caja-ram caja-motivacion\"><div class=\"caja-ram-title\"><i class=\"fa-solid fa-gears\"></i> Redefinición de una Discontinuidad Reparable</div><div class=\"caja-ram-body\"><p>Cuando un campo escalar $f$ posee una discontinuidad reparable en $(x_0, y_0)$, es posible construir una nueva función $\\tilde{f}$ denominada <strong>extensión por continuidad</strong>, redefiniendo el punto problemático mediante:     <div class=\"formula-block\" style=\"text-align:center; margin: 12px 0;\">$$ \\tilde{f}(x,y) = \\begin{cases} f(x,y) & \\text{si } (x,y) \\neq (x_0, y_0) \\\\[0.5em] \\lim_{(u,v) \\to (x_0, y_0)} f(u,v) & \\text{si } (x,y) = (x_0, y_0) \\end{cases} $$</div>     De este modo, $\\tilde{f}$ resulta ser continua en $(x_0, y_0)$.</p></div></div>\n<div class=\"caja-ram caja-definicion\"><div class=\"caja-ram-title\">💡 Ejemplo: Análisis de Casos en el Origen</div><div class=\"caja-ram-body\"><p>Estudie la continuidad en $(0,0)$ de las siguientes funciones basadas en $\\frac{x^2}{\\sqrt{x^2+y^2}}$:</p>\n<ol style=\"margin: 8px 0; padding-left: 20px;\">\n      <li>$f_1(x,y) = \\frac{x^2}{\\sqrt{x^2+y^2}}$: <strong>No es continua</strong> en $(0,0)$ pues $(0,0) \\notin \\operatorname{dom}(f_1)$. Al existir su límite (que es $0$), presenta una discontinuidad <strong>reparable</strong>.\n      </li><li>$f_2(x,y) = \\begin{cases} \\frac{x^2}{\\sqrt{x^2+y^2}} & \\text{si } (x,y) \\neq (0,0) \\\\ 0 & \\text{si } (x,y) = (0,0) \\end{cases}$: <strong>Es continua</strong> en $(0,0)$, pues $f_2(0,0) = 0$ coincide con el límite. (De hecho, esta es la extensión $\\tilde{f}_1$).\n      </li><li>$f_3(x,y) = \\begin{cases} \\frac{x^2}{\\sqrt{x^2+y^2}} & \\text{si } (x,y) \\neq (0,0) \\\\ 1 & \\text{si } (x,y) = (0,0) \\end{cases}$: <strong>No es continua</strong> en $(0,0)$, ya que $\\underbrace{f_3(0,0)}_{1} \\neq \\underbrace{\\lim_{(x,y)\\to(0,0)} f_3(x,y)}_{0}$.\n    </li></ol></div></div>\n<div class=\"caja-ram caja-teorema\" style=\"border-left: 4px solid #10b981; background: var(--bg-card); padding: 16px; border-radius: 10px; margin: 16px 0;\"><div class=\"caja-ram-title\" style=\"font-weight: bold; color: #10b981; font-size: 15px; margin-bottom: 8px;\"><i class=\"fa-solid fa-square-root-variable\"></i> Teorema: Propiedades de las Funciones Continuas</div><div class=\"caja-ram-body\"><p>Sean $f, g: D \\subseteq \\mathbb{R}^2 \\to \\mathbb{R}$ continuas en $(x_0, y_0)$:     <ul style=\"margin: 8px 0; padding-left: 20px;\">\n      <li><strong>Álgebra:</strong> Las funciones $f \\pm g$, $f \\cdot g$ y $\\frac{f}{g}$ (si $g(x_0, y_0) \\neq 0$) son continuas en $(x_0, y_0)$.\n      </li><li><strong>Composición:</strong> Si $f \\colon \\mathbb{R}^2 \\to \\mathbb{R}$ es continua en $(x_0, y_0)$ y $h \\colon \\mathbb{R} \\to \\mathbb{R}$ es una función escalar continua en $u_0 = f(x_0, y_0)$, entonces la función compuesta $(h \\circ f)(x,y) = h(f(x,y))$ es continua en $(x_0, y_0)$.\n    </li></ul></p></div></div>",
          contentApplication: "<p>En esta sección pondremos a prueba tu comprensión sobre las tres condiciones de continuidad y la clasificación de las discontinuidades. Veremos cómo una simple evaluación puede engañarnos si no somos rigurosos con el límite.</p>\n\n      <div class=\"quiz-block quiz-alternativas\" style=\"margin:24px 0; padding:20px; background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px;\">\n        <h4 style=\"margin:0 0 12px 0; font-size:16px; color:var(--text-primary);\"><i class=\"fa-solid fa-circle-question\" style=\"color:var(--accent-color);\"></i> Reparando el Espacio</h4>\n        <p style=\"font-size:14px; color:var(--text-secondary); margin-bottom:12px;\">Considere el campo escalar $f(x,y) = \\frac{\\sin(xy)}{xy}$. Sabemos que la función no está definida en los ejes coordenados (donde $x=0$ o $y=0$). Si analizamos el comportamiento exclusivamente en el origen $(0,0)$, ¿cuál de las siguientes afirmaciones es matemáticamente correcta?</p>\n        <div class=\"quiz-options\">\n        <label class=\"quiz-option\" data-correct=\"false\" data-feedback=\"Recuerda la primera condición de continuidad: el punto debe pertenecer al dominio. Como $(0,0) \\notin \\operatorname{dom}(f)$, es imposible que sea continua directamente.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"radio\" name=\"quiz-alt-1784912129598-hz5a\" value=\"0\" data-correct=\"false\" data-feedback=\"Recuerda la primera condición de continuidad: el punto debe pertenecer al dominio. Como $(0,0) \\notin \\operatorname{dom}(f)$, es imposible que sea continua directamente.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">La función es continua en el origen, porque el límite notable garantiza que el resultado es 1.</span>\n        </label>\n      \n        <label class=\"quiz-option\" data-correct=\"false\" data-feedback=\"Cuidado, el límite sí existe. Al hacer la sustitución $u = xy$, cuando $(x,y) \\to (0,0)$, la variable $u \\to 0$. El límite es $\\lim_{u\\to 0}\\frac{\\sin(u)}{u} = 1$.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"radio\" name=\"quiz-alt-1784912129598-hz5a\" value=\"0\" data-correct=\"false\" data-feedback=\"Cuidado, el límite sí existe. Al hacer la sustitución $u = xy$, cuando $(x,y) \\to (0,0)$, la variable $u \\to 0$. El límite es $\\lim_{u\\to 0}\\frac{\\sin(u)}{u} = 1$.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">Presenta una discontinuidad irreparable, ya que al acercarnos por el eje X ($y=0$) la función se indefine y por tanto el límite no existe.</span>\n        </label>\n      \n        <label class=\"quiz-option\" data-correct=\"true\" data-feedback=\"¡Excelente! El límite existe y vale $1$. Dado que la discontinuidad se debe puramente a un fallo en el dominio, podemos &quot;tapar&quot; el agujero asignándole a la función exactamente el valor del límite.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"radio\" name=\"quiz-alt-1784912129598-hz5a\" value=\"1\" data-correct=\"true\" data-feedback=\"¡Excelente! El límite existe y vale $1$. Dado que la discontinuidad se debe puramente a un fallo en el dominio, podemos &quot;tapar&quot; el agujero asignándole a la función exactamente el valor del límite.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">Presenta una discontinuidad reparable. Podemos definir la extensión continua $\\tilde{f}(0,0) = 1$ para que la superficie no tenga un \"agujero\" en el origen.</span>\n        </label>\n      </div>\n        <button type=\"button\" class=\"btn btn-verify-quiz\" onclick=\"verifyQuizAlternatives(this)\" style=\"margin-top:12px; padding:8px 18px; background:var(--accent-color); color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;\">Verificar Respuesta</button>\n        <div class=\"quiz-feedback\" style=\"display:none; margin-top:12px; padding:12px; border-radius:8px;\"></div>\n      </div>\n    \n\n      <div class=\"quiz-block quiz-vf\" data-correct=\"F\" data-feedback-true=\"Incorrecto. Estás asumiendo que la continuidad direccional (por los ejes) implica continuidad bidimensional. Intenta evaluar el límite acercándote por la trayectoria $y = x$ y compara el resultado con $f(0,0)$.\" data-feedback-false=\"¡Correcto! Has detectado la &quot;trampa de los ejes&quot;. Acercarse por los ejes no es suficiente en $\\mathbb{R}^2$. Si te acercas por la recta diagonal $y = x$, el límite es $\\lim_{x\\to 0}\\frac{x^2}{2x^2} = \\frac{1}{2}$. Como $1/2 \\neq 0$, el límite global no existe, lo que significa que estamos ante una &lt;strong&gt;discontinuidad irreparable&lt;/strong&gt; (esencial), a pesar de que la función valga cero en el origen.\" style=\"margin:24px 0; padding:20px; background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px;\">\n        <h4 style=\"margin:0 0 8px 0; font-size:16px; color:var(--text-primary);\"><i class=\"fa-solid fa-toggle-on\" style=\"color:var(--accent-color);\"></i> V/F: La Falsa Sensación de Continuidad</h4>\n        <p style=\"font-size:14px; color:var(--text-secondary); margin-bottom:12px;\">Considere la función definida a trozos:\n    $$ f(x,y) = \\begin{cases} \\frac{xy}{x^2+y^2} & \\text{si } (x,y) \\neq (0,0) \\\\ 0 & \\text{si } (x,y) = (0,0) \\end{cases} $$\n    Un estudiante argumenta lo siguiente: <em>\"Dado que $f(0,0) = 0$, y al acercarnos por el eje X ($y=0$) obtenemos $\\lim_{x\\to 0} \\frac{0}{x^2} = 0$, y por el eje Y ($x=0$) obtenemos $\\lim_{y\\to 0} \\frac{0}{y^2} = 0$, los límites coinciden con la función evaluada. Por lo tanto, $f$ es continua en el origen.\"</em></p>\n        <div style=\"display:flex; gap:16px; margin:12px 0;\">\n          <label style=\"display:flex; align-items:center; gap:6px; cursor:pointer;\">\n            <input type=\"radio\" name=\"quiz-vf-1784912129598-wcjt\" value=\"V\" style=\"accent-color:var(--accent-color);\"> <strong>Verdadero (V)</strong>\n          </label>\n          <label style=\"display:flex; align-items:center; gap:6px; cursor:pointer;\">\n            <input type=\"radio\" name=\"quiz-vf-1784912129598-wcjt\" value=\"F\" style=\"accent-color:var(--accent-color);\"> <strong>Falso (F)</strong>\n          </label>\n        </div>\n        <button type=\"button\" class=\"btn btn-verify-vf\" onclick=\"verifyQuizVF(this)\" style=\"margin-top:8px; padding:8px 18px; background:var(--accent-color); color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;\">Verificar</button>\n        <div class=\"quiz-feedback\" style=\"display:none; margin-top:12px; padding:12px; border-radius:8px;\"></div>\n      </div>\n    \n\n      <div class=\"quiz-block quiz-casillas\" style=\"margin:24px 0; padding:20px; background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px;\">\n        <h4 style=\"margin:0 0 12px 0; font-size:16px; color:var(--text-primary);\"><i class=\"fa-solid fa-list-check\" style=\"color:var(--accent-color);\"></i> Selección Múltiple: Continuidad más allá del origen</h4>\n        <p style=\"font-size:14px; color:var(--text-secondary); margin-bottom:12px;\">Analice el campo escalar $g(x,y) = \\ln(x^2 + y^2 - 1)$. Seleccione <strong>todas</strong> las afirmaciones correctas respecto a la continuidad de esta función en el plano:</p>\n        <div class=\"quiz-casillas-options\">\n        <label class=\"quiz-casilla-option\" data-correct=\"false\" data-feedback=\"Falso. En el origen, el argumento del logaritmo es $0^2+0^2-1 = -1$, lo cual no pertenece al dominio del logaritmo real. No puede ser continua allí.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"checkbox\" value=\"0\" data-correct=\"0\" data-feedback=\"Falso. En el origen, el argumento del logaritmo es $0^2+0^2-1 = -1$, lo cual no pertenece al dominio del logaritmo real. No puede ser continua allí.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">La función es continua en $(0,0)$.</span>\n        </label>\n      \n        <label class=\"quiz-casilla-option\" data-correct=\"true\" data-feedback=\"¡Correcto! En el exterior de la circunferencia de radio 1, el argumento del logaritmo es estrictamente positivo, por lo que la composición de funciones continuas (logaritmo y polinomio) genera una función continua.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"checkbox\" value=\"1\" data-correct=\"1\" data-feedback=\"¡Correcto! En el exterior de la circunferencia de radio 1, el argumento del logaritmo es estrictamente positivo, por lo que la composición de funciones continuas (logaritmo y polinomio) genera una función continua.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">La función es continua en cualquier punto $(x,y)$ que satisfaga la inecuación $x^2 + y^2 > 1$.</span>\n        </label>\n      \n        <label class=\"quiz-casilla-option\" data-correct=\"true\" data-feedback=\"¡Exacto! En la frontera el límite tiende a $-\\infty$ (no es un número real finito), por lo que es una discontinuidad de tipo irreparable o esencial.\" style=\"display:flex; align-items:center; gap:10px; padding:10px 14px; margin:8px 0; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; cursor:pointer;\">\n          <input type=\"checkbox\" value=\"2\" data-correct=\"1\" data-feedback=\"¡Exacto! En la frontera el límite tiende a $-\\infty$ (no es un número real finito), por lo que es una discontinuidad de tipo irreparable o esencial.\" style=\"accent-color:var(--accent-color);\">\n          <span style=\"font-size:14px; color:var(--text-primary);\">Presenta una discontinuidad irreparable en todos los puntos de la frontera $x^2 + y^2 = 1$.</span>\n        </label>\n      </div>\n        <button type=\"button\" class=\"btn btn-verify-casillas\" onclick=\"verifyQuizCasillas(this)\" style=\"margin-top:12px; padding:8px 18px; background:var(--accent-color); color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;\">Verificar Selecciones</button>\n        <div class=\"quiz-feedback\" style=\"display:none; margin-top:12px; padding:12px; border-radius:8px;\"></div>\n      </div>\n    \n\n      <div class=\"quiz-block quiz-pareados-2col\" style=\"margin: 24px 0; padding: 20px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px;\">\n        <h4 style=\"margin: 0 0 16px 0; font-size: 16px; color: var(--text-primary);\">\n          <i class=\"fa-solid fa-network-wired\" style=\"color: var(--accent-color);\"></i> Clasificando Discontinuidades\n        </h4>\n\n        <!-- DOS COLUMNAS LATERALES -->\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 20px;\">\n          <div>\n            <h5 style=\"margin: 0 0 8px 0; color: var(--accent-color); font-size: 14px;\">Columna 1: Expresiones</h5>\n            <div style=\"display: flex; flex-direction: column; gap: 8px;\"><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>1.</strong> $\\displaystyle f(x,y) = \\frac{\\sin(x^2+y^2)}{x^2+y^2}$ (no definida en el origen)</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>2.</strong> $\\displaystyle f(x,y) = \\begin{cases} \\frac{x^2}{x^2+y^2} & (x,y) \\neq (0,0) \\\\ 0 & (x,y) = (0,0) \\end{cases}$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>3.</strong> $\\displaystyle f(x,y) = \\begin{cases} \\frac{xy^2}{x^2+y^2} & (x,y) \\neq (0,0) \\\\ 0 & (x,y) = (0,0) \\end{cases}$</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>4.</strong> $\\displaystyle f(x,y) = \\frac{x^2-y^2}{x^2+y^2}$ (no definida en el origen)</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>5.</strong> $\\displaystyle f(x,y) = \\frac{1-\\cos(x^2+y^2)}{(x^2+y^2)^2}$ (no definida en el origen)</div></div>\n          </div>\n          <div>\n            <h5 style=\"margin: 0 0 8px 0; color: var(--accent-color); font-size: 14px;\">Columna 2: Clasificación</h5>\n            <div style=\"display: flex; flex-direction: column; gap: 8px;\"><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>A.</strong> Discontinua Reparable (límite es 1)</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>B.</strong> Discontinua Irreparable (límite no existe)</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>C.</strong> Completamente Continua</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>D.</strong> Discontinua Irreparable (límite no existe por caminos)</div><div style=\"padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 13.5px; border: 1px solid var(--border-color);\"><strong>E.</strong> Discontinua Reparable (límite es 1/2)</div></div>\n          </div>\n        </div>\n\n        <!-- FILAS DE SELECCIÓN DE ASOCIACIÓN -->\n        <h5 style=\"margin: 16px 0 10px 0; font-size: 14px; color: var(--text-primary);\">Asocia cada Ítem de la Columna 1 con su Letra (Col 2):</h5>\n        <div style=\"display: flex; flex-direction: column; gap: 10px;\">\n          \n        <div class=\"pareo-row-item\" data-num=\"1\" data-correct-letter=\"A\" data-feedback=\"¡Excelente! Al no estar definida en $(0,0)$ es discontinua, pero el límite notable $\\sin(u)/u$ existe y vale 1. Se puede reparar.\" style=\"display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;\">\n          <span style=\"font-weight: bold; width: 70px;\">Ítem 1:</span>\n          <span style=\"font-size: 13px; color: var(--text-muted);\">Letra:</span>\n          <select class=\"pareo-select-col2\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option><option value=\"D\">D</option><option value=\"E\">E</option>\n          </select>\n        </div>\n      \n        <div class=\"pareo-row-item\" data-num=\"2\" data-correct-letter=\"B\" data-feedback=\"¡Perfecto! El límite general no existe (evaluar por el eje X da 1, por el eje Y da 0). Al no haber límite, es irreparable.\" style=\"display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;\">\n          <span style=\"font-weight: bold; width: 70px;\">Ítem 2:</span>\n          <span style=\"font-size: 13px; color: var(--text-muted);\">Letra:</span>\n          <select class=\"pareo-select-col2\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option><option value=\"D\">D</option><option value=\"E\">E</option>\n          </select>\n        </div>\n      \n        <div class=\"pareo-row-item\" data-num=\"3\" data-correct-letter=\"C\" data-feedback=\"¡Muy bien! $f(0,0) = 0$, y por el Teorema de Cero por Acotado, el límite existe y vale $0$. Es continua.\" style=\"display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;\">\n          <span style=\"font-weight: bold; width: 70px;\">Ítem 3:</span>\n          <span style=\"font-size: 13px; color: var(--text-muted);\">Letra:</span>\n          <select class=\"pareo-select-col2\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option><option value=\"D\">D</option><option value=\"E\">E</option>\n          </select>\n        </div>\n      \n        <div class=\"pareo-row-item\" data-num=\"4\" data-correct-letter=\"D\" data-feedback=\"¡Correcto! Acercarse por el eje X da 1 y por el eje Y da -1. Una grieta estructural que la hace irreparable.\" style=\"display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;\">\n          <span style=\"font-weight: bold; width: 70px;\">Ítem 4:</span>\n          <span style=\"font-size: 13px; color: var(--text-muted);\">Letra:</span>\n          <select class=\"pareo-select-col2\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option><option value=\"D\">D</option><option value=\"E\">E</option>\n          </select>\n        </div>\n      \n        <div class=\"pareo-row-item\" data-num=\"5\" data-correct-letter=\"E\" data-feedback=\"¡Gran análisis! Haciendo $u=x^2+y^2$, el límite notable $(1-\\cos u)/u^2$ tiende a 1/2. Basta con asignarle ese valor para hacerla continua.\" style=\"display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;\">\n          <span style=\"font-weight: bold; width: 70px;\">Ítem 5:</span>\n          <span style=\"font-size: 13px; color: var(--text-muted);\">Letra:</span>\n          <select class=\"pareo-select-col2\" style=\"padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 600; cursor: pointer;\">\n            <option value=\"\">-- Elegir --</option>\n            <option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option><option value=\"D\">D</option><option value=\"E\">E</option>\n          </select>\n        </div>\n      \n        </div>\n\n        <button type=\"button\" class=\"btn btn-verify-pareados\" onclick=\"verifyQuizPareados2Col(this)\" style=\"margin-top: 16px; padding: 10px 22px; background: var(--accent-color); color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px;\">\n          <i class=\"fa-solid fa-circle-check\"></i> Verificar Asociaciones\n        </button>\n\n        <div class=\"quiz-feedback\" style=\"display:none; margin-top:16px; padding:14px; border-radius:8px;\"></div>\n      </div>\n    ",
          contentExercises: "[{\"id\":\"ex-1784912129588-e5gc\",\"title\":\"Continuidad con Parámetros $\\\\alpha$ y $\\\\beta$\",\"level\":\"resuelto\",\"statement\":\"<p>Dados los parámetros $\\\\alpha > 0$ y $\\\\beta > 0$, defina la función:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ f(x,y) = \\\\begin{cases} \\\\frac{(xy)^\\\\alpha}{(x^2+y^2)^\\\\beta} & \\\\text{si } (x,y) \\\\neq (0,0) \\\\\\\\[0.5em] 0 & \\\\text{si } (x,y) = (0,0) \\\\end{cases} $$</div>       Muestre formalmente que $f$ es continua en el origen si y solo si $\\\\alpha > \\\\beta$.</p>\",\"solution\":\"<p>Para que $f$ sea continua en el origen, debe cumplirse que $\\\\lim_{(x,y)\\\\to(0,0)} f(x,y) = f(0,0) = 0$.</p>\\n<p>Aplicamos el cambio a coordenadas polares ($x = \\\\rho\\\\cos\\\\theta$, $y = \\\\rho\\\\sin\\\\theta$) notando que $x^2+y^2 = \\\\rho^2$.        Sustituimos en la expresión tomando el valor absoluto para analizar el acotamiento:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\left| \\\\frac{(\\\\rho\\\\cos\\\\theta \\\\cdot \\\\rho\\\\sin\\\\theta)^\\\\alpha}{(\\\\rho^2)^\\\\beta} \\\\right| = \\\\frac{\\\\rho^{2\\\\alpha} |\\\\cos\\\\theta\\\\sin\\\\theta|^\\\\alpha}{\\\\rho^{2\\\\beta}} = \\\\rho^{2(\\\\alpha-\\\\beta)} |\\\\cos\\\\theta\\\\sin\\\\theta|^\\\\alpha $$</div></p>\\n<p>Para que el límite exista y sea igual a $0$, el comportamiento respecto al radio $\\\\rho \\\\to 0^+$ debe anular la expresión <strong>independientemente</strong> del ángulo $\\\\theta$. Evaluamos los tres casos posibles para el exponente de $\\\\rho$:</p>\\n<ol style=\\\"margin: 8px 0; padding-left: 20px;\\\">\\n        <li><strong>Si $\\\\alpha > \\\\beta$:</strong> El exponente $2(\\\\alpha-\\\\beta)$ es estrictamente positivo. Cuando $\\\\rho \\\\to 0^+$, el término $\\\\rho^{2(\\\\alpha-\\\\beta)} \\\\to 0$. Al estar multiplicado por una función trigonométrica acotada ($|\\\\cos\\\\theta\\\\sin\\\\theta|^\\\\alpha \\\\leq 1$), el límite es $0$. En este caso, $f$ es continua.\\n        </li><li><strong>Si $\\\\alpha = \\\\beta$:</strong> El exponente es $0$, por lo que $\\\\rho^0 = 1$. El límite depende exclusivamente de $\\\\theta$ (específicamente vale $\\\\cos^\\\\alpha\\\\theta \\\\sin^\\\\alpha\\\\theta$). Como el valor cambia según la trayectoria, el límite <strong>no existe</strong>.\\n        </li><li><strong>Si $\\\\alpha < \\\\beta$:</strong> El exponente es negativo. La expresión $\\\\rho^{2(\\\\alpha-\\\\beta)}$ se va al denominador, por lo que cuando $\\\\rho \\\\to 0^+$, la función diverge hacia infinito para ángulos donde el numerador no se anule. El límite <strong>no existe</strong>.\\n      </li></ol>\\n<p><strong>Conclusión:</strong> La única forma de que el límite exista y sea igual a $0$ (coincidiendo con $f(0,0)$) es que $\\\\alpha > \\\\beta$.</p>\"},{\"id\":\"ex-1784912129588-1sj0\",\"title\":\"Redefinición y Extensión por Continuidad\",\"level\":\"resuelto\",\"statement\":\"<p>Estudie el límite $\\\\lim_{(x,y)\\\\to(0,0)} f(x,y)$ para cada una de las siguientes funciones. En base a su respuesta, decida si es posible dar un valor a $f(0,0)$ de tal manera que la función quede continua en $(0,0)$ (discontinuidad reparable).</p>\\n<ol style=\\\"margin: 8px 0; padding-left: 20px;\\\">\\n        <li>$\\\\displaystyle f(x,y) = \\\\frac{\\\\tan(x^2+y^2)}{x^2+y^2}$\\n        </li><li>$\\\\displaystyle f(x,y) = \\\\frac{\\\\tan(xy)}{y}$\\n        </li><li>$\\\\displaystyle f(x,y) = \\\\frac{x}{y}$\\n        </li><li>$\\\\displaystyle f(x,y) = \\\\frac{xy+y^3}{x^2+y^2}$\\n      </li></ol>\",\"solution\":\"<ol style=\\\"margin: 8px 0; padding-left: 20px;\\\">\\n        <li><strong>Análisis:</strong> Haciendo el cambio $u = x^2+y^2$, tenemos $\\\\lim_{u\\\\to 0}\\\\frac{\\\\tan u}{u} = 1$. El límite existe (inspección directa y límites notables).\\\\\\\\\\n        <strong>Conclusión:</strong> Discontinuidad reparable. Es posible hacerla continua definiendo $f(0,0) = 1$.\\n        \\n        </li><li><strong>Análisis:</strong> Multiplicando y dividiendo por $x$, obtenemos $x \\\\cdot \\\\frac{\\\\tan(xy)}{xy}$. Usando el límite notable $\\\\tan(u)/u \\\\to 1$, nos queda $\\\\lim_{(x,y)\\\\to(0,0)} (x \\\\cdot 1) = 0$. El límite existe.\\\\\\\\\\n        <strong>Conclusión:</strong> Discontinuidad reparable. Es posible hacerla continua definiendo $f(0,0) = 0$.\\n        \\n        </li><li><strong>Análisis:</strong> Evaluando por la familia de rectas $y = mx$, el límite resulta $\\\\frac{x}{mx} = \\\\frac{1}{m}$. Como el resultado depende de la pendiente $m$, el límite no existe.\\\\\\\\\\n        <strong>Conclusión:</strong> Discontinuidad irreparable. No es posible dar un valor a $f(0,0)$.\\n        \\n        </li><li><strong>Análisis:</strong> Pasando a polares, obtenemos $\\\\frac{\\\\rho^2\\\\cos\\\\theta\\\\sin\\\\theta + \\\\rho^3\\\\sin^3\\\\theta}{\\\\rho^2} = \\\\cos\\\\theta\\\\sin\\\\theta + \\\\rho\\\\sin^3\\\\theta$. Cuando $\\\\rho \\\\to 0$, el límite es $\\\\cos\\\\theta\\\\sin\\\\theta$, el cual depende del ángulo de aproximación.\\\\\\\\\\n        <strong>Conclusión:</strong> Discontinuidad irreparable. No es posible dar un valor a $f(0,0)$.\\n      </li></ol>\"},{\"id\":\"ex-1784912129589-qee6\",\"title\":\"Continuidad en Regiones Definidas a Trozos\",\"level\":\"resuelto\",\"statement\":\"<p>Sea $f: \\\\mathbb{R}^2 \\\\to \\\\mathbb{R}$ el campo escalar definido por:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ f(x,y) = \\\\begin{cases} \\\\alpha(x^2+y^2) & \\\\text{si } x^2+y^2 < 2 \\\\\\\\[0.5em] \\\\frac{1}{\\\\beta\\\\sqrt{x^2+y^2}} & \\\\text{si } x^2+y^2 \\\\ge 2 \\\\end{cases} $$</div>       <ul style=\\\"margin: 8px 0; padding-left: 20px;\\\">\\n        <li><strong>a)</strong> Estudie la continuidad de $f$ en el conjunto $D = \\\\{ (x,y) \\\\in \\\\mathbb{R}^2 \\\\colon x^2+y^2 \\\\neq 2 \\\\}$.\\n        </li><li><strong>b)</strong> ¿Qué relación deben satisfacer $\\\\alpha$ y $\\\\beta$ de modo que $f$ sea continua en todo $\\\\mathbb{R}^2$?\\n      </li></ul></p>\",\"solution\":\"<p><strong>Parte a) Continuidad en $D$:</strong>        El conjunto $D$ representa todo el plano excepto la circunferencia de radio $\\\\sqrt{2}$.        <ul style=\\\"margin: 8px 0; padding-left: 20px;\\\">\\n        <li>Para la región interior ($x^2+y^2 < 2$), la función es $\\\\alpha(x^2+y^2)$, que es un polinomio y, por definición, <strong>continua</strong> en todo su subdominio.\\n        </li><li>Para la región exterior ($x^2+y^2 > 2$), la función es una composición de funciones racionales y raíces cuadradas. Como el denominador $\\\\beta\\\\sqrt{x^2+y^2}$ jamás se anula en esta región (es estrictamente mayor que $\\\\beta\\\\sqrt{2}$), la función también es <strong>continua</strong>.\\n      </li></ul></p>\\n<p><strong>Parte b) Continuidad en $\\\\mathbb{R}^2$:</strong>       Para que sea continua en todo $\\\\mathbb{R}^2$, los límites laterales deben coincidir en la frontera $x^2+y^2 = 2$. Tomemos un punto $(x_0, y_0)$ cualquiera que pertenezca a dicha frontera.</p>\\n<p>Evaluamos el límite acercándonos desde el <strong>interior</strong>:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\lim_{(x,y) \\\\to (x_0,y_0)^-} \\\\alpha(x^2+y^2) = \\\\alpha(2) = 2\\\\alpha $$</div></p>\\n<p>Evaluamos el límite acercándonos desde el <strong>exterior</strong> (y el valor de la función):       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ \\\\lim_{(x,y) \\\\to (x_0,y_0)^+} \\\\frac{1}{\\\\beta\\\\sqrt{x^2+y^2}} = \\\\frac{1}{\\\\beta\\\\sqrt{2}} $$</div></p>\\n<p>Para garantizar la continuidad (ausencia de salto en la frontera), ambos límites deben ser idénticos:       <div class=\\\"formula-block\\\" style=\\\"text-align:center; margin: 12px 0;\\\">$$ 2\\\\alpha = \\\\frac{1}{\\\\beta\\\\sqrt{2}} \\\\implies \\\\alpha\\\\beta = \\\\frac{1}{2\\\\sqrt{2}} = \\\\frac{\\\\sqrt{2}}{4} $$</div>       Por lo tanto, la relación exigida es $\\\\alpha\\\\beta = \\\\frac{\\\\sqrt{2}}{4}$.</p>\"}]",
          contentFormulas: "[{\"id\":\"form-1784912129588-h1ko\",\"title\":\"Condiciones de Continuidad en $(x_0, y_0)$\",\"latex\":\"(x_0,y_0) \\\\in \\\\operatorname{dom}(f) \\\\;\\\\wedge\\\\; \\\\exists \\\\lim_{(x,y)\\\\to(x_0,y_0)} f(x,y) \\\\;\\\\wedge\\\\; \\\\lim_{(x,y)\\\\to(x_0,y_0)} f(x,y) = f(x_0,y_0)\",\"description\":\"Las tres reglas de oro: El punto debe existir, la tendencia debe existir unívocamente, y ambas alturas deben ser exactamente la misma.\"},{\"id\":\"form-1784912129588-9vka\",\"title\":\"Discontinuidad Reparable\",\"latex\":\"\\\\lim_{(x,y)\\\\to(x_0,y_0)} f(x,y) = L \\\\in \\\\mathbb{R} \\\\quad \\\\text{pero} \\\\quad f(x_0,y_0) \\\\neq L \\\\;\\\\text{ o }\\\\; \\\\nexists f(x_0,y_0)\",\"description\":\"El límite existe y es finito, lo que permite \\\"tapar el agujero\\\" redefiniendo el punto con el valor $L$.\"},{\"id\":\"form-1784912129588-2e2u\",\"title\":\"Extensión por Continuidad ($\\\\tilde{f}$)\",\"latex\":\"\\\\tilde{f}(x,y) = \\\\begin{cases} f(x,y) & (x,y) \\\\neq (x_0,y_0) \\\\\\\\ \\\\lim_{(u,v)\\\\to(x_0,y_0)} f(u,v) & (x,y) = (x_0,y_0) \\\\end{cases}\",\"description\":\"La nueva función matemáticamente pulida que repara la discontinuidad original y hace a la superficie totalmente continua.\"}]"
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
      } else if (c.id === 'calculo-integral') {
        const u1Id = unitIdCounter++;
        defaultUnits.push(
          { id: u1Id, courseId: c.id, unitIndex: 1, title: 'Series de Potencias', isLocked: false }
        );

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

        defaultChapters.push({
          id: chapterIdCounter++,
          unitId: u1Id,
          chapterIndex: '1.1',
          title: 'Radio e intervalo de potencias',
          isCompleted: false,
          isLocked: false,
          contentMotivation: capIntPotMotivation,
          contentTheory: capIntPotTheory,
          contentApplication: capIntPotApplication,
          contentExercises: capIntPotExercises,
          contentFormulas: capIntPotFormulas
        });

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
            "solution": "<strong>Pauta de control:</strong><p>Integrando la serie geométrica $\\frac{1}{1-x} = \\sum_{n=0}^{\\infty} x^n$ término a término:</p>$$-\\ln(1-x) = \\int \\frac{1}{1-x}\\,dx = C + \\sum_{n=0}^{\\infty} \\frac{x^{n+1}}{n+1}$$<p>Evaluando en $x=0$, vemos que $-\\ln(1) = 0 \\implies C = 0$. Haciendo un desfase de índice, la serie es $\\sum_{n=1}^{\\infty} \\frac{x^n}{n}$. El radio de convergencia es $R=1$. Evaluando los extremos:</p><ul><li>Si $x=1$: Serie armónica (Diverge).</li><li>Si $x=-1$: Serie armónica alternada (Para la cual converge por Leibniz).</li></ul><strong>Resultado:</strong> Serie: $\\sum_{n=1}^{\\infty} \\frac{x^n}{n}$, Intervalo: $[-1, 1)$."
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
            "solution": "<strong>Pauta de control:</strong><p>Sustituimos la serie en la ecuación integral:</p>$$\\sum_{n=0}^{\\infty} a_n x^n = 1 + \\int_0^x \\left(\\sum_{n=0}^{\\infty} a_n t^n\\right)\\,dt = 1 + \\sum_{n=0}^{\\infty} \\frac{a_n}{n+1} x^{n+1}$$<p>Igualando términos de igual potencia:</p><ul><li>Para $n=0$: $a_0 = 1$.</li><li>Para potencias $x^{n+1}$: $a_{n+1} = \\frac{a_n}{n+1}$.</li></ul><p>Esto resulta en $a_n = \\frac{1}{n!}$, que corresponde al desarrollo de Maclaurin de $e^x$.</p><strong>Resultado:</strong> $a_n = \\frac{1}{n!}$ para todo $n \\ge 0$."
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

        defaultChapters.push({
          id: chapterIdCounter++,
          unitId: u1Id,
          chapterIndex: '1.2',
          title: 'Operaciones con series de potencias',
          isCompleted: false,
          isLocked: false,
          contentMotivation: capIntPot2Motivation,
          contentTheory: capIntPot2Theory,
          contentApplication: capIntPot2Application,
          contentExercises: capIntPot2Exercises,
          contentFormulas: capIntPot2Formulas
        });
      } else if (c.id === 'introduccion-algebra') {
        const u1Id = unitIdCounter++;
        const u2Id = unitIdCounter++;
        const u3Id = unitIdCounter++;

        defaultUnits.push(
          { id: u1Id, courseId: c.id, unitIndex: 1, title: 'Fundamentos y Conceptos Básicos', isLocked: false },
          { id: u2Id, courseId: c.id, unitIndex: 2, title: 'Aplicaciones y Métodos Avanzados', isLocked: false },
          { id: u3Id, courseId: c.id, unitIndex: 3, title: 'Polinomios', isLocked: false }
        );

        // Capítulos de Unidad 1
        defaultChapters.push({
          id: chapterIdCounter++,
          unitId: u1Id,
          chapterIndex: '1.1',
          title: 'Introducción y Definición Primaria',
          isCompleted: false,
          isLocked: false,
          contentMotivation: `<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación de ${c.title}</div><p>Este capítulo introduce las bases del ${c.title}.</p></div></div>`,
          contentTheory: `<h3>Bases Teóricas</h3><p>Definiciones fundamentales.</p>`,
          contentApplication: '<h3>Campos de Aplicación</h3><p>Ejemplos reales.</p>',
          contentExercises: JSON.stringify([{ title: "Básico", level: "nivel-1", statement: "Resuelva el problema básico.", solution: "Pauta básica." }]),
          contentFormulas: JSON.stringify([{ title: "Fórmula", latex: "y=f(x)", description: "Definición." }])
        });

        // Capítulos de Unidad 2
        defaultChapters.push({
          id: chapterIdCounter++,
          unitId: u2Id,
          chapterIndex: '2.1',
          title: 'Métodos de Resolución Estándar',
          isCompleted: false,
          isLocked: false,
          contentMotivation: '<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación</div><p>Métodos de resolución.</p></div></div>',
          contentTheory: '<h3>Métodos</h3><p>Algoritmos de álgebra.</p>',
          contentApplication: '<h3>Aplicaciones</h3><p>Casos prácticos.</p>',
          contentExercises: JSON.stringify([{ title: "Resolución", level: "nivel-2", statement: "Resuelva la ecuación lineal.", solution: "x = 2." }]),
          contentFormulas: JSON.stringify([{ title: "Ecuación", latex: "ax + b = 0", description: "Lineal." }])
        });

        // Capítulos de Unidad 3: Polinomios
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

            <div id="ruf-explanation-box" style="margin-top: 16px; background: var(--accent-bg); border-left: 4px solid var(--accent-color); padding: 14px 16px; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 1.05rem; color: var(--text-secondary); transition: all 0.3s ease;">
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

        defaultChapters.push({
          id: chapterIdCounter++,
          unitId: u3Id,
          chapterIndex: '3.1',
          title: 'Algoritmo de la división',
          isCompleted: false,
          isLocked: false,
          contentMotivation: capPolMotivation,
          contentTheory: capPolTheory,
          contentApplication: capPolApplication,
          contentExercises: capPolExercises,
          contentFormulas: capPolFormulas
        });
      } else if (c.id === 'introduccion-calculo') {
        const u1Id = unitIdCounter++;
        const u2Id = unitIdCounter++;
        const u3Id = unitIdCounter++;

        defaultUnits.push(
          { id: u1Id, courseId: c.id, unitIndex: 1, title: 'Fundamentos y Conceptos Básicos', isLocked: false },
          { id: u2Id, courseId: c.id, unitIndex: 2, title: 'Aplicaciones y Métodos Avanzados', isLocked: false },
          { id: u3Id, courseId: c.id, unitIndex: 3, title: 'Sucesiones', isLocked: false }
        );

        // Capítulos de Unidad 1
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
          contentExercises: JSON.stringify([{ title: "Ejercicio de Introducción", level: "nivel-1", statement: "Resuelva el problema básico del área.", solution: "Procedimiento y resultado final." }]),
          contentFormulas: JSON.stringify([{ title: "Fórmula de Entrada", latex: "y = f(x)", description: "Representación estándar de una función real." }])
        });

        // Capítulos de Unidad 2
        defaultChapters.push({
          id: chapterIdCounter++,
          unitId: u2Id,
          chapterIndex: '2.1',
          title: 'Introducción y Definición Primaria',
          isCompleted: false,
          isLocked: false,
          contentMotivation: `<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Motivación de ${c.title}</div><p>Este capítulo introduce las bases conceptuales indispensables para comprender la asignatura de ${c.title}.</p></div></div>`,
          contentTheory: `<h3>Bases Teóricas de ${c.title}</h3><p>Definiciones fundamentales y terminología general del área.</p>`,
          contentApplication: '<h3>Campos de Aplicación</h3><p>Ejemplos reales en física, ingeniería o ciencias sociales.</p>',
          contentExercises: JSON.stringify([{ title: "Ejercicio de Introducción", level: "nivel-1", statement: "Resuelva el problema básico del área.", solution: "Procedimiento y resultado final." }]),
          contentFormulas: JSON.stringify([{ title: "Fórmula de Entrada", latex: "y = f(x)", description: "Representación estándar de una función real." }])
        });

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
        defaultChapters.push({
          id: chapterIdCounter++,
          unitId: u3Id,
          chapterIndex: '3.1',
          title: 'Domina la intuición visual',
          isCompleted: false,
          isLocked: false,
          contentMotivation: capSuc1Motivation,
          contentTheory: capSuc1Theory,
          contentApplication: capSuc1Application,
          contentExercises: capSuc1Exercises,
          contentFormulas: capSuc1Formulas
        });

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

        defaultChapters.push({
          id: chapterIdCounter++,
          unitId: u3Id,
          chapterIndex: '3.2',
          title: 'Enfréntate al límite formal',
          isCompleted: false,
          isLocked: false,
          contentMotivation: capSuc2Motivation,
          contentTheory: capSuc2Theory,
          contentApplication: capSuc2Application,
          contentExercises: capSuc2Exercises,
          contentFormulas: capSuc2Formulas
        });

        // Placeholders de Capítulos 3.3 a 3.6 (Nivel 3 a 6)
        const placeholders = [
          { index: '3.3', title: 'Domina el álgebra de límites' },
          { index: '3.4', title: 'Compara y acota sucesiones' },
          { index: '3.5', title: 'Demuestra la existencia del límite' },
          { index: '3.6', title: 'Profundiza en la topología' }
        ];

        placeholders.forEach(ph => {
          defaultChapters.push({
            id: chapterIdCounter++,
            unitId: u3Id,
            chapterIndex: ph.index,
            title: ph.title,
            isCompleted: false,
            isLocked: false,
            contentMotivation: `<div class="caja-ram caja-motivacion"><div class="caja-ram-icon">💡</div><div class="caja-ram-body"><div class="caja-ram-title">Sucesiones: ${ph.title}</div><p>Este capítulo profundiza en la teoría y práctica de ${ph.title}.</p></div></div>`,
            contentTheory: '<h3>Próximamente</h3><p>Contenido en desarrollo.</p>',
            contentApplication: '<h3>Próximamente</h3><p>Contenido en desarrollo.</p>',
            contentExercises: JSON.stringify([]),
            contentFormulas: JSON.stringify([])
          });
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

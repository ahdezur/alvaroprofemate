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
        { dayOfWeek: 0, isActive: false, startTime: '09:00', endTime: '18:00', slotDuration: 60 },
        { dayOfWeek: 1, isActive: true, startTime: '09:00', endTime: '18:00', slotDuration: 60 },
        { dayOfWeek: 2, isActive: true, startTime: '09:00', endTime: '18:00', slotDuration: 60 },
        { dayOfWeek: 3, isActive: true, startTime: '09:00', endTime: '18:00', slotDuration: 60 },
        { dayOfWeek: 4, isActive: true, startTime: '09:00', endTime: '18:00', slotDuration: 60 },
        { dayOfWeek: 5, isActive: true, startTime: '09:00', endTime: '18:00', slotDuration: 60 },
        { dayOfWeek: 6, isActive: false, startTime: '09:00', endTime: '18:00', slotDuration: 60 }
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
    
    console.log("%c[SIMULACIÓN CORREO - CONFIRMACIÓN]", "background: #6366f1; color: white; padding: 3px 6px; border-radius: 3px; font-weight: bold;");
    console.log(`Para: ${newBooking.email}\nAsunto: ¡Tu clase ha sido reservada! - AlvaroProfeMate\nDetalles: Estudiante: ${newBooking.name}, Asignatura: ${newBooking.subject}, Fecha: ${newBooking.date}, Hora: ${newBooking.time} hrs`);
    
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
  }
};

window.DB = DB;

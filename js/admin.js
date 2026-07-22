// Lógica de Autenticación, Dashboard y Editor WYSIWYG para el Admin Panel

document.addEventListener("DOMContentLoaded", () => {
  populateTimeDropdowns();
  checkSession();
  initDashboardNavigation();
  initWysiwygEditor();
  initPostFormSubmit();
  initAvailabilityFormSubmit();
  initCronSimulationButton();
  initCoursesManager();
});

/* ==========================================================================
   Autenticación y Sesión
   ========================================================================== */
function checkSession() {
  const isLogged = sessionStorage.getItem("alvaro_profemate_logged_in") === "true";
  const loginWrapper = document.getElementById("login-wrapper");
  const dashboardWrapper = document.getElementById("dashboard-wrapper");

  if (isLogged) {
    loginWrapper.style.display = "none";
    dashboardWrapper.style.display = "flex";
    
    // Configurar badges del DB
    const dbBadge = document.getElementById("db-mode-badge");
    const statSync = document.getElementById("stat-sync");
    
    DB.isApiAvailable().then(apiActive => {
      if (apiActive) {
        dbBadge.textContent = "Netlify Postgres (Nube)";
        dbBadge.style.background = "rgba(99, 102, 241, 0.1)"; // indigo
        dbBadge.style.color = "#6366f1";
        statSync.textContent = "Postgres Activo";
        statSync.style.color = "#10b981";
      } else {
        dbBadge.textContent = "LocalStorage (Local)";
        dbBadge.style.background = "rgba(245, 158, 11, 0.1)"; // naranja
        dbBadge.style.color = "#f59e0b";
        statSync.textContent = "Local (Demo)";
        statSync.style.color = "#f59e0b";
      }
    });

    renderPostsTable();
  } else {
    loginWrapper.style.display = "flex";
    dashboardWrapper.style.display = "none";
    initLoginForm();
  }
}

function initLoginForm() {
  const form = document.getElementById("login-form");
  const errorMsg = document.getElementById("login-error");
  const submitBtn = form.querySelector("button[type='submit']");

  form.onsubmit = async (e) => {
    e.preventDefault();
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Verificando...`;

    try {
      const isValid = await DB.verifyCredentials(user, pass);
      
      if (isValid) {
        sessionStorage.setItem("alvaro_profemate_logged_in", "true");
        sessionStorage.setItem("admin_user", user);
        sessionStorage.setItem("admin_pass", pass);
        errorMsg.style.display = "none";
        checkSession();
      } else {
        errorMsg.style.display = "block";
        document.getElementById("password").value = "";
        document.getElementById("password").focus();
      }
    } catch (err) {
      console.error(err);
      errorMsg.textContent = "Error de conexión con el servidor.";
      errorMsg.style.display = "block";
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Iniciar Sesión`;
    }
  };
}

// Cierre de sesión
document.getElementById("btn-logout").onclick = () => {
  sessionStorage.removeItem("alvaro_profemate_logged_in");
  sessionStorage.removeItem("admin_user");
  sessionStorage.removeItem("admin_pass");
  window.location.reload();
};

/* ==========================================================================
   Navegación del Dashboard
   ========================================================================== */
function initDashboardNavigation() {
  const menuItems = document.querySelectorAll(".admin-menu-item");
  const sections = document.querySelectorAll(".admin-section");
  const sectionTitle = document.getElementById("section-title");

  menuItems.forEach(item => {
    // Evitar el botón de cerrar sesión
    if (item.id === "btn-logout") return;

    item.addEventListener("click", () => {
      const sectionId = item.getAttribute("data-section");
      
      // Cambiar clases activas en el menú
      menuItems.forEach(mi => mi.classList.remove("active"));
      item.classList.add("active");

      // Cambiar secciones visibles
      sections.forEach(sec => sec.classList.remove("active"));
      document.getElementById(`section-${sectionId}`).classList.add("active");

      // Cambiar títulos superiores
      if (sectionId === "dashboard") {
        sectionTitle.textContent = "Panel de Control";
        renderPostsTable(); // Recargar datos al regresar al panel
      } else if (sectionId === "editor") {
        sectionTitle.textContent = "Redactor de Contenido";
        resetEditorForm(); // Limpiar por si estaba en modo edición
      } else if (sectionId === "courses") {
        sectionTitle.textContent = "Gestión de Cursos y Contenido RAM";
        loadCoursesManager();
      } else if (sectionId === "settings") {
        sectionTitle.textContent = "Gestión de Agenda y Reservas";
        renderBookingsTable();
        loadAvailabilityForm();
      }
    });
  });

  // Botón cancelar en el editor
  document.getElementById("btn-cancel-edit").onclick = () => {
    document.getElementById("menu-dashboard").click();
  };
}

/* ==========================================================================
   CRUD: Visualización y Operaciones
   ========================================================================== */
let allPostsCache = [];

async function renderPostsTable() {
  const tbody = document.getElementById("posts-table-body");
  const statTotalPosts = document.getElementById("stat-total-posts");
  const statCategories = document.getElementById("stat-categories");

  try {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: var(--text-muted);">
          <i class="fa-solid fa-spinner fa-spin"></i> Cargando lecturas...
        </td>
      </tr>
    `;

    const posts = await DB.getAllPosts();
    allPostsCache = posts;

    // Actualizar estadísticas básicas
    statTotalPosts.textContent = posts.length;
    
    const categories = [...new Set(posts.map(p => p.category))];
    statCategories.textContent = categories.length;

    if (posts.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px 0;">
            No hay lecturas registradas. ¡Crea una nueva en la pestaña de edición!
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = "";
    posts.forEach(post => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong style="color: var(--text-primary); font-size: 15px;">${escapeHtml(post.title)}</strong></td>
        <td><span class="table-tag">${escapeHtml(post.category)}</span></td>
        <td>${formatDate(post.date)}</td>
        <td>
          <div class="action-btns">
            <button class="btn-icon btn-edit" data-id="${post.id}" title="Editar Lectura"><i class="fa-solid fa-pencil"></i></button>
            <button class="btn-icon btn-delete" data-id="${post.id}" title="Eliminar Lectura"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      `;

      // Eventos individuales
      tr.querySelector(".btn-edit").addEventListener("click", () => loadPostToEditor(post.id));
      tr.querySelector(".btn-delete").addEventListener("click", () => deletePostHandler(post.id));

      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error("Error renderizando tabla:", error);
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: #ef4444;">
          Error al obtener los datos. Por favor refresca la página.
        </td>
      </tr>
    `;
  }
}

// Cargar un post en el formulario para editar
function loadPostToEditor(postId) {
  const post = allPostsCache.find(p => p.id === postId);
  if (!post) return;

  // Llenar campos
  document.getElementById("edit-post-id").value = post.id;
  document.getElementById("post-title").value = post.title;
  document.getElementById("post-category").value = post.category;
  document.getElementById("post-excerpt").value = post.excerpt;
  document.getElementById("post-read-time").value = post.readTime || "5 min";

  // Sincronizar editor visual
  const editorVisual = document.getElementById("editor-visual");
  const editorCode = document.getElementById("editor-code");
  const btnHtmlMode = document.getElementById("btn-html-mode");

  // Reset del modo HTML
  if (btnHtmlMode.classList.contains("active")) {
    // Si estaba en modo código, cerrarlo
    btnHtmlMode.classList.remove("active");
    editorCode.style.display = "none";
    editorVisual.style.display = "block";
    toggleToolbarButtons(false);
  }

  editorVisual.innerHTML = post.content;
  editorCode.value = post.content;

  // Actualizar interfaz
  document.getElementById("editor-title-label").innerHTML = `<i class="fa-solid fa-file-pen"></i> Editar Lectura: ${escapeHtml(post.title)}`;
  
  // Cambiar pestaña activa
  document.getElementById("menu-editor").click();
  document.getElementById("section-title").textContent = "Editar Contenido";
}

// Handler para eliminar
async function deletePostHandler(postId) {
  const post = allPostsCache.find(p => p.id === postId);
  if (!post) return;

  if (confirm(`¿Estás seguro de que deseas eliminar la lectura "${post.title}"?\nEsta acción no se puede deshacer.`)) {
    try {
      await DB.deletePost(postId);
      renderPostsTable();
    } catch (error) {
      alert("Error al eliminar la publicación. Intenta de nuevo.");
      console.error(error);
    }
  }
}

/* ==========================================================================
   Lógica del Editor WYSIWYG
   ========================================================================== */
function initWysiwygEditor() {
  const editorVisual = document.getElementById("editor-visual");
  const editorCode = document.getElementById("editor-code");
  const btnHtmlMode = document.getElementById("btn-html-mode");
  const toolbarButtons = document.querySelectorAll(".toolbar-btn");

  // Manejo de comandos del toolbar
  toolbarButtons.forEach(btn => {
    if (btn.id === "btn-html-mode") return;

    btn.addEventListener("click", () => {
      // Si el editor de código está activo, no aplicar estilos visuales
      if (btnHtmlMode.classList.contains("active")) return;

      const cmd = btn.getAttribute("data-cmd");
      const val = btn.getAttribute("data-val");

      if (cmd === "createLink") {
        const url = prompt("Introduce el enlace URL:", "https://");
        if (url && url !== "https://") {
          document.execCommand(cmd, false, url);
        }
      } else if (cmd === "insertImage") {
        const url = prompt("Introduce la URL de la imagen:", "https://");
        if (url) {
          document.execCommand(cmd, false, url);
        }
      } else {
        document.execCommand(cmd, false, val || null);
      }
      
      editorVisual.focus();
    });
  });

  // Alternar entre editor visual y código HTML (Core para incrustar HTML libre)
  btnHtmlMode.onclick = () => {
    const isCodeActive = btnHtmlMode.classList.toggle("active");

    if (isCodeActive) {
      // Pasar del visual al código fuente
      editorCode.value = editorVisual.innerHTML;
      editorVisual.style.display = "none";
      editorCode.style.display = "block";
      editorCode.focus();
      toggleToolbarButtons(true);
    } else {
      // Pasar del código fuente al visual
      editorVisual.innerHTML = editorCode.value;
      editorCode.style.display = "none";
      editorVisual.style.display = "block";
      editorVisual.focus();
      toggleToolbarButtons(false);
    }
  };
}

function toggleToolbarButtons(disable) {
  const toolbarButtons = document.querySelectorAll(".toolbar-btn");
  toolbarButtons.forEach(btn => {
    if (btn.id === "btn-html-mode") return;
    
    if (disable) {
      btn.style.opacity = "0.3";
      btn.style.pointerEvents = "none";
    } else {
      btn.style.opacity = "";
      btn.style.pointerEvents = "";
    }
  });
}

/* ==========================================================================
   Guardado de Datos (Formulario)
   ========================================================================== */
function initPostFormSubmit() {
  const form = document.getElementById("post-editor-form");
  const editorVisual = document.getElementById("editor-visual");
  const editorCode = document.getElementById("editor-code");
  const btnHtmlMode = document.getElementById("btn-html-mode");

  form.onsubmit = async (e) => {
    e.preventDefault();

    // Sincronizar contenido si se guardó estando en modo código HTML
    if (btnHtmlMode.classList.contains("active")) {
      editorVisual.innerHTML = editorCode.value;
    }

    const postId = document.getElementById("edit-post-id").value;
    const contentHtml = editorVisual.innerHTML;

    // Validación básica de contenido vacío
    if (!contentHtml || contentHtml.trim() === "" || contentHtml === "<p><br></p>" || contentHtml === "<p>Comienza a escribir tu lectura aquí...</p>") {
      alert("Por favor, ingresa contenido en el editor.");
      return;
    }

    const postData = {
      title: document.getElementById("post-title").value,
      category: document.getElementById("post-category").value,
      excerpt: document.getElementById("post-excerpt").value,
      readTime: document.getElementById("post-read-time").value,
      content: contentHtml
    };

    try {
      const saveBtn = form.querySelector("button[type='submit']");
      saveBtn.disabled = true;
      saveBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Guardando...`;

      if (postId) {
        // Modo Edición
        await DB.updatePost(postId, postData);
      } else {
        // Modo Creación
        await DB.createPost(postData);
      }

      // Regresar al Panel General
      resetEditorForm();
      document.getElementById("menu-dashboard").click();
    } catch (error) {
      alert("Hubo un error al intentar guardar la lectura.");
      console.error("Save error:", error);
    } finally {
      form.querySelector("button[type='submit']").disabled = false;
      form.querySelector("button[type='submit']").innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Guardar Publicación`;
    }
  };
}

function resetEditorForm() {
  document.getElementById("edit-post-id").value = "";
  document.getElementById("post-title").value = "";
  document.getElementById("post-excerpt").value = "";
  document.getElementById("post-read-time").value = "5 min";
  document.getElementById("post-category").selectedIndex = 0;
  
  const editorVisual = document.getElementById("editor-visual");
  const editorCode = document.getElementById("editor-code");
  const btnHtmlMode = document.getElementById("btn-html-mode");

  // Reset del modo HTML si estaba activo
  if (btnHtmlMode.classList.contains("active")) {
    btnHtmlMode.classList.remove("active");
    editorCode.style.display = "none";
    editorVisual.style.display = "block";
    toggleToolbarButtons(false);
  }

  editorVisual.innerHTML = "<p>Comienza a escribir tu lectura aquí...</p>";
  editorCode.value = "";
  document.getElementById("editor-title-label").innerHTML = `<i class="fa-solid fa-file-pen"></i> Escribir Nueva Lectura`;
}

/* ==========================================================================
   Gestión de Agenda: Reservas y Disponibilidad
   ========================================================================== */
// Switch interno entre pestañas de agenda
window.switchSettingsSubTab = function(subTab) {
  const tabBookingsBtn = document.getElementById("subtab-btn-bookings");
  const tabAvailabilityBtn = document.getElementById("subtab-btn-availability");
  const sectionBookings = document.getElementById("settings-sub-bookings");
  const sectionAvailability = document.getElementById("settings-sub-availability");

  if (subTab === "bookings") {
    tabBookingsBtn.classList.add("active");
    tabAvailabilityBtn.classList.remove("active");
    sectionBookings.style.display = "block";
    sectionAvailability.style.display = "none";
    renderBookingsTable();
  } else {
    tabBookingsBtn.classList.remove("active");
    tabAvailabilityBtn.classList.add("active");
    sectionBookings.style.display = "none";
    sectionAvailability.style.display = "block";
    loadAvailabilityForm();
  }
};

// Renderizar tabla de reservas
async function renderBookingsTable() {
  const tbody = document.getElementById("bookings-table-body");
  try {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted);">
          <i class="fa-solid fa-spinner fa-spin"></i> Cargando reservas...
        </td>
      </tr>
    `;

    const bookings = await DB.getBookings();

    if (bookings.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px 0;">
            No hay reservas registradas en este momento.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = "";
    bookings.forEach(booking => {
      const tr = document.createElement("tr");

      // Clases para badge de estado
      let badgeClass = "table-tag";
      let statusLabel = booking.status.toUpperCase();
      if (booking.status === "pendiente") {
        badgeClass += " tag-pending";
      } else if (booking.status === "confirmada") {
        badgeClass += " tag-confirmed";
      } else if (booking.status === "cancelada") {
        badgeClass += " tag-canceled";
      }

      // Estilos en línea directos para los badges de reserva
      const badgeStyle = booking.status === "pendiente" ? "background: rgba(245, 158, 11, 0.15); color: #f59e0b;" :
                          booking.status === "confirmada" ? "background: rgba(16, 185, 129, 0.15); color: #10b981;" :
                          "background: rgba(239, 68, 68, 0.15); color: #ef4444;";

      // Formatear fecha
      const dateFormatted = formatDate(booking.date);

      // Botones de acción según el estado
      let actionButtons = "";
      if (booking.status === "pendiente") {
        actionButtons = `
          <button class="btn-icon btn-confirm" data-id="${booking.id}" title="Confirmar Reserva" style="color: #10b981; background:none; border:none; cursor:pointer; font-size:15px;"><i class="fa-solid fa-circle-check"></i></button>
          <button class="btn-icon btn-cancel" data-id="${booking.id}" title="Cancelar Reserva" style="color: #ef4444; background:none; border:none; cursor:pointer; font-size:15px;"><i class="fa-solid fa-circle-xmark"></i></button>
        `;
      } else if (booking.status === "confirmada") {
        actionButtons = `
          <button class="btn-icon btn-cancel" data-id="${booking.id}" title="Cancelar Reserva" style="color: #ef4444; background:none; border:none; cursor:pointer; font-size:15px;"><i class="fa-solid fa-circle-xmark"></i></button>
        `;
      } else if (booking.status === "cancelada") {
        actionButtons = `
          <button class="btn-icon btn-confirm" data-id="${booking.id}" title="Confirmar/Reactivar Reserva" style="color: #10b981; background:none; border:none; cursor:pointer; font-size:15px;"><i class="fa-solid fa-circle-check"></i></button>
        `;
      }

      // Agregar botón de eliminar en cualquier estado
      actionButtons += `
        <button class="btn-icon btn-delete-booking" data-id="${booking.id}" title="Eliminar del Registro" style="color: var(--text-muted); background:none; border:none; cursor:pointer; font-size:15px; margin-left: 5px;"><i class="fa-solid fa-trash-can"></i></button>
      `;

      tr.innerHTML = `
        <td>
          <strong style="color: var(--text-primary); font-size:14.5px;">${escapeHtml(booking.name)}</strong>
          ${booking.university ? `<br><small style="color: var(--text-muted); font-size: 11.5px; font-weight: 500;"><i class="fa-solid fa-university"></i> ${escapeHtml(booking.university)}</small>` : ''}
        </td>
        <td><a href="mailto:${escapeHtml(booking.email)}" style="color: var(--accent); text-decoration: none; font-size:13px;">${escapeHtml(booking.email)}</a></td>
        <td><span style="font-size:13.5px; white-space: nowrap;">${dateFormatted}</span><br><span style="font-size: 12px; color: var(--text-muted); font-weight: 600;"><i class="fa-regular fa-clock"></i> ${booking.time}</span></td>
        <td><span class="table-tag">${escapeHtml(booking.subject)}</span></td>
        <td><div style="max-width: 180px; max-height: 50px; overflow-y: auto; font-size: 12.5px; color: var(--text-muted);" title="${escapeHtml(booking.message || '')}">${escapeHtml(booking.message || '-')}</div></td>
        <td><span class="${badgeClass}" style="${badgeStyle}">${statusLabel}</span></td>
        <td>
          <div class="action-btns" style="display:flex; gap: 4px;">
            ${actionButtons}
          </div>
        </td>
      `;

      // Handlers de eventos
      const confirmBtn = tr.querySelector(".btn-confirm");
      if (confirmBtn) {
        confirmBtn.onclick = () => updateBookingStatusHandler(booking.id, "confirmada");
      }

      const cancelBtn = tr.querySelector(".btn-cancel");
      if (cancelBtn) {
        cancelBtn.onclick = () => updateBookingStatusHandler(booking.id, "cancelada");
      }

      tr.querySelector(".btn-delete-booking").onclick = () => deleteBookingHandler(booking.id);

      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error("Error cargando reservas:", error);
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: #ef4444;">
          Error al cargar las reservas desde la base de datos.
        </td>
      </tr>
    `;
  }
}

// Cambiar estado de reserva
async function updateBookingStatusHandler(id, status) {
  try {
    await DB.updateBookingStatus(id, status);
    renderBookingsTable();
  } catch (error) {
    alert("Error al actualizar el estado de la reserva.");
    console.error(error);
  }
}

// Eliminar reserva
async function deleteBookingHandler(id) {
  if (confirm("¿Estás seguro de que deseas eliminar permanentemente esta reserva del registro?")) {
    try {
      await DB.deleteBooking(id);
      renderBookingsTable();
    } catch (error) {
      alert("Error al eliminar la reserva.");
      console.error(error);
    }
  }
}

// Cargar disponibilidad en el formulario
async function loadAvailabilityForm() {
  try {
    const availability = await DB.getAvailability();
    if (!availability || availability.length === 0) return;

    // Configurar duración global basándonos en el primer día
    document.getElementById("avail-slot-duration").value = availability[0].slotDuration || 60;

    // Configurar cada fila de día
    availability.forEach(day => {
      const row = document.querySelector(`.availability-days-grid tbody tr[data-day="${day.dayOfWeek}"]`);
      if (row) {
        row.querySelector(".day-active-check").checked = day.isActive;
        row.querySelector(".day-start-input").value = day.startTime;
        row.querySelector(".day-end-input").value = day.endTime;
        row.querySelector(".day-active-check-2").checked = day.isActive2 || false;
        row.querySelector(".day-start-input-2").value = day.startTime2 || "14:00";
        row.querySelector(".day-end-input-2").value = day.endTime2 || "18:00";
      }
    });
  } catch (error) {
    console.error("Error al cargar disponibilidad:", error);
  }
}

// Guardar disponibilidad semanal
function initAvailabilityFormSubmit() {
  const form = document.getElementById("availability-form");
  if (!form) return;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const saveBtn = form.querySelector("button[type='submit']");
    saveBtn.disabled = true;
    saveBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Guardando...`;

    try {
      const slotDuration = parseInt(document.getElementById("avail-slot-duration").value, 10);
      const rows = document.querySelectorAll(".availability-days-grid tbody tr");
      const availabilityList = [];

      rows.forEach(row => {
        const dayOfWeek = parseInt(row.getAttribute("data-day"), 10);
        const isActive = row.querySelector(".day-active-check").checked;
        const startTime = row.querySelector(".day-start-input").value;
        const endTime = row.querySelector(".day-end-input").value;
        const isActive2 = row.querySelector(".day-active-check-2").checked;
        const startTime2 = row.querySelector(".day-start-input-2").value;
        const endTime2 = row.querySelector(".day-end-input-2").value;

        availabilityList.push({
          dayOfWeek,
          isActive,
          startTime,
          endTime,
          isActive2,
          startTime2,
          endTime2,
          slotDuration
        });
      });

      await DB.updateAvailability(availabilityList);
      alert("¡Disponibilidad guardada exitosamente!");
      loadAvailabilityForm();
    } catch (error) {
      alert("Error al guardar la disponibilidad horaria.");
      console.error(error);
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Guardar Disponibilidad`;
    }
  };
}

// Simulación local del cron job de recordatorios
function initCronSimulationButton() {
  const btn = document.getElementById("btn-trigger-cron-simulation");
  if (!btn) return;

  btn.onclick = () => {
    const bookingsStr = localStorage.getItem("alvaro_profemate_bookings");
    if (!bookingsStr) {
      alert("No hay reservas guardadas localmente.");
      return;
    }

    const bookings = JSON.parse(bookingsStr);
    
    // Obtener fecha actual local Santiago (YYYY-MM-DD)
    const formatterDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit' });
    const todayStr = formatterDate.format(new Date());

    // Obtener hora actual local Santiago en minutos
    const formatterTime = new Intl.DateTimeFormat('es-CL', { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit', hour12: false });
    const timeStr = formatterTime.format(new Date());
    const [nowH, nowM] = timeStr.split(':').map(Number);
    const nowInMinutes = nowH * 60 + nowM;

    let sentCount = 0;
    const updatedBookings = bookings.map(b => {
      // Cruzamos si el agendamiento es hoy, confirmado y no tiene recordatorio enviado
      if (b.date === todayStr && b.status === "confirmada" && !b.reminderSent && !b.reminder_sent) {
        const [bH, bM] = b.time.split(':').map(Number);
        const bookingInMinutes = bH * 60 + bM;
        const diff = bookingInMinutes - nowInMinutes;
        
        // Si comienza en los próximos 15 minutos (y no más antiguo de -5 mins)
        if (diff >= -5 && diff <= 15) {
          sentCount++;
          console.log("%c[SIMULACIÓN CORREO - RECORDATORIO ALUMNO (10 MIN)]", "background: #f59e0b; color: black; padding: 3px 6px; border-radius: 3px; font-weight: bold;");
          console.log(`Para: ${b.email}\nAsunto: Recordatorio: Tu consulta comienza en 10 minutos 🚀\nDetalles: Estudiante: ${b.name}, Asignatura: ${b.subject}, Hora: ${b.time} hrs`);
          
          console.log("%c[SIMULACIÓN CORREO - RECORDATORIO PROFESOR (10 MIN)]", "background: #ef4444; color: white; padding: 3px 6px; border-radius: 3px; font-weight: bold;");
          console.log(`Para: contacto@alvaroprofemate.cl\nAsunto: Recordatorio: Consulta con ${b.name} en 10 minutos 🚀\nDetalles: Estudiante: ${b.name}, Asignatura: ${b.subject}, Hora: ${b.time} hrs`);
          
          return { ...b, reminderSent: true, reminder_sent: true };
        }
      }
      return b;
    });

    if (sentCount > 0) {
      localStorage.setItem("alvaro_profemate_bookings", JSON.stringify(updatedBookings));
      alert(`¡Simulación exitosa! Se enviaron ${sentCount} recordatorios.\n\nRevisa la consola del navegador (F12) para ver el contenido simulado del correo.`);
      renderBookingsTable();
    } else {
      alert(`No se encontraron consultas para el día de hoy (${todayStr}) que comiencen en los próximos 15 minutos, estén confirmadas y no hayan recibido recordatorio anteriormente.`);
    }
  };
}

/* ==========================================================================
   Funciones Auxiliares
   ========================================================================== */
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const date = new Date(dateStr + 'T00:00:00'); // Evitar desajustes horarios
  return date.toLocaleDateString('es-ES', options);
}

// Rellenar dinámicamente los selectores de tiempo en formato de 24 horas (desde las 07:00 a las 22:00 en pasos de 30 mins)
function populateTimeDropdowns() {
  const dropdowns = document.querySelectorAll(".day-start-input, .day-end-input, .day-start-input-2, .day-end-input-2");
  dropdowns.forEach(select => {
    select.innerHTML = "";
    for (let h = 7; h <= 22; h++) {
      const hourStr = String(h).padStart(2, '0');
      
      // Opción :00
      const opt1 = document.createElement("option");
      opt1.value = `${hourStr}:00`;
      opt1.textContent = `${hourStr}:00`;
      select.appendChild(opt1);
      
      // Opción :30
      if (h < 22) {
        const opt2 = document.createElement("option");
        opt2.value = `${hourStr}:30`;
        opt2.textContent = `${hourStr}:30`;
        select.appendChild(opt2);
      }
    }
  });
}

/* ==========================================================================
   Gestión de Cursos y Contenido RAM
   ========================================================================== */
function showCustomConfirm(title, message, yesLabel = "Sí", noLabel = "No") {
  return new Promise((resolve) => {
    const modalContainer = document.createElement("div");
    modalContainer.className = "custom-modal-overlay";
    modalContainer.innerHTML = `
      <div class="custom-modal-box">
        <div class="custom-modal-header"><i class="fa-solid fa-circle-question" style="color: #06b6d4; margin-right: 6px;"></i> ${title}</div>
        <div class="custom-modal-body" style="white-space: pre-line;">${message}</div>
        <div class="custom-modal-actions">
          <button class="btn btn-secondary btn-no" style="font-size:12.5px; padding: 6px 12px;">${noLabel}</button>
          <button class="btn btn-primary btn-yes" style="font-size:12.5px; padding: 6px 12px; background: #06b6d4; border-color: #06b6d4;">${yesLabel}</button>
        </div>
      </div>
    `;
    document.body.appendChild(modalContainer);

    setTimeout(() => modalContainer.classList.add("modal-active"), 10);

    const close = (result) => {
      modalContainer.classList.remove("modal-active");
      setTimeout(() => {
        if (modalContainer.parentNode) {
          document.body.removeChild(modalContainer);
        }
        resolve(result);
      }, 200);
    };

    modalContainer.querySelector(".btn-yes").onclick = () => close(true);
    modalContainer.querySelector(".btn-no").onclick = () => close(false);
  });
}

function showCustomPrompt(title, message, defaultValue = "") {
  return new Promise((resolve) => {
    const modalContainer = document.createElement("div");
    modalContainer.className = "custom-modal-overlay";
    modalContainer.innerHTML = `
      <div class="custom-modal-box">
        <div class="custom-modal-header"><i class="fa-solid fa-pen-to-square" style="color: #06b6d4; margin-right: 6px;"></i> ${title}</div>
        <div class="custom-modal-body">
          <p style="margin-bottom: 12px; font-size: 13px; line-height: 1.5; white-space: pre-line;">${message}</p>
          <input type="text" class="form-control prompt-input" value="${defaultValue}" style="width: 100%; box-sizing: border-box; padding: 8px; font-size:13px; background: #0f172a; color: #f8fafc; border: 1px solid #334155; border-radius: 6px;">
        </div>
        <div class="custom-modal-actions">
          <button class="btn btn-secondary btn-cancel" style="font-size:12.5px; padding: 6px 12px;">Cancelar</button>
          <button class="btn btn-primary btn-ok" style="font-size:12.5px; padding: 6px 12px; background: #06b6d4; border-color: #06b6d4;">Aceptar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modalContainer);

    const input = modalContainer.querySelector(".prompt-input");
    input.focus();
    input.select();

    input.onkeydown = (e) => {
      if (e.key === "Enter") {
        close(input.value);
      } else if (e.key === "Escape") {
        close(null);
      }
    };

    setTimeout(() => modalContainer.classList.add("modal-active"), 10);

    const close = (result) => {
      modalContainer.classList.remove("modal-active");
      setTimeout(() => {
        if (modalContainer.parentNode) {
          document.body.removeChild(modalContainer);
        }
        resolve(result);
      }, 200);
    };

    modalContainer.querySelector(".btn-ok").onclick = () => close(input.value);
    modalContainer.querySelector(".btn-cancel").onclick = () => close(null);
  });
}

function showExerciseModal(exerciseData = null) {
  return new Promise((resolve) => {
    const isEdit = !!exerciseData;
    const title = isEdit ? "Editar Ejercicio" : "Nuevo Ejercicio";
    const data = exerciseData || { title: "", level: "resuelto", statement: "", solution: "" };

    const modalContainer = document.createElement("div");
    modalContainer.className = "custom-modal-overlay";
    modalContainer.innerHTML = `
      <div class="custom-modal-box" style="max-width: 550px;">
        <div class="custom-modal-header"><i class="fa-solid fa-circle-question" style="color: #06b6d4; margin-right: 6px;"></i> ${title}</div>
        <div class="custom-modal-body" style="display: flex; flex-direction: column; gap: 12px; text-align: left;">
          <div>
            <label class="form-label" style="font-weight: 600; font-size:12px; margin-bottom: 4px; display:block;">Título del Ejercicio:</label>
            <input type="text" id="modal-ex-title" class="form-control" value="${escapeHtml(data.title)}" placeholder="Ej: Curvas de nivel elípticas" style="width: 100%; box-sizing: border-box; padding: 8px; font-size:13px; background: #0f172a; color: #f8fafc; border: 1px solid #334155; border-radius: 6px;">
          </div>
          <div>
            <label class="form-label" style="font-weight: 600; font-size:12px; margin-bottom: 4px; display:block;">Nivel de Dificultad:</label>
            <select id="modal-ex-level" class="form-control" style="width: 100%; box-sizing: border-box; padding: 8px; font-size:13px; background: #0f172a; color: #f8fafc; border: 1px solid #334155; border-radius: 6px;">
              <option value="resuelto" ${data.level === 'resuelto' ? 'selected' : ''}>Ejercicio Resuelto</option>
              <option value="nivel-1" ${data.level === 'nivel-1' ? 'selected' : ''}>Nivel 1: Mecánico</option>
              <option value="nivel-2" ${data.level === 'nivel-2' ? 'selected' : ''}>Nivel 2: Analítico</option>
              <option value="nivel-3" ${data.level === 'nivel-3' ? 'selected' : ''}>Nivel 3: Ingeniería</option>
            </select>
          </div>
          <div>
            <label class="form-label" style="font-weight: 600; font-size:12px; margin-bottom: 4px; display:block;">Enunciado del Ejercicio (admite LaTeX $...$):</label>
            <textarea id="modal-ex-statement" class="form-control" style="width: 100%; min-height: 90px; box-sizing: border-box; padding: 8px; font-size:13px; background: #0f172a; color: #f8fafc; border: 1px solid #334155; border-radius: 6px; font-family:var(--font-body); resize:vertical;">${escapeHtml(data.statement)}</textarea>
          </div>
          <div>
            <label class="form-label" style="font-weight: 600; font-size:12px; margin-bottom: 4px; display:block;">Indicación / Pauta de Resolución (admite HTML y LaTeX):</label>
            <textarea id="modal-ex-solution" class="form-control" style="width: 100%; min-height: 120px; box-sizing: border-box; padding: 8px; font-size:13px; background: #0f172a; color: #f8fafc; border: 1px solid #334155; border-radius: 6px; font-family:var(--font-body); resize:vertical;">${escapeHtml(data.solution)}</textarea>
          </div>
        </div>
        <div class="custom-modal-actions" style="margin-top: 20px;">
          <button class="btn btn-secondary btn-cancel" style="font-size:12.5px; padding: 6px 12px;">Cancelar</button>
          <button class="btn btn-primary btn-save" style="font-size:12.5px; padding: 6px 12px; background: #06b6d4; border-color: #06b6d4;">Aceptar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modalContainer);

    setTimeout(() => modalContainer.classList.add("modal-active"), 10);

    const close = (result) => {
      modalContainer.classList.remove("modal-active");
      setTimeout(() => {
        if (modalContainer.parentNode) {
          document.body.removeChild(modalContainer);
        }
        resolve(result);
      }, 200);
    };

    modalContainer.querySelector(".btn-save").onclick = () => {
      const valTitle = modalContainer.querySelector("#modal-ex-title").value.trim();
      const valLevel = modalContainer.querySelector("#modal-ex-level").value;
      const valStatement = modalContainer.querySelector("#modal-ex-statement").value.trim();
      const valSolution = modalContainer.querySelector("#modal-ex-solution").value.trim();

      if (!valTitle || !valStatement) {
        alert("El título y el enunciado son obligatorios.");
        return;
      }

      close({
        title: valTitle,
        level: valLevel,
        statement: valStatement,
        solution: valSolution
      });
    };
    modalContainer.querySelector(".btn-cancel").onclick = () => close(null);
  });
}

function showFormulaModal(formulaData = null) {
  return new Promise((resolve) => {
    const isEdit = !!formulaData;
    const title = isEdit ? "Editar Fórmula" : "Nueva Fórmula";
    const data = formulaData || { title: "", latex: "", description: "" };

    const modalContainer = document.createElement("div");
    modalContainer.className = "custom-modal-overlay";
    modalContainer.innerHTML = `
      <div class="custom-modal-box" style="max-width: 500px;">
        <div class="custom-modal-header"><i class="fa-solid fa-calculator" style="color: #06b6d4; margin-right: 6px;"></i> ${title}</div>
        <div class="custom-modal-body" style="display: flex; flex-direction: column; gap: 12px; text-align: left;">
          <div>
            <label class="form-label" style="font-weight: 600; font-size:12px; margin-bottom: 4px; display:block;">Título de la Fórmula:</label>
            <input type="text" id="modal-form-title" class="form-control" value="${escapeHtml(data.title)}" placeholder="Ej: Ecuación de la Elipse" style="width: 100%; box-sizing: border-box; padding: 8px; font-size:13px; background: #0f172a; color: #f8fafc; border: 1px solid #334155; border-radius: 6px;">
          </div>
          <div>
            <label class="form-label" style="font-weight: 600; font-size:12px; margin-bottom: 4px; display:block;">Expresión LaTeX (sin los delimitadores \\( y \\)):</label>
            <input type="text" id="modal-form-latex" class="form-control" value="${escapeHtml(data.latex)}" placeholder="Ej: \\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1" style="width: 100%; box-sizing: border-box; padding: 8px; font-size:13px; font-family: monospace; background: #0f172a; color: #38bdf8; border: 1px solid #334155; border-radius: 6px;">
          </div>
          <div>
            <label class="form-label" style="font-weight: 600; font-size:12px; margin-bottom: 4px; display:block;">Descripción / Contexto (admite LaTeX $...$):</label>
            <textarea id="modal-form-desc" class="form-control" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 8px; font-size:13px; background: #0f172a; color: #f8fafc; border: 1px solid #334155; border-radius: 6px; font-family:var(--font-body); resize:vertical;">${escapeHtml(data.description)}</textarea>
          </div>
        </div>
        <div class="custom-modal-actions" style="margin-top: 20px;">
          <button class="btn btn-secondary btn-cancel" style="font-size:12.5px; padding: 6px 12px;">Cancelar</button>
          <button class="btn btn-primary btn-save" style="font-size:12.5px; padding: 6px 12px; background: #06b6d4; border-color: #06b6d4;">Aceptar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modalContainer);

    setTimeout(() => modalContainer.classList.add("modal-active"), 10);

    const close = (result) => {
      modalContainer.classList.remove("modal-active");
      setTimeout(() => {
        if (modalContainer.parentNode) {
          document.body.removeChild(modalContainer);
        }
        resolve(result);
      }, 200);
    };

    modalContainer.querySelector(".btn-save").onclick = () => {
      const valTitle = modalContainer.querySelector("#modal-form-title").value.trim();
      const valLatex = modalContainer.querySelector("#modal-form-latex").value.trim();
      const valDesc = modalContainer.querySelector("#modal-form-desc").value.trim();

      if (!valTitle || !valLatex) {
        alert("El título y la expresión LaTeX son obligatorios.");
        return;
      }

      close({
        title: valTitle,
        latex: valLatex,
        description: valDesc
      });
    };
    modalContainer.querySelector(".btn-cancel").onclick = () => close(null);
  });
}

function renderStructuredManager(tabName) {
  const visual = document.querySelector(".wysiwyg-container");
  const structured = document.getElementById("course-structured-container");
  if (!visual || !structured) return;

  if (tabName === "exercises" || tabName === "formulas") {
    visual.style.display = "none";
    structured.style.display = "block";

    const titleEl = document.getElementById("structured-title");
    const addEl = document.getElementById("btn-structured-add-label");
    if (tabName === "exercises") {
      titleEl.innerHTML = `<i class="fa-solid fa-list-check" style="color: var(--accent);"></i> Gestor de Ejercicios`;
      addEl.textContent = "Añadir Ejercicio";
    } else {
      titleEl.innerHTML = `<i class="fa-solid fa-calculator" style="color: var(--accent);"></i> Gestor de Fórmulas de Apoyo`;
      addEl.textContent = "Añadir Fórmula";
    }

    renderStructuredItems(tabName);
  } else {
    visual.style.display = "block";
    structured.style.display = "none";
  }
}

function getStructuredItems(tabName) {
  let raw = "";
  if (tabName === "exercises") raw = activeChapterData.contentExercises || "";
  else raw = activeChapterData.contentFormulas || "";

  try {
    if (raw.trim().startsWith("[")) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("No se pudo parsear como JSON, convirtiendo...", e);
  }
  return [];
}

function renderStructuredItems(tabName) {
  const container = document.getElementById("structured-items-list");
  if (!container) return;
  container.innerHTML = "";

  const items = getStructuredItems(tabName);

  if (items.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 40px 0; font-size: 13px;">No hay ${tabName === 'exercises' ? 'ejercicios' : 'fórmulas'} guardadas. Pulsa en el botón superior para añadir.</p>`;
    return;
  }

  items.forEach((item, index) => {
    const card = document.createElement("div");
    card.style.display = "flex";
    card.style.alignItems = "center";
    card.style.justifyContent = "space-between";
    card.style.padding = "12px 16px";
    card.style.background = "rgba(255, 255, 255, 0.02)";
    card.style.border = "1px solid var(--border)";
    card.style.borderRadius = "8px";
    card.style.gap = "15px";

    let previewHtml = "";
    if (tabName === "exercises") {
      let levelLabel = "Resuelto";
      if (item.level === "nivel-1") levelLabel = "Nivel 1";
      else if (item.level === "nivel-2") levelLabel = "Nivel 2";
      else if (item.level === "nivel-3") levelLabel = "Nivel 3";
      previewHtml = `
        <div>
          <div style="display:flex; align-items:center; gap: 8px;">
            <span style="font-weight:600; font-size:13.5px; color:var(--text-primary);">${index + 1}. ${escapeHtml(item.title)}</span>
            <span class="badge-nivel ${item.level}" style="font-size:9px; padding:2px 6px;">${levelLabel}</span>
          </div>
          <p style="font-size:12px; color:var(--text-muted); margin: 4px 0 0 0; max-width: 380px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(item.statement)}</p>
        </div>
      `;
    } else {
      previewHtml = `
        <div>
          <span style="font-weight:600; font-size:13.5px; color:var(--text-primary);">${escapeHtml(item.title)}</span>
          <div style="font-family: monospace; font-size: 12px; color: #38bdf8; margin-top:2px;">${escapeHtml(item.latex)}</div>
        </div>
      `;
    }

    card.innerHTML = `
      <div style="flex: 1;">
        ${previewHtml}
      </div>
      <div style="display:flex; gap: 6px; flex-shrink: 0;">
        <button type="button" class="btn-icon btn-move-up" title="Mover Arriba" style="padding: 4px 8px; font-size:11px; background:none; border:none; color:var(--text-muted); cursor:pointer;"><i class="fa-solid fa-arrow-up"></i></button>
        <button type="button" class="btn-icon btn-move-down" title="Mover Abajo" style="padding: 4px 8px; font-size:11px; background:none; border:none; color:var(--text-muted); cursor:pointer;"><i class="fa-solid fa-arrow-down"></i></button>
        <button type="button" class="btn-icon btn-edit-item" style="padding: 4px 8px; font-size:11px; background:none; border:none; color:var(--accent); cursor:pointer;"><i class="fa-solid fa-pencil"></i></button>
        <button type="button" class="btn-icon btn-delete-item" style="padding: 4px 8px; font-size:11px; background:none; border:none; color:#ef4444; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    if (index === 0) card.querySelector(".btn-move-up").style.opacity = "0.3";
    if (index === items.length - 1) card.querySelector(".btn-move-down").style.opacity = "0.3";

    card.querySelector(".btn-move-up").onclick = () => {
      if (index === 0) return;
      swapItems(tabName, index, index - 1);
    };
    card.querySelector(".btn-move-down").onclick = () => {
      if (index === items.length - 1) return;
      swapItems(tabName, index, index + 1);
    };
    card.querySelector(".btn-edit-item").onclick = async () => {
      if (tabName === "exercises") {
        const res = await showExerciseModal(item);
        if (res) {
          updateItem(tabName, index, res);
        }
      } else {
        const res = await showFormulaModal(item);
        if (res) {
          updateItem(tabName, index, res);
        }
      }
    };
    card.querySelector(".btn-delete-item").onclick = async () => {
      const confirmDelete = await showCustomConfirm(
        tabName === "exercises" ? "Eliminar Ejercicio" : "Eliminar Fórmula",
        `¿Estás seguro de que deseas eliminar este elemento?`,
        "Eliminar",
        "Cancelar"
      );
      if (confirmDelete) {
        deleteItem(tabName, index);
      }
    };

    container.appendChild(card);
  });
}

function swapItems(tabName, idx1, idx2) {
  const items = getStructuredItems(tabName);
  const temp = items[idx1];
  items[idx1] = items[idx2];
  items[idx2] = temp;
  saveStructuredItems(tabName, items);
  renderStructuredItems(tabName);
}

function updateItem(tabName, index, updatedItem) {
  const items = getStructuredItems(tabName);
  items[index] = updatedItem;
  saveStructuredItems(tabName, items);
  renderStructuredItems(tabName);
}

function deleteItem(tabName, index) {
  const items = getStructuredItems(tabName);
  items.splice(index, 1);
  saveStructuredItems(tabName, items);
  renderStructuredItems(tabName);
}

function saveStructuredItems(tabName, items) {
  const val = JSON.stringify(items);
  if (tabName === "exercises") {
    activeChapterData.contentExercises = val;
  } else {
    activeChapterData.contentFormulas = val;
  }
}

let activeChapterData = null;
let activeEditorTab = "motivation"; // Pestaña por defecto

function initCoursesManager() {
  const editorTabButtons = document.querySelectorAll(".editor-tab-btn");
  
  // Alternar pestañas en el editor de capítulos
  editorTabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const nextTab = btn.getAttribute("data-tab");
      if (nextTab === activeEditorTab) return;
      
      saveCurrentEditorTabContentToMemory();
      editorTabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      // Mostrar u ocultar el editor estructurado
      renderStructuredManager(nextTab);
      
      loadContentToEditorForTab(nextTab);
    });
  });

  // Botón: Añadir Unidad
  const btnAddUnit = document.getElementById("btn-add-unit");
  if (btnAddUnit) {
    btnAddUnit.onclick = async () => {
      const courseId = document.getElementById("course-selector").value;
      const title = await showCustomPrompt("Nueva Unidad", "Título de la nueva unidad:");
      if (!title) return;
      const indexStr = await showCustomPrompt("Nueva Unidad", "Número o índice de la unidad (ej: 1 o 2):");
      if (!indexStr) return;
      
      const newUnit = {
        courseId: courseId,
        unitIndex: parseInt(indexStr, 10) || 1,
        title: title,
        isLocked: false
      };

      const res = await DB.saveUnit(newUnit);
      if (res.success) {
        alert("¡Unidad creada!");
        renderCourseTree(courseId);
      }
    };
  }

  // Botón: Añadir Capítulo
  const btnAddChapter = document.getElementById("btn-add-chapter");
  if (btnAddChapter) {
    btnAddChapter.onclick = async () => {
      const courseId = document.getElementById("course-selector").value;
      const struct = await DB.getCourseStructure(courseId);
      if (!struct.units || struct.units.length === 0) {
        alert("Debes crear al menos una unidad primero.");
        return;
      }

      let promptText = "Selecciona el número de la unidad a la que deseas añadir el capítulo:\n";
      struct.units.forEach((u, i) => {
        promptText += `${i + 1}. Unidad ${u.unitIndex}: ${u.title}\n`;
      });
      
      const choice = await showCustomPrompt("Añadir Capítulo", promptText);
      if (!choice) return;
      
      const idx = parseInt(choice, 10) - 1;
      if (isNaN(idx) || idx < 0 || idx >= struct.units.length) {
        alert("Opción no válida.");
        return;
      }

      const targetUnit = struct.units[idx];
      const chapterIndex = await showCustomPrompt("Añadir Capítulo", "Índice del capítulo (ej: 1.2 o 2.1):");
      if (!chapterIndex) return;
      const title = await showCustomPrompt("Añadir Capítulo", "Título del capítulo:");
      if (!title) return;

      const newChapter = {
        unitId: targetUnit.id,
        chapterIndex: chapterIndex,
        title: title,
        isCompleted: false,
        isLocked: false,
        contentMotivation: "",
        contentTheory: "",
        contentApplication: "",
        contentExercises: "",
        contentFormulas: ""
      };

      const res = await DB.saveChapter(newChapter);
      if (res.success) {
        alert("¡Capítulo creado!");
        renderCourseTree(courseId);
      }
    };
  }

  // Botón: Guardar Capítulo
  const btnSaveChapter = document.getElementById("btn-save-chapter");
  if (btnSaveChapter) {
    btnSaveChapter.onclick = async () => {
      if (!activeChapterData) return;

      saveCurrentEditorTabContentToMemory();

      activeChapterData.title = document.getElementById("editor-chapter-title").value;
      activeChapterData.chapterIndex = document.getElementById("editor-chapter-index").value;
      activeChapterData.isCompleted = document.getElementById("editor-chapter-completed").checked;
      activeChapterData.isLocked = document.getElementById("editor-chapter-locked").checked;

      if (!activeChapterData.title || !activeChapterData.chapterIndex) {
        alert("Por favor completa el título y el índice del capítulo.");
        return;
      }

      const res = await DB.saveChapter(activeChapterData);
      if (res.success) {
        alert("¡Capítulo guardado exitosamente!");
        renderCourseTree(document.getElementById("course-selector").value);
      }
    };
  }

  // Botón: Descartar cambios
  const btnDiscardChapter = document.getElementById("btn-discard-chapter");
  if (btnDiscardChapter) {
    btnDiscardChapter.onclick = async () => {
      const confirmDiscard = await showCustomConfirm("Descartar Cambios", "¿Estás seguro de que deseas descartar los cambios sin guardar?", "Sí, descartar", "No, cancelar");
      if (confirmDiscard) {
        const courseId = document.getElementById("course-selector").value;
        const index = document.getElementById("editor-chapter-index").value;
        loadChapterIntoEditor(courseId, index);
      }
    };
  }

  // Botón: Eliminar Capítulo
  const btnDeleteChapter = document.getElementById("btn-delete-chapter");
  if (btnDeleteChapter) {
    btnDeleteChapter.onclick = async () => {
      if (!activeChapterData || !activeChapterData.id) return;
      const confirmDelete = await showCustomConfirm("Eliminar Capítulo", "¿Estás seguro de que deseas eliminar este capítulo? Esta acción no se puede deshacer.", "Sí, eliminar", "No, cancelar");
      if (confirmDelete) {
        const res = await DB.deleteChapter(activeChapterData.id);
        if (res.success) {
          alert("Capítulo eliminado.");
          const courseId = document.getElementById("course-selector").value;
          renderCourseTree(courseId);
          document.getElementById("chapter-editor-workspace").style.display = "none";
          document.getElementById("chapter-editor-welcome").style.display = "flex";
        }
      }
    };
  }

  // --- BOTONES: IMPORTAR Y CARGAR CAPÍTULO .TEX ---
  const btnImportTex = document.getElementById("btn-import-tex-chapter");
  const btnUploadTex = document.getElementById("btn-upload-tex-chapter");
  const inputTexFile = document.getElementById("input-tex-file-upload");

  if (btnImportTex && inputTexFile) {
    btnImportTex.onclick = () => inputTexFile.click();
  }
  if (btnUploadTex && inputTexFile) {
    btnUploadTex.onclick = () => inputTexFile.click();
  }

  if (inputTexFile) {
    inputTexFile.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (evt) => {
        const latexText = evt.target.result;
        try {
          const parsed = parseLatexChapter(latexText);

          if (!parsed.metadata.chapterTitle && !parsed.metadata.chapterIndex) {
            alert("No se pudieron detectar metadatos de capítulo válidos en el archivo .TEX.");
            return;
          }

          if (parsed.metadata.courseId) {
            const courseSel = document.getElementById("course-selector");
            if (courseSel && Array.from(courseSel.options).some(opt => opt.value === parsed.metadata.courseId)) {
              courseSel.value = parsed.metadata.courseId;
            }
          }

          if (!activeChapterData) {
            activeChapterData = {
              courseId: parsed.metadata.courseId || document.getElementById("course-selector").value,
              chapterIndex: parsed.metadata.chapterIndex,
              title: parsed.metadata.chapterTitle,
              isCompleted: parsed.metadata.isCompleted,
              isLocked: parsed.metadata.isLocked,
              contentMotivation: '',
              contentTheory: '',
              contentApplication: '',
              contentExercises: '[]',
              contentFormulas: '[]'
            };
          }

          if (parsed.metadata.chapterTitle) activeChapterData.title = parsed.metadata.chapterTitle;
          if (parsed.metadata.chapterIndex) activeChapterData.chapterIndex = parsed.metadata.chapterIndex;
          activeChapterData.isCompleted = parsed.metadata.isCompleted;
          activeChapterData.isLocked = parsed.metadata.isLocked;

          activeChapterData.contentMotivation = parsed.contentMotivation;
          activeChapterData.contentTheory = parsed.contentTheory;
          activeChapterData.contentApplication = parsed.contentApplication;
          activeChapterData.contentExercises = parsed.contentExercises;
          activeChapterData.contentFormulas = parsed.contentFormulas;

          document.getElementById("editor-chapter-title").value = activeChapterData.title || "";
          document.getElementById("editor-chapter-index").value = activeChapterData.chapterIndex || "";
          document.getElementById("editor-chapter-completed").checked = activeChapterData.isCompleted || false;
          document.getElementById("editor-chapter-locked").checked = activeChapterData.isLocked || false;

          document.getElementById("workspace-chapter-title").textContent = `Editar Capítulo ${activeChapterData.chapterIndex}`;
          document.getElementById("workspace-unit-title").textContent = parsed.metadata.unitTitle || activeChapterData.title;

          document.getElementById("chapter-editor-workspace").style.display = "block";
          const welcome = document.getElementById("chapter-editor-welcome");
          if (welcome) welcome.style.display = "none";

          loadContentToEditorForTab(activeEditorTab);
          renderStructuredManager(activeEditorTab);

          alert(`¡Capítulo "${activeChapterData.title}" importado exitosamente desde LaTeX!\n\nRevisa las pestañas y presiona "Guardar Capítulo" cuando estés listo para guardarlo en la base de datos.`);
        } catch (err) {
          console.error("Error al procesar el archivo .TEX:", err);
          alert("Ocurrió un error al procesar el archivo .TEX. Por favor verifica el formato.");
        }
        inputTexFile.value = "";
      };
      reader.readAsText(file);
    };
  }

  // Botón: Añadir estructurado (Ejercicios o Fórmulas)
  const btnStructuredAdd = document.getElementById("btn-structured-add");
  if (btnStructuredAdd) {
    btnStructuredAdd.onclick = async () => {
      if (activeEditorTab === "exercises") {
        const res = await showExerciseModal();
        if (res) {
          const items = getStructuredItems("exercises");
          items.push(res);
          saveStructuredItems("exercises", items);
          renderStructuredItems("exercises");
        }
      } else if (activeEditorTab === "formulas") {
        const res = await showFormulaModal();
        if (res) {
          const items = getStructuredItems("formulas");
          items.push(res);
          saveStructuredItems("formulas", items);
          renderStructuredItems("formulas");
        }
      }
    };
  }

  initCourseWysiwygEditor();
}

async function loadCoursesManager() {
  const courseSelector = document.getElementById("course-selector");
  if (!courseSelector) return;

  const welcome = document.getElementById("chapter-editor-welcome");
  const workspace = document.getElementById("chapter-editor-workspace");
  if (welcome) welcome.style.display = "flex";
  if (workspace) workspace.style.display = "none";

  const courses = await DB.getCourses();
  courseSelector.innerHTML = "";
  courses.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.title;
    courseSelector.appendChild(opt);
  });

  courseSelector.onchange = () => {
    renderCourseTree(courseSelector.value);
    if (welcome) welcome.style.display = "flex";
    if (workspace) workspace.style.display = "none";
  };

  if (courses.length > 0) {
    courseSelector.value = courses[0].id;
    renderCourseTree(courses[0].id);
  }
}

async function renderCourseTree(courseId) {
  const treeContainer = document.getElementById("course-tree-container");
  if (!treeContainer) return;

  treeContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); margin-top:30px;"><i class="fa-solid fa-spinner fa-spin"></i> Cargando árbol...</p>';

  const data = await DB.getCourseStructure(courseId);
  if (data.error) {
    treeContainer.innerHTML = `<p style="text-align: center; color: #ef4444; margin-top:30px;">${data.error}</p>`;
    return;
  }

  treeContainer.innerHTML = "";
  const treeList = document.createElement("ul");
  treeList.className = "tree-list";

  data.units.forEach(unit => {
    const unitLi = document.createElement("li");
    unitLi.className = "tree-node";
    
    unitLi.innerHTML = `
      <div class="tree-node-title" data-unit-id="${unit.id}">
        <span>
          <i class="fa-solid fa-folder-open" style="color: var(--accent); margin-right: 6px;"></i>
          Unidad ${unit.unitIndex}: <strong>${escapeHtml(unit.title)}</strong>
          ${unit.isLocked ? ' <i class="fa-solid fa-lock" style="font-size: 11px; color: var(--text-muted);"></i>' : ''}
        </span>
        <div style="display:flex; gap: 6px;">
          <button class="btn-icon btn-edit-unit" title="Editar Unidad" style="background:none; border:none; color:var(--text-muted); cursor:pointer;"><i class="fa-solid fa-pencil" style="font-size:11px;"></i></button>
          <button class="btn-icon btn-delete-unit" title="Eliminar Unidad" style="background:none; border:none; color:#ef4444; cursor:pointer;"><i class="fa-solid fa-trash" style="font-size:11px;"></i></button>
        </div>
      </div>
    `;

    const chapList = document.createElement("ul");
    chapList.className = "tree-chapter-list";

    unit.chapters.forEach(ch => {
      const chLi = document.createElement("li");
      chLi.className = "tree-chapter-item";
      chLi.setAttribute("data-chapter-index", ch.chapterIndex);
      chLi.setAttribute("data-chapter-id", ch.id);

      chLi.innerHTML = `
        <span class="chapter-node-click" style="flex:1;">
          <i class="fa-regular fa-file-lines" style="margin-right: 6px; color: #10b981;"></i>
          Cap ${ch.chapterIndex}: ${escapeHtml(ch.title)}
          ${ch.isCompleted ? ' <span style="color:#10b981; font-weight:bold; font-size:11px;">(Completado)</span>' : ''}
          ${ch.isLocked ? ' <i class="fa-solid fa-lock" style="font-size: 10px; color: var(--text-muted);"></i>' : ''}
        </span>
        <i class="fa-solid fa-angle-right" style="font-size: 10px; color: var(--text-muted);"></i>
      `;

      chLi.querySelector(".chapter-node-click").onclick = (e) => {
        e.stopPropagation();
        document.querySelectorAll(".tree-chapter-item").forEach(item => item.classList.remove("active-chapter"));
        chLi.classList.add("active-chapter");
        loadChapterIntoEditor(courseId, ch.chapterIndex);
      };

      chapList.appendChild(chLi);
    });

    unitLi.appendChild(chapList);

    unitLi.querySelector(".btn-edit-unit").onclick = (e) => {
      e.stopPropagation();
      editUnitHandler(unit, courseId);
    };

    unitLi.querySelector(".btn-delete-unit").onclick = (e) => {
      e.stopPropagation();
      deleteUnitHandler(unit.id, courseId);
    };

    treeList.appendChild(unitLi);
  });

  treeContainer.appendChild(treeList);
}

async function editUnitHandler(unit, courseId) {
  const newTitle = await showCustomPrompt("Editar Unidad", "Título de la Unidad:", unit.title);
  if (newTitle === null) return;
  const newIndexStr = await showCustomPrompt("Editar Unidad", "Índice o número de la Unidad:", unit.unitIndex);
  if (newIndexStr === null) return;
  const isLocked = await showCustomConfirm("Bloquear Unidad", "¿Deseas bloquear esta unidad?", "Sí", "No");
  
  const updated = {
    id: unit.id,
    courseId: courseId || unit.courseId || unit.course_id,
    unitIndex: parseInt(newIndexStr, 10) || unit.unitIndex,
    title: newTitle,
    isLocked: isLocked
  };

  const res = await DB.saveUnit(updated);
  if (res.success) {
    alert("¡Unidad guardada!");
    renderCourseTree(document.getElementById("course-selector").value);
  }
}

async function deleteUnitHandler(id, courseId) {
  const confirmDelete = await showCustomConfirm("Eliminar Unidad", "¿Estás seguro de que deseas eliminar esta unidad? Esto eliminará todos los capítulos que contiene.", "Sí, eliminar", "No, cancelar");
  if (confirmDelete) {
    const res = await DB.deleteUnit(id);
    if (res.success) {
      alert("Unidad eliminada.");
      renderCourseTree(courseId);
      document.getElementById("chapter-editor-workspace").style.display = "none";
      document.getElementById("chapter-editor-welcome").style.display = "flex";
    }
  }
}

async function loadChapterIntoEditor(courseId, chapterIndex) {
  const workspace = document.getElementById("chapter-editor-workspace");
  const welcome = document.getElementById("chapter-editor-welcome");
  
  workspace.style.display = "none";
  welcome.style.display = "none";

  const ch = await DB.getChapterContent(courseId, chapterIndex);
  if (ch.error) {
    alert("Error al cargar el contenido del capítulo");
    welcome.style.display = "flex";
    return;
  }

  activeChapterData = ch;

  document.getElementById("editor-chapter-id").value = ch.id || "";
  document.getElementById("editor-chapter-title").value = ch.title || "";
  document.getElementById("editor-chapter-index").value = ch.chapterIndex || "";
  document.getElementById("editor-chapter-completed").checked = ch.isCompleted || false;
  document.getElementById("editor-chapter-locked").checked = ch.isLocked || false;

  document.getElementById("workspace-chapter-title").textContent = `Editar Capítulo ${ch.chapterIndex}`;
  document.getElementById("workspace-unit-title").textContent = ch.title;

  const tabButtons = document.querySelectorAll(".editor-tab-btn");
  tabButtons.forEach(btn => btn.classList.remove("active"));
  const motBtn = Array.from(tabButtons).find(btn => btn.getAttribute("data-tab") === "motivation");
  if (motBtn) motBtn.classList.add("active");

  const htmlBtn = document.getElementById("course-btn-html-mode");
  if (htmlBtn.classList.contains("active")) {
    htmlBtn.classList.remove("active");
    document.getElementById("course-editor-code").style.display = "none";
    document.getElementById("course-editor-visual").style.display = "block";
  }

  loadContentToEditorForTab("motivation");
  renderStructuredManager("motivation");

  workspace.style.display = "block";
}

function saveCurrentEditorTabContentToMemory() {
  if (!activeChapterData) return;
  const editorVisual = document.getElementById("course-editor-visual");
  const editorCode = document.getElementById("course-editor-code");
  const htmlBtn = document.getElementById("course-btn-html-mode");
  
  if (activeEditorTab === "motivation" || activeEditorTab === "theory" || activeEditorTab === "application") {
    let content = "";
    if (htmlBtn.classList.contains("active")) {
      content = editorCode.value;
    } else {
      content = editorVisual.innerHTML;
    }

    if (activeEditorTab === "motivation") activeChapterData.contentMotivation = content;
    else if (activeEditorTab === "theory") activeChapterData.contentTheory = content;
    else if (activeEditorTab === "application") activeChapterData.contentApplication = content;
  }
}

function loadContentToEditorForTab(tabName) {
  activeEditorTab = tabName;
  const editorVisual = document.getElementById("course-editor-visual");
  const editorCode = document.getElementById("course-editor-code");
  const htmlBtn = document.getElementById("course-btn-html-mode");
  
  if (tabName === "exercises" || tabName === "formulas") {
    return;
  }

  let content = "";
  if (tabName === "motivation") content = activeChapterData.contentMotivation || "";
  else if (tabName === "theory") content = activeChapterData.contentTheory || "";
  else if (tabName === "application") content = activeChapterData.contentApplication || "";

  if (htmlBtn.classList.contains("active")) {
    editorCode.value = content;
    editorVisual.innerHTML = content;
  } else {
    editorVisual.innerHTML = content;
    editorCode.value = content;
  }
}

function initCourseWysiwygEditor() {
  const editorVisual = document.getElementById("course-editor-visual");
  const editorCode = document.getElementById("course-editor-code");
  const btnHtmlMode = document.getElementById("course-btn-html-mode");
  const toolbarButtons = document.querySelectorAll(".course-toolbar-btn");

  toolbarButtons.forEach(btn => {
    if (btn.id === "course-btn-html-mode") return;

    btn.addEventListener("click", () => {
      if (btnHtmlMode.classList.contains("active")) return;

      const cmd = btn.getAttribute("data-cmd");
      const val = btn.getAttribute("data-val");

      if (cmd === "createLink") {
        showCustomPrompt("Insertar Enlace", "Introduce el enlace URL:", "https://").then(url => {
          if (url && url !== "https://") {
            document.execCommand(cmd, false, url);
          }
        });
      } else if (cmd === "insertImage") {
        showCustomPrompt("Insertar Imagen", "Introduce la URL de la imagen:", "https://").then(url => {
          if (url && url !== "https://") {
            document.execCommand(cmd, false, url);
          }
        });
      } else {
        document.execCommand(cmd, false, val || null);
      }
      
      editorVisual.focus();
    });
  });

  btnHtmlMode.onclick = () => {
    const isCodeActive = btnHtmlMode.classList.toggle("active");

    if (isCodeActive) {
      editorCode.value = editorVisual.innerHTML;
      editorVisual.style.display = "none";
      editorCode.style.display = "block";
      editorCode.focus();
    } else {
      editorVisual.innerHTML = editorCode.value;
      editorCode.style.display = "none";
      editorVisual.style.display = "block";
      editorVisual.focus();
    }
  };
}

function parseLatexChapter(latexText) {
  const getMeta = (key) => {
    const re = new RegExp(`%\\s*${key}\\s*:\\s*(.+)`, 'i');
    const m = latexText.match(re);
    return m ? m[1].trim() : '';
  };

  const metadata = {
    courseId: getMeta('ID_CURSO'),
    unitIndex: getMeta('NUMERO_UNIDAD'),
    unitTitle: getMeta('TITULO_UNIDAD'),
    chapterIndex: getMeta('NUMERO_CAPITULO'),
    chapterTitle: getMeta('TITULO_CAPITULO'),
    isLocked: getMeta('ESTADO_BLOQUEADO').toLowerCase() === 'true',
    isCompleted: getMeta('ESTADO_COMPLETADO').toLowerCase() === 'true'
  };

  const getEnvContent = (envName) => {
    const re = new RegExp(`\\\\begin\\{${envName}\\}([\\s\\S]*?)\\\\end\\{${envName}\\}`, 'i');
    const m = latexText.match(re);
    return m ? m[1].trim() : '';
  };

  function stripLatexComments(str) {
    if (!str) return '';
    // 1. Remove full line comments (lines starting with % after optional whitespace)
    let clean = str.replace(/^[ \t]*%[^\r\n]*/gm, '');
    // 2. Remove inline comments (starts with % not preceded by \)
    clean = clean.replace(/(^|[^\\])%[^\r\n]*/g, '$1');
    // 3. Unescape \% to %
    clean = clean.replace(/\\%/g, '%');
    return clean;
  }

  const rawMotiv = getEnvContent('motivacion');
  const rawTeoria = getEnvContent('teoria');
  const rawAplic = getEnvContent('aplicacion');
  const rawExerc = stripLatexComments(getEnvContent('ejercicios'));
  const rawFormulas = stripLatexComments(getEnvContent('formulas'));

  function extractMacroCalls(text, macroName, argCount) {
    const results = [];
    const regex = new RegExp(`\\\\${macroName}\\s*\\{`, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      const startIndex = match.index;
      let i = match.index + match[0].length - 1;
      const args = [];

      while (i < text.length && args.length < argCount) {
        if (text[i] === '{') {
          let depth = 1;
          let start = i + 1;
          i++;
          while (i < text.length && depth > 0) {
            if (text[i] === '{' && text[i - 1] !== '\\') depth++;
            else if (text[i] === '}' && text[i - 1] !== '\\') depth--;
            i++;
          }
          args.push(text.substring(start, i - 1));
        } else if (/\s/.test(text[i])) {
          i++;
        } else {
          break;
        }
      }

      if (args.length === argCount) {
        results.push({
          startIndex: startIndex,
          endIndex: i,
          fullMatch: text.substring(startIndex, i),
          args: args
        });
      }
    }
    return results;
  }

  function parseColumnItems(colText) {
    if (!colText) return [];
    const rawItems = colText.split(/\\item\b/).map(s => s.trim()).filter(Boolean);
    return rawItems.map(item => {
      let clean = item.replace(/^\[[^\]]+\]\s*/, '');
      return clean.trim();
    });
  }

  function processQuizBlock(body, macroName, argCount) {
    const calls = extractMacroCalls(body, macroName, argCount);
    if (calls.length === 0) {
      return { statement: body.trim(), calls: [] };
    }

    let statement = '';
    let lastIndex = 0;
    calls.forEach(c => {
      statement += body.substring(lastIndex, c.startIndex);
      lastIndex = c.endIndex;
    });
    statement += body.substring(lastIndex);

    return { statement: statement.trim(), calls };
  }

  function latexToHtml(raw) {
    if (!raw) return '';
    let text = stripLatexComments(raw).trim();
    if (!text) return '';

    const blocks = [];

    function saveBlock(htmlStr) {
      const idx = blocks.length;
      blocks.push(htmlStr);
      return `___BLOCK_${idx}___`;
    }

    // 1. Extract Display Math $$...$$ or \[...\]
    text = text.replace(/(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\])/g, (match) => {
      return saveBlock(`<div class="formula-block" style="text-align:center; margin: 12px 0;">${match}</div>`);
    });

    // 2. Extract Headings
    text = text.replace(/\\section\*\{([^}]+)\}/gi, (m, title) => saveBlock(`<h3>${title}</h3>`));
    text = text.replace(/\\subsection\*\{([^}]+)\}/gi, (m, title) => saveBlock(`<h4>${title}</h4>`));

    // 3. Extract Custom Boxes & Environments
    text = text.replace(/\\begin\{definicion\}\{([^}]+)\}([\s\S]*?)\\end\{definicion\}/gi, (m, title, body) => {
      return saveBlock(`<div class="caja-ram caja-definicion"><div class="caja-ram-title"><i class="fa-solid fa-book-bookmark"></i> Definición: ${title}</div><div class="caja-ram-body">${latexToHtml(body)}</div></div>`);
    });

    text = text.replace(/\\begin\{teorema\}\{([^}]+)\}([\s\S]*?)\\end\{teorema\}/gi, (m, title, body) => {
      return saveBlock(`<div class="caja-ram caja-teorema"><div class="caja-ram-title"><i class="fa-solid fa-square-root-variable"></i> Teorema: ${title}</div><div class="caja-ram-body">${latexToHtml(body)}</div></div>`);
    });

    text = text.replace(/\\begin\{(?:proof|demostracion)\}(?:\[([^\]]+)\])?([\s\S]*?)\\end\{(?:proof|demostracion)\}/gi, (m, title, body) => {
      const label = title || 'Demostración';
      return saveBlock(`<div class="caja-ram caja-demostracion" style="border-left: 3px solid var(--accent-color); padding-left: 12px; margin: 10px 0;"><p><strong>${label}:</strong> ${latexToHtml(body)}</p></div>`);
    });

    text = text.replace(/\\begin\{alerta\}\{([^}]+)\}([\s\S]*?)\\end\{alerta\}/gi, (m, title, body) => {
      return saveBlock(`<div class="caja-ram caja-choque-cognitivo"><div class="caja-ram-title"><i class="fa-solid fa-triangle-exclamation"></i> Alerta: ${title}</div><div class="caja-ram-body">${latexToHtml(body)}</div></div>`);
    });

    text = text.replace(/\\begin\{procesamiento\}\{([^}]+)\}([\s\S]*?)\\end\{procesamiento\}/gi, (m, title, body) => {
      return saveBlock(`<div class="caja-ram caja-procesamiento"><div class="caja-ram-title"><i class="fa-solid fa-gear"></i> Procedimiento: ${title}</div><div class="caja-ram-body">${latexToHtml(body)}</div></div>`);
    });

    text = text.replace(/\\begin\{ejemplo\}\{([^}]+)\}([\s\S]*?)\\end\{ejemplo\}/gi, (m, title, body) => {
      return saveBlock(`<div class="caja-ram caja-ejemplo"><div class="caja-ram-title"><i class="fa-solid fa-chalkboard-user"></i> Ejemplo: ${title}</div><div class="caja-ram-body">${latexToHtml(body)}</div></div>`);
    });

    text = text.replace(/\\begin\{preguntaguia\}([\s\S]*?)\\end\{preguntaguia\}/gi, (m, body) => {
      return saveBlock(`<div class="caja-ram caja-pregunta-guia"><div class="caja-ram-title"><i class="fa-solid fa-circle-question"></i> Pregunta Guía</div><div class="caja-ram-body">${latexToHtml(body)}</div></div>`);
    });

    // Quizzes & Pareados
    text = text.replace(/\\begin\{preguntaalternativas\}\{([^}]+)\}([\s\S]*?)\\end\{preguntaalternativas\}/gi, (m, title, body) => {
      const { statement, calls } = processQuizBlock(body, 'opcion', 3);
      const options = calls.map(c => ({
        text: c.args[0].trim(),
        isCorrect: c.args[1].trim(),
        feedback: c.args[2].trim()
      }));

      const optionsHtml = options.map((opt) => `
        <label style="display: block; margin: 8px 0; padding: 10px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer;">
          <input type="radio" name="quiz_alt_${title.replace(/\W+/g, '')}" value="${opt.isCorrect.toLowerCase() === 'correcto' ? '1' : '0'}" data-feedback="${latexToHtml(opt.feedback).replace(/"/g, '&quot;')}" style="margin-right: 8px;">
          ${latexToHtml(opt.text)}
        </label>
      `).join('');

      return saveBlock(`
        <div class="quiz-block quiz-alternativas" style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 16px; border-radius: 8px; margin: 15px 0;">
          <h4 style="margin-top:0; color: var(--accent-color);"><i class="fa-solid fa-list-check"></i> ${title}</h4>
          ${latexToHtml(statement)}
          <div>${optionsHtml}</div>
          <button type="button" class="btn btn-verify-quiz" onclick="verifyQuizAlternatives(this)" style="margin-top: 10px; padding: 6px 14px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer;">Verificar Respuesta</button>
          <div class="quiz-feedback" style="display:none; margin-top:10px; padding:10px; border-radius:6px;"></div>
        </div>
      `);
    });

    text = text.replace(/\\begin\{preguntaverdaderofalso\}\{([^}]+)\}([\s\S]*?)\\end\{preguntaverdaderofalso\}/gi, (m, title, body) => {
      let correctVal = 'V';
      let fbV = '';
      let fbF = '';

      const { statement, calls } = processQuizBlock(body, 'verdaderofalso', 3);
      if (calls.length > 0) {
        const c = calls[0];
        correctVal = c.args[0].trim().toUpperCase();
        fbF = c.args[1].trim(); // Arg 2: Si marca Falso
        fbV = c.args[2].trim(); // Arg 3: Si marca Verdadero
      }

      return saveBlock(`
        <div class="quiz-block quiz-vf" style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 16px; border-radius: 8px; margin: 15px 0;">
          <h4 style="margin-top:0; color: var(--accent-color);"><i class="fa-solid fa-circle-half-stroke"></i> ${title}</h4>
          ${latexToHtml(statement)}
          <div style="display:flex; gap:12px; margin:10px 0;">
            <button type="button" class="btn btn-vf-option" data-val="V" data-correct="${correctVal}" data-feedback="${latexToHtml(fbV).replace(/"/g, '&quot;')}" onclick="verifyQuizVF(this)" style="padding: 8px 20px; border: 1px solid var(--border-color); background: var(--bg-primary); cursor: pointer; border-radius: 6px;">Verdadero (V)</button>
            <button type="button" class="btn btn-vf-option" data-val="F" data-correct="${correctVal}" data-feedback="${latexToHtml(fbF).replace(/"/g, '&quot;')}" onclick="verifyQuizVF(this)" style="padding: 8px 20px; border: 1px solid var(--border-color); background: var(--bg-primary); cursor: pointer; border-radius: 6px;">Falso (F)</button>
          </div>
          <div class="quiz-feedback" style="display:none; margin-top:10px; padding:10px; border-radius:6px;"></div>
        </div>
      `);
    });

    text = text.replace(/\\begin\{preguntacasillas\}\{([^}]+)\}([\s\S]*?)\\end\{preguntacasillas\}/gi, (m, title, body) => {
      const { statement, calls } = processQuizBlock(body, 'casilla', 3);
      const items = calls.map(c => ({
        text: c.args[0].trim(),
        isCorrect: c.args[1].trim().toLowerCase() === 'correcto',
        feedback: c.args[2].trim()
      }));

      const itemsHtml = items.map((opt) => `
        <label style="display: block; margin: 8px 0; padding: 10px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer;">
          <input type="checkbox" data-correct="${opt.isCorrect ? '1' : '0'}" data-feedback="${latexToHtml(opt.feedback).replace(/"/g, '&quot;')}" style="margin-right: 8px;">
          ${latexToHtml(opt.text)}
        </label>
      `).join('');

      return saveBlock(`
        <div class="quiz-block quiz-casillas" style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 16px; border-radius: 8px; margin: 15px 0;">
          <h4 style="margin-top:0; color: var(--accent-color);"><i class="fa-solid fa-square-check"></i> ${title}</h4>
          ${latexToHtml(statement)}
          <div>${itemsHtml}</div>
          <button type="button" class="btn btn-verify-casillas" onclick="verifyQuizCasillas(this)" style="margin-top: 10px; padding: 6px 14px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer;">Verificar Selección</button>
          <div class="quiz-feedback" style="display:none; margin-top:10px; padding:10px; border-radius:6px;"></div>
        </div>
      `);
    });

    // 4. Términos Pareados 2 Col
    text = text.replace(/\\begin\{pareadosdoscolumnas\}\{([^}]+)\}([\s\S]*?)\\end\{pareadosdoscolumnas\}/gi, (m, title, body) => {
      let col1Text = '';
      let col2Text = '';
      const col1Calls = extractMacroCalls(body, 'columnaI', 1);
      if (col1Calls.length > 0) col1Text = col1Calls[0].args[0];

      const col2Calls = extractMacroCalls(body, 'columnaII', 1);
      if (col2Calls.length > 0) col2Text = col2Calls[0].args[0];

      const pareoCalls = extractMacroCalls(body, 'pareo', 2);
      const pareoMap = {};
      pareoCalls.forEach(c => {
        const key = c.args[0].trim();
        const fb = c.args[1].trim();
        const parts = key.split('-');
        if (parts.length >= 2) {
          const num = parts[0].trim();
          const letCode = parts[1].trim().toUpperCase();
          pareoMap[num] = { letter: letCode, feedback: fb };
        }
      });

      let statement = body;
      col1Calls.concat(col2Calls).concat(pareoCalls).forEach(c => {
        statement = statement.replace(c.fullMatch, '');
      });

      const col1Items = parseColumnItems(col1Text);
      const col2Items = parseColumnItems(col2Text);
      const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

      const col1Html = col1Items.map((item, idx) => `
        <div style="display: flex; gap: 10px; margin: 10px 0; padding: 10px; background: var(--bg-primary); border-radius: 6px; border: 1px solid var(--border-color); align-items: center;">
          <span style="background: var(--accent-color); color: white; width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px; flex-shrink: 0;">${idx + 1}</span>
          <div style="flex: 1;">${latexToHtml(item)}</div>
        </div>
      `).join('');

      const col2Html = col2Items.map((item, idx) => `
        <div style="display: flex; gap: 10px; margin: 10px 0; padding: 10px; background: var(--bg-primary); border-radius: 6px; border: 1px solid var(--border-color); align-items: center;">
          <span style="background: #10b981; color: white; width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px; flex-shrink: 0;">${letters[idx] || (idx+1)}</span>
          <div style="flex: 1;">${latexToHtml(item)}</div>
        </div>
      `).join('');

      const availableLetters = col2Items.map((_, idx) => letters[idx] || String(idx + 1));
      const selectorsHtml = col1Items.map((_, idx) => {
        const num = idx + 1;
        const info = pareoMap[num] || pareoMap[String(num)] || { letter: '', feedback: '' };
        const optionsHtml = availableLetters.map(letCode => `<option value="${letCode}">${letCode}</option>`).join('');

        return `
          <div class="pareo-row-item" data-num="${num}" data-correct-letter="${info.letter}" data-feedback="${latexToHtml(info.feedback).replace(/"/g, '&quot;')}" style="display: flex; align-items: center; gap: 12px; margin: 8px 0; padding: 10px 14px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; flex-wrap: wrap;">
            <span style="font-weight: 700; min-width: 80px;">Ítem ${num}:</span>
            <span style="color: var(--text-muted); font-size: 13px;">asociar con Letra:</span>
            <select class="pareo-select-col2" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); font-weight: 600; cursor: pointer;">
              <option value="">-- Elegir --</option>
              ${optionsHtml}
            </select>
          </div>
        `;
      }).join('');

      return saveBlock(`
        <div class="quiz-block quiz-pareados-2col" style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4 style="margin-top:0; color: var(--accent-color); font-size: 1.1rem;"><i class="fa-solid fa-diagram-project"></i> Términos Pareados: ${title}</h4>
          ${latexToHtml(statement.trim())}
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 18px 0;">
            <div>
              <h5 style="margin-top:0; margin-bottom: 8px; color: var(--accent-color); font-size: 14px;"><i class="fa-solid fa-list-ol"></i> Columna 1 (Números)</h5>
              ${col1Html}
            </div>
            <div>
              <h5 style="margin-top:0; margin-bottom: 8px; color: #10b981; font-size: 14px;"><i class="fa-solid fa-font"></i> Columna 2 (Letras)</h5>
              ${col2Html}
            </div>
          </div>

          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed var(--border-color);">
            <h5 style="margin-top:0; margin-bottom: 12px; color: var(--text-primary); font-size: 14px;"><i class="fa-solid fa-sliders"></i> Asocia los términos según corresponda:</h5>
            ${selectorsHtml}
            <button type="button" class="btn btn-verify-pareados" onclick="verifyQuizPareados2Col(this)" style="margin-top: 12px; padding: 8px 18px; background: var(--accent-color); color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Verificar Asociaciones</button>
            <div class="quiz-feedback" style="display:none; margin-top:14px; padding:12px; border-radius:8px;"></div>
          </div>
        </div>
      `);
    });

    // 5. Términos Pareados 3 Col
    text = text.replace(/\\begin\{pareadostrescolumnas\}\{([^}]+)\}([\s\S]*?)\\end\{pareadostrescolumnas\}/gi, (m, title, body) => {
      let col1Text = '';
      let col2Text = '';
      let col3Text = '';
      const col1Calls = extractMacroCalls(body, 'columnaI', 1);
      if (col1Calls.length > 0) col1Text = col1Calls[0].args[0];

      const col2Calls = extractMacroCalls(body, 'columnaII', 1);
      if (col2Calls.length > 0) col2Text = col2Calls[0].args[0];

      const col3Calls = extractMacroCalls(body, 'columnaIII', 1);
      if (col3Calls.length > 0) col3Text = col3Calls[0].args[0];

      const pareoCalls = extractMacroCalls(body, 'pareotres', 2);
      const pareoMap = {};
      pareoCalls.forEach(c => {
        const key = c.args[0].trim();
        const fb = c.args[1].trim();
        const parts = key.split('-');
        if (parts.length >= 3) {
          const num = parts[0].trim();
          const letCode = parts[1].trim().toUpperCase();
          const romanCode = parts[2].trim().toUpperCase();
          pareoMap[num] = { letter: letCode, roman: romanCode, feedback: fb };
        }
      });

      let statement = body;
      col1Calls.concat(col2Calls).concat(col3Calls).concat(pareoCalls).forEach(c => {
        statement = statement.replace(c.fullMatch, '');
      });

      const col1Items = parseColumnItems(col1Text);
      const col2Items = parseColumnItems(col2Text);
      const col3Items = parseColumnItems(col3Text);
      const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

      const col1Html = col1Items.map((item, idx) => `
        <div style="display: flex; gap: 8px; margin: 8px 0; padding: 10px; background: var(--bg-primary); border-radius: 6px; border: 1px solid var(--border-color); align-items: center;">
          <span style="background: var(--accent-color); color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">${idx + 1}</span>
          <div style="flex: 1; font-size: 13px;">${latexToHtml(item)}</div>
        </div>
      `).join('');

      const col2Html = col2Items.map((item, idx) => `
        <div style="display: flex; gap: 8px; margin: 8px 0; padding: 10px; background: var(--bg-primary); border-radius: 6px; border: 1px solid var(--border-color); align-items: center;">
          <span style="background: #10b981; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">${letters[idx] || (idx+1)}</span>
          <div style="flex: 1; font-size: 13px;">${latexToHtml(item)}</div>
        </div>
      `).join('');

      const col3Html = col3Items.map((item, idx) => `
        <div style="display: flex; gap: 8px; margin: 8px 0; padding: 10px; background: var(--bg-primary); border-radius: 6px; border: 1px solid var(--border-color); align-items: center;">
          <span style="background: #a855f7; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">${romans[idx] || (idx+1)}</span>
          <div style="flex: 1; font-size: 13px;">${latexToHtml(item)}</div>
        </div>
      `).join('');

      const availableLetters = col2Items.map((_, idx) => letters[idx] || String(idx + 1));
      const availableRomans = col3Items.map((_, idx) => romans[idx] || String(idx + 1));

      const selectorsHtml = col1Items.map((_, idx) => {
        const num = idx + 1;
        const info = pareoMap[num] || pareoMap[String(num)] || { letter: '', roman: '', feedback: '' };
        const optLetters = availableLetters.map(letCode => `<option value="${letCode}">${letCode}</option>`).join('');
        const optRomans = availableRomans.map(rCode => `<option value="${rCode}">${rCode}</option>`).join('');

        return `
          <div class="pareo-row-item" data-num="${num}" data-correct-letter="${info.letter}" data-correct-roman="${info.roman}" data-feedback="${latexToHtml(info.feedback).replace(/"/g, '&quot;')}" style="display: flex; align-items: center; gap: 10px; margin: 8px 0; padding: 10px 14px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; flex-wrap: wrap;">
            <span style="font-weight: 700; min-width: 70px;">Ítem ${num}:</span>
            <span style="color: var(--text-muted); font-size: 13px;">Letra:</span>
            <select class="pareo-select-col2" style="padding: 5px 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); font-weight: 600; cursor: pointer;">
              <option value="">-- Letra --</option>
              ${optLetters}
            </select>
            <span style="color: var(--text-muted); font-size: 13px; margin-left: 6px;">Romano:</span>
            <select class="pareo-select-col3" style="padding: 5px 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); font-weight: 600; cursor: pointer;">
              <option value="">-- Romano --</option>
              ${optRomans}
            </select>
          </div>
        `;
      }).join('');

      return saveBlock(`
        <div class="quiz-block quiz-pareados-3col" style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4 style="margin-top:0; color: var(--accent-color); font-size: 1.1rem;"><i class="fa-solid fa-network-wired"></i> Términos Pareados (3 Columnas): ${title}</h4>
          ${latexToHtml(statement.trim())}
          
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin: 18px 0;">
            <div>
              <h5 style="margin-top:0; margin-bottom: 8px; color: var(--accent-color); font-size: 13px;"><i class="fa-solid fa-list-ol"></i> Columna 1 (Números)</h5>
              ${col1Html}
            </div>
            <div>
              <h5 style="margin-top:0; margin-bottom: 8px; color: #10b981; font-size: 13px;"><i class="fa-solid fa-font"></i> Columna 2 (Letras)</h5>
              ${col2Html}
            </div>
            <div>
              <h5 style="margin-top:0; margin-bottom: 8px; color: #a855f7; font-size: 13px;"><i class="fa-solid fa-kaaba"></i> Columna 3 (Romanos)</h5>
              ${col3Html}
            </div>
          </div>

          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed var(--border-color);">
            <h5 style="margin-top:0; margin-bottom: 12px; color: var(--text-primary); font-size: 14px;"><i class="fa-solid fa-sliders"></i> Asocia cada Ítem con su Letra y su Número Romano correspondiente:</h5>
            ${selectorsHtml}
            <button type="button" class="btn btn-verify-pareados" onclick="verifyQuizPareados3Col(this)" style="margin-top: 12px; padding: 8px 18px; background: var(--accent-color); color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Verificar Asociaciones</button>
            <div class="quiz-feedback" style="display:none; margin-top:14px; padding:12px; border-radius:8px;"></div>
          </div>
        </div>
      `);
    });

    // Extract Lists
    text = text.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/gi, (m, body) => {
      let listItems = body.replace(/\\item\[([^\]]+)\]\s*([\s\S]*?)(?=(?:\\item|$))/gi, '<li><strong>$1</strong> $2</li>');
      listItems = listItems.replace(/\\item\s+([\s\S]*?)(?=(?:\\item|$))/gi, '<li>$1</li>');
      return saveBlock(`<ul style="margin: 8px 0; padding-left: 20px;">${listItems}</ul>`);
    });

    text = text.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/gi, (m, body) => {
      let listItems = body.replace(/\\item\[([^\]]+)\]\s*([\s\S]*?)(?=(?:\\item|$))/gi, '<li><strong>$1</strong> $2</li>');
      listItems = listItems.replace(/\\item\s+([\s\S]*?)(?=(?:\\item|$))/gi, '<li>$1</li>');
      return saveBlock(`<ol style="margin: 8px 0; padding-left: 20px;">${listItems}</ol>`);
    });

    // Split plain text chunks by double newlines or \par
    const rawChunks = text.split(/(?:\r?\n\s*\r?\n|\\par\b)/);
    const processedChunks = rawChunks.map(chunk => {
      let c = chunk.trim();
      if (!c) return '';

      const tokenMatch = c.match(/^___BLOCK_(\d+)___$/);
      if (tokenMatch) {
        return blocks[parseInt(tokenMatch[1], 10)];
      }

      c = c.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>');
      c = c.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>');
      c = c.replace(/\\underline\{([^}]+)\}/g, '<u>$1</u>');
      c = c.replace(/\r?\n/g, ' ');

      return `<p>${c}</p>`;
    });

    let resultHtml = processedChunks.filter(Boolean).join('\n');

    let previousHtml = '';
    while (resultHtml !== previousHtml) {
      previousHtml = resultHtml;
      resultHtml = resultHtml.replace(/___BLOCK_(\d+)___/g, (m, idx) => blocks[parseInt(idx, 10)]);
    }

    return resultHtml;
  }

  // Parse Ejercicios
  const exercisesList = [];
  if (rawExerc) {
    // 1. Ejercicio Resuelto
    const exResRegex = /\\begin\{ejercicioresuelto\}\{([^}]+)\}\{([^}]+)\}([\s\S]*?)\\end\{ejercicioresuelto\}/gi;
    let match;
    while ((match = exResRegex.exec(rawExerc)) !== null) {
      const title = match[1].trim();
      const level = match[2].trim();
      const body = match[3];
      const enunMatch = body.match(/\\enunciado\{([\s\S]*?)\}/i);
      const solMatch = body.match(/\\solucion\{([\s\S]*?)\}/i);
      exercisesList.push({
        id: `ex-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: title,
        level: level || 'resuelto',
        statement: enunMatch ? latexToHtml(enunMatch[1].trim()) : '',
        solution: solMatch ? latexToHtml(solMatch[1].trim()) : ''
      });
    }

    // 2. Ejercicio Demostración
    const exDemoRegex = /\\begin\{ejerciciodemostracion\}\{([^}]+)\}\{([^}]+)\}([\s\S]*?)\\end\{ejerciciodemostracion\}/gi;
    while ((match = exDemoRegex.exec(rawExerc)) !== null) {
      const title = match[1].trim();
      const level = match[2].trim();
      const body = match[3];
      const enunMatch = body.match(/\\enunciado\{([\s\S]*?)\}/i);
      const demoMatch = body.match(/\\demostracion\{([\s\S]*?)\}/i);
      exercisesList.push({
        id: `ex-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: title,
        level: level || 'nivel-3',
        statement: enunMatch ? latexToHtml(enunMatch[1].trim()) : '',
        solution: demoMatch ? latexToHtml(demoMatch[1].trim()) : ''
      });
    }

    // 3. Ejercicio Propuesto
    const exPropRegex = /\\begin\{ejerciciopropuesto\}\{([^}]+)\}\{([^}]+)\}([\s\S]*?)\\end\{ejerciciopropuesto\}/gi;
    while ((match = exPropRegex.exec(rawExerc)) !== null) {
      const title = match[1].trim();
      const level = match[2].trim();
      const body = match[3];
      const enunMatch = body.match(/\\enunciado\{([\s\S]*?)\}/i);
      const pistaMatch = body.match(/\\pista\{([\s\S]*?)\}/i);
      exercisesList.push({
        id: `ex-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: title,
        level: level || 'nivel-2',
        statement: enunMatch ? latexToHtml(enunMatch[1].trim()) : '',
        solution: pistaMatch ? latexToHtml(pistaMatch[1].trim()) : ''
      });
    }
  }

  // Parse Fórmulas
  const formulasList = [];
  if (rawFormulas) {
    const formRegex = /\\formula\{([^}]+)\}\s*\{([^}]+)\}\s*\{([^}]+)\}/gi;
    let match;
    while ((match = formRegex.exec(rawFormulas)) !== null) {
      formulasList.push({
        id: `form-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: match[1].trim(),
        latex: match[2].trim(),
        description: match[3].trim()
      });
    }
  }

  return {
    metadata,
    contentMotivation: latexToHtml(rawMotiv),
    contentTheory: latexToHtml(rawTeoria),
    contentApplication: latexToHtml(rawAplic),
    contentExercises: JSON.stringify(exercisesList, null, 2),
    contentFormulas: JSON.stringify(formulasList, null, 2)
  };
}

/* ==========================================================================
   HANDLERS GLOBALES DE VERIFICACIÓN PARA QUIZZES INTERACTIVOS
   ========================================================================== */
window.verifyQuizAlternatives = function(btn) {
  const container = btn.closest('.quiz-block');
  if (!container) return;

  const selected = container.querySelector('input[type="radio"]:checked');
  const feedbackDiv = container.querySelector('.quiz-feedback');
  if (!feedbackDiv) return;

  if (!selected) {
    feedbackDiv.style.display = 'block';
    feedbackDiv.style.background = 'rgba(245, 158, 11, 0.15)';
    feedbackDiv.style.border = '1px solid #f59e0b';
    feedbackDiv.style.color = 'var(--text-primary)';
    feedbackDiv.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color:#f59e0b;"></i> Por favor selecciona una opción antes de verificar.';
    return;
  }

  const isCorrect = selected.value === '1';
  const feedbackText = selected.getAttribute('data-feedback') || '';

  feedbackDiv.style.display = 'block';
  if (isCorrect) {
    feedbackDiv.style.background = 'rgba(16, 185, 129, 0.15)';
    feedbackDiv.style.border = '1px solid #10b981';
    feedbackDiv.style.color = 'var(--text-primary)';
    feedbackDiv.innerHTML = `<p style="margin:0 0 4px 0; font-weight:bold; color:#10b981;"><i class="fa-solid fa-circle-check"></i> ¡Correcto!</p><p style="margin:0;">${feedbackText}</p>`;
  } else {
    feedbackDiv.style.background = 'rgba(239, 68, 68, 0.15)';
    feedbackDiv.style.border = '1px solid #ef4444';
    feedbackDiv.style.color = 'var(--text-primary)';
    feedbackDiv.innerHTML = `<p style="margin:0 0 4px 0; font-weight:bold; color:#ef4444;"><i class="fa-solid fa-circle-xmark"></i> Incorrecto</p><p style="margin:0;">${feedbackText}</p>`;
  }

  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise([feedbackDiv]);
  }
};

window.verifyQuizVF = function(btn) {
  const container = btn.closest('.quiz-block');
  if (!container) return;

  const selectedVal = btn.getAttribute('data-val');
  const correctVal = btn.getAttribute('data-correct');
  const feedbackText = btn.getAttribute('data-feedback') || '';
  const feedbackDiv = container.querySelector('.quiz-feedback');
  if (!feedbackDiv) return;

  const isCorrect = selectedVal === correctVal;

  feedbackDiv.style.display = 'block';
  if (isCorrect) {
    feedbackDiv.style.background = 'rgba(16, 185, 129, 0.15)';
    feedbackDiv.style.border = '1px solid #10b981';
    feedbackDiv.style.color = 'var(--text-primary)';
    feedbackDiv.innerHTML = `<p style="margin:0 0 4px 0; font-weight:bold; color:#10b981;"><i class="fa-solid fa-circle-check"></i> ¡Respuesta Correcta!</p><p style="margin:0;">${feedbackText}</p>`;
  } else {
    feedbackDiv.style.background = 'rgba(239, 68, 68, 0.15)';
    feedbackDiv.style.border = '1px solid #ef4444';
    feedbackDiv.style.color = 'var(--text-primary)';
    feedbackDiv.innerHTML = `<p style="margin:0 0 4px 0; font-weight:bold; color:#ef4444;"><i class="fa-solid fa-circle-xmark"></i> Respuesta Incorrecta</p><p style="margin:0;">${feedbackText}</p>`;
  }

  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise([feedbackDiv]);
  }
};

window.verifyQuizCasillas = function(btn) {
  const container = btn.closest('.quiz-block');
  if (!container) return;

  const checkboxes = Array.from(container.querySelectorAll('input[type="checkbox"]'));
  const feedbackDiv = container.querySelector('.quiz-feedback');
  if (!feedbackDiv) return;

  let allCorrect = true;
  let hasSelection = false;
  let feedbackMessages = [];

  checkboxes.forEach(cb => {
    const isChecked = cb.checked;
    if (isChecked) hasSelection = true;
    const isCorrect = cb.getAttribute('data-correct') === '1';
    const fb = cb.getAttribute('data-feedback');

    if (isChecked !== isCorrect) {
      allCorrect = false;
    }
    if (isChecked && fb) {
      feedbackMessages.push(fb);
    }
  });

  if (!hasSelection) {
    feedbackDiv.style.display = 'block';
    feedbackDiv.style.background = 'rgba(245, 158, 11, 0.15)';
    feedbackDiv.style.border = '1px solid #f59e0b';
    feedbackDiv.style.color = 'var(--text-primary)';
    feedbackDiv.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color:#f59e0b;"></i> Por favor marca al menos una casilla antes de verificar.';
    return;
  }

  feedbackDiv.style.display = 'block';
  if (allCorrect) {
    feedbackDiv.style.background = 'rgba(16, 185, 129, 0.15)';
    feedbackDiv.style.border = '1px solid #10b981';
    feedbackDiv.style.color = 'var(--text-primary)';
    feedbackDiv.innerHTML = `<p style="margin:0 0 4px 0; font-weight:bold; color:#10b981;"><i class="fa-solid fa-circle-check"></i> ¡Excelente! Has seleccionado la combinación correcta.</p>` +
      (feedbackMessages.length ? `<ul style="margin:4px 0 0 18px;">${feedbackMessages.map(m => `<li>${m}</li>`).join('')}</ul>` : '');
  } else {
    feedbackDiv.style.background = 'rgba(239, 68, 68, 0.15)';
    feedbackDiv.style.border = '1px solid #ef4444';
    feedbackDiv.style.color = 'var(--text-primary)';
    feedbackDiv.innerHTML = `<p style="margin:0 0 4px 0; font-weight:bold; color:#ef4444;"><i class="fa-solid fa-circle-xmark"></i> La combinación seleccionada no es la adecuada.</p>` +
      (feedbackMessages.length ? `<ul style="margin:4px 0 0 18px;">${feedbackMessages.map(m => `<li>${m}</li>`).join('')}</ul>` : '');
  }

  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise([feedbackDiv]);
  }
};

window.verifyQuizPareados2Col = function(btn) {
  const container = btn.closest('.quiz-block');
  if (!container) return;

  const rows = Array.from(container.querySelectorAll('.pareo-row-item'));
  const feedbackDiv = container.querySelector('.quiz-feedback');
  if (!feedbackDiv) return;

  let incomplete = false;
  let correctCount = 0;
  let details = [];

  rows.forEach(row => {
    const num = row.getAttribute('data-num');
    const correctLetter = row.getAttribute('data-correct-letter');
    const fb = row.getAttribute('data-feedback') || '';
    const sel = row.querySelector('.pareo-select-col2');
    const userVal = sel ? sel.value : '';

    if (!userVal) {
      incomplete = true;
    }

    const isMatch = userVal === correctLetter;
    if (isMatch) correctCount++;

    details.push({
      num,
      userVal,
      correctLetter,
      isMatch,
      fb
    });
  });

  if (incomplete) {
    feedbackDiv.style.display = 'block';
    feedbackDiv.style.background = 'rgba(245, 158, 11, 0.15)';
    feedbackDiv.style.border = '1px solid #f59e0b';
    feedbackDiv.style.color = 'var(--text-primary)';
    feedbackDiv.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color:#f59e0b;"></i> Por favor selecciona una letra para cada ítem antes de verificar.';
    return;
  }

  const allCorrect = correctCount === rows.length;
  feedbackDiv.style.display = 'block';
  feedbackDiv.style.background = allCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
  feedbackDiv.style.border = allCorrect ? '1px solid #10b981' : '1px solid #ef4444';
  feedbackDiv.style.color = 'var(--text-primary)';

  const headerMsg = allCorrect
    ? `<h5 style="margin:0 0 8px 0; color:#10b981;"><i class="fa-solid fa-circle-check"></i> ¡Excelente! Todas las parejas son correctas (${correctCount}/${rows.length})</h5>`
    : `<h5 style="margin:0 0 8px 0; color:#ef4444;"><i class="fa-solid fa-circle-xmark"></i> Has acertado ${correctCount} de ${rows.length} parejas</h5>`;

  const detailsHtml = details.map(d => `
    <div style="margin: 6px 0; padding: 6px 10px; background: var(--bg-primary); border-radius: 4px; font-size: 13px;">
      <strong>Ítem ${d.num}:</strong> ${d.isMatch ? `<span style="color:#10b981;">✓ Correcto (${d.userVal})</span>` : `<span style="color:#ef4444;">✗ Tu elección (${d.userVal || 'ninguna'}) | Correcta: ${d.correctLetter}</span>`}
      ${d.fb ? `<div style="margin-top:4px; color:var(--text-muted);">${d.fb}</div>` : ''}
    </div>
  `).join('');

  feedbackDiv.innerHTML = headerMsg + detailsHtml;

  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise([feedbackDiv]);
  }
};

window.verifyQuizPareados3Col = function(btn) {
  const container = btn.closest('.quiz-block');
  if (!container) return;

  const rows = Array.from(container.querySelectorAll('.pareo-row-item'));
  const feedbackDiv = container.querySelector('.quiz-feedback');
  if (!feedbackDiv) return;

  let incomplete = false;
  let correctCount = 0;
  let details = [];

  rows.forEach(row => {
    const num = row.getAttribute('data-num');
    const correctLetter = row.getAttribute('data-correct-letter');
    const correctRoman = row.getAttribute('data-correct-roman');
    const fb = row.getAttribute('data-feedback') || '';
    const selLet = row.querySelector('.pareo-select-col2');
    const selRom = row.querySelector('.pareo-select-col3');
    const userLet = selLet ? selLet.value : '';
    const userRom = selRom ? selRom.value : '';

    if (!userLet || !userRom) {
      incomplete = true;
    }

    const isMatch = userLet === correctLetter && userRom === correctRoman;
    if (isMatch) correctCount++;

    details.push({
      num,
      userLet,
      userRom,
      correctLetter,
      correctRoman,
      isMatch,
      fb
    });
  });

  if (incomplete) {
    feedbackDiv.style.display = 'block';
    feedbackDiv.style.background = 'rgba(245, 158, 11, 0.15)';
    feedbackDiv.style.border = '1px solid #f59e0b';
    feedbackDiv.style.color = 'var(--text-primary)';
    feedbackDiv.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color:#f59e0b;"></i> Por favor selecciona una letra y un número romano para cada ítem antes de verificar.';
    return;
  }

  const allCorrect = correctCount === rows.length;
  feedbackDiv.style.display = 'block';
  feedbackDiv.style.background = allCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
  feedbackDiv.style.border = allCorrect ? '1px solid #10b981' : '1px solid #ef4444';
  feedbackDiv.style.color = 'var(--text-primary)';

  const headerMsg = allCorrect
    ? `<h5 style="margin:0 0 8px 0; color:#10b981;"><i class="fa-solid fa-circle-check"></i> ¡Espectacular! Todos los tríos de pareos son correctos (${correctCount}/${rows.length})</h5>`
    : `<h5 style="margin:0 0 8px 0; color:#ef4444;"><i class="fa-solid fa-circle-xmark"></i> Has acertado ${correctCount} de ${rows.length} asociaciones</h5>`;

  const detailsHtml = details.map(d => `
    <div style="margin: 6px 0; padding: 6px 10px; background: var(--bg-primary); border-radius: 4px; font-size: 13px;">
      <strong>Ítem ${d.num}:</strong> ${d.isMatch ? `<span style="color:#10b981;">✓ Correcto (${d.userLet}, ${d.userRom})</span>` : `<span style="color:#ef4444;">✗ Tu elección (${d.userLet || '-' }, ${d.userRom || '-' }) | Correcta: (${d.correctLetter}, ${d.correctRoman})</span>`}
      ${d.fb ? `<div style="margin-top:4px; color:var(--text-muted);">${d.fb}</div>` : ''}
    </div>
  `).join('');

  feedbackDiv.innerHTML = headerMsg + detailsHtml;

  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise([feedbackDiv]);
  }
};

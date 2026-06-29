// Lógica de Autenticación, Dashboard y Editor WYSIWYG para el Admin Panel

document.addEventListener("DOMContentLoaded", () => {
  checkSession();
  initDashboardNavigation();
  initWysiwygEditor();
  initPostFormSubmit();
  initAvailabilityFormSubmit();
  initCronSimulationButton();
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

        availabilityList.push({
          dayOfWeek,
          isActive,
          startTime,
          endTime,
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
          console.log("%c[SIMULACIÓN CORREO - RECORDATORIO (10 MIN)]", "background: #f59e0b; color: black; padding: 3px 6px; border-radius: 3px; font-weight: bold;");
          console.log(`Para: ${b.email}\nAsunto: Recordatorio: Tu consulta comienza en 10 minutos 🚀\nDetalles: Estudiante: ${b.name}, Asignatura: ${b.subject}, Hora: ${b.time} hrs`);
          
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

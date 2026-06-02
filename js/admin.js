// Lógica de Autenticación, Dashboard y Editor WYSIWYG para el Admin Panel

document.addEventListener("DOMContentLoaded", () => {
  checkSession();
  initDashboardNavigation();
  initWysiwygEditor();
  initPostFormSubmit();
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

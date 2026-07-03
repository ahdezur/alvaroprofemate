document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  let COURSE_ID = urlParams.get("courseId");
  if (!COURSE_ID) {
    const path = window.location.pathname;
    if (path.includes("/curso/")) {
      const segments = path.split("/");
      COURSE_ID = segments[segments.length - 1] || segments[segments.length - 2];
    } else {
      COURSE_ID = "calculo-multivariable";
    }
  }
  let activeChapterIndex = null;
  let courseStructure = null;

  /* ==========================================================================
     A. GESTIÓN DEL TEMA (LIGHT / DARK MODE)
     ========================================================================== */
  function initTheme() {
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    const htmlElement = document.documentElement;

    const currentTheme = localStorage.getItem("theme") || 
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    
    htmlElement.setAttribute("data-theme", currentTheme);
    updateThemeIcon(themeToggleBtn, currentTheme);

    themeToggleBtn.addEventListener("click", () => {
      const activeTheme = htmlElement.getAttribute("data-theme");
      const newTheme = activeTheme === "light" ? "dark" : "light";
      
      htmlElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      updateThemeIcon(themeToggleBtn, newTheme);
    });
  }

  function updateThemeIcon(btn, theme) {
    if (!btn) return;
    if (theme === "dark") {
      btn.innerHTML = `
        <svg class="moon-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    } else {
      btn.innerHTML = `
        <svg class="sun-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
        </svg>
      `;
    }
  }

  /* ==========================================================================
     B. GESTIÓN DEL SIDEBAR (COLLAPSE / SHOW)
     ========================================================================== */
  function initSidebarCollapse() {
    const sidebarCollapseBtn = document.getElementById("sidebar-collapse-btn");
    const sidebarShowBtn = document.getElementById("sidebar-show-btn");
    const shellContainer = document.querySelector(".shell-container");

    if (sidebarCollapseBtn && sidebarShowBtn && shellContainer) {
      sidebarCollapseBtn.addEventListener("click", () => {
        shellContainer.classList.add("sidebar-collapsed");
      });

      sidebarShowBtn.addEventListener("click", () => {
        shellContainer.classList.remove("sidebar-collapsed");
      });
    }

    // Estilos de sacudida (shake) para elementos bloqueados
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-4px); }
        40%, 80% { transform: translateX(4px); }
      }
    `;
    document.head.appendChild(styleSheet);
  }

  /* ==========================================================================
     C. CARGA DINÁMICA DE ESTRUCTURA Y NAVEGACIÓN
     ========================================================================== */
  async function loadCourseContent() {
    initTheme();
    initSidebarCollapse();

    const menuContainer = document.getElementById("sidebar-menu-container");
    if (!menuContainer) return;

    try {
      // 1. Obtener la estructura jerárquica del curso
      const data = await DB.getCourseStructure(COURSE_ID);
      if (data.error) {
        menuContainer.innerHTML = `<p style="color: #ef4444; padding: 20px; font-size: 13px;">${data.error}</p>`;
        return;
      }

      courseStructure = data;
      if (data.course) {
        document.title = `${data.course.title} - Plataforma RAM`;
        const brandTitle = document.querySelector(".brand-title");
        if (brandTitle) {
          brandTitle.textContent = data.course.title;
        }
      }
      renderSidebar(data);
      calculateProgress(data);

      // 2. Determinar qué capítulo cargar por defecto (desde parámetro URL "?chapter=1.1" o el primero disponible)
      const urlParams = new URLSearchParams(window.location.search);
      let defaultChapter = urlParams.get("chapter");

      if (!defaultChapter) {
        // Encontrar el primer capítulo no bloqueado
        for (const unit of data.units) {
          if (!unit.isLocked) {
            const firstChap = unit.chapters.find(ch => !ch.isLocked);
            if (firstChap) {
              defaultChapter = firstChap.chapterIndex;
              break;
            }
          }
        }
      }

      // Fallback absoluto al primer capítulo si no se encontró ninguno
      if (!defaultChapter && data.units.length > 0 && data.units[0].chapters.length > 0) {
        defaultChapter = data.units[0].chapters[0].chapterIndex;
      }

      if (defaultChapter) {
        loadChapter(defaultChapter);
      }

    } catch (err) {
      console.error("Error al cargar el curso:", err);
      menuContainer.innerHTML = `<p style="color: #ef4444; padding: 20px; font-size: 13px;">Error de red al cargar el curso.</p>`;
    }
  }

  function renderSidebar(data) {
    const menuContainer = document.getElementById("sidebar-menu-container");
    if (!menuContainer) return;

    menuContainer.innerHTML = "";

    data.units.forEach((unit, i) => {
      const accordion = document.createElement("div");
      
      // La primera unidad no bloqueada se expande por defecto
      const isFirstActive = i === 0 && !unit.isLocked;
      accordion.className = `unit-accordion ${unit.isLocked ? 'unit-locked' : ''} ${isFirstActive ? 'active-unit expanded' : ''}`;
      accordion.id = `unit-${unit.id}`;

      accordion.innerHTML = `
        <button class="unit-header-btn" aria-expanded="${isFirstActive}" aria-controls="chapter-list-${unit.id}">
          <div class="unit-info">
            <span class="unit-tag">Unidad ${unit.unitIndex}</span>
            <span class="unit-title">${escapeHtml(unit.title)}</span>
          </div>
          <div class="unit-icon-wrapper">
            ${unit.isLocked ? `
              <svg class="lock-unit-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); margin-right: 4px;">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            ` : ''}
            <svg class="chevron-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </button>
        <div class="chapter-list-wrapper" id="chapter-list-${unit.id}">
          <div class="chapter-list"></div>
        </div>
      `;

      const chapterListContainer = accordion.querySelector(".chapter-list");

      unit.chapters.forEach(ch => {
        const item = document.createElement("a");
        item.href = "#";
        item.className = `chapter-item ${ch.isCompleted ? 'completed' : ''} ${ch.isLocked ? 'locked' : ''}`;
        item.setAttribute("data-chapter", ch.chapterIndex);

        let iconMarkup = "";
        if (ch.isCompleted) {
          iconMarkup = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `;
        } else if (ch.isLocked) {
          iconMarkup = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          `;
        } else {
          iconMarkup = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          `;
        }

        item.innerHTML = `
          <span class="status-badge ${ch.isCompleted ? 'completed-badge' : ''}" title="${ch.isCompleted ? 'Completado' : ch.isLocked ? 'Bloqueado' : 'Pendiente'}">
            ${iconMarkup}
          </span>
          <span class="chapter-title">Cap ${ch.chapterIndex}: ${escapeHtml(ch.title)}</span>
        `;

        // Click handler para capítulos
        item.onclick = (e) => {
          e.preventDefault();
          if (ch.isLocked) {
            triggerShake(accordion);
            return;
          }
          loadChapter(ch.chapterIndex);
        };

        chapterListContainer.appendChild(item);
      });

      // Click handler de acordeón
      accordion.querySelector(".unit-header-btn").onclick = (e) => {
        e.preventDefault();
        if (unit.isLocked) {
          triggerShake(accordion);
          return;
        }

        const isExpanded = accordion.classList.contains("expanded");

        // Cerrar otros acordeones
        document.querySelectorAll(".unit-accordion").forEach(other => {
          if (other !== accordion && !other.classList.contains("unit-locked")) {
            other.classList.remove("expanded");
            const btn = other.querySelector(".unit-header-btn");
            if (btn) btn.setAttribute("aria-expanded", "false");
          }
        });

        // Alternar el actual
        if (isExpanded) {
          accordion.classList.remove("expanded");
          accordion.querySelector(".unit-header-btn").setAttribute("aria-expanded", "false");
        } else {
          accordion.classList.add("expanded");
          accordion.querySelector(".unit-header-btn").setAttribute("aria-expanded", "true");
        }
      };

      menuContainer.appendChild(accordion);
    });
  }

  function triggerShake(element) {
    element.style.animation = "none";
    element.offsetHeight; // trigger reflow
    element.style.animation = "shake 0.4s ease-out";
  }

  function calculateProgress(data) {
    let total = 0;
    let completed = 0;

    data.units.forEach(u => {
      u.chapters.forEach(ch => {
        total++;
        if (ch.isCompleted) completed++;
      });
    });

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const progressFill = document.getElementById("progress-bar-fill");
    const progressPercentText = document.getElementById("progress-percentage");

    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressPercentText) progressPercentText.textContent = `${percent}%`;
  }

  /* ==========================================================================
     D. CARGA DINÁMICA DE CAPÍTULO Y COMPORTAMIENTO RAM
     ========================================================================== */
  async function loadChapter(chapterIndex) {
    activeChapterIndex = chapterIndex;

    // Actualizar enlaces activos en el sidebar
    document.querySelectorAll(".chapter-item").forEach(item => {
      if (item.getAttribute("data-chapter") === chapterIndex) {
        item.classList.add("active");
        
        // Asegurar que su acordeón padre esté expandido
        const parentUnit = item.closest(".unit-accordion");
        if (parentUnit && !parentUnit.classList.contains("expanded")) {
          parentUnit.classList.add("expanded");
          const headerBtn = parentUnit.querySelector(".unit-header-btn");
          if (headerBtn) headerBtn.setAttribute("aria-expanded", "true");
        }
      } else {
        item.classList.remove("active");
      }
    });

    const dynamicContainer = document.getElementById("contenido-dinamico");
    if (!dynamicContainer) return;

    dynamicContainer.innerHTML = `
      <div style="text-align: center; padding: 50px 0; color: var(--text-muted);">
        <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 30px; margin-bottom: 15px; color: var(--accent-color);"></i>
        <p>Cargando capítulo ${chapterIndex}...</p>
      </div>
    `;

    try {
      const ch = await DB.getChapterContent(COURSE_ID, chapterIndex);
      if (ch.error) {
        dynamicContainer.innerHTML = `<p style="color: #ef4444; padding: 30px;">Error: ${ch.error}</p>`;
        return;
      }

      // Buscar el título de la unidad en la estructura
      let unitTitle = "Curso";
      if (courseStructure) {
        const matchingUnit = courseStructure.units.find(u => u.chapters.some(chap => chap.chapterIndex === chapterIndex));
        if (matchingUnit) {
          unitTitle = `Unidad ${matchingUnit.unitIndex}`;
        }
      }

      // Actualizar breadcrumbs
      const breadcrumbs = document.getElementById("course-breadcrumbs");
      if (breadcrumbs) {
        breadcrumbs.innerHTML = `
          <span>${unitTitle}</span>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-active">Cap ${ch.chapterIndex}: ${escapeHtml(ch.title)}</span>
        `;
      }

      // Inyectar el cuerpo y las secciones del capítulo con el modelo RAM
      dynamicContainer.innerHTML = `
        <h1>${escapeHtml(ch.title)}</h1>

        <!-- Pestañas de Enfoque RAM (Sticky Selector) -->
        <nav class="ram-tabs" aria-label="Selector de Enfoque RAM">
          <button class="ram-tab-btn active" data-tab="motivacion">
            <span class="tab-icon">💡</span>
            <span class="tab-label">Motivación</span>
          </button>
          <button class="ram-tab-btn" data-tab="teoria">
            <span class="tab-icon">📐</span>
            <span class="tab-label">Definiciones y Teoría</span>
          </button>
          <button class="ram-tab-btn" data-tab="aplicacion">
            <span class="tab-icon">🚀</span>
            <span class="tab-label">Aplicación y Práctica</span>
          </button>
          <button class="ram-tab-btn" data-tab="ejercicios">
            <span class="tab-icon">📝</span>
            <span class="tab-label">Ejercicios resueltos y propuestos</span>
          </button>
        </nav>

        <!-- Sección 1: Motivación (Activa por defecto) -->
        <div id="ram-motivacion" class="ram-section active-section">
          ${ch.contentMotivation || '<p style="color: var(--text-muted);">Sin contenido cargado.</p>'}
        </div>

        <!-- Sección 2: Definiciones y Teoría -->
        <div id="ram-teoria" class="ram-section">
          ${ch.contentTheory || '<p style="color: var(--text-muted);">Sin contenido cargado.</p>'}
        </div>

        <!-- Sección 3: Aplicación y Práctica -->
        <div id="ram-aplicacion" class="ram-section">
          ${ch.contentApplication || '<p style="color: var(--text-muted);">Sin contenido cargado.</p>'}
        </div>

        <!-- Sección 4: Ejercicios -->
        <div id="ram-ejercicios" class="ram-section">
          <section id="practica-y-evaluacion">
            <div class="exercises-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 2px solid var(--border-color); padding-bottom: 12px; flex-wrap: wrap; gap: 12px;">
              <h2 style="margin: 0; border: none; padding: 0;">Ejercicios</h2>
              <button class="btn-pista" id="split-btn-ejercicios" style="font-family: var(--font-display); font-weight: 700;">
                <span>📊</span> <span>Dividir Pantalla</span>
              </button>
            </div>

            <div class="split-container" id="split-container-ejercicios">
              <!-- Columna Izquierda: Ejercicios -->
              <div class="exercise-pane">
                ${formatExercisesContent(ch.contentExercises)}
              </div>

              <!-- Columna Derecha: Fórmulas de Apoyo -->
              <div class="formula-pane">
                ${formatFormulasContent(ch.contentFormulas)}
              </div>
            </div>
          </section>
        </div>
      `;

      // Enlazar los eventos interactivos
      bindInteractiveCourseElements();

      // Renderizar MathJax sobre todo el contenedor inyectado
      if (window.MathJax && window.MathJax.typesetPromise) {
        MathJax.typesetPromise([dynamicContainer]);
      }

    } catch (err) {
      console.error("Error al cargar capítulo:", err);
      dynamicContainer.innerHTML = `<p style="color: #ef4444; padding: 30px;">Error de conexión al cargar el capítulo.</p>`;
    }
  }

  /* ==========================================================================
     E. EVENTOS DE COMPONENTES INTERACTIVOS
     ========================================================================== */
  function bindInteractiveCourseElements() {
    // 1. Selector de Pestañas RAM
    const tabButtons = document.querySelectorAll(".ram-tab-btn");
    const ramSections = document.querySelectorAll(".ram-section");
    const articleViewport = document.querySelector(".content-viewport");

    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const tabId = btn.getAttribute("data-tab");

        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        ramSections.forEach(sec => sec.classList.remove("active-section"));

        let targetSectionId = "";
        if (tabId === "motivacion") targetSectionId = "ram-motivacion";
        else if (tabId === "teoria") targetSectionId = "ram-teoria";
        else if (tabId === "aplicacion") targetSectionId = "ram-aplicacion";
        else if (tabId === "ejercicios") targetSectionId = "ram-ejercicios";

        const targetSec = document.getElementById(targetSectionId);
        if (targetSec) {
          targetSec.classList.add("active-section");
          if (articleViewport) {
            articleViewport.scrollIntoView({ behavior: "smooth", block: "start" });
          }

          if (window.MathJax && window.MathJax.typesetPromise) {
            MathJax.typesetPromise([targetSec]);
          }
        }
      });
    });

    // 2. Evaluaciones Formativas (Opción Múltiple con feedback)
    const evaluacionContainers = document.querySelectorAll(".evaluacion-formativa");
    evaluacionContainers.forEach(container => {
      const options = container.querySelectorAll(".opcion-btn");
      const feedbackBox = container.querySelector(".feedback-contenedor");
      const feedbackIcon = container.querySelector(".feedback-icon");
      const feedbackText = container.querySelector(".feedback-texto");

      options.forEach(btn => {
        btn.onclick = () => {
          options.forEach(b => b.classList.remove("selected", "correct-choice", "incorrect-choice"));
          btn.classList.add("selected");

          const isCorrect = btn.getAttribute("data-correct") === "true";
          const explanation = btn.getAttribute("data-explicacion") || "";

          feedbackBox.classList.remove("hidden", "correcto", "incorrecto");

          if (isCorrect) {
            btn.classList.add("correct-choice");
            feedbackBox.classList.add("correcto");
            feedbackIcon.innerHTML = `
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            `;
            feedbackText.innerHTML = `<strong>¡Excelente trabajo!</strong> ${explanation}`;
          } else {
            btn.classList.add("incorrect-choice");
            feedbackBox.classList.add("incorrecto");
            feedbackIcon.innerHTML = `
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            `;
            feedbackText.innerHTML = `<strong>Analicemos el concepto:</strong> ${explanation}`;
          }

          if (window.MathJax && window.MathJax.typesetPromise) {
            MathJax.typesetPromise([feedbackText]);
          }
        };
      });
    });

    // 3. Indicaciones / Pauta paso a paso de Ejercicios
    const exerciseBoxes = document.querySelectorAll(".ejercicio-propuesto");
    exerciseBoxes.forEach(box => {
      const btnPista = box.querySelector(".btn-pista");
      const pistaContenido = box.querySelector(".pista-contenido");

      if (btnPista && pistaContenido) {
        btnPista.onclick = () => {
          const isHidden = pistaContenido.classList.contains("hidden");
          if (isHidden) {
            pistaContenido.classList.remove("hidden");
            btnPista.setAttribute("aria-expanded", "true");
            btnPista.innerHTML = `<span>🙈</span> Ocultar Indicación / Pauta`;

            if (window.MathJax && window.MathJax.typesetPromise) {
              MathJax.typesetPromise([pistaContenido]);
            }
          } else {
            pistaContenido.classList.add("hidden");
            btnPista.setAttribute("aria-expanded", "false");
            btnPista.innerHTML = `<span>💡</span> Ver Indicación / Pauta`;
          }
        };
      }
    });

    // 4. Botón de Pantalla Dividida (Fórmulas de Apoyo)
    const splitBtn = document.getElementById("split-btn-ejercicios");
    const splitContainer = document.getElementById("split-container-ejercicios");

    if (splitBtn && splitContainer) {
      splitBtn.onclick = () => {
        const isActive = splitContainer.classList.toggle("split-active");
        const btnTextSpan = splitBtn.querySelector("span:last-child");

        const viewport = document.querySelector(".content-viewport");
        if (viewport) {
          viewport.classList.toggle("viewport-wide", isActive);
        }

        if (isActive) {
          splitBtn.style.backgroundColor = "var(--accent-color)";
          splitBtn.style.color = "#ffffff";
          if (btnTextSpan) btnTextSpan.textContent = "Ocultar Fórmulas";

          const formulaPane = splitContainer.querySelector(".formula-pane");
          if (formulaPane && window.MathJax && window.MathJax.typesetPromise) {
            MathJax.typesetPromise([formulaPane]);
          }
        } else {
          splitBtn.style.backgroundColor = "";
          splitBtn.style.color = "";
          if (btnTextSpan) btnTextSpan.textContent = "Dividir Pantalla";
        }
      };
    }
  }

  function formatExercisesContent(raw) {
    if (!raw) return '<p style="color: var(--text-muted);">Sin ejercicios cargados.</p>';
    try {
      const trimmed = raw.trim();
      if (trimmed.startsWith("[")) {
        const items = JSON.parse(trimmed);
        if (items.length === 0) return '<p style="color: var(--text-muted);">Sin ejercicios cargados.</p>';
        return items.map((item, index) => {
          let badgeHtml = '';
          if (item.level === 'resuelto') {
            badgeHtml = `<span class="badge-nivel" style="background-color: var(--accent-bg); color: var(--accent-color); font-weight: bold;">Ejercicio Resuelto</span>`;
          } else {
            let levelClass = 'nivel-1';
            let levelLabel = 'Nivel 1: Mecánico';
            if (item.level === 'nivel-2') {
              levelClass = 'nivel-2';
              levelLabel = 'Nivel 2: Analítico';
            } else if (item.level === 'nivel-3') {
              levelClass = 'nivel-3';
              levelLabel = 'Nivel 3: Ingeniería';
            }
            badgeHtml = `<span class="badge-nivel ${levelClass}">${levelLabel}</span>`;
          }
          return `
            <div class="ejercicio-propuesto" data-ejercicio-id="ex-${index}">
              <div class="ejercicio-header">
                <h4 class="ejercicio-titulo-prop">${index + 1}. ${escapeHtml(item.title)}</h4>
                ${badgeHtml}
              </div>
              <p class="ejercicio-enunciado">
                ${item.statement}
              </p>
              <button class="btn-pista" aria-expanded="false">
                <span>💡</span> Ver Indicación / Pauta
              </button>
              <div class="pista-contenido hidden">
                ${item.solution}
              </div>
            </div>
          `;
        }).join('');
      }
    } catch (e) {
      console.warn("No se pudo parsear el contenido de ejercicios como JSON estructurado, inyectando como HTML legacy", e);
    }
    return raw;
  }

  function formatFormulasContent(raw) {
    if (!raw) return '<p style="color: var(--text-muted);">Sin fórmulas cargadas.</p>';
    try {
      const trimmed = raw.trim();
      if (trimmed.startsWith("[")) {
        const items = JSON.parse(trimmed);
        if (items.length === 0) return '<p style="color: var(--text-muted);">Sin fórmulas cargadas.</p>';
        const cards = items.map(item => `
          <div class="formula-card">
            <h4>${escapeHtml(item.title)}</h4>
            <div class="formula-card-latex">
              \\(${item.latex}\\)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 5px 0 0 0;">
              ${item.description}
            </p>
          </div>
        `).join('');
        return `
          <h3 style="margin: 0 0 12px 0; color: var(--accent-color); font-size: 1.15rem; font-weight: 700; font-family: var(--font-display);">
            📐 Fórmulas de Apoyo
          </h3>
          ${cards}
        `;
      }
    } catch (e) {
      console.warn("No se pudo parsear el contenido de fórmulas como JSON estructurado, inyectando como HTML legacy", e);
    }
    return raw;
  }

  // Helper de Escape HTML básico
  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Inicializar carga de datos
  loadCourseContent();
});

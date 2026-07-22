function initCoursePage() {
  const urlParams = new URLSearchParams(window.location.search);
  let COURSE_ID = urlParams.get("courseId");
  if (!COURSE_ID) {
    const path = window.location.pathname;
    if (path.includes("/curso/")) {
      const parts = path.split("/").filter(Boolean);
      const cursoIdx = parts.indexOf("curso");
      if (cursoIdx !== -1 && parts[cursoIdx + 1]) {
        COURSE_ID = parts[cursoIdx + 1];
      } else {
        COURSE_ID = parts[parts.length - 1];
      }
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

  /* Control de Tamaño de Texto (Agrandar / Achicar) */
  function initTextResizer() {
    const btnIncrease = document.getElementById("text-increase-btn");
    const btnDecrease = document.getElementById("text-decrease-btn");
    if (!btnIncrease || !btnDecrease) return;

    let currentScale = parseInt(localStorage.getItem("alvaro_profemate_text_scale")) || 100;
    const minScale = 80;
    const maxScale = 150;
    const step = 10;

    function applyScale() {
      document.documentElement.style.fontSize = `${currentScale}%`;
      localStorage.setItem("alvaro_profemate_text_scale", currentScale);
    }

    // Aplicar escala guardada inmediatamente
    applyScale();

    btnIncrease.onclick = () => {
      if (currentScale < maxScale) {
        currentScale += step;
        applyScale();
      }
    };

    btnDecrease.onclick = () => {
      if (currentScale > minScale) {
        currentScale -= step;
        applyScale();
      }
    };
  }

  /* ==========================================================================
     C. CARGA DINÁMICA DE ESTRUCTURA Y NAVEGACIÓN
     ========================================================================== */
  async function loadCourseContent() {
    initTheme();
    initSidebarCollapse();
    initTextResizer();

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

    // 5. Inicialización de la animación de división de polinomios
    const divPlayBtn = document.getElementById("div-play-btn");
    if (divPlayBtn) {
      initDivisionPlayer();
    }

    // 6. Inicialización de la animación de la Regla de Ruffini
    const rufPlayBtn = document.getElementById("ruf-play-btn");
    if (rufPlayBtn) {
      initRuffiniPlayer();
    }

    // 7. Inicialización del visualizador de sucesiones (Cap 3.1)
    const plotterSvg = document.getElementById("plotter-svg");
    if (plotterSvg) {
      initSequencePlotter();
    }

    // 8. Inicialización del juego de épsilon-N (Cap 3.2)
    const gameSvg = document.getElementById("game-svg");
    if (gameSvg) {
      initEpsilonNGame();
    }
  }

  function initCustomSelect() {
    const wrapper = document.querySelector('.custom-select-wrapper');
    if (!wrapper || wrapper.dataset.initialized === "true") return;
    wrapper.dataset.initialized = "true";
    
    const trigger = wrapper.querySelector('.custom-select-trigger');
    const container = wrapper.querySelector('.custom-options-container');
    const options = wrapper.querySelectorAll('.custom-option');
    const realSelect = document.getElementById('plotter-preset');
    
    if (!trigger || !container || !realSelect) return;
    
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      container.style.display = container.style.display === 'block' ? 'none' : 'block';
    });
    
    document.addEventListener('click', () => {
      container.style.display = 'none';
    });
    
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        const val = opt.getAttribute('data-value');
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        trigger.querySelector('.custom-select-value').innerHTML = opt.innerHTML;
        container.style.display = 'none';
        
        realSelect.value = val;
        realSelect.dispatchEvent(new Event('change'));
      });
    });
  }

  function initSequencePlotter() {
    initCustomSelect();
    
    const wrapper = document.querySelector('.custom-select-wrapper');
    const realSelect = document.getElementById('plotter-preset');
    if (wrapper && realSelect) {
      const activeOption = wrapper.querySelector(`.custom-option[data-value="${realSelect.value}"]`);
      if (activeOption) {
        wrapper.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
        activeOption.classList.add('selected');
        wrapper.querySelector('.custom-select-value').innerHTML = activeOption.innerHTML;
      }
    }

    const presetSelect = realSelect;
    const epsSlider = document.getElementById("plotter-eps");
    const epsValText = document.getElementById("eps-val");
    const nSlider = document.getElementById("plotter-n");
    const nValText = document.getElementById("n-val");
    const svg = document.getElementById("plotter-svg");
    const gridGroup = document.getElementById("plot-grid");
    const dotsGroup = document.getElementById("plot-dots");
    const epsRect = document.getElementById("eps-rect");
    const epsUpperLine = document.getElementById("eps-upper-line");
    const epsLowerLine = document.getElementById("eps-lower-line");
    const limitLine = document.getElementById("limit-line");
    const readout = document.getElementById("plotter-readout");

    if (!presetSelect || !epsSlider || !nSlider || !svg) return;

    const presets = {
      '1/n': {
        formula: (n) => 1 / n,
        limit: 0,
        convergent: true,
        ymin: -0.2,
        ymax: 1.2,
        yTicks: [0, 0.5, 1],
        calcN0: (eps) => Math.floor(1 / eps) + 1
      },
      'n/n+1': {
        formula: (n) => n / (n + 1),
        limit: 1,
        convergent: true,
        ymin: 0.3,
        ymax: 1.2,
        yTicks: [0.5, 0.75, 1],
        calcN0: (eps) => Math.max(1, Math.floor((1 - eps) / eps) + 1)
      },
      'alt': {
        formula: (n) => (n % 2 === 0 ? 1 : -1) / n,
        limit: 0,
        convergent: true,
        ymin: -1.2,
        ymax: 1.2,
        yTicks: [-1, -0.5, 0, 0.5, 1],
        calcN0: (eps) => Math.floor(1 / eps) + 1
      },
      'osc': {
        formula: (n) => (n % 2 === 0 ? 1 : -1),
        limit: 0,
        convergent: false,
        ymin: -1.5,
        ymax: 1.5,
        yTicks: [-1, 0, 1],
        calcN0: () => null
      },
      'div': {
        formula: (n) => n / 15,
        limit: Infinity,
        convergent: false,
        ymin: -0.2,
        ymax: 3.0,
        yTicks: [0, 1, 2],
        calcN0: () => null
      }
    };

    function updatePlot() {
      const presetKey = presetSelect.value;
      const eps = parseFloat(epsSlider.value);
      const N = parseInt(nSlider.value);
      const seq = presets[presetKey];

      epsValText.textContent = eps.toFixed(2);
      nValText.textContent = N;

      const items = document.querySelectorAll('.challenge-item');
      items.forEach(item => {
        if (item.getAttribute('data-seq') === presetKey) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });

      const svgW = svg.clientWidth || 360;
      const svgH = 180;
      const marginL = 40;
      const marginR = 15;
      const marginT = 15;
      const marginB = 25;
      const plotW = svgW - marginL - marginR;
      const plotH = svgH - marginT - marginB;

      function getX(n) {
        return marginL + (n - 1) * (plotW / (N - 1));
      }

      function getY(val) {
        return marginT + plotH * (seq.ymax - val) / (seq.ymax - seq.ymin);
      }

      gridGroup.innerHTML = "";
      seq.yTicks.forEach(tickVal => {
        const yPos = getY(tickVal);
        if (yPos >= marginT && yPos <= marginT + plotH) {
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", marginL);
          line.setAttribute("y1", yPos);
          line.setAttribute("x2", svgW - marginR);
          line.setAttribute("y2", yPos);
          line.setAttribute("stroke", "var(--border-color)");
          line.setAttribute("stroke-width", "1");
          if (tickVal !== 0) line.setAttribute("stroke-dasharray", "2,2");
          gridGroup.appendChild(line);

          const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
          text.setAttribute("x", marginL - 8);
          text.setAttribute("y", yPos + 4);
          text.setAttribute("fill", "var(--text-muted)");
          text.setAttribute("font-size", "10");
          text.setAttribute("text-anchor", "end");
          text.setAttribute("font-family", "monospace");
          text.textContent = tickVal;
          gridGroup.appendChild(text);
        }
      });

      const xTicksCount = 5;
      const step = Math.ceil(N / xTicksCount);
      for (let i = 1; i <= N; i += step) {
        const xPos = getX(i);
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", xPos);
        text.setAttribute("y", svgH - 8);
        text.setAttribute("fill", "var(--text-muted)");
        text.setAttribute("font-size", "10");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("font-family", "monospace");
        text.textContent = i;
        gridGroup.appendChild(text);
      }

      if (seq.convergent) {
        const limitY = getY(seq.limit);
        const upperY = getY(seq.limit + eps);
        const lowerY = getY(seq.limit - eps);

        epsRect.style.display = "block";
        epsRect.setAttribute("x", marginL);
        epsRect.setAttribute("y", Math.max(marginT, upperY));
        epsRect.setAttribute("width", plotW);
        epsRect.setAttribute("height", Math.min(plotH, lowerY - upperY));

        epsUpperLine.style.display = "block";
        epsUpperLine.setAttribute("x1", marginL);
        epsUpperLine.setAttribute("y1", upperY);
        epsUpperLine.setAttribute("x2", svgW - marginR);
        epsUpperLine.setAttribute("y2", upperY);

        epsLowerLine.style.display = "block";
        epsLowerLine.setAttribute("x1", marginL);
        epsLowerLine.setAttribute("y1", lowerY);
        epsLowerLine.setAttribute("x2", svgW - marginR);
        epsLowerLine.setAttribute("y2", lowerY);

        limitLine.style.display = "block";
        limitLine.setAttribute("x1", marginL);
        limitLine.setAttribute("y1", limitY);
        limitLine.setAttribute("x2", svgW - marginR);
        limitLine.setAttribute("y2", limitY);
      } else {
        epsRect.style.display = "none";
        epsUpperLine.style.display = "none";
        epsLowerLine.style.display = "none";
        limitLine.style.display = "none";
      }

      dotsGroup.innerHTML = "";
      for (let n = 1; n <= N; n++) {
        const val = seq.formula(n);
        const cx = getX(n);
        const cy = getY(val);
        const isInside = seq.convergent ? Math.abs(val - seq.limit) < eps : false;

        if (cy >= marginT && cy <= marginT + plotH) {
          const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          circle.setAttribute("cx", cx);
          circle.setAttribute("cy", cy);
          circle.setAttribute("r", "4");
          
          if (seq.convergent) {
            circle.setAttribute("fill", isInside ? "var(--accent-color)" : "#94a3b8");
            if (isInside) {
              circle.setAttribute("stroke", "rgba(99, 102, 241, 0.4)");
              circle.setAttribute("stroke-width", "3");
            }
          } else {
            circle.setAttribute("fill", "var(--text-muted)");
          }
          dotsGroup.appendChild(circle);
        }
      }

      let n0 = seq.convergent ? seq.calcN0(eps) : null;
      if (seq.convergent) {
        const limVal = seq.limit;
        const bandMin = (limVal - eps).toFixed(2);
        const bandMax = (limVal + eps).toFixed(2);
        
        let info = `Límite <span class="highlight">L = ${limVal}</span>. error <span class="highlight">ε = ${eps.toFixed(2)}</span>.<br>`;
        info += `Banda de error: (${bandMin}, ${bandMax}).<br>`;
        
        if (n0 <= N) {
          info += `Umbral límite <span class="highlight" style="color: #10b981;">N₀ = ${n0}</span>. Para todo n ≥ ${n0}, aₙ está dentro de la banda.`;
        } else {
          info += `Umbral límite <span class="highlight" style="color: #ef4444;">N₀ = ${n0}</span> (fuera del gráfico visible N=${N}).`;
        }
        readout.innerHTML = info;
      } else {
        if (presetKey === 'osc') {
          readout.innerHTML = `Sucesión <span class="highlight">aₙ = (-1)ⁿ</span>.<br>Valores alternan entre -1 y 1.`;
        } else {
          readout.innerHTML = `Sucesión <span class="highlight">aₙ = n/15</span>.<br>Valores escapan al infinito: aₙ → +∞.`;
        }
      }
    }

    presetSelect.addEventListener("change", updatePlot);
    epsSlider.addEventListener("input", updatePlot);
    nSlider.addEventListener("input", updatePlot);
    
    updatePlot();

    // Vinculación de selección de opciones de reto
    const challengeItems = document.querySelectorAll(".challenge-item");
    challengeItems.forEach(item => {
      const buttons = item.querySelectorAll(".btn-choice");
      buttons.forEach(btn => {
        btn.onclick = () => {
          const val = btn.getAttribute("data-val");
          buttons.forEach(b => {
            b.classList.remove("selected", "conv", "div", "osc");
          });
          btn.classList.add("selected", val);
          item.classList.remove("correct", "incorrect");
          const feedback = item.querySelector(".challenge-feedback");
          if (feedback) {
            feedback.style.display = "none";
            feedback.innerHTML = "";
          }
        };
      });
    });

    // Vinculación del botón de verificar
    const verifyBtn = document.getElementById("btn-verify-challenge");
    if (verifyBtn) {
      verifyBtn.onclick = () => {
        const activeItem = Array.from(document.querySelectorAll(".challenge-item")).find(item => item.style.display !== "none");
        if (!activeItem) return;
        
        const selectedBtn = activeItem.querySelector(".btn-choice.selected");
        if (!selectedBtn) {
          alert("Por favor, selecciona una clasificación para la sucesión antes de verificar.");
          return;
        }
        
        const seq = activeItem.getAttribute("data-seq");
        const correctAnswer = activeItem.getAttribute("data-answer");
        const selectedVal = selectedBtn.getAttribute("data-val");
        const feedback = activeItem.querySelector(".challenge-feedback");
        
        const explanations = {
          '1/n': {
            conv: '¡Correcto! A medida que $n \\to \\infty$, los términos se acercan cada vez más a $0$. Se estabiliza en $L = 0$, por lo que es una sucesión <strong>Convergente</strong>.',
            incorrect: 'Inténtalo de nuevo. Si aumentas $n$ en el visualizador, verás que $1/n$ decrece continuamente hacia $0$. Se estabiliza en el valor real finito $L = 0$, lo que la hace <strong>Convergente</strong>.'
          },
          'n/n+1': {
            conv: '¡Excelente! Al avanzar el índice $n$, la fracción se aproxima a $1$ (los términos son $1/2, 2/3, 3/4, \\dots$). Se estabiliza en $L = 1$, por lo que es <strong>Convergente</strong>.',
            incorrect: 'Incorrecto. Mira el visualizador: a medida que $n$ crece, los valores se acercan cada vez más a la línea verde en $y = 1$. Se estabiliza en el valor real finito $L=1$, por tanto es <strong>Convergente</strong>.'
          },
          'alt': {
            conv: '¡Muy bien! Los términos rebotan alternadamente entre positivos y negativos, pero su amplitud se reduce rápidamente. Se acercan infinitamente a $0$. Al estabilizarse en $L = 0$, es una sucesión <strong>Convergente</strong>.',
            incorrect: 'Incorrecto. Aunque tiene un factor alternante $(-1)^n$ que la hace rebotar entre positivo y negativo, los términos son cada vez más pequeños en valor absoluto y se aproximan a $0$. Por lo tanto, se estabiliza en $L = 0$, es decir, es <strong>Convergente</strong>.'
          },
          'osc': {
            osc: '¡Exacto! Los términos oscilan alternadamente entre $-1$ y $1$. No se estabilizan en ningún valor único, pero tampoco crecen indefinidamente al infinito. Es una sucesión <strong>Oscilante</strong>.',
            incorrect: 'Incorrecto. Los términos de la sucesión son $-1, 1, -1, 1, \\dots$. Nunca se concentran alrededor de un único punto (no converge) ni escapan al infinito. Por definición, es <strong>Oscilante</strong>.'
          },
          'div': {
            div: '¡Correcto! Los términos aumentan de forma lineal y constante sin límite. A medida que $n \\to \\infty$, la sucesión crece indefinidamente hacia $+\\infty$, por lo que es <strong>Divergente</strong>.',
            incorrect: 'Incorrecto. Observa que el gráfico muestra una tendencia lineal ascendente constante. A medida que $n$ avanza, los términos superan cualquier cota superior finita y escapan a $+\\infty$. Por lo tanto, es <strong>Divergente</strong>.'
          }
        };

        activeItem.classList.remove("correct", "incorrect");
        feedback.classList.remove("correct", "incorrect");
        
        if (selectedVal === correctAnswer) {
          activeItem.classList.add("correct");
          feedback.classList.add("correct");
          feedback.innerHTML = explanations[seq][correctAnswer];
        } else {
          activeItem.classList.add("incorrect");
          feedback.classList.add("incorrect");
          feedback.innerHTML = explanations[seq].incorrect;
        }
        feedback.style.display = "block";
        
        if (window.MathJax && window.MathJax.typesetPromise) {
          window.MathJax.typesetPromise([feedback]);
        }
      };
    }
  }

  function initCustomSelectL2() {
    const wrapper = document.querySelector('.custom-select-wrapper-l2');
    if (!wrapper || wrapper.dataset.initialized === "true") return;
    wrapper.dataset.initialized = "true";
    
    const trigger = wrapper.querySelector('.custom-select-trigger-l2');
    const container = wrapper.querySelector('.custom-options-container-l2');
    const options = wrapper.querySelectorAll('.custom-option-l2');
    const realSelect = document.getElementById('game-preset');
    
    if (!trigger || !container || !realSelect) return;
    
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      container.style.display = container.style.display === 'block' ? 'none' : 'block';
    });
    
    document.addEventListener('click', () => {
      container.style.display = 'none';
    });
    
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        const val = opt.getAttribute('data-value');
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        trigger.querySelector('.custom-select-value-l2').innerHTML = opt.innerHTML;
        container.style.display = 'none';
        
        realSelect.value = val;
        realSelect.dispatchEvent(new Event('change'));
      });
    });
  }

  function initEpsilonNGame() {
    initCustomSelectL2();

    const wrapper = document.querySelector('.custom-select-wrapper-l2');
    const realSelect = document.getElementById('game-preset');
    if (wrapper && realSelect) {
      const activeOption = wrapper.querySelector(`.custom-option-l2[data-value="${realSelect.value}"]`);
      if (activeOption) {
        wrapper.querySelectorAll('.custom-option-l2').forEach(o => o.classList.remove('selected'));
        activeOption.classList.add('selected');
        wrapper.querySelector('.custom-select-value-l2').innerHTML = activeOption.innerHTML;
      }
    }

    const presetSelect = realSelect;
    const epsSlider = document.getElementById("game-eps");
    const epsValText = document.getElementById("game-eps-val");
    const nSlider = document.getElementById("game-n");
    const nValText = document.getElementById("game-n-val");
    const svg = document.getElementById("game-svg");
    const gridGroup = document.getElementById("game-grid");
    const dotsGroup = document.getElementById("game-dots");
    const epsRect = document.getElementById("game-eps-rect");
    const epsUpperLine = document.getElementById("game-eps-upper-line");
    const epsLowerLine = document.getElementById("game-eps-lower-line");
    const limitLine = document.getElementById("game-limit-line");
    const nCutoffLine = document.getElementById("game-n-cutoff-line");
    const readout = document.getElementById("game-readout");

    if (!presetSelect || !epsSlider || !nSlider || !svg) return;

    const presets = {
      '1/n': {
        formula: (n) => 1 / n,
        limit: 0,
        ymin: -0.2,
        ymax: 1.2,
        yTicks: [0, 0.5, 1],
        calcN0: (eps) => Math.floor(1 / eps) + 1
      },
      'n/n+1': {
        formula: (n) => n / (n + 1),
        limit: 1,
        ymin: 0.3,
        ymax: 1.2,
        yTicks: [0.5, 0.75, 1],
        calcN0: (eps) => Math.max(1, Math.floor((1 - eps) / eps) + 1)
      },
      'alt': {
        formula: (n) => (n % 2 === 0 ? 1 : -1) / n,
        limit: 0,
        ymin: -1.2,
        ymax: 1.2,
        yTicks: [-1, -0.5, 0, 0.5, 1],
        calcN0: (eps) => Math.floor(1 / eps) + 1
      }
    };

    function updatePlot() {
      const presetKey = presetSelect.value;
      const eps = parseFloat(epsSlider.value);
      const N = parseInt(nSlider.value);
      const seq = presets[presetKey];

      epsValText.textContent = eps.toFixed(2);
      nValText.textContent = N;

      const svgW = svg.clientWidth || 360;
      const svgH = 200;
      const marginL = 40;
      const marginR = 15;
      const marginT = 15;
      const marginB = 25;
      const plotW = svgW - marginL - marginR;
      const plotH = svgH - marginT - marginB;

      const totalTerms = 40;

      function getX(n) {
        return marginL + (n - 1) * (plotW / (totalTerms - 1));
      }

      function getY(val) {
        return marginT + plotH * (seq.ymax - val) / (seq.ymax - seq.ymin);
      }

      gridGroup.innerHTML = "";
      seq.yTicks.forEach(tickVal => {
        const yPos = getY(tickVal);
        if (yPos >= marginT && yPos <= marginT + plotH) {
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", marginL);
          line.setAttribute("y1", yPos);
          line.setAttribute("x2", svgW - marginR);
          line.setAttribute("y2", yPos);
          line.setAttribute("stroke", "var(--border-color)");
          line.setAttribute("stroke-width", "1");
          if (tickVal !== 0) line.setAttribute("stroke-dasharray", "2,2");
          gridGroup.appendChild(line);

          const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
          text.setAttribute("x", marginL - 8);
          text.setAttribute("y", yPos + 4);
          text.setAttribute("fill", "var(--text-muted)");
          text.setAttribute("font-size", "10");
          text.setAttribute("text-anchor", "end");
          text.setAttribute("font-family", "monospace");
          text.textContent = tickVal;
          gridGroup.appendChild(text);
        }
      });

      const xTicksCount = 5;
      const step = Math.ceil(totalTerms / xTicksCount);
      for (let i = 1; i <= totalTerms; i += step) {
        const xPos = getX(i);
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", xPos);
        text.setAttribute("y", svgH - 8);
        text.setAttribute("fill", "var(--text-muted)");
        text.setAttribute("font-size", "10");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("font-family", "monospace");
        text.textContent = i;
        gridGroup.appendChild(text);
      }

      const limitY = getY(seq.limit);
      const upperY = getY(seq.limit + eps);
      const lowerY = getY(seq.limit - eps);

      epsRect.setAttribute("x", marginL);
      epsRect.setAttribute("y", Math.max(marginT, upperY));
      epsRect.setAttribute("width", plotW);
      epsRect.setAttribute("height", Math.min(plotH, lowerY - upperY));

      epsUpperLine.setAttribute("x1", marginL);
      epsUpperLine.setAttribute("y1", upperY);
      epsUpperLine.setAttribute("x2", svgW - marginR);
      epsUpperLine.setAttribute("y2", upperY);

      epsLowerLine.setAttribute("x1", marginL);
      epsLowerLine.setAttribute("y1", lowerY);
      epsLowerLine.setAttribute("x2", svgW - marginR);
      epsLowerLine.setAttribute("y2", lowerY);

      limitLine.setAttribute("x1", marginL);
      limitLine.setAttribute("y1", limitY);
      limitLine.setAttribute("x2", svgW - marginR);
      limitLine.setAttribute("y2", limitY);

      // Cutoff Line N
      const cutoffX = getX(N);
      nCutoffLine.setAttribute("x1", cutoffX);
      nCutoffLine.setAttribute("y1", marginT);
      nCutoffLine.setAttribute("x2", cutoffX);
      nCutoffLine.setAttribute("y2", marginT + plotH);

      dotsGroup.innerHTML = "";
      
      let firstViolatorIdx = null;

      for (let n = 1; n <= totalTerms; n++) {
        const val = seq.formula(n);
        const cx = getX(n);
        const cy = getY(val);
        const isInside = Math.abs(val - seq.limit) < eps;

        if (cy >= marginT && cy <= marginT + plotH) {
          const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          circle.setAttribute("cx", cx);
          circle.setAttribute("cy", cy);
          circle.setAttribute("r", "5");
          
          if (n < N) {
            circle.setAttribute("fill", "#94a3b8");
            circle.setAttribute("opacity", "0.4");
          } else {
            if (isInside) {
              circle.setAttribute("fill", "#10b981"); // Green
              circle.setAttribute("stroke", "rgba(16, 185, 129, 0.3)");
              circle.setAttribute("stroke-width", "3");
            } else {
              circle.setAttribute("fill", "#ef4444"); // Red
              circle.setAttribute("stroke", "rgba(239, 68, 68, 0.3)");
              circle.setAttribute("stroke-width", "3");
              if (firstViolatorIdx === null) {
                firstViolatorIdx = n;
              }
            }
          }
          dotsGroup.appendChild(circle);
        }
      }

      const n0 = seq.calcN0(eps);
      if (N >= n0) {
        readout.style.borderColor = "#10b981";
        readout.style.backgroundColor = "rgba(16, 185, 129, 0.05)";
        readout.style.color = "#10b981";
        readout.innerHTML = `🎉 ¡Felicidades! Has atrapado la sucesión. Con N = ${N} (el mínimo requerido es N₀ = ${n0}), todos los términos a partir de ${N} cumplen |aₙ - L| < ${eps.toFixed(2)}.`;
      } else {
        readout.style.borderColor = "#ef4444";
        readout.style.backgroundColor = "rgba(239, 68, 68, 0.05)";
        readout.style.color = "#ef4444";
        const sampleIdx = firstViolatorIdx || N;
        const sampleVal = seq.formula(sampleIdx).toFixed(3);
        readout.innerHTML = `⚠️ Quedan puntos fugitivos a la derecha de N. Por ejemplo, a_${sampleIdx} = ${sampleVal} está fuera de la tolerancia. ¡Prueba con N ≥ ${n0}!`;
      }
    }

    presetSelect.addEventListener("change", updatePlot);
    epsSlider.addEventListener("input", updatePlot);
    nSlider.addEventListener("input", updatePlot);
    
    updatePlot();

    // Desafío analítico de épsilon
    const choiceButtons = document.querySelectorAll(".option-btn-l2");
    const feedback = document.getElementById("game-challenge-feedback");
    const verifyChallengeBtn = document.getElementById("btn-verify-challenge-l2");
    
    let selectedValue = null;

    choiceButtons.forEach(btn => {
      btn.onclick = () => {
        choiceButtons.forEach(b => {
          b.classList.remove("selected");
          b.style.backgroundColor = "var(--bg-primary)";
          b.style.borderColor = "var(--border-color)";
        });
        btn.classList.add("selected");
        btn.style.backgroundColor = "var(--accent-color)";
        btn.style.borderColor = "var(--accent-color)";
        selectedValue = btn.getAttribute("data-val");
        
        if (feedback) {
          feedback.style.display = "none";
        }
      };
    });

    if (verifyChallengeBtn && feedback) {
      verifyChallengeBtn.onclick = () => {
        if (!selectedValue) {
          alert("Por favor, selecciona una opción antes de verificar.");
          return;
        }

        feedback.style.display = "block";
        if (selectedValue === "13") {
          feedback.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
          feedback.style.border = "1px solid #10b981";
          feedback.style.color = "#10b981";
          feedback.innerHTML = `<strong>¡Correcto!</strong> Despejando: $1/n < 0.08 \\implies n > 1/0.08 = 12.5$. El primer entero que cumple es $n = 13$, por lo que el menor natural es $N = 13$.`;
        } else {
          feedback.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
          feedback.style.border = "1px solid #ef4444";
          feedback.style.color = "#ef4444";
          if (selectedValue === "10") {
            feedback.innerHTML = `<strong>Incorrecto:</strong> Para $n=10$, $a_{10} = 0.1$, que es mayor que $0.08$. El término queda fuera.`;
          } else if (selectedValue === "12") {
            feedback.innerHTML = `<strong>Incorrecto:</strong> Para $n=12$, $a_{12} = 1/12 \\approx 0.0833$, que aún es mayor que $0.08$.`;
          } else {
            feedback.innerHTML = `<strong>Incorrecto:</strong> Aunque $N=15$ cumple la condición de tolerancia para todos los términos siguientes, <strong>no es el mínimo natural</strong> requerido. El mínimo es $13$.`;
          }
        }

        if (window.MathJax && window.MathJax.typesetPromise) {
          window.MathJax.typesetPromise([feedback]);
        }
      };
    }
  }


  function initDivisionPlayer() {
    const playBtn = document.getElementById("div-play-btn");
    const prevBtn = document.getElementById("div-prev-btn");
    const nextBtn = document.getElementById("div-next-btn");
    const stepIndicator = document.getElementById("div-step-indicator");
    const progressFill = document.getElementById("player-progress-fill");
    const expBox = document.getElementById("player-explanation-box");
    
    const boardCociente = document.getElementById("board-cociente");
    const termSub1 = document.getElementById("term-subtract-1");
    const termLine1 = document.getElementById("term-line-1");
    const termRes1 = document.getElementById("term-residue-1");
    const termSub2 = document.getElementById("term-subtract-2");
    const termLine2 = document.getElementById("term-line-2");
    const termRemainder = document.getElementById("term-remainder");

    if (!playBtn || !prevBtn || !nextBtn) return;

    const steps = [
      {
        indicator: "Paso 0 de 5: Planteamiento",
        progress: 0,
        explanation: "<strong>Paso 0:</strong> Planteamos la división clásica. El dividendo es $2x^3 - 3x^2 + 4x - 5$ y el divisor es $x^2 - x + 1$. El cociente está vacío.",
        setup: () => {
          boardCociente.innerHTML = "";
          termSub1.style.opacity = 0;
          termLine1.style.opacity = 0;
          termRes1.style.opacity = 0;
          termSub2.style.opacity = 0;
          termLine2.style.opacity = 0;
          termRemainder.style.opacity = 0;
        }
      },
      {
        indicator: "Paso 1 de 5: Dividir líderes y primer cociente",
        progress: 20,
        explanation: "<strong>Paso 1:</strong> Dividimos el término líder del dividendo ($2x^3$) entre el líder del divisor ($x^2$): $\\frac{2x^3}{x^2} = 2x$. Escribimos $2x$ en el cociente.",
        setup: () => {
          boardCociente.innerHTML = "\\(2x\\)";
          termSub1.style.opacity = 0;
          termLine1.style.opacity = 0;
          termRes1.style.opacity = 0;
          termSub2.style.opacity = 0;
          termLine2.style.opacity = 0;
          termRemainder.style.opacity = 0;
        }
      },
      {
        indicator: "Paso 2 de 5: Restar primer producto",
        progress: 40,
        explanation: "<strong>Paso 2:</strong> Multiplicamos $2x \\cdot (x^2 - x + 1) = 2x^3 - 2x^2 + 2x$ y restamos este resultado del dividendo, obteniendo como primer residuo parcial: $-x^2 + 2x - 5$.",
        setup: () => {
          boardCociente.innerHTML = "\\(2x\\)";
          termSub1.style.opacity = 1;
          termLine1.style.opacity = 1;
          termRes1.style.opacity = 1;
          termSub2.style.opacity = 0;
          termLine2.style.opacity = 0;
          termRemainder.style.opacity = 0;
        }
      },
      {
        indicator: "Paso 3 de 5: Dividir líderes y segundo cociente",
        progress: 60,
        explanation: "<strong>Paso 3:</strong> Dividimos el término líder del residuo parcial ($-x^2$) entre el líder del divisor ($x^2$): $\\frac{-x^2}{x^2} = -1$. Escribimos $- 1$ en el cociente.",
        setup: () => {
          boardCociente.innerHTML = "\\(2x - 1\\)";
          termSub1.style.opacity = 1;
          termLine1.style.opacity = 1;
          termRes1.style.opacity = 1;
          termSub2.style.opacity = 0;
          termLine2.style.opacity = 0;
          termRemainder.style.opacity = 0;
        }
      },
      {
        indicator: "Paso 4 de 5: Restar segundo producto",
        progress: 80,
        explanation: "<strong>Paso 4:</strong> Multiplicamos $-1 \\cdot (x^2 - x + 1) = -x^2 + x - 1$ y restamos este resultado del residuo parcial anterior, obteniendo como residuo final: $x - 4$.",
        setup: () => {
          boardCociente.innerHTML = "\\(2x - 1\\)";
          termSub1.style.opacity = 1;
          termLine1.style.opacity = 1;
          termRes1.style.opacity = 1;
          termSub2.style.opacity = 1;
          termLine2.style.opacity = 1;
          termRemainder.style.opacity = 1;
        }
      },
      {
        indicator: "Paso 5 de 5: Fin del algoritmo",
        progress: 100,
        explanation: "<strong>Paso 5:</strong> El residuo es $x - 4$. Dado que su grado (1) es menor que el grado del divisor (2), el algoritmo se detiene. El cociente final es $q(x) = 2x - 1$ y el resto es $r(x) = x - 4$.",
        setup: () => {
          boardCociente.innerHTML = "\\(2x - 1\\)";
          termSub1.style.opacity = 1;
          termLine1.style.opacity = 1;
          termRes1.style.opacity = 1;
          termSub2.style.opacity = 1;
          termLine2.style.opacity = 1;
          termRemainder.style.opacity = 1;
        }
      }
    ];

    let currentStep = 0;
    let isPlaying = false;
    let playInterval = null;

    function renderStep(idx) {
      currentStep = idx;
      const step = steps[currentStep];
      
      stepIndicator.textContent = step.indicator;
      progressFill.style.width = `${step.progress}%`;
      expBox.innerHTML = step.explanation;
      
      // Clear MathJax typesetting cache for elements that change dynamically
      if (window.MathJax && window.MathJax.typesetClear) {
        window.MathJax.typesetClear([expBox, boardCociente]);
      }
      
      step.setup();

      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([expBox, boardCociente]);
      }
    }

    function togglePlay() {
      isPlaying = !isPlaying;
      if (isPlaying) {
        playBtn.innerHTML = `<span>⏸</span> <span>Pausar</span>`;
        playInterval = setInterval(() => {
          if (currentStep < steps.length - 1) {
            renderStep(currentStep + 1);
          } else {
            renderStep(0);
          }
        }, 3500);
      } else {
        playBtn.innerHTML = `<span>▶</span> <span>Reproducir</span>`;
        clearInterval(playInterval);
      }
    }

    playBtn.onclick = togglePlay;
    
    prevBtn.onclick = () => {
      if (isPlaying) togglePlay();
      if (currentStep > 0) {
        renderStep(currentStep - 1);
      }
    };
    
    nextBtn.onclick = () => {
      if (isPlaying) togglePlay();
      if (currentStep < steps.length - 1) {
        renderStep(currentStep + 1);
      }
    };

    renderStep(0);
  }

  function initRuffiniPlayer() {
    const playBtn = document.getElementById("ruf-play-btn");
    const prevBtn = document.getElementById("ruf-prev-btn");
    const nextBtn = document.getElementById("ruf-next-btn");
    const stepIndicator = document.getElementById("ruf-step-indicator");
    const progressFill = document.getElementById("ruf-progress-fill");
    const expBox = document.getElementById("ruf-explanation-box");
    const container = document.getElementById("ruffini-latex-container");

    if (!playBtn || !prevBtn || !nextBtn || !container) return;

    const steps = [
      {
        indicator: "Paso 0 de 6: Planteamiento",
        progress: 0,
        explanation: "<strong>Paso 0:</strong> Escribimos los coeficientes del dividendo $x^4 - 3x^2 + 5x - 7$ en la fila superior (añadiendo $0$ para el término $x^3$ ausente). Escribimos la raíz del divisor $x - 2 = 0 \\implies c = 2$ a la izquierda.",
        latex: "\\[\\begin{array}{c|rrrrr} & 1 & 0 & -3 & 5 & -7 \\\\ 2 & & & & & \\\\ \\hline & & & & & \\end{array}\\]"
      },
      {
        indicator: "Paso 1 de 6: Bajar el primer término",
        progress: 16,
        explanation: "<strong>Paso 1:</strong> Bajamos el primer coeficiente ($1$) directamente a la línea de resultados sin realizar ninguna operación.",
        latex: "\\[\\begin{array}{c|rrrrr} & 1 & 0 & -3 & 5 & -7 \\\\ 2 & & & & & \\\\ \\hline & \\mathbf{1} & & & & \\end{array}\\]"
      },
      {
        indicator: "Paso 2 de 6: Multiplicar y sumar la segunda columna",
        progress: 33,
        explanation: "<strong>Paso 2:</strong> Multiplicamos el número recién bajado ($1$) por la raíz ($2$): $1 \\cdot 2 = 2$. Colocamos el resultado bajo el coeficiente $0$ y sumamos: $0 + 2 = 2$.",
        latex: "\\[\\begin{array}{c|rrrrr} & 1 & 0 & -3 & 5 & -7 \\\\ 2 & & \\color{#3b82f6}{2} & & & \\\\ \\hline & 1 & \\mathbf{2} & & & \\end{array}\\]"
      },
      {
        indicator: "Paso 3 de 6: Multiplicar y sumar la tercera columna",
        progress: 50,
        explanation: "<strong>Paso 3:</strong> Multiplicamos el resultado obtenido ($2$) por la raíz ($2$): $2 \\cdot 2 = 4$. Colocamos el resultado bajo el coeficiente $-3$ y sumamos: $-3 + 4 = 1$.",
        latex: "\\[\\begin{array}{c|rrrrr} & 1 & 0 & -3 & 5 & -7 \\\\ 2 & & 2 & \\color{#3b82f6}{4} & & \\\\ \\hline & 1 & 2 & \\mathbf{1} & & \\end{array}\\]"
      },
      {
        indicator: "Paso 4 de 6: Multiplicar y sumar la cuarta columna",
        progress: 66,
        explanation: "<strong>Paso 4:</strong> Multiplicamos el resultado obtenido ($1$) por la raíz ($2$): $1 \\cdot 2 = 2$. Colocamos el resultado bajo el coeficiente $5$ y sumamos: $5 + 2 = 7$.",
        latex: "\\[\\begin{array}{c|rrrrr} & 1 & 0 & -3 & 5 & -7 \\\\ 2 & & 2 & 4 & \\color{#3b82f6}{2} & \\\\ \\hline & 1 & 2 & 1 & \\mathbf{7} & \\end{array}\\]"
      },
      {
        indicator: "Paso 5 de 6: Calcular el resto final",
        progress: 83,
        explanation: "<strong>Paso 5:</strong> Multiplicamos el resultado obtenido ($7$) por la raíz ($2$): $7 \\cdot 2 = 14$. Colocamos el resultado bajo el coeficiente $-7$ y sumamos: $-7 + 14 = 7$. Este valor es el residuo.",
        latex: "\\[\\begin{array}{c|rrrrr} & 1 & 0 & -3 & 5 & -7 \\\\ 2 & & 2 & 4 & 2 & \\color{#3b82f6}{14} \\\\ \\hline & 1 & 2 & 1 & 7 & \\color{#10b981}{\\mathbf{7}} \\end{array}\\]"
      },
      {
        indicator: "Paso 6 de 6: Resultado y cociente final",
        progress: 100,
        explanation: "<strong>Paso 6:</strong> Hemos completado el esquema. El resto es $r = 7$, y los coeficientes del cociente son $1, 2, 1, 7$ (que corresponden a un grado menor): $q(x) = x^3 + 2x^2 + x + 7$.",
        latex: "\\[\\begin{array}{c|rrrrr} & 1 & 0 & -3 & 5 & -7 \\\\ 2 & & 2 & 4 & 2 & 14 \\\\ \\hline & 1 & 2 & 1 & 7 & \\color{#10b981}{\\boxed{7}} \\end{array}\\]"
      }
    ];

    let currentStep = 0;
    let isPlaying = false;
    let playInterval = null;

    function renderStep(idx) {
      currentStep = idx;
      const step = steps[currentStep];

      stepIndicator.textContent = step.indicator;
      progressFill.style.width = `${step.progress}%`;
      expBox.innerHTML = step.explanation;
      container.innerHTML = step.latex;

      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([expBox, container]);
      }
    }

    function togglePlay() {
      isPlaying = !isPlaying;
      if (isPlaying) {
        playBtn.innerHTML = `<span>⏸</span> <span>Pausar</span>`;
        playInterval = setInterval(() => {
          if (currentStep < steps.length - 1) {
            renderStep(currentStep + 1);
          } else {
            renderStep(0);
          }
        }, 4000);
      } else {
        playBtn.innerHTML = `<span>▶</span> <span>Reproducir</span>`;
        clearInterval(playInterval);
      }
    }

    playBtn.onclick = togglePlay;

    prevBtn.onclick = () => {
      if (isPlaying) togglePlay();
      if (currentStep > 0) {
        renderStep(currentStep - 1);
      }
    };

    nextBtn.onclick = () => {
      if (isPlaying) togglePlay();
      if (currentStep < steps.length - 1) {
        renderStep(currentStep + 1);
      }
    };

    renderStep(0);
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
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCoursePage);
} else {
  initCoursePage();
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

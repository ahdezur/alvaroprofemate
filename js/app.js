// Controladores de Interfaz y Comportamiento del Home

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initTestimonialSlider();
  loadBlogPosts();
  initContactForm();
  initCalculatorModal();
  initHeroMathAnimation();
});

/* ==========================================================================
   Navegación e Interfaz Móvil
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Añadir fondo al navbar cuando se hace scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    highlightNavOnScroll();
  });

  // Toggle menú móvil
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    const icon = menuToggle.querySelector("i");
    if (navMenu.classList.contains("active")) {
      icon.classList.replace("fa-bars", "fa-xmark");
    } else {
      icon.classList.replace("fa-xmark", "fa-bars");
    }
  });

  // Cerrar menú móvil al hacer click en un enlace
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      menuToggle.querySelector("i").classList.replace("fa-xmark", "fa-bars");
    });
  });

  // Resaltar sección activa al hacer scroll
  function highlightNavOnScroll() {
    const scrollPos = window.scrollY + 120;
    navLinks.forEach(link => {
      const targetId = link.getAttribute("href");
      if (targetId === "#" || !targetId.startsWith("#")) return;
      
      const section = document.querySelector(targetId);
      if (section) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(l => l.classList.remove("active"));
          link.classList.add("active");
        }
      }
    });
  }
}

/* ==========================================================================
   Carrusel de Testimonios
   ========================================================================== */
function initTestimonialSlider() {
  const track = document.getElementById("testimonial-track");
  const dots = document.querySelectorAll(".slider-dot");
  let currentIndex = 0;
  let autoPlayTimer;

  function moveToSlide(index) {
    if (index < 0) index = dots.length - 1;
    if (index >= dots.length) index = 0;
    
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    dots.forEach(dot => dot.classList.remove("active"));
    dots[currentIndex].classList.add("active");
  }

  dots.forEach(dot => {
    dot.addEventListener("click", (e) => {
      const targetIndex = parseInt(e.target.getAttribute("data-index"));
      moveToSlide(targetIndex);
      resetAutoPlay();
    });
  });

  function startAutoPlay() {
    autoPlayTimer = setInterval(() => {
      moveToSlide(currentIndex + 1);
    }, 6000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  startAutoPlay();
}

/* ==========================================================================
   Cargado de Posts y Lector Modal
   ========================================================================== */
async function loadBlogPosts() {
  const container = document.getElementById("blog-container");
  if (!container) return;

  try {
    const posts = await DB.getAllPosts();
    container.innerHTML = ""; // Limpiar spinner

    if (posts.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-regular fa-folder-open fa-2x" style="margin-bottom: 15px; display: block;"></i>
          <p>Aún no hay lecturas publicadas en el blog corporativo.</p>
        </div>
      `;
      return;
    }

    posts.forEach(post => {
      const card = document.createElement("div");
      card.className = "blog-card";
      card.innerHTML = `
        <div class="blog-card-content">
          <div class="blog-card-meta">
            <span class="blog-card-tag">${escapeHtml(post.category)}</span>
            <span class="blog-card-time"><i class="fa-regular fa-clock"></i> ${escapeHtml(post.readTime || "5 min")}</span>
          </div>
          <h3 class="blog-card-title">${escapeHtml(post.title)}</h3>
          <p class="blog-card-excerpt">${escapeHtml(post.excerpt)}</p>
          <div class="blog-card-footer">
            <span class="blog-card-date">${formatDate(post.date)}</span>
            <a href="#" class="blog-card-link" data-id="${post.id}">Leer Más <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
      `;
      
      // Evento de lectura al hacer click en el card
      card.addEventListener("click", (e) => {
        e.preventDefault();
        openReaderModal(post.id);
      });

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error cargando posts en index:", error);
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #ef4444;">
        <i class="fa-solid fa-circle-exclamation fa-2x" style="margin-bottom: 15px; display: block;"></i>
        <p>Hubo un error al intentar cargar las lecturas. Por favor reintenta.</p>
      </div>
    `;
  }
}

// Lector Modal de Artículos
async function openReaderModal(postId) {
  const modal = document.getElementById("reading-modal");
  const modalCategory = document.getElementById("modal-category");
  const modalDate = document.getElementById("modal-date");
  const modalReadTime = document.getElementById("modal-read-time");
  const modalTitle = document.getElementById("modal-title");
  const modalContentArea = document.getElementById("modal-content-area");
  const closeBtn = document.getElementById("modal-close");

  try {
    const post = await DB.getPostById(postId);
    if (!post) return;

    modalCategory.textContent = post.category.toUpperCase();
    modalDate.textContent = formatDate(post.date);
    modalReadTime.textContent = `${post.readTime || "5 min"} lectura`;
    modalTitle.textContent = post.title;
    
    // Inyectar HTML de forma segura (el admin es el único con capacidad de ingresar HTML)
    modalContentArea.innerHTML = post.content;

    // Mostrar modal
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Desactivar scroll del body

    // Escuchadores de cierre
    const closeModal = () => {
      modal.classList.remove("active");
      document.body.style.overflow = ""; // Restaurar scroll
    };

    closeBtn.onclick = closeModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };

    // Cerrar con Escape
    document.addEventListener("keydown", function escClose(e) {
      if (e.key === "Escape") {
        closeModal();
        document.removeEventListener("keydown", escClose);
      }
    });

  } catch (error) {
    console.error("Error al abrir lector de post:", error);
  }
}

/* ==========================================================================
   Formulario de Contacto del Landing
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("landing-contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // Simular envío exitoso con un modal o alerta elegante
    const btn = form.querySelector("button[type='submit']");
    const originalText = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Enviando...`;

    setTimeout(() => {
      // Reemplazar formulario temporalmente con un mensaje de éxito premium
      const formContainer = form.parentElement;
      formContainer.innerHTML = `
        <div style="text-align: center; padding: 45px 20px; color: var(--text-primary);">
          <div style="width: 70px; height: 70px; background: rgba(6, 182, 212, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 25px auto; color: var(--accent); font-size: 32px; border: 1px solid rgba(6, 182, 212, 0.2);">
            <i class="fa-solid fa-check"></i>
          </div>
          <h3 style="font-family: var(--font-title); font-size: 24px; margin-bottom: 12px;">¡Mensaje Enviado con Éxito!</h3>
          <p style="color: var(--text-muted); font-size: 15px; margin-bottom: 30px; line-height: 1.6;">Gracias, <strong>${escapeHtml(name)}</strong>. He recibido tu consulta sobre <strong>${escapeHtml(subject)}</strong> y te responderé a <strong>${escapeHtml(email)}</strong> a la brevedad posible.</p>
          <button class="btn btn-secondary" onclick="window.location.reload();">Enviar otro mensaje</button>
        </div>
      `;
    }, 1500);
  });
}

/* ==========================================================================
   Modal Seleccionador de Calculadoras
   ========================================================================== */
function initCalculatorModal() {
  const btn = document.getElementById("btn-calculadora");
  const modal = document.getElementById("calc-modal");
  const closeBtn = document.getElementById("calc-modal-close");

  if (!btn || !modal) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  const closeModal = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  closeBtn.onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
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
  const date = new Date(dateStr + 'T00:00:00'); // Evitar problemas de zona horaria local
  return date.toLocaleDateString('es-ES', options);
}

/* ==========================================================================
   Visualización Matemática Cíclica (Brilliant-Style)
   ========================================================================== */
function initHeroMathAnimation() {
  const svgDerivada = document.getElementById("svg-derivada");
  const svgIntegral = document.getElementById("svg-integral");
  const svgTrig = document.getElementById("svg-trig");
  
  if (!svgDerivada || !svgIntegral || !svgTrig) return;

  const animTitle = document.getElementById("hero-anim-title");
  const animEq = document.getElementById("hero-anim-eq");
  const animDesc = document.getElementById("hero-anim-desc");

  // Configuración de Estados
  let currentState = 0; // 0: Derivada, 1: Integral, 2: Trigonometría
  let stateTime = 0; // tiempo transcurrido en el estado actual (frames)

  // ------------------------------------------------------------
  // ANIMACIÓN A: DERIVADA
  // ------------------------------------------------------------
  const curvaDerivada = document.getElementById('curva-derivada');
  const puntoP = document.getElementById('punto-p');
  const puntoQ = document.getElementById('punto-q');
  const labelQStatic = document.getElementById('label-q-static');
  const lineaSecante = document.getElementById('linea-secante');
  const lineaTangente = document.getElementById('linea-tangente');
  const trianguloDelta = document.getElementById('triangulo-delta');
  const labelDx = document.getElementById('label-dx');
  const labelDy = document.getElementById('label-dy');

  function f_derivada(x) {
    return 125 - 0.4 * (x - 30) - 20 * Math.sin((x - 30) / 45);
  }

  // Dibujar curva de derivada una sola vez
  let d_deriv = 'M 30 ' + f_derivada(30);
  for (let x = 31; x <= 270; x++) {
    d_deriv += ' L ' + x + ' ' + f_derivada(x);
  }
  curvaDerivada.setAttribute('d', d_deriv);

  const x_p = 120;
  const y_p = f_derivada(x_p);
  puntoP.setAttribute('cx', x_p);
  puntoP.setAttribute('cy', y_p);

  // Calcular la tangente fija
  const h_inf = 0.01;
  const m_tangente = (f_derivada(x_p + h_inf) - y_p) / h_inf;
  lineaTangente.setAttribute('x1', 50);
  lineaTangente.setAttribute('y1', y_p + m_tangente * (50 - x_p));
  lineaTangente.setAttribute('x2', 210);
  lineaTangente.setAttribute('y2', y_p + m_tangente * (210 - x_p));

  let t_derivada = 0;

  function runDerivadaFrame() {
    t_derivada += 0.025; // velocidad de la oscilación
    
    // Oscilar Q usando seno de forma que haga exactamente 1.5 ciclos
    let h = 80 + 75 * Math.sin(t_derivada - Math.PI / 2);
    if (Math.abs(h) < 2) h = h < 0 ? -2 : 2;

    let x_q = x_p + h;
    if (x_q < 30) x_q = 30;
    if (x_q > 270) x_q = 270;
    let y_q = f_derivada(x_q);

    puntoQ.setAttribute('cx', x_q);
    puntoQ.setAttribute('cy', y_q);
    labelQStatic.setAttribute('x', x_q + 8);
    labelQStatic.setAttribute('y', y_q - 5);

    const m_secante = (y_q - y_p) / (x_q - x_p);
    lineaSecante.setAttribute('x1', 30);
    lineaSecante.setAttribute('y1', y_p + m_secante * (30 - x_p));
    lineaSecante.setAttribute('x2', 270);
    lineaSecante.setAttribute('y2', y_p + m_secante * (270 - x_p));

    trianguloDelta.setAttribute('d', `M ${x_p} ${y_p} L ${x_q} ${y_p} L ${x_q} ${y_q}`);

    labelDx.setAttribute('x', x_p + h/2);
    labelDx.setAttribute('y', y_p + (h > 0 ? 12 : -6));
    labelDx.textContent = 'Δx=' + Math.abs(h).toFixed(0);

    labelDy.setAttribute('x', x_q + (h > 0 ? 6 : -35));
    labelDy.setAttribute('y', y_p + (y_q - y_p)/2);
    labelDy.textContent = 'Δy=' + Math.abs(y_q - y_p).toFixed(0);
  }

  // ------------------------------------------------------------
  // ANIMACIÓN B: INTEGRAL
  // ------------------------------------------------------------
  const curvaIntegral = document.getElementById('curva-integral');
  const grupoRectangulos = document.getElementById('grupo-rectangulos');
  const labelN = document.getElementById('label-n');
  const labelError = document.getElementById('label-error');

  function f_integral(x) {
    return 110 - 25 * Math.sin((x - 40) / 30) - 15 * Math.cos((x - 40) / 60);
  }

  // Dibujar curva una sola vez
  let d_integ = 'M 30 ' + f_integral(30);
  for (let x = 31; x <= 270; x++) {
    d_integ += ' L ' + x + ' ' + f_integral(x);
  }
  curvaIntegral.setAttribute('d', d_integ);

  const particiones = [4, 8, 12, 16, 24, 32, 48, 64];
  let lastIntegUpdate = 0;
  let integStep = 0;

  function runIntegralFrame(timestamp) {
    if (!lastIntegUpdate) lastIntegUpdate = timestamp;

    // Cambiar partición cada 1.2 segundos
    if (timestamp - lastIntegUpdate > 1200) {
      integStep = (integStep + 1) % particiones.length;
      drawRiemannBars(particiones[integStep]);
      lastIntegUpdate = timestamp;
    }
  }

  function drawRiemannBars(N) {
    grupoRectangulos.innerHTML = '';
    const a = 60;
    const b = 240;
    const ancho = (b - a) / N;

    let sumaAreas = 0;
    let areaReal = 0;
    const pasosFinisimos = 1000;
    const dx_finito = (b - a) / pasosFinisimos;
    for (let i = 0; i < pasosFinisimos; i++) {
      areaReal += (130 - f_integral(a + i * dx_finito)) * dx_finito;
    }

    for (let i = 0; i < N; i++) {
      const x = a + i * ancho;
      const y = f_integral(x);
      const altura = 130 - y;
      sumaAreas += altura * ancho;

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', y);
      rect.setAttribute('width', ancho - 0.5);
      rect.setAttribute('height', altura);
      rect.setAttribute('fill', 'url(#grad-rect)');
      rect.setAttribute('stroke', 'rgba(6, 182, 212, 0.4)');
      rect.setAttribute('stroke-width', '0.5');
      grupoRectangulos.appendChild(rect);
    }

    labelN.textContent = `Partición: n = ${N} barras`;
    const errorPct = Math.abs((sumaAreas - areaReal) / areaReal) * 100;
    labelError.textContent = `Error de área: ${errorPct.toFixed(2)}%`;
  }

  // Inicializar primer dibujo de barras
  drawRiemannBars(particiones[0]);

  // ------------------------------------------------------------
  // ANIMACIÓN C: TRIGONOMETRÍA
  // ------------------------------------------------------------
  const R = 35;
  const cx_c = 65;
  const cy_c = 75;
  let angulo_trig = 0;

  const vectorRot = document.getElementById('vector-rotatorio');
  const puntoRot = document.getElementById('punto-rotatorio');
  const compCos = document.getElementById('comp-cos');
  const compSin = document.getElementById('comp-sin');
  const curvaSeno = document.getElementById('curva-seno');
  const lineaConexion = document.getElementById('linea-conexion');
  const puntoOnda = document.getElementById('punto-onda');
  const lblTrig = document.getElementById('label-trig-angle');

  function runTrigFrame() {
    angulo_trig += 0.025;
    
    const px = cx_c + R * Math.cos(angulo_trig);
    const py = cy_c - R * Math.sin(angulo_trig);

    vectorRot.setAttribute('x2', px);
    vectorRot.setAttribute('y2', py);
    puntoRot.setAttribute('cx', px);
    puntoRot.setAttribute('cy', py);

    compCos.setAttribute('x1', cx_c);
    compCos.setAttribute('y1', cy_c);
    compCos.setAttribute('x2', px);
    compCos.setAttribute('y2', cy_c);

    compSin.setAttribute('x1', px);
    compSin.setAttribute('y1', cy_c);
    compSin.setAttribute('x2', px);
    compSin.setAttribute('y2', py);

    let d_wave = '';
    const start_x = 130;
    const end_x = 290;
    for (let x = start_x; x <= end_x; x++) {
      const fase_wave = angulo_trig - (x - start_x) * 0.05;
      const wave_y = cy_c - R * Math.sin(fase_wave);
      if (x === start_x) d_wave += `M ${x} ${wave_y}`;
      else d_wave += ` L ${x} ${wave_y}`;
    }
    curvaSeno.setAttribute('d', d_wave);

    lineaConexion.setAttribute('x1', px);
    lineaConexion.setAttribute('y1', py);
    lineaConexion.setAttribute('x2', start_x);
    lineaConexion.setAttribute('y2', py);

    puntoOnda.setAttribute('cx', start_x);
    puntoOnda.setAttribute('cy', py);

    const deg = Math.round((angulo_trig * 180 / Math.PI) % 360);
    lblTrig.textContent = `θ = ${deg}° | sin θ = ${(Math.sin(angulo_trig)).toFixed(2)}`;
  }

  // ------------------------------------------------------------
  // GESTIÓN DEL LOOP Y TRANSICIÓN DE ESTADOS
  // ------------------------------------------------------------
  function changeState(newState) {
    currentState = newState;
    stateTime = 0;

    // Efecto visual de desvanecimiento
    const textElements = [animTitle, animEq, animDesc];
    textElements.forEach(el => el.style.opacity = 0);

    setTimeout(() => {
      let latexEq = "";
      if (currentState === 0) {
        svgDerivada.classList.add('active');
        svgIntegral.classList.remove('active');
        svgTrig.classList.remove('active');

        animTitle.innerHTML = `<i class="fa-solid fa-chart-line"></i> Derivadas: Recta Tangente`;
        latexEq = `\\( \\displaystyle \\frac{dy}{dx} = \\lim\\limits_{\\Delta x \\to 0} \\frac{\\Delta y}{\\Delta x} \\)`;
        animDesc.innerHTML = `La pendiente de la recta secante converge a la tangente a medida que el incremento se reduce a cero.`;
        
        t_derivada = -Math.PI / 2; // reiniciar oscilación en valor mínimo de h
      } 
      else if (currentState === 1) {
        svgDerivada.classList.remove('active');
        svgIntegral.classList.add('active');
        svgTrig.classList.remove('active');

        animTitle.innerHTML = `<i class="fa-solid fa-chart-bar"></i> Integrales: Sumas de Riemann`;
        latexEq = `\\( \\displaystyle \\int_{a}^{b} f(x) \\, dx = \\lim\\limits_{n \\to \\infty} \\sum_{i=1}^{n} f(x_i) \\, \\Delta x \\)`;
        animDesc.innerHTML = `El área bajo la curva se aproxima dividiéndola en rectángulos. Al aumentar las barras, el error tiende a cero.`;
        
        integStep = 0;
        drawRiemannBars(particiones[0]);
      } 
      else if (currentState === 2) {
        svgDerivada.classList.remove('active');
        svgIntegral.classList.remove('active');
        svgTrig.classList.add('active');

        animTitle.innerHTML = `<i class="fa-solid fa-circle-notch"></i> Trigonometría: Onda Senoidal`;
        latexEq = `\\( \\displaystyle y = \\sin \\theta \\)`;
        animDesc.innerHTML = `Un punto recorriendo una trayectoria circular genera de manera natural una onda periódica en el tiempo.`;
        
        angulo_trig = 0;
      }

      animEq.innerHTML = latexEq;

      // Typeset la fórmula matemática con MathJax de forma asíncrona antes de mostrar el texto
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([animEq])
          .then(() => {
            textElements.forEach(el => el.style.opacity = 1);
          })
          .catch((err) => {
            console.error('MathJax rendering error:', err);
            textElements.forEach(el => el.style.opacity = 1);
          });
      } else {
        textElements.forEach(el => el.style.opacity = 1);
      }
    }, 300);
  }

  function loop(timestamp) {
    stateTime++;

    if (currentState === 0) {
      runDerivadaFrame();
      // Un ciclo de oscilación completo dura unos 250 frames (aprox 4.2 seg). 
      // Dejamos que haga 1.5 oscilaciones completas (375 frames) para apreciar el límite.
      if (stateTime > 375) {
        changeState(1);
      }
    } 
    else if (currentState === 1) {
      runIntegralFrame(timestamp);
      // Recorrer las 8 particiones. Cada una toma 1.2 segundos (total 9.6 segundos, aprox 580 frames)
      if (stateTime > 580) {
        changeState(2);
      }
    } 
    else if (currentState === 2) {
      runTrigFrame();
      // Completar 2 rotaciones (aproximadamente 500 frames)
      if (stateTime > 500) {
        changeState(0);
      }
    }

    requestAnimationFrame(loop);
  }

  // Inicializar estado inicial
  changeState(0);
  requestAnimationFrame(loop);
}

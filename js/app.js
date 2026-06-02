// Controladores de Interfaz y Comportamiento del Home

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initTestimonialSlider();
  loadBlogPosts();
  initContactForm();
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

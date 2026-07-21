import { libraryService } from './services/LibraryService.js';
import { CONFIG } from './config.js';

class CatalogoApp {
  constructor() {
    this.evaluaciones = [];
    this.grid = document.getElementById('evaluations-grid');
    this.countLabel = document.getElementById('results-count');
    
    // Inputs de filtro
    this.searchInput = document.getElementById('filter-search');
    this.cursoInput = document.getElementById('filter-curso');
    this.tipoInput = document.getElementById('filter-tipo');
    this.clearBtn = document.getElementById('btn-clear-filters');

    this.init();
  }

  async init() {
    try {
      this.evaluaciones = await libraryService.getEvaluaciones();
      this.bindEvents();
      this.render();
    } catch (error) {
      this.grid.innerHTML = `<div class="blog-card" style="padding: 30px; text-align: center; color: var(--text-muted);">
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 30px; margin-bottom: 15px; color: ${CONFIG.UI.THEME_COLORS.WARNING};"></i>
        <p>No se pudo cargar el catálogo de evaluaciones.</p>
        <p style="font-size: 12px; margin-top: 5px;">${error.message}</p>
      </div>`;
      this.countLabel.textContent = "0";
    }
  }

  bindEvents() {
    this.searchInput.addEventListener('input', () => this.render());
    this.cursoInput.addEventListener('change', () => this.render());
    this.tipoInput.addEventListener('change', () => this.render());
    
    this.clearBtn.addEventListener('click', () => {
      this.searchInput.value = '';
      this.cursoInput.value = '';
      this.tipoInput.value = '';
      this.render();
    });
  }

  filterData() {
    const term = this.searchInput.value.toLowerCase();
    const curso = this.cursoInput.value;
    const tipo = this.tipoInput.value;

    return this.evaluaciones.filter(e => {
      const matchTerm = e.titulo.toLowerCase().includes(term) || (e.descripcion || '').toLowerCase().includes(term);
      const matchCurso = curso === "" || e.curso === curso;
      const matchTipo = tipo === "" || e.tipo === tipo;
      return matchTerm && matchCurso && matchTipo;
    });
  }

  render() {
    const filtradas = this.filterData();
    this.countLabel.textContent = filtradas.length;

    if (filtradas.length === 0) {
      this.grid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center; padding: 40px 0;">No se encontraron evaluaciones con estos filtros.</p>`;
      return;
    }

    this.grid.innerHTML = filtradas.map(e => this.createCardHTML(e)).join('');
  }

  createCardHTML(ev) {
    // Uso del nuevo servicio de Storage centralizado a través de LibraryService
    const progreso = libraryService.getProgress(ev.id);
    let badgeHTML = '';
    
    if (progreso && progreso.estado === CONFIG.UI.ESTADOS.INICIADO) {
      badgeHTML = `<span class="eval-status-badge status-in-progress"><i class="fa-solid fa-clock-rotate-left"></i> En curso</span>`;
    } else if (progreso && progreso.estado === CONFIG.UI.ESTADOS.FINALIZADO) {
      badgeHTML = `<span class="eval-status-badge status-completed"><i class="fa-solid fa-check"></i> Finalizada</span>`;
    }

    const nPreguntas = ev.preguntas ? ev.preguntas.length : 0;
    const emptyWarning = nPreguntas === 0 
      ? `<div class="eval-empty-warning" style="color: ${CONFIG.UI.THEME_COLORS.WARNING};"><i class="fa-solid fa-lock"></i> Contenido no disponible aún</div>` 
      : '';
    
    const btnState = nPreguntas === 0 
      ? `<button class="btn btn-secondary" disabled style="opacity: 0.5; width: 100%;">Próximamente</button>`
      : `<a href="evaluacion.html?id=${ev.id}" class="btn btn-primary" style="width: 100%; text-align:center;">Abrir Evaluación</a>`;

    const tagsHTML = (ev.etiquetas || []).map(t => `<span class="lib-tag">${t}</span>`).join('');

    return `
      <div class="subject-card" style="display: flex; flex-direction: column;">
        ${badgeHTML}
        <h3 class="subject-title" style="margin-top: 10px;">${ev.titulo}</h3>
        <p class="subject-desc" style="flex-grow: 1;">${ev.descripcion}</p>
        
        <div class="eval-meta">
          <span><i class="fa-regular fa-clock"></i> ${ev.tiempo_limite_minutos} min</span>
          <span><i class="fa-solid fa-list-ul"></i> ${nPreguntas} preguntas</span>
          <span><i class="fa-solid fa-graduation-cap"></i> ${ev.curso}</span>
        </div>
        <div class="eval-meta" style="margin-top: -10px; margin-bottom: 15px;">
          ${ev.universidad ? `<span><i class="fa-solid fa-building-columns"></i> ${ev.universidad}</span>` : ''}
          ${ev.año ? `<span><i class="fa-regular fa-calendar"></i> ${ev.año}</span>` : ''}
          ${ev.semestre ? `<span><i class="fa-solid fa-leaf"></i> ${ev.semestre}</span>` : ''}
        </div>

        <div class="tags-container">
          ${tagsHTML}
        </div>
        
        ${emptyWarning}
        <div style="margin-top: auto;">
          ${btnState}
        </div>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CatalogoApp();
});

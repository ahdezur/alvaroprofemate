import { libraryService } from './services/LibraryService.js';
import { CONFIG } from './config.js';
import { QuestionCard } from './components/QuestionCard.js';
import { HintPanel } from './components/HintPanel.js';
import { RubricPanel } from './components/RubricPanel.js';
import { ProgressNav } from './components/ProgressNav.js';
import { Timer } from './components/Timer.js';

class EvaluacionApp {
  constructor() {
    this.evaluacion = null;
    this.preguntas = [];
    this.progreso = null;
    this.currentIndex = 0;
    
    // UI Elements básicos de orquestación
    this.appContainer = document.getElementById('app-container');
    this.loader = document.getElementById('loader');
    this.errorContainer = document.getElementById('error-container');
    this.errMsg = document.getElementById('error-message');
    
    this.title = document.getElementById('eval-title');
    this.course = document.getElementById('eval-course');
    this.modeSelector = document.getElementById('mode-selector');
    
    this.btnFinish = document.getElementById('btn-finish-eval');
    this.btnReset = document.getElementById('btn-reset-eval');

    // Elementos del Lobby
    this.lobbyContainer = document.getElementById('lobby-container');
    this.lobbyTitle = document.getElementById('lobby-title');
    this.lobbyMeta = document.getElementById('lobby-meta');
    this.lobbyTime = document.getElementById('lobby-time');
    this.lobbyMode = document.getElementById('lobby-mode');
    this.btnComenzar = document.getElementById('btn-comenzar');

    // Componentes
    this.comp = {};
    
    this.init();
  }

  async init() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) return this.showError("No se especificó un ID de evaluación en la URL.");

    try {
      this.evaluacion = await libraryService.getEvaluacionById(id);
      this.preguntas = await libraryService.getPreguntasForEvaluacion(this.evaluacion);
      this.progreso = libraryService.getProgress(this.evaluacion.id);
      
      this.progreso._qIds = this.preguntas.map(q => q.id);
      this.currentIndex = this.progreso.preguntaActualIndex || 0;
      this.handleUrlHash();

      this.initComponents();
      this.setupUI();
      this.bindEvents();
      this.renderCurrentQuestion();

      this.loader.style.display = 'none';

      // Lógica de Lobby vs App
      if (this.progreso.estado === CONFIG.UI.ESTADOS.PENDIENTE) {
        this.showLobby();
      } else {
        this.startApp();
      }

    } catch (error) {
      this.showError(error.message);
    }
  }

  showLobby() {
    this.lobbyTitle.textContent = this.evaluacion.titulo;
    this.lobbyMeta.innerHTML = `
      <span style="margin-right:15px;"><i class="fa-solid fa-graduation-cap"></i> ${this.evaluacion.curso}</span>
      ${this.evaluacion.universidad ? `<span style="margin-right:15px;"><i class="fa-solid fa-building-columns"></i> ${this.evaluacion.universidad}</span>` : ''}
      ${this.evaluacion.año ? `<span><i class="fa-regular fa-calendar"></i> ${this.evaluacion.año}</span>` : ''}
    `;
    
    document.getElementById('lobby-tags').innerHTML = (this.evaluacion.etiquetas || [])
      .map(t => `<span class="lib-tag">${t}</span>`).join('');

    this.lobbyTime.textContent = this.evaluacion.tiempo_limite_minutos;
    this.lobbyMode.value = CONFIG.DEFAULT_MODE;
    
    this.btnComenzar.onclick = () => {
      this.progreso.modo = this.lobbyMode.value;
      this.progreso.estado = CONFIG.UI.ESTADOS.INICIADO;
      this.saveProgress();
      this.lobbyContainer.style.display = 'none';
      
      // Sincronizar selector interno
      this.modeSelector.value = this.progreso.modo;
      this.renderCurrentQuestion();
      
      this.startApp();
    };

    this.lobbyContainer.style.display = 'block';
  }

  startApp() {
    this.appContainer.style.display = 'grid';
    this.comp.timer.start(this.progreso.tiempoAcumuladoSegundos);
  }

  handleUrlHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#pregunta-')) {
      const idx = parseInt(hash.replace('#pregunta-', '')) - 1;
      if (idx >= 0 && idx < this.preguntas.length) this.currentIndex = idx;
    }
  }

  initComponents() {
    this.comp.qCard = new QuestionCard({
      title: 'q-title',
      badges: 'q-badges',
      statement: 'q-statement'
    });

    this.comp.hintPanel = new HintPanel({
      toolsContainer: document.getElementById('study-tools-actions'),
      btnHint1: document.getElementById('btn-show-hint-1'),
      btnHint2: document.getElementById('btn-show-hint-2'),
      btnSolution: document.getElementById('btn-show-solution'),
      hint1Container: document.getElementById('hint-1-container'),
      hint1Text: document.getElementById('hint-1-text'),
      hint2Container: document.getElementById('hint-2-container'),
      hint2Text: document.getElementById('hint-2-text'),
      solutionContainer: document.getElementById('solution-container'),
      solutionText: document.getElementById('solution-text'),
      errorsList: document.getElementById('errors-list')
    }, (action, val) => this.onHintStateChange(action, val));

    this.comp.rubricPanel = new RubricPanel({
      btnRubric: document.getElementById('btn-show-rubric'),
      container: document.getElementById('rubric-container'),
      list: document.getElementById('rubric-items-list'),
      scoreEl: document.getElementById('rubric-score')
    }, (selectedIndexes) => this.onRubricScoreChange(selectedIndexes));

    this.comp.nav = new ProgressNav({
      grid: document.getElementById('q-nav-grid'),
      btnPrev: document.getElementById('btn-prev'),
      btnNext: document.getElementById('btn-next'),
      btnFlag: document.getElementById('btn-flag'),
      text: document.getElementById('progress-text'),
      bar: document.getElementById('progress-bar')
    }, (dir) => this.navigate(dir), () => this.toggleFlag());

    const timerEl = document.getElementById('eval-timer');
    this.comp.timer = new Timer(timerEl, (secs) => {
      if (this.progreso.estado !== CONFIG.UI.ESTADOS.FINALIZADO) {
        this.progreso.tiempoAcumuladoSegundos = secs;
        if (secs % 10 === 0) this.saveProgress();
        this.comp.timer.render();
      }
    });

    this.comp.nav.buildGrid(this.preguntas, (idx) => this.goToQuestion(idx));
  }

  setupUI() {
    this.title.textContent = this.evaluacion.titulo;
    this.course.textContent = `${this.evaluacion.curso} • ${this.evaluacion.tiempo_limite_minutos} min`;
    this.modeSelector.value = this.progreso.modo;
  }

  bindEvents() {
    this.modeSelector.addEventListener('change', (e) => {
      this.progreso.modo = e.target.value;
      this.saveProgress();
      this.renderCurrentQuestion();
    });

    this.btnFinish.addEventListener('click', () => this.finishEvaluation());
    
    this.btnReset.addEventListener('click', () => {
      if (confirm("¿Estás seguro de reiniciar todo el progreso?")) {
        libraryService.resetProgress(this.evaluacion.id);
        window.location.reload();
      }
    });
  }

  // --- Orquestación de lógica delegada ---

  navigate(dir) {
    if (dir === 'prev' && this.currentIndex > 0) this.goToQuestion(this.currentIndex - 1);
    if (dir === 'next' && this.currentIndex < this.preguntas.length - 1) this.goToQuestion(this.currentIndex + 1);
  }

  goToQuestion(idx) {
    if (idx < 0 || idx >= this.preguntas.length) return;
    this.currentIndex = idx;
    this.progreso.preguntaActualIndex = idx;
    
    const qId = this.preguntas[idx].id;
    if (!this.progreso.preguntasVisitadas.includes(qId)) {
      this.progreso.preguntasVisitadas.push(qId);
    }

    history.replaceState(null, null, `#pregunta-${idx + 1}`);
    this.saveProgress();
    this.renderCurrentQuestion();
  }

  toggleFlag() {
    const qId = this.preguntas[this.currentIndex].id;
    const isFlagged = this.progreso.preguntasMarcadas.includes(qId);
    if (isFlagged) {
      this.progreso.preguntasMarcadas = this.progreso.preguntasMarcadas.filter(id => id !== qId);
    } else {
      this.progreso.preguntasMarcadas.push(qId);
    }
    this.saveProgress();
    this.comp.nav.render(this.currentIndex, this.preguntas.length, this.progreso);
  }

  onHintStateChange(action, val) {
    const qId = this.preguntas[this.currentIndex].id;
    if (action === 'hint') {
      if (!this.progreso.pistasAbiertas[qId]) this.progreso.pistasAbiertas[qId] = 1;
      else if (val === 2) this.progreso.pistasAbiertas[qId] = 2;
    } else if (action === 'solution_opened') {
      if (!this.progreso.solucionesAbiertas.includes(qId)) this.progreso.solucionesAbiertas.push(qId);
    }
    this.saveProgress();
    this.comp.hintPanel.render(this.preguntas[this.currentIndex], this.progreso, this.progreso.modo);
  }

  onRubricScoreChange(selectedIndexes) {
    const qId = this.preguntas[this.currentIndex].id;
    this.progreso.criteriosSeleccionados[qId] = selectedIndexes;
    this.saveProgress();
  }

  renderCurrentQuestion() {
    const q = this.preguntas[this.currentIndex];
    const modo = this.progreso.modo;

    this.comp.qCard.render(q, this.currentIndex);
    this.comp.hintPanel.render(q, this.progreso, modo);
    
    const selected = this.progreso.criteriosSeleccionados[q.id] || [];
    this.comp.rubricPanel.render(q, selected, modo);
    
    this.comp.nav.render(this.currentIndex, this.preguntas.length, this.progreso);
    this.comp.timer.render();
    
    // Deshabilitar botón finalizar si está en lobby (redundante ya que el contenedor está oculto, pero por seguridad)
    this.btnFinish.disabled = (this.progreso.estado === CONFIG.UI.ESTADOS.PENDIENTE);
  }

  finishEvaluation() {
    const respondidas = Object.keys(this.progreso.criteriosSeleccionados || {}).filter(k => this.progreso.criteriosSeleccionados[k].length > 0).length;
    const noRespondidas = this.preguntas.length - respondidas;
    const mins = Math.floor(this.progreso.tiempoAcumuladoSegundos / 60);
    const secs = this.progreso.tiempoAcumuladoSegundos % 60;
    
    const msg = `¿Finalizar evaluación y ver resumen?\n\n` +
                `⏱️ Tiempo utilizado: ${mins}m ${secs}s\n` +
                `✅ Preguntas iniciadas: ${respondidas}\n` +
                `⚠️ Sin iniciar: ${noRespondidas}\n` +
                `🚩 Marcadas: ${this.progreso.preguntasMarcadas.length}\n\n` +
                `Presiona Aceptar para concluir.`;
                
    if (confirm(msg)) {
      this.progreso.estado = CONFIG.UI.ESTADOS.FINALIZADO;
      this.saveProgress();
      alert("Evaluación finalizada. Pasando a Modo Estudio para revisión.");
      this.modeSelector.value = CONFIG.MODOS.ESTUDIO;
      this.modeSelector.dispatchEvent(new Event('change'));
    }
  }

  saveProgress() {
    libraryService.saveProgress(this.evaluacion.id, this.progreso);
  }

  showError(msg) {
    this.loader.style.display = 'none';
    this.errorContainer.style.display = 'block';
    this.errMsg.textContent = msg;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new EvaluacionApp();
});

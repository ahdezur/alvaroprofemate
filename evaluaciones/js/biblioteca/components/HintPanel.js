export class HintPanel {
  constructor(elements, onStateChange) {
    this.els = elements;
    this.onStateChange = onStateChange; // callback al abrir pista
    
    this.bindEvents();
  }

  bindEvents() {
    this.els.btnHint1.addEventListener('click', () => this.handleHintClick(1));
    this.els.btnHint2.addEventListener('click', () => this.handleHintClick(2));
    this.els.btnSolution.addEventListener('click', () => this.toggleSolution());
  }

  handleHintClick(level) {
    this.onStateChange('hint', level);
  }

  toggleSolution() {
    const isVisible = this.els.solutionContainer.classList.contains('visible');
    if (isVisible) {
      this.els.solutionContainer.classList.remove('visible');
      this.els.btnSolution.style.opacity = '1';
    } else {
      this.els.solutionContainer.classList.add('visible');
      this.els.btnSolution.style.opacity = '0.5';
      this.onStateChange('solution_opened', true);
    }
  }

  render(pregunta, progresoPregunta, modo) {
    // Si es modo evaluación estricta, ocultamos todas las herramientas de estudio
    if (modo === 'evaluacion') {
      this.els.toolsContainer.style.display = 'none';
      this.els.hint1Container.classList.remove('visible');
      this.els.hint2Container.classList.remove('visible');
      this.els.solutionContainer.classList.remove('visible');
      return;
    }

    // Modo estudio: mostramos botonera
    this.els.toolsContainer.style.display = 'flex';
    
    // Restablecer vista base de esta nueva pregunta
    this.els.hint1Container.classList.remove('visible');
    this.els.hint2Container.classList.remove('visible');
    this.els.solutionContainer.classList.remove('visible');
    this.els.btnSolution.style.opacity = '1';

    // Rellenar contenido
    this.els.hint1Text.innerHTML = (pregunta.pistas && pregunta.pistas[0]) ? pregunta.pistas[0] : "No hay pista 1.";
    this.els.hint2Text.innerHTML = (pregunta.pistas && pregunta.pistas[1]) ? pregunta.pistas[1] : "No hay pista 2.";
    this.els.solutionText.innerHTML = pregunta.solucion || "Solución no disponible.";
    
    const errores = pregunta.errores_frecuentes || [];
    this.els.errorsList.innerHTML = errores.map(err => `<li>${err}</li>`).join('');

    // Aplicar estado según el progreso
    const hintsOpen = (progresoPregunta.pistasAbiertas && progresoPregunta.pistasAbiertas[pregunta.id]) || 0;
    
    if (hintsOpen >= 1) {
      this.els.hint1Container.classList.add('visible');
      this.els.btnHint1.style.display = 'none';
      this.els.btnHint2.style.display = 'inline-flex';
    } else {
      this.els.btnHint1.style.display = 'inline-flex';
      this.els.btnHint2.style.display = 'none';
    }

    if (hintsOpen >= 2) {
      this.els.hint2Container.classList.add('visible');
      this.els.btnHint2.style.display = 'none';
    }

    // Restaurar estado de la solución
    const isSolutionOpen = progresoPregunta.solucionesAbiertas && progresoPregunta.solucionesAbiertas.includes(pregunta.id);
    if (isSolutionOpen) {
      this.els.solutionContainer.classList.add('visible');
      this.els.btnSolution.style.opacity = '0.5';
    }

    // MathJax local a las pistas/solucion
    this._renderMathJax();
  }

  _renderMathJax() {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([
        this.els.hint1Container, 
        this.els.hint2Container, 
        this.els.solutionContainer
      ]).catch(err => console.warn('Error MathJax en HintPanel:', err));
    }
  }
}

export class ProgressNav {
  constructor(elements, onNavigate, onToggleFlag) {
    this.els = elements;
    this.onNavigate = onNavigate;
    this.onToggleFlag = onToggleFlag;
    
    this.bindEvents();
  }

  bindEvents() {
    this.els.btnPrev.addEventListener('click', () => this.onNavigate('prev'));
    this.els.btnNext.addEventListener('click', () => this.onNavigate('next'));
    this.els.btnFlag.addEventListener('click', () => this.onToggleFlag());
  }

  buildGrid(preguntas, onGoToQuestion) {
    this.els.grid.innerHTML = '';
    preguntas.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'q-nav-btn';
      btn.textContent = preguntas[i].numeracion_personalizada || (i + 1);
      btn.onclick = () => onGoToQuestion(i);
      this.els.grid.appendChild(btn);
    });
  }

  render(currentIndex, totalQuestions, progreso) {
    // 1. Grid classes
    const btns = this.els.grid.children;
    for (let i = 0; i < btns.length; i++) {
      const qId = progreso._qIds[i]; // inyectado para referencia rápida
      btns[i].className = 'q-nav-btn';
      
      if (progreso.preguntasVisitadas.includes(qId)) btns[i].classList.add('visited');
      if (currentIndex === i) btns[i].classList.add('active');
      if (progreso.preguntasMarcadas.includes(qId)) btns[i].classList.add('flagged');
    }

    // 2. Botones Prev/Next
    this.els.btnPrev.disabled = currentIndex === 0;
    this.els.btnNext.disabled = currentIndex === totalQuestions - 1;
    this.els.btnPrev.style.opacity = currentIndex === 0 ? '0.3' : '1';
    this.els.btnNext.style.opacity = currentIndex === totalQuestions - 1 ? '0.3' : '1';

    // 3. Botón Flag (texto dinámico)
    const currentQId = progreso._qIds[currentIndex];
    const isFlagged = progreso.preguntasMarcadas.includes(currentQId);
    if (isFlagged) {
      this.els.btnFlag.innerHTML = `<i class="fa-solid fa-flag"></i> Desmarcar`;
    } else {
      this.els.btnFlag.innerHTML = `<i class="fa-regular fa-flag"></i> Marcar para revisar`;
    }

    // 4. Barra de Progreso
    const visited = progreso.preguntasVisitadas.length;
    this.els.text.textContent = `${visited} / ${totalQuestions} vistas`;
    const perc = totalQuestions > 0 ? (visited / totalQuestions) * 100 : 0;
    this.els.bar.style.width = `${perc}%`;
  }
}

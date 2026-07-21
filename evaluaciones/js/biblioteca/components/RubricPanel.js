export class RubricPanel {
  constructor(elements, onScoreChange) {
    this.els = elements;
    this.onScoreChange = onScoreChange; // Callback al modificar pauta
    
    this.bindEvents();
    this.currentSelected = { metodoIndex: 0, checked: [] };
  }

  bindEvents() {
    this.els.btnRubric.addEventListener('click', () => this.toggleRubric());
  }

  toggleRubric() {
    const isVisible = this.els.container.classList.contains('visible');
    if (isVisible) {
      this.els.container.classList.remove('visible');
      this.els.btnRubric.style.opacity = '1';
    } else {
      this.els.container.classList.add('visible');
      this.els.btnRubric.style.opacity = '0.5';
    }
  }

  render(pregunta, selectedIndexes, modo) {
    if (modo === 'evaluacion') {
      this.els.container.classList.remove('visible');
      return;
    }

    this.els.list.innerHTML = '';
    this.els.container.classList.remove('visible');
    this.els.btnRubric.style.opacity = '1';

    let metodos = pregunta.metodos_resolucion;
    // Fallback para JSON antiguo que no ha sido migrado
    if (!metodos || metodos.length === 0) {
      if (pregunta.criterios_correccion && pregunta.criterios_correccion.length > 0) {
        metodos = [{ nombre: "Única Forma", criterios: pregunta.criterios_correccion }];
      } else {
        this.els.list.innerHTML = '<div style="padding: 15px; color: var(--text-muted);">No hay pauta definida.</div>';
        this.updateScoreDisplay(0, pregunta.puntaje);
        return;
      }
    }

    // Normalizar estado (Soporte retrocompatible para arrays)
    if (selectedIndexes) {
      if (Array.isArray(selectedIndexes)) {
        this.currentSelected = { metodoIndex: 0, checked: [...selectedIndexes] };
      } else {
        this.currentSelected = { metodoIndex: selectedIndexes.metodoIndex || 0, checked: [...(selectedIndexes.checked || [])] };
      }
    } else {
      this.currentSelected = { metodoIndex: 0, checked: [] };
    }

    // Renderizar selector de métodos si hay más de 1
    if (metodos.length > 1) {
      const selectHtml = `
        <div style="padding: 10px 15px; border-bottom: 1px solid var(--border-color); background: var(--bg-tertiary);">
          <label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 5px;">Método de Resolución:</label>
          <select id="metodo-selector" style="width: 100%; padding: 6px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary);">
            ${metodos.map((m, i) => `<option value="${i}" ${i === this.currentSelected.metodoIndex ? 'selected' : ''}>${m.nombre}</option>`).join('')}
          </select>
        </div>
      `;
      this.els.list.innerHTML = selectHtml;
      
      const selector = this.els.list.querySelector('#metodo-selector');
      selector.addEventListener('change', (e) => {
        const newIdx = parseInt(e.target.value);
        this.currentSelected = { metodoIndex: newIdx, checked: [] };
        this.onScoreChange(this.currentSelected);
        this.renderCriterios(metodos, pregunta.puntaje);
      });
    }

    // Contenedor para los criterios
    this.criteriosContainer = document.createElement('div');
    this.els.list.appendChild(this.criteriosContainer);
    
    this.renderCriterios(metodos, pregunta.puntaje);
  }

  renderCriterios(metodos, puntajeMaximo) {
    this.criteriosContainer.innerHTML = '';
    const metodo = metodos[this.currentSelected.metodoIndex];
    if (!metodo) return;

    metodo.criterios.forEach((criterio, i) => {
      const isChecked = this.currentSelected.checked.includes(i) ? 'checked' : '';
      const label = document.createElement('label');
      label.className = 'rubric-item';
      label.innerHTML = `
        <input type="checkbox" value="${i}" ${isChecked} style="accent-color: var(--accent); transform: scale(1.2);">
        <div style="flex-grow: 1;">
          <p style="font-size: 14px; margin-bottom: 2px;">${criterio.descripcion}</p>
        </div>
        <div style="font-weight: 600; color: var(--accent); min-width: 45px; text-align: right;">${criterio.puntaje} pts</div>
      `;

      label.querySelector('input').addEventListener('change', (e) => {
        if (e.target.checked) {
          if (!this.currentSelected.checked.includes(i)) this.currentSelected.checked.push(i);
        } else {
          const idx = this.currentSelected.checked.indexOf(i);
          if (idx > -1) this.currentSelected.checked.splice(idx, 1);
        }
        
        this.onScoreChange(this.currentSelected);
        const score = this.calculateScore(metodo.criterios, this.currentSelected.checked);
        this.updateScoreDisplay(score, puntajeMaximo);
      });

      this.criteriosContainer.appendChild(label);
    });

    const initialScore = this.calculateScore(metodo.criterios, this.currentSelected.checked);
    this.updateScoreDisplay(initialScore, puntajeMaximo);

    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([this.criteriosContainer]).catch(err => console.warn('Error en MathJax:', err));
    }
  }

  calculateScore(criterios, selectedIndexes) {
    return selectedIndexes.reduce((acc, currIdx) => acc + (criterios[currIdx]?.puntaje || 0), 0);
  }

  updateScoreDisplay(currentScore, maxScore) {
    const perc = maxScore > 0 ? (currentScore / maxScore) * 100 : 0;
    this.els.scoreEl.textContent = `${currentScore} / ${maxScore} (${perc.toFixed(0)}%)`;
  }
}

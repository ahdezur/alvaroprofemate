export class QuestionCard {
  constructor(containerIds) {
    this.titleEl = document.getElementById(containerIds.title);
    this.badgesEl = document.getElementById(containerIds.badges);
    this.statementEl = document.getElementById(containerIds.statement);
  }

  render(pregunta, index) {
    this.titleEl.textContent = `Pregunta ${pregunta.numeracion_personalizada || (index + 1)}`;
    
    // Generar badges
    const tagsHTML = (pregunta.temas || []).map(t => `<span class="lib-tag">${t}</span>`).join('');
    this.badgesEl.innerHTML = `
      <span class="lib-tag" style="color:var(--primary); border-color:var(--primary);">
        <i class="fa-solid fa-star"></i> ${pregunta.puntaje} pts
      </span>
      <span class="lib-tag">${pregunta.dificultad}</span>
      ${tagsHTML}
    `;

    // Contexto (si existe)
    let ctxHTML = '';
    if (pregunta.contexto) {
       ctxHTML = `
       <div class="context-box" style="background: var(--bg-secondary); border-left: 4px solid var(--primary); padding: 15px; margin-bottom: 20px; font-size: 14px; border-radius: 4px;">
         <strong style="color:var(--text);"><i class="fa-solid fa-circle-info"></i> Contexto compartido:</strong><br><br>
         ${pregunta.contexto}
       </div>`;
    }

    // Generar enunciado
    this.statementEl.innerHTML = ctxHTML + (pregunta.enunciado || "Enunciado no disponible.");

    // Disparar renderizado asíncrono de MathJax
    this._renderMathJax();
  }

  _renderMathJax() {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([this.statementEl])
        .catch(err => console.warn('Error en MathJax:', err));
    }
  }
}

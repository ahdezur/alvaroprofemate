// State
let evaluacionesData = [];
let preguntasData = [];
let currentEval = null;

// DOM Elements - Evals
const tableBody = document.getElementById('admin-table-body');
const modal = document.getElementById('edit-modal');
const modalTitle = document.getElementById('edit-modal-title');
const form = document.getElementById('edit-form');
const inputId = document.getElementById('edit-id');
const inputTitulo = document.getElementById('edit-titulo');
const inputUniversidad = document.getElementById('edit-universidad');
const inputCurso = document.getElementById('edit-curso');
const inputAno = document.getElementById('edit-ano');
const inputSemestre = document.getElementById('edit-semestre');
const inputTipo = document.getElementById('edit-tipo');
const inputTiempo = document.getElementById('edit-tiempo');
const inputEtiquetas = document.getElementById('edit-etiquetas');
const inputPdf = document.getElementById('edit-pdf-file');
const inputTex = document.getElementById('edit-tex-file');
const btnViewPdf = document.getElementById('btn-view-pdf');
const btnViewTex = document.getElementById('btn-view-tex');
const adjuntosContainer = document.getElementById('adjuntos-actuales');
const btnSaveEval = document.getElementById('btn-save-eval');

// DOM Elements - Questions
const qModal = document.getElementById('questions-modal');
const qTableBody = document.getElementById('questions-table-body');
const qEditModal = document.getElementById('q-edit-modal');
const qEditForm = document.getElementById('q-edit-form');
const qInputId = document.getElementById('q-edit-id');
const qInputEnunciado = document.getElementById('q-edit-enunciado');
const qInputTemas = document.getElementById('q-edit-temas');
const qPreview = document.getElementById('q-edit-preview');
const btnNewQuestion = document.getElementById('btn-new-question');
let mathJaxTimeout = null;

// Initialization
async function init() {
  await fetchEvaluaciones();
  await fetchPreguntas();
  populateDatalists();
  renderTable();
}

async function fetchEvaluaciones() {
  try {
    const response = await fetch('data/evaluaciones.json?t=' + new Date().getTime());
    evaluacionesData = await response.json();
  } catch (err) {
    console.error('Error cargando evaluaciones:', err);
  }
}

async function fetchPreguntas() {
  try {
    const response = await fetch('data/preguntas.json?t=' + new Date().getTime());
    preguntasData = await response.json();
  } catch (err) {
    console.error('Error cargando preguntas:', err);
  }
}

function populateDatalists() {
  const cursos = new Set(), anos = new Set(), semestres = new Set(), tipos = new Set(), universidades = new Set();
  evaluacionesData.forEach(ev => {
    if (ev.curso) cursos.add(ev.curso);
    if (ev.universidad) universidades.add(ev.universidad);
    if (ev.ano) anos.add(ev.ano);
    if (ev.semestre) semestres.add(ev.semestre);
    if (ev.tipo) tipos.add(ev.tipo);
  });
  document.getElementById('list-curso').innerHTML = Array.from(cursos).map(v => `<option value="${v}">`).join('');
  document.getElementById('list-universidad').innerHTML = Array.from(universidades).map(v => `<option value="${v}">`).join('');
  document.getElementById('list-ano').innerHTML = Array.from(anos).sort((a,b)=>b-a).map(v => `<option value="${v}">`).join('');
  document.getElementById('list-semestre').innerHTML = Array.from(semestres).map(v => `<option value="${v}">`).join('');
  document.getElementById('list-tipo').innerHTML = Array.from(tipos).map(v => `<option value="${v}">`).join('');
}

function renderTable() {
  tableBody.innerHTML = '';
  evaluacionesData.forEach(ev => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-family: monospace; font-size: 12px; color: var(--text-secondary);">${ev.id}</td>
      <td style="font-weight: 500; color: var(--text-primary);">${ev.titulo}</td>
      <td>${ev.curso}</td>
      <td>${ev.ano} - ${ev.semestre}</td>
      <td>
        <button class="btn btn-secondary" style="font-size: 12px; padding: 5px 10px; margin-right: 5px;" onclick="openEditModal('${ev.id}')">
          <i class="fa-solid fa-pen"></i> Editar
        </button>
        <button class="btn btn-secondary" style="font-size: 12px; padding: 5px 10px; margin-right: 5px; color: var(--accent);" onclick="openQuestionsModal('${ev.id}')">
          <i class="fa-solid fa-list-ol"></i> Preguntas
        </button>
        <button class="btn btn-secondary" style="font-size: 12px; padding: 5px 10px; color: #ef4444;" onclick="deleteEval('${ev.id}')">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// Global UI Handlers - Evals
window.openCreateModal = () => {
  currentEval = null;
  modalTitle.innerText = "Crear Nueva Evaluación";
  inputId.value = "";
  inputTitulo.value = "";
  inputUniversidad.value = "";
  inputCurso.value = "";
  inputAno.value = new Date().getFullYear();
  inputSemestre.value = "";
  inputTipo.value = "";
  inputTiempo.value = 90;
  inputEtiquetas.value = "";
  inputPdf.value = "";
  inputTex.value = "";
  adjuntosContainer.style.display = 'none';
  modal.classList.add('active');
};

window.openEditModal = (id) => {
  const ev = evaluacionesData.find(e => e.id === id);
  if (!ev) return;
  currentEval = ev;
  modalTitle.innerText = "Editar Evaluación";
  inputId.value = ev.id;
  inputTitulo.value = ev.titulo;
  inputUniversidad.value = ev.universidad || "";
  inputCurso.value = ev.curso;
  inputAno.value = ev.ano;
  inputSemestre.value = ev.semestre;
  inputTipo.value = ev.tipo;
  inputTiempo.value = ev.tiempo_limite_minutos;
  inputEtiquetas.value = ev.etiquetas ? ev.etiquetas.join(', ') : '';
  inputPdf.value = "";
  inputTex.value = "";

  if (ev.pdfUrl || ev.texUrl) {
    adjuntosContainer.style.display = 'flex';
    btnViewPdf.style.display = ev.pdfUrl ? 'inline-block' : 'none';
    btnViewPdf.href = ev.pdfUrl ? '../' + ev.pdfUrl : '#';
    btnViewTex.style.display = ev.texUrl ? 'inline-block' : 'none';
    btnViewTex.href = ev.texUrl ? '../' + ev.texUrl : '#';
  } else {
    adjuntosContainer.style.display = 'none';
  }

  modal.classList.add('active');
};
window.closeEditModal = () => modal.classList.remove('active');

window.deleteEval = async (id) => {
  if (!confirm('¿Estás seguro de eliminar esta evaluación y TODAS sus preguntas de forma permanente?')) return;
  try {
    const res = await fetch(`/api/evaluaciones/${id}`, { method: 'DELETE' });
    if (res.ok) {
      alert('Evaluación eliminada');
      await init();
    } else {
      alert('Error eliminando evaluación');
    }
  } catch(e) {
    console.error(e);
  }
};

window.importLatex = async (input) => {
  if (!input.files || input.files.length === 0) return;
  const formData = new FormData();
  formData.append('archivo', input.files[0]);
  
  try {
    alert('Importando archivo LaTeX. Por favor espera...');
    const res = await fetch('/api/import', { method: 'POST', body: formData });
    if (res.ok) {
      alert('¡Importación completada con éxito!');
      await init();
    } else {
      const err = await res.json();
      alert('Error de importación: ' + (err.error || err.details));
    }
  } catch (error) {
    alert('Error al contactar con el servidor');
  }
  input.value = "";
};


// Global UI Handlers - Questions
window.openQuestionsModal = (id) => {
  const ev = evaluacionesData.find(e => e.id === id);
  if (!ev) return;
  currentEval = ev; // Para saber a quién añadir preguntas
  
  qTableBody.innerHTML = '';
  if (ev.preguntas && ev.preguntas.length > 0) {
    ev.preguntas.forEach(qId => {
      const q = preguntasData.find(p => p.id === qId);
      if (q) {
        let snippet = q.enunciado.replace(/<[^>]*>?/gm, '').substring(0, 80) + '...';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="font-family: monospace; font-size: 11px; color: var(--text-secondary);">${q.id}</td>
          <td style="font-size: 13px; color: var(--text-primary);">${snippet}</td>
          <td>
            <button class="btn btn-secondary" style="font-size: 12px; padding: 5px 10px; margin-right: 5px;" onclick="openQEditModal('${q.id}')">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn btn-secondary" style="font-size: 12px; padding: 5px 10px; color: #ef4444;" onclick="deleteQuestion('${q.id}')">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        `;
        qTableBody.appendChild(tr);
      }
    });
  } else {
    qTableBody.innerHTML = '<tr><td colspan="3">No hay preguntas asociadas.</td></tr>';
  }
  
  qModal.classList.add('active');
};
window.closeQuestionsModal = () => qModal.classList.remove('active');

btnNewQuestion.addEventListener('click', async () => {
  if (!currentEval) return;
  try {
    const res = await fetch('/api/preguntas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evaluacion_id: currentEval.id })
    });
    if (res.ok) {
      await fetchEvaluaciones();
      await fetchPreguntas();
      openQuestionsModal(currentEval.id);
    }
  } catch(e) {
    console.error(e);
  }
});

window.deleteQuestion = async (id) => {
  if (!confirm('¿Seguro que deseas borrar esta pregunta?')) return;
  try {
    const res = await fetch(`/api/preguntas/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evaluacion_id: currentEval.id })
    });
    if (res.ok) {
      await fetchEvaluaciones();
      await fetchPreguntas();
      openQuestionsModal(currentEval.id);
    }
  } catch(e) {
    console.error(e);
  }
};

window.openQEditModal = (id) => {
  const q = preguntasData.find(p => p.id === id);
  if (!q) return;
  qInputId.value = q.id;
  qInputEnunciado.value = q.enunciado.replace(/<br\s*[\/]?>/gi, '\n');
  qInputTemas.value = q.temas ? q.temas.join(', ') : '';
  updateMathJaxPreview();
  qEditModal.classList.add('active');
};
window.closeQEditModal = () => qEditModal.classList.remove('active');

function updateMathJaxPreview() {
  const htmlText = qInputEnunciado.value.replace(/\n/g, '<br>');
  qPreview.innerHTML = htmlText;
  if (window.MathJax) {
    window.MathJax.typesetPromise([qPreview]).catch((err) => console.log(err.message));
  }
}

qInputEnunciado.addEventListener('input', () => {
  clearTimeout(mathJaxTimeout);
  mathJaxTimeout = setTimeout(() => updateMathJaxPreview(), 500);
});

// Eval Form Submit (POST or PUT)
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  btnSaveEval.disabled = true;
  btnSaveEval.innerHTML = 'Guardando...';
  
  const id = inputId.value;
  let newPdfUrl = currentEval ? currentEval.pdfUrl : undefined;
  let newTexUrl = currentEval ? currentEval.texUrl : undefined;
  
  try {
    if (inputPdf.files.length > 0) {
      const formData = new FormData();
      formData.append('archivo', inputPdf.files[0]);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        newPdfUrl = data.url;
      }
    }
    
    if (inputTex.files.length > 0) {
      const formData = new FormData();
      formData.append('archivo', inputTex.files[0]);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        newTexUrl = data.url;
      }
    }

    const newMeta = {
      titulo: inputTitulo.value,
      universidad: inputUniversidad.value,
      curso: inputCurso.value,
      ano: inputAno.value,
      semestre: inputSemestre.value,
      tipo: inputTipo.value,
      tiempo_limite_minutos: inputTiempo.value,
      etiquetas: inputEtiquetas.value.split(',').map(s => s.trim()).filter(s => s),
      pdfUrl: newPdfUrl,
      texUrl: newTexUrl
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/evaluaciones/${id}` : '/api/evaluaciones';

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMeta)
    });

    if (res.ok) {
      alert('Evaluación guardada exitosamente');
      closeEditModal();
      await init();
    } else {
      const err = await res.json();
      alert('Error guardando: ' + err.error);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al guardar datos o archivos.');
  } finally {
    btnSaveEval.disabled = false;
    btnSaveEval.innerHTML = 'Guardar Cambios';
  }
});

// Question Edit Form Submit
qEditForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = qInputId.value;
  const newEnunciado = qInputEnunciado.value.replace(/\n/g, '<br>');
  const newTemas = qInputTemas.value.split(',').map(s => s.trim()).filter(s => s);
  
  try {
    const res = await fetch(`/api/preguntas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enunciado: newEnunciado, temas: newTemas })
    });
    
    if (res.ok) {
      alert('Pregunta actualizada exitosamente');
      closeQEditModal();
      await fetchPreguntas();
      openQuestionsModal(currentEval.id);
    } else {
      const err = await res.json();
      alert('Error guardando pregunta: ' + err.error);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión al guardar pregunta.');
  }
});

init();

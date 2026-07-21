const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { exec } = require('child_process');

const app = express();
const PORT = 8081;

// Configuración de Multer para subir archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'data', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/ /g, '_'));
  }
});
const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos
const WEB_ROOT = path.join(__dirname, '..');
app.use(express.static(WEB_ROOT));

const EVALUACIONES_FILE = path.join(__dirname, 'data', 'evaluaciones.json');
const PREGUNTAS_FILE = path.join(__dirname, 'data', 'preguntas.json');

// POST /api/upload
app.post('/api/upload', upload.single('archivo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });
  res.json({ url: `evaluaciones/data/uploads/${req.file.filename}`, filename: req.file.filename, path: req.file.path });
});

// POST /api/import
app.post('/api/import', upload.single('archivo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se subió plantilla LaTeX' });
  
  const filePath = req.file.path;
  const importScript = path.join(__dirname, 'data', 'import_v2.js');
  
  exec(`node "${importScript}" "${filePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error de importación: ${error}`);
      return res.status(500).json({ error: 'Error al parsear archivo LaTeX', details: stderr });
    }
    res.json({ message: 'Evaluación importada con éxito', log: stdout });
  });
});

// POST /api/evaluaciones (Crear desde cero)
app.post('/api/evaluaciones', (req, res) => {
  const newMeta = req.body;
  try {
    const data = JSON.parse(fs.readFileSync(EVALUACIONES_FILE, 'utf8'));
    const newEval = {
      id: 'eval-' + Date.now(),
      titulo: newMeta.titulo || 'Nueva Evaluación',
      descripcion: newMeta.descripcion || '',
      curso: newMeta.curso || '',
      universidad: newMeta.universidad || '',
      ano: parseInt(newMeta.ano) || new Date().getFullYear(),
      semestre: newMeta.semestre || '',
      tipo: newMeta.tipo || '',
      tiempo_limite_minutos: parseInt(newMeta.tiempo_limite_minutos) || 90,
      etiquetas: newMeta.etiquetas || [],
      preguntas: []
    };
    data.push(newEval);
    fs.writeFileSync(EVALUACIONES_FILE, JSON.stringify(data, null, 2));
    res.json({ message: 'Evaluación creada', data: newEval });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear' });
  }
});

// PUT /api/evaluaciones/:id (Actualizar)
app.put('/api/evaluaciones/:id', (req, res) => {
  const { id } = req.params;
  const newMeta = req.body;
  try {
    const data = JSON.parse(fs.readFileSync(EVALUACIONES_FILE, 'utf8'));
    const index = data.findIndex(e => e.id === id);
    if (index === -1) return res.status(404).json({ error: 'No encontrada' });

    const evalObj = data[index];
    evalObj.titulo = newMeta.titulo || evalObj.titulo;
    evalObj.curso = newMeta.curso || evalObj.curso;
    evalObj.ano = parseInt(newMeta.ano) || evalObj.ano;
    evalObj.semestre = newMeta.semestre || evalObj.semestre;
    evalObj.tipo = newMeta.tipo || evalObj.tipo;
    evalObj.tiempo_limite_minutos = parseInt(newMeta.tiempo_limite_minutos) || evalObj.tiempo_limite_minutos;
    
    if (newMeta.etiquetas) evalObj.etiquetas = newMeta.etiquetas;
    if (newMeta.pdfUrl !== undefined) evalObj.pdfUrl = newMeta.pdfUrl;
    if (newMeta.texUrl !== undefined) evalObj.texUrl = newMeta.texUrl;

    fs.writeFileSync(EVALUACIONES_FILE, JSON.stringify(data, null, 2));
    res.json({ message: 'Actualizada con éxito', data: evalObj });
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// DELETE /api/evaluaciones/:id
app.delete('/api/evaluaciones/:id', (req, res) => {
  const { id } = req.params;
  try {
    let data = JSON.parse(fs.readFileSync(EVALUACIONES_FILE, 'utf8'));
    const index = data.findIndex(e => e.id === id);
    if (index === -1) return res.status(404).json({ error: 'No encontrada' });
    
    const evalObj = data[index];
    const preguntasToDelete = evalObj.preguntas || [];
    
    data.splice(index, 1);
    fs.writeFileSync(EVALUACIONES_FILE, JSON.stringify(data, null, 2));
    
    // Borrado en cascada
    if (preguntasToDelete.length > 0) {
      let pData = JSON.parse(fs.readFileSync(PREGUNTAS_FILE, 'utf8'));
      pData = pData.filter(p => !preguntasToDelete.includes(p.id));
      fs.writeFileSync(PREGUNTAS_FILE, JSON.stringify(pData, null, 2));
    }
    
    res.json({ message: 'Evaluación y sus preguntas eliminadas' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

// POST /api/preguntas (Crear nueva pregunta vacía)
app.post('/api/preguntas', (req, res) => {
  const { evaluacion_id } = req.body;
  try {
    let eData = JSON.parse(fs.readFileSync(EVALUACIONES_FILE, 'utf8'));
    const eIndex = eData.findIndex(e => e.id === evaluacion_id);
    if (eIndex === -1) return res.status(404).json({ error: 'Evaluación no encontrada' });
    
    let pData = JSON.parse(fs.readFileSync(PREGUNTAS_FILE, 'utf8'));
    const newP = {
      id: 'pregunta-' + Date.now(),
      enunciado: 'Nueva pregunta...',
      puntaje: 10,
      dificultad: 'Media',
      temas: [],
      pistas: [],
      solucion: 'Solución pendiente.',
      criterios_correccion: []
    };
    pData.push(newP);
    fs.writeFileSync(PREGUNTAS_FILE, JSON.stringify(pData, null, 2));
    
    eData[eIndex].preguntas.push(newP.id);
    fs.writeFileSync(EVALUACIONES_FILE, JSON.stringify(eData, null, 2));
    
    res.json({ message: 'Pregunta creada', data: newP });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear pregunta' });
  }
});

// PUT /api/preguntas/:id
app.put('/api/preguntas/:id', (req, res) => {
  const { id } = req.params;
  const newMeta = req.body;
  try {
    const data = JSON.parse(fs.readFileSync(PREGUNTAS_FILE, 'utf8'));
    const index = data.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'No encontrada' });

    const pObj = data[index];
    if (newMeta.enunciado !== undefined) pObj.enunciado = newMeta.enunciado;
    if (newMeta.temas && Array.isArray(newMeta.temas)) pObj.temas = newMeta.temas;

    fs.writeFileSync(PREGUNTAS_FILE, JSON.stringify(data, null, 2));
    res.json({ message: 'Actualizada con éxito', data: pObj });
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// DELETE /api/preguntas/:id
app.delete('/api/preguntas/:id', (req, res) => {
  const { id } = req.params;
  const { evaluacion_id } = req.body; // para remover del array
  try {
    let pData = JSON.parse(fs.readFileSync(PREGUNTAS_FILE, 'utf8'));
    pData = pData.filter(p => p.id !== id);
    fs.writeFileSync(PREGUNTAS_FILE, JSON.stringify(pData, null, 2));
    
    if (evaluacion_id) {
      let eData = JSON.parse(fs.readFileSync(EVALUACIONES_FILE, 'utf8'));
      const eIndex = eData.findIndex(e => e.id === evaluacion_id);
      if (eIndex !== -1) {
        eData[eIndex].preguntas = eData[eIndex].preguntas.filter(qId => qId !== id);
        fs.writeFileSync(EVALUACIONES_FILE, JSON.stringify(eData, null, 2));
      }
    }
    
    res.json({ message: 'Pregunta eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar pregunta' });
  }
});

app.listen(PORT, () => {
  console.log(`\n===========================================`);
  console.log(`🚀 Servidor CMS Educativo iniciado`);
  console.log(`🌐 Interfaz Estudiante: http://localhost:${PORT}/evaluaciones/`);
  console.log(`🔒 Panel Admin:       http://localhost:${PORT}/evaluaciones/admin.html`);
  console.log(`===========================================\n`);
});

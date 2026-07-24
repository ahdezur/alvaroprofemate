/**
 * Visualizador Interactivo 3D de Curvas de Nivel (Campos Escalares z = f(x,y))
 * 
 * Este script administra la escena 3D con Three.js (eje Z vertical),
 * la generación de superficies 3D, extracción de curvas de nivel (contornos),
 * líneas de proyección vertical, plano de corte interactivo z = k,
 * etiquetas numéricas flotantes y escalado de fuentes.
 */

// -------------------------------------------------------------
// 1. Estado Global y Parámetros
// -------------------------------------------------------------
const container = document.getElementById('canvas-container');

// Estado de la función y corte
let currentFuncKey = 'two_peaks';
let heightK = 20.0;
let numLevels = 5;
let surfaceOpacity = 0.65;
let planeOpacity = 0.45;
let animateSweep = false;
let sweepDirection = 1;

// Escalado de fuente para accesibilidad
let fontScale = 1.0;

// Objetos Three.js
let scene, camera, renderer, controls;
let surfaceGroup, slicingPlaneGroup, contours3DGroup, projectionsGroup, contours2DGroup;
let axesGroup, gridGroup;

// Almacén de etiquetas HTML y posiciones 3D
const labelPositions = [];
let labelElements = [];

// Transición de cámara suave
let isTransitioning = false;
const targetCameraPos = new THREE.Vector3(14, -14, 12);
const targetCameraLookAt = new THREE.Vector3(0, 0, 8);

// -------------------------------------------------------------
// 2. Definición de Funciones de Superficies z = f(x,y)
// Proporciones amplias (gráficas más anchas y menos altas)
// -------------------------------------------------------------
const functionsMap = {
    two_peaks: {
        name: 'Dos Colinas (Dos Picos)',
        eqLatex: 'z = 25 e^{-\\frac{(x-2.2)^2 + (y-0.8)^2}{9}} + 16 e^{-\\frac{(x+3.0)^2 + (y+1.8)^2}{10}}',
        f: (x, y) => {
            const peak1 = 25 * Math.exp(-((x - 2.2) ** 2 + (y - 0.8) ** 2) / 9.0);
            const peak2 = 16 * Math.exp(-((x + 3.0) ** 2 + (y + 1.8) ** 2) / 10.0);
            return peak1 + peak2;
        },
        rangeX: [-7.5, 7.5],
        rangeY: [-6.0, 6.0],
        maxZ: 28,
        minZ: 0
    },
    paraboloid: {
        name: 'Paraboloide Elíptico',
        eqLatex: 'z = 0.4(x^2 + y^2)',
        f: (x, y) => 0.4 * (x * x + y * y),
        rangeX: [-7.0, 7.0],
        rangeY: [-7.0, 7.0],
        maxZ: 20,
        minZ: 0
    },
    saddle: {
        name: 'Silla de Montar',
        eqLatex: 'z = 0.45(x^2 - y^2) + 15',
        f: (x, y) => 0.45 * (x * x - y * y) + 15,
        rangeX: [-6.5, 6.5],
        rangeY: [-6.5, 6.5],
        maxZ: 30,
        minZ: 0
    },
    sombrero: {
        name: 'Ondas Radiales (Sombrero)',
        eqLatex: 'z = 14 \\frac{\\cos(\\sqrt{x^2+y^2})}{1 + 0.04(x^2+y^2)} + 12',
        f: (x, y) => {
            const r = Math.sqrt(x * x + y * y);
            return 14 * (Math.cos(r) / (1 + 0.04 * r * r)) + 12;
        },
        rangeX: [-8.0, 8.0],
        rangeY: [-8.0, 8.0],
        maxZ: 25,
        minZ: 0
    }
};

// -------------------------------------------------------------
// 3. Elementos de la Interfaz (DOM)
// -------------------------------------------------------------
const selectFunction = document.getElementById('select-function');
const sliderHeight = document.getElementById('slider-height');
const sliderLevels = document.getElementById('slider-levels');
const sliderSurfaceOpacity = document.getElementById('slider-surface-opacity');
const sliderPlaneOpacity = document.getElementById('slider-plane-opacity');

const valHeight = document.getElementById('val-height');
const valLevels = document.getElementById('val-levels');
const valSurfaceOpacity = document.getElementById('val-surface-opacity');
const valPlaneOpacity = document.getElementById('val-plane-opacity');

const readoutHeight = document.getElementById('readout-height');
const readoutEq = document.getElementById('readout-eq');
const readoutLevelsCount = document.getElementById('readout-levels-count');

const btnPlaySweep = document.getElementById('btn-play-sweep');
const btnViewIso = document.getElementById('btn-view-iso');
const btnViewTop = document.getElementById('btn-view-top');
const btnViewFront = document.getElementById('btn-view-front');

const btnFontIncrease = document.getElementById('btn-font-increase');
const btnFontDecrease = document.getElementById('btn-font-decrease');
const btnToggleInfo = document.getElementById('btn-toggle-info');
const btnToggleControls = document.getElementById('btn-toggle-controls');

const toggleSurface = document.getElementById('toggle-surface');
const togglePlane = document.getElementById('toggle-plane');
const toggleContours3D = document.getElementById('toggle-contours-3d');
const toggleProjections = document.getElementById('toggle-projections');
const toggleContours2D = document.getElementById('toggle-contours-2d');
const toggleGrid = document.getElementById('toggle-grid');
const toggleAxes = document.getElementById('toggle-axes');
const toggleLabels = document.getElementById('toggle-labels');

const infoCard = document.querySelector('.info-card');
const controlsCard = document.querySelector('.controls-card');

// -------------------------------------------------------------
// 4. Inicialización de la Escena WebGL
// -------------------------------------------------------------
function init() {
    scene = new THREE.Scene();

    // Cámara en perspectiva con eje Z VERTICAL (camera.up.set(0, 0, 1))
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.up.set(0, 0, 1);
    camera.position.copy(targetCameraPos);

    // Renderer WebGL con antialiasing y fondo transparente
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.copy(targetCameraLookAt);

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(10, -10, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x3b82f6, 0.3);
    dirLight2.position.set(-10, 10, -5);
    scene.add(dirLight2);

    // Grupos de Mallas
    gridGroup = new THREE.Group();
    axesGroup = new THREE.Group();
    surfaceGroup = new THREE.Group();
    slicingPlaneGroup = new THREE.Group();
    contours3DGroup = new THREE.Group();
    projectionsGroup = new THREE.Group();
    contours2DGroup = new THREE.Group();

    scene.add(gridGroup);
    scene.add(axesGroup);
    scene.add(surfaceGroup);
    scene.add(slicingPlaneGroup);
    scene.add(contours3DGroup);
    scene.add(projectionsGroup);
    scene.add(contours2DGroup);

    // Construcción inicial
    rebuildGridAndAxes();
    rebuildAll();

    // Eventos
    window.addEventListener('resize', onWindowResize);
    setupEvents();
}

// -------------------------------------------------------------
// 5. Auxiliares de Limpieza de Mallas GPU
// -------------------------------------------------------------
function disposeHierarchy(obj) {
    obj.traverse(child => {
        if (child.isMesh || child.isLine) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        }
    });
    obj.clear();
}

function clearLabels() {
    labelElements.forEach(el => el.remove());
    labelElements = [];
    labelPositions.length = 0;
}

// -------------------------------------------------------------
// 6. Ejes y Plano Base z = 0
// -------------------------------------------------------------
function rebuildGridAndAxes() {
    disposeHierarchy(gridGroup);
    disposeHierarchy(axesGroup);

    const funcObj = functionsMap[currentFuncKey];
    const L = Math.max(Math.abs(funcObj.rangeX[0]), Math.abs(funcObj.rangeX[1])) * 1.2;

    // Plano Base Grid (z = 0)
    if (toggleGrid.checked) {
        const gridHelper = new THREE.GridHelper(L * 2, 20, 0x94a3b8, 0xcbd5e1);
        gridHelper.rotation.x = Math.PI / 2;
        gridHelper.position.z = -0.01;
        gridGroup.add(gridHelper);
    }

    // Ejes XYZ 3D
    if (toggleAxes.checked) {
        const len = L * 1.1;
        const rad = 0.02;

        createArrow(new THREE.Vector3(len, 0, 0), 0xef4444); // X (Rojo)
        createArrow(new THREE.Vector3(0, len, 0), 0x22c55e); // Y (Verde)
        createArrow(new THREE.Vector3(0, 0, funcObj.maxZ * 1.1), 0x3b82f6); // Z (Azul)
    }

    function createArrow(endpoint, colorHex) {
        const dir = endpoint.clone().normalize();
        const cylinderGeo = new THREE.CylinderGeometry(0.02, 0.02, endpoint.length() - 0.3, 8);
        const mat = new THREE.MeshBasicMaterial({ color: colorHex });
        const cylinder = new THREE.Mesh(cylinderGeo, mat);
        
        cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        cylinder.position.copy(dir).multiplyScalar((endpoint.length() - 0.3) / 2);
        axesGroup.add(cylinder);

        const coneGeo = new THREE.ConeGeometry(0.08, 0.3, 8);
        const cone = new THREE.Mesh(coneGeo, mat);
        cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        cone.position.copy(endpoint);
        axesGroup.add(cone);
    }
}

// -------------------------------------------------------------
// 7. Generación de la Superficie 3D z = f(x,y)
// -------------------------------------------------------------
function buildSurface() {
    disposeHierarchy(surfaceGroup);
    if (!toggleSurface.checked) return;

    const funcObj = functionsMap[currentFuncKey];
    const steps = 80;
    const [minX, maxX] = funcObj.rangeX;
    const [minY, maxY] = funcObj.rangeY;

    const geom = new THREE.PlaneGeometry(maxX - minX, maxY - minY, steps, steps);
    const posAttr = geom.attributes.position;

    // PlaneGeometry por defecto se crea en XY. Las coordenadas son (x, y, 0)
    for (let i = 0; i < posAttr.count; i++) {
        const u = posAttr.getX(i);
        const v = posAttr.getY(i);
        // Map u, v to world x, y
        const x = minX + ((u + (maxX - minX) / 2) / (maxX - minX)) * (maxX - minX);
        const y = minY + ((v + (maxY - minY) / 2) / (maxY - minY)) * (maxY - minY);
        const z = funcObj.f(x, y);

        // PlaneGeometry local Z se convierte en world Z cuando se rota
        posAttr.setZ(i, z);
    }

    geom.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: surfaceOpacity,
        side: THREE.DoubleSide,
        wireframe: false
    });

    const mesh = new THREE.Mesh(geom, mat);
    surfaceGroup.add(mesh);

    // Malla de alambre sutil para textura de terreno
    const wireMat = new THREE.MeshBasicMaterial({
        color: 0x1e40af,
        wireframe: true,
        transparent: true,
        opacity: 0.12
    });
    const wireMesh = new THREE.Mesh(geom, wireMat);
    surfaceGroup.add(wireMesh);
}

// -------------------------------------------------------------
// 8. Algoritmo de Extracción de Curvas de Nivel (Marching Grid)
// -------------------------------------------------------------
function extractContourLines(kVal) {
    const funcObj = functionsMap[currentFuncKey];
    const gridN = 75;
    const [minX, maxX] = funcObj.rangeX;
    const [minY, maxY] = funcObj.rangeY;

    const dx = (maxX - minX) / gridN;
    const dy = (maxY - minY) / gridN;

    // Evaluar la rejilla
    const gridVals = new Float32Array((gridN + 1) * (gridN + 1));
    for (let j = 0; j <= gridN; j++) {
        const y = minY + j * dy;
        for (let i = 0; i <= gridN; i++) {
            const x = minX + i * dx;
            gridVals[j * (gridN + 1) + i] = funcObj.f(x, y);
        }
    }

    const segments = [];

    // Marching Squares simple en cada celda quad
    for (let j = 0; j < gridN; j++) {
        const y0 = minY + j * dy;
        const y1 = y0 + dy;

        for (let i = 0; i < gridN; i++) {
            const x0 = minX + i * dx;
            const x1 = x0 + dx;

            const v00 = gridVals[j * (gridN + 1) + i];
            const v10 = gridVals[j * (gridN + 1) + (i + 1)];
            const v11 = gridVals[(j + 1) * (gridN + 1) + (i + 1)];
            const v01 = gridVals[(j + 1) * (gridN + 1) + i];

            const pts = [];

            // Intersección en arista bottom (v00 -> v10)
            if ((v00 - kVal) * (v10 - kVal) <= 0 && v00 !== v10) {
                const t = (kVal - v00) / (v10 - v00);
                pts.push(new THREE.Vector2(x0 + t * dx, y0));
            }
            // Intersección en arista right (v10 -> v11)
            if ((v10 - kVal) * (v11 - kVal) <= 0 && v10 !== v11) {
                const t = (kVal - v10) / (v11 - v10);
                pts.push(new THREE.Vector2(x1, y0 + t * dy));
            }
            // Intersección en arista top (v11 -> v01)
            if ((v11 - kVal) * (v01 - kVal) <= 0 && v11 !== v01) {
                const t = (kVal - v11) / (v01 - v11);
                pts.push(new THREE.Vector2(x1 - t * dx, y1));
            }
            // Intersección en arista left (v01 -> v00)
            if ((v01 - kVal) * (v00 - kVal) <= 0 && v01 !== v00) {
                const t = (kVal - v01) / (v00 - v01);
                pts.push(new THREE.Vector2(x0, y1 - t * dy));
            }

            if (pts.length >= 2) {
                segments.push(pts[0], pts[1]);
                if (pts.length === 4) {
                    segments.push(pts[2], pts[3]);
                }
            }
        }
    }

    return segments;
}

// -------------------------------------------------------------
// 9. Construcción de Contornos, Proyecciones y Plano $z=k$
// -------------------------------------------------------------
function rebuildContoursAndPlane() {
    disposeHierarchy(slicingPlaneGroup);
    disposeHierarchy(contours3DGroup);
    disposeHierarchy(projectionsGroup);
    disposeHierarchy(contours2DGroup);
    clearLabels();

    const funcObj = functionsMap[currentFuncKey];
    const [minX, maxX] = funcObj.rangeX;
    const [minY, maxY] = funcObj.rangeY;
    const widthX = maxX - minX;
    const widthY = maxY - minY;

    // 1. Plano de Corte Interactivo z = k
    if (togglePlane.checked) {
        const planeGeo = new THREE.PlaneGeometry(widthX * 1.1, widthY * 1.1);
        const planeMat = new THREE.MeshStandardMaterial({
            color: 0x0284c7,
            transparent: true,
            opacity: planeOpacity,
            side: THREE.DoubleSide,
            roughness: 0.1
        });
        const planeMesh = new THREE.Mesh(planeGeo, planeMat);
        planeMesh.position.z = heightK;
        slicingPlaneGroup.add(planeMesh);

        // Borde fino del plano
        const edgesGeo = new THREE.EdgesGeometry(planeGeo);
        const edgesMat = new THREE.LineBasicMaterial({ color: 0x0284c7, linewidth: 2 });
        const planeEdges = new THREE.LineSegments(edgesGeo, edgesMat);
        planeEdges.position.z = heightK;
        slicingPlaneGroup.add(planeEdges);
    }

    // Calcular valores de nivel de contorno a dibujar (múltiples niveles fijos + nivel activo k)
    const levelHeights = [];
    const stepK = (funcObj.maxZ - funcObj.minZ) / (numLevels + 1);
    for (let l = 1; l <= numLevels; l++) {
        levelHeights.push(funcObj.minZ + l * stepK);
    }

    // Agregar el nivel k activo si no está ya presente
    let kActiveIncluded = false;
    levelHeights.forEach(h => {
        if (Math.abs(h - heightK) < 0.5) kActiveIncluded = true;
    });
    if (!kActiveIncluded) {
        levelHeights.push(heightK);
    }

    levelHeights.sort((a, b) => a - b);

    // Iterar sobre cada altura de nivel
    levelHeights.forEach(k => {
        const isCurrentK = Math.abs(k - heightK) < 0.1;
        const segments2D = extractContourLines(k);
        if (segments2D.length === 0) return;

        const vertices3D = [];
        const vertices2D = [];
        const projectionLinesPts = [];

        let sampleLabelPt3D = null;
        let sampleLabelPt2D = null;

        for (let i = 0; i < segments2D.length; i += 2) {
            const p1 = segments2D[i];
            const p2 = segments2D[i + 1];

            // 3D contour points on surface z = k
            vertices3D.push(p1.x, p1.y, k);
            vertices3D.push(p2.x, p2.y, k);

            // 2D contour points on ground z = 0
            vertices2D.push(p1.x, p1.y, 0.005);
            vertices2D.push(p2.x, p2.y, 0.005);

            // Seleccionar muestras para líneas de proyección vertical y etiquetas
            if (i % 12 === 0) {
                projectionLinesPts.push(
                    new THREE.Vector3(p1.x, p1.y, k),
                    new THREE.Vector3(p1.x, p1.y, 0)
                );
            }

            if (i === Math.floor(segments2D.length / 4) * 2) {
                sampleLabelPt3D = new THREE.Vector3(p1.x, p1.y, k);
                sampleLabelPt2D = new THREE.Vector3(p1.x, p1.y, 0.01);
            }
        }

        // Color y grosor de línea
        const contourColor = isCurrentK ? 0xea580c : 0xf97316; // Naranja intenso para k activo

        // 3D Contours Mesh
        if (toggleContours3D.checked) {
            const geo3D = new THREE.BufferGeometry();
            geo3D.setAttribute('position', new THREE.Float32BufferAttribute(vertices3D, 3));
            const mat3D = new THREE.LineBasicMaterial({
                color: contourColor,
                linewidth: isCurrentK ? 3 : 2
            });
            const lines3D = new THREE.LineSegments(geo3D, mat3D);
            contours3DGroup.add(lines3D);
        }

        // 2D Ground Contours Mesh (z = 0)
        if (toggleContours2D.checked) {
            const geo2D = new THREE.BufferGeometry();
            geo2D.setAttribute('position', new THREE.Float32BufferAttribute(vertices2D, 3));
            const mat2D = new THREE.LineBasicMaterial({
                color: contourColor,
                linewidth: isCurrentK ? 2.5 : 1.5
            });
            const lines2D = new THREE.LineSegments(geo2D, mat2D);
            contours2DGroup.add(lines2D);
        }

        // Vertical Projections Dashed Lines
        if (toggleProjections.checked && (isCurrentK || numLevels <= 5)) {
            const projGeo = new THREE.BufferGeometry().setFromPoints(projectionLinesPts);
            const projMat = new THREE.LineDashedMaterial({
                color: 0x94a3b8,
                dashSize: 0.2,
                gapSize: 0.15,
                linewidth: 1
            });
            const projLines = new THREE.LineSegments(projGeo, projMat);
            projLines.computeLineDistances();
            projectionsGroup.add(projLines);
        }

        // Registrar etiquetas numéricas ($10, 20, 30...$)
        if (toggleLabels.checked && sampleLabelPt3D) {
            const labelValStr = Math.round(k).toString();

            // Etiquetas en 3D (sobre el corte)
            if (toggleContours3D.checked) {
                createLabelDOM(labelValStr, sampleLabelPt3D, false);
            }
            // Etiquetas en 2D (sobre el suelo z=0)
            if (toggleContours2D.checked) {
                createLabelDOM(labelValStr, sampleLabelPt2D, true);
            }
        }
    });
}

function createLabelDOM(text, pos3D, isGround) {
    const el = document.createElement('div');
    el.className = `three-label ${isGround ? 'three-label-ground' : ''}`;
    el.innerHTML = text;
    document.body.appendChild(el);

    labelElements.push(el);
    labelPositions.push({ el, pos3D });
}

// -------------------------------------------------------------
// 10. Proyección de Etiquetas HTML sobre Lienzo 3D
// -------------------------------------------------------------
function projectLabels() {
    if (!toggleLabels.checked) {
        labelElements.forEach(el => el.style.display = 'none');
        return;
    }

    labelPositions.forEach(item => {
        const { el, pos3D } = item;
        const tempV = pos3D.clone();
        tempV.project(camera);

        if (tempV.z > 1) {
            el.style.display = 'none';
            return;
        }

        const x = (tempV.x * 0.5 + 0.5) * window.innerWidth;
        const y = (tempV.y * -0.5 + 0.5) * window.innerHeight;

        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.display = 'block';
    });
}

// -------------------------------------------------------------
// 11. Bucle de Animación y Renderizado
// -------------------------------------------------------------
function animate() {
    requestAnimationFrame(animate);

    // Glides de cámara automáticos
    if (isTransitioning) {
        camera.position.lerp(targetCameraPos, 0.08);
        controls.target.lerp(targetCameraLookAt, 0.08);
        controls.update();
        if (camera.position.distanceTo(targetCameraPos) < 0.01) {
            isTransitioning = false;
        }
    } else {
        controls.update();
    }

    // Animación de barrido del plano z = k
    if (animateSweep) {
        const funcObj = functionsMap[currentFuncKey];
        heightK += 0.25 * sweepDirection;
        if (heightK >= funcObj.maxZ - 2) {
            heightK = funcObj.maxZ - 2;
            sweepDirection = -1;
        } else if (heightK <= funcObj.minZ + 1) {
            heightK = funcObj.minZ + 1;
            sweepDirection = 1;
        }

        sliderHeight.value = heightK.toFixed(1);
        valHeight.innerHTML = heightK.toFixed(1);
        readoutHeight.innerHTML = heightK.toFixed(1);
        readoutEq.innerHTML = `f(x,y) = ${heightK.toFixed(1)}`;

        rebuildContoursAndPlane();
    }

    renderer.render(scene, camera);
    projectLabels();
}

function rebuildAll() {
    const funcObj = functionsMap[currentFuncKey];
    
    // Configurar rangos del slider de altura según la función
    sliderHeight.min = funcObj.minZ;
    sliderHeight.max = funcObj.maxZ;
    if (heightK > funcObj.maxZ || heightK < funcObj.minZ) {
        heightK = (funcObj.maxZ + funcObj.minZ) / 2;
        sliderHeight.value = heightK.toFixed(1);
        valHeight.innerHTML = heightK.toFixed(1);
    }

    readoutHeight.innerHTML = heightK.toFixed(1);
    readoutEq.innerHTML = `f(x,y) = ${heightK.toFixed(1)}`;
    readoutLevelsCount.innerHTML = `${numLevels} Niveles`;

    // Reconstrucción completa de la escena 3D
    rebuildGridAndAxes();
    buildSurface();
    rebuildContoursAndPlane();

    // Re-renderizar fórmulas de MathJax si está disponible
    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise();
    }
}

// -------------------------------------------------------------
// 12. Control de Eventos de la Interfaz
// -------------------------------------------------------------
function setupEvents() {
    // Selector de Función
    selectFunction.addEventListener('change', (e) => {
        currentFuncKey = e.target.value;
        rebuildAll();
    });

    // Sliders
    sliderHeight.addEventListener('input', (e) => {
        heightK = parseFloat(e.target.value);
        valHeight.innerHTML = heightK.toFixed(1);
        readoutHeight.innerHTML = heightK.toFixed(1);
        readoutEq.innerHTML = `f(x,y) = ${heightK.toFixed(1)}`;
        rebuildContoursAndPlane();
    });

    sliderLevels.addEventListener('input', (e) => {
        numLevels = parseInt(e.target.value);
        valLevels.innerHTML = numLevels;
        readoutLevelsCount.innerHTML = `${numLevels} Niveles`;
        rebuildContoursAndPlane();
    });

    sliderSurfaceOpacity.addEventListener('input', (e) => {
        surfaceOpacity = parseFloat(e.target.value);
        valSurfaceOpacity.innerHTML = surfaceOpacity.toFixed(2);
        buildSurface();
    });

    sliderPlaneOpacity.addEventListener('input', (e) => {
        planeOpacity = parseFloat(e.target.value);
        valPlaneOpacity.innerHTML = planeOpacity.toFixed(2);
        rebuildContoursAndPlane();
    });

    // Botón de Animación de Barrido
    btnPlaySweep.addEventListener('click', () => {
        animateSweep = !animateSweep;
        if (animateSweep) {
            btnPlaySweep.classList.add('btn-play-active');
            btnPlaySweep.querySelector('span').innerHTML = "Pausar Barrido z=k";
        } else {
            btnPlaySweep.classList.remove('btn-play-active');
            btnPlaySweep.querySelector('span').innerHTML = "Animar Barrido z=k";
        }
    });

    // Botones de Escalado de Letra (A+ / A-)
    btnFontIncrease.addEventListener('click', () => {
        fontScale = Math.min(1.4, fontScale + 0.1);
        document.documentElement.style.setProperty('--font-scale', fontScale);
    });

    btnFontDecrease.addEventListener('click', () => {
        fontScale = Math.max(0.75, fontScale - 0.1);
        document.documentElement.style.setProperty('--font-scale', fontScale);
    });

    // Presets de Cámara
    btnViewIso.addEventListener('click', () => {
        setActivePreset(btnViewIso);
        const funcObj = functionsMap[currentFuncKey];
        setCameraPreset(16, -16, 14, 0, 0, funcObj.maxZ * 0.35);
    });

    btnViewTop.addEventListener('click', () => {
        setActivePreset(btnViewTop);
        setCameraPreset(0, 0, 24, 0, 0, 0);
    });

    btnViewFront.addEventListener('click', () => {
        setActivePreset(btnViewFront);
        const funcObj = functionsMap[currentFuncKey];
        setCameraPreset(0, -24, funcObj.maxZ * 0.35, 0, 0, funcObj.maxZ * 0.35);
    });

    function setActivePreset(activeBtn) {
        [btnViewIso, btnViewTop, btnViewFront].forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    // Toggles de Capas
    toggleSurface.addEventListener('change', buildSurface);
    togglePlane.addEventListener('change', rebuildContoursAndPlane);
    toggleContours3D.addEventListener('change', rebuildContoursAndPlane);
    toggleProjections.addEventListener('change', rebuildContoursAndPlane);
    toggleContours2D.addEventListener('change', rebuildContoursAndPlane);
    toggleGrid.addEventListener('change', rebuildGridAndAxes);
    toggleAxes.addEventListener('change', rebuildGridAndAxes);
    toggleLabels.addEventListener('change', projectLabels);

    // Plegado de Paneles
    btnToggleInfo.addEventListener('click', () => {
        infoCard.classList.toggle('collapsed');
        btnToggleInfo.classList.toggle('active');
    });

    btnToggleControls.addEventListener('click', () => {
        controlsCard.classList.toggle('collapsed');
        btnToggleControls.classList.toggle('active');
    });
}

function setCameraPreset(x, y, z, lookX = 0, lookY = 0, lookZ = 0) {
    targetCameraPos.set(x, y, z);
    targetCameraLookAt.set(lookX, lookY, lookZ);
    isTransitioning = true;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    projectLabels();
}

// -------------------------------------------------------------
// 13. Ejecución
// -------------------------------------------------------------
init();
animate();

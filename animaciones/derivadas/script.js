// --- CONFIGURACIÓN THREE.JS Y ESTADO GLOBAL ---
const container = document.getElementById('canvas-container');

// Estado
let currentFuncKey = 'paraboloid';
let theta = 45; // Ángulo de dirección
let x0 = 1, y0 = 1;
const DOMAIN = 3.0;
let fontScale = 1.0;

// Objetos 3D
let scene, camera, renderer, controls;
let surfaceGroup, geomGroup, gridGroup, axesGroup;

// -------------------------------------------------------------
// Definición de Superficies
// -------------------------------------------------------------
const functionsMap = {
    paraboloid: {
        name: 'Paraboloide Invertido',
        eqLatex: 'z = 3 - 0.5x^2 - 0.5y^2',
        f: (x, y) => 3 - 0.5*x*x - 0.5*y*y,
        fx: (x, y) => -1.0*x,
        fy: (x, y) => -1.0*y,
        minZ: -2, maxZ: 3
    },
    saddle: {
        name: 'Silla de Montar',
        eqLatex: 'z = 0.5x^2 - 0.5y^2',
        f: (x, y) => 0.5*x*x - 0.5*y*y,
        fx: (x, y) => x,
        fy: (x, y) => -y,
        minZ: -5, maxZ: 5
    },
    two_peaks: {
        name: 'Dos Colinas',
        eqLatex: 'z = 2.5 e^{-\\frac{(x-1)^2 + (y-1)^2}{2}} + 1.6 e^{-\\frac{(x+1)^2 + (y+1)^2}{2}}',
        f: (x, y) => {
            return 2.5 * Math.exp(-((x - 1) ** 2 + (y - 1) ** 2) / 2.0) +
                   1.6 * Math.exp(-((x + 1) ** 2 + (y + 1) ** 2) / 2.0);
        },
        fx: (x, y) => {
            return 2.5 * Math.exp(-((x-1)**2+(y-1)**2)/2) * -(x-1) +
                   1.6 * Math.exp(-((x+1)**2+(y+1)**2)/2) * -(x+1);
        },
        fy: (x, y) => {
            return 2.5 * Math.exp(-((x-1)**2+(y-1)**2)/2) * -(y-1) +
                   1.6 * Math.exp(-((x+1)**2+(y+1)**2)/2) * -(y+1);
        },
        minZ: 0, maxZ: 3
    }
};

// -------------------------------------------------------------
// Inicialización
// -------------------------------------------------------------
function init() {
    scene = new THREE.Scene();
    
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Z-up
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.up.set(0, 0, 1);
    camera.position.set(6, -6, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 0, 1);

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, -5, 10);
    scene.add(dirLight);

    // Grupos
    surfaceGroup = new THREE.Group();
    geomGroup = new THREE.Group();
    gridGroup = new THREE.Group();
    axesGroup = new THREE.Group();
    
    scene.add(surfaceGroup);
    scene.add(geomGroup);
    scene.add(gridGroup);
    scene.add(axesGroup);
    
    buildSurface();
    buildDynamicGeometry();
    setupEvents();
    
    window.addEventListener('resize', onWindowResize);
}

function buildSurface() {
    // Clear old surface
    surfaceGroup.clear();
    gridGroup.clear();
    axesGroup.clear();
    
    if (document.getElementById('toggle-axes')?.checked) {
        const arrowLen = 4.5;
        const color = 0x000000;
        axesGroup.add(new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), arrowLen, color, 0.25, 0.15)); // X
        axesGroup.add(new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), arrowLen, color, 0.25, 0.15)); // Y
        axesGroup.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), arrowLen, color, 0.25, 0.15)); // Z
    }
    
    if (document.getElementById('toggle-grid')?.checked) {
        const gridHelper = new THREE.GridHelper(DOMAIN*2.5, 20, 0x94a3b8, 0xcbd5e1);
        gridHelper.rotation.x = Math.PI / 2;
        gridHelper.position.z = -0.01;
        gridGroup.add(gridHelper);
    }
    
    if (!document.getElementById('toggle-surface').checked) return;

    const funcObj = functionsMap[currentFuncKey];
    const geom = new THREE.PlaneGeometry(DOMAIN*2, DOMAIN*2, 60, 60);
    const pos = geom.attributes.position;
    for(let i=0; i<pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        pos.setZ(i, funcObj.f(x, y));
    }
    geom.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
        wireframe: false
    });
    const mesh = new THREE.Mesh(geom, mat);
    surfaceGroup.add(mesh);
    
    const wireMat = new THREE.MeshBasicMaterial({
        color: 0x1e40af,
        wireframe: true,
        transparent: true,
        opacity: 0.12
    });
    const wireMesh = new THREE.Mesh(geom, wireMat);
    surfaceGroup.add(wireMesh);
}

function buildDynamicGeometry() {
    geomGroup.clear();

    const funcObj = functionsMap[currentFuncKey];
    const z0 = funcObj.f(x0, y0);
    const dfx = funcObj.fx(x0, y0);
    const dfy = funcObj.fy(x0, y0);
    const rad = theta * Math.PI / 180;
    const uX = Math.cos(rad);
    const uY = Math.sin(rad);
    const dfu = dfx*uX + dfy*uY;

    // 2. Curva de Intersección
    if(document.getElementById('toggle-curve').checked) {
        const curvePts = [];
        for(let h = -DOMAIN*2; h <= DOMAIN*2; h += 0.1) {
            let cx = x0 + h*uX;
            let cy = y0 + h*uY;
            if(cx >= -DOMAIN && cx <= DOMAIN && cy >= -DOMAIN && cy <= DOMAIN) {
                curvePts.push(new THREE.Vector3(cx, cy, funcObj.f(cx, cy)));
            }
        }
        const curveGeom = new THREE.BufferGeometry().setFromPoints(curvePts);
        const curveMat = new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 3 });
        geomGroup.add(new THREE.Line(curveGeom, curveMat));
    }

    // 3. Recta Tangente (Como Cilindro para grosor real)
    if(document.getElementById('toggle-tangent').checked) {
        const L = 2.5; 
        const p1 = new THREE.Vector3(x0 - L*uX, y0 - L*uY, z0 - L*dfu);
        const p2 = new THREE.Vector3(x0 + L*uX, y0 + L*uY, z0 + L*dfu);
        
        let tanColor = 0x10b981; // Verde esmeralda (normal)
        let radius = 0.03;
        
        // Coincide con derivada parcial (0, 90, 180, 270)
        if (theta % 90 === 0) {
            tanColor = 0xff00ff; // Magenta brillante
            radius = 0.08;       // Más grueso
        }

        const cylGeom = new THREE.CylinderGeometry(radius, radius, p1.distanceTo(p2), 8);
        const cylMat = new THREE.MeshBasicMaterial({ color: tanColor });
        const cylinder = new THREE.Mesh(cylGeom, cylMat);
        
        // Orientar el cilindro
        const direction = new THREE.Vector3().subVectors(p2, p1).normalize();
        const center = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        cylinder.position.copy(center);
        cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
        
        geomGroup.add(cylinder);
        
        // Punto sobre la superficie
        const ptMesh = new THREE.Mesh(new THREE.SphereGeometry(0.12), new THREE.MeshBasicMaterial({ color: 0x000000 }));
        ptMesh.position.set(x0, y0, z0);
        geomGroup.add(ptMesh);
        
        // Punto en z=0
        const ptZeroMesh = new THREE.Mesh(new THREE.SphereGeometry(0.12), new THREE.MeshBasicMaterial({ color: 0xea580c }));
        ptZeroMesh.position.set(x0, y0, 0);
        geomGroup.add(ptZeroMesh);
        
        // Etiqueta P_0 3D (Sprite)
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        context.font = 'Bold 48px "Fira Code", monospace';
        context.fillStyle = '#ea580c';
        context.fillText('P₀', 0, 48);
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.set(x0 + 0.3, y0 + 0.3, 0);
        sprite.scale.set(0.6, 0.3, 1);
        geomGroup.add(sprite);
    }

    // 4. Vectores en Plano z=0
    if(document.getElementById('toggle-vectors').checked) {
        const dirArr = new THREE.ArrowHelper(new THREE.Vector3(uX, uY, 0).normalize(), new THREE.Vector3(x0, y0, 0), 1, 0xef4444, 0.2, 0.1);
        geomGroup.add(dirArr);
        
        const gradLen = Math.sqrt(dfx*dfx + dfy*dfy);
        if(gradLen > 0.001) {
            const gradArr = new THREE.ArrowHelper(new THREE.Vector3(dfx, dfy, 0).normalize(), new THREE.Vector3(x0, y0, 0), gradLen, 0x8b5cf6, 0.2, 0.1);
            geomGroup.add(gradArr);
        }
    }
    
    // Actualizar Textos
    updateUI(uX, uY, z0, dfx, dfy, dfu);
    drawCanvas2D();
}

function updateUI(uX, uY, z0, dfx, dfy, dfu) {
    document.getElementById('math-x0').textContent = x0.toFixed(2);
    document.getElementById('math-y0').textContent = y0.toFixed(2);
    document.getElementById('math-z0').textContent = z0.toFixed(2);
    document.getElementById('math-fx').textContent = dfx.toFixed(2);
    document.getElementById('math-fy').textContent = dfy.toFixed(2);
    document.getElementById('math-grad-x').textContent = dfx.toFixed(2);
    document.getElementById('math-grad-y').textContent = dfy.toFixed(2);
    
    const radStr = formatTheta(theta);
    document.getElementById('math-theta').textContent = radStr;
    document.getElementById('val-theta').textContent = radStr;
    
    document.getElementById('math-ux').textContent = uX.toFixed(2);
    document.getElementById('math-uy').textContent = uY.toFixed(2);
    document.getElementById('math-dir-deriv').textContent = dfu.toFixed(3);
    
    // Pedagogical
    const feedback = document.getElementById('pedagogical-feedback');
    const states = ['default', 'x', 'y', 'nx', 'ny'];
    states.forEach(s => { 
        if (document.getElementById('dir-state-' + s)) document.getElementById('dir-state-' + s).style.display = 'none'; 
    });

    if (Math.abs(theta % 360) < 0.1) {
        feedback.innerHTML = `Plano de corte paralelo al eje X (y = ${y0.toFixed(2)}). La pendiente coincide con la <strong>Derivada Parcial respecto a X</strong>.`;
        if (document.getElementById('dir-state-x')) document.getElementById('dir-state-x').style.display = 'inline-block';
    } else if (Math.abs((theta - 90) % 360) < 0.1) {
        feedback.innerHTML = `Plano de corte paralelo al eje Y (x = ${x0.toFixed(2)}). La pendiente coincide con la <strong>Derivada Parcial respecto a Y</strong>.`;
        if (document.getElementById('dir-state-y')) document.getElementById('dir-state-y').style.display = 'inline-block';
    } else if (Math.abs((theta - 180) % 360) < 0.1) {
        feedback.innerHTML = `Plano de corte en dirección negativa al eje X (y = ${y0.toFixed(2)}). La pendiente es <strong>-&part;f/&part;x</strong>.`;
        if (document.getElementById('dir-state-nx')) document.getElementById('dir-state-nx').style.display = 'inline-block';
    } else if (Math.abs((theta - 270) % 360) < 0.1) {
        feedback.innerHTML = `Plano de corte en dirección negativa al eje Y (x = ${x0.toFixed(2)}). La pendiente es <strong>-&part;f/&part;y</strong>.`;
        if (document.getElementById('dir-state-ny')) document.getElementById('dir-state-ny').style.display = 'inline-block';
    } else {
        feedback.innerHTML = `Plano inclinado en dirección ${radStr}. La pendiente es la Derivada Direccional.`;
        if (document.getElementById('dir-state-default')) document.getElementById('dir-state-default').style.display = 'inline-block';
    }
}

function formatTheta(deg) {
    const frac = deg / 180;
    if (deg === 0) return "0 rad";
    if (deg === 180) return "π rad";
    if (deg === 360) return "2π rad";
    return frac.toFixed(2) + "π rad";
}

// -------------------------------------------------------------
// Interacción Canvas 2D
// -------------------------------------------------------------
const cvs2d = document.getElementById('domain-canvas');
const ctx = cvs2d.getContext('2d');
let dragging2D = false;

function drawCanvas2D() {
    ctx.clearRect(0, 0, cvs2d.width, cvs2d.height);
    const W = cvs2d.width;
    const H = cvs2d.height;
    
    // Ejes
    ctx.strokeStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H);
    ctx.moveTo(0, H/2); ctx.lineTo(W, H/2);
    ctx.stroke();
    
    const px = (x0 + DOMAIN) / (2*DOMAIN) * W;
    const py = H - (y0 + DOMAIN) / (2*DOMAIN) * H;
    
    const funcObj = functionsMap[currentFuncKey];
    const dfx = funcObj.fx(x0, y0);
    const dfy = funcObj.fy(x0, y0);
    
    // Gradiente
    const gx = px + (dfx / DOMAIN) * (W/2);
    const gy = py - (dfy / DOMAIN) * (H/2);
    ctx.strokeStyle = '#8b5cf6';
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(gx, gy); ctx.stroke();
    
    // Vector u
    const rad = theta * Math.PI / 180;
    const ux = px + Math.cos(rad) * 30;
    const uy = py - Math.sin(rad) * 30;
    ctx.strokeStyle = '#ea580c';
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(ux, uy); ctx.stroke();
    
    // Punto
    ctx.fillStyle = '#ea580c';
    ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI*2); ctx.fill();
    
    // Etiqueta P_0
    ctx.font = 'bold 15px "Fira Code", monospace';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('P₀', px + 10, py - 6);
}

function handleCanvasMouse(e) {
    const rect = cvs2d.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    
    if(e.type === 'mousedown') dragging2D = true;
    if(e.type === 'mouseup' || e.type === 'mouseleave') dragging2D = false;
    
    if(dragging2D) {
        x0 = (mx / cvs2d.width) * (2*DOMAIN) - DOMAIN;
        y0 = DOMAIN - (my / cvs2d.height) * (2*DOMAIN);
        if(x0 < -DOMAIN) x0 = -DOMAIN; if(x0 > DOMAIN) x0 = DOMAIN;
        if(y0 < -DOMAIN) y0 = -DOMAIN; if(y0 > DOMAIN) y0 = DOMAIN;
        buildDynamicGeometry();
    }
}
cvs2d.addEventListener('mousedown', handleCanvasMouse);
cvs2d.addEventListener('mousemove', handleCanvasMouse);
cvs2d.addEventListener('mouseup', handleCanvasMouse);
cvs2d.addEventListener('mouseleave', handleCanvasMouse);

// -------------------------------------------------------------
// Eventos UI
// -------------------------------------------------------------
function setupEvents() {
    // Select Superficie
    document.getElementById('select-function').addEventListener('change', e => {
        currentFuncKey = e.target.value;
        const eqText = `\\[${functionsMap[currentFuncKey].eqLatex}\\]`;
        document.getElementById('math-eq-surface').innerHTML = eqText;
        if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
            window.MathJax.typesetPromise();
        }
        buildSurface();
        buildDynamicGeometry();
    });

    // Angle Slider
    const sliderTheta = document.getElementById('slider-theta');
    sliderTheta.addEventListener('input', e => {
        theta = parseInt(e.target.value);
        buildDynamicGeometry();
    });

    // Quick Dirs
    document.getElementById('btn-dir-x').addEventListener('click', () => setTheta(0));
    document.getElementById('btn-dir-y').addEventListener('click', () => setTheta(90));
    document.getElementById('btn-dir-diag').addEventListener('click', () => setTheta(45));
    document.getElementById('btn-dir-grad').addEventListener('click', () => {
        const funcObj = functionsMap[currentFuncKey];
        const dfx = funcObj.fx(x0, y0);
        const dfy = funcObj.fy(x0, y0);
        let ang = Math.atan2(dfy, dfx) * 180 / Math.PI;
        if(ang < 0) ang += 360;
        setTheta(Math.round(ang));
    });

    function setTheta(val) {
        theta = val;
        sliderTheta.value = val;
        buildDynamicGeometry();
    }

    // Toggles
    ['surface', 'curve', 'tangent', 'vectors', 'grid', 'axes'].forEach(id => {
        document.getElementById('toggle-' + id)?.addEventListener('change', () => {
            buildSurface();
            buildDynamicGeometry();
        });
    });

    // Camera Views
    document.getElementById('btn-view-iso').addEventListener('click', e => {
        camera.position.set(6, -6, 5); controls.target.set(0, 0, 1);
        setActivePreset(e.target);
    });
    document.getElementById('btn-view-top').addEventListener('click', e => {
        camera.position.set(0, 0, 10); controls.target.set(0, 0, 0);
        setActivePreset(e.target);
    });
    document.getElementById('btn-view-side').addEventListener('click', e => {
        camera.position.set(0, -10, 3); controls.target.set(0, 0, 3);
        setActivePreset(e.target);
    });
    function setActivePreset(btn) {
        document.querySelectorAll('.btn-preset').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }

    // Panels
    document.getElementById('btn-toggle-info').addEventListener('click', e => {
        document.querySelector('.info-card').classList.toggle('collapsed');
        e.currentTarget.classList.toggle('active');
    });
    document.getElementById('btn-toggle-controls').addEventListener('click', e => {
        document.querySelector('.controls-card').classList.toggle('collapsed');
        e.currentTarget.classList.toggle('active');
    });

    // Font Scaling
    document.getElementById('btn-font-increase').addEventListener('click', () => {
        fontScale = Math.min(1.4, fontScale + 0.1);
        document.documentElement.style.setProperty('--font-scale', fontScale);
    });
    document.getElementById('btn-font-decrease').addEventListener('click', () => {
        fontScale = Math.max(0.75, fontScale - 0.1);
        document.documentElement.style.setProperty('--font-scale', fontScale);
    });
}

function onWindowResize() {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    drawCanvas2D();
}

// -------------------------------------------------------------
// Bucle
// -------------------------------------------------------------
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

init();
animate();

window.addEventListener('load', () => setTimeout(onWindowResize, 150));
setTimeout(onWindowResize, 200);

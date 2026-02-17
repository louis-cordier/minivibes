// ==========================
// TRACKMANIA 3D - Three.js Game
// ==========================

let scene, camera, renderer;
let carBody, car;
let world;
let track;
let checkpoints = [];
let passedCheckpoints = 0;
let gameRunning = false;
let gameStartTime = 0;
let carSpeed = 0;
let carAcceleration = { forward: 0, turn: 0 };

const TRACK_WIDTH = 10;
const TRACK_HEIGHT = 0.5;

// Initialize game
function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 500, 1000);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, 15, 30);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    document.body.appendChild(renderer.domElement);

    // Lighting
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(100, 100, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.left = -200;
    sunLight.shadow.camera.right = 200;
    sunLight.shadow.camera.top = 200;
    sunLight.shadow.camera.bottom = -200;
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x2d8659 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Physics world
    world = new CANNON.World();
    world.gravity.set(0, -30, 0);
    world.defaultContactMaterial.friction = 0.3;

    // Create car
    createCar();

    // Create track
    createTrack();

    // Input handling
    setupInput();

    // Menu handling
    setupMenu();

    // Window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();
}

function createCar() {
    // Car geometry
    const carGeometry = new THREE.BoxGeometry(1, 1, 2);
    const carMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    car = new THREE.Mesh(carGeometry, carMaterial);
    car.castShadow = true;
    car.receiveShadow = true;
    car.position.set(0, 2, 0);
    scene.add(car);

    // Physics body
    const carShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 1));
    carBody = new CANNON.Body({ mass: 1500 });
    carBody.addShape(carShape);
    carBody.linearDamping = 0.1;
    carBody.angularDamping = 0.3;
    carBody.position.set(0, 2, 0);
    world.addBody(carBody);

    // Add wheels (visual)
    addWheels(car);
}

function addWheels(carMesh) {
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    
    const positions = [
        [-0.6, -0.4, -0.6],
        [0.6, -0.4, -0.6],
        [-0.6, -0.4, 0.6],
        [0.6, -0.4, 0.6]
    ];

    positions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(...pos);
        wheel.castShadow = true;
        carMesh.add(wheel);
    });
}

function createTrack() {
    track = [];
    
    // Track path in 3D
    const trackPath = [
        { x: 0, z: 0, y: 0 },
        { x: 0, z: 30, y: 0 },
        { x: 15, z: 60, y: 0 },
        { x: 30, z: 70, y: 5 },
        { x: 35, z: 90, y: 8 },
        { x: 25, z: 120, y: 0 },
        { x: 5, z: 140, y: 0 },
        { x: -15, z: 160, y: 0 },
        { x: -30, z: 160, y: 0 },
        { x: -40, z: 140, y: 5 },
        { x: -35, z: 110, y: 3 },
        { x: -20, z: 80, y: 0 },
        { x: 0, z: 50, y: 0 }
    ];

    // Create track segments
    for (let i = 0; i < trackPath.length - 1; i++) {
        const p1 = trackPath[i];
        const p2 = trackPath[i + 1];
        
        createTrackSegment(p1, p2, i);
        createCheckpoint(p1, i);
    }
}

function createTrackSegment(p1, p2, index) {
    const dx = p2.x - p1.x;
    const dz = p2.z - p1.z;
    const dy = p2.y - p1.y;
    const length = Math.sqrt(dx * dx + dz * dz + dy * dy);
    
    // Track mesh
    const geometry = new THREE.BoxGeometry(TRACK_WIDTH, TRACK_HEIGHT, length);
    const color = index % 2 === 0 ? 0x4444ff : 0x444488;
    const material = new THREE.MeshPhongMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    const midZ = (p1.z + p2.z) / 2;
    
    mesh.position.set(midX, midY, midZ);
    
    // Rotation
    const angle = Math.atan2(dx, dz);
    mesh.rotation.y = angle;
    const vertAngle = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz));
    mesh.rotation.x = vertAngle;
    
    scene.add(mesh);

    // Physics body
    const shape = new CANNON.Box(new CANNON.Vec3(TRACK_WIDTH / 2, TRACK_HEIGHT / 2, length / 2));
    const body = new CANNON.Body({ mass: 0 });
    body.addShape(shape);
    body.position.set(midX, midY, midZ);
    
    // Apply rotation to body
    const quat = new CANNON.Quaternion();
    quat.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), angle);
    body.quaternion = quat;
    
    world.addBody(body);
}

function createCheckpoint(pos, index) {
    const geometry = new THREE.CylinderGeometry(8, 8, 0.5, 32);
    const material = new THREE.MeshPhongMaterial({ color: 0xffff00, transparent: true, opacity: 0.3 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(pos.x, pos.y + 1, pos.z);
    scene.add(mesh);
    
    checkpoints.push({
        mesh: mesh,
        pos: pos,
        index: index,
        passed: false
    });
}

const keys = {};

function setupInput() {
    window.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
        
        if (e.key === 'r' || e.key === 'R') {
            resetCar();
        }
        if (e.key === 'Escape') {
            toggleMenu();
        }
    });

    window.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });
}

function setupMenu() {
    const menu = document.getElementById('menu');
    const startBtn = document.getElementById('startBtn');
    const instructionsBtn = document.getElementById('instructionsBtn');
    const controlsInfo = document.getElementById('controls-info');

    startBtn.addEventListener('click', () => {
        menu.classList.add('menu-hidden');
        gameRunning = true;
        gameStartTime = Date.now();
        passedCheckpoints = 0;
        checkpoints.forEach(cp => cp.passed = false);
    });

    instructionsBtn.addEventListener('click', () => {
        controlsInfo.style.display = controlsInfo.style.display === 'none' ? 'block' : 'none';
    });
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('menu-hidden');
    gameRunning = !gameRunning;
}

function resetCar() {
    carBody.position.set(0, 2, 0);
    carBody.velocity.set(0, 0, 0);
    carBody.angularVelocity.set(0, 0, 0);
    car.position.copy(carBody.position);
    car.quaternion.copy(carBody.quaternion);
}

function updateCar(deltaTime) {
    if (!gameRunning) return;

    const speed = 300; // Units per second
    const maxSpeed = 100;
    const turnSpeed = 3;
    const friction = 0.95;

    // Input
    if (keys['arrowup'] || keys['w']) {
        carAcceleration.forward = Math.min(carAcceleration.forward + 3, maxSpeed);
    } else if (keys['arrowdown'] || keys['s']) {
        carAcceleration.forward = Math.max(carAcceleration.forward - 5, -maxSpeed / 2);
    } else {
        carAcceleration.forward *= friction;
    }

    if (keys['arrowleft'] || keys['a']) {
        carAcceleration.turn = Math.max(carAcceleration.turn - 0.1, -1);
    } else if (keys['arrowright'] || keys['d']) {
        carAcceleration.turn = Math.min(carAcceleration.turn + 0.1, 1);
    } else {
        carAcceleration.turn *= 0.9;
    }

    // Apply velocity
    const forward = new CANNON.Vec3(
        Math.sin(car.rotation.y) * carAcceleration.forward,
        carBody.velocity.y,
        Math.cos(car.rotation.y) * carAcceleration.forward
    );
    carBody.velocity.x = forward.x;
    carBody.velocity.z = forward.z;

    // Rotation
    car.rotation.y += carAcceleration.turn * deltaTime;
    carBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), car.rotation.y);

    carSpeed = carAcceleration.forward * 3.6; // Convert to km/h

    // Update car position and rotation
    car.position.copy(carBody.position);
    car.quaternion.copy(carBody.quaternion);

    // Check checkpoints
    checkCheckpoints();

    // Camera follow
    const cameraOffset = new THREE.Vector3(0, 10, -20);
    cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), car.rotation.y);
    const targetCamPos = car.position.clone().add(cameraOffset);
    camera.position.lerp(targetCamPos, 0.1);
    camera.lookAt(car.position.clone().add(new THREE.Vector3(0, 3, 0)));
}

function checkCheckpoints() {
    checkpoints.forEach((cp, index) => {
        if (!cp.passed) {
            const distance = car.position.distanceTo(cp.pos);
            if (distance < 10) {
                cp.passed = true;
                passedCheckpoints++;
                document.getElementById('checkpoints').textContent = passedCheckpoints + '/5';
            }
        }
    });
}

function updateUI() {
    if (gameRunning) {
        const elapsed = (Date.now() - gameStartTime) / 1000;
        const minutes = Math.floor(elapsed / 60);
        const seconds = (elapsed % 60).toFixed(2);
        document.getElementById('timer').textContent = `${minutes}:${seconds.padStart(5, '0')}`;
    }
    document.getElementById('speed').textContent = Math.round(Math.abs(carSpeed));
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    const deltaTime = 1 / 60;
    
    if (gameRunning) {
        world.step(1 / 60);
        updateCar(deltaTime);
    }

    updateUI();
    renderer.render(scene, camera);
}

// Start the game
init();

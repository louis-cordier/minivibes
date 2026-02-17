import * as THREE from 'three';

export class Player {
  constructor(scene) {
    this.scene = scene;
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.speed = 0;
    this.maxSpeed = 80;
    this.rotationSpeed = 4;
    this.gravity = 0.3;

    // Create car container
    this.body = new THREE.Group();
    scene.add(this.body);

    // Main rounded body - yellow (Oui-Oui style: rounded egg shape)
    const bodyGeometry = new THREE.BoxGeometry(2, 1.3, 3.2);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xFFDD00 }); // Bright yellow
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    this.body.add(bodyMesh);

    // Front nose - rounded yellow
    const noseGeometry = new THREE.SphereGeometry(0.6, 16, 16);
    const nose = new THREE.Mesh(noseGeometry, bodyMaterial);
    nose.scale.set(1, 0.9, 0.8);
    nose.castShadow = true;
    nose.receiveShadow = true;
    nose.position.set(0, 0.2, 1.8);
    this.body.add(nose);

    // Gray front bumper
    const bumperGeometry = new THREE.BoxGeometry(2.2, 0.4, 0.3);
    const bumperMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const bumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
    bumper.castShadow = true;
    bumper.receiveShadow = true;
    bumper.position.set(0, 0.1, 1.95);
    this.body.add(bumper);

    // White grille on front (horizontal lines style)
    const grilleGeometry = new THREE.BoxGeometry(1.4, 0.6, 0.1);
    const grilleMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
    const grille = new THREE.Mesh(grilleGeometry, grilleMaterial);
    grille.castShadow = true;
    grille.position.set(0, 0.35, 2.02);
    this.body.add(grille);

    // Left headlight - white and round (old-fashioned style)
    const headlightGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const headlightMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
    const headlightL = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlightL.castShadow = true;
    headlightL.position.set(-0.55, 0.55, 1.9);
    this.body.add(headlightL);

    // Right headlight
    const headlightR = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlightR.castShadow = true;
    headlightR.position.set(0.55, 0.55, 1.9);
    this.body.add(headlightR);

    // Windshield - blue
    const windowGeometry = new THREE.BoxGeometry(1.7, 0.85, 1.0);
    const windowMaterial = new THREE.MeshPhongMaterial({ color: 0x6699FF, transparent: true, opacity: 0.7 });
    const window = new THREE.Mesh(windowGeometry, windowMaterial);
    window.position.set(0, 0.5, 0.2);
    window.castShadow = true;
    this.body.add(window);

    // Back window - small
    const backWindowGeometry = new THREE.BoxGeometry(1.5, 0.6, 0.7);
    const backWindow = new THREE.Mesh(backWindowGeometry, windowMaterial);
    backWindow.position.set(0, 0.3, -0.9);
    backWindow.castShadow = true;
    this.body.add(backWindow);

    // Back rounded bumper
    const backBumperGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const backBumper = new THREE.Mesh(backBumperGeometry, bodyMaterial);
    backBumper.scale.set(1.1, 0.8, 0.7);
    backBumper.castShadow = true;
    backBumper.receiveShadow = true;
    backBumper.position.set(0, 0.2, -1.85);
    this.body.add(backBumper);

    // Create wheels
    this.wheels = [];
    const wheelPositions = [
      [-1.05, -0.75, 0.8],
      [1.05, -0.75, 0.8],
      [-1.05, -0.75, -1.2],
      [1.05, -0.75, -1.2],
    ];

    wheelPositions.forEach((pos, index) => {
      // Gray tire
      const wheelGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.5, 16);
      const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(...pos);
      wheel.castShadow = true;
      this.body.add(wheel);
      this.wheels.push(wheel);

      // Yellow hubcap/jante
      const hubcapGeometry = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 16);
      const hubcapMaterial = new THREE.MeshPhongMaterial({ color: 0xFFDD00 });
      const hubcap = new THREE.Mesh(hubcapGeometry, hubcapMaterial);
      hubcap.rotation.z = Math.PI / 2;
      hubcap.position.set(...pos);
      hubcap.castShadow = true;
      this.body.add(hubcap);
    });

    this.body.position.set(0, 5, -150);
    this.startPos = new THREE.Vector3(0, 5, -150);

    // Input handling
    this.keys = {};
    
    document.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
    });
    
    document.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  }

  update(delta) {
    // Simple direct movement based on keys
    if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) {
      this.speed = Math.min(this.speed + 2, this.maxSpeed);
    } else if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) {
      this.speed = Math.max(this.speed - 2, -this.maxSpeed * 0.3);
    } else {
      this.speed *= 0.9; // Friction
    }

    // Rotation
    if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
      this.body.rotation.y += this.rotationSpeed * delta;
    }
    if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
      this.body.rotation.y -= this.rotationSpeed * delta;
    }

    // Calculate forward direction
    const forward = new THREE.Vector3(
      Math.sin(this.body.rotation.y) * this.speed,
      0,
      Math.cos(this.body.rotation.y) * this.speed
    );

    // Apply gravity
    this.velocity.y -= this.gravity;

    // Update position
    this.body.position.x += forward.x * delta;
    this.body.position.z += forward.z * delta;
    this.body.position.y += this.velocity.y * delta;

    // Rotate wheels
    this.wheels.forEach((wheel) => {
      wheel.rotation.x += this.speed * 0.05;
    });

    // Keep on ground
    if (this.body.position.y < 0.75) {
      this.body.position.y = 0.75;
      this.velocity.y = 0;
    }

    // Reset with R key
    if (this.keys['r'] || this.keys['R']) {
      this.resetPosition();
    }
  }

  resetPosition() {
    this.body.position.copy(this.startPos);
    this.body.rotation.y = 0;
    this.speed = 0;
    this.velocity.y = 0;
  }

  get position() {
    return this.body.position;
  }

  set position(v) {
    this.body.position.copy(v);
  }
}

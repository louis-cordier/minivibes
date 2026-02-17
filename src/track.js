import * as THREE from 'three';

export class Track {
  constructor(scene) {
    this.scene = scene;
    this.finishLineZ = -150;
    this.hasPassedFinish = false;

    this.createTrack();
    this.createDecoration();
    this.createWalls();
  }

  createTrack() {
    // Classic green ground
    const groundGeometry = new THREE.PlaneGeometry(800, 800);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x2d8a2d });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.position.y = 0;
    this.scene.add(ground);

    // Simple, long circuit
    const trackPath = [
      new THREE.Vector3(0, 0, -150),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 100),
      new THREE.Vector3(80, 0, 120),
      new THREE.Vector3(120, 0, 80),
      new THREE.Vector3(120, 0, -50),
      new THREE.Vector3(100, 0, -150),
      new THREE.Vector3(40, 0, -180),
      new THREE.Vector3(-40, 0, -180),
      new THREE.Vector3(-100, 0, -150),
      new THREE.Vector3(-120, 0, -50),
      new THREE.Vector3(-120, 0, 80),
      new THREE.Vector3(-80, 0, 120),
      new THREE.Vector3(0, 0, 150),
      new THREE.Vector3(0, 0, -150),
    ];

    // Draw track segments
    for (let i = 0; i < trackPath.length - 1; i++) {
      const start = trackPath[i];
      const end = trackPath[i + 1];
      
      const direction = end.clone().sub(start);
      const distance = direction.length();
      direction.normalize();

      // Road surface
      const roadGeometry = new THREE.PlaneGeometry(35, distance);
      const roadMaterial = new THREE.MeshPhongMaterial({ color: 0xffdd00 });
      const road = new THREE.Mesh(roadGeometry, roadMaterial);

      const midPoint = start.clone().add(end).multiplyScalar(0.5);
      road.position.copy(midPoint);
      road.position.y = 0.01;

      const angle = Math.atan2(direction.x, direction.z);
      road.rotation.x = -Math.PI / 2;
      road.rotation.z = angle;

      road.receiveShadow = true;
      this.scene.add(road);

      // White center line
      const lineGeometry = new THREE.PlaneGeometry(2, distance);
      const lineMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
      const line = new THREE.Mesh(lineGeometry, lineMaterial);
      line.position.copy(midPoint);
      line.position.y = 0.02;
      line.rotation.x = -Math.PI / 2;
      line.rotation.z = angle;
      this.scene.add(line);
    }

    // Finish line
    const finishGeometry = new THREE.PlaneGeometry(35, 15);
    const finishMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    const finish = new THREE.Mesh(finishGeometry, finishMaterial);
    finish.position.set(0, 0.05, this.finishLineZ);
    finish.rotation.x = -Math.PI / 2;
    this.scene.add(finish);

    // Checkered pattern
    const checkerGeometry = new THREE.PlaneGeometry(3, 3);
    const checkerMaterial1 = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const checkerMaterial2 = new THREE.MeshPhongMaterial({ color: 0xffffff });
    
    for (let x = -5; x <= 5; x++) {
      for (let z = -2; z <= 2; z++) {
        const checker = new THREE.Mesh(
          checkerGeometry,
          (x + z) % 2 === 0 ? checkerMaterial1 : checkerMaterial2
        );
        checker.position.set(-9 + x * 3, 0.06, this.finishLineZ + z * 3);
        checker.rotation.x = -Math.PI / 2;
        this.scene.add(checker);
      }
    }
  }

  createWalls() {
    // LEGO Borders along the circuit sides - like real karting tracks
    const trackPath = [
      new THREE.Vector3(0, 0, -150),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 100),
      new THREE.Vector3(80, 0, 120),
      new THREE.Vector3(120, 0, 80),
      new THREE.Vector3(120, 0, -50),
      new THREE.Vector3(100, 0, -150),
      new THREE.Vector3(40, 0, -180),
      new THREE.Vector3(-40, 0, -180),
      new THREE.Vector3(-100, 0, -150),
      new THREE.Vector3(-120, 0, -50),
      new THREE.Vector3(-120, 0, 80),
      new THREE.Vector3(-80, 0, 120),
      new THREE.Vector3(0, 0, 150),
      new THREE.Vector3(0, 0, -150),
    ];

    // Create borders on both sides of track
    for (let i = 0; i < trackPath.length - 1; i++) {
      const start = trackPath[i];
      const end = trackPath[i + 1];
      const direction = end.clone().sub(start);
      const distance = direction.length();
      direction.normalize();

      // Space blocks along the segment for border
      const blockSpacing = 6;
      const numBlocks = Math.ceil(distance / blockSpacing);
      
      for (let i = 0; i < numBlocks; i++) {
        const t = i / Math.max(1, numBlocks - 1);
        const blockPos = start.clone().add(direction.clone().multiplyScalar(t));
        
        // Perpendicular direction for border placement
        const perpDir = new THREE.Vector3(-direction.z, 0, direction.x).normalize();
        
        // Create borders on both sides - wider, taller
        for (let side of [-1, 1]) {
          const borderPos = blockPos.clone().add(perpDir.clone().multiplyScalar(side * 19));
          
          // Color varies for visual interest
          const colors = [0xff0000, 0x0066ff, 0xffdd00, 0x00dd00];
          const color = colors[(Math.floor(blockPos.x + blockPos.z) / 10) % colors.length];
          
          // Create border block - taller and more visible
          const geometry = new THREE.BoxGeometry(6, 5, 6);
          const material = new THREE.MeshPhongMaterial({ color: color });
          const block = new THREE.Mesh(geometry, material);
          block.position.set(borderPos.x, 2.5, borderPos.z);
          block.castShadow = true;
          block.receiveShadow = true;
          this.scene.add(block);
        }
      }
    }
  }

  createDecoration() {
    // EXTREMELY DENSE LEGO world
    
    // Fill entire perimeter with houses
    const houseGrid = [
      // Far left side
      [-300, 0, -250], [-300, 0, -200], [-300, 0, -150], [-300, 0, -100], [-300, 0, -50], [-300, 0, 0], [-300, 0, 50], [-300, 0, 100], [-300, 0, 150], [-300, 0, 200],
      // Far right side  
      [300, 0, -250], [300, 0, -200], [300, 0, -150], [300, 0, -100], [300, 0, -50], [300, 0, 0], [300, 0, 50], [300, 0, 100], [300, 0, 150], [300, 0, 200],
      // Far top
      [-250, 0, 250], [-200, 0, 250], [-150, 0, 250], [-100, 0, 250], [-50, 0, 250], [0, 0, 250], [50, 0, 250], [100, 0, 250], [150, 0, 250], [200, 0, 250], [250, 0, 250],
      // Far bottom
      [-250, 0, -280], [-200, 0, -280], [-150, 0, -280], [-100, 0, -280], [-50, 0, -280], [0, 0, -280], [50, 0, -280], [100, 0, -280], [150, 0, -280], [200, 0, -280], [250, 0, -280],
    ];

    const houseColors = [0xff0000, 0x0066ff, 0xffdd00, 0x00dd00, 0xff6600, 0xcc00ff];

    houseGrid.forEach((pos, idx) => {
      const color = houseColors[idx % houseColors.length];
      
      // House base
      const baseGeom = new THREE.BoxGeometry(18, 8, 18);
      const baseMat = new THREE.MeshPhongMaterial({ color: color });
      const base = new THREE.Mesh(baseGeom, baseMat);
      base.position.set(pos[0], 4, pos[2]);
      base.castShadow = true;
      base.receiveShadow = true;
      this.scene.add(base);

      // Door
      const doorGeom = new THREE.BoxGeometry(4, 6, 0.5);
      const doorMat = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
      const door = new THREE.Mesh(doorGeom, doorMat);
      door.position.set(pos[0], 3, pos[2] + 9.5);
      this.scene.add(door);

      // Windows
      for (let i = 0; i < 2; i++) {
        const winGeom = new THREE.BoxGeometry(3, 3, 0.5);
        const winMat = new THREE.MeshPhongMaterial({ color: 0x66ccff });
        const window = new THREE.Mesh(winGeom, winMat);
        window.position.set(pos[0] - 6 + i * 12, 5, pos[2] + 9.5);
        this.scene.add(window);
      }

      // Roof
      const roofGeom = new THREE.ConeGeometry(13, 6, 4);
      const roofMat = new THREE.MeshPhongMaterial({ color: 0x8b0000 });
      const roof = new THREE.Mesh(roofGeom, roofMat);
      roof.position.set(pos[0], 12, pos[2]);
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      this.scene.add(roof);
    });

    // Many towers - create a castle effect
    const towerPositions = [
      [-330, 0, -300], [-330, 0, 0], [-330, 0, 300],
      [330, 0, -300], [330, 0, 0], [330, 0, 300],
      [-100, 0, 330], [0, 0, 330], [100, 0, 330],
      [-100, 0, -330], [0, 0, -330], [100, 0, -330],
    ];

    towerPositions.forEach((pos, idx) => {
      const color = houseColors[idx % houseColors.length];
      
      for (let i = 0; i < 4; i++) {
        const blockGeom = new THREE.BoxGeometry(10, 5, 10);
        const blockMat = new THREE.MeshPhongMaterial({ color: color });
        const block = new THREE.Mesh(blockGeom, blockMat);
        block.position.set(pos[0], 2.5 + i * 5, pos[1]);
        block.castShadow = true;
        block.receiveShadow = true;
        this.scene.add(block);
      }
    });

    // Dense tree grid
    const treeGrid = [];
    for (let x = -340; x <= 340; x += 60) {
      for (let z = -340; z <= 340; z += 60) {
        // Skip areas near track
        if (Math.abs(x) < 180 && Math.abs(z) < 200) continue;
        treeGrid.push([x, z]);
      }
    }

    treeGrid.forEach((pos) => {
      // Trunk
      const trunkGeom = new THREE.CylinderGeometry(2, 2.5, 10, 8);
      const trunkMat = new THREE.MeshPhongMaterial({ color: 0x654321 });
      const trunk = new THREE.Mesh(trunkGeom, trunkMat);
      trunk.position.set(pos[0], 5, pos[1]);
      this.scene.add(trunk);

      // Multi-color foliage
      const foliageColors = [0x00aa00, 0x00cc00, 0x008800];
      for (let i = 0; i < 3; i++) {
        const foliageGeom = new THREE.SphereGeometry(7 - i * 2, 8, 8);
        const foliageMat = new THREE.MeshPhongMaterial({ color: foliageColors[i % 3] });
        const foliage = new THREE.Mesh(foliageGeom, foliageMat);
        foliage.position.set(pos[0], 12 + i * 5, pos[1]);
        foliage.castShadow = true;
        this.scene.add(foliage);
      }
    });

    // Dense lamp grid
    const lampGrid = [];
    for (let x = -320; x <= 320; x += 80) {
      for (let z = -320; z <= 320; z += 80) {
        if (Math.abs(x) < 180 && Math.abs(z) < 200) continue;
        lampGrid.push([x, z]);
      }
    }

    lampGrid.forEach((pos) => {
      // Post
      const postGeom = new THREE.CylinderGeometry(1, 1, 10, 8);
      const postMat = new THREE.MeshPhongMaterial({ color: 0xffdd00 });
      const post = new THREE.Mesh(postGeom, postMat);
      post.position.set(pos[0], 5, pos[1]);
      post.castShadow = true;
      this.scene.add(post);

      // Lamp
      const lampGeom = new THREE.SphereGeometry(2, 8, 8);
      const lampMat = new THREE.MeshPhongMaterial({ 
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 0.3
      });
      const lamp = new THREE.Mesh(lampGeom, lampMat);
      lamp.position.set(pos[0], 11, pos[1]);
      this.scene.add(lamp);
    });

    // Benches everywhere
    const benchGrid = [];
    for (let x = -300; x <= 300; x += 120) {
      for (let z = -300; z <= 300; z += 120) {
        if (Math.abs(x) < 200 && Math.abs(z) < 220) continue;
        benchGrid.push([x, z]);
      }
    }

    benchGrid.forEach((pos) => {
      const seatGeom = new THREE.BoxGeometry(12, 2, 4);
      const seatMat = new THREE.MeshPhongMaterial({ color: [0xff0000, 0x0066ff, 0xffdd00][Math.floor(Math.random() * 3)] });
      const seat = new THREE.Mesh(seatGeom, seatMat);
      seat.position.set(pos[0], 2, pos[1]);
      this.scene.add(seat);

      const restGeom = new THREE.BoxGeometry(12, 5, 1);
      const restMat = new THREE.MeshPhongMaterial({ color: seatMat.color });
      const rest = new THREE.Mesh(restGeom, restMat);
      rest.position.set(pos[0], 4, pos[1] + 2.5);
      this.scene.add(rest);
    });

    // Scattered flowers and gardens
    const flowerPositions = [
      [-280, 0, 280], [280, 0, 280],
      [-280, 0, -300], [280, 0, -300],
      [-350, 0, 0], [350, 0, 0],
      [-200, 0, 300], [200, 0, 300],
      [-200, 0, -340], [200, 0, -340],
    ];

    flowerPositions.forEach((pos) => {
      const gardenGeom = new THREE.BoxGeometry(20, 2, 20);
      const gardenMat = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
      const garden = new THREE.Mesh(gardenGeom, gardenMat);
      garden.position.set(pos[0], 1, pos[1]);
      this.scene.add(garden);

      for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2;
        const x = pos[0] + Math.cos(angle) * 8;
        const z = pos[1] + Math.sin(angle) * 8;
        
        const flowerGeom = new THREE.SphereGeometry(1.5, 8, 8);
        const flowerMat = new THREE.MeshPhongMaterial({ color: [0xff69b4, 0xff1493, 0xffd700, 0xff6347][i % 4] });
        const flower = new THREE.Mesh(flowerGeom, flowerMat);
        flower.position.set(x, 3, z);
        this.scene.add(flower);
      }
    });

    // Fill remaining space with colorful LEGO cubes
    const cubeGrid = [];
    for (let x = -320; x <= 320; x += 100) {
      for (let z = -320; z <= 320; z += 100) {
        if (Math.abs(x) < 150 && Math.abs(z) < 180) continue;
        cubeGrid.push([x, z]);
      }
    }

    cubeGrid.forEach((pos) => {
      const cubeGeom = new THREE.BoxGeometry(15, 12, 15);
      const colors = [0xff0000, 0x0066ff, 0xffdd00, 0x00dd00, 0xff6600, 0xcc00ff];
      const cubeMat = new THREE.MeshPhongMaterial({ color: colors[Math.floor(Math.random() * colors.length)] });
      const cube = new THREE.Mesh(cubeGeom, cubeMat);
      cube.position.set(pos[0], 6, pos[1]);
      cube.castShadow = true;
      cube.receiveShadow = true;
      this.scene.add(cube);
    });

    // Additional decorative towers (mini LEGO towers)
    const miniTowerPositions = [
      [-250, 150], [250, 150],
      [-250, -150], [250, -150],
      [-350, 100], [350, 100],
      [-350, -100], [350, -100],
      [0, 350], [0, -350],
      [-150, 300], [150, 300],
      [-150, -300], [150, -300],
    ];

    miniTowerPositions.forEach((pos) => {
      const colors = [0xff0000, 0x0066ff, 0xffdd00, 0x00dd00, 0xff6600, 0xcc00ff];
      for (let i = 0; i < 3; i++) {
        const blockGeom = new THREE.BoxGeometry(8, 6, 8);
        const blockMat = new THREE.MeshPhongMaterial({ color: colors[i % colors.length] });
        const block = new THREE.Mesh(blockGeom, blockMat);
        block.position.set(pos[0], 3 + i * 6, pos[1]);
        block.castShadow = true;
        block.receiveShadow = true;
        this.scene.add(block);
      }
      // Tower top cap
      const capGeom = new THREE.ConeGeometry(5, 4, 4);
      const capMat = new THREE.MeshPhongMaterial({ color: colors[Math.floor(Math.random() * colors.length)] });
      const cap = new THREE.Mesh(capGeom, capMat);
      cap.position.set(pos[0], 20, pos[1]);
      cap.rotation.y = Math.PI / 4;
      cap.castShadow = true;
      this.scene.add(cap);
    });

    // LEGO bridges/platforms
    const bridgePositions = [
      [-300, -50, 50],
      [300, -50, 50],
      [-300, 50, 50],
      [300, 50, 50],
    ];

    bridgePositions.forEach((pos) => {
      const bridgeGeom = new THREE.BoxGeometry(40, 3, 15);
      const bridgeMat = new THREE.MeshPhongMaterial({ color: 0xffdd00 });
      const bridge = new THREE.Mesh(bridgeGeom, bridgeMat);
      bridge.position.set(pos[0], pos[1], pos[2]);
      bridge.castShadow = true;
      bridge.receiveShadow = true;
      this.scene.add(bridge);

      // Support pillars
      for (let i = 0; i < 3; i++) {
        const pillarGeom = new THREE.BoxGeometry(3, 40, 3);
        const pillarMat = new THREE.MeshPhongMaterial({ color: 0x0066ff });
        const pillar = new THREE.Mesh(pillarGeom, pillarMat);
        pillar.position.set(pos[0] - 15 + i * 15, 20, pos[2]);
        pillar.castShadow = true;
        this.scene.add(pillar);
      }
    });

    // LEGO archways/rings
    const archPositions = [
      [-280, 280],
      [280, 280],
      [-280, -280],
      [280, -280],
    ];

    archPositions.forEach((pos) => {
      const colors = [0xff0000, 0x0066ff, 0xffdd00];
      for (let i = 0; i < 3; i++) {
        const archGeom = new THREE.TorusGeometry(12, 3, 8, 8);
        const archMat = new THREE.MeshPhongMaterial({ color: colors[i] });
        const arch = new THREE.Mesh(archGeom, archMat);
        arch.rotation.z = Math.PI / 2;
        arch.position.set(pos[0], 5 + i * 6, pos[1]);
        arch.castShadow = true;
        this.scene.add(arch);
      }
    });

    // Stacked LEGO blocks in various corners
    const stackPositions = [
      [-350, 200],
      [350, 200],
      [-350, -200],
      [350, -200],
      [150, 350],
      [-150, 350],
      [150, -350],
      [-150, -350],
    ];

    stackPositions.forEach((pos) => {
      const colors = [0xff0000, 0x0066ff, 0xffdd00, 0x00dd00, 0xff6600];
      const numStacks = 4 + Math.floor(Math.random() * 3);
      for (let i = 0; i < numStacks; i++) {
        const blockGeom = new THREE.BoxGeometry(12, 8, 12);
        const blockMat = new THREE.MeshPhongMaterial({ color: colors[i % colors.length] });
        const block = new THREE.Mesh(blockGeom, blockMat);
        block.position.set(pos[0], 4 + i * 8, pos[1]);
        block.castShadow = true;
        block.receiveShadow = true;
        this.scene.add(block);
      }
    });

    // Fill empty spaces around track start/finish area (near 0, -150)
    const startAreaDecorations = [
      // Left side of start line
      [-100, -150], [-80, -180], [-120, -120], [-60, -150], [-90, -200],
      // Right side of start line  
      [100, -150], [80, -180], [120, -120], [60, -150], [90, -200],
    ];

    startAreaDecorations.forEach((pos) => {
      const colors = [0xff0000, 0x0066ff, 0xffdd00, 0x00dd00, 0xff6600];
      const height = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < height; i++) {
        const blockGeom = new THREE.BoxGeometry(14, 7, 14);
        const blockMat = new THREE.MeshPhongMaterial({ color: colors[Math.floor(Math.random() * colors.length)] });
        const block = new THREE.Mesh(blockGeom, blockMat);
        block.position.set(pos[0], 3.5 + i * 7, pos[1]);
        block.castShadow = true;
        block.receiveShadow = true;
        this.scene.add(block);
      }
    });

    // Add some tall towers near start for visual impact
    const startTowerPositions = [
      [-140, -120],
      [140, -120],
    ];

    startTowerPositions.forEach((pos) => {
      const colors = [0xff0000, 0x0066ff, 0xffdd00, 0x00dd00, 0xff6600, 0xcc00ff];
      for (let i = 0; i < 5; i++) {
        const blockGeom = new THREE.BoxGeometry(10, 7, 10);
        const blockMat = new THREE.MeshPhongMaterial({ color: colors[i % colors.length] });
        const block = new THREE.Mesh(blockGeom, blockMat);
        block.position.set(pos[0], 3.5 + i * 7, pos[1]);
        block.castShadow = true;
        block.receiveShadow = true;
        this.scene.add(block);
      }
      // Add cone top
      const capGeom = new THREE.ConeGeometry(6, 5, 4);
      const capMat = new THREE.MeshPhongMaterial({ color: colors[5] });
      const cap = new THREE.Mesh(capGeom, capMat);
      cap.position.set(pos[0], 38, pos[1]);
      cap.rotation.y = Math.PI / 4;
      cap.castShadow = true;
      this.scene.add(cap);
    });

    // Add colorful platforms
    const platformPositions = [
      [-70, -200],
      [70, -200],
      [-70, -100],
      [70, -100],
    ];

    platformPositions.forEach((pos) => {
      const platformGeom = new THREE.BoxGeometry(35, 2, 25);
      const platformMat = new THREE.MeshPhongMaterial({ color: [0xff0000, 0x0066ff, 0xffdd00][Math.floor(Math.random() * 3)] });
      const platform = new THREE.Mesh(platformGeom, platformMat);
      platform.position.set(pos[0], 1, pos[1]);
      platform.castShadow = true;
      platform.receiveShadow = true;
      this.scene.add(platform);
    });
  }

  checkCollisions(player) {
    const playerPos = player.body.position;

    // Keep on ground
    if (playerPos.y < 0.75) {
      player.body.position.y = 0.75;
      player.velocity.y = 0;
    }

    // Out of bounds reset
    if (playerPos.z > 250 || playerPos.z < -250 || playerPos.x > 200 || playerPos.x < -200) {
      player.resetPosition();
    }
  }

  checkFinishLine(player, hud) {
    const playerPos = player.body.position;
    const nearFinish = Math.abs(playerPos.z - this.finishLineZ) < 8;
    
    if (nearFinish && !this.hasPassedFinish) {
      this.hasPassedFinish = true;
      hud.recordLapTime();
    } else if (!nearFinish) {
      this.hasPassedFinish = false;
    }
  }
}

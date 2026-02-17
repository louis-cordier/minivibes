import * as THREE from 'three';
import { Player } from './player.js';
import { Track } from './track.js';
import { Camera } from './camera.js';
import { HUD } from './hud.js';

export class Game {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.player = null;
    this.track = null;
    this.gameCamera = null;
    this.hud = null;
    this.clock = new THREE.Clock();
  }

  init() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.Fog(0x87ceeb, 500, 2000);

    // Camera setup with wider view
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);

    // Lighting
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(100, 200, 100);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    this.scene.add(sunLight);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    // Create track
    this.track = new Track(this.scene);

    // Create player
    this.player = new Player(this.scene);

    // Create camera controller
    this.gameCamera = new Camera(this.camera, this.player);

    // Create HUD
    this.hud = new HUD();

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    // Update player
    this.player.update(delta);

    // Update camera
    this.gameCamera.update();

    // Check collisions with track
    this.track.checkCollisions(this.player);

    // Check finish line
    this.track.checkFinishLine(this.player, this.hud);

    // Update HUD
    this.hud.update(this.player);

    // Render
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}

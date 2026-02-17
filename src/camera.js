import * as THREE from 'three';

export class Camera {
  constructor(camera, player) {
    this.camera = camera;
    this.player = player;
    this.distance = 40;
    this.height = 25;
  }

  update() {
    // Follow player from behind and above with wider view
    const playerPos = this.player.body.position;
    const direction = new THREE.Vector3(0, 0, 1);
    direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.player.body.rotation.y);

    const cameraPos = playerPos.clone();
    cameraPos.addScaledVector(direction, -this.distance);
    cameraPos.y += this.height;

    this.camera.position.lerp(cameraPos, 0.1);
    this.camera.lookAt(playerPos.clone().add(new THREE.Vector3(0, 5, 0)));
  }
}

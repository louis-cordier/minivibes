export class HUD {
  constructor() {
    this.startTime = Date.now();
    this.checkpoints = 0;
    this.lastCheckpointZ = -150;
    this.lapTimes = [];
    this.createHUD();
  }

  createHUD() {
    const hudContainer = document.createElement('div');
    hudContainer.id = 'hud';
    hudContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      color: white;
      font-family: Arial, sans-serif;
      font-size: 16px;
      z-index: 100;
      background: rgba(0, 0, 0, 0.7);
      padding: 20px;
      border-radius: 8px;
      min-width: 280px;
    `;

    this.speedDisplay = document.createElement('div');
    this.timeDisplay = document.createElement('div');
    this.checkpointDisplay = document.createElement('div');
    this.lapTimeDisplay = document.createElement('div');

    hudContainer.appendChild(this.speedDisplay);
    hudContainer.appendChild(this.timeDisplay);
    hudContainer.appendChild(this.checkpointDisplay);
    hudContainer.appendChild(this.lapTimeDisplay);

    document.body.appendChild(hudContainer);
  }

  recordLapTime() {
    const lapTime = ((Date.now() - this.startTime) / 1000).toFixed(2);
    this.lapTimes.push(parseFloat(lapTime));
    this.startTime = Date.now();
    this.checkpoints = 0;
    this.lastCheckpointZ = -150;
  }

  update(player) {
    // Calculate actual speed from velocity
    const speedValue = Math.sqrt(player.velocity.x ** 2 + player.velocity.z ** 2) + Math.abs(player.speed) * 0.5;
    const speedKmh = Math.round(speedValue * 3.6);

    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);

    // Checkpoint tracking
    if (player.body.position.z > this.lastCheckpointZ + 50) {
      this.checkpoints++;
      this.lastCheckpointZ = player.body.position.z;
    }

    const speedStyle = 'font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #ff6600;';
    const normalStyle = 'margin-bottom: 8px;';
    
    this.speedDisplay.innerHTML = `<div style="${speedStyle}">⚡ ${speedKmh} km/h</div>`;
    this.timeDisplay.innerHTML = `<div style="${normalStyle}">⏱️ Time: ${elapsed}s</div>`;
    this.checkpointDisplay.innerHTML = `<div style="${normalStyle}">🚩 Checkpoints: ${this.checkpoints}</div>`;
    
    let lapTimesHTML = '';
    if (this.lapTimes.length > 0) {
      lapTimesHTML = `<div style="margin-top: 10px; border-top: 1px solid #666; padding-top: 10px; color: #ffdd00;">`;
      lapTimesHTML += `<div style="font-weight: bold; margin-bottom: 5px;">LAP TIMES:</div>`;
      this.lapTimes.forEach((time, idx) => {
        lapTimesHTML += `<div>#${idx + 1}: ${time}s</div>`;
      });
      lapTimesHTML += `</div>`;
    }
    this.lapTimeDisplay.innerHTML = lapTimesHTML;
  }
}

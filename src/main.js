import * as THREE from 'three';
import { Game } from './game.js';

// Initialize game
const game = new Game();
game.init();
game.animate();

// Store reference for finish line detection
window.gameInstance = game;

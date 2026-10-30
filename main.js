/**
 * Black Hole Simulation - Main Entry Point
 *
 * Sets up Three.js WebGPU renderer, camera controls, and post-processing.
 * Connects the simulation to the UI controls.
 */

import * as THREE from 'three/webgpu';
import { pass } from 'three/tsl';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { BlackHoleSimulation } from './blackhole.js';
import { BlackHoleUI } from './ui.js';
import { CameraAnimation } from './camera-animation.js';
import { updateDiskMarkers } from './disk-popups.js';
import { updateMusicTrigger } from './music-player.js';
import { compactViewport } from './viewport.js';

// ============================================================================
// LOCAL STORAGE
// ============================================================================

const STORAGE_KEY = 'blackhole-simulation-config';

// List of color property keys that need normalization
// Note: diskInnerColor/diskOuterColor removed - now using blackbody radiation
const COLOR_PROPERTIES = [
  'starBackgroundColor',
  'nebula1Color',
  'nebula2Color'
];

/**
 * Convert a color value to hex string.
 * Handles Tweakpane's color object format {r, g, b} or hex strings.
 */
function normalizeColorToHex(value) {
  if (typeof value === 'string') {
    return value;
  }
  if (value && typeof value === 'object') {
    // Tweakpane color object format {r, g, b} with values 0-255
    const r = Math.round(value.r ?? 0);
    const g = Math.round(value.g ?? 0);
    const b = Math.round(value.b ?? 0);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  return '#000000';
}

/**
 * Load configuration from localStorage, merging with defaults.
 */
function loadConfig(defaults) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Normalize any color properties that may have been saved as objects
      for (const key of COLOR_PROPERTIES) {
        if (parsed[key] !== undefined) {
          parsed[key] = normalizeColorToHex(parsed[key]);
        }
      }
      // Merge saved values with defaults (defaults provide any missing keys)
      return { ...defaults, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load config from localStorage:', e);
  }
  return { ...defaults };
}

/**
 * Save current configuration to localStorage.
 * Normalizes color values to hex strings before saving.
 */
function saveConfig(config) {
  try {
    // Create a copy and normalize colors to hex strings
    const normalizedConfig = { ...config };
    for (const key of COLOR_PROPERTIES) {
      if (normalizedConfig[key] !== undefined) {
        normalizedConfig[key] = normalizeColorToHex(normalizedConfig[key]);
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedConfig));
    console.log('Configuration saved to localStorage');
  } catch (e) {
    console.warn('Failed to save config to localStorage:', e);
  }
}

/**
 * Clear configuration from localStorage.
 */
function clearConfig() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Configuration cleared from localStorage');
  } catch (e) {
    console.warn('Failed to clear config from localStorage:', e);
  }
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const defaultConfig = {
  "blackHoleMass": 0.4,
  "diskInnerRadius": 4.1,
  "diskOuterRadius": 14.5,
  "diskTemperature": 49.78,
  "temperatureFalloff": 5.22,
  "diskBrightness": 5,
  "diskRotationSpeed": -8.7,
  "turbulenceScale": 1.81,
  "turbulenceStretch": 0.75,
  "turbulenceSharpness": 7.4,
  "turbulenceCycleTime": 5,
  "turbulenceLacunarity": 3,
  "turbulencePersistence": 0.8,
  "diskEdgeSoftnessInner": 0.18,
  "diskEdgeSoftnessOuter": 0.5,
  "gravitationalLensing": 2.4,
  "dopplerStrength": 1.0,
  "stepSize": 1,
  "starsEnabled": true,
  "starBackgroundColor": "#000000",
  "starDensity": 0.1,
  "starSize": 1.2,
  "starBrightness": 0.1,
  "nebulaEnabled": true,
  "nebula1Scale": 2,
  "nebula1Density": 0.5,
  "nebula1Brightness": 0.01,
  "nebula1Color": "#071f44",
  "nebula2Scale": 5.5,
  "nebula2Density": 0.05,
  "nebula2Brightness": 0.21,
  "nebula2Color": "#010615",
  "bloomStrength": 0.68,
  "bloomRadius": 0.2,
  "bloomThreshold": 0.4,
  "turbulenceBrightness": -0.05,
  "diskDensity": 1,
  "qualityPreset": "medium",
  "diskInnerThickness": 0.7,
  "diskOuterThickness": 0.5,
  "ringEnabled": true,
  "ringScale": 0.83,
  "ringContrast": 0.95,
  "ringBrightness": 0.4,
  "ringSharpness": 10,
  "ringTwist": 10.3,
  "noiseAnimFrequency": 4.2,
  "noiseAnimAmplitude": 2,
  "diskRadialFalloff": 2,
  "diskOpacityFalloff": 0.5,
  "adaptiveMinStep": 0.15,
  "stepJitter": 0,
  "diskInnerColor": "#a84b23",
  "diskOuterColor": "#7f1b00",
  "nebulaBrightness": 0.07,
  "nebulaColor1": "#113844",
  "nebulaColor2": "#1b214a",
  "nebulaScale1": 3,
  "nebulaScale2": 3.5,
  "nebulaBlend": 0.55,
  "nebulaSpeed": 0.065,
  "nebulaDensity": 0.35,
  "diskDifferentialRotation": 1,
  "noiseEvolutionSpeed": 5,
  "raySteps": 68,
  "nebulaScale": 3,
  "nebulaDetailScale": 2.4,
  "nebulaOffsetX": 0,
  "nebulaOffsetY": 0,
  "nebulaOffsetZ": 0,
  "diskTurbulence": 0.9,
  "turbulencePrimaryScale": 0.65,
  "turbulenceSecondaryScale": 1.3,
  "turbulenceSecondaryStrength": 0.15,
  "turbulenceOffset": 0.1,
  "ringNoiseEnabled": true,
  "ringNoiseScale": 4.5,
  "ringNoiseAmplitude": 1.45,
  "ringNoiseSharpness": 4,
  "ringNoiseOffset": -0.2,
  "ringNoiseOctaves": 2,
  "ringNoiseLacunarity": 1.9,
  "ringNoisePersistence": 0.45,
  "maxRayDistance": 500,
  "diskThickness": 1.3,
  "heightDensityFalloff": 5,
  "rayJitter": 1,
  "temporalAA": false,
  "temporalFrames": 16
}

// Load config from localStorage (merges with defaults)
const config = loadConfig(defaultConfig);

// ============================================================================
// SCENE SETUP
// ============================================================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, -5, 20);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, compactViewport.matches ? 1 : 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.domElement.className = 'simulation-canvas';
renderer.domElement.setAttribute('aria-hidden', 'true');
document.body.appendChild(renderer.domElement);

// ============================================================================
// ORBIT CONTROLS
// ============================================================================

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = -0.4;
controls.minDistance = 22;
controls.maxDistance = 22;
controls.enablePan = false;
;
controls.target.set(0, 0, 0);

// ============================================================================
// CAMERA ANIMATION
// ============================================================================

const cameraAnimation = new CameraAnimation(camera, controls);

// ============================================================================
// POST-PROCESSING
// ============================================================================

let postProcessing = null;
let bloomPassNode = null;

function setupBloom() {
  if (!postProcessing) return;

  const scenePass = pass(scene, camera);
  const scenePassColor = scenePass.getTextureNode();

  bloomPassNode = bloom(scenePassColor);
  bloomPassNode.threshold.value = config.bloomThreshold;
  bloomPassNode.strength.value = config.bloomStrength;
  bloomPassNode.radius.value = config.bloomRadius;

  postProcessing.outputNode = scenePassColor.add(bloomPassNode);
}

// ============================================================================
// BLACK HOLE SIMULATION
// ============================================================================

const blackHoleSimulation = new BlackHoleSimulation(scene, config);
blackHoleSimulation.createBlackHole();

// ============================================================================
// UI CONTROLS
// ============================================================================

const ui = new BlackHoleUI(config);

// ============================================================================
// FPS COUNTER
// ============================================================================




// ============================================================================
// ANIMATION LOOP
// ============================================================================

let lastFrameTime = performance.now();
const portfolioDialog = document.querySelector('#disk-popup');

async function animate() {
  requestAnimationFrame(animate);

  const currentTime = performance.now();
  const deltaTime = Math.min((currentTime - lastFrameTime) / 1000, 0.033);
  lastFrameTime = currentTime;

  // Spend the GPU budget on the scene only while it is visible and in use.
  if (document.hidden || portfolioDialog.open || document.documentElement.dataset.portfolioView === 'simple') return;

  // Update camera animation (if playing)
  cameraAnimation.update(deltaTime);

  // Update controls (only effective when animation not playing)
  controls.update();
  updateDiskMarkers(camera, config);
  updateMusicTrigger(camera, config);

  // Update black hole simulation
  blackHoleSimulation.update(deltaTime, camera);

  // Render
  if (postProcessing) {
    postProcessing.render();
  } else {
    renderer.render(scene, camera);
  }

}

// ============================================================================
// WINDOW RESIZE
// ============================================================================

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, compactViewport.matches ? 1 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  blackHoleSimulation.onResize(window.innerWidth, window.innerHeight);
});

// ============================================================================
// INITIALIZATION
// ============================================================================

renderer.init().then(() => {
  postProcessing = new THREE.PostProcessing(renderer);
  setupBloom();
  animate();
}).catch(err => {
  console.error('Failed to initialize WebGPU renderer:', err);
  // The portfolio and its dock remain usable without graphics support.
  controls.dispose();
  renderer.domElement.remove();
});

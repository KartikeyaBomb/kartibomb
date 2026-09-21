/**
 * UI Controls for Black Hole Simulation
 *
 * Uses Tweakpane for real-time parameter adjustment.
 * Organized into logical folders matching the simulation components.
 */

import { Pane } from 'tweakpane';

export class BlackHoleUI {
  constructor(config) {
    this.config = config;
    }

 

  // ==========================================================================
  // CAMERA ANIMATION
  // ==========================================================================

  setupCameraFolder() {
    const cameraFolder = this.pane.addFolder({
      title: 'Camera',
      expanded: true
    });

    // Animation state tracking
    this.cameraAnimState = { playing: false };

    // Toggle button for cinematic animation
    this.animButton = cameraFolder.addButton({
      title: 'Start Cinematic Mode'
    }).on('click', () => {
      const isPlaying = this.callbacks.onToggleCameraAnimation?.();
      this.cameraAnimState.playing = isPlaying;
      this.animButton.title = isPlaying ? 'Stop Cinematic Mode' : 'Start Cinematic Mode';
      if (isPlaying) {
        this.showNotification('Cinematic mode started - enjoy the show!');
      } else {
        this.showNotification('Cinematic mode stopped');
      }
    });

    // Info text
    cameraFolder.addBlade({
      view: 'text',
      label: '',
      parse: (v) => String(v),
      value: 'Smooth camera flythrough'
    });
  }

  // ==========================================================================
  // CONFIGURATION MANAGEMENT
  // ==========================================================================

  

  // ==========================================================================
  // PERFORMANCE CONTROLS
  // ==========================================================================

  

  // ==========================================================================
  // BLACK HOLE & ACCRETION DISK
  // ==========================================================================

  

  // ==========================================================================
  // STARS
  // ==========================================================================

  

  // ==========================================================================
  // BLOOM POST-PROCESSING
  // ==========================================================================

  setupBloomFolder() {
    const bloomFolder = this.pane.addFolder({ title: 'Bloom' });

    bloomFolder.addBinding(this.config, 'bloomStrength', {
      min: 0,
      max: 3,
      step: 0.01,
      label: 'Strength'
    }).on('change', () => {
      this.callbacks.onBloomChange('strength', this.config.bloomStrength);
    });

    bloomFolder.addBinding(this.config, 'bloomRadius', {
      min: 0,
      max: 1,
      step: 0.01,
      label: 'Radius'
    }).on('change', () => {
      this.callbacks.onBloomChange('radius', this.config.bloomRadius);
    });

    bloomFolder.addBinding(this.config, 'bloomThreshold', {
      min: 0,
      max: 1,
      step: 0.01,
      label: 'Threshold'
    }).on('change', () => {
      this.callbacks.onBloomChange('threshold', this.config.bloomThreshold);
    });
  }

  // ==========================================================================
  // PUBLIC METHODS
  // ==========================================================================

  updateFPS(fps) {
    this.perfParams.fps = fps;
    this.pane.refresh();
  }

  
}

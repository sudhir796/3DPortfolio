import * as THREE from 'three';

/**
 * Shared Scene Layout Configuration
 * Single source of truth for 3D object positions, bounding boxes,
 * and derived camera stations.
 *
 * Scene components and stations.js both import from here,
 * guaranteeing they can never drift out of sync.
 */

export const GUILD_LAYOUT = {
  entrance: {
    id: 'entrance',
    name: 'Guild Entrance',
    position: [0.0, 0.0, 7.85],
    rotation: [0.0, 0.0, 0.0],
    targetCenter: [0.0, 2.0, -1.5], // Vista looking into the hall
    boundingBox: {
      min: new THREE.Vector3(-2.5, 0.0, 6.8),
      max: new THREE.Vector3(2.5, 4.5, 8.2),
      center: new THREE.Vector3(0.0, 2.25, 7.5),
      size: new THREE.Vector3(5.0, 4.5, 1.4),
    },
    // Eye height wide angle looking forward into the hall
    cameraPose: [0.0, 2.3, 6.8],
    lookAtTarget: [0.0, 2.0, -1.5],
    panelSide: 'left',
  },

  questBoard: {
    id: 'quest-board',
    name: 'Quest Notice Board',
    position: [-6.2, 0.0, -0.5],
    rotation: [0.0, 0.25, 0.0],
    targetCenter: [-6.2, 2.25, -0.5], // Center of cork notice board face
    boundingBox: {
      min: new THREE.Vector3(-8.5, 0.0, -1.4),
      max: new THREE.Vector3(-3.9, 3.8, 0.4),
      center: new THREE.Vector3(-6.2, 2.25, -0.5),
      size: new THREE.Vector3(4.6, 3.8, 1.8),
    },
    // Positioned 5.4m back, angled to frame the entire board in the open 60% of view
    // Leaves right side 40% completely open for the overlay panel with zero overlap
    cameraPose: [-1.8, 2.25, 3.2],
    lookAtTarget: [-4.6, 2.25, -0.6],
    panelSide: 'right', // Panel sits on the right, board on the left-center
  },

  magicCircle: {
    id: 'magic-circle',
    name: 'Appraisal Dais & Magic Circle',
    position: [6.5, 0.0, -1.8],
    rotation: [0.0, 0.0, 0.0],
    targetCenter: [6.5, 1.25, -1.8], // Center of stone dais, rings, and floating crystals
    boundingBox: {
      min: new THREE.Vector3(3.8, 0.0, -4.5),
      max: new THREE.Vector3(9.2, 2.8, 0.9),
      center: new THREE.Vector3(6.5, 1.25, -1.8),
      size: new THREE.Vector3(5.4, 2.8, 5.4),
    },
    // Positioned ~5.8m back from center, elevated at y=2.8 looking downward at y=1.25
    // Frames the floor circle, stone steps, orbiting crystals, and particles together
    cameraPose: [2.2, 2.8, 1.8],
    lookAtTarget: [6.5, 1.25, -1.8],
    panelSide: 'left', // Panel sits on the left, magic circle on the right
  },

  tavern: {
    id: 'tavern',
    name: 'Tavern Seating & Hearth',
    position: [8.0, 0.0, 3.2],
    rotation: [0.0, 0.0, 0.0],
    targetCenter: [8.0, 1.4, 3.2],
    boundingBox: {
      min: new THREE.Vector3(5.0, 0.0, 0.8),
      max: new THREE.Vector3(11.2, 2.8, 6.2),
      center: new THREE.Vector3(8.0, 1.4, 3.5),
      size: new THREE.Vector3(6.2, 2.8, 5.4),
    },
    // Positioned ~5.3m away looking across dining tables towards fireplace
    cameraPose: [3.4, 2.2, 0.8],
    lookAtTarget: [8.0, 1.4, 3.2],
    panelSide: 'left',
  },

  receptionDesk: {
    id: 'reception',
    name: 'Guild Registrar Counter',
    position: [0.0, 0.0, -5.2],
    rotation: [0.0, 0.0, 0.0],
    targetCenter: [0.0, 1.55, -5.2], // Floating card and ledger
    boundingBox: {
      min: new THREE.Vector3(-2.8, 0.0, -6.2),
      max: new THREE.Vector3(2.8, 3.2, -4.2),
      center: new THREE.Vector3(0.0, 1.55, -5.2),
      size: new THREE.Vector3(5.6, 3.2, 2.0),
    },
    // Positioned 5.0m directly in front of registrar counter
    cameraPose: [0.0, 2.1, -0.2],
    lookAtTarget: [0.0, 1.55, -5.2],
    panelSide: 'left',
  },
};

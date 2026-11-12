import * as THREE from 'three';
import { GUILD_LAYOUT } from './layout';

/**
 * Stations configuration for the 3D Anime Adventurers' Guild Journey.
 *
 * Each station's camera position and lookAt target are derived directly
 * from GUILD_LAYOUT, guaranteeing zero drift between 3D scene props and camera framing.
 */

export const STATIONS = [
  {
    id: GUILD_LAYOUT.entrance.id,
    stationIndex: 0,
    label: 'Welcome, Adventurer',
    category: 'Introduction & Hero',
    badge: 'GUILD ENTRANCE',
    subtitle: 'Step into the grand tavern hall at dusk. Seek your next legendary party member.',
    panelSide: GUILD_LAYOUT.entrance.panelSide,
    scrollRange: [0.0, 0.16],
    dwellCenter: 0.05,
    cameraPos: GUILD_LAYOUT.entrance.cameraPose,
    lookAtTarget: GUILD_LAYOUT.entrance.lookAtTarget,
    layoutKey: 'entrance',
    ambience: {
      ambientIntensity: 0.65,
      duskIntensity: 1.4,
      magicBoost: 1.0,
      fireBoost: 1.0,
      fogDensity: 0.02,
    },
  },
  {
    id: GUILD_LAYOUT.questBoard.id,
    stationIndex: 1,
    label: 'Active Quests',
    category: 'Projects & Work',
    badge: 'NOTICE BOARD',
    subtitle: 'High-bounty contracts, full-stack applications, and interactive digital realms.',
    panelSide: GUILD_LAYOUT.questBoard.panelSide,
    scrollRange: [0.22, 0.38],
    dwellCenter: 0.30,
    cameraPos: GUILD_LAYOUT.questBoard.cameraPose,
    lookAtTarget: GUILD_LAYOUT.questBoard.lookAtTarget,
    layoutKey: 'questBoard',
    ambience: {
      ambientIntensity: 0.75,
      duskIntensity: 1.6,
      magicBoost: 1.0,
      fireBoost: 1.1,
      fogDensity: 0.02,
    },
  },
  {
    id: GUILD_LAYOUT.magicCircle.id,
    stationIndex: 2,
    label: 'Appraisal Dais',
    category: 'Abilities & Skills',
    badge: 'STAT PEDESTAL',
    subtitle: 'Arcane proficiencies, mastered spells, frameworks, and certified attributes.',
    panelSide: GUILD_LAYOUT.magicCircle.panelSide,
    scrollRange: [0.44, 0.60],
    dwellCenter: 0.52,
    cameraPos: GUILD_LAYOUT.magicCircle.cameraPose,
    lookAtTarget: GUILD_LAYOUT.magicCircle.lookAtTarget,
    layoutKey: 'magicCircle',
    ambience: {
      ambientIntensity: 0.6,
      duskIntensity: 1.0,
      magicBoost: 2.4, // Enhanced teal/cyan mana glow
      fireBoost: 1.0,
      fogDensity: 0.025,
    },
  },
  {
    id: GUILD_LAYOUT.tavern.id,
    stationIndex: 3,
    label: 'Journey So Far',
    category: 'Experience & Lore',
    badge: 'TAVERN HEARTH',
    subtitle: 'Pull up a stool by the blazing fire. Tales of past campaigns, guilds, and victories.',
    panelSide: GUILD_LAYOUT.tavern.panelSide,
    scrollRange: [0.66, 0.82],
    dwellCenter: 0.74,
    cameraPos: GUILD_LAYOUT.tavern.cameraPose,
    lookAtTarget: GUILD_LAYOUT.tavern.lookAtTarget,
    layoutKey: 'tavern',
    ambience: {
      ambientIntensity: 0.8,
      duskIntensity: 0.8,
      magicBoost: 1.0,
      fireBoost: 1.8,
      fogDensity: 0.02,
    },
  },
  {
    id: GUILD_LAYOUT.receptionDesk.id,
    stationIndex: 4,
    label: 'Guild Registry',
    category: 'Contact & Hire',
    badge: 'REGISTRAR DESK',
    subtitle: 'Present your adventurer guild pass, leave a parchment note, or commission a new quest.',
    panelSide: GUILD_LAYOUT.receptionDesk.panelSide,
    scrollRange: [0.88, 1.0],
    dwellCenter: 0.95,
    cameraPos: GUILD_LAYOUT.receptionDesk.cameraPose,
    lookAtTarget: GUILD_LAYOUT.receptionDesk.lookAtTarget,
    layoutKey: 'receptionDesk',
    ambience: {
      ambientIntensity: 0.7,
      duskIntensity: 1.2,
      magicBoost: 1.6,
      fireBoost: 1.0,
      fogDensity: 0.02,
    },
  },
];

// Helper curves generation
export function createStationCurves() {
  const points = STATIONS.map((s) => new THREE.Vector3(...s.cameraPos));
  const targetPoints = STATIONS.map((s) => new THREE.Vector3(...s.lookAtTarget));

  // Position curve
  const positionCurve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.25);
  // LookAt target curve
  const targetCurve = new THREE.CatmullRomCurve3(targetPoints, false, 'catmullrom', 0.25);

  return { positionCurve, targetCurve };
}

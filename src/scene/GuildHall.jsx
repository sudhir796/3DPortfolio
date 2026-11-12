import React, { useRef } from 'react';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { PALETTE, LIGHTING } from '../theme';
import { POSTFX_CONFIG } from '../data/postfx';
import { useQuality } from '../hooks/useQuality';

import Floor from './Floor';
import Walls from './Walls';
import Ceiling from './Ceiling';
import Windows from './Windows';
import Entrance from './Entrance';
import QuestBoard from './QuestBoard';
import ReceptionDesk from './ReceptionDesk';
import MagicCircle from './MagicCircle';
import TavernArea from './TavernArea';
import Fireplace from './Fireplace';
import Banners from './Banners';
import Lanterns from './Lanterns';
import Bookshelves from './Bookshelves';
import Particles from './Particles';
import AmbienceController from './AmbienceController';

/**
 * GuildHall: Complete 3D Anime Fantasy Adventurers' Guild Scene
 * Assembles all 8 zones, lighting, shadows, and subtle Bloom postprocessing.
 */
export default function GuildHall() {
  const ambientLightRef = useRef();
  const dirLightRef = useRef();
  const { config } = useQuality();

  return (
    <group name="AdventurersGuild_Hall">
      {/* Dynamic station ambience lighting shifts */}
      <AmbienceController
        ambientRef={ambientLightRef}
        dirLightRef={dirLightRef}
      />

      {/* ---------------- LIGHTING & ATMOSPHERE ---------------- */}
      {/* Atmospheric Tavern Fog - tuned to 18m-55m so 5-8m station objects stay sharp */}
      <color attach="background" args={[PALETTE.fogColor]} />
      <fog attach="fog" args={[PALETTE.fogColor, 18, 55]} />

      {/* Low Ambient Light */}
      <ambientLight
        ref={ambientLightRef}
        color={LIGHTING.ambient.color}
        intensity={LIGHTING.ambient.intensity}
      />

      {/* Dusk Directional Sunlight streaming in through the left windows */}
      <directionalLight
        ref={dirLightRef}
        color={LIGHTING.duskDirectional.color}
        intensity={LIGHTING.duskDirectional.intensity}
        position={LIGHTING.duskDirectional.position}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={32}
        shadow-camera-top={8}
        shadow-camera-bottom={-4}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-bias={-0.0005}
      />

      {/* ---------------- SCENE GEOMETRY & ZONES ---------------- */}
      {/* 1. Hall Shell */}
      <Floor />
      <Walls />
      <Ceiling />
      <Windows />

      {/* 2. Entrance Portal */}
      <Entrance />

      {/* 3. Quest Board Zone */}
      <QuestBoard />

      {/* 4. Reception Desk Zone */}
      <ReceptionDesk />

      {/* 5. Stat/Skill Magic Circle Zone */}
      <MagicCircle />

      {/* 6. Tavern Dining Area & Storage */}
      <TavernArea />

      {/* 7. Stone Fireplace & Animated Fire */}
      <Fireplace />

      {/* 8. Decor: Guild Banners, Hanging Lanterns, Bookshelves, Particles */}
      <Banners />
      <Lanterns />
      <Bookshelves />
      <Particles />

      {/* ---------------- POST-PROCESSING (Configured via src/data/postfx.js) ---------------- */}
      {config.enablePostprocessing && (
        <EffectComposer disableNormalPass multisampling={0}>
          {config.enableBloom && (
            <Bloom
              intensity={POSTFX_CONFIG.bloom.intensity}
              luminanceThreshold={POSTFX_CONFIG.bloom.luminanceThreshold}
              luminanceSmoothing={POSTFX_CONFIG.bloom.luminanceSmoothing}
              mipmapBlur={POSTFX_CONFIG.bloom.mipmapBlur}
            />
          )}
          {config.enableVignette && (
            <Vignette
              offset={POSTFX_CONFIG.vignette.offset}
              darkness={POSTFX_CONFIG.vignette.darkness}
            />
          )}
          {config.enableNoise && (
            <Noise opacity={POSTFX_CONFIG.noise.opacity} />
          )}
        </EffectComposer>
      )}
    </group>
  );
}

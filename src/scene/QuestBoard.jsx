import React, { useState, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Outlines } from '@react-three/drei';
import * as THREE from 'three';
import { PALETTE, TOON_RAMP } from '../theme';
import { quests } from '../data/content';
import { usePortfolioInteraction } from '../hooks/usePortfolioInteraction';
import { createTextTexture } from '../utils/canvasTextures';
import { GUILD_LAYOUT } from '../data/layout';
import { useQuality } from '../hooks/useQuality';

/**
 * Single 3D Quest Note on the Board
 */
function QuestNote({ quest, index, x, y, rotZ }) {
  const {
    selectedQuestId,
    setSelectedQuestId,
    hoveredQuestId,
    setHoveredQuestId,
    activeTrackFilter,
  } = usePortfolioInteraction();

  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  const isSelected = selectedQuestId === quest.id;
  const isHovered = hovered || hoveredQuestId === quest.id;

  // Track filter matching check
  const isMatch =
    activeTrackFilter === 'ALL' || quest.track.includes(activeTrackFilter);

  const rankColor =
    quest.rank === 'A'
      ? '#ff4d4f'
      : quest.rank === 'B'
      ? '#5ee6ff'
      : '#ffb347';

  // Smooth hover and filter transitions in useFrame
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Target Z position (lift on hover/select)
    const targetZ = isSelected ? 0.22 : isHovered ? 0.18 : 0.1;
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      targetZ,
      10,
      delta
    );

    // Target Scale (dim and shrink if not matching filter)
    const baseScale = isMatch ? (isHovered ? 1.06 : 1.0) : 0.88;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.damp(groupRef.current.scale.x, baseScale, 8, delta)
    );
  });

  // Parchment paper shades variation
  const paperColor =
    index % 3 === 0
      ? PALETTE.parchmentLight
      : index % 3 === 1
      ? PALETTE.parchmentMedium
      : PALETTE.parchmentDark;

  // Procedural badge texture (instant, offline, zero external font fetch)
  const trackLabel =
    quest.track.includes('AIML') && quest.track.includes('FULLSTACK')
      ? 'AI + FULLSTACK'
      : quest.track.includes('AIML')
      ? 'AI / ML BOUNTY'
      : 'FULL-STACK BOUNTY';

  const noteTexture = useMemo(() => {
    return createTextTexture({
      text: `RANK ${quest.rank}`,
      subtext: trackLabel,
      width: 256,
      height: 180,
      font: 'bold 64px "Cinzel", "Georgia", serif',
      subfont: 'bold 20px "Cinzel", sans-serif',
      color: rankColor,
      subcolor: '#6b4226',
      backgroundColor: 'transparent',
    });
  }, [quest.rank, trackLabel, rankColor]);

  return (
    <group
      ref={groupRef}
      position={[x, y, 0.1]}
      rotation={[0, 0, rotZ]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        setHoveredQuestId(quest.id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        setHoveredQuestId(null);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedQuestId(quest.id);
      }}
    >
      {/* Parchment Notice Paper Plane */}
      <mesh castShadow receiveShadow>
        <planeGeometry args={[0.66, 0.54]} />
        <meshToonMaterial
          color={paperColor}
          gradientMap={TOON_RAMP}
          side={THREE.DoubleSide}
          transparent
          opacity={isMatch ? 1.0 : 0.28}
        />
      </mesh>

      {/* Top Guild Red Ribbon Header */}
      <mesh position={[0, 0.21, 0.002]}>
        <planeGeometry args={[0.54, 0.05]} />
        <meshBasicMaterial
          color={PALETTE.guildRed}
          transparent
          opacity={isMatch ? 0.75 : 0.2}
        />
      </mesh>

      {/* Procedural Rank & Track Printed on Note */}
      <mesh position={[0, -0.02, 0.005]}>
        <planeGeometry args={[0.55, 0.38]} />
        <meshBasicMaterial
          map={noteTexture}
          transparent
          opacity={isMatch ? 0.95 : 0.3}
        />
      </mesh>

      {/* Pushpin Sphere */}
      <mesh position={[0, 0.23, 0.02]} castShadow>
        <sphereGeometry args={[0.026, 8, 8]} />
        <meshToonMaterial
          color={isHovered ? '#ffb347' : PALETTE.brassWarm}
          gradientMap={TOON_RAMP}
        />
      </mesh>

      {/* Hover Floating Tooltip */}
      {isHovered && (
        <Html
          position={[0, 0.42, 0.05]}
          center
          distanceFactor={10}
          zIndexRange={[100, 0]}
        >
          <div
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: 'rgba(20, 16, 25, 0.94)',
              border: `1px solid ${rankColor}`,
              color: '#f6eedb',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: '"Cinzel", "Georgia", serif',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 16px rgba(0,0,0,0.8), 0 0 10px rgba(255,179,71,0.3)',
              pointerEvents: 'none',
              transform: 'scale(0.95)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ color: rankColor }}>⚔</span>
            <span>{quest.title}</span>
            <span style={{ color: '#d4af37', fontSize: '10px' }}>(Click to view)</span>
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * QuestBoard component: Big wooden notice board on posts with 10 real pinned quest notices.
 */
export default function QuestBoard({
  position = GUILD_LAYOUT.questBoard.position,
  rotation = GUILD_LAYOUT.questBoard.rotation,
}) {
  const { config } = useQuality();
  // 10 quests mapped across 2 rows and 5 columns
  const notePositions = useMemo(() => {
    const list = [];
    const cols = 5;
    const rows = 2;
    const spacingX = 0.76;
    const spacingY = 0.68;

    for (let i = 0; i < quests.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = (col - (cols - 1) / 2) * spacingX + ((row % 2 === 0 ? 0.03 : -0.03));
      const y = (0.5 - row) * spacingY;
      const rotZ = ((i * 7) % 9 - 4) * 0.025;

      list.push({
        quest: quests[i],
        x,
        y,
        rotZ,
      });
    }
    return list;
  }, []);

  const headerPlateTexture = useMemo(() => {
    return createTextTexture({
      text: 'ACTIVE BOUNTIES',
      width: 512,
      height: 96,
      font: 'bold 44px "Cinzel", "Georgia", serif',
      color: PALETTE.ironDark,
    });
  }, []);

  return (
    <group name="GuildHall_QuestBoard" position={position} rotation={rotation}>
      {/* Two Ground Posts */}
      <mesh position={[-2.1, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, 3.6, 0.22]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>
      <mesh position={[2.1, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, 3.6, 0.22]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>

      {/* Main Board Frame */}
      <group position={[0, 2.3, 0]}>
        {/* Outer Timber Border */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.4, 2.5, 0.16]} />
          <meshToonMaterial color={PALETTE.woodMedium} gradientMap={TOON_RAMP} />
          {config.enableOutlines && <Outlines thickness={0.025} color="#231410" opacity={0.65} transparent />}
        </mesh>

        {/* Inner Cork / Dark Wood Board Face */}
        <mesh position={[0, 0, 0.05]} receiveShadow>
          <boxGeometry args={[4.1, 2.2, 0.08]} />
          <meshToonMaterial color={PALETTE.woodPlankA} gradientMap={TOON_RAMP} />
        </mesh>

        {/* Top Pitched Rooflet / Overhang */}
        <mesh position={[0, 1.35, 0.1]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[4.6, 0.08, 0.5]} />
          <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
        </mesh>

        {/* "QUESTS" / "COMMISSIONS" top banner plate */}
        <mesh position={[0, 1.05, 0.1]}>
          <boxGeometry args={[1.8, 0.25, 0.05]} />
          <meshToonMaterial color={PALETTE.brassWarm} gradientMap={TOON_RAMP} />
        </mesh>
        <mesh position={[0, 1.05, 0.13]}>
          <planeGeometry args={[1.75, 0.22]} />
          <meshBasicMaterial map={headerPlateTexture} transparent />
        </mesh>

        {/* 10 Pinned Quest Notes from content.js */}
        {notePositions.map((item, idx) => (
          <QuestNote
            key={item.quest.id}
            quest={item.quest}
            index={idx}
            x={item.x}
            y={item.y}
            rotZ={item.rotZ}
          />
        ))}
      </group>

      {/* Cross-brace behind the board */}
      <mesh position={[0, 1.2, -0.1]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[3.2, 0.1, 0.06]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>
      <mesh position={[0, 1.2, -0.1]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[3.2, 0.1, 0.06]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>
    </group>
  );
}

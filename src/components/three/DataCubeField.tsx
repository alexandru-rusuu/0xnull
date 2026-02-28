import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Edges } from "@react-three/drei";
import type { Mesh, Group } from "three";
import * as THREE from "three";
import type { SpatialObject } from "@/core/engine/types";

interface DataCubeProps {
  data: SpatialObject;
  index: number;
}

const NEON_COLORS = ["#00f0ff", "#ff00aa", "#39ff14", "#ffbf00", "#bf5fff"];

const DataCube: React.FC<DataCubeProps> = ({ data, index }) => {
  const meshRef = useRef<Mesh>(null!);
  const groupRef = useRef<Group>(null!);

  const color = useMemo(
    () => NEON_COLORS[index % NEON_COLORS.length],
    [index],
  );

  const startPos = useMemo<[number, number, number]>(() => {
    const angle = (index / 8) * Math.PI * 2;
    const radius = 2.5 + Math.random() * 2;
    return [
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 3,
      Math.sin(angle) * radius - 2,
    ];
  }, [index]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    groupRef.current.position.y =
      startPos[1] + Math.sin(t * 0.5 + index * 0.7) * 0.15;

    groupRef.current.rotation.x = Math.sin(t * 0.3 + index) * 0.1;
    groupRef.current.rotation.y += 0.003;

    const pulse = 1 + Math.sin(t * 2 + index * 1.3) * 0.03;
    groupRef.current.scale.setScalar(pulse);
  });

  return (
    <group ref={groupRef} position={startPos}>
      {/* Main cube body */}
      <mesh ref={meshRef}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.08}
          roughness={0.2}
          metalness={0.8}
        />
        <Edges linewidth={1.5} threshold={15} color={color} />
      </mesh>

      {/* Label floating above */}
      <Text
        position={[0, 0.55, 0]}
        fontSize={0.12}
        color={color}
        anchorX="center"
        anchorY="bottom"
        font="/fonts/JetBrainsMono-Regular.woff2"
        outlineWidth={0.005}
        outlineColor="#000000"
      >
        {data.label}
      </Text>

      {/* Type indicator (small sphere) */}
      <mesh position={[0.4, 0.4, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={data.type === "dir" ? "#39ff14" : "#00f0ff"} />
      </mesh>

      {/* Glow point light */}
      <pointLight
        color={color}
        intensity={0.15}
        distance={2}
        decay={2}
      />
    </group>
  );
};

interface DataCubeFieldProps {
  cubes: SpatialObject[];
}

export const DataCubeField: React.FC<DataCubeFieldProps> = ({ cubes }) => {
  return (
    <group>
      {cubes.map((cube, i) => (
        <DataCube key={cube.id} data={cube} index={i} />
      ))}
    </group>
  );
};
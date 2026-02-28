import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { DataCubeField } from "./DataCubeField";
import { ParticleGrid } from "./ParticleGrid";
import { PostProcessing } from "./PostProcessing";
import { useTerminalStore } from "@/core/engine/store";

export const NullScene: React.FC = () => {
  const cubes = useTerminalStore((s) => s.spatialObjects);

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ background: "transparent" }}
    >
      {/* Ambient atmosphere */}
      <ambientLight intensity={0.15} color="#4a5568" />
      <pointLight position={[5, 5, 5]} intensity={0.4} color="#00f0ff" />
      <pointLight position={[-5, -3, 3]} intensity={0.2} color="#ff00aa" />

      <Suspense fallback={null}>
        {/* Floating particle grid — always visible */}
        <ParticleGrid count={800} />

        {/* Data cubes — spawn when commands run */}
        <DataCubeField cubes={cubes} />

        {/* Post-processing bloom/glow */}
        <PostProcessing />
      </Suspense>
    </Canvas>
  );
};

export default NullScene;
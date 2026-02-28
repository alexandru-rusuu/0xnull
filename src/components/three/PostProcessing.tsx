import React from "react";

export const PostProcessing: React.FC = () => {
  return <fog attach="fog" args={["#0a0a0f", 8, 25]} />;
};
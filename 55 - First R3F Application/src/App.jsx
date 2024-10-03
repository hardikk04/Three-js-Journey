import React from "react";
import { Canvas } from "@react-three/fiber";
import Experiences from "./Components/Experiences.jsx";
import { toneMapping } from "three/webgpu";

const App = () => {
  return (
    <div className="w-full h-screen fixed top-0 left-0">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true }}
        camera={{ fov: 75, near: 0.1, far: 200, position: [1, 2, 3] }}
      >
        <Experiences></Experiences>
      </Canvas>
    </div>
  );
};

export default App;

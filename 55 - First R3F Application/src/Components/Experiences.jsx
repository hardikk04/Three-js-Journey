import { extend, useFrame, useThree } from "@react-three/fiber";
import React, { useRef } from "react";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

const Experiences = () => {
  extend({ OrbitControls });

  const { camera, gl } = useThree();

  const cubeRef = useRef();

  useFrame((state, delta) => {
    cubeRef.current.rotation.y -= delta;
  });

  return (
    <>
      <directionalLight position={[1, 2, 3]} intensity={2.5}></directionalLight>
      <orbitControls args={[camera, gl.domElement]}></orbitControls>
      <mesh position-x={-2}>
        <sphereGeometry></sphereGeometry>
        <meshStandardMaterial wireframe color="orange"></meshStandardMaterial>
      </mesh>
      <mesh ref={cubeRef} position-x={2}>
        <boxGeometry />
        <meshStandardMaterial color="purple" />
      </mesh>
      <mesh
        rotation-x={-(Math.PI / 2 - 0.2)}
        position-y={-1}
        scale={[10, 10, 10]}
      >
        <planeGeometry />
        <meshStandardMaterial side={THREE.DoubleSide} color="greenyellow" />
      </mesh>
    </>
  );
};

export default Experiences;

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Scene
const scene = new THREE.Scene();

// Texture Loader
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/2.png");

// Particle
const particleGeometry = new THREE.BufferGeometry();
const count = 20000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < positions.length; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}
particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const particleMaterial = new THREE.PointsMaterial();
particleMaterial.size = 0.07;
particleMaterial.sizeAttenuation = true;
// particleMaterial.color = new THREE.Color("#ff88cc");
particleMaterial.transparent = true;
particleMaterial.alphaMap = particleTexture;
particleMaterial.vertexColors = true;

// particleMaterial.alphaTest = 0.001;

// particleMaterial.depthTest = false;
particleMaterial.depthWrite = false;

particleMaterial.blending = THREE.AdditiveBlending;

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;

// Canvas
const canvas = document.querySelector(".webgl");

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Orbit Control
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Clock
const clock = new THREE.Clock();

// Tick function
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  //   particles.rotation.x = elapsedTime * 0.02;

  // Animate each particles
  for (let i = 0; i < positions.length; i++) {
    const i3 = i * 3;

    const x = particleGeometry.attributes.position.array[i3];
    particleGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + x
    );
  }

  particleGeometry.attributes.position.needsUpdate = true;
  requestAnimationFrame(tick);
  controls.update();
  renderer.render(scene, camera);
};
tick();

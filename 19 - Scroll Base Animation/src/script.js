import * as THREE from "three";
import GUI from "lil-gui";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Scene
const scene = new THREE.Scene();

// Camera Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Meshes Group
const meshesGroup = new THREE.Group();
scene.add(meshesGroup);

// Debug GUI
const gui = new GUI({ width: 400 });
gui.close();

// Texture Loader
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("textures/gradients/3.jpg");
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.colorSpace = THREE.SRGBColorSpace;

// Parameters
const parameters = {};
parameters.materialColor = "#ffeded";
parameters.particleCount = 500;
parameters.particleSize = 0.02;

// Object Distance
const objectDistance = 4.5;

// Material
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
});

// Meshes
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);

// Meshes postion Y
mesh1.position.y = -objectDistance * 0;
mesh2.position.y = -objectDistance * 1;
mesh3.position.y = -objectDistance * 2;

// Meshes postion X
mesh1.position.x = 2.5;
mesh2.position.x = -2.5;
mesh3.position.x = 2.5;

meshesGroup.add(mesh1, mesh2, mesh3);

// Array of all objects
const sectionMeshes = [mesh1, mesh2, mesh3];

// Particles
let geometry = null;
let particleMaterial = null;
let points = null;

const generateParticles = () => {
  if (points !== null) {
    geometry.dispose();
    particleMaterial.dispose();
    scene.remove(points);
  }

  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameters.particleCount * 3);

  for (let i = 0; i < parameters.particleCount; i++) {
    const i3 = i * 3;
    positions[i3 + 0] = (Math.random() - 0.5) * 20;
    positions[i3 + 1] =
      objectDistance * 0.6 -
      Math.random() * objectDistance * sectionMeshes.length;
    positions[i3 + 2] = (Math.random() - 0.5) * 20;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  particleMaterial = new THREE.PointsMaterial({
    size: parameters.particleSize,
    sizeAttenuation: true,
    color: parameters.materialColor,
  });
  points = new THREE.Points(geometry, particleMaterial);
  scene.add(points);
};
generateParticles();

// Debug GUI
gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
  particleMaterial.color.set(parameters.materialColor);
});

gui
  .add(parameters, "particleCount")
  .min(100)
  .max(10000)
  .step(1)
  .onFinishChange(generateParticles);

gui
  .add(parameters, "particleSize")
  .min(0.02)
  .max(0.2)
  .step(0.01)
  .onFinishChange(generateParticles);

// Direction Light
const directionLight = new THREE.DirectionalLight("#ffffff", 3);
directionLight.position.set(1, 1, 0);
scene.add(directionLight);

// Scroll Direction
let scrollY = window.scrollY;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

// Mousemove (Cursor)
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (dets) => {
  cursor.x = dets.clientX / window.innerWidth;
  cursor.y = dets.clientY / window.innerHeight;
  gsap.to(camera.position, {
    x: -cursor.x * 0.5,
    y: cursor.y * 0.5,
    duration: 0.1,
    ease: "power3.inOut",
  });
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
);
cameraGroup.add(camera);
camera.position.z = 3;

// Resize window
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Canvas
const canvas = document.querySelector(".webgl");

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// // Gsap

// gsap.from(mesh1.rotation, {
//   x: "+=6",
//   y: "+=3",
//   duration: 1,
//   ease: "power3.inOut",
// });

// gsap.from(mesh2.rotation, {
//   x: "+=6",
//   y: "+=3",
//   duration: 1,
//   ease: "power3.inOut",
//   scrollTrigger: {
//     scroller: "body",
//     trigger: ".page2",
//     start: "top 25%",
//     // markers: true,
//   },
// });

// gsap.from(mesh3.rotation, {
//   x: "+=6",
//   y: "+=3",
//   duration: 1,
//   ease: "power3.inOut",
//   scrollTrigger: {
//     scroller: "body",
//     trigger: ".page3",
//     start: "top 25%",
//     // markers: true,
//   },
// });

// Clock
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animating all objects
  sectionMeshes.forEach((mesh) => {
    mesh.rotation.x = elapsedTime * 0.1;
    mesh.rotation.y = elapsedTime * 0.15;
  });

  cameraGroup.position.y = (-scrollY / window.innerHeight) * objectDistance;

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

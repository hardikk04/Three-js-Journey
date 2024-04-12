import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import vertexShader from "./Shaders/test/vertex.glsl";
import fragmentShader from "./Shaders/test/fragment.glsl";

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * GUI
 */
const gui = new GUI();

/**
 * Plane
 */
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent:true
});
const mesh = new THREE.Mesh(geometry, material);
// mesh.rotation.y = 2;
scene.add(mesh);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

/**
 * Resize
 */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth / window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Canvas
 */
const canvas = document.querySelector(".webgl");

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Clock
 */
const clock = new THREE.Clock();

/**
 * Animate
 */
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();
  requestAnimationFrame(tick);
  renderer.render(scene, camera);
};
tick();

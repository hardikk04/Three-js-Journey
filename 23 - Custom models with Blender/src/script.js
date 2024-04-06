import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * DRACO Loader
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

/**
 * GLTFLoader
 */
let model = null;
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load("/models/hamburger/hamburger.glb", (gltf) => {
  model = gltf.scene;
  model.scale.set(0.25, 0.25, 0.25);
  scene.add(model);
});

/**
 * Plane
 */

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    roughness: 0.4,
    metalness: 0.3,
  })
);
plane.rotation.x = -Math.PI * 0.5;
scene.add(plane);

/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.z = 3;
camera.position.y = 2;
camera.position.x = 1;
scene.add(camera);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#ffffff", 1);
scene.add(ambientLight);

// Directional light
const directionLight = new THREE.DirectionalLight("#ffffff", 1.6);
scene.add(directionLight);

/**
 * Canvas
 */
const canvas = document.querySelector(".webgl");

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Tick Function
 */
const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * GLTF Loader
 */

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// ------------------------DUCK-------------------------------
// GLTF Format

// gltfLoader.load("/models/Duck/glTF/Duck.gltf", (gltf) => {
//   scene.add(gltf.scene);
// });

// GLTF Binary Format
// gltfLoader.load("/models/Duck/glTF-Binary/Duck.glb", (gltf) => {
//   scene.add(gltf.scene);
// });

// GLTF DRACO Format

// gltfLoader.load("/models/Duck/glTF-Draco/Duck.gltf", (gltf) => {
//   scene.add(gltf.scene);
// });

// GLTF Embedded Format
// gltfLoader.load("models/Duck/glTF-Embedded/Duck.gltf", (gltf) => {
//   scene.add(gltf.scene);
// });

// ------------------------FlightHelmet-------------------------------
// gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
//   scene.add(gltf.scene);
// });

// ------------------------Fox-------------------------------
let mixer = null;
gltfLoader.load("/models/Fox/glTF/Fox.gltf", (gltf) => {
  gltf.scene.scale.set(0.015, 0.015, 0.015);
  scene.add(gltf.scene);

  mixer = new THREE.AnimationMixer(gltf.scene);
  const action = mixer.clipAction(gltf.animations[2]);
  action.play();
});

/**
 * Plane
 */
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial()
);
plane.material.color = new THREE.Color("#777777");
plane.material.roughness = 0.4;
plane.material.metalness = 0.3;
plane.rotation.x = -Math.PI * 0.5;

scene.add(plane);

/**
 * Light
 */

// Ambient light
const ambientLight = new THREE.AmbientLight("#ffffff", 2.6);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
scene.add(directionalLight);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
);
camera.position.z = 3;
camera.position.y = 1;
camera.position.x = 1;
scene.add(camera);

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
 * Tick Function
 */

let oldtime = 0;
const tick = () => {
  controls.update();

  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldtime;
  oldtime = elapsedTime;

  // Update mixer
  if (mixer !== null) {
    mixer.update(deltaTime);
  }
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * GUI
 */
const gui = new GUI();

/**
 * Loaders
 */
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

/**
 * Environment Map
 */
const environmentMap = rgbeLoader.load("environmentMaps/0/2k.hdr", () => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = environmentMap;
  scene.environment = environmentMap;
});

scene.environmentIntensity = 1;

gui.add(scene, "environmentIntensity", 0, 10, 0.01);

/**
 * model
 */
//Flight helmet
// gltfLoader.load("models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
//   gltf.scene.scale.set(10, 10, 10);
//   scene.add(gltf.scene);
//   updateAllMaterials();
// });

// Hamburger
gltfLoader.load("models/hamburger.glb", (gltf) => {
  gltf.scene.position.y = 2.5;
  gltf.scene.scale.set(0.4, 0.4, 0.4);
  scene.add(gltf.scene);

  updateAllMaterials();
});

/**
 * Floor
 */
const floorColorTexture = textureLoader.load(
  "textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg"
);

const floorNormalTexture = textureLoader.load(
  "textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png"
);

const floorAORoughnessMetalnessTexture = textureLoader.load(
  "textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg"
);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 8),
  new THREE.MeshStandardMaterial({
    normalMap: floorNormalTexture,
    aoMap: floorAORoughnessMetalnessTexture,
    metalnessMap: floorAORoughnessMetalnessTexture,
    roughnessMap: floorAORoughnessMetalnessTexture,
    map: floorColorTexture,
  })
);
floor.rotation.x = -Math.PI * 0.5;
floorColorTexture.colorSpace = THREE.SRGBColorSpace;
scene.add(floor);

/**
 * Wall
 */
const wallColorTexture = textureLoader.load(
  "textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg"
);
const wallNormalTexture = textureLoader.load(
  "textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png"
);
const wallAORoughnessMetalnessTexture = textureLoader.load(
  "textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg"
);

const wall = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 8),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    normalMap: wallNormalTexture,
    aoMap: wallAORoughnessMetalnessTexture,
    roughnessMap: wallAORoughnessMetalnessTexture,
    metalnessMap: wallAORoughnessMetalnessTexture,
  })
);
wall.position.y = 4;
wall.position.z = -4;
wallColorTexture.colorSpace = THREE.SRGBColorSpace;
scene.add(wall);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(4, 5, 4);
scene.add(camera);

/**
 * Light
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 6);
directionalLight.position.set(-4, 6.5, 2.5);
scene.add(directionalLight);
directionalLight.castShadow = true;
directionalLight.target.position.set(0, 4, 0);
directionalLight.target.updateMatrixWorld();
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(512, 512);
gui.add(directionalLight, "castShadow");

// Light Helper
// const directionalLightCameraHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(directionalLightCameraHelper);

gui.add(directionalLight, "intensity", 0, 10, 0.01).name("Light Intensity");
gui.add(directionalLight.position, "x", -10, 10, 0.01).name("LightX");
gui.add(directionalLight.position, "y", -10, 10, 0.01).name("LightY");
gui.add(directionalLight.position, "z", -10, 10, 0.01).name("LightZ");

directionalLight.shadow.normalBias = 0.04;
directionalLight.shadow.bias = 0.0004;

gui.add(directionalLight.shadow, "bias").min(-0.05).max(0.05).step(0.001);
gui.add(directionalLight.shadow, "normalBias").min(-0.05).max(0.05).step(0.001);

/**
 * Canvas
 */
const canvas = document.querySelector(".webgl");

/**
 * Resize
 */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
  //  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Shadow
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Tone mapping
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1;

gui.add(renderer, "toneMappingExposure", 0, 10, 0.01);

gui.add(renderer, "toneMapping", {
  no: THREE.NoToneMapping,
  linear: THREE.LinearToneMapping,
  reinhard: THREE.ReinhardToneMapping,
  cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping,
});

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;

/**
 * Clock
 */
const clock = new THREE.Clock();

/**
 * Animation
 */
const tick = () => {
  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  controls.update();
  requestAnimationFrame(tick);
  renderer.render(scene, camera);
};
tick();

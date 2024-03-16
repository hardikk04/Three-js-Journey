import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Scene
const scene = new THREE.Scene();

const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
  console.log("Start...");
};
loadingManager.onProgress = () => {
  console.log("Progress...");
};

loadingManager.onLoad = () => {
  console.log("Load...");
};
loadingManager.onError = () => {
  console.log("Error...");
};

const textureLoader = new THREE.TextureLoader();
const colorTexture = textureLoader.load("./static/textures/door/color.jpg");
// colorTexture.repeat.x = 3;
// colorTexture.repeat.y =3;

// colorTexture.wrapS = THREE.RepeatWrapping.wrapS;
// colorTexture.wrapT = THREE.RepeatWrapping.wrapT;

const ambientOcclusionTexture = textureLoader.load(
  "./static/textures/door/ambientOcclusion.jpg"
);
const aplhaTexture = textureLoader.load("./static/textures/door/aplha.jpg");
const heightTexture = textureLoader.load("./static/textures/door/height.jpg");
const metalnessTexture = textureLoader.load(
  "./static/textures/door/metalness.jpg"
);
const roughnessTexture = textureLoader.load(
  "./static/textures/door/roughness.jpg"
);
const minecraftTexture = textureLoader.load("./static/textures/minecraft.png");
colorTexture.colorSpace = THREE.SRGBColorSpace;
minecraftTexture.magFilter = THREE.NearestFilter;

// Cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
);
scene.add(camera);
camera.position.z = 3;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".webgl"),
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Controls
const controls = new OrbitControls(camera, document.querySelector(".webgl"));
controls.enableDamping = true;

const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();

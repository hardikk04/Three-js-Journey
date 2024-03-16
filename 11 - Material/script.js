import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

// Debug GUI
const gui = new GUI();

// Scene
const scene = new THREE.Scene();

// Texture Loader
// ---------------------------DOOR TEXTURES-----------------------------------
const textureLoader = new THREE.TextureLoader();
const colorTexture = textureLoader.load("./static/textures/door/color.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "./static/textures/door/ambientOcclusion.jpg"
);
const alphaTexture = textureLoader.load("./static/textures/door/alpha.jpg");
const heightTexture = textureLoader.load("./static/textures/door/height.jpg");
const metalnessTexture = textureLoader.load(
  "./static/textures/door/metalness.jpg"
);
const roughnessTexture = textureLoader.load(
  "./static/textures/door/roughness.jpg"
);
const normalTexture = textureLoader.load("./static/textures/door/normal.jpg");

// ---------------------------MATCAP TEXTURES-----------------------------------
const matcapTexture = textureLoader.load("./static/textures/matcaps/1.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;
colorTexture.colorSpace = THREE.SRGBColorSpace;

// ---------------------------GRADIENTS TEXTURES-----------------------------------
const gradientTexutes = textureLoader.load("./static/textures/gradients/3.jpg");

// ---------------------------ENVIRONMENT MAP-----------------------------------
const rgbeLoader = new RGBELoader();
rgbeLoader.load("./static/textures/environmentMap/2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

// Mesh Basic Material
// const material = new THREE.MeshBasicMaterial();
// material.map = colorTexture;
// // material.color = new THREE.Color("#ff0000");
// // material.wireframe = true;
// material.transparent = true;
// // material.opacity = .5
// // material.alphaMap = alphaTexture;
// material.side = THREE.DoubleSide;

// Mesh Normal Material
// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true

// Mesh Matcap Material
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// Mesh Deepth material
// const material = new THREE.MeshDepthMaterial();

// Mesh Lambert Material
// const material = new THREE.MeshLambertMaterial();

// // Lights
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 3);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 1;
// scene.add(pointLight);

// Mesh Phong Material
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0x1188ff)

// Mesh Toon Material
// const material = new THREE.MeshToonMaterial();
// gradientTexutes.minFilter = THREE.NearestFilter;
// gradientTexutes.magFilter = THREE.NearestFilter;
// gradientTexutes.generateMipmaps = false;
// material.gradientMap = gradientTexutes;

// Mesh Standard Material
// const material = new THREE.MeshStandardMaterial();

/* Mesh Physical Material (The MeshPhysicalMaterial is the same as the MeshStandardMaterial but with the support of 
  additional effects such as clearcoat, sheen, iridescence, and transmission.)
*/
const material = new THREE.MeshPhysicalMaterial();

material.metalness = 0;
material.roughness = 0;
// material.map = colorTexture;
// material.aoMap = ambientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = heightTexture;
// material.displacementScale = 0.1;
// material.metalnessMap = metalnessTexture;
// material.roughnessMap = roughnessTexture;
// material.normalMap = normalTexture;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = alphaTexture;

// Clearcoat
material.clearcoat = 1;
material.clearcoatRoughness = 0;

// Sheen
material.sheen = 1;
material.sheenRoughness = 0.25;
material.sheenColor.set(1, 1, 1);

// Iridescence
material.iridescence = 1;
material.iridescenceIOR = 1;
material.iridescenceThicknessRange = [100, 800];

material.transmission = 1
material.ior = 1.5
material.thickness = 0.5

gui.add(material, 'transmission').min(0).max(1).step(0.0001)
gui.add(material, 'ior').min(1).max(10).step(0.0001)
gui.add(material, 'thickness').min(0).max(1).step(0.0001)

// Mesh
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
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

// Clock
const clock = new THREE.Clock();

// Tick
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  torus.rotation.y = elapsedTime * 0.1;
  torus.rotation.x = -0.2 * elapsedTime;
  sphere.rotation.y = elapsedTime * 0.1;
  sphere.rotation.x = -0.2 * elapsedTime;
  plane.rotation.y = elapsedTime * 0.1;
  plane.rotation.x = -0.2 * elapsedTime;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// Scene
const scene = new THREE.Scene();

// Texture Loader
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("./textures/matcaps/8.png");
texture.colorSpace = THREE.SRGBColorSpace;

// Material
const material = new THREE.MeshMatcapMaterial({ matcap: texture });
// material.wireframe = true;

// Font Loader
const fontLoader = new FontLoader();
fontLoader.load("fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Hardikk", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);
  textGeometry.center();
});

// Donut Geometry
const geometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

// Calculating time taken to create 300 donute (it gives starting time)
console.time("donut");

for (let i = 0; i < 300; i++) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = (Math.random() - 0.5) * 10;
  mesh.position.y = (Math.random() - 0.5) * 10;
  mesh.position.z = (Math.random() - 0.5) * 10;

  mesh.rotation.x = Math.random() * Math.PI;
  mesh.rotation.y = Math.random() * Math.PI;

  const scaleVal = Math.random();
  mesh.scale.set(scaleVal, scaleVal, scaleVal);

  scene.add(mesh);
}

// Calculating time taken to create 300 donute (it gives Ending time)
console.timeEnd("donut");

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
);
scene.add(camera);
camera.position.z = 4;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".webgl"),
});
renderer.setSize(window.innerWidth, window.innerHeight);

// OrbitControls
const controls = new OrbitControls(camera, document.querySelector(".webgl"));
controls.enableDamping = true;

const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

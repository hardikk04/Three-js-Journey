import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();

const geometry = new THREE.BufferGeometry();

const count = 50;
const positionArray = new Float32Array(count * 3 * 3);
for (let i = 0; i < positionArray.length; i++) {
  positionArray[i] = (Math.random() - 0.5) * 4;
}

const positionAttribute = new THREE.BufferAttribute(positionArray, 3);
geometry.setAttribute("position", positionAttribute);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0xff00ff,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
);
scene.add(camera);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".webgl"),
});
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, document.querySelector(".webgl"));
controls.enableDamping = true;

const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

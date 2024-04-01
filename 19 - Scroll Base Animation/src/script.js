import * as THREE from "three";
import GUI from "lil-gui";

// Scene
const scene = new THREE.Scene();

// Debug GUI
const gui = new GUI();

// Parameters
const parameters = {};
parameters.materialColor = "#ff0000";

// Cube
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: parameters.materialColor })
);
scene.add(cube);

// Debug GUI
gui.addColor(parameters, "materialColor").onChange(() => {
  cube.material.color.set(parameters.materialColor);
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
);
scene.add(camera);
camera.position.z = 3;

// Canvas
const canvas = document.querySelector(".webgl");

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const tick = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

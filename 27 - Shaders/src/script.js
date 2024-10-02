import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";
import testVertexShader from "./Shaders/test/vertex.glsl";
import testFragmentShader from "./Shaders/test/fragment.glsl";

/**
 * Gui
 */
const gui = new GUI();

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * TextureLoader
 */
const textureLoader = new THREE.TextureLoader();
const flag = textureLoader.load("/image-1.jpg");

/**
 * Plane
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
const count = geometry.attributes.position.count;
const random = new Float32Array(count);

for (let i = 0; i < count; i++) {
  random[i] = Math.random();
}

geometry.setAttribute("aRandom", new THREE.BufferAttribute(random, 1));

// Material
const material = new THREE.RawShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  uniforms: {
    ufrequency: { value: new THREE.Vector2(10, 5) },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("orange") },
    uTexture: { value: flag },
  },
});

const mesh = new THREE.Mesh(geometry, material);
mesh.scale.y = 2 / 3;
scene.add(mesh);

gui
  .add(material.uniforms.ufrequency.value, "x")
  .min(0)
  .max(20)
  .step(0.01)
  .name("frequencyX");

gui
  .add(material.uniforms.ufrequency.value, "y")
  .min(0)
  .max(20)
  .step(0.01)
  .name("frequencyY");

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

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
});

/**
 * Canvas
 */
const canvas = document.querySelector(".webgl");

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

/**
 * Animation
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  material.uniforms.uTime.value = elapsedTime;

  controls.update();
  requestAnimationFrame(tick);
  renderer.render(scene, camera);
};
tick();

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

const gui = new GUI();

const scene = new THREE.Scene();

// Mesh Standard Material
const material = new THREE.MeshStandardMaterial({ roughness: 0.4 });

// Lights
//-------------------------Ambient Light----------------------------------
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

gui
  .add(ambientLight, "intensity")
  .min(0)
  .max(3)
  .step(0.0001)
  .setValue(1)
  .name("AmbientLight Intensity");

//-------------------------Directional Light----------------------------------
const directionalLight = new THREE.DirectionalLight(0x00fffc, 1);
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight);

gui
  .add(directionalLight, "intensity")
  .min(0)
  .max(3)
  .step(0.0001)
  .setValue(1)
  .name("DirectionalLight Intensity");

//-------------------------Hemisphere Light----------------------------------
const hemispherLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1);
scene.add(hemispherLight);

//-------------------------Point Light----------------------------------
const pointLight = new THREE.PointLight(0xff9000, 1.5, 10, 2);
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);

//-------------------------RectArea Light----------------------------------
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1.5, 1.5);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

//-------------------------Spot Light----------------------------------
const spotLight = new THREE.SpotLight(
  0x78ff00,
  4.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
spotLight.position.set(0, 2, 3);
spotLight.target.position.x = -0.75;
scene.add(spotLight, spotLight.target);

// Ligth Helpers

//-------------------------Hemisphere Light Helper----------------------------------
const hemispherLightHelper = new THREE.HemisphereLightHelper(
  hemispherLight,
  0.2
);
scene.add(hemispherLightHelper);

//-------------------------Directional Light Helper----------------------------------
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(directionalLightHelper);

//-------------------------Point Light Helper----------------------------------
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

//-------------------------Spot Light Helper----------------------------------
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

// Sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
sphere.position.x = -1.5;

// Cube
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);

// Torus
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material
);
torus.position.x = 1.5;

// Plane
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.position.y = -0.7;
plane.rotation.x = -Math.PI / 2;

scene.add(sphere, cube, torus, plane);

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

const clock = new THREE.Clock();

const tick = () => {
  const elaspedTime = clock.getElapsedTime();
  sphere.rotation.y = elaspedTime * 0.3;
  cube.rotation.y = elaspedTime * 0.3;
  torus.rotation.y = elaspedTime * 0.3;

  sphere.rotation.x = elaspedTime * 0.2;
  cube.rotation.x = elaspedTime * 0.2;
  torus.rotation.x = elaspedTime * 0.2;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

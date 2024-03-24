import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Scene
const scene = new THREE.Scene();

// Texture loader
const textureLoader = new THREE.TextureLoader();
const simpleTexture = textureLoader.load("./textures/simpleShadow.jpg");

// shadow mesh
const shadowPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshStandardMaterial({
    color: 0x000000,
    alphaMap: simpleTexture,
    transparent: true,
  })
);

shadowPlane.position.y = -0.49;
shadowPlane.rotation.x = -Math.PI / 2;
scene.add(shadowPlane);

// Sphere
const geometry = new THREE.SphereGeometry(0.5, 64, 64);
const material = new THREE.MeshStandardMaterial({ roughness: 0.4 });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

sphere.castShadow = true;

// Plane
const plane = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), material);
plane.rotation.x = -(Math.PI * 0.5);
plane.position.y = -0.5;

scene.add(plane);

plane.receiveShadow = true;

// Lights
// --------------------Ambient Light --------------------
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// --------------------Directional Light --------------------
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
scene.add(directionalLight);
directionalLight.position.set(0, 2, 4);

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 3.5;
directionalLight.shadow.camera.far = 7;
directionalLight.shadow.camera.top = 2.5;
directionalLight.shadow.camera.right = 2.5;
directionalLight.shadow.camera.left = -2.5;
directionalLight.shadow.camera.bottom = -2.5;

// Radius does not work with PCFSoftShadowMap algorithm
directionalLight.shadow.radius = 5;

// Directional light helper
const directionalLightHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
directionalLightHelper.visible = false;
scene.add(directionalLightHelper);

// --------------------Spot Light --------------------
const spotLight = new THREE.SpotLight(
  0xffffff,
  2.6,
  10,
  Math.PI * 0.4,
  0.4,
  0.5
);

spotLight.castShadow = true;
spotLight.shadow.camera.width = 1024;
spotLight.shadow.camera.height = 1024;
spotLight.shadow.camera.near = 2;
spotLight.shadow.camera.far = 7;

spotLight.position.set(2, 2, 2);
scene.add(spotLight);
scene.add(spotLight.target);

// Spot light helper
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;
scene.add(spotLightCameraHelper);

// --------------------Point Light --------------------
const pointLight = new THREE.PointLight(0xffffff, 2.7);
scene.add(pointLight);
pointLight.position.set(-1, 2, 0);

pointLight.castShadow = true;
pointLight.shadow.camera.width = 1024;
pointLight.shadow.camera.height = 1024;
pointLight.shadow.camera.near = 0.8;
pointLight.shadow.camera.far = 4;

// Point light helper
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightCameraHelper.visible = false;
scene.add(pointLightCameraHelper);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;
camera.position.y = 2;
scene.add(camera);

// Canvas
const canvas = document.querySelector(".webgl");

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);

// renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Orbit Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Clock
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  controls.update();

  // update simple Shadow
  sphere.position.x = Math.sin(elapsedTime) * 1.5;
  sphere.position.z = Math.cos(elapsedTime) * 1.5;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

  shadowPlane.position.x = sphere.position.x;
  shadowPlane.position.z = sphere.position.z;
  shadowPlane.material.opacity = 1 - sphere.position.y;

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

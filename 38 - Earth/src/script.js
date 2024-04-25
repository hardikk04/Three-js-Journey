import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import earthVertexShader from "./shaders/earth/vertex.glsl";
import earthFragmentShader from "./shaders/earth/fragment.glsl";
import sunVertexShader from "./shaders/sun/vertex.glsl";
import sunFragmentShader from "./shaders/sun/fragment.glsl";
import atmosphereVertexShader from "./shaders/atmosphere/vertex.glsl";
import atmosphereFragmentShader from "./shaders/atmosphere/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Loaders
const textureLoader = new THREE.TextureLoader();

/**
 * Earth
 */
// Texture
const earthDayTexture = textureLoader.load("/earth/day.jpg");
earthDayTexture.colorSpace = THREE.SRGBColorSpace;
earthDayTexture.anisotropy = 8;

const earthNightTexture = textureLoader.load("/earth/night.jpg");
earthNightTexture.colorSpace = THREE.SRGBColorSpace;
earthNightTexture.anisotropy = 8;

const earthSpecularCloudTexture = textureLoader.load(
  "/earth/specularClouds.jpg"
);
earthSpecularCloudTexture.anisotropy = 8;

const starTexture = textureLoader.load("/particles/11.png");

/**
 * Point material
 */
const parameters = {};
parameters.count = 1000;
parameters.size = 0.25;

let starGeometry = null;
let starMaterial = null;
let startPoints = null;

const generateGalaxy = () => {
  // Disposing the old particle
  if (startPoints !== null) {
    starGeometry.dispose();
    starMaterial.dispose();
    scene.remove(startPoints);
  }

  // Geometry
  starGeometry = new THREE.BufferGeometry();

  // Position
  const position = new Float32Array(parameters.count * 3);

  for (let i = 0; i < parameters.count; i++) {
    // Position the particles
    const i3 = i * 3;

    position[i3 + 0] = (Math.random() - 0.5) * 20;
    position[i3 + 1] = (Math.random() - 0.5) * 20;
    position[i3 + 2] = (Math.random() - 0.5) * 20;
  }
  starGeometry.setAttribute("position", new THREE.BufferAttribute(position, 3));

  // Material
  starMaterial = new THREE.PointsMaterial();
  starMaterial.map = starTexture;
  starMaterial.size = parameters.size;
  starMaterial.sizeAttenuation = true;
  starMaterial.depthWrite = false;
  starMaterial.blending = THREE.AdditiveBlending;

  // Points
  startPoints = new THREE.Points(starGeometry, starMaterial);
  scene.add(startPoints);
};
generateGalaxy();

gui
  .add(parameters, "count")
  .min(1000)
  .max(50000)
  .step(100)
  .onFinishChange(generateGalaxy);

gui
  .add(parameters, "size")
  .min(0.001)
  .max(0.5)
  .step(0.001)
  .onFinishChange(generateGalaxy);

/**
 * Earth
 */

const earthParameters = {};
earthParameters.atmosphereDayColor = "#00aaff";
earthParameters.atmosphereTwilightColor = "#ff6600";

gui.addColor(earthParameters, "atmosphereDayColor").onChange(() => {
  earthMaterial.uniforms.uAtmosphereDayColor.value.set(
    earthParameters.atmosphereDayColor
  );
  atmosphereMaterial.uniforms.uAtmosphereDayColor.value.set(
    earthParameters.atmosphereDayColor
  );
});

gui.addColor(earthParameters, "atmosphereTwilightColor").onChange(() => {
  earthMaterial.uniforms.uAtmosphereDayColor.value.set(
    earthParameters.atmosphereTwilightColor
  );
  atmosphereMaterial.uniforms.uAtmosphereDayColor.value.set(
    earthParameters.atmosphereTwilightColor
  );
});

// Mesh
const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
const earthMaterial = new THREE.ShaderMaterial({
  vertexShader: earthVertexShader,
  fragmentShader: earthFragmentShader,
  uniforms: {
    uDayTexture: new THREE.Uniform(earthDayTexture),
    uNightTexture: new THREE.Uniform(earthNightTexture),
    uSpecularCloudTexture: new THREE.Uniform(earthSpecularCloudTexture),
    uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
    uCloudIntensity: new THREE.Uniform(0),
    uAtmosphereTwilightColor: new THREE.Uniform(
      new THREE.Color(earthParameters.atmosphereDayColor)
    ),
    uAtmosphereDayColor: new THREE.Uniform(
      new THREE.Color(earthParameters.atmosphereTwilightColor)
    ),
    uAtmosphereIntensity: new THREE.Uniform(0),
  },
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Atmosphere
const atmosphereMaterial = new THREE.ShaderMaterial({
  vertexShader: atmosphereVertexShader,
  fragmentShader: atmosphereFragmentShader,
  uniforms: {
    uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
    uAtmosphereDayColor: new THREE.Uniform(
      new THREE.Color(earthParameters.atmosphereDayColor)
    ),
    uAtmosphereTwilightColor: new THREE.Uniform(
      new THREE.Color(earthParameters.atmosphereTwilightColor)
    ),
  },
  side: THREE.BackSide,
  transparent: true,
});
const atmosphere = new THREE.Mesh(earthGeometry, atmosphereMaterial);
atmosphere.scale.set(1.05, 1.05, 1.05);
scene.add(atmosphere);

// Coordinates
const sunSpherical = new THREE.Spherical(1, Math.PI * 0.5, 0.5);
const sunDirection = new THREE.Vector3();

// Sun texture
const sunTexture = textureLoader.load("earth/2k_sun.jpg");
sunTexture.colorSpace = THREE.SRGBColorSpace;
sunTexture.anisotropy = 8;

// Debug
const debugSun = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.2, 2),
  new THREE.ShaderMaterial({
    vertexShader: sunVertexShader,
    fragmentShader: sunFragmentShader,
    uniforms: {
      uSunTexture: new THREE.Uniform(sunTexture),
    },
  })
);
scene.add(debugSun);

// Update
const updateSun = () => {
  // Sun direction
  sunDirection.setFromSpherical(sunSpherical);

  // Debug
  debugSun.position.copy(sunDirection).multiplyScalar(5);

  // Uniform
  earthMaterial.uniforms.uSunDirection.value.copy(sunDirection);
  atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection);
};
updateSun();

// Tweaks
gui.add(sunSpherical, "phi").min(0).max(Math.PI).onChange(updateSun);
gui.add(sunSpherical, "theta").min(-Math.PI).max(Math.PI).onChange(updateSun);
gui
  .add(earthMaterial.uniforms.uCloudIntensity, "value")
  .min(0)
  .max(1)
  .setValue(0.5);

gui
  .add(earthMaterial.uniforms.uAtmosphereIntensity, "value")
  .min(2)
  .max(20)
  .step(0.01)
  .setValue(2);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  25,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 12;
camera.position.y = 5;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);
renderer.setClearColor("#000011");

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animation of stars
  startPoints.rotation.y = elapsedTime * 0.01;
  startPoints.rotation.x = elapsedTime * 0.001;

  earth.rotation.y = elapsedTime * 0.1;
  debugSun.rotation.x = -elapsedTime * 0.1;
  debugSun.rotation.y = -elapsedTime * 0.2;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

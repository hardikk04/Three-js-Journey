import "./style.css";
import Experience from "/Experience/Experience.js";

const experience = new Experience(document.querySelector(".webgl"));

// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import GUI from "lil-gui";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// /**
//  * Loaders
//  */
// const textureLoader = new THREE.TextureLoader();
// const cubeTextureLoader = new THREE.CubeTextureLoader();
// const gltfLoader = new GLTFLoader();

// /**
//  * Base
//  */
// // Debug
// const gui = new GUI();
// const debugObject = {};

// // Canvas
// const canvas = document.querySelector(".webgl");

// // Scene
// const scene = new THREE.Scene();

// /**
//  * Update all materials
//  */
// const updateAllMaterials = () => {
//   scene.traverse((child) => {
//     if (child.isMesh && child.material.isMeshStandardMaterial) {
//       // child.material.envMap = environmentMap;
//       child.material.envMapIntensity = debugObject.envMapIntensity;
//       child.material.needsUpdate = true;
//       child.castShadow = true;
//       child.receiveShadow = true;
//     }
//   });
// };

// /**
//  * Environment map
//  */
// const environmentMap = cubeTextureLoader.load([
//   "/textures/environmentMap/px.jpg",
//   "/textures/environmentMap/nx.jpg",
//   "/textures/environmentMap/py.jpg",
//   "/textures/environmentMap/ny.jpg",
//   "/textures/environmentMap/pz.jpg",
//   "/textures/environmentMap/nz.jpg",
// ]);

// environmentMap.colorSpace = THREE.SRGBColorSpace;

// // scene.background = environmentMap;
// scene.environment = environmentMap;
// scene.backgroundIntensity = 0.4;
// debugObject.envMapIntensity = 0.4;
// gui
//   .add(debugObject, "envMapIntensity")
//   .min(0)
//   .max(4)
//   .step(0.001)
//   .onChange(updateAllMaterials);

// gui.add(scene, "backgroundIntensity").min(0).max(4).step(0.001);

// /**
//  * Models
//  */
// let model = null;
// let foxMixer = null;
// gltfLoader.load("models/Fox/glTF/Fox.gltf", (gltf) => {
//   // Model
//   model = gltf.scene;
//   model.scale.set(0.02, 0.02, 0.02);
//   scene.add(model);

//   // Animation
//   foxMixer = new THREE.AnimationMixer(model);
//   const foxAction = foxMixer.clipAction(gltf.animations[0]);
//   foxAction.play();

//   // update materials
//   updateAllMaterials();
// });

// /**
//  * Floor
//  */
// const floorColorTexture = textureLoader.load("/textures/dirt/color.jpg");
// floorColorTexture.colorSpace = THREE.SRGBColorSpace;
// floorColorTexture.repeat.set(1.5, 1.5);
// floorColorTexture.wrapS = THREE.RepeatWrapping;
// floorColorTexture.wrapT = THREE.RepeatWrapping;

// const floorNormalTexture = textureLoader.load("/textures/dirt/normal.jpg");
// floorNormalTexture.repeat.set(1.5, 1.5);
// floorNormalTexture.wrapS = THREE.RepeatWrapping;
// floorNormalTexture.wrapT = THREE.RepeatWrapping;

// const floor = new THREE.Mesh(
//   new THREE.CircleGeometry(5, 64),
//   new THREE.MeshStandardMaterial({
//     map: floorColorTexture,
//     normalMap: floorNormalTexture,
//   })
// );
// floor.rotation.x = -Math.PI * 0.5;
// floor.receiveShadow = true;
// scene.add(floor);

// /**
//  * Lights
//  */
// const directionalLight = new THREE.DirectionalLight("#ffffff", 4);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.far = 15;
// directionalLight.shadow.mapSize.set(1024, 1024);
// directionalLight.shadow.normalBias = 0.05;
// directionalLight.position.set(3.5, 2, -1.25);
// scene.add(directionalLight);

// // const directionalLightCameraHelper = new THREE.CameraHelper(
// //   directionalLight.shadow.camera
// // );
// // scene.add(directionalLightCameraHelper);

// gui.add(directionalLight, "intensity", 0, 10, 0.001).name("Light Intensity");
// gui.add(directionalLight.position, "x", -5, 5, 0.001).name("LightX");
// gui.add(directionalLight.position, "y", -5, 5, 0.001).name("LightY");
// gui.add(directionalLight.position, "z", -5, 5, 0.001).name("LightZ");

// /**
//  * Resize
//  */
// window.addEventListener("resize", () => {
//   //Update camera
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();

//   //Update renderer
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// });

// /**
//  * Camera
//  */
// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   100
// );
// camera.position.set(6, 4, 8);
// scene.add(camera);

// // Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// /**
//  * Renderer
//  */
// const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
// renderer.toneMapping = THREE.CineonToneMapping;
// renderer.toneMappingExposure = 1.75;
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.setClearColor("#211d20");
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// /**
//  * Animations
//  */
// const clock = new THREE.Clock();
// let previousTime = 0;

// const tick = () => {
//   const elapsedTime = clock.getElapsedTime();
//   const deltaTime = elapsedTime - previousTime;
//   previousTime = elapsedTime;

//   // Update controls
//   controls.update();

//   // Fox animation
//   if (foxMixer) {
//     foxMixer.update(deltaTime);
//   }

//   // Render
//   renderer.render(scene, camera);

//   // Call tick again on the next frame
//   requestAnimationFrame(tick);
// };
// tick();

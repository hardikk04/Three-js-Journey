import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * GLTFLoader
 */
let model = null;
const gltfLoader = new GLTFLoader();
gltfLoader.load("/Duck/glTF-Binary/Duck.glb", (gltf) => {
  model = gltf.scene;
  model.position.y = -0.7;
  scene.add(model);
});

/**
 * Sphere meshes
 */

const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
object1.position.x = -2;
const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
object1.updateMatrixWorld(0.5);
object2.updateMatrixWorld(2.5);
object3.updateMatrixWorld(4.5);
object3.position.x = 2;
scene.add(object1, object2, object3);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
);
camera.position.z = 3;
scene.add(camera);

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight("#ffffff", 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#ffffff", 1.6);
scene.add(directionalLight);

/**
 * Canvas
 */
const canvas = document.querySelector(".webgl");

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Mouse
 */
const mouse = new THREE.Vector2();

// Mousemove
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Click
window.addEventListener("click", () => {
  if (currentEvent) {
    console.log("clicked");
  }
});

/**
 * Clock
 */
const clock = new THREE.Clock();

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

/**
 * Tick
 */
let currentEvent = null;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animating spheres
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.2) * 1.5;

  // Raycaster
  raycaster.setFromCamera(mouse, camera);
  // const rayOrigin = new THREE.Vector3(-3, 0, 0);
  // const rayDirection = new THREE.Vector3(10, 0, 0);
  // rayDirection.normalize();
  // raycaster.set(rayOrigin, rayDirection);

  const objectsToTest = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectsToTest);

  objectsToTest.forEach((object) => {
    object.material.color.set("#ff0000");
  });

  intersects.forEach((intersect) => {
    intersect.object.material.color.set("#0000ff");
  });

  if (intersects.length) {
    if (!currentEvent) {
      console.log("mouse entered");
    }
    currentEvent = intersects[0];
  } else {
    if (currentEvent) {
      console.log("mouse leave");
    }
    currentEvent = null;
  }

  // Testing in import model
  if (model) {
    const intersect = raycaster.intersectObject(model);
    if (intersect.length) {
      gsap.to(model.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
      });
    } else {
      gsap.to(model.scale, {
        x: 1.0,
        y: 1.0,
        z: 1.0,
      });
    }
  }

  requestAnimationFrame(tick);
  controls.update();
  renderer.render(scene, camera);
};
tick();

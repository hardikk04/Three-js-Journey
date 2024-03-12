import * as THREE from "three";
import gsap from "gsap";

// Scene
const scene = new THREE.Scene();

// Cube
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff00ff })
);
scene.add(cube);

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
scene.add(camera);
camera.position.z = 3;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".webgl"),
});
renderer.setSize(sizes.width, sizes.height);

// Gsap
// gsap.to(cube.position, {
//   x: 2,
//   duration: 1,
// });

// Clock
const clock = new THREE.Clock();

// Tick
const tick = () => {
  const eplaspedTime = clock.getElapsedTime();

    cube.rotation.y = eplaspedTime * 0.5 * Math.PI * 2;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

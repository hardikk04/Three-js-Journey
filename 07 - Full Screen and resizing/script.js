import * as THREE from "three";

const scene = new THREE.Scene();

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff00ff })
);
scene.add(cube);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
scene.add(camera);
camera.position.z = 3;

window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    document.querySelector(".webgl").requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".webgl"),
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

const tick = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

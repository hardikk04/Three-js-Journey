import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import gsap from "gsap";

const gui = new GUI({ width: 500 });
const cubeGuiDirection = gui.addFolder("Cube Direction");

window.addEventListener("keypress", (e) => {
  if ("h" === e.key) {
    gui.show(gui._hidden);
  }
});

const obj = {
  cubeColor: "#00fff0",
  division: 2,
  spin: () => {
    gsap.to(mesh.rotation, {
      y: Math.PI * 2,
      duration: 4,
    });
  },
};

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({
  color: obj.cubeColor,
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

// GUI
cubeGuiDirection.add(mesh.position, "y").min(-3).max(3).setValue(0);
cubeGuiDirection.add(mesh.position, "x").min(-3).max(3).setValue(0);

cubeGuiDirection.add(material, "visible");
cubeGuiDirection.add(material, "wireframe");

gui.addColor(obj, "cubeColor").onChange(() => {
  material.color.set(obj.cubeColor);
});

gui
  .add(obj, "division")
  .min(1)
  .max(10)
  .onFinishChange(() => {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      obj.division,
      obj.division,
      obj.division
    );
  });

gui.add(obj, "spin");

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

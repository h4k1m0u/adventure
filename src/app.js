// import libraries & scss
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import Stats from 'stats.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './scss/style.scss';

// 3d model path
import pathModelDuck from 'assets/models/duck.glb';

// 6-sided background texture images
import pathSkyboxRight from 'assets/images/skybox/miramar_rt.jpg';
import pathSkyboxLeft from 'assets/images/skybox/miramar_lf.jpg';
import pathSkyboxTop from 'assets/images/skybox/miramar_up.jpg';
import pathSkyboxBottom from 'assets/images/skybox/miramar_dn.jpg';
import pathSkyboxFront from 'assets/images/skybox/miramar_ft.jpg';
import pathSkyboxBack from 'assets/images/skybox/miramar_bk.jpg';

/*
* GUI & stats panels
* https://davidwalsh.name/dat-gui
*/
// add parameters fields to panel
const gui = new dat.GUI();
const params = {
  x: 0,
  y: 0,
  z: 0,
  visible: true,
  color: 0x00aaff,
};
gui.add(params, 'x', -100, 100, 0.1);
gui.add(params, 'y', -100, 100, 0.1);
gui.add(params, 'z', -100, 100, 0.1);
gui.add(params, 'visible');
gui.addColor(params, 'color');

// show fps on performance monitor panel
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// main program
let scene;
let camera;
let renderer;
let cube;
let controls;
const start = Date.now();

/**
 * Create scene, camera, renderer, and add objects to scene.
 */
function init() {
  /*
  * Scene
  */
  // setup scene
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,
    0.1, 1000);
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // scene navigation with pan/zoom/rotate
  controls = new OrbitControls(camera, renderer.domElement);
  camera.position.z = 5;
  controls.update();

  // lightbulb
  const light = new THREE.PointLight();
  light.position.set(-5, 5, 0);
  scene.add(light);

  /*
  * Objects
  */
  // add axes & grid to scene
  scene.add(new THREE.AxesHelper(5));
  scene.add(new THREE.GridHelper(20, 20));

  // add cube to scene
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshLambertMaterial({ color: 0x00aaff });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // skybox-like scene background texture
  const texture = new THREE.CubeTextureLoader().load([
    pathSkyboxFront,
    pathSkyboxBack,
    pathSkyboxTop,
    pathSkyboxBottom,
    pathSkyboxRight,
    pathSkyboxLeft,
  ]);
  scene.background = texture;

  // mouse click listener on menu items
  document.getElementById('turn-right').addEventListener('click', () => {
    cube.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(-10.0));
  }, false);
  document.getElementById('turn-left').addEventListener('click', () => {
    cube.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(10.0));
  }, false);

  // add 3d model to scene
  const loader = new GLTFLoader();
  loader.load(pathModelDuck, (gltf) => {
    scene.add(gltf.scene);
  });
}

/**
 * Animation loop based on requestAnimationFrame.
 */
function animate() {
  stats.begin();

  // update box according to panels values
  cube.visible = params.visible;
  cube.position.set(params.x, params.y, params.z);
  cube.material.color.set(params.color);

  // update orbit controls in each frame
  controls.update();

  // rotate cube in each frame (for 10s)
  if (Date.now() - start < 10000) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }

  renderer.render(scene, camera);

  stats.end();

  // called before next screen repaint
  window.requestAnimationFrame(animate);
}

init();
animate();

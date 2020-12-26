// import libraries & scss
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import Stats from 'stats.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Animation from 'modules/animation';
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
  visible_cube: true,
  visible_duck: true,
  color: 0xffffff,
};
gui.add(params, 'visible_cube');
gui.add(params, 'visible_duck');
gui.addColor(params, 'color');

// show fps on performance monitor panel
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// main program
let scene;
let camera;
let renderer;
let controls;
let clock = new THREE.Clock();

// 3D objects
let cube;
let animationCube;
let duck;

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
  const light = new THREE.AmbientLight(0xbbbbbb);
  scene.add(light);

  /*
  * Objects
  */
  // add axes & grid to scene
  scene.add(new THREE.AxesHelper(5));
  scene.add(new THREE.GridHelper(20, 20));

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

  // add cube to scene
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: params.color, envMap: scene.background });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // animate cube movement
  animationCube = new Animation(cube);

  // mouse click listener on menu items
  document.getElementById('play-animation').addEventListener('click', () => {
    animationCube.play();
  }, false);
  document.getElementById('stop-animation').addEventListener('click', () => {
    animationCube.stop();
  }, false);

  // add 3d model to scene
  const loader = new GLTFLoader();
  loader.load(pathModelDuck, (gltf) => {
    duck = gltf.scene;
    scene.add(gltf.scene);
  });
}

/**
 * Main loop based on requestAnimationFrame.
 */
function tick() {
  stats.begin();

  // animate cube
  const delta = clock.getDelta();
  animationCube.update(delta);

  // update box according to panels values
  if (duck) {
    duck.visible = params.visible_duck;
  }
  cube.visible = params.visible_cube;
  cube.material.color.set(params.color);

  // update orbit controls in each frame
  controls.update();

  renderer.render(scene, camera);

  stats.end();

  // called before next screen repaint
  window.requestAnimationFrame(tick);
}

init();
tick();

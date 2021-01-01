// import libraries
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import Stats from 'stats.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// modules & scss
import './scss/style.scss';
import Animation from 'modules/animation';
import { Shader, printGLVersion } from 'modules/shader';

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
const clock = new THREE.Clock();

// 3D objects
let cubeMoving;
let animationCube;
let cubeShader;
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
  scene.add(new THREE.AxesHelper(10));
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

  // add movable cube to scene
  const geometryBasic = new THREE.BoxGeometry(1, 1, 1);
  const materialBasic = new THREE.MeshBasicMaterial({
    color: params.color,
    envMap: scene.background,
  });
  cubeMoving = new THREE.Mesh(geometryBasic, materialBasic);
  scene.add(cubeMoving);

  // animate cube movement
  animationCube = new Animation(cubeMoving);

  // add cube textured with shader to scene
  printGLVersion();
  const geometryShader = new THREE.BoxGeometry(1, 1, 1);
  const materialShader = new THREE.ShaderMaterial({
    uniforms: Shader.uniforms,
    vertexShader: Shader.vertexShader,
    fragmentShader: Shader.fragmentShader,
  });
  cubeShader = new THREE.Mesh(geometryShader, materialShader);
  cubeShader.translateX(2);
  scene.add(cubeShader);

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
  cubeMoving.visible = params.visible_cube;
  cubeMoving.material.color.set(params.color);

  // update orbit controls in each frame
  controls.update();

  renderer.render(scene, camera);

  stats.end();

  // called before next screen repaint
  window.requestAnimationFrame(tick);
}

init();
tick();

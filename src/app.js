// import libraries
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import Stats from 'stats.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// images & 3d model paths
import pathImageLeft from 'assets/images/left.png';
import pathImageRight from 'assets/images/right.png';
import pathModelDuck from 'assets/models/duck.glb';
import skybox from './modules/meshes';

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
  scene.background = new THREE.Color(0xdddddd);
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

  // arrow sprites
  const textureSpriteLeft = new THREE.TextureLoader().load(pathImageLeft);
  const materialSpriteLeft = new THREE.SpriteMaterial({ map: textureSpriteLeft });
  const spriteLeft = new THREE.Sprite(materialSpriteLeft);
  spriteLeft.position.set(-1, 1, 0);

  const textureSpriteRight = new THREE.TextureLoader().load(pathImageRight);
  const materialSpriteRight = new THREE.SpriteMaterial({ map: textureSpriteRight });
  const spriteRight = new THREE.Sprite(materialSpriteRight);
  spriteRight.position.set(1, 1, 0);

  const sprites = new THREE.Group();
  sprites.add(spriteLeft);
  sprites.add(spriteRight);
  scene.add(sprites);

  // skybox cube with textures
  const sb = skybox();
  scene.add(sb);

  // raycast & mouse click listener
  const raycaster = new THREE.Raycaster();
  renderer.domElement.addEventListener('click', (event) => {
    // change origin to center of canvas, orient y_axis to top, normalize coordinates in [-1, 1]
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // rotate cube on click on sprites
    raycaster.setFromCamera(mouse, camera);
    const intersect = raycaster.intersectObject(sprites, true);

    if (intersect.length > 0) {
      const spriteClicked = intersect[0].object;

      if (spriteClicked.id === spriteLeft.id) {
        cube.rotation.z += 0.2;
      } else if (spriteClicked.id === spriteRight.id) {
        cube.rotation.z -= 0.2;
      }
    }
  }, false);

  // load 3d model
  const loader = new GLTFLoader();
  loader.load(pathModelDuck,
    (gltf) => {
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

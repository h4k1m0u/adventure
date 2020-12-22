import * as THREE from 'three';

// import texture images
import pathImage1 from 'assets/images/arid2_ft.jpg';
import pathImage2 from 'assets/images/arid2_bk.jpg';
import pathImage3 from 'assets/images/arid2_up.jpg';
import pathImage4 from 'assets/images/arid2_dn.jpg';
import pathImage5 from 'assets/images/arid2_rt.jpg';
import pathImage6 from 'assets/images/arid2_lf.jpg';

function skybox() {
  // tutorial: https://redstapler.co/create-3d-world-with-three-js-and-skybox-technique/
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    pathImage1,
    pathImage2,
    pathImage3,
    pathImage4,
    pathImage5,
    pathImage6,
  ]);

  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff, envMap: texture, side: THREE.BackSide,
  });
  const geometry = new THREE.BoxGeometry(100, 100, 100);
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

export default skybox;

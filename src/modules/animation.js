import * as THREE from 'three';

/**
 * Manage manually-created animation keyframes
 * https://discoverthreejs.com/book/first-steps/animation-system/
 */
class Animation {
  constructor(mesh) {
    // move mesh back and forth once
    this.track = new THREE.VectorKeyframeTrack('.position', [0, 1, 2, 3], [
      0, 0, 0,
      1, 1, 1,
      2, 2, 2,
      0, 0, 0,
    ]);
    this.clip = new THREE.AnimationClip('position', -1, [this.track]);
    this.mixer = new THREE.AnimationMixer(mesh);
    this.action = this.mixer.clipAction(this.clip);
    this.action.loop = THREE.LoopOnce;
  }

  play() {
    this.action.play();
  }

  stop() {
    this.action.stop();
  }

  update(delta) {
    this.mixer.update(delta);
  }
}

export default Animation;

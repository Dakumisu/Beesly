import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' // https://threejs.org/docs/#examples/en/controls/OrbitControls

import World from '@src/js/World'

class Control {
   constructor(opt) {
      this.controls = new OrbitControls(World.camera, World.renderer.domElement)
      this.controls.enableDamping = true
   }

   update() {
      this.controls.update()
   }
}

const out = new Control()
export default out
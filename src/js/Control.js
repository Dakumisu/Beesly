import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' // https://threejs.org/docs/#examples/en/controls/OrbitControls

import Scene from '@js/Scene'

class Control {
   constructor(opt) {
      this.camera = Scene.camera
      this.renderer = Scene.renderer

      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enableDamping = true
   }
}

const out = new Control()
export default out
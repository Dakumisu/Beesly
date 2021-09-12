import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' // https://threejs.org/docs/#examples/en/controls/OrbitControls

class Control {
   constructor(opt) {
      this.camera = opt.camera
      this.renderer = opt.renderer

      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enableDamping = true
   }
}

export default Control
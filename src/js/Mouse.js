import * as THREE from 'three'

import Scene from '@js/Scene'

class Mouse {
   constructor(opt) {
      this.scene = Scene

      this.init()
      this.mouseMove()
   }

   init() {
      // Position de la souris dans le DOM
      this.mouseDom = new THREE.Vector2()

      // Position de la souris à utiliser dans fragment shader si besoin (x: [0, 1], y:[0, 1])
      this.mouseFrag = new THREE.Vector3()

      // Position de la souris dans la scène (x: [-1, 1], y:[-1, 1])
      this.mouseScene = new THREE.Vector3()
      
      // Position de la souris dans la scène par rapport à la taille du DOM et de la caméra (x: [?, ?], y:[?, ?])
      // ❗ Expérimental
      this.mouseMap = new THREE.Vector3()
   }

   mouseMove() {
      document.addEventListener('mousemove', e => {
         this.mouseDom.x = e.clientX
         this.mouseDom.y = e.clientY
         
         this.mouseFrag.x = (this.mouseDom.x / window.innerWidth)
         this.mouseFrag.y = (this.mouseDom.y / window.innerHeight)

         this.mouseScene.x = (this.mouseDom.x / window.innerWidth) * 2 - 1
         this.mouseScene.y = - (this.mouseDom.y / window.innerHeight) * 2 + 1
         
         this.mouseMap.x = this.cursorMap(this.mouseScene.x, -1, 1, -this.viewSize().width / 2, this.viewSize().width / 2)
         this.mouseMap.y = this.cursorMap(this.mouseScene.y, -1, 1, -this.viewSize().height / 2, this.viewSize().height / 2)
      })
   }

   cursorMap (mousePos, in_min, in_max, out_min, out_max) {
      return ((mousePos - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
   }

   viewSize() {
      let cameraZ = this.scene.camera.position.z
      let distance = cameraZ - 0
      let aspect = this.scene.camera.aspect

      let vFov = this.scene.camera.fov * Math.PI / 180
      let height = 2 * Math.tan(vFov / 2) * distance
      let width = height * aspect

      return { width, height, vFov }
   }
}

const out = new Mouse()
export default out
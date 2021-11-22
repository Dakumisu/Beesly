import * as THREE from 'three'

import Scene from '@js/Scene'

class Raycaster {
   constructor(opt) {
      this.helpers = false

      if (this.helpers) {
         this.pos = opt.pos // Vector2 -> position du raycatser (ex: pos: { x: -1, y: 2 })
         this.dir = opt.dir // Vector2 -> direction du raycatser (ex: dir: { x: 2, y: -4 })
         this.index = opt.index
         this.helper()
         this.initHelper()
      }

      this.scene = Scene.scene
   }
   
   initHelper() {
      this.raycaster = new THREE.Raycaster()
      this.rayOrigin = new THREE.Vector3(this.pos.x, this.pos.y, 0)
      this.rayDirection = new THREE.Vector3(this.dir.x, this.dir.y, 0)
      this.rayDirection.normalize()

      this.raycaster.params.Points.threshold = .04 // taille du rayon
   
      this.raycaster.set(this.rayOrigin, this.rayDirection)
   }

   helper() {
      this.length = 10
      this.hex = 0xffffff

      this.arrowHelper = new THREE.ArrowHelper(this.rayDirection, this.rayOrigin, this.length, this.hex)
      this.scene.add(this.arrowHelper)
   }
}

const out = new Raycaster()
export default out
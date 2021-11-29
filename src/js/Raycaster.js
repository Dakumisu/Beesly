import { ArrowHelper, Vector3 } from 'three'

import World from '@src/js/World'

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
   }
   
   initHelper() {
      this.raycaster = new Raycaster()
      this.rayOrigin = new Vector3(this.pos.x, this.pos.y, 0)
      this.rayDirection = new Vector3(this.dir.x, this.dir.y, 0)
      this.rayDirection.normalize()

      this.raycaster.params.Points.threshold = .04 // taille du rayon
   
      this.raycaster.set(this.rayOrigin, this.rayDirection)
   }

   helper() {
      this.length = 10
      this.hex = 0xffffff

      this.arrowHelper = new ArrowHelper(this.rayDirection, this.rayOrigin, this.length, this.hex)
      World.add(this.arrowHelper)
   }
}

const out = new Raycaster()
export default out
import World from '@src/js/World'
import { Vector2 } from 'three'

const tVec2a = new Vector2()
const tVec2b = new Vector2()
const tVec2c = new Vector2()
const tVec2d = new Vector2()

class Mouse {
   constructor(opt) {

      this.init()
      this.mouseMove()
   }

   init() {
      // Position de la souris dans le DOM
      this.mouseDom = tVec2a

      // Position de la souris à utiliser dans fragment shader si besoin (x: [0, 1], y:[0, 1])
      this.mouseFrag = tVec2b

      // Position de la souris dans la scène (x: [-1, 1], y:[-1, 1])
      this.mouseScene = tVec2c
      
      // Position de la souris dans la scène par rapport à la taille du DOM et de la caméra (x: [?, ?], y:[?, ?])
      // ❗ Expérimental
      this.mouseMap = tVec2d
   }

   mouseMove() {
      document.addEventListener('mousemove', e => {
         this.mouseDom.set(
            e.clientX,
            e.clientY
         )
         
         this.mouseFrag.set(
            this.mouseDom.x / window.innerWidth,
            this.mouseDom.y / window.innerHeight
         )

         this.mouseScene.set(
            (this.mouseDom.x / window.innerWidth) * 2 - 1,
            - (this.mouseDom.y / window.innerHeight) * 2 + 1
         )
         
         this.mouseMap.set(
            this.cursorMap(this.mouseScene.x, -1, 1, -this.viewSize().width / 2, this.viewSize().width / 2),
            this.cursorMap(this.mouseScene.y, -1, 1, -this.viewSize().height / 2, this.viewSize().height / 2)
         )
      })
   }

   cursorMap (mousePos, in_min, in_max, out_min, out_max) {
      return ((mousePos - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
   }

   viewSize() {
      let cameraZ = World.camera.position.z
      let distance = cameraZ - 0
      let aspect = World.camera.aspect

      let vFov = World.camera.fov * Math.PI / 180
      let height = 2 * Math.tan(vFov / 2) * distance
      let width = height * aspect

      return { width, height, vFov }
   }
}

const out = new Mouse()
export default out
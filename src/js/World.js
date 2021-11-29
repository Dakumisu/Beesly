import { Scene, PerspectiveCamera, WebGLRenderer } from 'three'

import { Store } from '@js/Store'

class World {
   constructor() {
      this.canvas = document.querySelector('canvas.webgl')

      this.initialized = false

      this.init()
      this.resize()
   }

   init() {
      this.setScene()
      this.setCamera()
      this.setRenderer()

      this.initialized = true
   }

   setScene() {
      this.scene = new Scene()
   }

   setCamera() {
      this.camera = new PerspectiveCamera(75, Store.sizes.width / Store.sizes.height, 0.01, 1000)
      this.camera.position.set(0, 0, 3);  

      this.add(this.camera)
   }

   setRenderer() {
      this.renderer = new WebGLRenderer({
         canvas: this.canvas,
         powerPreference: 'high-performance',
         antialias: true,
         alpha: true
      })
      this.renderer.setSize(Store.sizes.width, Store.sizes.height)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      this.renderer.setClearColor(0x222222, 1)
   }

   add(object) {
      this.scene.add(object)
   }
   
   resize() {
      window.addEventListener('resize', () => {
         // Update sizes
         Store.sizes.width = window.innerWidth
         Store.sizes.height = window.innerHeight
     
         // Update camera
         this.camera.aspect = Store.sizes.width / Store.sizes.height
         this.camera.updateProjectionMatrix()
     
         // Update renderer
         this.renderer.setSize(Store.sizes.width, Store.sizes.height)
         this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
     })
   }

   render() {
      if (!this.initialized) return

      this.renderer.render(this.scene, this.camera)
   }
}

const out = new World()
export default out
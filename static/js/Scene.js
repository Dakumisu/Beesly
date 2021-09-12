import * as THREE from 'three'

class Scene {
   constructor(opt) {
      this.canvas = opt.canvas

      this.sizes = {
         width: window.innerWidth,
         height: window.innerHeight
      }
      
      this.lowestElapsedTime = 0

      this.init()
      this.resize()
   }

   init() {
      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.01, 1000)
      this.camera.position.set(0, 0, 3);  
      this.renderer = new THREE.WebGLRenderer({
         canvas: this.canvas,
         powerPreference: 'high-performance',
         antialias: true,
         alpha: true
      })
      this.renderer.setSize(this.sizes.width, this.sizes.height)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      this.renderer.setClearColor(0x222222, 1)

      this.clock = new THREE.Clock()

      this.scene.add(this.camera)
   }

   resize() {
      window.addEventListener('resize', () => {
         // Update sizes
         this.sizes.width = window.innerWidth
         this.sizes.height = window.innerHeight
     
         // Update camera
         this.camera.aspect = this.sizes.width / this.sizes.height
         this.camera.updateProjectionMatrix()
     
         // Update renderer
         this.renderer.setSize(this.sizes.width, this.sizes.height)
         this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
     })
   }
}

export default Scene
import * as THREE from 'three'
import vertex from '../glsl/vertex.vert'
import fragment from '../glsl/fragment.frag'

class Blueprint {
   constructor(opt) {
      this.scene = opt.scene

      this.init()
      this.resize()
   }

   init() {
      this.blueprintGeometry = new THREE.PlaneBufferGeometry(1,1)
      this.blueprintMaterial = new THREE.ShaderMaterial({
         vertexShader: vertex,
         fragmentShader: fragment,
         uniforms: {
            uTime: { value : 0 },
            uColor: { value: new THREE.Color(0xffffff) },
            uAlpha: { value: 1 },
            uAspect : { value : new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uPixelRatio: { value: window.devicePixelRatio }
         },
         side: THREE.DoubleSide,
         transparent: true,
         depthTest: false,
         depthWrite: false
      })

      this.blueprintMesh = new THREE.Mesh(this.blueprintGeometry, this.blueprintMaterial)

      this.scene.add(this.blueprintMesh)
   }

   resize() {
      window.addEventListener('resize', () => {
         this.blueprintMaterial.uniforms.uAspect.value = new THREE.Vector2(window.innerWidth, window.innerHeight)
         this.blueprintMaterial.uniforms.uPixelRatio.value = window.devicePixelRatio
     })
   }
}

export default Blueprint
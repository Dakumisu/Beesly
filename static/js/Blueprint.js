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
            uAspect : { value : new THREE.Vector2(this.scene.sizes.width, this.scene.sizes.height) },
            uPixelRatio: { value: window.devicePixelRatio }
         },
         side: THREE.DoubleSide,
         transparent: true,

         /* pour les particules */
         // depthTest: false,
         // depthWrite: false,
         // blending: THREE.AdditiveBlending
      })

      this.blueprintMesh = new THREE.Mesh(this.blueprintGeometry, this.blueprintMaterial)
      this.blueprintMesh.frustumCulled = false // https://threejs.org/docs/#api/en/core/Object3D.frustumCulled

      this.scene.scene.add(this.blueprintMesh)
   }

   resize() {
      window.addEventListener('resize', () => {
         this.blueprintMaterial.uniforms.uAspect.value = new THREE.Vector2(this.scene.sizes.width, this.scene.sizes.height)
         this.blueprintMaterial.uniforms.uPixelRatio.value = window.devicePixelRatio
     })
   }
}

export default Blueprint
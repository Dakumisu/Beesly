import { Color, DoubleSide, Mesh, PlaneBufferGeometry, ShaderMaterial, Vector3 } from 'three'

import World from '@src/js/World'
import { Store } from '@js/Store'

import vertex from '@glsl/vertex.vert'
import fragment from '@glsl/fragment.frag'

const twoPI = Math.PI * 2
const tVec3 = new Vector3()

class Blueprint {
   constructor(opt) {
      this.blueprint = {}

      this.initialized = false

      this.init()
      this.resize()
   }

   init() {
      this.setGeometry()
      this.setMaterial()
      this.setMesh()

      this.initialized = true
   }

   setGeometry() {
      this.blueprint.geometry = new PlaneBufferGeometry(1,1)
   }

   setMaterial() {
      this.blueprint.material = new ShaderMaterial({
         vertexShader: vertex,
         fragmentShader: fragment,
         uniforms: {
            uTime: { value : 0 },
            uColor: { value: new Color(0xffffff) },
            uAlpha: { value: 1 },
            uResolution : { value : tVec3.set(Store.sizes.width, Store.sizes.height, window.devicePixelRatio) },
         },
         side: DoubleSide,
         transparent: true,

         /* pour les particules */
         // depthTest: false,
         // depthWrite: false,
         // blending: THREE.AdditiveBlending
      })
   }

   setMesh() {
      this.blueprint.mesh = new Mesh(this.blueprint.geometry, this.blueprint.material)
      this.blueprint.mesh.frustumCulled = false // https://threejs.org/docs/#api/en/core/Object3D.frustumCulled

      this.addObject(this.blueprint.mesh)
   }

   addObject(object) {
      World.add(object)
   }

   resize() {
      window.addEventListener('resize', () => {
         this.blueprint.material.uniforms.uAspect.value = tVec3.set(Store.sizes.width, Store.sizes.height, window.devicePixelRatio)
     })
   }

   update() {
      if (!this.initialized) return

   }
}

export default Blueprint
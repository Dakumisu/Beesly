import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'

class LoadModel {
   constructor(opt) {
      this.name = opt.name
      this.model = opt.model
      this.scene = opt.scene

      this.loader = new GLTFLoader()
      this.dracoLoader = new DRACOLoader()
      this.dracoLoader.setDecoderPath('../assets/js/draco/')
      this.loader.setDRACOLoader(this.dracoLoader)

      this.init()
   }

   async init() {
      this.asyncMesh = await this.loader.loadAsync(this.model)
      this.mesh = this.asyncMesh.scene.children[0]

      this.scene.add(this.mesh)
   }
}

export default LoadModel
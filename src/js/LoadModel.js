import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js' // https://threejs.org/docs/#examples/en/loaders/GLTFLoader
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js' // https://threejs.org/docs/#examples/en/loaders/DRACOLoader

class LoadModel {
   constructor(opt) {
      this.name = opt.name // nom du model
      this.model = opt.model // lien du model (ex: '../assets/3D/model.glb')
      this.scene = opt.scene

      this.loader = new GLTFLoader()
      this.dracoLoader = new DRACOLoader()
      this.dracoLoader.setDecoderPath('../assets/js/draco/')
      this.loader.setDRACOLoader(this.dracoLoader)

      this.init()
   }

   async init() {
      this.asyncMesh = await this.loader.loadAsync(this.model)
      this.modelMesh = this.asyncMesh.scene.children[0]
      
      const modelMaterial = new THREE.MeshBasicMaterial()

      this.modelMesh.traverse((vertice) => {
         if (vertice.isMesh) {
            vertice.material = modelMaterial
         }
      })

      this.scene.add(this.modelMesh)
   }
}

export default LoadModel
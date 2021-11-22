import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'meshoptimizer/meshopt_decoder.module';

const gltfLoader = new GLTFLoader();
gltfLoader.setMeshoptDecoder(MeshoptDecoder);

export default async function loadGLTF(url, opts = {}) {
    const response = await fetch(url);
    const res = await response.arrayBuffer();

    return await new Promise(resolve => gltfLoader.parse(res, '', data => {
        if (opts.onLoad) opts.onLoad(data);
        resolve(data);
    }));
}

loadGLTF.loader = {
    name: 'gltf',
    extensions: [ '.gltf', '.glb' ],
    function: loadGLTF
};

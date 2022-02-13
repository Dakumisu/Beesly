import hotMaterial from '@utils/webgl/hotMaterial';
import vs from './vertex.glsl';
import fs from './fragment.glsl';

export default hotMaterial(vs, fs, (update) => {
	if (import.meta.hot) import.meta.hot.accept(update);
});

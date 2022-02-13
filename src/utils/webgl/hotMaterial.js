export default function hotMaterial(vs, fs, cb) {
	const obj = {
		vs,
		fs,
		use: instance => {
			instance.fragmentShader = fs;
			instance.vertexShader = vs;
		},
		unuse: () => {}
	};

	/// #if DEBUG
	if (import.meta.hot) {
		obj.instances = new Set();

		obj.use = instance => {
			instance.fragmentShader = fs;
			instance.vertexShader = vs;
			instance.needsUpdate = true;
			obj.instances.add(instance);
		};

		obj.unuse = instance => {
			obj.instances.delete(instance);
		};

		obj.update = newObj => {
			const o = newObj.default;
			obj.vs = o.vs;
			obj.fs = o.fs;
			o.use = obj.use;
			o.unuse = obj.unuse;
			o.instances = obj.instances;
			o.update = obj.update;
			obj.instances.forEach(instance => {
				instance.fragmentShader = obj.fs;
				instance.vertexShader = obj.vs;
				instance.needsUpdate = true;
			});
		};

		if (cb) cb(obj.update);
	}
	/// #endif

	return obj;
}

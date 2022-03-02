import {
	BufferAttribute,
	BufferGeometry,
	InterleavedBuffer,
	InterleavedBufferAttribute,
	TriangleFanDrawMode,
	TriangleStripDrawMode,
	TrianglesDrawMode,
	Vector2,
	Vector3,
} from 'three';

const BufferGeometryUtils = {
	/**
	 * @param  {Array<BufferGeometry>} geometries
	 * @param  {Boolean} useGroups
	 * @return {BufferGeometry}
	 */
	mergeBufferGeometries: function (geometries, useGroups) {
		const isIndexed = geometries[0].index !== null;

		const attributesUsed = new Set(Object.keys(geometries[0].attributes));
		const morphAttributesUsed = new Set(
			Object.keys(geometries[0].morphAttributes),
		);

		const attributes = {};
		const morphAttributes = {};

		const morphTargetsRelative = geometries[0].morphTargetsRelative;

		const mergedGeometry = new BufferGeometry();

		let offset = 0;

		for (var i = 0; i < geometries.length; ++i) {
			const geometry = geometries[i];
			let attributesCount = 0;

			// ensure that all geometries are indexed, or none

			if (isIndexed !== (geometry.index !== null)) {
				console.error(
					'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' +
						i +
						'. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.',
				);
				return null;
			}

			// gather attributes, exit early if they're different

			for (var name in geometry.attributes) {
				if (!attributesUsed.has(name)) {
					console.error(
						'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' +
							i +
							'. All geometries must have compatible attributes; make sure "' +
							name +
							'" attribute exists among all geometries, or in none of them.',
					);
					return null;
				}

				if (attributes[name] === undefined) attributes[name] = [];

				attributes[name].push(geometry.attributes[name]);
				attributesCount++;
			}

			// ensure geometries have the same number of attributes

			if (attributesCount !== attributesUsed.size) {
				console.error(
					'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' +
						i +
						'. Make sure all geometries have the same number of attributes.',
				);
				return null;
			}

			// gather morph attributes, exit early if they're different

			if (morphTargetsRelative !== geometry.morphTargetsRelative) {
				console.error(
					'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' +
						i +
						'. .morphTargetsRelative must be consistent throughout all geometries.',
				);
				return null;
			}

			for (var name in geometry.morphAttributes) {
				if (!morphAttributesUsed.has(name)) {
					console.error(
						'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' +
							i +
							'.  .morphAttributes must be consistent throughout all geometries.',
					);
					return null;
				}

				if (morphAttributes[name] === undefined)
					morphAttributes[name] = [];

				morphAttributes[name].push(geometry.morphAttributes[name]);
			}

			// gather .userData

			mergedGeometry.userData.mergedUserData =
				mergedGeometry.userData.mergedUserData || [];
			mergedGeometry.userData.mergedUserData.push(geometry.userData);

			if (useGroups) {
				var count;

				if (isIndexed) {
					count = geometry.index.count;
				} else if (geometry.attributes.position !== undefined) {
					count = geometry.attributes.position.count;
				} else {
					console.error(
						'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' +
							i +
							'. The geometry must have either an index or a position attribute',
					);
					return null;
				}

				mergedGeometry.addGroup(offset, count, i);

				offset += count;
			}
		}

		// merge indices

		if (isIndexed) {
			let indexOffset = 0;
			const mergedIndex = [];

			for (var i = 0; i < geometries.length; ++i) {
				const index = geometries[i].index;

				for (var j = 0; j < index.count; ++j) {
					mergedIndex.push(index.getX(j) + indexOffset);
				}

				indexOffset += geometries[i].attributes.position.count;
			}

			mergedGeometry.setIndex(mergedIndex);
		}

		// merge attributes

		for (var name in attributes) {
			const mergedAttribute = this.mergeBufferAttributes(
				attributes[name],
			);

			if (!mergedAttribute) {
				console.error(
					'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the ' +
						name +
						' attribute.',
				);
				return null;
			}

			mergedGeometry.setAttribute(name, mergedAttribute);
		}

		// merge morph attributes

		for (var name in morphAttributes) {
			const numMorphTargets = morphAttributes[name][0].length;

			if (numMorphTargets === 0) break;

			mergedGeometry.morphAttributes =
				mergedGeometry.morphAttributes || {};
			mergedGeometry.morphAttributes[name] = [];

			for (var i = 0; i < numMorphTargets; ++i) {
				const morphAttributesToMerge = [];

				for (var j = 0; j < morphAttributes[name].length; ++j) {
					morphAttributesToMerge.push(morphAttributes[name][j][i]);
				}

				const mergedMorphAttribute = this.mergeBufferAttributes(
					morphAttributesToMerge,
				);

				if (!mergedMorphAttribute) {
					console.error(
						'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the ' +
							name +
							' morphAttribute.',
					);
					return null;
				}

				mergedGeometry.morphAttributes[name].push(mergedMorphAttribute);
			}
		}

		return mergedGeometry;
	},

	/**
	 * @param {Array<BufferAttribute>} attributes
	 * @return {BufferAttribute}
	 */
	mergeBufferAttributes: function (attributes) {
		let TypedArray;
		let itemSize;
		let normalized;
		let arrayLength = 0;

		for (var i = 0; i < attributes.length; ++i) {
			const attribute = attributes[i];

			if (attribute.isInterleavedBufferAttribute) {
				console.error(
					'THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. InterleavedBufferAttributes are not supported.',
				);
				return null;
			}

			if (TypedArray === undefined)
				TypedArray = attribute.array.constructor;
			if (TypedArray !== attribute.array.constructor) {
				console.error(
					'THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.',
				);
				return null;
			}

			if (itemSize === undefined) itemSize = attribute.itemSize;
			if (itemSize !== attribute.itemSize) {
				console.error(
					'THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.',
				);
				return null;
			}

			if (normalized === undefined) normalized = attribute.normalized;
			if (normalized !== attribute.normalized) {
				console.error(
					'THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.',
				);
				return null;
			}

			arrayLength += attribute.array.length;
		}

		const array = new TypedArray(arrayLength);
		let offset = 0;

		for (var i = 0; i < attributes.length; ++i) {
			array.set(attributes[i].array, offset);

			offset += attributes[i].array.length;
		}

		return new BufferAttribute(array, itemSize, normalized);
	},
};

onmessage = function (e) {
	const geos = e.data.geometries;
	const mergedGeoAttributes = getMergedGeometries(geos);

	postMessage(mergedGeoAttributes);
};

function setGeo(geo) {
	const bufferGeo = new BufferGeometry();

	bufferGeo.setIndex(new BufferAttribute(geo.index, 1, false));
	bufferGeo.setAttribute(
		'position',
		new BufferAttribute(geo.position, 3, false),
	);
	bufferGeo.setAttribute('normal', new BufferAttribute(geo.normal, 3, false));
	bufferGeo.setAttribute('uv', new BufferAttribute(geo.uv, 2, false));

	bufferGeo.morphTargetsRelative = true;

	return bufferGeo;
}

function mergeGeo(geo) {
	const mergedGeo = BufferGeometryUtils.mergeBufferGeometries(geo, false);
	mergedGeo.morphTargetsRelative = true;

	return mergedGeo;
}

function getMergedGeometries(geos) {
	const geometries = geos;
	const count = geometries.length;

	let mergedGeo = setGeo(geometries[0]);

	for (let i = 1; i < count; i++) {
		mergedGeo = mergeGeo([mergedGeo, setGeo(geometries[i])]);
	}

	let index = mergedGeo.index.array;
	let pos = mergedGeo.attributes.position.array;
	let uv = mergedGeo.attributes.uv.array;
	let normal = mergedGeo.attributes.normal.array;

	const mergedGeoAttributes = { index, pos, uv, normal };

	return mergedGeoAttributes;
}

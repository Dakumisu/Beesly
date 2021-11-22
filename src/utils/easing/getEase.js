import bezier from 'bezier-easing';

const beziers = new Map();
const linearEase = v => v;

export default function getEase(curve) {
	if (!curve) return linearEase;
	if (!beziers.has(curve)) {
		beziers.set(curve, bezier(
			curve[ 0 ],
			curve[ 1 ],
			curve[ 2 ],
			curve[ 3 ]
		));
	}

	return beziers.get(curve);
}

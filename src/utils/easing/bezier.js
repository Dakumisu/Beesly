import BezierEasing from 'bezier-easing';

export const bezier = arr => new BezierEasing(
	arr[0],
	arr[1],
	arr[2],
	arr[3]
);

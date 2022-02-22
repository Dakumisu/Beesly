const store = {
	resolution: {
		width: window.innerWidth,
		height: window.innerHeight,
		dpr: window.devicePixelRatio,
	},

	aspect: {
		ratio: 0,

		a1: 0,
		a2: 0,
	},

	style: null,
	device: null,
	browser: null,

	views: null,
};

export { store };

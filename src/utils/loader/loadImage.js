export default function loadImage(url, opts = {}) {
	return new Promise((resolve) => {
		const node = new Image();
		const cb = () => {
			const obj = { node, url };
			if (opts.onLoad) opts.onLoad(obj);
			resolve(obj);
		};
		node.onload = cb;
		node.decoding = 'async';
		node.setAttribute('decoding', 'async');
		node.src = url;
	});
}

loadImage.loader = {
	name: 'image',
	extensions: ['.jpg', '.png', '.webp', '.avif', '.gif', '.jpeg', '.mozjpeg'],
	function: loadImage,
};

export default function loadFile(url, opts = {}) {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();

		request.responseType = opts.responseType || 'arraybuffer';
		request.onreadystatechange = () => {
			if (request.readyState !== 4) return;
			if (request.readyState === 4 && request.status === 200) {
				if (opts.onLoad) opts.onLoad(request.response);
				resolve(request.response, request.status);
			} else {
				reject(request.status);
			}
		};

		request.open('GET', url, true);
		request.send();
	});
}

onmessage = function (e) {
	let start = performance.now();

	new Promise((resolve) => {
		resolve(fibonacci(40));
	}).then(() => {
		let end = performance.now();
		let gap = end - start;

		postMessage(gap);
	});
};

function fibonacci(n) {
	return n < 2 ? n : fibonacci(n - 2) + fibonacci(n - 1);
}

export function fibonacci(n) {
	return n < 2 ? n : fibonacci(n - 2) + fibonacci(n - 1);
}

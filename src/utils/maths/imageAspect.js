
export function imageAspect(aspect, width, height) {
	let a1, a2

	if (height / width > aspect) {
		a1 = (width / height) * aspect
		a2 = 1
	} else {
		a1 = 1
		a2 = (height / width) * aspect
	}

	return { a1, a2 }
}

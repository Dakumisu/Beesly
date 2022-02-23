export function loadHTML(htmlRelativeUrl, baseUrl) {
	const htmlUrl = new URL(htmlRelativeUrl, baseUrl).href;
	return fetch(htmlUrl).then((response) => response.text());
}

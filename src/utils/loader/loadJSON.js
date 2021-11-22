export default async function loadJSON(url, opts = {}) {
	const response = await fetch(url);
	const json = await response.json();
	if (opts.onLoad) opts.onLoad(json);
	return json;
}

loadJSON.loader = {
	name: 'json',
	extensions: [ '.json' ],
	function: loadJSON
};

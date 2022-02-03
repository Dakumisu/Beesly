vec3 phong(vec3 color, vec3 specularColor, float shininess, float lightIntensity, vec3 normal, vec3 lightPos, vec3 objectPos) {
	vec3 n = normalize(normal);
	vec3 s = normalize(lightPos - objectPos);
	vec3 v = normalize(-objectPos);
	vec3 r = reflect(-s, n);

	vec3 ambient = color;
	vec3 diffuse = color * max(dot(s, n), 0.);
	vec3 specular = specularColor * pow(max(dot(r, v), 0.), shininess);

	return lightIntensity * (ambient + diffuse + specular);
}

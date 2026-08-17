// Based on https://github.com/pmndrs/postprocessing by vanruesc

export default /* glsl */ `
vec4 blendVividLight(vec4 dst, vec4 src, float opacity) {
	vec3 c = mix(
		max(1.0 - min((1.0 - dst.rgb) / (2.0 * src.rgb), 1.0), 0.0),
		min(dst.rgb / (2.0 * (1.0 - src.rgb)), 1.0),
		step(0.5, src.rgb)
	);

	return mix(dst, vec4(c, max(dst.a, src.a)), opacity);
}
`;

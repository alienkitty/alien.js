// Based on https://github.com/pmndrs/postprocessing by vanruesc

export default /* glsl */ `
vec4 blendNegation(vec4 dst, vec4 src, float opacity) {
	vec3 c = max(1.0 - abs(1.0 - dst.rgb - src.rgb), 0.0);
	return mix(dst, vec4(c, max(dst.a, src.a)), opacity);
}
`;

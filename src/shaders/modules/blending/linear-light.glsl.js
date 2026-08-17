// Based on https://github.com/pmndrs/postprocessing by vanruesc

export default /* glsl */ `
vec4 blendLinearLight(vec4 dst, vec4 src, float opacity) {
	vec3 c = clamp(2.0 * src.rgb + dst.rgb - 1.0, 0.0, 1.0);
	return mix(dst, vec4(c, max(dst.a, src.a)), opacity);
}
`;

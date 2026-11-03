// Based on https://github.com/pmndrs/postprocessing by vanruesc

export default /* glsl */ `
vec4 blendSubtract(vec4 dst, vec4 src, float opacity) {
	vec3 c = max(dst.rgb - src.rgb, 0.0);
	return mix(dst, vec4(c, max(dst.a, src.a)), opacity);
}
`;

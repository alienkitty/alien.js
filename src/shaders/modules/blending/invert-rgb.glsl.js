// Based on https://github.com/pmndrs/postprocessing by vanruesc

export default /* glsl */ `
vec4 blendInvertRGB(vec4 dst, vec4 src, float opacity) {
	vec3 c = src.rgb * max(1.0 - dst.rgb, 0.0);
	return mix(dst, vec4(c, max(dst.a, src.a)), opacity);
}
`;

// Based on https://github.com/pmndrs/postprocessing by vanruesc

export default /* glsl */ `
vec4 blendLinearDodge(vec4 dst, vec4 src, float opacity) {
	vec3 c = min(dst.rgb + src.rgb, 1.0);
	return mix(dst, vec4(c, max(dst.a, src.a)), opacity);
}
`;

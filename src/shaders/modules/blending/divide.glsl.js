// Based on https://github.com/pmndrs/postprocessing by vanruesc

export default /* glsl */ `
vec4 blendDivide(vec4 dst, vec4 src, float opacity) {
	vec3 c = dst.rgb / max(src.rgb, 1e-9);
	return mix(dst, vec4(c, max(dst.a, src.a)), opacity);
}
`;

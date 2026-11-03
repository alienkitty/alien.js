// Based on https://github.com/pmndrs/postprocessing by vanruesc

export default /* glsl */ `
vec4 blendReflect(vec4 dst, vec4 src, float opacity) {
	vec3 a = min(dst.rgb * dst.rgb / max(1.0 - src.rgb, 1e-9), 1.0);
	vec3 c = mix(a, src.rgb, step(1.0, src.rgb));
	return mix(dst, vec4(c, max(dst.a, src.a)), opacity);
}
`;

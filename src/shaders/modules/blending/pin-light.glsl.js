// Based on https://github.com/pmndrs/postprocessing by vanruesc

export default /* glsl */ `
vec4 blendPinLight(vec4 dst, vec4 src, float opacity) {
	vec3 src2 = 2.0 * src.rgb;

	vec3 c = mix(
		mix(src2, dst.rgb, step(0.5 * dst.rgb, src.rgb)),
		max(src2 - 1.0, vec3(0.0)), 
		step(dst.rgb, src2 - 1.0)
	);

	return mix(dst, vec4(c, max(dst.a, src.a)), opacity);
}
`;

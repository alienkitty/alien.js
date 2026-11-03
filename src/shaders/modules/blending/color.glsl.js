// Based on https://github.com/pmndrs/postprocessing by vanruesc

export default /* glsl */ `
vec4 blendColor(vec4 dst, vec4 src, float opacity) {
	vec3 a = RGBToHSL(dst.rgb);
	vec3 b = RGBToHSL(src.rgb);
	vec3 c = HSLToRGB(vec3(b.xy, a.z));
	return mix(dst, vec4(c, max(dst.a, src.a)), opacity);
}
`;

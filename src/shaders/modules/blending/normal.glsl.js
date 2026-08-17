// Based on https://github.com/pmndrs/postprocessing by vanruesc

export default /* glsl */ `
vec4 blendNormal(vec4 dst, vec4 src, float opacity) {
	return mix(dst, src, opacity);
}
`;

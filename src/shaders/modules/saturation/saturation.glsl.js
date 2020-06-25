// From https://github.com/AnalyticalGraphicsInc/cesium

export default /* glsl */`
// Algorithm from Chapter 16 of OpenGL Shading Language
vec3 getSaturation(vec3 rgb, float adjustment) {
    vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec3 intensity = vec3(dot(rgb, W));
    return mix(intensity, rgb, adjustment);
}
`;

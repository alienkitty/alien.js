// From https://github.com/CesiumGS/cesium

export default /* glsl */`
vec3 getSaturation(vec3 rgb, float adjustment) {
    // Algorithm from Chapter 16 of OpenGL Shading Language
    vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec3 intensity = vec3(dot(rgb, W));
    return mix(intensity, rgb, adjustment);
}
`;

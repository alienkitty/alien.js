// Based on https://threejs.org/examples/#webgl_depth_texture by mattdesl

export default /* glsl */`
float viewZToOrthographicDepth(float viewZ, float near, float far) {
    return (viewZ + near) / (near - far);
}

float orthographicDepthToViewZ(float linearClipZ, float near, float far) {
    return linearClipZ * (near - far) - near;
}

float viewZToPerspectiveDepth(float viewZ, float near, float far) {
    return ((near + viewZ) * far) / ((far - near) * viewZ);
}

float perspectiveDepthToViewZ(float invClipZ, float near, float far) {
    return (near * far) / ((far - near) * invClipZ - far);
}

float getLinearDepth(float fragCoordZ, float near, float far) {
    float viewZ = perspectiveDepthToViewZ(fragCoordZ, near, far);
    return viewZToOrthographicDepth(viewZ, near, far);
}
`;

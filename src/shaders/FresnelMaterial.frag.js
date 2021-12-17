export default /* glsl */`
precision highp float;

uniform vec3 uBaseColor;
uniform vec3 uFresnelColor;
uniform float uFresnelPower;

in vec3 vWorldNormal;
in vec3 vViewDirection;

out vec4 FragColor;

void main() {
    float fresnelFactor = abs(dot(vViewDirection, vWorldNormal));
    float inversefresnelFactor = 1.0 - fresnelFactor;

    // Shaping function
    fresnelFactor = pow(fresnelFactor, uFresnelPower);
    inversefresnelFactor = pow(inversefresnelFactor, uFresnelPower);

    FragColor = vec4(fresnelFactor * uBaseColor + inversefresnelFactor * uFresnelColor, 1.0);
}
`;

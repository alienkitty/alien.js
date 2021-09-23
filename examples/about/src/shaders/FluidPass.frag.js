// Based on https://www.shadertoy.com/view/XlsBDf by davidar

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform vec2 uMouse[NUM_POINTERS];
uniform vec2 uLast[NUM_POINTERS];
uniform vec2 uVelocity[NUM_POINTERS];
uniform vec2 uStrength[NUM_POINTERS];
uniform vec2 uResolution;
uniform int uFrame;

out vec4 FragColor;

#define T(p) texture(tMap, (p) / uResolution.xy)
#define length2(p) dot(p, p)

#define dt 0.15
#define K 0.2
#define nu 0.5
#define kappa 0.1

void main() {
    if (uFrame < 10) {
        FragColor = vec4(0, 0, 1, 0);
        return;
    }

    vec2 p = gl_FragCoord.xy;
    vec4 c = T(p);

    vec4 n = T(p + vec2(0, 1));
    vec4 e = T(p + vec2(1, 0));
    vec4 s = T(p - vec2(0, 1));
    vec4 w = T(p - vec2(1, 0));

    vec4 laplacian = (n + e + s + w - 4.0 * c);

    vec4 dx = (e - w) / 2.0;
    vec4 dy = (n - s) / 2.0;

    // Velocity field divergence
    float div = dx.x + dy.y;

    // Mass conservation, Euler method step
    c.z -= dt * (dx.z * c.x + dy.z * c.y + div * c.z);

    // Semi-Langrangian advection
    c.xyw = T(p - dt * c.xy).xyw;

    // Viscosity/diffusion
    c.xyw += dt * vec3(nu, nu, kappa) * laplacian.xyw;

    // Nullify divergence with pressure field gradient
    c.xy -= K * vec2(dx.z, dy.z);

    // External source
    for (int i = 0; i < NUM_POINTERS; i++) {
        if (uStrength[i].x == 0.0 && uStrength[i].y == 0.0) continue;

        // Add iterations between the last and current mouse position, smoothing-out the mouse trail
        vec2 pos = uLast[i].xy;
        float iterations = clamp((length(uVelocity[i]) / 40.0) * MAX_ITERATIONS, 1.0, MAX_ITERATIONS);

        for (float j = 0.0; j < MAX_ITERATIONS; j++) {
            if (j >= iterations) break;

            pos += (uMouse[i].xy - pos.xy) * ((j + 1.0) / iterations);
            vec2 m = pos.xy * uResolution.xy;
            c.xyw += dt * exp(-length2(p - m) / uStrength[i].x) * vec3(p - m + (uVelocity[i].xy * uStrength[i].y), 1);
        }
    }

    // Dissipation
    c.w -= dt * 0.0005;

    FragColor = clamp(c, vec4(-5, -5, 0.5, 0), vec4(5, 5, 3, 5));
}
`;

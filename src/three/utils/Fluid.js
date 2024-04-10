/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
 * Based on https://oframe.github.io/ogl/examples/?src=post-fluid-distortion.html by gordonnl
 */

import {
    Color,
    GLSL3,
    HalfFloatType,
    Mesh,
    NearestFilter,
    NoBlending,
    OrthographicCamera,
    RGFormat,
    RawShaderMaterial,
    RedFormat,
    Vector2,
    WebGLRenderTarget
} from 'three';

import { getDoubleRenderTarget, getFullscreenTriangle } from '@alienkitty/space.js/three';

const baseVertexShader = /* glsl */ `
precision highp float;

in vec3 position;
in vec2 uv;

uniform vec2 texelSize;

out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;

void main () {
    vUv = uv;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);

    gl_Position = vec4(position, 1.0);
}
`;

const clearShader = /* glsl */ `
precision mediump float;
precision mediump sampler2D;

uniform sampler2D uTexture;
uniform float value;

in highp vec2 vUv;

out vec4 FragColor;

void main () {
    FragColor = value * texture(uTexture, vUv);
}
`;

const splatShader = /* glsl */ `
precision highp float;
precision highp sampler2D;

uniform sampler2D uTarget;
uniform float uAspect;
uniform vec3 color;
uniform vec2 point;
uniform float radius;

in vec2 vUv;

out vec4 FragColor;

void main () {
    vec2 p = vUv - point.xy;
    p.x *= uAspect;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture(uTarget, vUv).xyz;

    FragColor = vec4(base + splat, 1.0);
}
`;

const advectionShader = /* glsl */ `
precision highp float;
precision highp sampler2D;

uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;

in vec2 vUv;

out vec4 FragColor;

void main () {
    vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;

    FragColor = dissipation * texture(uSource, coord);
    FragColor.a = 1.0;
}
`;

const divergenceShader = /* glsl */ `
precision mediump float;
precision mediump sampler2D;

uniform sampler2D uVelocity;

in highp vec2 vUv;
in highp vec2 vL;
in highp vec2 vR;
in highp vec2 vT;
in highp vec2 vB;

out vec4 FragColor;

void main () {
    float L = texture(uVelocity, vL).x;
    float R = texture(uVelocity, vR).x;
    float T = texture(uVelocity, vT).y;
    float B = texture(uVelocity, vB).y;
    vec2 C = texture(uVelocity, vUv).xy;
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }
    float div = 0.5 * (R - L + T - B);

    FragColor = vec4(div, 0.0, 0.0, 1.0);
}
`;

const curlShader = /* glsl */ `
precision mediump float;
precision mediump sampler2D;

uniform sampler2D uVelocity;

in highp vec2 vUv;
in highp vec2 vL;
in highp vec2 vR;
in highp vec2 vT;
in highp vec2 vB;

out vec4 FragColor;

void main () {
    float L = texture(uVelocity, vL).y;
    float R = texture(uVelocity, vR).y;
    float T = texture(uVelocity, vT).x;
    float B = texture(uVelocity, vB).x;
    float vorticity = R - L - T + B;

    FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}
`;

const vorticityShader = /* glsl */ `
precision highp float;
precision highp sampler2D;

uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;

in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;

out vec4 FragColor;

void main () {
    float L = texture(uCurl, vL).x;
    float R = texture(uCurl, vR).x;
    float T = texture(uCurl, vT).x;
    float B = texture(uCurl, vB).x;
    float C = texture(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;
    vec2 vel = texture(uVelocity, vUv).xy;

    FragColor = vec4(vel + force * dt, 0.0, 1.0);
}
`;

const pressureShader = /* glsl */ `
precision mediump float;
precision mediump sampler2D;

uniform sampler2D uPressure;
uniform sampler2D uDivergence;

in highp vec2 vUv;
in highp vec2 vL;
in highp vec2 vR;
in highp vec2 vT;
in highp vec2 vB;

out vec4 FragColor;

void main () {
    float L = texture(uPressure, vL).x;
    float R = texture(uPressure, vR).x;
    float T = texture(uPressure, vT).x;
    float B = texture(uPressure, vB).x;
    float C = texture(uPressure, vUv).x;
    float divergence = texture(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;

    FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}
`;

const gradientSubtractShader = /* glsl */ `
precision mediump float;
precision mediump sampler2D;

uniform sampler2D uPressure;
uniform sampler2D uVelocity;

in highp vec2 vUv;
in highp vec2 vL;
in highp vec2 vR;
in highp vec2 vT;
in highp vec2 vB;

out vec4 FragColor;

void main () {
    float L = texture(uPressure, vL).x;
    float R = texture(uPressure, vR).x;
    float T = texture(uPressure, vT).x;
    float B = texture(uPressure, vB).x;
    vec2 velocity = texture(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);

    FragColor = vec4(velocity, 0.0, 1.0);
}
`;

export class Fluid {
    constructor(renderer, {
        simRes = 128,
        dyeRes = 512,
        iterations = 3,
        densityDissipation = 0.97,
        velocityDissipation = 0.98,
        pressureDissipation = 0.8,
        curlStrength = 20,
        radius = 0.2
    } = {}) {
        this.renderer = renderer;
        this.simRes = simRes;
        this.dyeRes = dyeRes;
        this.iterations = iterations;
        this.densityDissipation = densityDissipation;
        this.velocityDissipation = velocityDissipation;
        this.pressureDissipation = pressureDissipation;
        this.curlStrength = curlStrength;
        this.radius = radius;

        this.splats = [];

        // Fluid simulation render targets
        this.density = getDoubleRenderTarget(dyeRes, dyeRes, {
            type: HalfFloatType,
            depthBuffer: false
        });

        this.velocity = getDoubleRenderTarget(simRes, simRes, {
            type: HalfFloatType,
            format: RGFormat,
            depthBuffer: false
        });

        this.pressure = getDoubleRenderTarget(simRes, simRes, {
            type: HalfFloatType,
            format: RedFormat,
            magFilter: NearestFilter,
            minFilter: NearestFilter,
            depthBuffer: false
        });

        this.divergence = new WebGLRenderTarget(simRes, simRes, {
            type: HalfFloatType,
            format: RedFormat,
            magFilter: NearestFilter,
            minFilter: NearestFilter,
            depthBuffer: false
        });

        this.curl = new WebGLRenderTarget(simRes, simRes, {
            type: HalfFloatType,
            format: RedFormat,
            magFilter: NearestFilter,
            minFilter: NearestFilter,
            depthBuffer: false
        });

        // Output uniform containing render target textures
        this.uniform = { value: this.density.read.texture };

        // Common uniform
        const texelSize = { value: new Vector2(1 / simRes, 1 / simRes) };

        // Fluid simulation materials
        this.clearMaterial = new RawShaderMaterial({
            glslVersion: GLSL3,
            uniforms: {
                texelSize,
                uTexture: { value: null },
                value: { value: pressureDissipation }
            },
            vertexShader: baseVertexShader,
            fragmentShader: clearShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });

        this.splatMaterial = new RawShaderMaterial({
            glslVersion: GLSL3,
            uniforms: {
                texelSize,
                uTarget: { value: null },
                uAspect: { value: 1 },
                color: { value: new Color() },
                point: { value: new Vector2() },
                radius: { value: 1 }
            },
            vertexShader: baseVertexShader,
            fragmentShader: splatShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });

        this.advectionMaterial = new RawShaderMaterial({
            glslVersion: GLSL3,
            uniforms: {
                texelSize,
                dyeTexelSize: { value: new Vector2(1 / dyeRes, 1 / dyeRes) },
                uVelocity: { value: null },
                uSource: { value: null },
                dt: { value: 0.016 },
                dissipation: { value: 1 }
            },
            vertexShader: baseVertexShader,
            fragmentShader: advectionShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });

        this.divergenceMaterial = new RawShaderMaterial({
            glslVersion: GLSL3,
            uniforms: {
                texelSize,
                uVelocity: { value: null }
            },
            vertexShader: baseVertexShader,
            fragmentShader: divergenceShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });

        this.curlMaterial = new RawShaderMaterial({
            glslVersion: GLSL3,
            uniforms: {
                texelSize,
                uVelocity: { value: null }
            },
            vertexShader: baseVertexShader,
            fragmentShader: curlShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });

        this.vorticityMaterial = new RawShaderMaterial({
            glslVersion: GLSL3,
            uniforms: {
                texelSize,
                uVelocity: { value: null },
                uCurl: { value: null },
                curl: { value: curlStrength },
                dt: { value: 0.016 }
            },
            vertexShader: baseVertexShader,
            fragmentShader: vorticityShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });

        this.pressureMaterial = new RawShaderMaterial({
            glslVersion: GLSL3,
            uniforms: {
                texelSize,
                uPressure: { value: null },
                uDivergence: { value: null }
            },
            vertexShader: baseVertexShader,
            fragmentShader: pressureShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });

        this.gradientSubtractMaterial = new RawShaderMaterial({
            glslVersion: GLSL3,
            uniforms: {
                texelSize,
                uPressure: { value: null },
                uVelocity: { value: null }
            },
            vertexShader: baseVertexShader,
            fragmentShader: gradientSubtractShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });

        // Fullscreen triangle
        this.screenCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.screenTriangle = getFullscreenTriangle();
        this.screen = new Mesh(this.screenTriangle);
        this.screen.frustumCulled = false;
    }

    update() {
        const renderer = this.renderer;
        const simRes = this.simRes;
        const dyeRes = this.dyeRes;
        const iterations = this.iterations;
        const densityDissipation = this.densityDissipation;
        const velocityDissipation = this.velocityDissipation;
        const pressureDissipation = this.pressureDissipation;
        const curlStrength = this.curlStrength;
        const radius = this.radius;

        // Renderer state
        const currentRenderTarget = renderer.getRenderTarget();
        const currentAutoClear = renderer.autoClear;
        renderer.autoClear = false;

        // Render all of the inputs since the last frame
        for (let i = this.splats.length - 1; i >= 0; i--) {
            const { x, y, dx, dy } = this.splats.splice(i, 1)[0];

            this.splatMaterial.uniforms.uTarget.value = this.velocity.read.texture;
            this.splatMaterial.uniforms.point.value.set(x, y);
            this.splatMaterial.uniforms.color.value.set(dx, dy, 1);
            this.splatMaterial.uniforms.radius.value = radius / 100;
            this.screen.material = this.splatMaterial;
            renderer.setRenderTarget(this.velocity.write);
            renderer.render(this.screen, this.screenCamera);
            this.velocity.swap();

            this.splatMaterial.uniforms.uTarget.value = this.density.read.texture;
            this.screen.material = this.splatMaterial;
            renderer.setRenderTarget(this.density.write);
            renderer.render(this.screen, this.screenCamera);
            this.density.swap();
        }

        // Perform all of the fluid simulation renders
        this.curlMaterial.uniforms.uVelocity.value = this.velocity.read.texture;
        this.screen.material = this.curlMaterial;
        renderer.setRenderTarget(this.curl);
        renderer.render(this.screen, this.screenCamera);

        this.vorticityMaterial.uniforms.uVelocity.value = this.velocity.read.texture;
        this.vorticityMaterial.uniforms.uCurl.value = this.curl.texture;
        this.vorticityMaterial.uniforms.curl.value = curlStrength;
        this.screen.material = this.vorticityMaterial;
        renderer.setRenderTarget(this.velocity.write);
        renderer.render(this.screen, this.screenCamera);
        this.velocity.swap();

        this.divergenceMaterial.uniforms.uVelocity.value = this.velocity.read.texture;
        this.screen.material = this.divergenceMaterial;
        renderer.setRenderTarget(this.divergence);
        renderer.render(this.screen, this.screenCamera);

        this.clearMaterial.uniforms.uTexture.value = this.pressure.read.texture;
        this.clearMaterial.uniforms.value.value = pressureDissipation;
        this.screen.material = this.clearMaterial;
        renderer.setRenderTarget(this.pressure.write);
        renderer.render(this.screen, this.screenCamera);
        this.pressure.swap();

        this.pressureMaterial.uniforms.uDivergence.value = this.divergence.texture;

        for (let i = 0; i < iterations; i++) {
            this.pressureMaterial.uniforms.uPressure.value = this.pressure.read.texture;
            this.screen.material = this.pressureMaterial;
            renderer.setRenderTarget(this.pressure.write);
            renderer.render(this.screen, this.screenCamera);
            this.pressure.swap();
        }

        this.gradientSubtractMaterial.uniforms.uPressure.value = this.pressure.read.texture;
        this.gradientSubtractMaterial.uniforms.uVelocity.value = this.velocity.read.texture;
        this.screen.material = this.gradientSubtractMaterial;
        renderer.setRenderTarget(this.velocity.write);
        renderer.render(this.screen, this.screenCamera);
        this.velocity.swap();

        this.advectionMaterial.uniforms.dyeTexelSize.value.set(1 / simRes, 1 / simRes);
        this.advectionMaterial.uniforms.uVelocity.value = this.velocity.read.texture;
        this.advectionMaterial.uniforms.uSource.value = this.velocity.read.texture;
        this.advectionMaterial.uniforms.dissipation.value = velocityDissipation;
        this.screen.material = this.advectionMaterial;
        renderer.setRenderTarget(this.velocity.write);
        renderer.render(this.screen, this.screenCamera);
        this.velocity.swap();

        this.advectionMaterial.uniforms.dyeTexelSize.value.set(1 / dyeRes, 1 / dyeRes);
        this.advectionMaterial.uniforms.uVelocity.value = this.velocity.read.texture;
        this.advectionMaterial.uniforms.uSource.value = this.density.read.texture;
        this.advectionMaterial.uniforms.dissipation.value = densityDissipation;
        this.screen.material = this.advectionMaterial;
        renderer.setRenderTarget(this.density.write);
        renderer.render(this.screen, this.screenCamera);
        this.density.swap();

        this.uniform.value = this.density.read.texture;

        // Restore renderer settings
        renderer.autoClear = currentAutoClear;
        renderer.setRenderTarget(currentRenderTarget);
    }

    destroy() {
        this.density.dispose();
        this.velocity.dispose();
        this.pressure.dispose();
        this.divergence.dispose();
        this.curl.dispose();

        this.clearMaterial.dispose();
        this.splatMaterial.dispose();
        this.advectionMaterial.dispose();
        this.divergenceMaterial.dispose();
        this.curlMaterial.dispose();
        this.vorticityMaterial.dispose();
        this.pressureMaterial.dispose();
        this.gradientSubtractMaterial.dispose();

        this.screenTriangle.dispose();

        for (const prop in this) {
            this[prop] = null;
        }

        return null;
    }
}

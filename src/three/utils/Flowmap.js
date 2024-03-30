/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://oframe.github.io/ogl/examples/?src=mouse-flowmap.html by gordonnl
 */

import { GLSL3, HalfFloatType, Mesh, NoBlending, OrthographicCamera, RawShaderMaterial, Vector2 } from 'three';

import { getDoubleRenderTarget, getFullscreenTriangle } from '@alienkitty/space.js/three';

const vertexShader = /* glsl */ `
in vec3 position;
in vec2 uv;

out vec2 vUv;

void main() {
    vUv = uv;

    gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
precision highp float;

uniform sampler2D tMap;

uniform float uFalloff;
uniform float uAlpha;
uniform float uDissipation;

uniform float uAspect;
uniform vec2 uMouse;
uniform vec2 uVelocity;

in vec2 vUv;

out vec4 FragColor;

void main() {
    vec4 color = texture(tMap, vUv) * uDissipation;

    vec2 cursor = vUv - uMouse;
    cursor.x *= uAspect;

    vec3 stamp = vec3(uVelocity * vec2(1, -1), 1.0 - pow(1.0 - min(1.0, length(uVelocity)), 3.0));
    float falloff = smoothstep(uFalloff, 0.0, length(cursor)) * uAlpha;

    color.rgb = mix(color.rgb, stamp, falloff);

    FragColor = color;
}
`;

export class Flowmap {
    constructor(renderer, {
        size = 128,
        falloff = 0.15,
        alpha = 1,
        dissipation = 0.98
    } = {}) {
        this.renderer = renderer;

        this.mouse = new Vector2();
        this.velocity = new Vector2();

        // Render targets
        this.mask = getDoubleRenderTarget(size, size, {
            type: HalfFloatType,
            depthBuffer: false
        });

        // Output uniform containing render target textures
        this.uniform = { value: this.mask.read.texture };

        // Flowmap material
        this.material = new RawShaderMaterial({
            glslVersion: GLSL3,
            uniforms: {
                tMap: this.uniform,

                uFalloff: { value: falloff },
                uAlpha: { value: alpha },
                uDissipation: { value: dissipation },

                // User needs to update these
                uAspect: { value: 1 },
                uMouse: { value: this.mouse },
                uVelocity: { value: this.velocity }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });

        // Fullscreen triangle
        this.screenCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.screenTriangle = getFullscreenTriangle();
        this.screen = new Mesh(this.screenTriangle, this.material);
        this.screen.frustumCulled = false;
    }

    update() {
        // Renderer state
        const currentRenderTarget = this.renderer.getRenderTarget();
        const currentAutoClear = this.renderer.autoClear;
        this.renderer.autoClear = false;

        this.renderer.setRenderTarget(this.mask.write);
        this.renderer.render(this.screen, this.screenCamera);
        this.mask.swap();

        this.uniform.value = this.mask.read.texture;

        // Restore renderer settings
        this.renderer.autoClear = currentAutoClear;
        this.renderer.setRenderTarget(currentRenderTarget);
    }

    destroy() {
        this.mask.dispose();
        this.material.dispose();
        this.screenTriangle.dispose();

        for (const prop in this) {
            this[prop] = null;
        }

        return null;
    }
}

/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://oframe.github.io/ogl/examples/?src=polylines.html by gordonnl
 */

import { BufferAttribute, BufferGeometry, Color, GLSL3, Mesh, RawShaderMaterial, Vector2, Vector3 } from 'three';

const vertexShader = /* glsl */ `
precision highp float;

in vec3 position;
in vec3 next;
in vec3 prev;
in float side;
in vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uThickness;
uniform float uMiter;
uniform vec2 uResolution;
uniform float uDPR;

out vec2 vUv;

vec4 getPosition() {
    mat4 mvp = projectionMatrix * modelViewMatrix;
    vec4 current = mvp * vec4(position, 1);
    vec4 nextPos = mvp * vec4(next, 1);
    vec4 prevPos = mvp * vec4(prev, 1);

    vec2 aspect = vec2(uResolution.x / uResolution.y, 1);
    vec2 currentScreen = current.xy / current.w * aspect;
    vec2 nextScreen = nextPos.xy / nextPos.w * aspect;
    vec2 prevScreen = prevPos.xy / prevPos.w * aspect;

    vec2 dir1 = normalize(currentScreen - prevScreen);
    vec2 dir2 = normalize(nextScreen - currentScreen);
    vec2 dir = normalize(dir1 + dir2);

    vec2 normal = vec2(-dir.y, dir.x);
    normal /= mix(1.0, max(0.3, dot(normal, vec2(-dir1.y, dir1.x))), uMiter);
    normal /= aspect;

    float pixelWidthRatio = 1.0 / (uResolution.y / uDPR);
    float pixelWidth = current.w * pixelWidthRatio;
    normal *= pixelWidth * uThickness;
    current.xy -= normal * side;

    return current;
}

void main() {
    vUv = uv;

    gl_Position = getPosition();
}
`;

const fragmentShader = /* glsl */ `
precision highp float;

uniform vec3 uColor;

in vec2 vUv;

out vec4 FragColor;

void main() {
    FragColor.rgb = uColor;
    FragColor.a = 1.0;
}
`;

/**
 * A class for a polyline mesh.
 */
export class Polyline {
    constructor({
        points,
        thickness = 1,
        miter = 1,
        color
    } = {}) {
        this.points = points;

        this.count = points.length;
        this.v = new Vector3();

        // Create buffers
        this.position = new Float32Array(this.count * 3 * 2);
        this.prev = new Float32Array(this.count * 3 * 2);
        this.next = new Float32Array(this.count * 3 * 2);
        const side = new Float32Array(this.count * 1 * 2);
        const uv = new Float32Array(this.count * 2 * 2);
        const index = new Uint16Array((this.count - 1) * 3 * 2);

        // Set static buffers
        for (let i = 0; i < this.count; i++) {
            side.set([-1, 1], i * 2);
            const v = i / (this.count - 1);
            uv.set([0, v, 1, v], i * 4);

            if (i === this.count - 1) {
                continue;
            }

            const ind = i * 2;
            index.set([ind + 0, ind + 1, ind + 2], (ind + 0) * 3);
            index.set([ind + 2, ind + 1, ind + 3], (ind + 1) * 3);
        }

        this.geometry = new BufferGeometry();
        this.geometry.setAttribute('position', new BufferAttribute(this.position, 3));
        this.geometry.setAttribute('prev', new BufferAttribute(this.prev, 3));
        this.geometry.setAttribute('next', new BufferAttribute(this.next, 3));
        this.geometry.setAttribute('side', new BufferAttribute(side, 1));
        this.geometry.setAttribute('uv', new BufferAttribute(uv, 2));
        this.geometry.setIndex(new BufferAttribute(index, 1));

        // Populate dynamic buffers
        this.updateGeometry();

        // Polyline material
        this.material = new RawShaderMaterial({
            glslVersion: GLSL3,
            uniforms: {
                uThickness: { value: thickness },
                uMiter: { value: miter },
                uColor: { value: color instanceof Color ? color : new Color(color) },

                // User needs to update these
                uResolution: { value: new Vector2() },
                uDPR: { value: 1 }
            },
            vertexShader,
            fragmentShader
        });

        this.mesh = new Mesh(this.geometry, this.material);
    }

    updateGeometry() {
        this.points.forEach((p, i) => {
            p.toArray(this.position, i * 3 * 2);
            p.toArray(this.position, i * 3 * 2 + 3);

            // If first point, calculate prev using the distance to 2nd point
            if (!i) {
                this.v.copy(p)
                    .sub(this.points[i + 1])
                    .add(p);
                this.v.toArray(this.prev, i * 3 * 2);
                this.v.toArray(this.prev, i * 3 * 2 + 3);
            } else {
                p.toArray(this.next, (i - 1) * 3 * 2);
                p.toArray(this.next, (i - 1) * 3 * 2 + 3);
            }

            // If last point, calculate next using distance to 2nd last point
            if (i === this.points.length - 1) {
                this.v.copy(p)
                    .sub(this.points[i - 1])
                    .add(p);
                this.v.toArray(this.next, i * 3 * 2);
                this.v.toArray(this.next, i * 3 * 2 + 3);
            } else {
                p.toArray(this.prev, (i + 1) * 3 * 2);
                p.toArray(this.prev, (i + 1) * 3 * 2 + 3);
            }
        });

        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.prev.needsUpdate = true;
        this.geometry.attributes.next.needsUpdate = true;
    }

    destroy() {
        this.material.dispose();
        this.geometry.dispose();

        for (const prop in this) {
            this[prop] = null;
        }

        return null;
    }
}

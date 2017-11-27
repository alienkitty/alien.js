/**
 * Shader helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

import { Utils } from '../util/Utils';
import { Shaders } from './Shaders';
import { TweenManager } from '../tween/TweenManager';

class Shader {

    constructor(vertexShader, fragmentShader, props) {
        if (typeof fragmentShader !== 'string') {
            props = fragmentShader;
            fragmentShader = vertexShader;
        }
        const self = this;
        this.uniforms = {};
        this.properties = {};

        initProperties();
        initShaders();

        function initProperties() {
            for (let key in props) {
                if (typeof props[key].value !== 'undefined') self.uniforms[key] = props[key];
                else self.properties[key] = props[key];
            }
        }

        function initShaders() {
            const params = {};
            params.vertexShader = process(Shaders.getShader(vertexShader + '.vs') || vertexShader, 'vs');
            params.fragmentShader = process(Shaders.getShader(fragmentShader + '.fs') || fragmentShader, 'fs');
            params.uniforms = self.uniforms;
            for (let key in self.properties) params[key] = self.properties[key];
            self.material = new THREE.RawShaderMaterial(params);
            self.material.shader = self;
            self.uniforms = self.material.uniforms;
        }

        function process(code, type) {
            let header;
            if (type === 'vs') {
                header = [
                    'precision highp float;',
                    'precision highp int;',
                    'attribute vec2 uv;',
                    'attribute vec3 position;',
                    'attribute vec3 normal;',
                    'uniform mat4 modelViewMatrix;',
                    'uniform mat4 projectionMatrix;',
                    'uniform mat4 modelMatrix;',
                    'uniform mat4 viewMatrix;',
                    'uniform mat3 normalMatrix;',
                    'uniform vec3 cameraPosition;'
                ].join('\n');
            } else {
                header = [
                    ~code.indexOf('dFdx') ? '#extension GL_OES_standard_derivatives : enable' : '',
                    'precision highp float;',
                    'precision highp int;',
                    'uniform mat4 modelViewMatrix;',
                    'uniform mat4 projectionMatrix;',
                    'uniform mat4 modelMatrix;',
                    'uniform mat4 viewMatrix;',
                    'uniform mat3 normalMatrix;',
                    'uniform vec3 cameraPosition;'
                ].join('\n');
            }
            code = header + code;
            const threeChunk = (a, b) => {
                return THREE.ShaderChunk[b] + '\n';
            };
            return code.replace(/#s?chunk\(\s?(\w+)\s?\);/g, threeChunk);
        }
    }

    set(key, value) {
        TweenManager.clearTween(this.uniforms[key]);
        this.uniforms[key].value = value;
    }

    tween(key, value, time, ease, delay, callback, update) {
        return TweenManager.tween(this.uniforms[key], { value }, time, ease, delay, callback, update);
    }

    getValues() {
        const out = {};
        for (let key in this.uniforms) out[key] = this.uniforms[key].value;
        return out;
    }

    copyUniformsTo(object) {
        for (let key in this.uniforms) object.uniforms[key] = this.uniforms[key];
    }

    cloneUniformsTo(object) {
        for (let key in this.uniforms) object.uniforms[key] = { type: this.uniforms[key].type, value: this.uniforms[key].value };
    }

    destroy() {
        this.material.dispose();
        return Utils.nullObject(this);
    }
}

export { Shader };

/**
 * 3D utilities.
 *
 * Currently no CORS support.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

import { Images } from '../util/Images';

class Utils3D {

    constructor() {
        this.PATH = '';
        let objectLoader, geomLoader, bufferGeomLoader,
            textures = {};

        this.decompose = (local, world) => {
            local.matrixWorld.decompose(world.position, world.quaternion, world.scale);
        };

        this.createDebug = (size = 40, color) => {
            let geom = new THREE.IcosahedronGeometry(size, 1),
                mat = color ? new THREE.MeshBasicMaterial({ color }) : new THREE.MeshNormalMaterial();
            return new THREE.Mesh(geom, mat);
        };

        this.createRT = (width, height) => {
            let params = {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                stencilBuffer: false
            };
            return new THREE.WebGLRenderTarget(width, height, params);
        };

        this.getTexture = src => {
            if (!textures[src]) {
                let img = Images.createImg(this.PATH + src),
                    texture = new THREE.Texture(img);
                img.onload = () => {
                    texture.needsUpdate = true;
                    if (texture.onload) {
                        texture.onload();
                        texture.onload = null;
                    }
                    if (!THREE.Math.isPowerOfTwo(img.width * img.height)) texture.minFilter = THREE.LinearFilter;
                };
                textures[src] = texture;
            }
            return textures[src];
        };

        this.setInfinity = v => {
            let inf = Number.POSITIVE_INFINITY;
            v.set(inf, inf, inf);
            return v;
        };

        this.freezeMatrix = mesh => {
            mesh.matrixAutoUpdate = false;
            mesh.updateMatrix();
        };

        this.getCubemap = src => {
            let path = 'cube_' + (Array.isArray(src) ? src[0] : src);
            if (!textures[path]) {
                let images = [];
                for (let i = 0; i < 6; i++) {
                    let img = Images.createImg(this.PATH + (Array.isArray(src) ? src[i] : src));
                    images.push(img);
                    img.onload = () => {
                        textures[path].needsUpdate = true;
                    };
                }
                textures[path] = new THREE.Texture();
                textures[path].image = images;
                textures[path].minFilter = THREE.LinearFilter;
            }
            return textures[path];
        };

        this.loadObject = data => {
            if (!objectLoader) objectLoader = new THREE.ObjectLoader();
            return objectLoader.parse(data);
        };

        this.loadGeometry = data => {
            if (!geomLoader) geomLoader = new THREE.JSONLoader();
            if (!bufferGeomLoader) bufferGeomLoader = new THREE.BufferGeometryLoader();
            if (data.type === 'BufferGeometry') return bufferGeomLoader.parse(data);
            else return geomLoader.parse(data.data).geometry;
        };

        this.disposeAllTextures = () => {
            for (let key in textures) textures[key].dispose();
        };

        this.loadBufferGeometry = data => {
            let geometry = new THREE.BufferGeometry();
            if (data.data) data = data.data;
            geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(data.position), 3));
            geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(data.normal || data.position.length), 3));
            geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(data.uv || data.position.length / 3 * 2), 2));
            return geometry;
        };

        this.loadSkinnedGeometry = data => {
            let geometry = new THREE.BufferGeometry();
            geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(data.position), 3));
            geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(data.normal), 3));
            geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(data.uv), 2));
            geometry.addAttribute('skinIndex', new THREE.BufferAttribute(new Float32Array(data.skinIndices), 4));
            geometry.addAttribute('skinWeight', new THREE.BufferAttribute(new Float32Array(data.skinWeights), 4));
            geometry.bones = data.bones;
            return geometry;
        };

        this.loadCurve = data => {
            let points = [];
            for (let i = 0; i < data.length; i += 3) points.push(new THREE.Vector3(data[i + 0], data[i + 1], data[i + 2]));
            return new THREE.CatmullRomCurve3(points);
        };

        this.setLightCamera = (light, size, near, far, texture) => {
            light.shadow.camera.left = -size;
            light.shadow.camera.right = size;
            light.shadow.camera.top = size;
            light.shadow.camera.bottom = -size;
            light.castShadow = true;
            if (near) light.shadow.camera.near = near;
            if (far) light.shadow.camera.far = far;
            if (texture) light.shadow.mapSize.width = light.shadow.mapSize.height = texture;
            light.shadow.camera.updateProjectionMatrix();
        };

        this.getRepeatTexture = src => {
            let texture = this.getTexture(src);
            texture.onload = () => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            };
            return texture;
        };
    }
}

export { Utils3D };

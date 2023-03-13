// Based on https://github.com/pmndrs/drei/blob/master/src/core/MeshTransmissionMaterial.tsx by N8python

import { Color, MeshPhysicalMaterial } from 'three';

export class TransmissionMaterial extends MeshPhysicalMaterial {
    constructor({
        chromaticAberration = 0.05,
        anisotropy = 0.1,
        transmissionSampler = false,
        samples = 10,
        buffer = null,
        ...parameters
    } = {}) {
        super(parameters);

        const uniforms = {
            chromaticAberration: { value: chromaticAberration },
            // Transmission must always be 0, unless transmissionSampler is being used
            transmission: { value: transmissionSampler ? parameters.transmission : 0 },
            // Instead a workaround is used, see below for reasons why
            _transmission: { value: parameters.transmission },
            transmissionMap: { value: null },
            // Roughness is 1 in MeshPhysicalMaterial but it makes little sense in a transmission material
            roughness: { value: 0 },
            thickness: { value: parameters.thickness },
            thicknessMap: { value: null },
            attenuationDistance: { value: Infinity },
            attenuationColor: { value: new Color() },
            anisotropy: { value: anisotropy },
            buffer: { value: buffer }
        };

        this.onBeforeCompile = shader => {
            shader.uniforms = Object.assign(shader.uniforms, uniforms);

            // If the transmission sampler is active inject a flag
            if (transmissionSampler) shader.defines.USE_SAMPLER = '';
            // Otherwise we do use use .transmission and must therefore force USE_TRANSMISSION
            // because threejs won't inject it for us
            else shader.defines.USE_TRANSMISSION = '';

            // Head
            shader.fragmentShader =
                /* glsl */ `
                uniform float chromaticAberration;
                uniform float anisotropy;
                uniform sampler2D buffer;

                float seed = 0.0;
                uint hash( uint x ) {
                    x += ( x << 10u );
                    x ^= ( x >>  6u );
                    x += ( x <<  3u );
                    x ^= ( x >> 11u );
                    x += ( x << 15u );
                    return x;
                }

                // Compound versions of the hashing algorithm I whipped together.
                uint hash( uvec2 v ) { return hash( v.x ^ hash(v.y)                         ); }
                uint hash( uvec3 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z)             ); }
                uint hash( uvec4 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z) ^ hash(v.w) ); }

                // Construct a float with half-open range [0:1] using low 23 bits.
                // All zeroes yields 0.0, all ones yields the next smallest representable value below 1.0.
                float floatConstruct( uint m ) {
                    const uint ieeeMantissa = 0x007FFFFFu; // binary32 mantissa bitmask
                    const uint ieeeOne      = 0x3F800000u; // 1.0 in IEEE binary32
                    m &= ieeeMantissa;                     // Keep only mantissa bits (fractional part)
                    m |= ieeeOne;                          // Add fractional part to 1.0
                    float  f = uintBitsToFloat( m );       // Range [1:2]
                    return f - 1.0;                        // Range [0:1]
                }

                // Pseudo-random value in half-open range [0:1].
                float random( float x ) { return floatConstruct(hash(floatBitsToUint(x))); }
                float random( vec2  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
                float random( vec3  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
                float random( vec4  v ) { return floatConstruct(hash(floatBitsToUint(v))); }

                float rand() {
                    float result = random(vec3(gl_FragCoord.xy, seed));
                    seed += 1.0;
                    return result;
                }
                ` + shader.fragmentShader;

            // Remove transmission
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <transmission_pars_fragment>',
                /* glsl */ `
                #ifdef USE_TRANSMISSION
                    // Transmission code is based on glTF-Sampler-Viewer
                    // https://github.com/KhronosGroup/glTF-Sample-Viewer
                    uniform float _transmission;
                    uniform float thickness;
                    uniform float attenuationDistance;
                    uniform vec3 attenuationColor;
                    #ifdef USE_TRANSMISSIONMAP
                        uniform sampler2D transmissionMap;
                    #endif
                    #ifdef USE_THICKNESSMAP
                        uniform sampler2D thicknessMap;
                    #endif
                    uniform vec2 transmissionSamplerSize;
                    uniform sampler2D transmissionSamplerMap;
                    uniform mat4 modelMatrix;
                    uniform mat4 projectionMatrix;
                    varying vec3 vWorldPosition;
                    vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
                        // Direction of refracted light.
                        vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
                        // Compute rotation-independant scaling of the model matrix.
                        vec3 modelScale;
                        modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
                        modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
                        modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
                        // The thickness is specified in local space.
                        return normalize( refractionVector ) * thickness * modelScale;
                    }
                    float applyIorToRoughness( const in float roughness, const in float ior ) {
                        // Scale roughness with IOR so that an IOR of 1.0 results in no microfacet refraction and
                        // an IOR of 1.5 results in the default amount of microfacet refraction.
                        return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
                    }
                    vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
                        float framebufferLod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
                        #ifdef USE_SAMPLER
                            #ifdef texture2DLodEXT
                                return texture2DLodEXT(transmissionSamplerMap, fragCoord.xy, framebufferLod);
                            #else
                                return texture2D(transmissionSamplerMap, fragCoord.xy, framebufferLod);
                            #endif
                        #else
                            return texture2D(buffer, fragCoord.xy);
                        #endif
                    }
                    vec3 applyVolumeAttenuation( const in vec3 radiance, const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
                        if ( isinf( attenuationDistance ) ) {
                            // Attenuation distance is +∞, i.e. the transmitted color is not attenuated at all.
                            return radiance;
                        } else {
                            // Compute light attenuation using Beer's law.
                            vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
                            vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance ); // Beer's law
                            return transmittance * radiance;
                        }
                    }
                    vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
                        const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
                        const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
                        const in vec3 attenuationColor, const in float attenuationDistance ) {
                        vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
                        vec3 refractedRayExit = position + transmissionRay;
                        // Project refracted vector on the framebuffer, while mapping to normalized device coordinates.
                        vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
                        vec2 refractionCoords = ndcPos.xy / ndcPos.w;
                        refractionCoords += 1.0;
                        refractionCoords /= 2.0;
                        // Sample framebuffer to get pixel the refracted ray hits.
                        vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
                        vec3 attenuatedColor = applyVolumeAttenuation( transmittedLight.rgb, length( transmissionRay ), attenuationColor, attenuationDistance );
                        // Get the specular component.
                        vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
                        return vec4( ( 1.0 - F ) * attenuatedColor * diffuseColor, transmittedLight.a );
                    }
                #endif
                `
            );

            // Add refraction
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <transmission_fragment>',
                /* glsl */ `
                // Improve the refraction to use the world pos
                material.transmission = _transmission;
                material.transmissionAlpha = 1.0;
                material.thickness = thickness;
                material.attenuationDistance = attenuationDistance;
                material.attenuationColor = attenuationColor;
                #ifdef USE_TRANSMISSIONMAP
                    material.transmission *= texture2D( transmissionMap, vUv ).r;
                #endif
                #ifdef USE_THICKNESSMAP
                    material.thickness *= texture2D( thicknessMap, vUv ).g;
                #endif

                vec3 pos = vWorldPosition;
                vec3 v = normalize( cameraPosition - pos );
                vec3 n = inverseTransformDirection( normal, viewMatrix );
                vec3 transmission = vec3(0.0);
                float transmissionR, transmissionB, transmissionG;
                float randomCoords = rand();
                float thickness_smear = thickness * max(pow(roughnessFactor, 0.33), anisotropy);
                for (float i = 0.0; i < ${samples}.0; i ++) {
                    vec3 sampleNorm = normalize(n + roughnessFactor * roughnessFactor * 2.0 * normalize(vec3(rand() - 0.5, rand() - 0.5, rand() - 0.5)) * pow(rand(), 0.33));
                    transmissionR = getIBLVolumeRefraction(
                        sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
                        pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness  + thickness_smear * (i + randomCoords) / float(${samples}),
                        material.attenuationColor, material.attenuationDistance
                    ).r;
                    transmissionG = getIBLVolumeRefraction(
                        sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
                        pos, modelMatrix, viewMatrix, projectionMatrix, material.ior  * (1.0 + chromaticAberration * (i + randomCoords) / float(${samples})) , material.thickness + thickness_smear * (i + randomCoords) / float(${samples}),
                        material.attenuationColor, material.attenuationDistance
                    ).g;
                    transmissionB = getIBLVolumeRefraction(
                        sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
                        pos, modelMatrix, viewMatrix, projectionMatrix, material.ior * (1.0 + 2.0 * chromaticAberration * (i + randomCoords) / float(${samples})), material.thickness + thickness_smear * (i + randomCoords) / float(${samples}),
                        material.attenuationColor, material.attenuationDistance
                    ).b;
                    transmission.r += transmissionR;
                    transmission.g += transmissionG;
                    transmission.b += transmissionB;
                }
                transmission /= ${samples}.0;
                totalDiffuse = mix( totalDiffuse, transmission.rgb, material.transmission );
                `
            );
        };

        Object.keys(uniforms).forEach(name =>
            Object.defineProperty(this, name, {
                get() {
                    return uniforms[name].value;
                },
                set(value) {
                    uniforms[name].value = value;
                }
            })
        );
    }
}

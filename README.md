# Alien.js

[![NPM Package][npm]][npm-url]
[![NPM Downloads][npm-downloads]][npmtrends-url]
[![DeepScan][deepscan]][deepscan-url]
[![Discord][discord]][discord-url]

This library is part of two sibling libraries, [Space.js](https://github.com/alienkitty/space.js) for UI, Panel components, Tween, Web Audio, loaders, utilities, and [Alien.js](https://github.com/alienkitty/alien.js) for 3D utilities, materials, shaders and physics.

<p>
    <img src="https://github.com/alienkitty/alien.js/raw/main/alien.js.png" alt="Alien.js">
</p>

### Usage

Alien.js is divided into three entry points depending on your use case.

The `@alienkitty/alien.js/three` entry point for [three.js](https://github.com/mrdoob/three.js) utilities and materials.

```sh
npm i three @alienkitty/alien.js
```

```js
import { Vector3 } from 'three';
import { Wobble } from '@alienkitty/alien.js/three';

const position = new Vector3();
const wobble = new Wobble(position);
wobble.scale = 100;

function animate(time) {
    requestAnimationFrame(animate);

    console.log(position);
    wobble.update(time * 0.001 * 0.5); // seconds * 0.5
}

requestAnimationFrame(animate);
```

The `@alienkitty/alien.js/three/oimophysics` entry point for [OimoPhysics](https://github.com/saharan/OimoPhysics) utilities.

```sh
npm i three saharan/OimoPhysics#v1.2.3 @alienkitty/alien.js
```

```js
import { OimoPhysics } from '@alienkitty/alien.js/three/oimophysics';

const physics = new OimoPhysics();
console.log(physics.world.getGravity());
```

And the `@alienkitty/alien.js/ogl` entry point for [OGL](https://github.com/oframe/ogl) material programs.

```sh
npm i ogl @alienkitty/alien.js
```

```js
import { FXAAProgram } from '@alienkitty/alien.js/ogl';

// ...
const program = new FXAAProgram(gl);
```

### Examples

#### transitions

[page](https://alien.js.org/examples/three/transitions/page/)  
[canvas](https://alien.js.org/examples/three/transitions/canvas/) (mask)  
[shader](https://alien.js.org/examples/three/transitions/shader/) (mask)  
[shader](https://alien.js.org/examples/three/transitions/shader_fade/) (fade with RGB shift)  
[scene](https://alien.js.org/examples/three/transitions/scene/)  
[scene](https://alien.js.org/examples/three/transitions/scene_direction/) (page direction and camera parallax)  
[scroll](https://alien.js.org/examples/three/transitions/scroll/) ([debug](https://alien.js.org/examples/three/transitions/scroll/?debug))  
[scroll](https://alien.js.org/examples/three/transitions/scroll_direction/) (scroll direction and camera parallax, [debug](https://alien.js.org/examples/three/transitions/scroll_direction/?debug))  
[scroll](https://alien.js.org/examples/three/transitions/scroll_direction_zoom/) (scroll direction and camera zoom, [debug](https://alien.js.org/examples/three/transitions/scroll_direction_zoom/?debug))  
[scroll](https://alien.js.org/examples/three/transitions/scroll_content/) (smooth scroll, [debug](https://alien.js.org/examples/three/transitions/scroll_content/?debug))  
[scroll](https://alien.js.org/examples/three/transitions/scroll_content_skew/) (smooth scroll with skew effect, [debug](https://alien.js.org/examples/three/transitions/scroll_content_skew/?debug))  
[scroll](https://alien.js.org/examples/three/transitions/scroll_content_views/) (smooth scroll with scroll direction and camera parallax, [debug](https://alien.js.org/examples/three/transitions/scroll_content_views/?debug))  
[camera](https://alien.js.org/examples/three/transitions/camera/) (with motion blur and tilt shift effect, [debug](https://alien.js.org/examples/three/transitions/camera/?debug))  

#### 3d

[ripple](https://alien.js.org/examples/three/3d_ripple.html)  
[cubemap uv](https://alien.js.org/examples/three/3d_cubemap_uv.html)  
[spherical cube uv](https://alien.js.org/examples/three/3d_spherical_cube_uv.html)  
[penrose triangle](https://alien.js.org/examples/three/3d_penrose_triangle.html)  
[abstract cube](https://alien.js.org/examples/three/3d_abstract_cube.html)  
[polyhedron](https://alien.js.org/examples/three/3d_polyhedron.html) (orbit camera, [debug](https://alien.js.org/examples/three/3d_polyhedron.html?debug))  
[crystal gltf](https://alien.js.org/examples/three/3d_crystal_gltf.html) (orbit camera, [debug](https://alien.js.org/examples/three/3d_crystal_gltf.html?debug), [orbit controls](https://alien.js.org/examples/three/3d_crystal_gltf.html?orbit))  
[cubecamera](https://alien.js.org/examples/three/3d_cubecamera.html) (orbit camera, [debug](https://alien.js.org/examples/three/3d_cubecamera.html?debug))  
[cubecamera rainbow](https://alien.js.org/examples/three/3d_cubecamera_rainbow.html) (orbit camera, [debug](https://alien.js.org/examples/three/3d_cubecamera_rainbow.html?debug))  
[camera wobble](https://alien.js.org/examples/three/3d_camera_wobble.html)  
[panel tracking](https://alien.js.org/examples/three/3d_panel_tracking.html) ([debug](https://alien.js.org/examples/three/3d_panel_tracking.html?debug))  
[backdrop](https://alien.js.org/examples/three/3d_backdrop.html)  
[infinite stars](https://alien.js.org/examples/three/3d_infinite_stars_rgbshift.html) (RGB shift, [debug](https://alien.js.org/examples/three/3d_infinite_stars_rgbshift.html?debug))  
[stripe gradient](https://alien.js.org/examples/three/3d_stripe_gradient.html) ([akella version](https://www.youtube.com/watch?v=LW9d2cqIHb4))  

#### shader

[noise](https://alien.js.org/examples/three/shader_noise.html)  
[fxaa](https://alien.js.org/examples/three/shader_fxaa.html)  
[fxaa](https://alien.js.org/examples/ogl/shader_fxaa.html) (OGL version)  
[smaa](https://alien.js.org/examples/three/shader_smaa.html)  
[blur](https://alien.js.org/examples/three/shader_blur.html) (Gaussian blur)  
[blur](https://alien.js.org/examples/three/shader_poisson_disc_blur.html) (Poisson disc blur)  
[blur](https://alien.js.org/examples/three/shader_bokeh_blur.html) (Bokeh blur)  
[bloom](https://alien.js.org/examples/three/shader_bloom.html)  
[bloom](https://alien.js.org/examples/three/shader_unreal_bloom.html) (Unreal bloom)  
[bloom](https://alien.js.org/examples/three/shader_bloom_dither.html) (Unreal bloom with dither)  
[bloom](https://alien.js.org/examples/three/shader_bloom_hdr.html) (Unreal bloom with HDR)  
[matcap](https://alien.js.org/examples/three/shader_matcap.html)  
[soft particles](https://alien.js.org/examples/three/shader_soft_particles.html)  
[tilt shift](https://alien.js.org/examples/three/shader_tilt_shift.html) (with Gaussian blur)  
[dof](https://alien.js.org/examples/three/shader_dof_fake.html) (fake with Bokeh blur, [debug](https://alien.js.org/examples/three/shader_dof_fake.html?debug))  
[chromatic aberration](https://alien.js.org/examples/three/shader_chromatic_aberration.html)  
[barrel distortion](https://alien.js.org/examples/three/shader_barrel_distortion.html) (RGB shift)  
[radial blur](https://alien.js.org/examples/three/shader_radial_blur_rgbshift.html) (RGB shift)  
[film grain](https://alien.js.org/examples/three/shader_film_grain.html)  
[reflection](https://alien.js.org/examples/three/shader_reflection.html) (with fast Gaussian blur)  
[reflection](https://alien.js.org/examples/three/shader_reflection_diffuse.html) (diffuse)  
[reflection](https://alien.js.org/examples/three/shader_reflection_metalness.html) (metalness)  
[reflection](https://alien.js.org/examples/three/shader_reflection_normalmap.html) (normalmap)  
[reflection](https://alien.js.org/examples/three/shader_reflection_dudv.html) (DuDv)  
[flowmap](https://alien.js.org/examples/three/shader_flowmap.html)  
[flowmap](https://alien.js.org/examples/three/shader_flowmap_rgbshift.html) (RGB shift)  
[flowmap](https://alien.js.org/examples/three/shader_flowmap_view.html) (view)  
[fluid distortion](https://alien.js.org/examples/three/shader_fluid_distortion.html)  
[fluid distortion](https://alien.js.org/examples/three/shader_fluid_distortion_rgbshift.html) (RGB shift)  
[fluid distortion](https://alien.js.org/examples/three/shader_fluid_distortion_view.html) (view)  
[depth](https://alien.js.org/examples/three/shader_depth.html) (aperture with dither)  
[fresnel](https://alien.js.org/examples/three/shader_fresnel.html) (with looping noise)  
[hologram](https://alien.js.org/examples/three/shader_hologram.html)  
[subsurface scattering](https://alien.js.org/examples/three/shader_subsurface_scattering.html) (SSS)  
[volumetric light](https://alien.js.org/examples/three/shader_volumetric_light.html) (god rays)  
[anamorphic light](https://alien.js.org/examples/three/shader_anamorphic_light.html) (fast anamorphic lens flares)  
[lensflare](https://alien.js.org/examples/three/shader_lensflare.html)  
[lensflare](https://alien.js.org/examples/three/shader_anamorphic_light_lensflare.html) (with anamorphic light)  
[baked cube](https://alien.js.org/examples/three/shader_baked_cube.html)  
[baked cube](https://alien.js.org/examples/three/shader_baked_cube_dudv.html) (DuDv)  
[baked cube](https://alien.js.org/examples/three/shader_baked_cube_sss.html) (SSS, [debug](https://alien.js.org/examples/three/shader_baked_cube_sss.html?debug))  
[baked abstract cube](https://alien.js.org/examples/three/shader_baked_abstract_cube.html)  
[baked abstract cube](https://alien.js.org/examples/three/shader_baked_abstract_cube_dudv.html) (DuDv)  
[baked abstract cube](https://alien.js.org/examples/three/shader_baked_abstract_cube_sss.html) (SSS, [debug](https://alien.js.org/examples/three/shader_baked_abstract_cube_sss.html?debug))  
[baked spherical cube](https://alien.js.org/examples/three/shader_baked_spherical_cube.html)  
[baked spherical cube](https://alien.js.org/examples/three/shader_baked_spherical_cube_dudv.html) (DuDv)  
[baked spherical cube](https://alien.js.org/examples/three/shader_baked_spherical_cube_sss.html) (SSS, [debug](https://alien.js.org/examples/three/shader_baked_spherical_cube_sss.html?debug))  
[soft shadows](https://alien.js.org/examples/three/shader_soft_shadows.html)  
[text](https://alien.js.org/examples/three/shader_text.html) (MSDF text)  
[afterimage](https://alien.js.org/examples/three/shader_afterimage.html)  
[alienkitty](https://alienkitty.com/) (2d scene, flowmap with RGB shift, MSDF text)  

#### physics

[instancing](https://alien.js.org/examples/three/3d_physics_instancing.html) (SSS, [debug](https://alien.js.org/examples/three/3d_physics_instancing.html?debug))  
[instancing](https://alien.js.org/examples/three/3d_physics_instancing_thread.html) (physics thread, SSS, [debug](https://alien.js.org/examples/three/3d_physics_instancing_thread.html?debug))  
[picking](https://alien.js.org/examples/three/3d_physics_picking.html) (contact audio, SSS, [debug](https://alien.js.org/examples/three/3d_physics_picking.html?debug))  
[picking](https://alien.js.org/examples/three/3d_physics_picking_thread.html) (physics thread, contact audio, SSS, [debug](https://alien.js.org/examples/three/3d_physics_picking_thread.html?debug))  

#### audio

[picking](https://alien.js.org/examples/three/3d_physics_picking.html) (with fast 3d audio, [debug](https://alien.js.org/examples/three/3d_physics_picking.html?debug))  

#### thread

[cubemap uv](https://alien.js.org/examples/three/3d_cubemap_uv.html) (texture and buffer geometry loader thread)  
[instancing](https://alien.js.org/examples/three/3d_physics_instancing_thread.html) (physics thread)  
[picking](https://alien.js.org/examples/three/3d_physics_picking_thread.html) (physics thread)  
[multiuser blocks](https://multiuser-blocks.glitch.me/) (websocket thread, [glitch](https://glitch.com/edit/#!/multiuser-blocks))  

#### websockets

[json](https://hello-websockets-json.glitch.me/) ([glitch](https://glitch.com/edit/#!/hello-websockets-json))  
[binary](https://hello-websockets-binary.glitch.me/) ([glitch](https://glitch.com/edit/#!/hello-websockets-binary))  
[multiuser fluid](https://multiuser-fluid.glitch.me/) (binary, [glitch](https://glitch.com/edit/#!/multiuser-fluid))  
[multiuser blocks](https://multiuser-blocks.glitch.me/) (binary, [glitch](https://glitch.com/edit/#!/multiuser-blocks))  

### Getting started

Clone this repository and install its dependencies:

```sh
git clone https://github.com/alienkitty/alien.js
cd alien.js
npm i three saharan/OimoPhysics#v1.2.3
cd examples
npm i
npm run build
npm start
```

### ESLint

```sh
npm i -D eslint eslint-plugin-html
npx eslint src
npx eslint examples/about/src
npx eslint examples/ogl/*.html
npx eslint examples/three/*.html
npx eslint examples/three/transitions
```

### Resources

* [The Wiki](https://github.com/alienkitty/alien.js/wiki)
* [Tween](https://github.com/alienkitty/alien.js/wiki/Tween)
* [Changelog](https://github.com/alienkitty/alien.js/releases)

### See also

* [Space.js](https://github.com/alienkitty/space.js)
* [Three.js](https://github.com/mrdoob/three.js)
* [Post Processing](https://github.com/pmndrs/postprocessing)
* [OGL](https://github.com/oframe/ogl)


[npm]: https://img.shields.io/npm/v/@alienkitty/alien.js
[npm-url]: https://www.npmjs.com/package/@alienkitty/alien.js
[npm-downloads]: https://img.shields.io/npm/dw/@alienkitty/alien.js
[npmtrends-url]: https://www.npmtrends.com/@alienkitty/alien.js
[deepscan]: https://deepscan.io/api/teams/20020/projects/23996/branches/734567/badge/grade.svg
[deepscan-url]: https://deepscan.io/dashboard#view=project&tid=20020&pid=23996&bid=734567
[discord]: https://img.shields.io/discord/773739853913260032
[discord-url]: https://discord.gg/9rSkAzB7PM

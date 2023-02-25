# Alien.js

[![NPM Package][npm]][npm-url]
[![DeepScan][deepscan]][deepscan-url]

This library is part of two sibling libraries, [Space.js](https://github.com/pschroen/space.js) for UI, Panel components, Tween, Web Audio, loaders, utilities, and [Alien.js](https://github.com/pschroen/alien.js) for 3D utilities, materials, shaders and physics.

<p>
    <img src="https://github.com/pschroen/alien.js/raw/main/alien.js.png" alt="Alien.js">
</p>

### Usage

Alien.js is divided into two entry points depending on your use case.

The `alien.js/three` entry point for [three](https://github.com/mrdoob/three.js) custom [utilities](src/utils/three) and [materials](src/materials/three).

```sh
npm i three alien.js
```

```js
import { Wobble } from 'alien.js/three';
```

And the `alien.js/three/oimophysics` entry point for [oimophysics](https://github.com/saharan/OimoPhysics) custom [utilities](src/utils/three/physics).

```sh
npm i three saharan/OimoPhysics#v1.2.3 alien.js
```

```js
import { OimoPhysics } from 'alien.js/three/oimophysics';
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
[panel tracking crystals](https://alien.js.org/examples/three/3d_panel_tracking_crystals.html) ([debug](https://alien.js.org/examples/three/3d_panel_tracking_crystals.html?debug))  
[crystals](https://alien.js.org/examples/three/3d_crystals.html) ([orbit controls](https://alien.js.org/examples/three/3d_crystals.html?orbit))  
[dark crystals](https://alien.js.org/examples/three/3d_dark_crystals.html) ([orbit controls](https://alien.js.org/examples/three/3d_dark_crystals.html?orbit))  

#### shader

[noise](https://alien.js.org/examples/three/shader_noise.html)  
[fxaa](https://alien.js.org/examples/three/shader_fxaa.html)  
[blur](https://alien.js.org/examples/three/shader_blur.html) (Gaussian blur)  
[blur](https://alien.js.org/examples/three/shader_poisson_disc_blur.html) (Poisson disc blur)  
[blur](https://alien.js.org/examples/three/shader_bokeh_blur.html) (Bokeh blur)  
[bloom](https://alien.js.org/examples/three/shader_bloom.html)  
[bloom](https://alien.js.org/examples/three/shader_unreal_bloom.html) (Unreal bloom)  
[bloom](https://alien.js.org/examples/three/shader_bloom_dither.html) (Unreal bloom with dither)  
[matcap](https://alien.js.org/examples/three/shader_matcap.html)  
[pbr](https://alien.js.org/examples/three/shader_pbr.html)  
[soft particles](https://alien.js.org/examples/three/shader_soft_particles.html)  
[tilt shift](https://alien.js.org/examples/three/shader_tilt_shift.html) (with Gaussian blur)  
[dof](https://alien.js.org/examples/three/shader_dof_fake.html) (fake with Bokeh blur, [debug](https://alien.js.org/examples/three/shader_dof_fake.html?debug))  
[chromatic aberration](https://alien.js.org/examples/three/shader_chromatic_aberration.html)  
[film grain](https://alien.js.org/examples/three/shader_film_grain.html)  
[reflection](https://alien.js.org/examples/three/shader_reflection.html) (with fast Gaussian blur)  
[reflection diffuse](https://alien.js.org/examples/three/shader_reflection_diffuse.html) (physically based material)  
[reflection metalness](https://alien.js.org/examples/three/shader_reflection_metalness.html) (physically based material)  
[reflection normalmap](https://alien.js.org/examples/three/shader_reflection_normalmap.html) (physically based material)  
[reflection dudv](https://alien.js.org/examples/three/shader_reflection_dudv.html) (DuDv)  
[flowmap](https://alien.js.org/examples/three/shader_flowmap.html)  
[flowmap](https://alien.js.org/examples/three/shader_flowmap_rgbshift.html) (RGB shift)  
[flowmap](https://alien.js.org/examples/three/shader_flowmap_view.html) (view)  
[depth](https://alien.js.org/examples/three/shader_depth.html) (fragment depth with dither)  
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
[transition](https://alien.js.org/examples/three/transitions/shader/) (mask)  
[transition](https://alien.js.org/examples/three/transitions/shader_fade/) (fade with RGB shift)  
[transition](https://alien.js.org/examples/three/transitions/scene/) (scene)  
[transition](https://alien.js.org/examples/three/transitions/scene_direction/) (scene with page direction and camera parallax)  
[transition](https://alien.js.org/examples/three/transitions/scroll/) (scroll, [debug](https://alien.js.org/examples/three/transitions/scroll/?debug))  
[transition](https://alien.js.org/examples/three/transitions/scroll_direction/) (scroll direction and camera parallax, [debug](https://alien.js.org/examples/three/transitions/scroll_direction/?debug))  
[transition](https://alien.js.org/examples/three/transitions/scroll_direction_zoom/) (scroll direction and camera zoom, [debug](https://alien.js.org/examples/three/transitions/scroll_direction_zoom/?debug))  
[camera transition](https://alien.js.org/examples/three/transitions/camera/) (with motion blur and tilt shift effect, [debug](https://alien.js.org/examples/three/transitions/camera/?debug))  
[alienkitty](https://alienkitty.com/) (2d scene, flowmap with RGB shift, MSDF text)  

#### physics

[instancing](https://alien.js.org/examples/three/3d_physics_instancing.html) (SSS, [debug](https://alien.js.org/examples/three/3d_physics_instancing.html?debug))  
[instancing](https://alien.js.org/examples/three/3d_physics_instancing_thread.html) (physics thread, SSS, [debug](https://alien.js.org/examples/three/3d_physics_instancing_thread.html?debug))  
[picking](https://alien.js.org/examples/three/3d_physics_picking.html) (contact audio, SSS, [debug](https://alien.js.org/examples/three/3d_physics_picking.html?debug))  
[picking](https://alien.js.org/examples/three/3d_physics_picking_thread.html) (physics thread, contact audio, SSS, [debug](https://alien.js.org/examples/three/3d_physics_picking_thread.html?debug))  

#### audio

[picking](https://alien.js.org/examples/three/3d_physics_picking.html) (with fast 3d audio, [debug](https://alien.js.org/examples/three/3d_physics_picking.html?debug))  

#### thread

[pbr](https://alien.js.org/examples/three/shader_pbr.html) (texture loader thread)  
[cubemap uv](https://alien.js.org/examples/three/3d_cubemap_uv.html) (buffer geometry loader thread)  
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
git clone https://github.com/pschroen/alien.js
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
npx eslint examples/three/*.html
npx eslint examples/three/transitions
```

### Resources

* [The Wiki](https://github.com/pschroen/alien.js/wiki)
* [Tween](https://github.com/pschroen/alien.js/wiki/Tween)
* [Changelog](https://github.com/pschroen/alien.js/releases)

### See also

* [Space.js](https://github.com/pschroen/space.js)
* [Three.js](https://github.com/mrdoob/three.js)
* [Post Processing](https://github.com/pmndrs/postprocessing)
* [OGL](https://github.com/oframe/ogl)


[npm]: https://img.shields.io/npm/v/alien.js
[npm-url]: https://www.npmjs.com/package/alien.js
[deepscan]: https://deepscan.io/api/teams/20020/projects/23464/branches/733363/badge/grade.svg
[deepscan-url]: https://deepscan.io/dashboard#view=project&tid=20020&pid=23464&bid=733363

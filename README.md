<p align="center">
    <img src="https://github.com/pschroen/alien.js/raw/master/examples/assets/images/alienkitty.png" alt="Alien.js" width="510">
</p>

<h1 align="center">Alien.js</h1>

<p align="center">
    <a href="https://www.npmjs.com/package/alien.js">
        <img src="https://img.shields.io/npm/v/alien.js" alt="NPM Package">
    </a>
    <a href="https://lgtm.com/projects/g/pschroen/alien.js">
        <img src="https://img.shields.io/lgtm/alerts/github/pschroen/alien.js" alt="Security Status">
    </a>
</p>

<p align="center"><b>Future web pattern</b></p>

<br>

Alien.js is a [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) design pattern for building [single-page applications](https://en.wikipedia.org/wiki/Single-page_application) with ES modules and [three.js](https://threejs.org/).

The idea is to keep it simple, with minimal abstraction, and to build websites more like a framework, which is why [rollup.js](https://rollupjs.org/) is used instead for bundling.

In its design, everything is an ES module, all user interfaces and components follow the same class structure, making it easy to copy-paste from examples and between projects.

*Note this design pattern intentionally does not use underscores or private fields, in favour of cleaner code.*

### Examples

#### ui

[logo](https://alien.js.org/examples/ui_logo.html) (interface)  
[progress](https://alien.js.org/examples/ui_progress_canvas.html) (canvas)  
[progress](https://alien.js.org/examples/ui_progress.html) (svg)  
[progress indeterminate](https://alien.js.org/examples/ui_progress_indeterminate.html) (svg)  
[close](https://alien.js.org/examples/ui_close.html) (svg)  
[magnetic](https://alien.js.org/examples/ui_magnetic.html) (component, svg)  
[tilt](https://alien.js.org/examples/ui_tilt.html)  
[ufo](https://ufo.ai/) (2d scene, smooth scroll with skew effect)  

#### 3d

[ripple](https://alien.js.org/examples/3d_ripple.html)  
[cubemap uv](https://alien.js.org/examples/3d_cubemap_uv.html)  
[spherical cube uv](https://alien.js.org/examples/3d_spherical_cube_uv.html)  
[penrose triangle](https://alien.js.org/examples/3d_penrose_triangle.html)  
[polyhedron](https://alien.js.org/examples/3d_polyhedron.html) (orbit camera, [debug](https://alien.js.org/examples/3d_polyhedron.html?debug))  
[cubecamera](https://alien.js.org/examples/3d_cubecamera.html) (orbit camera, [debug](https://alien.js.org/examples/3d_cubecamera.html?debug))  
[cubecamera rainbow](https://alien.js.org/examples/3d_cubecamera_rainbow.html) (orbit camera, [debug](https://alien.js.org/examples/3d_cubecamera_rainbow.html?debug))  
[camera wobble](https://alien.js.org/examples/3d_camera_wobble.html)  
[abstract cube](https://alien.js.org/examples/3d_abstract_cube.html)  

#### shader

[noise](https://alien.js.org/examples/shader_noise.html)  
[fxaa](https://alien.js.org/examples/shader_fxaa.html)  
[blur](https://alien.js.org/examples/shader_blur.html) (Gaussian blur)  
[blur](https://alien.js.org/examples/shader_poisson_disc_blur.html) (Poisson disc blur)  
[blur](https://alien.js.org/examples/shader_bokeh_blur.html) (Bokeh blur)  
[bloom](https://alien.js.org/examples/shader_bloom.html)  
[bloom](https://alien.js.org/examples/shader_unreal_bloom.html) (Unreal bloom)  
[bloom](https://alien.js.org/examples/shader_bloom_dither.html) (Unreal bloom with dither)  
[matcap](https://alien.js.org/examples/shader_matcap.html)  
[pbr](https://alien.js.org/examples/shader_pbr.html)  
[soft particles](https://alien.js.org/examples/shader_soft_particles.html)  
[tilt shift](https://alien.js.org/examples/shader_tilt_shift.html) (with Gaussian blur)  
[dof](https://alien.js.org/examples/shader_dof_fake.html) (fake with Bokeh blur, [debug](https://alien.js.org/examples/shader_dof_fake.html?debug))  
[chromatic aberration](https://alien.js.org/examples/shader_chromatic_aberration.html)  
[film grain](https://alien.js.org/examples/shader_film_grain.html)  
[reflection](https://alien.js.org/examples/shader_reflection.html) (with fast Gaussian blur)  
[reflection](https://alien.js.org/examples/shader_reflection_emissive.html) (physically based material)  
[reflection](https://alien.js.org/examples/shader_reflection_dudv.html) (DuDv)  
[flowmap](https://alien.js.org/examples/shader_flowmap.html)  
[flowmap](https://alien.js.org/examples/shader_flowmap_rgbshift.html) (RGB shift)  
[flowmap](https://alien.js.org/examples/shader_flowmap_view.html) (view)  
[depth](https://alien.js.org/examples/shader_depth.html) (fragment depth with dither)  
[fresnel](https://alien.js.org/examples/shader_fresnel.html) (with looping noise)  
[hologram](https://alien.js.org/examples/shader_hologram.html)  
[subsurface scattering](https://alien.js.org/examples/shader_subsurface_scattering.html) (SSS)  
[baked cube](https://alien.js.org/examples/shader_baked_cube.html)  
[baked cube](https://alien.js.org/examples/shader_baked_cube_dudv.html) (DuDv)  
[baked cube](https://alien.js.org/examples/shader_baked_cube_sss.html) (SSS, [debug](https://alien.js.org/examples/shader_baked_cube_sss.html?debug))  
[baked abstract cube](https://alien.js.org/examples/shader_baked_abstract_cube.html)  
[baked abstract cube](https://alien.js.org/examples/shader_baked_abstract_cube_dudv.html) (DuDv)  
[baked abstract cube](https://alien.js.org/examples/shader_baked_abstract_cube_sss.html) (SSS, [debug](https://alien.js.org/examples/shader_baked_abstract_cube_sss.html?debug))  
[baked spherical cube](https://alien.js.org/examples/shader_baked_spherical_cube.html)  
[baked spherical cube](https://alien.js.org/examples/shader_baked_spherical_cube_dudv.html) (DuDv)  
[baked spherical cube](https://alien.js.org/examples/shader_baked_spherical_cube_sss.html) (SSS, [debug](https://alien.js.org/examples/shader_baked_spherical_cube_sss.html?debug))  
[text](https://alien.js.org/examples/shader_text.html) (MSDF text)  
[alienkitty](https://alienkitty.com/) (2d scene, flowmap with RGB shift, MSDF text)  

#### physics

[instancing](https://alien.js.org/examples/3d_physics_instancing.html) (SSS, [debug](https://alien.js.org/examples/3d_physics_instancing.html?debug))  
[instancing](https://alien.js.org/examples/3d_physics_instancing_thread.html) (physics thread, SSS, [debug](https://alien.js.org/examples/3d_physics_instancing_thread.html?debug))  
[picking](https://alien.js.org/examples/3d_physics_picking.html) (contact audio, SSS, [debug](https://alien.js.org/examples/3d_physics_picking.html?debug))  
[picking](https://alien.js.org/examples/3d_physics_picking_thread.html) (physics thread, contact audio, SSS, [debug](https://alien.js.org/examples/3d_physics_picking_thread.html?debug))  

#### audio

[picking](https://alien.js.org/examples/3d_physics_picking.html) (with fast 3D audio)  

#### thread

[canvas](https://alien.js.org/examples/canvas_thread.html) (noise)  
[pbr](https://alien.js.org/examples/shader_pbr.html) (texture loader thread)  
[cubemap uv](https://alien.js.org/examples/3d_cubemap_uv.html) (buffer geometry loader thread)  
[instancing](https://alien.js.org/examples/3d_physics_instancing_thread.html) (physics thread)  
[picking](https://alien.js.org/examples/3d_physics_picking_thread.html) (physics thread)  

<br>

### Class structure

```js
import { Events } from '../config/Events.js';
import { Interface } from '../utils/Interface.js';
import { Stage } from '../controllers/Stage.js';

class Logo extends Interface {
    constructor() {
        super('.logo');

        this.initHTML();

        this.addListeners();
        this.onResize();
    }

    initHTML() {
        this.css({
            left: 50,
            top: 50,
            width: 64,
            height: 64,
            cursor: 'pointer',
            opacity: 0
        });

        this.image = new Interface(null, 'img');
        this.image.attr({ src: 'assets/images/alienkitty.svg' });
        this.image.css({
            position: 'relative',
            width: '100%'
        });
        this.add(this.image);
    }

    addListeners() {
        Stage.events.on(Events.RESIZE, this.onResize);
        this.element.addEventListener('mouseenter', this.onHover);
        this.element.addEventListener('mouseleave', this.onHover);
        this.element.addEventListener('click', this.onClick);
    }

    removeListeners() {
        Stage.events.off(Events.RESIZE, this.onResize);
        this.element.removeEventListener('mouseenter', this.onHover);
        this.element.removeEventListener('mouseleave', this.onHover);
        this.element.removeEventListener('click', this.onClick);
    }

    /**
     * Event handlers
     */

    onResize = () => {
        const { width, height } = Stage;

        if (width < height) {
            this.css({
                left: 30,
                top: 30,
                width: 40,
                height: 40
            });
        } else {
            this.css({
                left: 50,
                top: 50,
                width: 64,
                height: 64
            });
        }
    };

    onHover = ({ type }) => {
        this.clearTween();

        if (type === 'mouseenter') {
            this.tween({ opacity: 0.6 }, 300, 'easeOutCubic');
        } else {
            this.tween({ opacity: 1 }, 300, 'easeOutCubic');
        }
    };

    onClick = () => {
        // open('https://alien.js.org/');
        Stage.setPath('/');
    };

    /**
     * Public methods
     */

    animateIn = () => {
        this.tween({ opacity: 1 }, 600, 'easeInOutSine');
    };

    destroy = () => {
        this.removeListeners();

        return super.destroy();
    };
}
```

### Getting started

Clone this repository template and install its dependencies:

```sh
git clone https://github.com/pschroen/alien.js
cd alien.js
npm i three

# or
npx degit pschroen/alien.js my-app
cd my-app
npm i three
```

```sh
# Serve at localhost:8080
npm run dev

# Build for production
npm run build
```

### With UIL

Uncomment all the lines in `App.js`, and download the [uil](https://github.com/lo-th/uil) ES module:

```sh
mkdir src/lib
curl -L https://raw.githubusercontent.com/lo-th/uil/gh-pages/build/uil.module.js --output src/lib/uil.module.js
npm run dev
```

UIL is loaded dynamically and not part of the main bundle.

[localhost:8080/](http://localhost:8080/) (without uil)  
[localhost:8080/?ui](http://localhost:8080/?ui) (with uil)  
[localhost:8080/?ui&orbit](http://localhost:8080/?ui&orbit) (with uil and orbit controls)  
[localhost:8080/?orbit](http://localhost:8080/?orbit) (just orbit controls)

### With examples

```sh
npm i three oimophysics
cd examples
npm i
npm run build
npm start
```

### With ESLint

```sh
npm i -D eslint eslint-plugin-html @babel/eslint-parser
npx eslint src
npx eslint examples/*.html
npx eslint examples/about/src
```

### Resources

* [The Wiki](https://github.com/pschroen/alien.js/wiki)
* [Example project structure](https://github.com/pschroen/alien.js/wiki/Project-structure)
* [Tween](https://github.com/pschroen/alien.js/wiki/Tween)
* [Changelog](https://github.com/pschroen/alien.js/releases)

### See also

* [Three.js](https://github.com/mrdoob/three.js)
* [Post Processing](https://github.com/vanruesc/postprocessing)
* [OGL](https://github.com/oframe/ogl)

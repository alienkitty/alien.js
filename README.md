<p align="center">
    <img src="https://github.com/pschroen/alien.js/raw/master/examples/assets/images/alienkitty.png" alt="Alien.js" width="510">
</p>

<h1 align="center">Alien.js</h1>

<p align="center">
    <a href="https://npmjs.org/package/alien.js">
        <img src="https://img.shields.io/npm/v/alien.js.svg" alt="NPM Package">
    </a>
    <a href="https://travis-ci.org/pschroen/alien.js">
        <img src="https://travis-ci.org/pschroen/alien.js.svg" alt="Build Status">
    </a>
    <a href="https://david-dm.org/pschroen/alien.js">
        <img src="https://img.shields.io/david/pschroen/alien.js.svg" alt="Dependencies">
    </a>
    <a href="https://david-dm.org/pschroen/alien.js?type=dev">
        <img src="https://img.shields.io/david/dev/pschroen/alien.js.svg" alt="Dev Dependencies">
    </a>
</p>

<p align="center"><b>Future web pattern</b></p>

<br>

Alien.js is a design pattern for building [SPA](https://en.wikipedia.org/wiki/Single-page_application) websites with ES modules and [GSAP](https://greensock.com/).

The idea is to keep it simple, with minimal abstraction, and to build websites more like a framework, which is why [Rollup](https://rollupjs.org/) is used instead for bundling.

In its design, everything is an ES module, all user interfaces and components follow the same class structure, making it easy to copy-paste from examples and between projects.

*Note this design pattern intentionally does not use underscores or private fields, in favour of cleaner code.*

### Examples

#### ui

[logo](https://alien.js.org/examples/ui_logo.html)  
[logo](https://alien.js.org/examples/ui_logo_interface.html) (interface)  
[progress](https://alien.js.org/examples/ui_progress_canvas.html) (canvas)  
[progress](https://alien.js.org/examples/ui_progress.html) (svg)  
[progress indeterminate](https://alien.js.org/examples/ui_progress_indeterminate.html) (svg)  
[close](https://alien.js.org/examples/ui_close.html) (svg)  
[magnetic](https://alien.js.org/examples/ui_magnetic.html) (component, svg)  
[tilt](https://alien.js.org/examples/ui_tilt.html)  
[ufo](https://ufo.ai/)  

#### 3d

[ripple](https://alien.js.org/examples/3d_ripple.html)  
[physics](https://alien.js.org/examples/3d_physics_thread.html)  
[audio](https://alien.js.org/examples/3d_audio.html)  
[audio](https://alien.js.org/examples/3d_audio_fast.html) (fast)  
[spherical cube](https://alien.js.org/examples/3d_spherical_cube.html)  
[penrose triangle](https://alien.js.org/examples/3d_penrose_triangle.html)  
[polyhedron](https://alien.js.org/examples/3d_polyhedron.html) (orbit camera, [debug](https://alien.js.org/examples/3d_polyhedron.html?debug))  
[camera wobble](https://alien.js.org/examples/3d_camera_wobble.html)  
[camera shake](https://alien.js.org/examples/3d_camera_shake.html)  

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
[dof](https://alien.js.org/examples/shader_dof_fake.html) (fake with Bokeh blur, [debug](https://alien.js.org/examples/shader_dof_fake.html?debug))  
[chromatic aberration](https://alien.js.org/examples/shader_chromatic_aberration.html)  
[film grain](https://alien.js.org/examples/shader_film_grain.html)  
[reflection](https://alien.js.org/examples/shader_reflection.html) (with fast Gaussian blur)  
[flowmap](https://alien.js.org/examples/shader_flowmap.html)  
[flowmap](https://alien.js.org/examples/shader_flowmap_rgbshift.html) (RGB shift)  
[flowmap](https://alien.js.org/examples/shader_flowmap_view.html) (view)  
[depth](https://alien.js.org/examples/shader_depth.html) (fragment depth with dither)  
[hologram](https://alien.js.org/examples/shader_hologram.html)  
[text](https://alien.js.org/examples/shader_text.html) (MSDF text)  
[alienkitty](https://alienkitty.com/) (flowmap with RGB shift, MSDF text)  

#### thread

[canvas](https://alien.js.org/examples/canvas_thread.html) (noise)  
[physics](https://alien.js.org/examples/3d_physics_thread.html)  
[audio](https://alien.js.org/examples/3d_audio.html)  
[audio](https://alien.js.org/examples/3d_audio_fast.html) (fast)  
[polyhedron](https://alien.js.org/examples/3d_polyhedron.html) (buffer geometry loader thread)  
[camera shake](https://alien.js.org/examples/3d_camera_shake.html)  
[pbr](https://alien.js.org/examples/shader_pbr.html) (texture loader thread)  

<br>

## Class structure

```js
import gsap from 'gsap';

export class Logo {
    constructor() {
        this.element;
        this.image;

        this.initHTML();

        this.addListeners();
        this.onResize();
    }

    initHTML() {
        this.element = document.createElement('div');
        this.element.classList.add('logo');
        gsap.set(this.element, {
            top: 50,
            left: 50,
            width: 64,
            height: 64,
            cursor: 'pointer',
            opacity: 0
        });

        this.image = document.createElement('img');
        this.image.src = 'assets/images/alienkitty.svg';
        gsap.set(this.image, {
            position: 'relative',
            width: '100%'
        });
        this.element.appendChild(this.image);
    }

    addListeners() {
        window.addEventListener('resize', this.onResize);
        window.addEventListener('orientationchange', this.onResize);
        this.element.addEventListener('mouseenter', this.onHover);
        this.element.addEventListener('mouseleave', this.onHover);
        this.element.addEventListener('click', this.onClick);
    }

    removeListeners() {
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('orientationchange', this.onResize);
        this.element.removeEventListener('mouseenter', this.onHover);
        this.element.removeEventListener('mouseleave', this.onHover);
        this.element.removeEventListener('click', this.onClick);
    }

    /**
     * Event handlers
     */

    onResize = () => {
        if (window.innerWidth < window.innerHeight) {
            gsap.set(this.element, {
                top: 30,
                left: 30,
                width: 40,
                height: 40
            });
        } else {
            gsap.set(this.element, {
                top: 50,
                left: 50,
                width: 64,
                height: 64
            });
        }
    };

    onHover = ({ type }) => {
        if (type === 'mouseenter') {
            gsap.to(this.element, { opacity: 0.6, duration: 0.3, ease: 'power2.out' });
        } else {
            gsap.to(this.element, { opacity: 1, duration: 0.3, ease: 'power2.out' });
        }
    };

    onClick = () => {
        open('https://alien.js.org/');
    };

    /**
     * Public methods
     */

    animateIn = () => {
        gsap.to(this.element, { opacity: 1, duration: 0.6, ease: 'sine.inOut' });
    };

    destroy = () => {
        this.element.parentNode.removeChild(this.element);

        this.removeListeners();

        this.element = null;
        this.image = null;

        return null;
    };
}
```

## Getting started

Clone this repository template and install its dependencies:

```sh
git clone https://github.com/pschroen/alien.js
cd alien.js
npm i

# or
npx degit pschroen/alien.js my-app
cd my-app
npm i
```

```sh
# Serve at localhost:8080
npm run dev

# Build for production
npm run build
```

## With three.js and UIL

Uncomment all the lines in `App.js`, install `three` and download the [uil](https://github.com/lo-th/uil) ES module:

```sh
npm i && npm i three
mkdir src/lib
curl -L https://raw.githubusercontent.com/lo-th/uil/gh-pages/build/uil.module.js --output src/lib/uil.module.js
npm run dev
```

UIL is loaded dynamically and not part of the main bundle.

[localhost:8080/](http://127.0.0.1:8080/) (without uil)  
[localhost:8080/?ui](http://127.0.0.1:8080/?ui) (with uil)  
[localhost:8080/?ui&orbit](http://127.0.0.1:8080/?ui&orbit) (with uil and orbit controls)  
[localhost:8080/?orbit](http://127.0.0.1:8080/?orbit) (just orbit controls)

## With examples

```sh
npm i && npm i three
cd examples
npm i
npm run build
npm start
```

## Resources

* [The Wiki](https://github.com/pschroen/alien.js/wiki)
* [Example project structure](https://github.com/pschroen/alien.js/wiki/Project-structure)
* [Tween](https://github.com/pschroen/alien.js/wiki/Tween)
* [Changelog](https://github.com/pschroen/alien.js/releases)

## See also

* [Three.js](https://github.com/mrdoob/three.js)
* [Post Processing](https://github.com/vanruesc/postprocessing)
* [OGL](https://github.com/oframe/ogl)

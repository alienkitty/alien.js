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

[Examples](https://alien.js.org/)

Alien.js is a design pattern and project structure for building [SPA](https://en.wikipedia.org/wiki/Single-page_application) websites with ES modules and [GSAP](https://greensock.com/).

The idea is to keep it simple, with minimal abstraction, and to build websites more like a framework, which is why [Rollup](https://rollupjs.org/) is used instead for bundling.

In its design, everything is an ES module, all user interfaces and components follow the same class structure, making it easy to copy-paste from examples and between projects.

*Note this design pattern intentionally does not use underscores or private fields, in favour of cleaner code.*

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

## Class hierarchy

```
Preloader
    \
     '--- PreloaderView
      \
       '- App
              \
               '----- World ---.
                \               \
                 '--- Views -----.
                  \               \
                   '- Controllers -.
```

## Project structure

```
public
│
├── assets
│   │
│   ├── css
│   │   │
│   │   └── style.css
│   │
│   ├── data
│   │   │
│   │   └── data.json
│   │
│   ├── images
│   │
│   ├── js
│   │   │
│   │   ├── loader.js
│   │   └── main.js
│   │
│   ├── meta
│   │   │
│   │   └── share.png
│   │
│   └── textures
│
├── favicon.ico
└── index.html

src
│
├── config
│   │
│   ├── Config.js
│   ├── Device.js
│   ├── Events.js
│   └── Global.js
│
├── controllers
│   │
│   ├── audio
│   │   │
│   │   └── AudioController.js
│   │
│   ├── world
│   │   │
│   │   ├── CameraController.js
│   │   ├── InputManager.js
│   │   ├── RenderManager.js
│   │   ├── SceneController.js
│   │   └── WorldController.js
│   │
│   ├── App.js
│   ├── Preloader.js
│   └── Stage.js
│
├── data
│   │
│   ├── Data.js
│   ├── Geo.js
│   └── Socket.js
│
├── lib
│   │
│   └── CustomEase.js
│
├── partials
│   │
│   ├── icons
│   │   │
│   │   ├── arrow.svg.js
│   │   └── close.svg.js
│   │
│   └── Icons.js
│
├── loaders
│   │
│   ├── world
│   │   │
│   │   ├── EnvironmentTextureLoader.js
│   │   ├── OBJLoaderThread.js
│   │   ├── SphericalCubeTextureLoader.js
│   │   ├── SpherizeTextureLoader.js
│   │   └── TextureLoader.js
│   │
│   ├── AssetLoader.js
│   ├── Assets.js
│   ├── FontLoader.js
│   ├── ImageBitmapLoader.js
│   ├── ImageBitmapLoaderThread.js
│   ├── Loader.js
│   └── MultiLoader.js
│
├── materials
│   │
│   ├── BasicMaterial.js
│   └── FXAAMaterial.js
│
├── shaders
│   │
│   ├── modules
│   │   │
│   │   └── noise
│   │      │
│   │      └── simplex2d.glsl.js
│   │
│   ├── BasicMaterial.frag.js
│   ├── BasicMaterial.vert.js
│   ├── FXAAPass.frag.js
│   └── FXAAPass.vert.js
│
├── utils
│   │
│   ├── audio
│   │   │
│   │   ├── Sound.js
│   │   ├── Sound3D.js
│   │   ├── WebAudio.js
│   │   ├── WebAudio3D.js
│   │   └── WebAudioParam.js
│   │
│   ├── world
│   │   │
│   │   ├── Reflector.js
│   │   ├── SpherizeImage.js
│   │   ├── Utils3D.js
│   │   └── Wobble.js
│   │
│   ├── Cluster.js
│   ├── Component.js
│   ├── EventEmitter.js
│   ├── Interface.js
│   ├── LinkedList.js
│   ├── ObjectPool.js
│   ├── Thread.js
│   ├── Tween.js
│   └── Utils.js
│
├── views
│   │
│   ├── LandingView.js
│   ├── PreloaderView.js
│   └── SceneView.js
│
└── main.js
```

## Code-splitting

```
public
│
└── assets
    │
    └── js
        │
        ├── loader.js (~90kb with GSAP)
        └── main.js (~700kb with three.js)
```

## Multithreading

```
App (main thread)
│
└── Thread (instance thread)
    │
    ├── shared (navigator.hardwareConcurrency)
    │
    └── events
        │
        ├── on
        ├── off
        └── send
```

## Getting started

Clone this repository template and install its dependencies:

```sh
git clone https://github.com/pschroen/alien.js
cd alien.js
npm install

# or
npx degit pschroen/alien.js my-app
cd my-app
npm install
```

```sh
# Serve at localhost:8080
npm run dev

# Build for production
npm run build
```

## Resources

* [The Wiki](https://github.com/pschroen/alien.js/wiki)
* [Tween](https://github.com/pschroen/alien.js/wiki/Tween)
* [Changelog](https://github.com/pschroen/alien.js/releases)

## See also

* [OGL](https://github.com/oframe/ogl)
* [three.js](https://github.com/mrdoob/three.js)
* [Post Processing](https://github.com/vanruesc/postprocessing)
* [Oimo.js](https://github.com/lo-th/Oimo.js)
* Bruno Simon's [Folio 2019](https://github.com/brunosimon/folio-2019).
* Pierfrancesco Soffritti's [Doodles](https://github.com/PierfrancescoSoffritti/doodles).
* Jaume Sanchez Elias' [Experiments with Perlin noise](https://github.com/spite/perlin-experiments).
* Jaume Sanchez Elias' [WebVR Physics](https://github.com/spite/WebVR-Physics).
* Jaume Sanchez Elias' [Codevember 2017](https://github.com/spite/codevember-2017).
* Jaume Sanchez Elias' [Codevember 2016](https://github.com/spite/codevember-2016).
* Jaume Sanchez Elias' [Wagner](https://github.com/spite/Wagner).
* Evan Wallace's [WebGL Filter](https://github.com/evanw/webgl-filter).
* Active Theory's [Finding Love Shaders](https://github.com/activetheory/Finding-Love-Shaders).
* Inspired by [Active Theory](https://github.com/activetheory)'s class structure and code style.

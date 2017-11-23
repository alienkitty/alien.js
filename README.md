# Alien.js
[![Build Status](https://travis-ci.org/pschroen/alien.js.svg)]()
[![Latest NPM release](https://img.shields.io/npm/v/alien.js.svg)]()
[![License](https://img.shields.io/npm/l/alien.js.svg)]()
[![Dependencies](https://img.shields.io/david/pschroen/alien.js.svg)]()
[![Dev Dependencies](https://img.shields.io/david/dev/pschroen/alien.js.svg)]()

A lightweight web framework abducted from Active Theory's [Hydra](https://medium.com/@activetheory/mira-exploring-the-potential-of-the-future-web-e1f7f326d58e) and ported to an ES6 module bundler.

### Features

* [Rollup](https://rollupjs.org/) module bundler with [Tree Shaking](https://github.com/rollup/rollup#tree-shaking), only the classes you use are compiled into your project.
* Simple design pattern with inheritance, `Stage`, `Interface`, `Component`, `Canvas`, `Device`, `Mouse`, etc.
* Event based or use promises.
* CSS3 animations.
* Math and Spring animations.
* Canvas graphics engine.
* Web audio engine.
* SVG support.

### Example `Interface` design pattern

```js
import { Stage, Interface, Device } from '../alien.js/src/Alien';

Config.UI_OFFSET = Device.phone ? 20 : 35;

class UILogo extends Interface {

    constructor() {
        super('UILogo');
        let self = this;
        let size = Device.phone ? 40 : 64;

        initHTML();

        function initHTML() {
            self.size(size).css({
                left: Config.UI_OFFSET,
                top: Config.UI_OFFSET,
                opacity: 0
            });
            self.bg('assets/images/logo.svg', 'cover');
            self.tween({ opacity: 1 }, 1000, 'easeOutQuart');
            self.interact(hover, click);
        }

        function hover(e) {
            if (e.action === 'over') self.tween({ opacity: 0.7 }, 100, 'easeOutSine');
            else self.tween({ opacity: 1 }, 300, 'easeOutSine');
        }

        function click() {
            getURL('https://alien.js.org/');
        }
    }
}

class Main {

    constructor() {
        Stage.initClass(UILogo);
    }
}

new Main();
```

### Example Singleton design pattern

```js
import { Events, Stage, Interface, Canvas } from '../alien.js/src/Alien';

class CanvasLayer extends Interface {

    static instance() {
        if (!this.singleton) this.singleton = new CanvasLayer();
        return this.singleton;
    }

    constructor() {
        super('CanvasLayer');
        let self = this;

        initHTML();
        initCanvas();
        addListeners();

        function initHTML() {
            self.size('100%').mouseEnabled(false);
            Stage.add(self);
        }

        function initCanvas() {
            self.canvas = self.initClass(Canvas, Stage.width, Stage.height, true);
        }

        function addListeners() {
            Stage.events.add(Events.RESIZE, resize);
            resize();
        }

        function resize() {
            self.canvas.size(Stage.width, Stage.height, true);
        }
    }
}

class Main {

    constructor() {
        let canvas;

        initCanvas();

        function initCanvas() {
            canvas = CanvasLayer.instance().canvas;
            // ...
        }
    }
}

new Main();
```

### Quickstart

To build a project, make sure you have [Node.js](https://nodejs.org/) installed (at least version 6).

```
mkdir about
cd about
git init
git submodule add https://github.com/pschroen/alien.js
cp -r alien.js/examples/about/* .
cp alien.js/.eslintrc.json alien.js/.gitignore .
npm install
npm run build
open dist/index.html
```

### Updating

```
git submodule update --remote --merge
cp alien.js/examples/about/package.json alien.js/examples/about/rollup.config.js .
cp alien.js/.eslintrc.json alien.js/.gitignore .
rm -rf node_modules package-lock.json
npm install
```

### Workflow

```
npm run lint
npm run build
open dist/index.html
npm run dev
npm run build
```

### Roadmap

* Docs
* Tests
* Particle emitter
* FX and lighting
* Mixin examples, three.js
* Error handling

### Changelog

* [Releases](https://github.com/pschroen/alien.js/releases)

### References

* [Active Theory](https://activetheory.net/)
* Active Theory's [Mira](https://medium.com/@activetheory/mira-exploring-the-potential-of-the-future-web-e1f7f326d58e)
* [How to Set Up Smaller, More Efficient JavaScript Bundling Using Rollup](https://code.lengstorf.com/learn-rollup-js/)

### Links

* [Website](https://alien.js.org/)

### License

Released under the [MIT license](LICENSE).

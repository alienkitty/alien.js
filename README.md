# Alien.js
[![Build Status](https://travis-ci.org/pschroen/alien.js.svg)]()
[![Latest NPM release](https://img.shields.io/npm/v/alien.js.svg)]()
[![License](https://img.shields.io/npm/l/alien.js.svg)]()
[![Dependencies](https://img.shields.io/david/pschroen/alien.js.svg)]()
[![Dev Dependencies](https://img.shields.io/david/dev/pschroen/alien.js.svg)]()

A lightweight web framework abducted from Active Theory's [Hydra](https://medium.com/@activetheory/mira-exploring-the-potential-of-the-future-web-e1f7f326d58e) and ported to an ES6 module bundler.

### Features

* [Rollup](https://rollupjs.org/) module bundler with [Tree Shaking](https://github.com/rollup/rollup#tree-shaking), only the classes you use are compiled into your project.
* Simple design pattern with inheritance, `Stage`, `Interface`, `Canvas`, `Device`, `Mouse`, `Render`, etc.
* Event based or use promises.
* CSS3 animations.
* Math and Spring animations.
* Canvas graphics engine.
* SVG support.

### Quickstart

To build a project, make sure you have [Node.js](https://nodejs.org/) installed (at least version 6).

```
mkdir about
cd about
git init
git submodule add https://github.com/pschroen/alien.js
cp -r alien.js/examples/about/* .
cp alien.js/.babelrc alien.js/.eslintrc.json alien.js/.gitignore .
npm install
npm run build
open dist/index.html
```

### Updating

```
git submodule update --remote --merge
cp alien.js/examples/about/package.json alien.js/examples/about/rollup.config.js .
cp alien.js/.babelrc alien.js/.eslintrc.json alien.js/.gitignore .
rm -rf node_modules
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
* Mobile
* Particle emitter
* FX
* Audio
* Mixin examples, ThreeJS, PixiJS
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

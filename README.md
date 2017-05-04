# Alien.js
[![Build Status](https://travis-ci.org/pschroen/alien.js.svg)](https://travis-ci.org/pschroen/alien.js)

A lightweight web framework abducted from Active Theory’s [Hydra](https://medium.com/@activetheory/mira-exploring-the-potential-of-the-future-web-e1f7f326d58e) and ported to an ES6 module bundler.

### Features

* [Rollup](https://rollupjs.org/) module bundler with [Tree Shaking](https://github.com/rollup/rollup#tree-shaking), only the classes you use are compiled into your project.
* Simple design pattern with inheritance, `Stage`, `Interface`, `Canvas`, `Device`, `Mouse`, `Render`, etc.
* Event based or use promises
* CSS3 animations
* Math and Spring animations

### Quickstart

To build a project, make sure you have [Node.js](https://nodejs.org/) installed (at least version 6).

```sh
mkdir project
cd project
git init
git submodule add https://github.com/pschroen/alien.js
cp -r alien.js/examples/about/* .
cp alien.js/.babelrc .
cp alien.js/.eslintrc.json .
cp alien.js/.gitignore .
npm install
npm run build
open dist/index.html
```

### Updating

```sh
git submodule update
```

### Workflow

```sh
npm run dev
```

### Roadmap

* Docs
* Tests
* Mobile
* Particle emitter
* FX
* Audio
* Input
* Mixin examples, ThreeJS, PixiJS
* Error handling

### Changelog

* [Releases](https://github.com/pschroen/alien.js/releases)

### References

* [Active Theory](https://activetheory.net/)
* Active Theory’s [Mira](https://medium.com/@activetheory/mira-exploring-the-potential-of-the-future-web-e1f7f326d58e)
* [How to Set Up Smaller, More Efficient JavaScript Bundling Using Rollup](https://code.lengstorf.com/learn-rollup-js/)

### Links

* [Website](https://alien.js.org/)

### License

Released under the [MIT license](LICENSE).

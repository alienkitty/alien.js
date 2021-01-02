const { task, src, dest } = require('gulp');
const { transform } = require('@babel/core');
const { minify } = require('terser');
const through2 = require('through2');

function build(code) {
  code = transform(code, {
    compact: false,
    presets: [],
    plugins: [
      ['@babel/plugin-proposal-class-properties', { loose: true }]
    ]
  });
  code = minify(code.code, {
    keep_classnames: true,
    keep_fnames: true
  });
  return code.code;
}

task('default', () =>
  src('build/alien.js', { base: './' })
    .pipe(through2.obj((file, _, cb) => {
      file.contents = Buffer.from(build(file.contents.toString()));
      cb(null, file);
    }))
    .pipe(dest('./'))
);

task('examples', () =>
  src('examples/*.html', { base: './' })
    .pipe(through2.obj((file, _, cb) => {
      let code = build(file.contents.toString().match(/<script type="module">([\s\S]+)<\/script>/m)[1]);
      code = file.contents.toString().replace(/<script type="module">[\s\S]+<\/script>/m, `<script type="module">${code}</script>`);
      file.contents = Buffer.from(code);
      cb(null, file);
    }))
    .pipe(dest('./'))
);

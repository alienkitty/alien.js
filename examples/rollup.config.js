import resolve from '@rollup/plugin-node-resolve';

export default {
  input: '../src/three.js',
  output: {
    file: '../build/alien.three.js',
    format: 'es'
  },
  plugins: [
    resolve({
      browser: true
    })
  ]
};

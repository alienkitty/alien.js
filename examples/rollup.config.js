import resolve from '@rollup/plugin-node-resolve';

export default {
  input: '../src/all.three.js',
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

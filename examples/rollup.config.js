import resolve from '@rollup/plugin-node-resolve';

export default {
  input: '../src/all.js',
  output: {
    file: '../build/alien.js',
    format: 'es'
  },
  plugins: [
    resolve({
      browser: true
    })
  ]
};

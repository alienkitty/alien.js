import resolve from '@rollup/plugin-node-resolve';

export default {
  input: '../all.js',
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

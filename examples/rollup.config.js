import resolve from '@rollup/plugin-node-resolve';

export default {
  input: '../src/all.three.js',
  treeshake: {
    // Needed for OimoPhysics
    correctVarValueBeforeDeclaration: true
  },
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

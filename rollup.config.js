import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'

export default {
  input: 'src/lapg-themeManager.js',
  output: [
    {
      file: 'dist/bundle.js',
      format: 'esm',
    },
    {
      file: 'dist/bundle.min.js',
      format: 'iife',
      plugins: [terser()],
    },
  ],
  plugins: [json()],
};
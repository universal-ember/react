import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { extensions, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';

import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    splitVendorChunkPlugin(),
    ember(),
    react(),
    babel({
      babelHelpers: 'inline',
      extensions,
    }),
  ],
  build: {
    minify: false,
    rollupOptions: {
      input: {
        tests: 'tests/index.html',
      },
    },
  },
});

import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vitest/config';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    enhancedImages(),
    sveltekit(),
    basicSsl({
      name: 'localhost'
    })
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});

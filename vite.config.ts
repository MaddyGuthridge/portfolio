import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  server: {
    port: parseInt(process.env.PORT as string),
    strictPort: true,
    host: process.env.HOST,
  },
  plugins: [
    sveltekit()
  ],
});

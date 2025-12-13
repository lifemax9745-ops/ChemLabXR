import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Safely expose API_KEY to the client bundle during build
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY),
      // Polyfill empty process.env object for other libraries causing crashes
      'process.env': {} 
    },
    server: {
      host: true, // Required for exposing to local network
      port: 3000
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      emptyOutDir: true
    }
  };
});

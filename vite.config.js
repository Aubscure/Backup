import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        viteStaticCopy({
            targets: [{
                src: 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs',
                dest: '',
            }],
        }),
        react(),
    ],
});

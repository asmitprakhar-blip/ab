import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                menu: resolve(__dirname, 'menu.html'),
                about: resolve(__dirname, 'about.html'),
                plans: resolve(__dirname, 'plans.html'),
                contact: resolve(__dirname, 'contact.html'),
            },
        },
    },
});

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import { VuetifyResolver } from 'unplugin-vue-components/resolvers';
import eslintPlugin from 'vite-plugin-eslint';
import Components from 'unplugin-vue-components/vite';
import path from 'path';

const resolve = (file) => {
    return path.resolve(__dirname, file);
};

export default defineConfig({
    test: {
        globals: true,
    },
    plugins: [
        vue(),
        eslintPlugin(),
        Components({
            resolvers: [VuetifyResolver()],
        }),
    ],
    server: {
        port: 8080,
    },
});

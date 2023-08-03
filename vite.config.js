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
    plugins: [
        vue(),
        eslintPlugin(),
        Components({
            resolvers: [VuetifyResolver()],
        }),
    ],
    resolve: {
        alias: [{ find: /^@\/(.*)/, replacement: resolve('./src/$1') }],
        extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
    },
    server: {
        port: 8080,
    },
});

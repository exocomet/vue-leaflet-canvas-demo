import copy from 'rollup-plugin-copy';
import vue from 'rollup-plugin-vue';
import resolve from '@rollup/plugin-node-resolve';
// import { eslint } from "rollup-plugin-eslint";

export default [{
    //https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
    external: [
        'vue',
        'leaflet',
        // 'mock-latlng'
    ],
    input: "./src/main.js",
    output: {
        file: "./build/bundle.js",
        format: 'iife',
        name: 'app',
        globals: {
            'vue': 'Vue',
            'leaflet': 'L',
            'mock-latlng': 'MockLatLng',
            // 'vue2-leaflet': 'Vue2Leaflet',
        },
    },
    plugins: [
        resolve(),
        vue(/* options */),
        // eslint([]),
        copy({
            targets: [{
                    src: ['./index.html', './src/style.css'],
                    dest: './dist'
                }, {
                    src: './build/*',
                    dest: './dist'
                }],
            overwrite: true,
            hook: 'writeBundle'
        })
    ],
},];
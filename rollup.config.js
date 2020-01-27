import copy from 'rollup-plugin-copy';
import vue from 'rollup-plugin-vue'


export default [{
    //https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
    external: ['vue'],
    input: "./src/main.js",
    output: {
        file: "./build/bundle.js",
        format: 'iife',
        name: 'app',
        globals: {
            'vue': 'Vue',
            // 'vue2-leaflet': 'Vue2Leaflet',
        },
    },
    plugins: [
        vue(/* options */),
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
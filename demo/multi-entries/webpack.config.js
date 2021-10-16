const path = require('path');
const fs = require('fs-extra');
const ShebangPlugin = require('webpack-shebang-plugin');

fs.removeSync('./dist');

module.exports = {
    mode: 'production',
    entry: {
        a: {
            import: './src/first.js',
            filename: 'entries/first.js'
        },
        b: './src/second.js',
        c: './src/third.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    plugins: [
        new ShebangPlugin()
    ]
}
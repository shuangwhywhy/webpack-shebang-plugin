const path = require('path');
const fs = require('fs-extra');
const ShebangPlugin = require('webpack-shebang-plugin');

fs.removeSync('./dist');

module.exports = {
    mode: 'production',
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    plugins: [
        new ShebangPlugin()
    ]
}
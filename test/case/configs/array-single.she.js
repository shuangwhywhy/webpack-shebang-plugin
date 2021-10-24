const { merge } = require('webpack-merge');
const config = require('./default.config');
const path = require('path');
const fs = require('fs-extra');

const name = path.basename(__filename, '.js');

module.exports = (version) => {
    const outputDir = path.resolve(__dirname, '../dist', name, version);
    fs.removeSync(outputDir);
    return merge(config, {
        entry: [
            './src/she.js'
        ],
        output: {
            path: outputDir,
            filename: version === 'v5' ? '[name]-[fullhash].js' : '[name]-[hash].js'
        }
    });
};
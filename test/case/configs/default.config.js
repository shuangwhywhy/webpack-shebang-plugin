const path = require('path');
const ShebangPlugin = require('../../..');

module.exports = {
    mode: 'production',
    context: path.resolve(__dirname, '../'),
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name]-[fullhash].js'
    },
    plugins: [
        new ShebangPlugin()
    ]
}
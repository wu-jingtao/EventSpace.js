const webpack = require('webpack'); //to access built-in plugins
const path = require('path');

module.exports = {
    entry: './src/Browser/index.js',
    output: {
        path: path.resolve(__dirname, 'bin/browser'),
        filename: 'index.js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({ compress: true, mangle: false }),
    ]
};
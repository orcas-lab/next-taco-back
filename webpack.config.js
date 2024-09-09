const webpack = require('webpack');

/**
 * @type {import('webpack').Configuration}
 */
const config = {
    plugins: [
        new webpack.DefinePlugin({
            __TEST__: 'false',
        }),
    ],
};

module.exports = config;

var webpack = require('webpack');
const path = require('path');

const RESOURCE_PATH = path.resolve('resources');
const NODE_MODULES_PATH = path.resolve('node_modules');

var config = {
    devtool: 'eval-source-map',
    entry:  __dirname + "/resources/js/Application.jsx",
    output: {
        path: __dirname + "",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: RESOURCE_PATH,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.png$/,
                loader: "url-loader?mimetype=image/png"
            },
            {
                test: /\.gif$/,
                loader: "url-loader?mimetype=image/gif"
            }
        ]
    },
    resolve: {
        modules: [
            NODE_MODULES_PATH,
            RESOURCE_PATH
        ],
        extensions: ['', '.js', '.jsx']
    },
    devServer: {
        contentBase: "./resources/html",
        colors: true,
        historyApiFallback: true,
        inline: true
    }
};

/*
 * If bundling for production, optimize output
 */
if (process.env.NODE_ENV === 'production') {
    config.devtool = false;
    config.plugins = [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({comments: false}),
        new webpack.DefinePlugin({
            'process.env': {NODE_ENV: JSON.stringify('production')}
        })
    ];
}

module.exports = config;
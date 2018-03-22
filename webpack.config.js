var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'dist/scripts');
var APP_DIR = path.resolve(__dirname, 'src/');

var config = {
    devtool: 'source-map',
    entry: { 
        // jsx: APP_DIR + '/templates/index.jsx',
        app: APP_DIR + '/scripts/output/app.js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    output: {
        path: BUILD_DIR,
        filename: '[name].bundle.js'
    },
    module : {
        loaders : [
            {
                test : /\.jsx?/,
                loaders: ['eslint-loader'],
                include : APP_DIR,
                exclude: path.resolve(__dirname, 'node_modules/'),
                loader : 'babel-loader'
            }
        ]
    },
    eslint: {
        configFile: './.eslintrc.json',  //your .eslintrc file 
        emitWarning: true
      }
};

module.exports = config;
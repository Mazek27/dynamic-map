const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'production'
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: "./src/index.tsx"
    },
    output: {
        filename: devMode ? "[name].bundle.js" : "[name].[hash].js",
        path: __dirname + "/dist",
        publicPath: '/dist'
    },
    stats: {
        entrypoints: false
    },

    devtool: "eval",

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },

            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.s?[ac]ss$/,
                use: [MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'url-loader'
            }

        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].bundle.css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        }),
        new HtmlWebpackPlugin({
            title: "pms-model-editor",
            filename: "../index.html",
            template: "src/template/index.html",
        })

    ],

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    compress: false,
                    ecma: 5,
                    mangle: true
                },
                sourceMap: true
            })
        ]
    },

    externals: {
        'lodash': {
            commonjs: 'lodash',
            commonjs2: 'lodash',
            amd: 'lodash',
            root: '_',
        },
        "react": "React",
        "react-dom": "ReactDOM",
        "react-router": "ReactRouter",
    },
};

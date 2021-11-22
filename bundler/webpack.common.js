const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = {
    entry: {
        app: path.resolve(__dirname, '../src/app.js'),
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    resolve: {
        alias: {
            '@src': path.resolve(__dirname, '../src/'),
            '@js': path.resolve(__dirname, '../src/js/'),
            '@glsl': path.resolve(__dirname, '../src/glsl/'),
            '@utils': path.resolve(__dirname, '../src/utils/'),
        }
    },
    devtool: 'source-map',
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, '../static'), to: path.resolve(__dirname, '../dist/assets') }
            ]
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            title: 'WebGL Starter',
            favicon: path.resolve(__dirname, '../static/img/icon/favicon.jpg'),
            template: path.resolve(__dirname, '../src/index.html'),
            chunks: ['app'],
            minify: true
        }),
        new MiniCSSExtractPlugin({
            filename: 'style.css'
        })
    ],
    module: {
        rules: [
            // HTML
            {
                test: /\.html$/,
                use: ['html-loader']
            },

            // JS
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },

            // CSS
            {
                test: /\.css$/,
                use: [
                    MiniCSSExtractPlugin.loader,
                    'css-loader'
                ]
            },

            // SCSS
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCSSExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },

            // Images
            {
                test: /\.(jpg|png|gif|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'assets/images/'
                    }
                }]
            },

            // Fonts
            {
                test: /\.(otf|ttf|eot|woff|woff2)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'assets/fonts/'
                    }
                }]
            },

            // Sound/Music
            {
                test: /\.(mp3|wav)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'assets/sound/'
                    }
                }]
            },

            // Video
            {
                test: /\.(mp4|webm)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'assets/videos/'
                    }
                }, ]
            },

            // Models
            {
                test: /\.(fbx|glb|obj|3ds|gltf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'assets/models/'
                    }
                }]
            },

            {
                test: /\.(bin)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'assets/models/'
                    },
                }, ],
            },

            // Shaders
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                exclude: /node_modules/,
                use: [
                    'raw-loader',
                    'glslify-loader'
                ]
            },

            {
                test: /\.(md)$/,
                exclude: /node_modules/,
                use: [
                    'file-loader'
                ]
            },
        ]
    }
}

const path = require("path");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = [
    {
        name: "simulator",
        mode: "production",
        entry: {
            app: './Blockly-for-Dwenguino/DwenguinoIDE/js/src/dwenguino_blockly.js',
        },
        resolve:{
            extensions: ['.js', '.cjs', '.ttf', '.json', '.jsx', '.tsx', '.ts', ''] 
        },
        output: {
            path: path.resolve('./Blockly-for-Dwenguino/DwenguinoIDE/js/dist'),
            filename: 'dwenguinoblockly.bundle.js'
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/, 
                    use:{
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ["@babel/preset-env",
                                {
                                    'targets': {
                                        'browsers': ['last 2 version']
                                    }
                                }], 
                                "@babel/preset-react",
                                "@babel/preset-typescript",
                            ],
                            plugins: ["@babel/plugin-proposal-class-properties",
                                    "@babel/plugin-transform-classes",
                                    '@babel/plugin-transform-runtime',
                                    "autobind-class-methods"]
                        }
                    }
                },
                {
                    test: /\.js?$/,
                    exclude: /node_modules/, 
                    use:{
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ["@babel/preset-env",
                                {
                                    'targets': {
                                        'browsers': ['last 4 version']
                                    }
                                }]
                            ],
                            plugins: ["@babel/plugin-proposal-class-properties",
                                    "@babel/plugin-transform-classes",
                                    '@babel/plugin-transform-runtime']
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.ttf$/,
                    type: "asset/resource"
                }
            ]
        },
        plugins: [new MonacoWebpackPlugin(), new CompressionPlugin()],
        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin()],
            chunkIds: "size"
        },
        devtool: false,
    },
    {
        name: "dashboards",
        mode: "development",
        devtool: "eval-source-map",
        entry: {
            app: './Blockly-for-Dwenguino/dashboards/js/src/dashboard.ts'
        },
        output: {
            path: path.resolve('./Blockly-for-Dwenguino/dashboards/js/dist/'),
            filename: 'dashboards.bundle.js'
        },
        module: {
            rules: [
                
                {
                    test: /\.css$/i,
                    use: ['style-loader', 
                        { loader: "css-modules-typescript-loader"},
                        {
                                loader: "css-loader",
                                options: {
                                    modules: true,
                                    sourceMap: false
                                }
                        }, 'postcss-loader']
                },
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    include: [/dashboards/],
                    use:["babel-loader", 
                    {
                        loader: 'ts-loader',
                        options:{
                            configFile: "dashboards.tsconfig.json"
                        },
                    }]
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                    type: 'asset',
                  },
            ]
        }
    }
];

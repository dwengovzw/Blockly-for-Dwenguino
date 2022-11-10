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
                    use: ['file-loader']
                }
            ]
        },
        plugins: [new MonacoWebpackPlugin(), new CompressionPlugin()],
        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin()]
        },
        devtool: false,
    },
    {
        name: "admin-panel",
        mode: "production",
        entry: {
            app: './Blockly-for-Dwenguino/DwenguinoIDE/js/src/admin/admin_panel.js'
        },
        output: {
            path: path.resolve('./Blockly-for-Dwenguino/DwenguinoIDE/js/dist'),
            filename: 'admin-panel.bundle.js'
        },
        module: {
            rules: [
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
                                        'browsers': ['last 2 version']
                                    }
                                }]
                            ],
                            plugins: ["@babel/plugin-proposal-class-properties",
                                    "@babel/plugin-transform-classes",
                                    '@babel/plugin-transform-runtime']
                        }
                    }
                }
            ]
        }
    }
];

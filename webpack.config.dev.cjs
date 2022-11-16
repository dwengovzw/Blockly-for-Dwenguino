const path = require("path");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = [
    {
        name: "simulator",
        mode: "development",
        entry: {
            app: './Blockly-for-Dwenguino/DwenguinoIDE/js/src/dwenguino_blockly.js'
        },
        resolve:{
            extensions: ['.js', '.cjs', '.ttf', '.json', '.jsx', '', '.ts', '.tsx'] 
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
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.ttf$/,
                    use: ['file-loader']
                }
            ]
        },
        plugins: [new MonacoWebpackPlugin()]
    },
    {
        name: "dashboards",
        mode: "development",
        devtool: "eval-source-map",
        entry: {
            app: './Blockly-for-Dwenguino/dashboards/js/src/index.ts'
        },
        output: {
            path: path.resolve('./Blockly-for-Dwenguino/dashboards/js/dist/'),
            filename: 'dashboards.bundle.js'
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
                                "@babel/preset-flow",
                            ],
                            plugins: [["@babel/plugin-proposal-decorators", { "legacy" : true }],
                                        ["@babel/plugin-proposal-class-properties", { "loose" : true }],
                                        "@babel/plugin-transform-classes",
                                        '@babel/plugin-transform-runtime']
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
                                        'browsers': ['last 2 version']
                                    }
                                }], 
                                "@babel/preset-flow",
                            ],
                            plugins: [["@babel/plugin-proposal-decorators", { "legacy" : true }],
                                        ["@babel/plugin-proposal-class-properties", { "loose" : true }],
                                        "@babel/plugin-transform-classes",
                                        '@babel/plugin-transform-runtime']
                        }
                    }
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: ['style-loader', 'css-loader', {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                indentWidth: 4,
                                includePaths: ["/Blockly-for-Dwenguino/dashboards/scss"],
                                outputStyle: "compressed",
                            },
                            sourceMap: true,
                        }
                    }]
                },
            ]
        }
    }
];

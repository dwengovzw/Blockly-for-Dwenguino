const path = require("path");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = [
    {
        name: "simulator",
        mode: "development",
        //context: path.resolve(__dirname, "Blockly-for-Dwenguino/DwenguinoIDE"),
        entry: {
            app: './Blockly-for-Dwenguino/DwenguinoIDE/js/src/dwenguino_blockly.js'
        },
        resolve:{
            extensions: ['.js', '.cjs', '.ttf', '.json', '.jsx', '', '.ts', '.tsx'] ,
            fullySpecified: false,
        },
        output: {
            path: path.resolve('./Blockly-for-Dwenguino/DwenguinoIDE/js/dist'),
            filename: 'dwenguinoblockly.bundle.js'
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/, 
                    resolve: {
                        fullySpecified: false,
                      },
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
                    test: /\.m?js$/,
                    type: "javascript/auto",
                    resolve: {
                        fullySpecified: false,
                      },
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
                    type: "asset/resource"
                }
            ]
        },
        plugins: [new MonacoWebpackPlugin()]
    },
    {
        name: "dashboards",
        mode: "development",
        devtool: "eval-source-map",
        context: path.resolve(__dirname, "Blockly-for-Dwenguino"),
        entry: {
            app: path.resolve(__dirname, "Blockly-for-Dwenguino/dashboards/js/src/dashboard.ts"),
        },
        output: {
            path: path.resolve(__dirname, 'Blockly-for-Dwenguino/dashboards/js/dist/'),
            filename: 'dashboards.bundle.js'
        },
        resolve:{
            extensions: ['.ts', '.js', '.cjs', '.ttf', '.json', '.jsx', '.tsx'] 
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
                                    sourceMap: true
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
                            configFile: "dev.dashboards.tsconfig.json"
                        },
                    }]
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                    type: 'asset',
                  },
            ]
        }
    },
    {
        name: "editor",
        mode: "development",
        devtool: "eval-source-map",
        context: path.resolve(__dirname, "Blockly-for-Dwenguino"),
        entry: {
            app: path.resolve(__dirname, "Blockly-for-Dwenguino/editor/js/src/editor.ts"),
        },
        output: {
            path: path.resolve(__dirname, 'Blockly-for-Dwenguino/editor/js/dist/'),
            filename: 'editor.bundle.js'
        },
        resolve:{
            extensions: ['.js', '.cjs', '.ttf', '.json', '.jsx', '', '.ts', '.tsx'] 
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
                                    sourceMap: true
                                }
                        }, 'postcss-loader']
                },
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    include: [/editor/, /dashboards/],
                    use:["babel-loader", 
                    {
                        loader: 'ts-loader',
                        options:{
                            configFile: "dev.editor.tsconfig.json"
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

module.exports.parallelism = 1;
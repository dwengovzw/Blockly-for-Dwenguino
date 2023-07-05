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
            extensions: ['.js', '.cjs', '.ttf', '.json', '.jsx', '.tsx', '.ts', ''],
            fullySpecified: false,
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
                                        'browsers': ['last 4 version']
                                    }
                                }]
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
        plugins: [new CompressionPlugin()],
        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin()],
            chunkIds: "size",
            splitChunks: {
                chunks: 'async',
                minSize: 20000,
                minRemainingSize: 0,
                minChunks: 1,
                maxAsyncRequests: 30,
                maxInitialRequests: 30,
                enforceSizeThreshold: 50000,
                cacheGroups: {
                  defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                  },
                  default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                  },
                },
              },
        },
        devtool: false,
    },
    {
        name: "dashboards",
        mode: "production",
        devtool: "eval-source-map",
        context: path.resolve(__dirname, "Blockly-for-Dwenguino"),
        entry: {
            app: path.resolve(__dirname, "Blockly-for-Dwenguino/dashboards/js/src/dashboard.ts"),
        },
        output: {
            path: path.resolve('./Blockly-for-Dwenguino/dashboards/js/dist/'),
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
        },
        plugins: [new CompressionPlugin()],
        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin()],
            chunkIds: "size",
            splitChunks: {
                chunks: 'async',
                minSize: 20000,
                minRemainingSize: 0,
                minChunks: 1,
                maxAsyncRequests: 30,
                maxInitialRequests: 30,
                enforceSizeThreshold: 50000,
                cacheGroups: {
                  defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                  },
                  default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                  },
                },
              },
        }
    }
];

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
            extensions: ['.js', '.cjs', '.ttf', '.json', '.jsx', '', '.ts', '.tsx'] 
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
        watch: true,
        devtool: "eval-source-map",
        context: path.resolve(__dirname, "Blockly-for-Dwenguino/dashboards"),
        entry: {
            app: path.resolve(__dirname, "Blockly-for-Dwenguino/dashboards/js/src/dashboard.ts"),
        },
        output: {
            path: path.resolve(__dirname, 'Blockly-for-Dwenguino/dashboards/js/dist/'),
            filename: 'dashboards.bundle.js'
        },
        resolve:{
            extensions: ['.js', '.cjs', '.ttf', '.json', '.jsx', '', '.ts', '.tsx'] 
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    include: /dashboards/,
                    use:["babel-loader", 
                    {
                        loader: 'ts-loader',
                        options:{
                            configFile: "dev.dashboards.tsconfig.json"
                        },
                    }]
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: ['style-loader', 'css-loader', {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                indentWidth: 4,
                                includePaths: [path.resolve(__dirname, 'Blockly-for-Dwenguino/dashboards/scss')],
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

module.exports.parallelism = 1;
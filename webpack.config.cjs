const path = require("path");

module.exports = {
    mode: "production",
    entry: {
        app: './Blockly-for-Dwenguino/DwenguinoIDE/js/src/DwenguinoBlockly.js'
    },
    output: {
        path: path.resolve('./Blockly-for-Dwenguino/DwenguinoIDE/js/dist'),
        filename: 'dwenguinoblockly.bundle.js'
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
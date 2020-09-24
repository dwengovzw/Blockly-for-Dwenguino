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
                loader: 'babel-loader',
                query: {
                    plugins: ["@babel/plugin-proposal-class-properties"]
                }
            }
        ]
    }
}
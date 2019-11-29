// This module contains the utils controller responsible for functions like:
// compiling, uploading and error handling

// Module for handling external execution
const exec = require('child_process').exec
const fs = require('fs');

let handleExternalCommand = function(command, res, err_msg, succes_msg){
    let cmd = exec(command, {timeout: 10000}, 
        (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                res.json({
                    status: "error",
                    info: err_msg,
                    message: error,
                    trace: stderr,
                });
            }else{
                res.json({
                    status: "success",
                    info: succes_msg,
                    trace: stdout,
                    data: "TODO: return hex code as binary code decimal"
                });
            }
        }
    );
}

exports.clean = function(req, res){
    handleExternalCommand('./compilation/bin/make -C ./compilation clean',
                            res,
                            "An error occured during clean operation",
                            "Clean succesful.");
}

// Handle compile action
exports.compile = function (req, res) {
    handleExternalCommand('./compilation/bin/make -C ./compilation',
                            res,
                            "An error occured during compilation",
                            "Code succesfully compiled.");    
};

// Handle upload action
exports.upload = function (req, res) {
    handleExternalCommand('./compilation/bin/make -C ./compilation upload',
                            res,
                            "An error occured during upload",
                            "Code succesfully uploaded.");
};


let handleRun = function(res){
    let cmd_clean = exec('./compilation/bin/make -C ./compilation clean', {timeout: 10000}, 
        (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                res.json({
                    status: "error",
                    info: "Clean failed",
                    message: error,
                    trace: stderr,
                });
            }else{
                let cmd_compile = exec('./compilation/bin/make -C ./compilation', {timeout: 10000}, 
                    (error, stdout, stderr) => {
                        console.log(stdout);
                        console.log(stderr);
                        if (error !== null) {
                            res.json({
                                status: "error",
                                info: "Compilation failed",
                                message: error,
                                trace: stderr,
                            });
                        }else{
                            let cmd_uplaod = exec('./compilation/bin/make -C ./compilation upload', {timeout: 10000}, 
                                (error, stdout, stderr) => {
                                    console.log(stdout);
                                    console.log(stderr);
                                    if (error !== null) {
                                        res.json({
                                            status: "error",
                                            info: "Upload failed",
                                            message: error,
                                            trace: stderr,
                                        });
                                    }else{
                                        let cmd_compile = 
                                        res.json({
                                            status: "succes",
                                            info: "Succesfully uploaded the program to the board.",
                                            trace: stdout,
                                            data: "TODO: return hex code as binary code decimal"
                                        });
                                    }
                                }
                            );
                        }
                    }
                );
                
            }
        }
    );
};

// Handle both compile and upload 
exports.run = function (req, res) {
    let code = req.body.code;
    code = '#include <Arduino.h>\n' + code; // Append arduino include
    console.log(code);
    fs.writeFile('./compilation/sketch.cpp', code, (error) => {
        if (error){ 
            res.json({
                status: "error",
                info: "unable to write file",
                message: error,
                trace: '',
            });
        }else{
            console.log("File written sucessfully");
            handleRun(res);
        }

    })
    
};


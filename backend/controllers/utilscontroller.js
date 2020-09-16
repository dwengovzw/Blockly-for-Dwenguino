// This module contains the utils controller responsible for functions like:
// compiling, uploading and error handling

// Module for handling external execution
import childProcess from 'child_process';
const exec = childProcess.exec;
import fs from 'fs';
import path from 'path'

let exports = {};

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
    console.log("handle run");
    let command_path = path.resolve("./compilation/bin/");
    let command_name = command_path + "/make";
    let command_location = path.resolve("./compilation");
    
    if (process.platform ==  "win32"){
        command_name = command_path + "\make.exe"
    }
    console.log(command_name);
    let cmd_clean = exec(command_name + ' -C ' + command_location + ' clean', {timeout: 10000}, 
        (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                console.log("clean failed");
                res.json({
                    status: "error",
                    info: "Clean failed",
                    message: error,
                    trace: stderr,
                });
            }else{
                let cmd_compile = exec(command_name + ' -C ' + command_location, {timeout: 10000}, 
                    (error, stdout, stderr) => {
                        console.log(stdout);
                        console.log(stderr);
                        if (error !== null) {
                            console.log("compile failed");
                            res.json({
                                status: "error",
                                info: "Compilation failed",
                                message: error,
                                trace: stderr,
                            });
                        }else{
                            let cmd_uplaod = exec(command_name + ' -C ' + command_location + ' upload', {timeout: 10000}, 
                                (error, stdout, stderr) => {
                                    console.log(stdout);
                                    console.log(stderr);
                                    if (error !== null) {
                                        console.log("upload failed");
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
    let filename =  path.resolve('./compilation/sketch.cpp');
    console.log(filename);
    fs.writeFile(filename, code, (error) => {
        if (error){ 
            console.log("Error writing file");
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

export default exports;


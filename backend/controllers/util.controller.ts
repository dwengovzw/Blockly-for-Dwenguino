// This module contains the utils controller responsible for functions like:
// compiling, uploading and error handling

// Module for handling external execution
import childProcess from 'child_process';
const exec = childProcess.exec;
import fs from 'fs';
import path from 'path';
import i18n from 'i18n-x';
import url from 'url';
import mkdirp from 'mkdirp';

class UtilController{
    //prefix = "."; // This is only required for debugging default should be .
    static prefix:string = "backend"; // This is only required for debugging default should be .

    static handleExternalCommandOld(command: any, res: any, err_msg: string, succes_msg:string){
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

    static handleExternalCommand(command, errorHandler, successHandler){
        console.log(command);
        let cmd = exec(command, {timeout: 10000}, 
            (error, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);
                if (error !== null) {
                    errorHandler(error, stderr);                
                }else{
                    successHandler(stdout);
                }
            }
        );
    }

    static clean(req, res){
        UtilController.handleExternalCommand('./compilation/bin/make -C ./compilation clean', (error, stderr)=>{
            UtilController.sendErrorMessage(res, "error", "An error occured during clean operation", error, stderr);
        }, (stdout)=>{
            UtilController.sendSuccessMessage(res, "success", "Clean succesful.", stdout, "");
        });
    }

    // Handle compile action
    static compile(req, res) {
        UtilController.handleExternalCommand('./compilation/bin/make -C ./compilation', (error, stderr)=>{
            UtilController.sendErrorMessage(res, "error", "An error occured during compilation", error, stderr);
        }, (stdout)=>{
            UtilController.sendSuccessMessage(res, "success", "Code succesfully compiled.", stdout, "");
        });
    };

    // Handle upload action
    static upload(req, res) {
        UtilController.handleExternalCommand('./compilation/bin/make -C ./compilation upload', (error, stderr)=>{
            UtilController.sendErrorMessage(res, "error", "An error occured during upload", error, stderr);
        }, (stdout)=>{
            UtilController.sendSuccessMessage(res, "success", "Code succesfully uploaded.", stdout, "");
        });
    };

    // Handle the compilation and translation to file compatible with the usb bootloader.
    static getDwenguinoBinary(req, res) {
        let code = req.data["code"];
        console.log(code);
        let objid = UtilController.makeid(20);
        UtilController.saveFileAndRunNext(code, res, objid, UtilController.generateBinary);
    }

    /**
     * Make random id: https://stackoverflow.com/a/1349426/13057688
     */
    static makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }


    /**
     * Cleans previous compiles, compiles the current code file saved on the server, adds signature and returns file for download
     * @param {*} res 
     */
    static generateBinary(res, objid){
        let objdir = "build-" + objid
        let command_path = path.resolve(UtilController.prefix + "/compilation/bin/");
        let make_command = command_path + "/make";
        let command_location = path.resolve(UtilController.prefix + "/compilation");
        let sign_command = path.resolve(UtilController.prefix + "/compilation/signature/package.sh");
        let file_to_sign = path.resolve(UtilController.prefix + "/compilation/sketch-" + objid + "/" + objdir + "/sketch-" + objid + ".elf");
        let signature_file = path.resolve(UtilController.prefix + "/compilation/signature/sig.bin");
        let binary_file = path.resolve(UtilController.prefix + "/compilation/sketch-" + objid + "/" + objdir + "/sketch-" + objid + ".bin");
        let tmp_file = path.resolve(UtilController.prefix + "/compilation/sketch-" + objid + "/" + objdir + "/output-" + objid + ".bin");
        // Copy hardware folder to sketch folder (create first) to enable compilation using makefile
        UtilController.handleExternalCommand("ln -s " + command_location + "/hardware " + command_location +  "/sketch-" + objid + "/ && cp " + command_location + "/Makefile " + command_location +  "/sketch-" + objid + "/", (error, stderr)=>{
            UtilController.cleanupCompile(objid)
            UtilController.sendErrorMessage(res, "error", "An error occured during hardware folder symlink", error, stderr);
        }, (stdout)=>{
            // First try to clean the previous code
            UtilController.handleExternalCommand(make_command + ' -C ' + command_location +  "/sketch-" + objid + " OBJDIR=" + objdir + ' clean', 
            (error, stderr) => {
                // If clean fails, send error message to client.
                UtilController.cleanupCompile(objid)
                UtilController.sendErrorMessage(res, "error", "An error occured during clean operation", error, stderr);
            }, (stdout) => {
                // Clean successful -> compile
                UtilController.handleExternalCommand(make_command + ' -C ' + command_location +  "/sketch-" + objid + " OBJDIR=" + objdir, 
                (error, stderr) => {
                    // If compile fails, send error message to client;
                    UtilController.cleanupCompile(objid)
                    UtilController.sendErrorMessage(res, "error", "An error occured during compilation", error, stderr);
                }, (stdout => {
                    // Compile successful -> add signature
                    UtilController.handleExternalCommand(sign_command + " " + signature_file + " " + file_to_sign + " " + binary_file + " " + tmp_file, 
                    (error, stderr) => {
                        // If sign fails, send error message to client.
                        UtilController.cleanupCompile(objid)
                        UtilController.sendErrorMessage(res, "error", "An error occured during signing", error, stderr);
                    }, (stdout) => {
                        res.download(binary_file, "program.dw", (err) => {
                            // Remove the object folder and sketch.cpp file
                            UtilController.cleanupCompile(objid)
                        });
                    })
                }))
                
            })
        })
        
    }

    static cleanupCompile(objid){
        UtilController.handleExternalCommand("rm -Rf " + UtilController.prefix + "/compilation/sketch-" + objid, 
                            (error, stderr)=>{
                                console.log("Was unable to remove the build directory");
                            }, (stdout)=>{
                                console.log("Build directory successfully removed.");
                            });
    }

    static sendErrorMessage(res, status, info, error, stderr){
        let response = JSON.stringify({
            status: status,
            info: info,
            message: error,
            trace: stderr,
        });
        res.writeHead(200, {
            'Content-Type': "text/plain",
            'Content-disposition': 'attachment;filename=' + "error.log",
            'Content-Length': response.length
        });
        res.end(Buffer.from(response, 'binary'));
    }

    static sendSuccessMessage = function(res, status, info, trace, data){
        res.json({
            status: status,
            info: info,
            trace: trace,
            data: data
        });
    }




    static handleRun = function(res, objid){
        console.log("handle run");
        let command_path = path.resolve("./compilation/bin/");
        let command_name = command_path + "/make";
        let command_location = path.resolve("./compilation");
        
        if (process.platform ==  "win32"){
            command_name = "make"
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

    /**
     * Saves code in the request body to a file.
     * @param {string} code 
     * @param {Callback} errorHandler 
     * @param {Callback} successHandler 
     */
    static saveFile(code, objid, errorHandler, successHandler){
        //code = '#include <Arduino.h>\n' + code; // Append arduino include
        console.log(code);
        let filename =  path.resolve(UtilController.prefix + '/compilation/sketch-' + objid + '/sketch.cpp');
        console.log(filename);

        mkdirp(path.dirname(filename), (err)=>{
            if (err){
                errorHandler(err) // Error if unable to create directory structure
                return
            } 
            fs.writeFile(filename, code, (error) => {
                if (error){ 
                    errorHandler(error);
                }else{
                    console.log("File written sucessfully");
                    successHandler();
                }
            })
        })
    }



    /**
     * Saves the code in the request to a file and executes the next action with res as parameter
     * @param {*} req 
     * @param {*} res 
     * @param {Callback} next 
     */
    static saveFileAndRunNext(code, res, objid, next){
        UtilController.saveFile(code, objid, (error)=>{
            console.log("Error writing file");
            UtilController.sendErrorMessage(res, "error", "Unable to wirte file", error, "");
        }, ()=>{
            next(res, objid);
        }); 
    }

    // Handle both compile and upload 
    static run(req, res) {
        UtilController.saveFileAndRunNext(req.body.code, res, "", UtilController.handleRun);
    };

    static getEnvironment(req, res){
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, HEAD');
        let environment = process.env.NODE_ENV;
        console.log(environment);
        res.send(environment);
    };

    /**
     * Sets the preferred language of the user as a language cookie, used for email communication.
     * The language should be included as a two-letter country code. This request should be made every
     * time the user changes the language in the frontend application.
     * @param {*} req 
     * @param {*} res 
     */
    static setLanguage(req, res) {
        const { 
            lang
        } = req.body;

        let errors:object[] = [];

        if (!lang) {
            errors.push({msg: "no-lang-included"});
        }

        if (errors.length > 0) {
            res.status(401).send(errors);
        } else {
            res.cookie('lang', lang, { maxAge: 900000, httpOnly: true });
            res.status(200).send(lang);    
        }
        res.status(200);
    };

}

export default UtilController;


// This module contains the utils controller responsible for functions like:
// compiling, uploading and error handling

// Module for handling external execution
import childProcess from 'child_process';
const exec = childProcess.exec;
import fs from 'fs';
import path from 'path';
import { mkdirp } from 'mkdirp'

class UtilController{
    //prefix = "."; // This is only required for debugging default should be .
    static prefix:string = "backend"; // This is only required for debugging default should be .
    static compilationFolder:string = "compilation";
    static sketchPrefix:string = "sketch-";
    static deployedOS:string = process.env.DEPLOYED_OS || "linux";

  
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

    static handleExternalCommandWithEnv(command, env, errorHandler, successHandler){
        console.log(command);
        console.log("Environment:", env);
        let cmd = exec(command, {timeout: 10000, env: env}, 
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

    // Handle the compilation and translation to file compatible with the usb bootloader.
    static getDwenguinoBinary(req, res) {
        let code = req.data["code"];
        console.log(code);
        let objid = UtilController.makeid(20);
        UtilController.saveFileAndRunNext(code, res, objid, "sketch.cpp", UtilController.generateBinaryDwenguino);
    }

    // Handle the compilation for Halberd board and translation to file compatible with the UF2 bootloader.
    static getHalberdBinary(req, res) {
        let code = req.data["code"];
        console.log(code);
        let objid = UtilController.makeid(20);
        UtilController.saveFileAndRunNext(code, res, objid, "sketch-" + objid + ".ino", UtilController.generateBinaryHalberd);
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
     * Saves code in the request body to a file.
     * @param {string} code 
     * @param {Callback} errorHandler 
     * @param {Callback} successHandler 
     */
    static saveFile(code, objid, filename, errorHandler, successHandler){
        //code = '#include <Arduino.h>\n' + code; // Append arduino include
        console.log(code);
        let filename_absolute =  path.resolve(UtilController.prefix + '/' + UtilController.compilationFolder + '/sketch-' + objid + '/' + filename);
        console.log(filename_absolute);

        mkdirp(path.dirname(filename_absolute)).then(() => {
            fs.writeFile(filename_absolute, code, (error) => {
                if (error){ 
                    errorHandler(error);
                }else{
                    console.log("File written sucessfully");
                    successHandler();
                }
            })
        }).catch((err)=>{
            if (err){
                errorHandler(err) // Error if unable to create directory structure
                return
            }
        });  
    }



    /**
     * Saves the code in the request to a file and executes the next action with res as parameter
     * @param {*} req 
     * @param {*} res 
     * @param {Callback} next 
     */
    static saveFileAndRunNext(code, res, objid, filename, next){
        UtilController.saveFile(code, objid, filename, (error)=>{
            console.log("Error writing file");
            UtilController.sendErrorMessage(res, "error", "Unable to wirte file", error, "");
        }, ()=>{
            next(res, objid);
        }); 
    }


    static generateBinaryHalberd(res, objid){
        let objdir = "build-" + objid
        let command_path = path.resolve(UtilController.prefix + "/" + UtilController.compilationFolder + "/bin/" + UtilController.deployedOS + "/");
        let compile_command = command_path + "/arduino-cli";
        let uf2_command = path.resolve(UtilController.prefix + "/" + UtilController.compilationFolder + "/bin/" + UtilController.deployedOS + "/uf2conv.py");
        let command_location = path.resolve(UtilController.prefix + "/" + UtilController.compilationFolder);
        let binary_file = path.resolve(UtilController.prefix + "/" + UtilController.compilationFolder + "/" + UtilController.sketchPrefix + objid + "/" + objdir + "/" + UtilController.sketchPrefix + objid + ".ino.hex");
        let uf2_file = path.resolve(UtilController.prefix + "/" + UtilController.compilationFolder + "/" + UtilController.sketchPrefix + objid + "/" + objdir + "/" + UtilController.sketchPrefix + objid + ".uf2");
        // Create a temporary sketch folder and copy hardware folder
        UtilController.handleExternalCommand("ln -s " + command_location + "/hardware " + command_location +  "/sketch-" + objid + "/", (
            error, stderr)=>{
                UtilController.cleanupCompile(objid)
                UtilController.sendErrorMessage(res, "error", "An error occured during hardware folder symlink", error, stderr);
            }, 
            (stdout)=>{
                // First try to compile the code with ARDUINO_DIRECTORIES_USER pointing to our hardware folder
                let env = Object.assign({}, process.env, { ARDUINO_DIRECTORIES_USER: command_location + "/sketch-" + objid });
                let compile_cmd = compile_command + ' compile --fqbn dwengo:nrf52:halberd ' + command_location +  "/sketch-" + objid + " --build-path " + command_location + "/sketch-" + objid + "/" + objdir;
                UtilController.handleExternalCommandWithEnv(compile_cmd, env, 
                    (error, stderr) => {
                        // If compile fails, send error message to client.
                        UtilController.cleanupCompile(objid)
                        UtilController.sendErrorMessage(res, "error", "An error occured during compilation", error, stderr);
                    }, stdout => {
                        // When the code is compiled, convert to uf2
                        UtilController.handleExternalCommand("python3 " + uf2_command + " " + binary_file + " -f 0xada52840 --convert --output " + uf2_file,
                            (error, stderr) => {
                                // If uf2 conversion fails, send error message to client.
                                UtilController.cleanupCompile(objid)
                                UtilController.sendErrorMessage(res, "error", "An error occured during UF2 conversion", error, stderr);
                            }, (stdout) => {
                                res.download(uf2_file, "program.uf2", (err) => {
                                    // Remove the object folder and sketch.cpp file
                                    UtilController.cleanupCompile(objid)
                                });
                            }
                        );
                    }
                );
            }  // If compile fails, send error message to client;
        )

    }
    /**
     * Cleans previous compiles, compiles the current code file saved on the server, adds signature and returns file for download
     * @param {*} res 
     */
    static generateBinaryDwenguino(res, objid){
        let objdir = "build-" + objid
        let command_path = path.resolve(UtilController.prefix + "/" + UtilController.compilationFolder + "/bin/" + UtilController.deployedOS + "/");
        let compile_command = command_path + "/make";
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
            UtilController.handleExternalCommand(compile_command + ' -C ' + command_location +  "/sketch-" + objid + " OBJDIR=" + objdir + ' clean', 
            (error, stderr) => {
                // If clean fails, send error message to client.
                UtilController.cleanupCompile(objid)
                UtilController.sendErrorMessage(res, "error", "An error occured during clean operation", error, stderr);
            }, (stdout) => {
                // Clean successful -> compile
                UtilController.handleExternalCommand(compile_command + ' -C ' + command_location +  "/sketch-" + objid + " OBJDIR=" + objdir, 
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
        UtilController.handleExternalCommand("rm -Rf " + UtilController.prefix + "/" + UtilController.compilationFolder + "/sketch-" + objid, 
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


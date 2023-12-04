// Filename: api-routes.js
// Initialize express router
import express from 'express';
import querystring from "querystring"
let router = express.Router();

//xml parser
import parser from "fast-xml-parser"

//Configure cors middleware for the run route to allow all requests
import cors from 'cors';

//app.use(cors());
let corsOptions = {
    origin: "*",
};


let processStartBlocks = ({startblock_xml, res, view="index.ejs", savedProgramUUID="", hidebutton=false, editorState=null, includeEmptyProgram=false, loggedIn=false}) => {
    let blocks_xml = querystring.unescape(startblock_xml);
    if (!blocks_xml && includeEmptyProgram){
        blocks_xml = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="setup_loop_structure"></block></xml>'
    }

    blocks_xml = blocks_xml.trim()  // remove whitespace
    res.render(view, {
        blocks_xml: blocks_xml, 
        base_url: process.env.SERVER_URL, 
        form_target: process.env.SERVER_URL + "/simulator",
        savedProgramUUID: savedProgramUUID,
        hidebutton: hidebutton,
        loggedIn: loggedIn,
        editorState: editorState ? JSON.stringify(editorState) : "''"
    });
}

let handleSimulatorRequest = ({blocks_xml, res, view="index.ejs", hidebutton=false}) => {
    processStartBlocks({
        startblock_xml: blocks_xml || "", 
        res: res, 
        view: view,
        hidebutton: hidebutton,
        loggedIn: res.loggedIn
    });
}



// load the application
router.get("/simulator", [checkIfUserIsLoggedIn], function(req, res) {
    let blocks_xml = req.query.xml;
    handleSimulatorRequest({blocks_xml: blocks_xml, res: res});
})

// load the application with a program from xml
router.post("/simulator", [checkIfUserIsLoggedIn], function(req, res) {
    let blocks_xml = req.body.xml;
    handleSimulatorRequest({blocks_xml: blocks_xml, res: res});
})

router.post("/openTextualProgram", function(req, res) {
    try {
        let requestBody = JSON.parse(req.body.state);
        let editorState;
        if (requestBody.code){
            editorState = {
                view: "text",
                cppCode: [{cppCode: requestBody.code, filename: requestBody.filename || "program.cpp"}],
                blocklyXml: "",
            }
            return processStartBlocks({startblock_xml: "", res: res, editorState: editorState});
        }
        return res.status(500).send({message: "No code provided"});
    } catch (e){
        return res.status(500).send({message: "Unable to parse request body"});
    }
})

// load the application
router.get("/", [checkIfUserIsLoggedIn], function(req, res) {
    let blocks_xml = req.query.xml;
    handleSimulatorRequest({blocks_xml: blocks_xml, res: res});
})

// load the application with a program from xml
router.post("/", [checkIfUserIsLoggedIn], function(req, res) {
    let blocks_xml = req.body.xml;
    handleSimulatorRequest({blocks_xml: blocks_xml, res: res});
})


// load the application
router.get("/readonly", function(req, res) {
    let blocks_xml = req.query.xml;
    handleSimulatorRequest({blocks_xml: blocks_xml, res: res, view: "readonly.ejs"});
})

// load the application with a program from xml
router.post("/readonly", function(req, res) {
    let blocks_xml = req.body.xml;
    handleSimulatorRequest({blocks_xml: blocks_xml, res: res, view: "readonly.ejs"});
})


// load the application
router.get("/portfolioitem", function(req, res) {
    let blocks_xml = req.query.xml;
    handleSimulatorRequest({blocks_xml: blocks_xml, res: res, view: "readonly.ejs", hidebutton: true});
})

// load the application with a program from xml
router.post("/portfolioitem", function(req, res) {
    let blocks_xml = req.body.xml;
    handleSimulatorRequest({blocks_xml: blocks_xml, res: res, view: "readonly.ejs", hidebutton: true});
})



router.get("/editor", function(req, res) {
    res.render("editor.ejs", {
        base_url: process.env.SERVER_URL, 
        form_target: process.env.SERVER_URL + "/editor"
    });
})


// Import contact controller

import UtilController from '../controllers/util.controller.js';

router.route('/lang')
    .post(UtilController.setLanguage);


/* Data collection */
import { loggingRouter } from "./logging-routes.js"
router.use("/logging", loggingRouter);

/* Dwenguino microcontroller */   
import { utilitiesRouter } from "./utilities-router.js"
import { checkIfUserIsLoggedIn } from '../middleware/authJwt.js';
router.use("/utilities", utilitiesRouter);






// Export API routes
export default router;

export { processStartBlocks }
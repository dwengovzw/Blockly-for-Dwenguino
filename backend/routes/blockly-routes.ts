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


let processStartBlocks = ({startblock_xml, res, view="index.ejs", savedProgramUUID="", hidebutton=false}) => {
    let blocks_xml = querystring.unescape(startblock_xml);
    if (!blocks_xml){
        blocks_xml = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="setup_loop_structure"></block></xml>'
    }

    blocks_xml = blocks_xml.trim()  // remove whitespace
    res.render(view, {
        blocks_xml: blocks_xml, 
        base_url: process.env.SERVER_URL, 
        form_target: process.env.SERVER_URL + "/simulator",
        savedProgramUUID: savedProgramUUID,
        hidebutton: hidebutton
    });
}

let handleSimulatorRequest = (blocks_xml, res, view="index.ejs", hidebutton=false) => {
    if (blocks_xml && blocks_xml !== ""){
        processStartBlocks({
            startblock_xml: blocks_xml, 
            res: res, 
            view: view,
            hidebutton: hidebutton
        });
    }else{
        let empty_program_xml = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="setup_loop_structure"></block></xml>';
        res.render(view, {
            blocks_xml: empty_program_xml, 
            base_url: process.env.SERVER_URL, 
            form_target: process.env.SERVER_URL + "/simulator",
            hidebutton: hidebutton
        });
    }
}

// load the application
router.get("/simulator", function(req, res) {
    let blocks_xml = req.query.xml;
    handleSimulatorRequest(blocks_xml, res);
})

// load the application with a program from xml
router.post("/simulator", function(req, res) {
    let blocks_xml = req.body.xml;
    handleSimulatorRequest(blocks_xml, res);
})

// load the application
router.get("/", function(req, res) {
    let blocks_xml = req.query.xml;
    handleSimulatorRequest(blocks_xml, res);
})

// load the application with a program from xml
router.post("/", function(req, res) {
    let blocks_xml = req.body.xml;
    handleSimulatorRequest(blocks_xml, res);
})


// load the application
router.get("/readonly", function(req, res) {
    let blocks_xml = req.query.xml;
    handleSimulatorRequest(blocks_xml, res, "readonly.ejs");
})

// load the application with a program from xml
router.post("/readonly", function(req, res) {
    let blocks_xml = req.body.xml;
    handleSimulatorRequest(blocks_xml, res, "readonly.ejs");
})


// load the application
router.get("/socialrobotreadonly", function(req, res) {
    let robot_xml = req.query.xml;
    robot_xml = querystring.unescape(robot_xml as string);

    robot_xml = robot_xml.trim()  // remove whitespace
    res.render("socialroboteditor.ejs", {
        robot_xml: robot_xml, 
        base_url: process.env.SERVER_URL, 
        form_target: process.env.SERVER_URL + "/simulator"
    });
})

// load the application with a program from xml
router.post("/socialrobotreadonly", function(req, res) {
    let robot_xml = req.body.xml;
    robot_xml = querystring.unescape(robot_xml);

    robot_xml = robot_xml.trim()  // remove whitespace
    res.render("socialroboteditor.ejs", {
        robot_xml: robot_xml, 
        base_url: process.env.SERVER_URL, 
        form_target: process.env.SERVER_URL + "/simulator"
    });
})

// load the application
router.get("/portfolioitem", function(req, res) {
    let blocks_xml = req.query.xml;
    handleSimulatorRequest(blocks_xml, res,"readonly.ejs", true);
})

// load the application with a program from xml
router.post("/portfolioitem", function(req, res) {
    let blocks_xml = req.body.xml;
    handleSimulatorRequest(blocks_xml, res, "readonly.ejs", true);
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
router.use("/utilities", utilitiesRouter);






// Export API routes
export default router;

export { processStartBlocks }
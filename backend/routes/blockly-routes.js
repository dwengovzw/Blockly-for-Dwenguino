// Filename: api-routes.js
// Initialize express router
import express from 'express';
import querystring from "querystring"
let router = express.Router();

//xml parser
import parser from "fast-xml-parser"


// // Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'The system is working!',
        message: 'To the moon and back.'
    });
});

let processStartBlocks = (startblock_xml, res, view="index.ejs") => {
    let blocks_xml = querystring.unescape(startblock_xml);
    if (!blocks_xml){
        blocks_xml = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="setup_loop_structure"></block></xml>'
    }

    blocks_xml = blocks_xml.trim()  // remove whitespace
    //let striptagregex = /^<xml xmlns="https:\/\/developers.google.com\/blockly\/xml">(.*)<\/xml>$/
    //let blocks_xml_stripped = blocks_xml.match(striptagregex)[1]
    res.render(view, {blocks_xml: blocks_xml, form_target: process.env.SERVER_URL + "simulator"});
}

let handleSimulatorRequest = (blocks_xml, res, view="index.ejs") => {
    if (blocks_xml && blocks_xml !== ""){
        processStartBlocks(blocks_xml, res, view);
    }else{
        let empty_program_xml = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="setup_loop_structure"></block></xml>';
        res.render(view, {blocks_xml: empty_program_xml, form_target: process.env.SERVER_URL + "simulator"});
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
router.get("/readonly", function(req, res) {
    let blocks_xml = req.query.xml;
    handleSimulatorRequest(blocks_xml, res, "readonly.ejs");
})

// load the application with a program from xml
router.post("/readonly", function(req, res) {
    let blocks_xml = req.body.xml;
    handleSimulatorRequest(blocks_xml, res, "readonly.ejs");
})


// Import contact controller

import utilscontroller from '../controllers/util.controller.js';

router.route('/lang')
    .post(utilscontroller.setLanguage);


/* Data collection */
import { loggingRouter } from "../routes/logging-routes.js"
router.use("/logging", loggingRouter);

/* Dwenguino microcontroller */   
import { utilitiesRouter } from "../routes/utilities-router.js"
router.use("/utilities", utilitiesRouter);






// Export API routes
export default router;
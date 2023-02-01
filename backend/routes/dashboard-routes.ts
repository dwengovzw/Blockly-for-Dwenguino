// Filename: api-routes.js
// Initialize express router
import express from 'express';
import path from "path"
let dashboardRouter = express.Router();

// // Set default API response
dashboardRouter.get('/', function (req, res) {
    res.render("dashboard.ejs", {base_url: process.env.SERVER_URL});
});


dashboardRouter.use('/assets', express.static(path.resolve("Blockly-for-Dwenguino", "dashboards", "assets" )))



export default dashboardRouter;

// Filename: api-routes.js
// Initialize express router
import express from 'express';
import path from "path"
let dashboardRouter = express.Router();


// Route /assets to static files
dashboardRouter.use('/assets', express.static(path.resolve("Blockly-for-Dwenguino", "dashboards", "assets" )))


// Route all other requests to dashboard.ejs => The frontend router handles routing on this page
dashboardRouter.get('(/*)?', function (req, res) {
    res.render("dashboard.ejs", {base_url: process.env.SERVER_URL});
});







export default dashboardRouter;

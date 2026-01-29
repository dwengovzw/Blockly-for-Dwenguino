// Filename: api-routes.js
// Initialize express router
import express from 'express';
import path from "path"
let dashboardRouter = express.Router();


// Route /assets to static files
dashboardRouter.use('/assets', express.static(path.resolve("Blockly-for-Dwenguino", "dashboards", "assets" )))


dashboardRouter.get(":splat(*)", (req, res) => {
  // req.params.rest contains the path
  res.render("dashboard.ejs", {
    base_url: process.env.SERVER_URL,
  });
});



export default dashboardRouter;

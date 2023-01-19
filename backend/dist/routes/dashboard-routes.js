// Filename: api-routes.js
// Initialize express router
import express from 'express';
let dashboardRouter = express.Router();
// // Set default API response
dashboardRouter.get('/', function (req, res) {
    res.render("dashboard.ejs", {});
});
export default dashboardRouter;
//# sourceMappingURL=dashboard-routes.js.map
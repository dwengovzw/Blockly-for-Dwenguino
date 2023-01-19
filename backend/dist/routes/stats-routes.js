import express from 'express';
let router = express.Router();
router.get("/", (req, res) => {
    res.render("../backend/views/stats.ejs", { testData: "testData" });
});
router.get("/event/:eventType");
export default router;
//# sourceMappingURL=stats-routes.js.map
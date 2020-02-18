const express = require("express");

const AnalyticController = require("../controllers/analytic");

//const authCheck = require("../middleware/check-auth");

const router = express.Router();

router.post("/createVisit", AnalyticController.createVisit);
router.get("/allVisits", AnalyticController.allVisits);
router.get("/getRechargesSomme", AnalyticController.getRechargesSomme);
router.get("/getProductType", AnalyticController.getProductType);

router.get("/get5TopProductViewed", AnalyticController.get5TopProductViewed);




module.exports = router;

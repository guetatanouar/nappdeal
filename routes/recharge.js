const express = require("express");

const RechargeController = require("../controllers/recharge");

const authCheck = require("../middleware/check-auth");

const router = express.Router();

router.post("/createRecharge",RechargeController.createRecharge);
router.get("/getRecharges", RechargeController.getAllRecharges);

router.post('/deleteRechargeById/:id',RechargeController.deleteRechargeById);

module.exports = router;
